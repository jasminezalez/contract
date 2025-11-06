# contract

# AI Contract Generator

Real estate contract generation through voice conversation. Built with Vercel AI SDK.

## Tech Stack
- Next.js 14 (App Router)
- Vercel AI SDK (streaming, structured outputs)
- OpenAI GPT-4 + Whisper
- Prisma + Vercel Postgres
- NextAuth.js
- Tailwind CSS

## Key Features
- 🎤 Voice-first AI agent
- 📄 Automated PDF generation
- 🔄 Real-time streaming with AI SDK
- ✅ Structured data extraction with Zod

## Live Demo
[your-app.vercel.app]

## Local Setup
1. Clone repo
2. `npm install`
3. Setup `.env.local` (see `.env.example`)
4. `npx prisma generate && npx prisma db push`
5. `npm run dev`