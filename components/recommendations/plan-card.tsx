'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles } from 'lucide-react';

interface PlanCardProps {
  plan: {
    planId: string;
    planName: string;
    tier?: string;
    type?: string;
    monthlyPremium: number;
    annualPremium: number;
    hsaContribution?: {
      monthly: number;
      annual: number;
    } | null;
    estimatedMedicalCosts: number;
    totalAnnualCost: number;
    deductible?: number;
    oopMax?: number;
  };
  isRecommended?: boolean;
}

export function PlanCard({ plan, isRecommended = false }: PlanCardProps) {
  return (
    <Card className={isRecommended ? 'border-2 border-blue-500 shadow-lg hover:shadow-xl transition-all' : 'hover:shadow-md transition-all bg-white'}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg text-slate-900">{plan.planName}</CardTitle>
            <CardDescription className="mt-1 text-slate-600">
              {plan.tier && plan.type && `${plan.tier} Tier · ${plan.type}`}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            {isRecommended && (
              <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0">
                <Sparkles className="mr-1 h-3 w-3" />
                Recommended
              </Badge>
            )}
            {plan.hsaContribution && (
              <Badge variant="success" className="bg-emerald-500 hover:bg-emerald-600">
                HSA
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Monthly Premium */}
        <div>
          <div className="text-sm text-slate-600">Monthly Premium</div>
          <div className="text-2xl font-bold text-slate-900">
            ${plan.monthlyPremium.toFixed(2)}
          </div>
          {plan.monthlyPremium === 0 && (
            <div className="text-xs text-emerald-600 font-medium">FREE!</div>
          )}
        </div>

        {/* HSA Contribution */}
        {plan.hsaContribution && (
          <Alert className="bg-emerald-50 border-emerald-200 border-2">
            <AlertDescription className="text-emerald-900">
              <strong className="text-emerald-700">PLUS: Company contributes ${plan.hsaContribution.monthly}/month</strong>
              <br />
              <span className="text-xs text-emerald-600">
                (${plan.hsaContribution.annual}/year into YOUR HSA!)
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Cost Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Annual Premium</span>
            <span className="font-medium text-slate-900">${plan.annualPremium.toFixed(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Est. Medical Costs</span>
            <span className="font-medium text-slate-900">${plan.estimatedMedicalCosts.toFixed(0)}</span>
          </div>
          <div className="border-t border-slate-200 pt-2 flex justify-between">
            <span className="font-semibold text-slate-900">
              Total Annual Cost
            </span>
            <span className="font-bold text-xl text-blue-600">
              ${plan.totalAnnualCost.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Plan Details */}
        {(plan.deductible || plan.oopMax) && (
          <div className="border-t border-slate-200 pt-3 space-y-1 text-xs text-slate-600">
            {plan.deductible && (
              <div className="flex justify-between">
                <span>Deductible:</span>
                <span className="font-medium text-slate-900">${plan.deductible.toLocaleString()}</span>
              </div>
            )}
            {plan.oopMax && (
              <div className="flex justify-between">
                <span>Out-of-Pocket Max:</span>
                <span className="font-medium text-slate-900">${plan.oopMax.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
