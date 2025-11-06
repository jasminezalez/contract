'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CostComparisonChartProps {
  plans: {
    planName: string;
    totalAnnualCost: number;
    annualPremium: number;
    estimatedMedicalCosts: number;
  }[];
}

export function CostComparisonChart({ plans }: CostComparisonChartProps) {
  const chartData = plans.map((plan) => ({
    name: plan.planName.replace('Regence ', '').replace(' Preferred', ''),
    premium: plan.annualPremium,
    medical: plan.estimatedMedicalCosts,
    total: plan.totalAnnualCost,
  }));

  const colors = {
    premium: '#3b82f6', // blue
    medical: '#8b5cf6', // purple
  };

  return (
    <Card className="bg-white shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-blue-600">Annual Cost Comparison</CardTitle>
        <CardDescription className="text-slate-600">
          Compare total costs across all plans (premium + estimated medical expenses)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                className="text-xs text-slate-600"
                stroke="#64748b"
              />
              <YAxis
                label={{ value: 'Annual Cost ($)', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                className="text-slate-600"
                stroke="#64748b"
              />
              <Tooltip
                formatter={(value: number) => `$${value.toFixed(0)}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ color: '#1e293b', fontWeight: 600 }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px', color: '#64748b' }}
                formatter={(value) => {
                  if (value === 'premium') return 'Annual Premium';
                  if (value === 'medical') return 'Medical Costs';
                  return value;
                }}
              />
              <Bar dataKey="premium" stackId="a" fill={colors.premium} name="premium" radius={[0, 0, 0, 0]} />
              <Bar dataKey="medical" stackId="a" fill={colors.medical} name="medical" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with actual totals */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="text-center p-2 rounded-lg border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="text-xs text-slate-600 truncate font-medium">
                {plan.planName.replace('Regence ', '').replace(' Preferred', '')}
              </div>
              <div className="font-bold text-sm text-blue-600 mt-1">
                ${plan.totalAnnualCost.toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
