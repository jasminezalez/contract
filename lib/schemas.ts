import { z } from 'zod'

// Contract data schema - defines the structure of contract information
// This is used for:
// 1. Validating AI responses
// 2. Type-safe data handling
// 3. Preventing hallucinations through structured outputs

export const contractSchema = z.object({
  // Property Information
  propertyAddress: z.string().min(5, "Property address required"),
  purchasePrice: z.number().positive("Purchase price must be positive"),
  downPayment: z.number().positive("Down payment must be positive"),

  // Buyer Information
  buyerName: z.string().min(2, "Buyer name required"),
  buyerEmail: z.string().email("Valid email required"),
  buyerPhone: z.string().regex(/^\d{10}$/, "10-digit phone number required"),

  // Transaction Details
  closeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date format: YYYY-MM-DD"),

  // Agent Information (populated from session)
  agentName: z.string(),
  agentLicense: z.string(),
  agentPhone: z.string(),

  // Tracking field
  allFieldsConfirmed: z.boolean().default(false)
})

export type ContractData = z.infer<typeof contractSchema>

// Partial contract for tracking progress
export const partialContractSchema = contractSchema.partial()
export type PartialContractData = z.infer<typeof partialContractSchema>

// Field status tracking
export const fieldStatusSchema = z.object({
  propertyAddress: z.enum(['pending', 'collecting', 'confirmed']).default('pending'),
  purchasePrice: z.enum(['pending', 'collecting', 'confirmed']).default('pending'),
  downPayment: z.enum(['pending', 'collecting', 'confirmed']).default('pending'),
  buyerName: z.enum(['pending', 'collecting', 'confirmed']).default('pending'),
  buyerEmail: z.enum(['pending', 'collecting', 'confirmed']).default('pending'),
  buyerPhone: z.enum(['pending', 'collecting', 'confirmed']).default('pending'),
  closeDate: z.enum(['pending', 'collecting', 'confirmed']).default('pending'),
})

export type FieldStatus = z.infer<typeof fieldStatusSchema>

// Message types for conversation
export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.date(),
})

export type Message = z.infer<typeof messageSchema>