'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStyleStore } from '@/store/useStyleStore'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AdvisorChatProps {
  context: {
    season: string
    faceShape: string
    bodyProportions: any
    gender: string
    culturalContext: string
  }
}

export function AdvisorChat({ context }: AdvisorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Aria, your personal style advisor. Ask me anything about your palette, outfits, or what to wear for any occasion.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.reason || data.message || 'Failed to get response')
        return
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[500px] flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-paper)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-gold)] text-sm font-bold text-[var(--color-ink)]">
          A
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-ink)]">Aria</p>
          <p className="text-xs text-[var(--color-muted)]">Your style advisor</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-[var(--color-gold)] text-[var(--color-ink)]'
                  : 'bg-[var(--color-border)] text-[var(--color-slate)]'
              }`}
            >
              {msg.content}
            </motion.div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl bg-[var(--color-border)] px-4 py-2.5">
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-muted)]" />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-muted)] [animation-delay:0.1s]" />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-muted)] [animation-delay:0.2s]" />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t border-[var(--color-border)] p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask Aria anything..."
          className="flex-1 rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)] outline-none focus:border-[var(--color-gold)]"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="rounded-lg bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
