import { PrismaClient } from '@prisma/client'

// PrismaClient singleton pattern for Next.js
// This prevents multiple instances in development with hot reloading

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// This pattern is crucial for Next.js because:
// 1. In development, Next.js hot reloads create new PrismaClient instances
// 2. Too many connections will exhaust your database connection pool
// 3. In production, this isn't an issue due to how serverless functions work