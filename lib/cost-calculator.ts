import {
  HealthcarePlan,
  FamilyComposition,
  HealthProfile,
  PremiumCalculation,
  HSACalculation,
  MedicalCostBreakdown,
  CostCalculation,
  PlanComparison,
  EMPLOYER_CONTRIBUTION,
  ESTIMATED_COSTS,
  enrichFamilyComposition,
} from './types';
import { getAllPlans, getPlanById } from './plans';

// ============================================================================
// PREMIUM CALCULATION
// ============================================================================

/**
 * Calculate the premium costs for a plan based on family composition
 */
export function calculatePremiumCost(
  plan: HealthcarePlan,
  familyComposition: FamilyComposition
): PremiumCalculation {
  const enriched = enrichFamilyComposition(familyComposition);

  // Calculate gross monthly costs per person type
  const grossEmployeeCost = plan.monthlyRates.employee;
  const grossSpouseCost = plan.monthlyRates.dependent21Plus * familyComposition.numSpouses;
  const grossChildren0to18Cost = plan.monthlyRates.child0to18 * familyComposition.numChildren0to18;
  const grossChildren19to20Cost = plan.monthlyRates.child19to20 * familyComposition.numChildren19to20;

  const grossChildrenCost = grossChildren0to18Cost + grossChildren19to20Cost;
  const grossTotalMonthly = grossEmployeeCost + grossSpouseCost + grossChildrenCost;

  // Calculate employer premium contribution
  // $554.15 for employee + $443.32 per dependent
  const employerPremiumContribution =
    EMPLOYER_CONTRIBUTION.EMPLOYEE_BASE +
    EMPLOYER_CONTRIBUTION.PER_DEPENDENT * enriched.totalDependents;

  // Calculate what employee actually pays
  const employeeMonthlyPremium = Math.max(0, grossTotalMonthly - employerPremiumContribution);
  const employeeAnnualPremium = employeeMonthlyPremium * 12;

  return {
    planId: plan.planId,
    grossEmployeeCost,
    grossSpouseCost,
    grossChildrenCost,
    grossTotalMonthly,
    employerPremiumContribution,
    employeeMonthlyPremium,
    employeeAnnualPremium,
  };
}

// ============================================================================
// HSA CALCULATION
// ============================================================================

/**
 * Calculate HSA contribution if plan is HSA-eligible
 */
export function calculateHSAContribution(
  plan: HealthcarePlan,
  familyComposition: FamilyComposition
): HSACalculation {
  if (!plan.isHSA || !plan.hsaContribution) {
    return {
      isHSAPlan: false,
      monthlyHSAContribution: 0,
      annualHSAContribution: 0,
    };
  }

  const enriched = enrichFamilyComposition(familyComposition);
  const monthlyHSAContribution = enriched.hasFamily
    ? plan.hsaContribution.withDependents
    : plan.hsaContribution.employeeOnly;

  return {
    isHSAPlan: true,
    monthlyHSAContribution,
    annualHSAContribution: monthlyHSAContribution * 12,
  };
}

// ============================================================================
// MEDICAL COST ESTIMATION
// ============================================================================

/**
 * Calculate the cost of a service based on copay or coinsurance
 */
function calculateServiceCost(
  serviceCost: { copay?: { amount: number; deductibleWaived: boolean }; coinsurance?: { percentage: number; deductibleApplies: boolean } },
  numVisits: number,
  baseServiceCost: number = 100,
  deductibleMet: boolean = false
): number {
  if (numVisits === 0) return 0;

  // If there's a copay
  if (serviceCost.copay) {
    // If deductible waived, just pay the copay
    if (serviceCost.copay.deductibleWaived || deductibleMet) {
      return serviceCost.copay.amount * numVisits;
    }
    // Otherwise, might need to pay full cost until deductible met
    // For simplicity, assume copay after deductible
    return serviceCost.copay.amount * numVisits;
  }

  // If there's coinsurance
  if (serviceCost.coinsurance) {
    const costPerVisit = baseServiceCost * (serviceCost.coinsurance.percentage / 100);
    return costPerVisit * numVisits;
  }

  return 0;
}

/**
 * Calculate prescription costs
 */
function calculatePrescriptionCosts(
  plan: HealthcarePlan,
  medications: HealthProfile['regularMedications']
): number {
  let monthlyCost = 0;

  for (const med of medications) {
    const rxCost = plan.prescriptions[med.type];
    let costPerFill = 0;

    if (rxCost.copay) {
      costPerFill = rxCost.copay.amount;
    } else if (rxCost.coinsurance) {
      // Estimate average medication cost based on type
      const baseMedCosts = {
        preferredGeneric: 20,
        generic: 40,
        preferredBrand: 200,
        brand: 400,
        specialty: 1000,
      };
      costPerFill = baseMedCosts[med.type] * (rxCost.coinsurance.percentage / 100);
    }

    // Calculate monthly cost based on frequency
    const fillsPerMonth = {
      daily: 1, // Monthly refill
      weekly: 1,
      monthly: 1,
      asNeeded: 0.5, // Estimate 0.5 fills per month
    }[med.frequency];

    monthlyCost += costPerFill * fillsPerMonth;
  }

  return monthlyCost * 12; // Annual cost
}

/**
 * Estimate medical costs based on health profile
 */
export function estimateMedicalCosts(
  plan: HealthcarePlan,
  healthProfile: HealthProfile,
  familyComposition: FamilyComposition
): MedicalCostBreakdown {
  const enriched = enrichFamilyComposition(familyComposition);

  // Primary care visits
  const primaryCareVisits = calculateServiceCost(
    plan.primaryCare,
    healthProfile.annualDoctorVisits,
    150 // Average primary care visit cost
  );

  // Specialist visits
  const specialistVisits = calculateServiceCost(
    plan.specialist,
    healthProfile.annualSpecialistVisits,
    250 // Average specialist visit cost
  );

  // Emergency room visits
  const emergencyRoomVisits = healthProfile.annualERVisits * (
    (plan.emergencyRoom.copay?.amount || 0) +
    (ESTIMATED_COSTS.ER_VISIT_BASE * ((plan.emergencyRoom.coinsurance?.percentage || 0) / 100))
  );

  // Urgent care visits
  const urgentCareVisits = calculateServiceCost(
    plan.urgentCare,
    healthProfile.annualUrgentCareVisits,
    200 // Average urgent care visit cost
  );

  // Lab work
  const labWork = calculateServiceCost(
    plan.labWork,
    healthProfile.annualLabVisits || Math.max(2, healthProfile.chronicConditions.length * 2),
    ESTIMATED_COSTS.LAB_WORK_AVERAGE
  );

  // Imaging (estimate 1 per year for moderate health, more for chronic conditions)
  const imagingVisits = healthProfile.chronicConditions.length > 0 ? 2 : 0.5;
  const imaging = calculateServiceCost(
    plan.imaging,
    imagingVisits,
    ESTIMATED_COSTS.IMAGING_AVERAGE
  );

  // Prescriptions
  const prescriptions = calculatePrescriptionCosts(plan, healthProfile.regularMedications);

  // Chronic condition management (additional costs)
  const chronicConditionManagement =
    healthProfile.chronicConditions.length * ESTIMATED_COSTS.CHRONIC_CONDITION_ANNUAL;

  // Pregnancy costs
  const pregnancyCosts = healthProfile.isPlanningPregnancy
    ? ESTIMATED_COSTS.PREGNANCY_ANNUAL
    : 0;

  // Subtotal
  const subtotal =
    primaryCareVisits +
    specialistVisits +
    emergencyRoomVisits +
    urgentCareVisits +
    labWork +
    imaging +
    prescriptions +
    chronicConditionManagement +
    pregnancyCosts;

  // Cap at out-of-pocket maximum
  const oopMax = enriched.hasFamily
    ? plan.outOfPocketMax.family
    : plan.outOfPocketMax.individual;

  const cappedAtOOPMax = oopMax;
  const finalMedicalCosts = Math.min(subtotal, oopMax);

  return {
    primaryCareVisits,
    specialistVisits,
    emergencyRoomVisits,
    urgentCareVisits,
    labWork,
    imaging,
    prescriptions,
    chronicConditionManagement,
    pregnancyCosts,
    subtotal,
    cappedAtOOPMax,
    finalMedicalCosts,
  };
}

// ============================================================================
// TOTAL COST CALCULATION
// ============================================================================

/**
 * Calculate total annual cost for a plan
 */
export function calculateTotalAnnualCost(
  plan: HealthcarePlan,
  familyComposition: FamilyComposition,
  healthProfile: HealthProfile
): CostCalculation {
  const premium = calculatePremiumCost(plan, familyComposition);
  const hsa = calculateHSAContribution(plan, familyComposition);
  const medicalCosts = estimateMedicalCosts(plan, healthProfile, familyComposition);

  const totalAnnualCost = premium.employeeAnnualPremium + medicalCosts.finalMedicalCosts;

  // Net monthly premium (after HSA) - for reference only, not displayed as main premium
  const netMonthlyPremium = premium.employeeMonthlyPremium - hsa.monthlyHSAContribution;

  return {
    planId: plan.planId,
    planName: plan.planName,
    premium,
    hsa,
    medicalCosts,
    totalAnnualCost,
    netMonthlyPremium,
    monthlyPremiumDisplay: premium.employeeMonthlyPremium, // Actual premium paid
  };
}

// ============================================================================
// COMPARE ALL PLANS
// ============================================================================

/**
 * Calculate costs for all plans and return sorted comparison
 */
export function compareAllPlans(
  familyComposition: FamilyComposition,
  healthProfile: HealthProfile
): CostCalculation[] {
  const allPlans = getAllPlans();
  const calculations: CostCalculation[] = [];

  for (const plan of allPlans) {
    const calculation = calculateTotalAnnualCost(plan, familyComposition, healthProfile);
    calculations.push(calculation);
  }

  // Sort by total annual cost (lowest first)
  return calculations.sort((a, b) => a.totalAnnualCost - b.totalAnnualCost);
}

// ============================================================================
// RECOMMENDATION LOGIC
// ============================================================================

/**
 * Generate plan recommendation with reasoning
 */
export function generateRecommendation(
  familyComposition: FamilyComposition,
  healthProfile: HealthProfile,
  preferences?: {
    hsaInterested?: boolean;
    prioritizeLowPremium?: boolean;
    prioritizeLowDeductible?: boolean;
  }
): PlanComparison {
  const sortedPlans = compareAllPlans(familyComposition, healthProfile);

  // Default to lowest total cost
  let recommendedPlan = sortedPlans[0];
  let reasoning = '';

  // Analyze health situation
  const hasChronicConditions = healthProfile.chronicConditions.length > 0;
  const isPlanningPregnancy = healthProfile.isPlanningPregnancy;
  const isHighUsage =
    healthProfile.annualDoctorVisits > 8 ||
    healthProfile.annualSpecialistVisits > 4 ||
    healthProfile.annualERVisits > 0;
  const isLowUsage =
    healthProfile.annualDoctorVisits <= 3 &&
    healthProfile.annualSpecialistVisits <= 1 &&
    healthProfile.annualERVisits === 0 &&
    healthProfile.chronicConditions.length === 0;

  const enriched = enrichFamilyComposition(familyComposition);

  // Decision logic
  if (isPlanningPregnancy) {
    // Pregnancy = Gold plan with low deductible
    const goldPlans = sortedPlans.filter(p => {
      const plan = getPlanById(p.planId);
      return plan?.tier === 'Gold';
    });
    recommendedPlan = goldPlans[0] || sortedPlans[0];
    reasoning = `With pregnancy planned, I recommend ${recommendedPlan.planName} because:
• Pregnancy typically costs $6,000-10,000, so you'll benefit from a lower deductible and out-of-pocket maximum
• ${getPlanById(recommendedPlan.planId)?.type === 'PPO' ? 'Predictable copays make budgeting easier during pregnancy' : 'Lower coinsurance rates reduce your costs'}
• The higher premium is offset by much lower out-of-pocket costs for prenatal care and delivery`;
  } else if (hasChronicConditions || isHighUsage) {
    // High usage = Gold plan
    const goldPlans = sortedPlans.filter(p => {
      const plan = getPlanById(p.planId);
      return plan?.tier === 'Gold';
    });
    recommendedPlan = goldPlans[0] || sortedPlans[0];
    reasoning = `With ${hasChronicConditions ? 'chronic conditions' : 'high expected usage'}, I recommend ${recommendedPlan.planName} because:
• Lower deductible means coverage kicks in sooner
• ${getPlanById(recommendedPlan.planId)?.type === 'PPO' ? 'Predictable copays for frequent visits' : 'Lower coinsurance percentages'}
• Out-of-pocket maximum provides strong financial protection
• Total annual cost is competitive when factoring in high medical usage`;
  } else if (isLowUsage) {
    // Healthy + low usage = lowest total cost, with HSA bonus if close
    const lowestCostPlan = sortedPlans[0];
    const hsaPlans = sortedPlans.filter(p => {
      const plan = getPlanById(p.planId);
      return plan?.isHSA;
    });

    // Only prefer HSA if it's within $500 of the absolute lowest cost
    const lowestHSAPlan = hsaPlans[0];
    if (lowestHSAPlan && lowestHSAPlan.totalAnnualCost - lowestCostPlan.totalAnnualCost <= 500 && preferences?.hsaInterested !== false) {
      recommendedPlan = lowestHSAPlan;
      const hsaContribution = recommendedPlan.hsa.annualHSAContribution;
      reasoning = `Since you're healthy with low expected usage, I recommend ${recommendedPlan.planName} because:
• Company contributes $${hsaContribution}/year directly into YOUR HSA account
• This is free money that rolls over year to year
• HSA contributions are pre-tax, saving you even more
• Only $${(recommendedPlan.totalAnnualCost - lowestCostPlan.totalAnnualCost).toFixed(0)} more than the lowest-cost plan
• You're building a tax-free medical savings account for the future`;
    } else {
      // Lowest cost wins
      recommendedPlan = lowestCostPlan;
      const plan = getPlanById(recommendedPlan.planId);
      reasoning = `Since you're healthy with low expected usage, I recommend ${recommendedPlan.planName} because:
• Lowest total annual cost at just $${recommendedPlan.totalAnnualCost.toFixed(0)}/year
• ${plan?.isHSA ? `Includes $${recommendedPlan.hsa.annualHSAContribution}/year company HSA contribution` : 'Premium is fully covered by your employer'}
• Minimal medical costs expected with your excellent health
• Best value for your situation`;
    }
  } else {
    // Default to lowest total cost
    const plan = getPlanById(recommendedPlan.planId);
    reasoning = `Based on your situation, I recommend ${recommendedPlan.planName} because:
• Lowest total annual cost at $${recommendedPlan.totalAnnualCost.toFixed(0)}
• ${plan?.isHSA ? `Includes $${recommendedPlan.hsa.annualHSAContribution}/year company HSA contribution` : 'Balanced premium and coverage'}
• ${enriched.hasFamily ? 'Good coverage for your family' : 'Great value for individual coverage'}
• Matches your expected healthcare usage`;
  }

  return {
    plans: sortedPlans,
    recommendedPlanId: recommendedPlan.planId,
    reasoning,
    sortedByTotalCost: sortedPlans,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Format currency without cents for large amounts
 */
export function formatCurrencyWhole(amount: number): string {
  return `$${Math.round(amount).toLocaleString()}`;
}

/**
 * Calculate savings between two plans
 */
export function calculateSavings(planA: CostCalculation, planB: CostCalculation): number {
  return planB.totalAnnualCost - planA.totalAnnualCost;
}

/**
 * Get a summary of a cost calculation
 */
export function getCostSummary(calc: CostCalculation): string {
  const hsaInfo = calc.hsa.isHSAPlan
    ? ` + $${calc.hsa.annualHSAContribution}/year HSA contribution`
    : '';

  return `
${calc.planName}
Monthly Premium: $${calc.premium.employeeMonthlyPremium.toFixed(2)}${hsaInfo}
Estimated Medical Costs: $${calc.medicalCosts.finalMedicalCosts.toFixed(0)}/year
Total Annual Cost: $${calc.totalAnnualCost.toFixed(0)}
  `.trim();
}
