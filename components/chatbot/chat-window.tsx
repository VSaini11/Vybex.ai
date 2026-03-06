'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Bot, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'bot'
  content: string
  modelId?: string
}

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

const MAX_VISIBLE_MESSAGES = 20

const ChatMessage = React.memo(({ message }: { message: Message }) => {
  const highlightModelNames = (text: string) => {
    const parts = text.split(/(Vyana [123]\.0)/g)
    return parts.map((part, i) => {
      if (part.match(/Vyana [123]\.0/)) {
        return (
          <span 
            key={i} 
            className="px-1.5 py-0.5 rounded-md bg-accent/20 text-accent font-bold border border-accent/20 mx-0.5 shadow-[0_0_10px_rgba(0,255,65,0.1)] whitespace-nowrap"
          >
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: message.role === 'user' ? 10 : -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
    >
      <div
        className={`max-w-[85%] p-3 rounded-2xl text-sm ${message.role === 'user'
          ? 'bg-accent text-background rounded-tr-none font-medium'
          : 'bg-white/[0.03] border border-white/5 text-foreground rounded-tl-none leading-relaxed'
          }`}
      >
        {highlightModelNames(message.content)}
      </div>

    </motion.div>
  )
})

ChatMessage.displayName = 'ChatMessage'

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hi! I\'m VybeTera. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => {
        const next: Message[] = [...prev, userMessage]
        return next.slice(-MAX_VISIBLE_MESSAGES)
    })
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage].slice(-5) })
      })

      const data = await response.json()
      if (data.text) {
        setMessages(prev => {
           const next: Message[] = [...prev, { 
             role: 'bot', 
             content: data.text,
             modelId: data.modelId
           }]
           return next.slice(-MAX_VISIBLE_MESSAGES)
        })
      } else {
        setMessages(prev => {
          const next: Message[] = [...prev, { role: 'bot', content: 'Sorry, I encountered an error. Please try again later.' }]
          return next.slice(-MAX_VISIBLE_MESSAGES)
        })
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => {
        const next: Message[] = [...prev, { role: 'bot', content: 'Sorry, I encountered an error. Please try again later.' }]
        return next.slice(-MAX_VISIBLE_MESSAGES)
      })
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages])


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-6 w-[350px] md:w-[400px] h-[500px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-[100] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-border bg-accent/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Bot className="w-5 h-5 text-background" />
              </div>
              <div>
                <h3 className="text-sm font-bold">VybeTera</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/5 rounded-full text-muted-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(circle_at_bottom_right,_var(--accent)_0%,_transparent_15%)]"
          >
            {messages.map((m, i) => (
              <ChatMessage key={`${i}-${m.role}`} message={m} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                      className="w-1.5 h-1.5 rounded-full bg-accent/50"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask VybeTera..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-accent/50 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`absolute right-2 p-2 rounded-lg transition-all ${input.trim() && !isLoading
                  ? 'text-accent hover:bg-accent/10'
                  : 'text-muted-foreground'
                  }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
