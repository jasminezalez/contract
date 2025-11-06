import { HealthcarePlan } from './types';

// ============================================================================
// HEALTHCARE PLANS DATA - 2025-2026
// ============================================================================

export const PLANS: HealthcarePlan[] = [
  // ==========================================================================
  // SILVER TIER
  // ==========================================================================
  {
    planId: 'silver-3000-ppo',
    planName: 'Regence Silver 3000 Preferred',
    shortName: 'Silver 3000',
    tier: 'Silver',
    type: 'PPO',

    monthlyRates: {
      employee: 554.15,
      dependent21Plus: 554.15,
      child0to18: 323.43,
      child19to20: 328.48,
    },

    deductibles: {
      individual: 3000,
      family: 6000,
    },

    outOfPocketMax: {
      individual: 8650,
      family: 17300,
    },

    isHSA: false,

    primaryCare: {
      copay: {
        amount: 40,
        deductibleWaived: true,
      },
    },

    specialist: {
      copay: {
        amount: 60,
        deductibleWaived: true,
      },
    },

    emergencyRoom: {
      copay: {
        amount: 400,
        deductibleWaived: false,
      },
      coinsurance: {
        percentage: 35,
        deductibleApplies: true,
      },
    },

    urgentCare: {
      copay: {
        amount: 60,
        deductibleWaived: true,
      },
    },

    telehealth: {
      copay: {
        amount: 10,
        deductibleWaived: true,
      },
    },

    labWork: {
      coinsurance: {
        percentage: 35,
        deductibleApplies: true,
      },
    },

    imaging: {
      coinsurance: {
        percentage: 35,
        deductibleApplies: true,
      },
    },

    prescriptions: {
      preferredGeneric: {
        copay: {
          amount: 20,
          deductibleWaived: true,
        },
      },
      generic: {
        copay: {
          amount: 35,
          deductibleWaived: true,
        },
      },
      preferredBrand: {
        copay: {
          amount: 60,
          deductibleWaived: true,
        },
      },
      brand: {
        coinsurance: {
          percentage: 50,
          deductibleApplies: true,
        },
      },
      specialty: {
        coinsurance: {
          percentage: 35, // Range 20-50%, using midpoint
          deductibleApplies: true,
        },
      },
    },

    features: [
      'FREE for employee-only coverage',
      'Primary care and specialist copays (no deductible)',
      'Low-cost telehealth',
      'Good for healthy individuals/families',
    ],
  },

  // ==========================================================================
  {
    planId: 'silver-hsa-2700',
    planName: 'Regence Silver HSA 2700 Preferred',
    shortName: 'Silver HSA 2700',
    tier: 'Silver',
    type: 'HSA',

    monthlyRates: {
      employee: 584.09,
      dependent21Plus: 584.09,
      child0to18: 341.12,
      child19to20: 346.17,
    },

    deductibles: {
      individual: 2700,
      family: 5400,
    },

    outOfPocketMax: {
      individual: 6900,
      family: 13800,
    },

    isHSA: true,
    hsaContribution: {
      employeeOnly: 100,
      withDependents: 200,
    },

    primaryCare: {
      coinsurance: {
        percentage: 30,
        deductibleApplies: true,
      },
    },

    specialist: {
      coinsurance: {
        percentage: 30,
        deductibleApplies: true,
      },
    },

    emergencyRoom: {
      coinsurance: {
        percentage: 30,
        deductibleApplies: true,
      },
    },

    urgentCare: {
      coinsurance: {
        percentage: 30,
        deductibleApplies: true,
      },
    },

    telehealth: {
      coinsurance: {
        percentage: 30,
        deductibleApplies: true,
      },
    },

    labWork: {
      coinsurance: {
        percentage: 30,
        deductibleApplies: true,
      },
    },

    imaging: {
      coinsurance: {
        percentage: 30,
        deductibleApplies: true,
      },
    },

    prescriptions: {
      preferredGeneric: {
        coinsurance: {
          percentage: 10,
          deductibleApplies: true,
        },
      },
      generic: {
        coinsurance: {
          percentage: 20,
          deductibleApplies: true,
        },
      },
      preferredBrand: {
        coinsurance: {
          percentage: 30,
          deductibleApplies: true,
        },
      },
      brand: {
        coinsurance: {
          percentage: 40,
          deductibleApplies: true,
        },
      },
      specialty: {
        coinsurance: {
          percentage: 50,
          deductibleApplies: true,
        },
      },
    },

    features: [
      'HSA-eligible - save pre-tax dollars',
      'Company contributes $100-200/month to YOUR HSA',
      'NET COST can be negative (you profit!) for employee-only',
      'Lower deductible than typical HSA',
      'Best for healthy individuals who want tax savings',
    ],
  },

  // ==========================================================================
  // GOLD TIER
  // ==========================================================================
  {
    planId: 'gold-1000-ppo',
    planName: 'Regence Gold 1000 Preferred',
    shortName: 'Gold 1000',
    tier: 'Gold',
    type: 'PPO',

    monthlyRates: {
      employee: 678.75,
      dependent21Plus: 678.75,
      child0to18: 397.02,
      child19to20: 402.07,
    },

    deductibles: {
      individual: 1000,
      family: 2000,
    },

    outOfPocketMax: {
      individual: 7000,
      family: 14000,
    },

    isHSA: false,

    primaryCare: {
      copay: {
        amount: 30,
        deductibleWaived: true,
      },
    },

    specialist: {
      copay: {
        amount: 50,
        deductibleWaived: true,
      },
    },

    emergencyRoom: {
      copay: {
        amount: 300,
        deductibleWaived: false,
      },
      coinsurance: {
        percentage: 30,
        deductibleApplies: true,
      },
    },

    urgentCare: {
      copay: {
        amount: 50,
        deductibleWaived: true,
      },
    },

    telehealth: {
      copay: {
        amount: 10,
        deductibleWaived: true,
      },
    },

    labWork: {
      coinsurance: {
        percentage: 30,
        deductibleApplies: false, // Deductible waived!
      },
    },

    imaging: {
      coinsurance: {
        percentage: 30,
        deductibleApplies: true,
      },
    },

    prescriptions: {
      preferredGeneric: {
        copay: {
          amount: 10,
          deductibleWaived: true,
        },
      },
      generic: {
        copay: {
          amount: 35,
          deductibleWaived: true,
        },
      },
      preferredBrand: {
        copay: {
          amount: 50,
          deductibleWaived: true,
        },
      },
      brand: {
        coinsurance: {
          percentage: 50,
          deductibleApplies: true,
        },
      },
      specialty: {
        coinsurance: {
          percentage: 35, // Range 20-50%, using midpoint
          deductibleApplies: true,
        },
      },
    },

    features: [
      'LOWEST deductible - only $1000',
      'Best overall coverage',
      'Lab work deductible waived',
      'Predictable copays for most services',
      'Great for chronic conditions or high usage',
    ],
  },

  // ==========================================================================
  {
    planId: 'gold-2000-ppo',
    planName: 'Regence Gold 2000 Preferred',
    shortName: 'Gold 2000',
    tier: 'Gold',
    type: 'PPO',

    monthlyRates: {
      employee: 654.59,
      dependent21Plus: 654.59,
      child0to18: 382.76,
      child19to20: 387.81,
    },

    deductibles: {
      individual: 2000,
      family: 4000,
    },

    outOfPocketMax: {
      individual: 5750,
      family: 11500,
    },

    isHSA: false,

    primaryCare: {
      copay: {
        amount: 35,
        deductibleWaived: true,
      },
    },

    specialist: {
      copay: {
        amount: 50,
        deductibleWaived: true,
      },
    },

    emergencyRoom: {
      copay: {
        amount: 300,
        deductibleWaived: false,
      },
      coinsurance: {
        percentage: 25,
        deductibleApplies: true,
      },
    },

    urgentCare: {
      copay: {
        amount: 50,
        deductibleWaived: true,
      },
    },

    telehealth: {
      copay: {
        amount: 10,
        deductibleWaived: true,
      },
    },

    labWork: {
      coinsurance: {
        percentage: 25,
        deductibleApplies: false, // Deductible waived!
      },
    },

    imaging: {
      coinsurance: {
        percentage: 25,
        deductibleApplies: true,
      },
    },

    prescriptions: {
      preferredGeneric: {
        copay: {
          amount: 10,
          deductibleWaived: true,
        },
      },
      generic: {
        copay: {
          amount: 35,
          deductibleWaived: true,
        },
      },
      preferredBrand: {
        copay: {
          amount: 50,
          deductibleWaived: true,
        },
      },
      brand: {
        coinsurance: {
          percentage: 50,
          deductibleApplies: true,
        },
      },
      specialty: {
        coinsurance: {
          percentage: 35, // Range 20-50%, using midpoint
          deductibleApplies: true,
        },
      },
    },

    features: [
      'LOWEST out-of-pocket maximum',
      'Balanced cost and coverage',
      'Lab work deductible waived',
      'Lower coinsurance rates (25%)',
      'Great for families with moderate usage',
    ],
  },

  // ==========================================================================
  {
    planId: 'gold-hsa-1800',
    planName: 'Regence Gold HSA 1800 Preferred',
    shortName: 'Gold HSA 1800',
    tier: 'Gold',
    type: 'HSA',

    monthlyRates: {
      employee: 685.5,
      dependent21Plus: 685.5,
      child0to18: 401.01,
      child19to20: 406.06,
    },

    deductibles: {
      individual: 1800,
      family: 3600,
    },

    outOfPocketMax: {
      individual: 4500,
      family: 9000,
    },

    isHSA: true,
    hsaContribution: {
      employeeOnly: 100,
      withDependents: 200,
    },

    primaryCare: {
      coinsurance: {
        percentage: 20,
        deductibleApplies: true,
      },
    },

    specialist: {
      coinsurance: {
        percentage: 20,
        deductibleApplies: true,
      },
    },

    emergencyRoom: {
      coinsurance: {
        percentage: 20,
        deductibleApplies: true,
      },
    },

    urgentCare: {
      coinsurance: {
        percentage: 20,
        deductibleApplies: true,
      },
    },

    telehealth: {
      coinsurance: {
        percentage: 20,
        deductibleApplies: true,
      },
    },

    labWork: {
      coinsurance: {
        percentage: 20,
        deductibleApplies: true,
      },
    },

    imaging: {
      coinsurance: {
        percentage: 20,
        deductibleApplies: true,
      },
    },

    prescriptions: {
      preferredGeneric: {
        coinsurance: {
          percentage: 10,
          deductibleApplies: true,
        },
      },
      generic: {
        coinsurance: {
          percentage: 20,
          deductibleApplies: true,
        },
      },
      preferredBrand: {
        coinsurance: {
          percentage: 30,
          deductibleApplies: true,
        },
      },
      brand: {
        coinsurance: {
          percentage: 40,
          deductibleApplies: true,
        },
      },
      specialty: {
        coinsurance: {
          percentage: 50,
          deductibleApplies: true,
        },
      },
    },

    features: [
      'LOWEST out-of-pocket maximum of all plans',
      'HSA-eligible with great coverage',
      'Company contributes $100-200/month to YOUR HSA',
      'Lower coinsurance rates (20%)',
      'Best for high medical needs who want HSA benefits',
    ],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a plan by its ID
 */
export function getPlanById(planId: string): HealthcarePlan | undefined {
  return PLANS.find((plan) => plan.planId === planId);
}

/**
 * Get all plans
 */
export function getAllPlans(): HealthcarePlan[] {
  return PLANS;
}

/**
 * Get HSA plans only
 */
export function getHSAPlans(): HealthcarePlan[] {
  return PLANS.filter((plan) => plan.isHSA);
}

/**
 * Get PPO plans only
 */
export function getPPOPlans(): HealthcarePlan[] {
  return PLANS.filter((plan) => plan.type === 'PPO');
}

/**
 * Get plans by tier
 */
export function getPlansByTier(tier: 'Silver' | 'Gold'): HealthcarePlan[] {
  return PLANS.filter((plan) => plan.tier === tier);
}

/**
 * Get a plan with detailed information formatted for display
 */
export function getPlanDetails(planId: string): string {
  const plan = getPlanById(planId);
  if (!plan) return 'Plan not found';

  return `
${plan.planName} (${plan.type})
- Monthly Rate (Employee): $${plan.monthlyRates.employee}
- Deductible (Individual): $${plan.deductibles.individual}
- Out-of-Pocket Max (Individual): $${plan.outOfPocketMax.individual}
${plan.isHSA ? `- HSA Contribution: $${plan.hsaContribution?.employeeOnly}/month (employee only)` : ''}
- Primary Care: ${plan.primaryCare.copay ? `$${plan.primaryCare.copay.amount} copay` : `${plan.primaryCare.coinsurance?.percentage}% coinsurance`}
- Specialist: ${plan.specialist.copay ? `$${plan.specialist.copay.amount} copay` : `${plan.specialist.coinsurance?.percentage}% coinsurance`}
  `.trim();
}
