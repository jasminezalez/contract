# AI Contract Generator - Project Context

## 🎯 Project Overview

**Purpose:** MVP demo application for Vercel GTM Engineering interview  
**Goal:** Demonstrate expertise with Vercel AI Cloud, Next.js, and AI SDK through a production-ready AI agent  
**Timeline:** 20-24 hours to build  
**Demo Length:** 2 minutes  

### The Problem We're Solving
Real estate agents spend hours filling out repetitive contract forms. This AI agent generates complete residential purchase agreements through natural voice conversation in under 2 minutes.

### Interview Value Proposition
*"This demonstrates how Vercel's AI Cloud can transform document-heavy workflows. Real estate agents spend hours on paperwork—this agent does it in minutes. It showcases AI SDK's streaming, structured outputs, and tool calling—exactly what GTM Engineering could use to automate sales workflows."*

---

## 🏗️ Tech Stack

### Core Framework
- **Next.js 14+** with App Router
- **TypeScript** throughout
- **Tailwind CSS** for styling

### AI & Voice
- **Vercel AI SDK** - Primary integration layer
  - `streamText()` for conversational AI
  - Structured outputs with Zod schemas
  - Tool calling for field validation
- **OpenAI GPT-4 Turbo** - Conversational agent
- **OpenAI Whisper** - Voice transcription
- **OpenAI TTS** - Text-to-speech (optional for enhanced demo)

### Database & Storage
- **Vercel Postgres** - Built-in database
- **Prisma** - Type-safe ORM
- **Vercel Blob** - PDF storage

### Authentication
- **NextAuth.js** - Google OAuth only (simplified for MVP)

### PDF Generation
- **pdf-lib** - Fill existing PDF forms
- Template: California Residential Purchase Agreement

---

## ⚡ MVP Feature Set

### Must-Have Features (Core Demo)

1. **🎤 Voice-First Contract Generation**
   - Click microphone button to start recording
   - Speak contract details naturally
   - AI agent asks clarifying questions
   - Real-time field population with streaming responses
   - Visual feedback showing collection progress

2. **📄 Instant PDF Generation**
   - Generate filled California Residential Purchase Agreement
   - Download immediately after completion
   - View PDF in browser

3. **🔐 Simple Authentication**
   - "Sign in with Google" only
   - Save agent profile (name, license number, phone)
   - Auto-populate agent info in future contracts

4. **📊 Contract History Dashboard**
   - List of all generated contracts
   - View details of each contract
   - Download previous PDFs
   - Delete contracts

### Explicitly Cut Features (For Speed)
- ❌ Multiple OAuth providers (Microsoft, etc.)
- ❌ Guest "Quick Generate" mode
- ❌ Manual form editing alongside voice
- ❌ A/B testing different AI approaches
- ❌ Email contract functionality
- ❌ Complex contingencies/custom terms
- ❌ Advanced multi-page dashboards
- ❌ Team collaboration features

---

## 🗄️ Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
}

model User {
  id            String     @id @default(cuid())
  email         String     @unique
  name          String?
  image         String?
  
  // Agent-specific fields
  agentLicense  String?
  agentPhone    String?
  
  contracts     Contract[]
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model Contract {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Property Details
  propertyAddress String
  purchasePrice   Decimal  @db.Decimal(12, 2)
  downPayment     Decimal  @db.Decimal(12, 2)
  
  // Buyer Details
  buyerName       String
  buyerEmail      String
  buyerPhone      String
  
  // Transaction Details
  closeDate       DateTime
  
  // Agent Details (snapshot at time of contract creation)
  agentName       String
  agentLicense    String
  agentPhone      String
  
  // Generated PDF
  pdfUrl          String   // Vercel Blob URL
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([userId])
  @@index([createdAt])
}
```

---

## 🎨 User Flow

### 1. Landing Page (`/`)
```
┌─────────────────────────────────────────┐
│        Landing Page                     │
│                                         │
│  🏠 AI Contract Generator               │
│                                         │
│  Generate residential purchase          │
│  agreements with just your voice        │
│                                         │
│  Built with Vercel AI SDK + Next.js     │
│                                         │
│     [Sign in with Google]               │
└─────────────────────────────────────────┘
```

**Design:**
- Clean hero section
- Value proposition front and center
- Single prominent CTA button
- Subtle branding mention (Built with Vercel AI SDK)
- Modern, professional aesthetic

### 2. Dashboard (`/dashboard`)
```
┌─────────────────────────────────────────┐
│        Dashboard                        │
│                                         │
│  Welcome back, [Agent Name]!            │
│                                         │
│  [🎤 Generate New Contract]             │
│                                         │
│  Recent Contracts:                      │
│  ┌─────────────────────────────────┐   │
│  │ 123 Main St                     │   │
│  │ $500,000 • Jan 15, 2025         │   │
│  │ [View] [Download] [Delete]      │   │
│  ├─────────────────────────────────┤   │
│  │ 456 Oak Ave                     │   │
│  │ $750,000 • Jan 10, 2025         │   │
│  │ [View] [Download] [Delete]      │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Features:**
- Personalized greeting with agent name
- Large "Generate New Contract" button
- Contract list with key details
- Quick actions for each contract

### 3. Voice Generator (`/dashboard/generate`)
```
┌─────────────────────────────────────────┐
│     Voice Contract Generator            │
│                                         │
│  🎤 [Click to Start Recording] 🔴       │
│                                         │
│  Contract Progress:                     │
│  ✓ Property: 123 Main St                │
│  ✓ Price: $500,000                      │
│  ✓ Down Payment: $100,000               │
│  ⏳ Buyer Name: [listening...]          │
│  ⭕ Buyer Email: ...                    │
│  ⭕ Buyer Phone: ...                    │
│  ⭕ Close Date: ...                     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ AI: "What is the buyer's name?" │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Cancel] [Reset]                       │
└─────────────────────────────────────────┘
```

**Interaction Flow:**
1. User clicks microphone button
2. Browser requests microphone permission
3. Recording starts (visual indicator)
4. User speaks contract details
5. Audio sent to API for transcription
6. Transcribed text sent to AI agent
7. AI responds with next question or confirmation
8. Fields populate in real-time as confirmed
9. Process repeats until all fields collected

### 4. Contract Complete
```
┌─────────────────────────────────────────┐
│     Contract Complete! ✅               │
│                                         │
│  📄 Purchase Agreement Ready            │
│                                         │
│  Property: 123 Main St                  │
│  Purchase Price: $500,000               │
│  Down Payment: $100,000                 │
│  Buyer: John Doe                        │
│  Close Date: February 15, 2025          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      [Download PDF]             │   │
│  │      [View in Browser]          │   │
│  │      [Generate Another]         │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 🎙️ AI Agent Implementation

### Contract Data Schema
```typescript
// lib/schemas.ts
import { z } from 'zod';

export const contractSchema = z.object({
  propertyAddress: z.string().min(5, "Property address required"),
  purchasePrice: z.number().positive("Purchase price must be positive"),
  downPayment: z.number().positive("Down payment must be positive"),
  buyerName: z.string().min(2, "Buyer name required"),
  buyerEmail: z.string().email("Valid email required"),
  buyerPhone: z.string().regex(/^\d{10}$/, "10-digit phone number required"),
  closeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date format: YYYY-MM-DD"),
  agentName: z.string(),
  agentLicense: z.string(),
  agentPhone: z.string(),
  allFieldsConfirmed: z.boolean().default(false)
});

export type ContractData = z.infer<typeof contractSchema>;
```

### AI Conversation Endpoint
```typescript
// app/api/contract/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { contractSchema } from '@/lib/schemas';

const systemPrompt = `You are a professional real estate assistant helping agents create residential purchase agreements.

Your job is to collect the following information through natural conversation:
1. Property address (MUST confirm spelling, ask user to spell it out)
2. Purchase price (confirm as dollar amount)
3. Down payment amount (confirm as dollar amount)
4. Buyer's full name
5. Buyer's email address
6. Buyer's phone number (10 digits)
7. Close of escrow date (format: YYYY-MM-DD)

IMPORTANT RULES:
- Always confirm each piece of information before moving to the next
- For the property address, ask the user to spell it out letter by letter
- Be conversational but efficient
- If information seems incorrect, ask for clarification
- Keep responses brief and focused
- When ALL fields are collected and confirmed, set allFieldsConfirmed to true

The agent's information is already known:
- Agent Name: {agentName}
- Agent License: {agentLicense}
- Agent Phone: {agentPhone}`;

export async function POST(req: Request) {
  const { messages, agentInfo } = await req.json();
  
  const customSystemPrompt = systemPrompt
    .replace('{agentName}', agentInfo.name)
    .replace('{agentLicense}', agentInfo.license)
    .replace('{agentPhone}', agentInfo.phone);

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
    system: customSystemPrompt,
    temperature: 0.7,
    maxTokens: 500,
  });

  return result.toAIStreamResponse();
}
```

### Voice Transcription
```typescript
// app/api/transcribe/route.ts
import { openai } from 'openai';

const client = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio') as File;
    
    if (!audio) {
      return Response.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const transcription = await client.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
      language: 'en',
    });

    return Response.json({ text: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return Response.json({ error: 'Transcription failed' }, { status: 500 });
  }
}
```

### Structured Data Extraction
```typescript
// lib/extract-contract-data.ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { contractSchema } from './schemas';

export async function extractContractData(conversationHistory: string, agentInfo: any) {
  const result = await generateObject({
    model: openai('gpt-4-turbo'),
    schema: contractSchema,
    prompt: `Extract contract information from this conversation:

${conversationHistory}

Agent information (already known):
- Name: ${agentInfo.name}
- License: ${agentInfo.license}
- Phone: ${agentInfo.phone}

Extract all confirmed contract details. If a field hasn't been mentioned or confirmed, use null.`,
  });

  return result.object;
}
```

---

## 📂 Project Structure

```
contract-generator/
├── app/
│   ├── (auth)/                      # Protected routes
│   │   └── dashboard/
│   │       ├── page.tsx             # Dashboard with contract list
│   │       ├── generate/
│   │       │   └── page.tsx         # Voice generator UI
│   │       └── contract/
│   │           └── [id]/
│   │               └── page.tsx     # View single contract
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts         # NextAuth configuration
│   │   ├── contract/
│   │   │   ├── chat/
│   │   │   │   └── route.ts         # AI conversation endpoint
│   │   │   ├── create/
│   │   │   │   └── route.ts         # Save contract to DB
│   │   │   └── [id]/
│   │   │       ├── route.ts         # Get contract details
│   │   │       └── pdf/
│   │   │           └── route.ts     # Generate & serve PDF
│   │   └── transcribe/
│   │       └── route.ts             # Whisper API endpoint
│   ├── globals.css
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Landing page
├── components/
│   ├── ui/                          # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── auth/
│   │   └── sign-in-button.tsx       # Google OAuth button
│   ├── contract/
│   │   ├── contract-list.tsx        # Dashboard contract list
│   │   ├── contract-card.tsx        # Single contract display
│   │   └── contract-progress.tsx    # Field collection progress
│   └── voice/
│       ├── voice-recorder.tsx       # Audio capture component
│       └── conversation-display.tsx # Chat-style conversation UI
├── lib/
│   ├── ai.ts                        # AI SDK configuration
│   ├── auth.ts                      # NextAuth configuration
│   ├── prisma.ts                    # Prisma client singleton
│   ├── schemas.ts                   # Zod schemas
│   ├── pdf/
│   │   ├── generator.ts             # pdf-lib integration
│   │   └── template-mappings.ts     # PDF field mappings
│   └── utils.ts                     # Utility functions
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── seed.ts                      # Optional seed data
├── public/
│   └── templates/
│       └── ca-residential-purchase-agreement.pdf
├── .env.local                       # Environment variables (not in git)
├── .env.example                     # Example environment variables
├── connect.md                       # This file
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔐 Environment Variables

```bash
# .env.local

# Database (Vercel Postgres)
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="sk-..."

# Vercel Blob (auto-configured on Vercel)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

---

## 🚀 Development Roadmap

### Phase 1: Foundation (Hours 1-4)
**Goal:** Project setup, database, authentication

- [ ] Initialize Next.js project with TypeScript
  ```bash
  npx create-next-app@latest contract-generator --typescript --tailwind --app
  ```
- [ ] Install dependencies
  ```bash
  npm install @ai-sdk/openai ai prisma @prisma/client next-auth @auth/prisma-adapter
  npm install pdf-lib @vercel/blob zod
  npm install -D @types/node
  ```
- [ ] Setup Vercel Postgres
  - Create database in Vercel dashboard
  - Copy connection string to `.env.local`
- [ ] Initialize Prisma
  ```bash
  npx prisma init
  ```
- [ ] Create schema (see schema above)
- [ ] Generate Prisma client
  ```bash
  npx prisma generate
  npx prisma db push
  ```
- [ ] Configure NextAuth with Google OAuth
  - Create OAuth app in Google Cloud Console
  - Add credentials to `.env.local`
  - Setup NextAuth configuration
- [ ] Test authentication flow

**Deliverable:** User can sign in with Google and see a blank dashboard

---

### Phase 2: UI Foundation (Hours 5-8)
**Goal:** Landing page, dashboard, and basic layouts

- [ ] Create landing page (`app/page.tsx`)
  - Hero section with value proposition
  - "Sign in with Google" button
  - Modern, clean design with Tailwind
- [ ] Create dashboard layout (`app/(auth)/dashboard/layout.tsx`)
  - Header with user info
  - Navigation (if needed)
  - Sign out button
- [ ] Create dashboard page (`app/(auth)/dashboard/page.tsx`)
  - Welcome message with user name
  - "Generate New Contract" button
  - Contract list component (empty state initially)
- [ ] Setup protected route middleware
- [ ] Add loading states and error boundaries
- [ ] Style components with Tailwind CSS

**Deliverable:** Complete navigation flow from landing → sign in → dashboard

---

### Phase 3: Voice Recording (Hours 9-12)
**Goal:** Capture audio and transcribe with Whisper

- [ ] Create VoiceRecorder component
  - Use MediaRecorder API
  - Visual feedback (recording indicator, waveform)
  - Start/stop controls
  - Handle browser permissions
- [ ] Create transcription API endpoint (`app/api/transcribe/route.ts`)
  - Accept audio file upload
  - Call OpenAI Whisper API
  - Return transcribed text
- [ ] Connect recorder to transcription
  - Send audio blob to API
  - Display transcribed text
  - Handle errors gracefully
- [ ] Create generator page UI (`app/dashboard/generate/page.tsx`)
  - Place recorder component
  - Add field progress display
  - Add conversation history display

**Deliverable:** User can record audio and see transcription

---

### Phase 4: AI Conversation (Hours 13-16)
**Goal:** Implement conversational agent with Vercel AI SDK

- [ ] Create AI chat endpoint (`app/api/contract/chat/route.ts`)
  - Setup AI SDK with OpenAI GPT-4
  - Implement system prompt (see above)
  - Enable streaming responses
- [ ] Create conversation UI component
  - Chat-style message display
  - Show AI responses as they stream
  - Display user transcriptions
- [ ] Implement conversation loop
  - User speaks → transcribe → send to AI → display response
  - Continue until all fields collected
- [ ] Create ContractProgress component
  - Visual checklist of fields
  - Update in real-time as fields confirmed
  - Color-coded status (pending, in-progress, confirmed)
- [ ] Add data extraction logic
  - Parse AI responses for contract data
  - Update UI with confirmed fields
  - Allow user to correct any field

**Deliverable:** Full voice conversation that collects all contract fields

---

### Phase 5: PDF Generation (Hours 17-20)
**Goal:** Generate filled PDF from collected data

- [ ] Setup PDF template
  - Add California Residential Purchase Agreement to `/public/templates/`
  - Analyze form fields using pdf-lib
  - Create field mapping configuration
- [ ] Create PDF generator utility (`lib/pdf/generator.ts`)
  - Load template PDF
  - Fill form fields with contract data
  - Handle multi-page forms
  - Return PDF as buffer
- [ ] Create PDF generation endpoint (`app/api/contract/[id]/pdf/route.ts`)
  - Fetch contract from database
  - Generate filled PDF
  - Upload to Vercel Blob
  - Return PDF URL
- [ ] Add PDF actions to UI
  - "Generate PDF" button after data collection
  - Download PDF button
  - View PDF in browser (iframe or new tab)
- [ ] Save contract to database
  - Store all contract data
  - Store PDF Blob URL
  - Link to authenticated user

**Deliverable:** Complete contracts are saved and downloadable as PDFs

---

### Phase 6: Contract Management (Hours 21-22)
**Goal:** View, manage, and regenerate contracts

- [ ] Implement ContractList component
  - Fetch user's contracts from database
  - Display in card grid or table
  - Show key details (address, price, date)
- [ ] Create contract detail page (`app/dashboard/contract/[id]/page.tsx`)
  - Display all contract fields
  - Show PDF preview
  - Download button
  - Delete button
- [ ] Add delete functionality
  - API endpoint to delete contract
  - Also delete PDF from Blob storage
  - Confirm before deletion
- [ ] Add empty states
  - Show helpful message when no contracts exist
  - CTA to create first contract

**Deliverable:** Users can view, download, and delete past contracts

---

### Phase 7: Polish & Deploy (Hours 23-24)
**Goal:** Production-ready app on Vercel

- [ ] Error handling throughout app
  - Try-catch blocks in all API routes
  - User-friendly error messages
  - Fallback UI for errors
- [ ] Loading states
  - Skeletons for loading data
  - Spinners for async operations
  - Disable buttons during processing
- [ ] Add helpful comments in code
  - Explain AI SDK usage
  - Document complex logic
  - Add TODO notes for future enhancements
- [ ] Write comprehensive README
  - Project description
  - Tech stack explanation
  - Setup instructions
  - Environment variables
  - Demo video/screenshots
- [ ] Deploy to Vercel
  - Connect GitHub repository
  - Configure environment variables
  - Setup Vercel Postgres
  - Setup Vercel Blob
  - Deploy!
- [ ] End-to-end testing
  - Test complete flow on production
  - Test on different browsers
  - Test error scenarios
  - Fix any bugs

**Deliverable:** Live, production-ready app with clean code and documentation

---

## 🎯 Interview Preparation

### Demo Script (2 Minutes)

**1. Introduction (15 seconds)**
- "I built an AI agent that generates legal contracts through voice conversation"
- "It demonstrates Vercel AI SDK's streaming, structured outputs, and real-world AI application"

**2. Show Landing Page (10 seconds)**
- "Clean, modern interface"
- "Single call-to-action: Sign in with Google"
- *Click sign in*

**3. Quick OAuth (10 seconds)**
- Google OAuth flow
- "NextAuth.js makes this seamless"
- Land on dashboard

**4. Generate New Contract (70 seconds)**
- Click "Generate New Contract"
- *Click microphone button*
- **Speak naturally:** "The property is at 123 Main Street in Sacramento, spelled M-A-I-N. The purchase price is five hundred thousand dollars. The down payment is one hundred thousand dollars. The buyer is John Smith, email john@email.com, phone 5551234567. The close date is February 15, 2025."
- **Show real-time:**
  - Transcription appearing
  - AI asking clarifying questions
  - Fields populating as confirmed
  - Progress checklist updating
- AI confirms all details
- Click "Generate PDF"

**5. Download & View (20 seconds)**
- PDF generates and uploads to Blob
- Click "Download PDF"
- Show filled California Residential Purchase Agreement
- Return to dashboard

**6. Contract Management (15 seconds)**
- Show contract now appears in list
- Click to view details
- Show all stored information
- Delete option available

**7. Closing (20 seconds)**
- "This pattern applies to any document-heavy workflow"
- "Sales contracts, onboarding forms, compliance documents"
- "Built entirely with Vercel's stack - Next.js, AI SDK, Postgres, Blob"
- "Ready to scale with your customers"

---

### Technical Talking Points

**1. Vercel AI SDK Usage**
- "Used `streamText()` for real-time conversational responses"
- "Implemented structured outputs with Zod schemas for type-safe data extraction"
- "Shows how AI SDK simplifies complex AI integrations"

**2. Next.js App Router**
- "Leveraged Server Components for data fetching"
- "API Routes for AI endpoints"
- "Streaming responses for better UX"
- "Server Actions could further simplify mutations"

**3. Production Patterns**
- "Prisma for type-safe database operations"
- "NextAuth for enterprise-ready authentication"
- "Vercel Blob for scalable file storage"
- "Error boundaries and loading states throughout"

**4. AI Agent Design**
- "Carefully crafted system prompts to keep AI focused"
- "Confirmation patterns to ensure data accuracy"
- "Conversational but efficient - optimized for task completion"
- "Handles variations in user input naturally"

**5. Scalability Considerations**
- "Stateless API design for horizontal scaling"
- "Database indexes on frequently queried fields"
- "Blob storage separates file serving from app servers"
- "Could add caching layer (Vercel KV) for agent profiles"

**6. GTM Engineering Applications**
- "This pattern works for any document workflow"
- "Sales could generate proposals via voice"
- "Customer Success could automate onboarding"
- "Marketing could generate personalized content"
- "All while maintaining data accuracy and compliance"

---

### Questions You Might Be Asked

**Q: Why voice instead of a form?**
A: "Real estate agents are often mobile, in cars or showing properties. Voice is hands-free and faster than typing on mobile. It also demonstrates AI SDK's ability to handle unstructured input and create structured output - a common GTM challenge."

**Q: How would you scale this to 10,000 users?**
A: "The architecture is already stateless and serverless-ready. I'd add:
- Database connection pooling (Prisma Accelerate)
- Caching layer for user profiles (Vercel KV)
- Rate limiting middleware
- Queue system for PDF generation (if it becomes a bottleneck)
- Monitoring with Vercel Analytics and error tracking"

**Q: What about data accuracy and legal compliance?**
A: "The AI agent uses explicit confirmation for every field. For production, I'd add:
- E-signature integration (DocuSign API)
- Audit trail logging
- Template version control
- Legal disclaimer before generation
- Option for attorney review before finalization"

**Q: How long did this take to build?**
A: "About 20-24 hours from scratch. The Vercel ecosystem made it fast:
- AI SDK eliminated boilerplate for OpenAI integration
- Next.js App Router streamlined routing and API creation
- Vercel Postgres and Blob were zero-config
- NextAuth handled OAuth in minutes"

**Q: What would you add next?**
A: "For a production version:
1. Multi-state support (different contract templates)
2. Team features (share contracts with colleagues)
3. Analytics dashboard (contracts per agent, completion rates)
4. Email integration (send contracts directly to clients)
5. Mobile app (React Native with shared business logic)
6. Advanced AI features (suggest contingencies based on property type)"

**Q: How do you handle AI hallucinations or errors?**
A: "Multiple safeguards:
- Structured outputs with Zod validation
- Explicit confirmation of every field
- User can override any AI-populated field
- Temperature set to 0.7 for balance of creativity and accuracy
- System prompt constrains AI to specific task
- For production, I'd add human-in-the-loop review for critical fields"

---

## 💡 Additional Features to Mention (If Time)

**Easy Wins for V2:**
- **Agent Templates:** Save common buyer/property types for one-click generation
- **Voice Commands:** "Start over", "Go back", "Repeat that"
- **Multi-language:** Spanish is huge in CA real estate
- **Offline Mode:** PWA with local storage, sync when online
- **Export Options:** Word doc, Google Docs integration

**GTM Engineering Tie-ins:**
- "This same pattern works for RFP responses"
- "Sales could generate custom proposals while on client calls"
- "Support could create resolution summaries via voice"
- "Marketing could generate personalized case studies"

---

## 📝 Code Quality Standards

### Comments & Documentation
```typescript
// GOOD: Explain WHY, not WHAT
// Use streaming to provide real-time feedback during long AI operations
// This improves perceived performance and keeps users engaged
const stream = await streamText({ ... });

// GOOD: Document Vercel-specific patterns
// AI SDK automatically handles streaming responses via .toAIStreamResponse()
// This works seamlessly with Next.js App Router streaming
return result.toAIStreamResponse();

// GOOD: Note interview-relevant decisions
// Using Zod for structured outputs demonstrates type-safe AI integration
// This pattern prevents hallucinations by constraining AI output format
const result = await generateObject({
  schema: contractSchema,
  ...
});
```

### Error Handling
```typescript
// ALWAYS handle errors gracefully
try {
  const transcription = await openai.audio.transcriptions.create({ ... });
  return Response.json({ text: transcription.text });
} catch (error) {
  console.error('Transcription failed:', error);
  return Response.json(
    { error: 'Failed to transcribe audio. Please try again.' },
    { status: 500 }
  );
}
```

### TypeScript Best Practices
```typescript
// Use Zod for runtime validation + TypeScript types
export const contractSchema = z.object({
  propertyAddress: z.string().min(5),
  purchasePrice: z.number().positive(),
  // ...
});

export type ContractData = z.infer<typeof contractSchema>;

// Type all API responses
type TranscriptionResponse = {
  text: string;
  error?: string;
};
```

---

## 🎬 Pre-Interview Checklist

### Technical Preparation
- [ ] App deployed to Vercel with custom domain (if possible)
- [ ] All features working on production
- [ ] Test in Chrome, Firefox, Safari
-