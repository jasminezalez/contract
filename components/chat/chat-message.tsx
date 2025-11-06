'use client';

import { cn } from '@/lib/utils';
import { Bot, User, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setLoadingTime(0);
      const interval = setInterval(() => {
        setLoadingTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <div
      className={cn(
        'flex w-full gap-3 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          ) : (
            <Bot className="h-5 w-5 text-white" />
          )}
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 shadow-sm',
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white'
            : 'bg-white border-2 border-slate-100 text-slate-900'
        )}
      >
        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-blue-600">
                <span className="animate-pulse">Thinking</span>
                <span className="animate-bounce">●</span>
                <span className="animate-bounce" style={{ animationDelay: '0.15s' }}>
                  ●
                </span>
                <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>
                  ●
                </span>
              </div>
              {loadingTime > 10 && (
                <div className="text-xs text-slate-500 italic">
                  Still working on it... ({loadingTime}s)
                </div>
              )}
            </div>
          ) : (
            message.content
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700 shadow-md">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
}
