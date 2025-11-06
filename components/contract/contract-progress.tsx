"use client"

import { Check, Circle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

// Contract Progress Component
// Visual checklist showing field collection status

export interface ContractField {
  key: string
  label: string
  value?: string | number
  status: 'pending' | 'collecting' | 'confirmed'
}

interface ContractProgressProps {
  fields: ContractField[]
}

export function ContractProgress({ fields }: ContractProgressProps) {
  const confirmedCount = fields.filter(f => f.status === 'confirmed').length
  const totalCount = fields.length
  const progressPercentage = (confirmedCount / totalCount) * 100

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Contract Progress</h3>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p className="text-sm text-gray-600">
          {confirmedCount} of {totalCount} fields confirmed
        </p>
      </div>

      {/* Field List */}
      <div className="space-y-3">
        {fields.map((field) => (
          <div
            key={field.key}
            className={cn(
              "flex items-center justify-between p-3 rounded-md transition-colors",
              field.status === 'confirmed' && "bg-green-50",
              field.status === 'collecting' && "bg-yellow-50",
              field.status === 'pending' && "bg-gray-50"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Status Icon */}
              {field.status === 'confirmed' && (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              {field.status === 'collecting' && (
                <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
              )}
              {field.status === 'pending' && (
                <Circle className="w-5 h-5 text-gray-400" />
              )}

              {/* Field Label */}
              <span className={cn(
                "text-sm font-medium",
                field.status === 'confirmed' && "text-green-700",
                field.status === 'collecting' && "text-yellow-700",
                field.status === 'pending' && "text-gray-500"
              )}>
                {field.label}
              </span>
            </div>

            {/* Field Value */}
            {field.value && (
              <span className="text-sm text-gray-900 font-medium">
                {field.key.includes('Price') || field.key.includes('Payment')
                  ? formatCurrency(field.value)
                  : field.value}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {progressPercentage === 100 && (
        <div className="mt-4 p-3 bg-green-100 rounded-md">
          <p className="text-sm font-medium text-green-800">
            ✅ All fields confirmed! Ready to generate contract.
          </p>
        </div>
      )}
    </div>
  )
}

// Key technical points:
// 1. Visual progress tracking improves UX
// 2. Color coding for different states
// 3. Real-time updates as fields are confirmed
// 4. Format currency values appropriately
// 5. Celebration state when complete