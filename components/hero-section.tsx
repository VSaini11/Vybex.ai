'use client'

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { ArrowUp, Mic } from 'lucide-react'
import VyanaAssistant from './vyana-assistant'

interface HeroSectionProps {
  onGenerate?: (prompt: string) => void
}

const MAX_CHARS = 1800



export default function HeroSection({ onGenerate }: HeroSectionProps) {
  const [prompt, setPrompt] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const remaining = MAX_CHARS - prompt.length

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-12 pb-24 overflow-hidden">
      {/* Subtle background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/4 rounded-full blur-[100px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { x1: -80, y1: 60, x2: 120, y2: -140 },
          { x1: 150, y1: -90, x2: -60, y2: 180 },
          { x1: -170, y1: -50, x2: 90, y2: 70 },
          { x1: 40, y1: 190, x2: -130, y2: -80 },
          { x1: -100, y1: 130, x2: 160, y2: -30 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full opacity-40"
            initial={{ x: pos.x1, y: pos.y1 }}
            animate={{ x: pos.x2, y: pos.y2, opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
            style={{ top: '40%', left: '50%' }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto w-full text-center">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-bold leading-[1.1] tracking-tight mb-6">
            <span className="block text-accent text-5xl md:text-7xl">
              Think it
            </span>
            <span className="block text-foreground text-4xl md:text-6xl mt-2">
              Vyana Builds it.
            </span>
          </h1>
        </motion.div>

        <br />

        {/* CTA Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="relative rounded-2xl border border-border bg-card/70 backdrop-blur-md shadow-2xl overflow-hidden"
            style={{ boxShadow: '0 0 60px rgba(0,255,65,0.06), 0 25px 50px rgba(0,0,0,0.5)' }}
          >
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Describe your startup, the problem you solve, your target audience, and key features…"
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 resize-none outline-none px-6 pt-6 pb-4 text-base leading-relaxed min-h-[160px] md:min-h-[140px]"
              rows={5}
            />

            {/* Bottom bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 px-6 py-4 border-t border-border/60">
              {/* Language badge */}
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <span className="text-xs text-muted-foreground font-medium">Language:</span>
                <div className="flex items-center gap-1.5 border border-border bg-background/60 rounded-lg px-3 py-1.5 text-sm text-foreground cursor-pointer hover:border-accent/40 transition-colors">
                  English
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted-foreground ml-0.5">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Char count + button */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {prompt.length}/{MAX_CHARS}
                </span>
                <div className="flex items-center gap-3 flex-1 sm:flex-initial">
                  <VyanaAssistant
                    onTranscript={(text) => setPrompt(prev => prev + (prev ? ' ' : '') + text)}
                    onGenerate={(text) => {
                      setPrompt(prev => {
                        const newPrompt = prev + (text ? (prev ? ' ' : '') + text : '')
                        setTimeout(() => {
                          onGenerate?.(newPrompt)
                        }, 0)
                        return newPrompt
                      })
                    }}
                  />
                  <button
                    onClick={() => onGenerate?.(prompt)}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-background font-semibold text-sm hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex-1 sm:flex-initial"
                    style={{ boxShadow: '0 0 20px rgba(0,255,65,0.3)' }}
                  >
                    Generate Now
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>




      </div>
    </section>
  )
}
