"use client"

import { useEffect, useRef } from 'react'
import { Message } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import { User, Bot } from 'lucide-react'

// Conversation Display Component
// Shows chat-style conversation between user and AI

interface ConversationDisplayProps {
  messages: Message[]
  isLoading?: boolean
}

export function ConversationDisplay({ messages, isLoading = false }: ConversationDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className="flex flex-col space-y-4 p-4 max-h-96 overflow-y-auto bg-gray-50 rounded-lg">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3",
            message.role === 'user' && "flex-row-reverse"
          )}
        >
          {/* Avatar */}
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            message.role === 'user' ? "bg-blue-500" : "bg-gray-700"
          )}>
            {message.role === 'user' ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>

          {/* Message Bubble */}
          <div className={cn(
            "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
            message.role === 'user'
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-200"
          )}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-white border border-gray-200">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} />
    </div>
  )
}