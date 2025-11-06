'use client';

import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isDisabled?: boolean;
}

export function ChatInput({ onSend, isDisabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isDisabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white p-4">
      <div className="flex gap-3 mx-auto max-w-4xl">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your healthcare options..."
          disabled={isDisabled}
          className={cn(
            'flex-1 resize-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900',
            'focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
            'placeholder:text-slate-400',
            'min-h-[56px] max-h-[150px] transition-all'
          )}
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={isDisabled || !message.trim()}
          size="icon"
          className="h-[56px] w-[56px] shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:hover:bg-blue-600"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
