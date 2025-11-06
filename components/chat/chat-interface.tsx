'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';

interface ChatInterfaceProps {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
  }>;
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInterface({ messages, onSend, isLoading }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Only auto-scroll if:
    // 1. A new message was added (length changed), OR
    // 2. We're currently loading (streaming response)
    const messagesLengthChanged = messages.length !== prevMessagesLengthRef.current;

    if (messagesLengthChanged || isLoading) {
      // Check if user is near the bottom before auto-scrolling
      const container = messagesContainerRef.current;
      if (container) {
        const isNearBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight < 100;

        // Only auto-scroll if user is already near the bottom
        if (isNearBottom || messagesLengthChanged) {
          scrollToBottom();
        }
      } else {
        scrollToBottom();
      }
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, isLoading]);

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Welcome to Healthcare Plan Advisor
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  I'll help you choose the best healthcare plan for 2025-2026 by asking about
                  your family, health needs, and expected usage. Let's get started!
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id || index}
                  message={message}
                  isLoading={false}
                />
              ))}
              {isLoading && (
                <ChatMessage
                  message={{ role: 'assistant', content: '' }}
                  isLoading={true}
                />
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <ChatInput onSend={onSend} isDisabled={isLoading} />
    </div>
  );
}
