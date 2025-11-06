'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ChatInterface } from '@/components/chat/chat-interface';
import { HeartPulse } from 'lucide-react';
import { WELCOME_MESSAGE } from '@/lib/ai-prompts';

export default function HomePage() {
  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        parts: [{ type: 'text', text: WELCOME_MESSAGE }],
      },
    ],
  });

  const handleSend = (message: string) => {
    sendMessage({ text: message });
  };

  // Convert messages to simpler format for ChatInterface
  const simplifiedMessages = messages.map(msg => ({
    id: msg.id,
    role: msg.role,
    content: msg.parts
      .filter(part => part.type === 'text') // Only get text parts
      .map(part => ('text' in part ? part.text : ''))
      .join(''),
  })).filter(msg => msg.content.trim() !== ''); // Remove empty messages

  const isLoading = status === 'submitted' || status === 'streaming';

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
              <HeartPulse className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-sm">
                2025-2026 Intrinsic Healthcare Plans
              </h1>
              <p className="text-sm text-blue-50">
                Find the best plan for you · Powered by AI
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto h-full max-w-7xl">
          <div className="grid h-full gap-6 lg:grid-cols-3 p-6">
            {/* Chat Area - Takes up 2 columns */}
            <div className="lg:col-span-2 h-[calc(100vh-200px)] rounded-lg border bg-white dark:bg-gray-900 shadow-sm">
              <ChatInterface
                messages={simplifiedMessages}
                onSend={handleSend}
                isLoading={isLoading}
              />
            </div>

            {/* Info Sidebar */}
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
                  <h2 className="text-base font-semibold text-white">
                    Available Plans
                  </h2>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div className="border-l-4 border-slate-300 pl-3">
                    <div className="font-semibold text-slate-700">Silver Tier</div>
                    <div className="text-slate-600 space-y-0.5 mt-1">
                      <div>• Silver 3000 (PPO)</div>
                      <div>• Silver HSA 2700</div>
                    </div>
                  </div>
                  <div className="border-l-4 border-amber-400 pl-3">
                    <div className="font-semibold text-slate-700">Gold Tier</div>
                    <div className="text-slate-600 space-y-0.5 mt-1">
                      <div>• Gold 1000 (PPO)</div>
                      <div>• Gold 2000 (PPO)</div>
                      <div>• Gold HSA 1800</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
                  <h2 className="text-base font-semibold text-white">
                    What to Know
                  </h2>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div>
                    <strong className="text-blue-600">HSA Plans:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Company contributes $100-200/month to your HSA - free money!
                    </p>
                  </div>
                  <div>
                    <strong className="text-blue-600">Employee-Only:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Silver 3000 is completely FREE
                    </p>
                  </div>
                  <div>
                    <strong className="text-blue-600">Families:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Consider total cost including dependents
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm p-4">
                <h2 className="text-base font-semibold mb-3 text-blue-900">
                  💡 Tips for Best Results
                </h2>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>✓ Be honest about your health</li>
                  <li>✓ Estimate doctor visits realistically</li>
                  <li>✓ Consider planned procedures</li>
                  <li>✓ Ask "what-if" questions</li>
                  <li>✓ This is not healthcare advice, just a prototype </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-600">
            Healthcare Plan AI Advisor · 2025-2026 Open Enrollment
          </p>
        </div>
      </footer>
    </div>
  );
}
