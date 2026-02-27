'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import { ArrowUp, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import VyanaAssistant from './vyana-assistant'

interface HeroSectionProps {
  onGenerate?: (prompt: string) => void
}

const MAX_CHARS = 1800

type Model = 'vyana1' | 'vyana2'

const MODEL_OPTIONS: { id: Model; label: string; badge: string; description: string }[] = [
  {
    id: 'vyana1',
    label: 'Vyana 1.0',
    badge: 'Builder',
    description: 'Generate a full landing page',
  },
  {
    id: 'vyana2',
    label: 'Vyana 2.0',
    badge: 'Architect',
    description: 'Design an AI workflow funnel',
  },
]

export default function HeroSection({ onGenerate }: HeroSectionProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState<Model>('vyana1')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const remaining = MAX_CHARS - prompt.length
  const activeModel = MODEL_OPTIONS.find(m => m.id === selectedModel)!

  const handleGenerate = () => {
    if (!prompt.trim()) return

    if (selectedModel === 'vyana2') {
      router.push(`/workflow?goal=${encodeURIComponent(prompt.trim())}`)
    } else {
      onGenerate?.(prompt)
    }
  }

  // Close dropdown on outside click
  const handleBlur = (e: React.FocusEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget as Node)) {
      setDropdownOpen(false)
    }
  }

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
            {/* Model selector top bar */}
            <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-border/40">
              <span className="text-xs text-muted-foreground font-medium">Model:</span>
              <div ref={dropdownRef} className="relative" onBlur={handleBlur}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background/60 hover:border-accent/40 transition-colors text-sm font-medium text-foreground"
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{
                      background: selectedModel === 'vyana2' ? 'rgba(0,255,65,0.15)' : 'rgba(255,255,255,0.08)',
                      color: selectedModel === 'vyana2' ? '#00ff41' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {activeModel.badge}
                  </span>
                  {activeModel.label}
                  <ChevronDown
                    className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200"
                    style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-border bg-card backdrop-blur-xl shadow-2xl overflow-hidden z-50"
                      style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)' }}
                    >
                      {MODEL_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSelectedModel(option.id)
                            setDropdownOpen(false)
                          }}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${selectedModel === option.id
                              ? 'bg-accent/5 border-l-2 border-accent'
                              : 'hover:bg-white/5 border-l-2 border-transparent'
                            }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-semibold text-foreground">{option.label}</span>
                              <span
                                className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                                style={{
                                  background: option.id === 'vyana2' ? 'rgba(0,255,65,0.15)' : 'rgba(255,255,255,0.08)',
                                  color: option.id === 'vyana2' ? '#00ff41' : 'rgba(255,255,255,0.5)',
                                }}
                              >
                                {option.badge}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                          {selectedModel === option.id && (
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Vyana 2.0 badge hint */}
              <AnimatePresence>
                {selectedModel === 'vyana2' && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    className="text-[10px] text-accent/60 font-medium italic"
                  >
                    ✦ Workflow Architect mode
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value.slice(0, MAX_CHARS))}
              placeholder={
                selectedModel === 'vyana2'
                  ? 'Describe your goal — e.g. build a pitch deck, grow Instagram, create a logo, launch a SaaS MVP…'
                  : 'Describe your startup, the problem you solve, your target audience, and key features…'
              }
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 resize-none outline-none px-6 pt-5 pb-4 text-base leading-relaxed min-h-[140px] md:min-h-[120px]"
              rows={4}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  handleGenerate()
                }
              }}
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
                  <div className="hidden md:block">
                    <VyanaAssistant
                      onTranscript={(text) => {
                        setPrompt(prev => {
                          const trimmedText = text.trim()
                          return (prev + (prev ? ' ' : '') + trimmedText).slice(0, MAX_CHARS)
                        })
                      }}
                      onGenerate={(text) => {
                        setPrompt(prev => {
                          const newPrompt = prev + (text ? (prev ? ' ' : '') + text : '')
                          setTimeout(() => {
                            if (selectedModel === 'vyana2') {
                              router.push(`/workflow?goal=${encodeURIComponent(newPrompt.trim())}`)
                            } else {
                              onGenerate?.(newPrompt)
                            }
                          }, 0)
                          return newPrompt
                        })
                      }}
                    />
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-background font-semibold text-sm hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex-1 sm:flex-initial disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                    style={{ boxShadow: '0 0 20px rgba(0,255,65,0.3)' }}
                  >
                    {selectedModel === 'vyana2' ? 'Design Workflow' : 'Generate Now'}
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
