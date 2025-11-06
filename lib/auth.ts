import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// NextAuth configuration with Google OAuth
// This is the core authentication setup for the entire app

export const authOptions: NextAuthOptions = {
  // Use Prisma adapter to store users, sessions in database
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Request profile info and email
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],

  // Configure session to use JWT for serverless compatibility
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages (we'll create these)
  pages: {
    signIn: "/", // Use landing page as sign-in
    error: "/auth/error",
  },

  callbacks: {
    // Add user ID to the session for easy access
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      return session
    },

    // Control what gets stored in the JWT
    async jwt({ token, user, account }) {
      if (user) {
        token.uid = user.id
      }
      return token
    },

    // Redirect to dashboard after sign in
    async redirect({ url, baseUrl }) {
      // If signing in, always go to dashboard
      if (url === baseUrl || url === '/') {
        return `${baseUrl}/dashboard`
      }
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",
}

// Type augmentation for TypeScript
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}