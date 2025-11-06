import { openai } from '@ai-sdk/openai';
import { streamText, tool, convertToModelMessages } from 'ai';
import {
  SYSTEM_PROMPT,
  CALCULATE_COSTS_FUNCTION,
} from '@/lib/ai-prompts';
import {
  compareAllPlans,
  generateRecommendation,
} from '@/lib/cost-calculator';
import { getPlanById } from '@/lib/plans';
import type { FamilyComposition, HealthProfile } from '@/lib/types';

// Allow streaming responses up to 60 seconds (increased for better reliability)
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log('📨 Received messages:', JSON.stringify(messages, null, 2));

    // Validate messages
    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No messages provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert UI messages to model messages
    const modelMessages = convertToModelMessages(messages);

    console.log('🔄 Converted to model messages:', JSON.stringify(modelMessages, null, 2));
    console.log('🔑 OpenAI API Key:', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ Missing OpenAI API key');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = streamText({
      model: openai('gpt-4o-mini'), // More reliable with tool calling and streaming
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      maxRetries: 3, // Retry failed requests up to 3 times
      abortSignal: AbortSignal.timeout(55000), // 55 second timeout
      temperature: 0.7,
      tools: {
        calculateCosts: tool({
          description: CALCULATE_COSTS_FUNCTION.description,
          inputSchema: CALCULATE_COSTS_FUNCTION.parameters,
          execute: async ({ familyComposition, healthProfile }) => {
            console.log('🔧 Tool execution started');
            console.log('👨‍👩‍👧‍👦 Family:', JSON.stringify(familyComposition));
            console.log('🏥 Health Profile:', JSON.stringify(healthProfile));

            try {
              // Calculate costs for all plans
              const allPlanCalculations = compareAllPlans(familyComposition, healthProfile);
              console.log('✅ Cost calculations completed');

            // Generate recommendation
            const recommendation = generateRecommendation(
              familyComposition,
              healthProfile,
              { hsaInterested: true } // Default to interested
            );

            // Format response for AI
            const recommendedPlan = allPlanCalculations.find(
              p => p.planId === recommendation.recommendedPlanId
            );

            if (!recommendedPlan) {
              return {
                error: 'Could not find recommended plan',
              };
            }

            // Build detailed response
            const response = {
              success: true,
              recommendedPlan: {
                planId: recommendedPlan.planId,
                planName: recommendedPlan.planName,
                monthlyPremium: recommendedPlan.premium.employeeMonthlyPremium,
                annualPremium: recommendedPlan.premium.employeeAnnualPremium,
                hsaContribution: recommendedPlan.hsa.isHSAPlan ? {
                  monthly: recommendedPlan.hsa.monthlyHSAContribution,
                  annual: recommendedPlan.hsa.annualHSAContribution,
                } : null,
                estimatedMedicalCosts: recommendedPlan.medicalCosts.finalMedicalCosts,
                totalAnnualCost: recommendedPlan.totalAnnualCost,
                breakdown: {
                  primaryCare: recommendedPlan.medicalCosts.primaryCareVisits,
                  specialist: recommendedPlan.medicalCosts.specialistVisits,
                  emergencyRoom: recommendedPlan.medicalCosts.emergencyRoomVisits,
                  urgentCare: recommendedPlan.medicalCosts.urgentCareVisits,
                  labWork: recommendedPlan.medicalCosts.labWork,
                  prescriptions: recommendedPlan.medicalCosts.prescriptions,
                  chronicConditions: recommendedPlan.medicalCosts.chronicConditionManagement,
                  pregnancy: recommendedPlan.medicalCosts.pregnancyCosts,
                },
              },
              allPlans: allPlanCalculations.map(calc => {
                const plan = getPlanById(calc.planId);
                return {
                  planId: calc.planId,
                  planName: calc.planName,
                  tier: plan?.tier,
                  type: plan?.type,
                  monthlyPremium: calc.premium.employeeMonthlyPremium,
                  annualPremium: calc.premium.employeeAnnualPremium,
                  hsaContribution: calc.hsa.isHSAPlan ? {
                    monthly: calc.hsa.monthlyHSAContribution,
                    annual: calc.hsa.annualHSAContribution,
                  } : null,
                  estimatedMedicalCosts: calc.medicalCosts.finalMedicalCosts,
                  totalAnnualCost: calc.totalAnnualCost,
                  deductible: plan?.deductibles.individual,
                  oopMax: plan?.outOfPocketMax.individual,
                };
              }),
              reasoning: recommendation.reasoning,
              costComparison: allPlanCalculations.map(calc => ({
                planName: calc.planName,
                totalAnnualCost: calc.totalAnnualCost,
                savings: calc.totalAnnualCost - recommendedPlan.totalAnnualCost,
              })),
            };

              console.log('✅ Tool execution completed successfully');
              return response;
            } catch (toolError) {
              console.error('❌ Tool execution error:', toolError);
              return {
                error: 'Failed to calculate costs',
                details: toolError instanceof Error ? toolError.message : 'Unknown error',
              };
            }
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
