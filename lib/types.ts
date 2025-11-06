import { z } from 'zod';

// ============================================================================
// PLAN STRUCTURES
// ============================================================================

export interface MonthlyRates {
  employee: number;
  dependent21Plus: number;
  child0to18: number;
  child19to20: number;
}

export interface DeductibleAmounts {
  individual: number;
  family: number;
}

export interface OutOfPocketMax {
  individual: number;
  family: number;
}

export interface HSAContribution {
  employeeOnly: number;
  withDependents: number;
}

export interface Copay {
  amount: number;
  deductibleWaived: boolean;
}

export interface Coinsurance {
  percentage: number;
  deductibleApplies: boolean;
}

export interface ServiceCost {
  copay?: Copay;
  coinsurance?: Coinsurance;
}

export interface PrescriptionCosts {
  preferredGeneric: ServiceCost;
  generic: ServiceCost;
  preferredBrand: ServiceCost;
  brand: ServiceCost;
  specialty: ServiceCost;
}

export type PlanTier = 'Silver' | 'Gold';
export type PlanType = 'PPO' | 'HSA';

export interface HealthcarePlan {
  planId: string;
  planName: string;
  shortName: string;
  tier: PlanTier;
  type: PlanType;

  // Costs
  monthlyRates: MonthlyRates;
  deductibles: DeductibleAmounts;
  outOfPocketMax: OutOfPocketMax;

  // HSA specific
  isHSA: boolean;
  hsaContribution?: HSAContribution;

  // Service costs
  primaryCare: ServiceCost;
  specialist: ServiceCost;
  emergencyRoom: ServiceCost;
  urgentCare: ServiceCost;
  telehealth: ServiceCost;
  labWork: ServiceCost;
  imaging: ServiceCost;

  // Prescriptions
  prescriptions: PrescriptionCosts;

  // Special features
  features: string[];
}

// ============================================================================
// FAMILY COMPOSITION
// ============================================================================

export const FamilyCompositionSchema = z.object({
  numSpouses: z.number().min(0).max(1),
  numChildren0to18: z.number().min(0).max(20),
  numChildren19to20: z.number().min(0).max(20),
});

export type FamilyComposition = z.infer<typeof FamilyCompositionSchema>;

export interface FamilyCompositionWithCalculated extends FamilyComposition {
  totalDependents: number;
  hasFamily: boolean;
}

// Helper to add calculated properties
export function enrichFamilyComposition(
  composition: FamilyComposition
): FamilyCompositionWithCalculated {
  const totalDependents =
    composition.numSpouses +
    composition.numChildren0to18 +
    composition.numChildren19to20;

  return {
    ...composition,
    totalDependents,
    hasFamily: totalDependents > 0,
  };
}

// ============================================================================
// HEALTH PROFILE
// ============================================================================

export interface Medication {
  name: string;
  type: 'preferredGeneric' | 'generic' | 'preferredBrand' | 'brand' | 'specialty';
  frequency: 'daily' | 'weekly' | 'monthly' | 'asNeeded';
}

export const HealthProfileSchema = z.object({
  chronicConditions: z.array(z.string()),
  isPlanningPregnancy: z.boolean(),
  annualDoctorVisits: z.number().min(0).max(100),
  annualSpecialistVisits: z.number().min(0).max(100),
  annualERVisits: z.number().min(0).max(20),
  annualUrgentCareVisits: z.number().min(0).max(50),
  annualLabVisits: z.number().min(0).max(50),
  regularMedications: z.array(z.object({
    name: z.string(),
    type: z.enum(['preferredGeneric', 'generic', 'preferredBrand', 'brand', 'specialty']),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'asNeeded']),
  })),
  overallHealth: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
});

export type HealthProfile = z.infer<typeof HealthProfileSchema>;

// ============================================================================
// USER PREFERENCES
// ============================================================================

export interface UserPreferences {
  hsaInterested: boolean;
  prioritizeLowPremium: boolean;
  prioritizeLowDeductible: boolean;
  preferPredictableCopays: boolean;
}

// ============================================================================
// COST CALCULATIONS
// ============================================================================

export interface PremiumCalculation {
  planId: string;

  // Gross costs (before employer contribution)
  grossEmployeeCost: number;
  grossSpouseCost: number;
  grossChildrenCost: number;
  grossTotalMonthly: number;

  // Employer contribution
  employerPremiumContribution: number;

  // Net costs (what employee pays)
  employeeMonthlyPremium: number;
  employeeAnnualPremium: number;
}

export interface HSACalculation {
  isHSAPlan: boolean;
  monthlyHSAContribution: number;
  annualHSAContribution: number;
}

export interface MedicalCostBreakdown {
  primaryCareVisits: number;
  specialistVisits: number;
  emergencyRoomVisits: number;
  urgentCareVisits: number;
  labWork: number;
  imaging: number;
  prescriptions: number;
  chronicConditionManagement: number;
  pregnancyCosts: number;
  subtotal: number;
  cappedAtOOPMax: number;
  finalMedicalCosts: number;
}

export interface CostCalculation {
  planId: string;
  planName: string;

  // Premium costs
  premium: PremiumCalculation;

  // HSA contribution (if applicable)
  hsa: HSACalculation;

  // Medical cost estimates
  medicalCosts: MedicalCostBreakdown;

  // Total costs
  totalAnnualCost: number;

  // For comparison
  netMonthlyPremium: number; // After HSA contribution (for reference only)
  monthlyPremiumDisplay: number; // Actual premium (what comes out of paycheck)
}

export interface PlanComparison {
  plans: CostCalculation[];
  recommendedPlanId: string;
  reasoning: string;
  sortedByTotalCost: CostCalculation[];
}

// ============================================================================
// CONVERSATION STATE
// ============================================================================

export interface ConversationState {
  familyComposition: FamilyComposition | null;
  healthProfile: HealthProfile | null;
  preferences: UserPreferences | null;
  hasCalculatedCosts: boolean;
  currentRecommendation: PlanComparison | null;
}

export interface ConversationProgress {
  hasFamilyInfo: boolean;
  hasHealthInfo: boolean;
  hasUsageInfo: boolean;
  hasPreferences: boolean;
  readyToCalculate: boolean;
  percentComplete: number;
}

// ============================================================================
// AI FUNCTION PARAMETERS
// ============================================================================

export interface CalculateCostsParams {
  familyComposition: FamilyComposition;
  healthProfile: HealthProfile;
}

export interface ShowCostComparisonParams {
  calculationResults: CostCalculation[];
  recommendedPlanId: string;
  reasoning: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const EMPLOYER_CONTRIBUTION = {
  EMPLOYEE_BASE: 554.15, // 100% of Silver 3000 employee rate
  PER_DEPENDENT: 258.74, // 80% of Silver 3000 child rate (323.43 * 0.80)
} as const;

export const ESTIMATED_COSTS = {
  ER_VISIT_BASE: 2000,
  CHRONIC_CONDITION_ANNUAL: 2500,
  PREGNANCY_ANNUAL: 6000,
  IMAGING_AVERAGE: 400,
  LAB_WORK_AVERAGE: 150,
} as const;
