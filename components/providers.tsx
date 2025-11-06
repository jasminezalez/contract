"use client"

// Providers component for client-side context
// Currently just passes through children - can add providers here if needed

export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}