# Healthcare Plan AI Advisor

An AI-powered chatbot that helps employees choose the best healthcare plan through natural conversation. Built with Next.js 16, Vercel AI SDK v5, and OpenAI GPT-3.5-turbo.

## Features

- 🤖 Natural conversational AI that asks clarifying questions
- 💰 Accurate cost calculations for all 5 healthcare plans
- 📊 Visual cost comparisons and breakdowns
- 🏥 HSA benefits explanation and recommendations
- 📱 Responsive design for mobile and desktop
- ⚡ Real-time streaming responses

## Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your OpenAI API key to .env.local
# OPENAI_API_KEY=sk-your-key-here

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Deployment to Vercel

### Option 1: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable when prompted:
# OPENAI_API_KEY = your-openai-api-key
```

### Option 2: Deploy via GitHub

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project" and select your repository
4. Add environment variable:
   - Name: `OPENAI_API_KEY`
   - Value: `your-openai-api-key`
5. Deploy!

Your app will be live at `https://your-project.vercel.app`

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **AI**: Vercel AI SDK v5 + OpenAI GPT-3.5-turbo
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Deployment**: Vercel

## Project Structure

```
├── app/
│   ├── api/chat/route.ts      # AI chat endpoint
│   ├── page.tsx               # Main chat interface
│   └── layout.tsx             # Root layout
├── lib/
│   ├── types.ts               # TypeScript types
│   ├── plans.ts               # Healthcare plan data
│   ├── cost-calculator.ts     # Cost calculation engine
│   └── ai-prompts.ts          # AI system prompts
├── components/
│   ├── chat/                  # Chat UI components
│   └── recommendations/       # Plan cards & charts
└── connect.md                 # Original requirements
```

## Cost Estimates

Using GPT-3.5-turbo:
- ~$0.002 per conversation
- For 100 conversations: ~$0.20 total
- Much cheaper than GPT-4!

## Healthcare Plans Included

### Silver Tier
- **Silver 3000 (PPO)** - FREE for employee-only
- **Silver HSA 2700** - Company contributes $100-200/month to HSA

### Gold Tier
- **Gold 1000 (PPO)** - Lowest deductible ($1,000)
- **Gold 2000 (PPO)** - Lowest out-of-pocket max ($5,750)
- **Gold HSA 1800** - Best coverage + HSA benefits

## How It Works

1. **User starts conversation** - AI greets and asks about family situation
2. **Discovery phase** - AI asks about health, usage, and preferences
3. **Cost calculation** - AI calls tool to calculate costs for all 5 plans
4. **Recommendation** - AI presents best plan with reasoning and comparisons
5. **Follow-up** - User can ask "what-if" questions

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

This is a demo application built for healthcare benefits enrollment.

## Support

For questions or issues, please check:
- [AppPlan.connect.md](AppPlan.connect.md) - Detailed build plan
- [connect.md](connect.md) - Original requirements
