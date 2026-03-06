'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowUp, ChevronDown, Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import VyanaAssistant from './vyana-assistant'
import { sessionStore } from '@/lib/session-store'

interface HeroSectionProps {
  onGenerate?: (prompt: string) => void
}

const MAX_CHARS = 1800

type Model = 'vyana1' | 'vyana2' | 'vyana3'

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
  {
    id: 'vyana3',
    label: 'Vyana 3.0',
    badge: 'Extractor',
    description: 'Extract info from docs/images',
  },
]

export default function HeroSection({ onGenerate }: HeroSectionProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState<Model>('vyana1')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [file, setFile] = useState<{ name: string; base64: string; mimeType: string } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const remaining = MAX_CHARS - prompt.length
  const activeModel = MODEL_OPTIONS.find(m => m.id === selectedModel)!

  const prevModelRef = useRef<Model>(selectedModel)


  const handleGenerate = useCallback(() => {
    if (!prompt.trim() && !file) return

    if (selectedModel === 'vyana2') {
      router.push(`/workflow?goal=${encodeURIComponent(prompt.trim())}`)
    } else if (selectedModel === 'vyana3') {
      const storageKey = `vyana3_upload_${Date.now()}`
      if (file) {
        sessionStore.set(storageKey, file)
      }
      router.push(`/extract?prompt=${encodeURIComponent(prompt.trim())}${file ? `&fileKey=${storageKey}` : ''}`)
    } else {
      onGenerate?.(prompt)
    }
  }, [prompt, file, selectedModel, router, onGenerate])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result?.toString().split(',')[1] || ''
      setFile({
        name: selectedFile.name,
        base64,
        mimeType: selectedFile.type
      })
    }
    reader.readAsDataURL(selectedFile)
  }

  // Close dropdown on outside click
  const handleBlur = (e: React.FocusEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget as Node)) {
      setDropdownOpen(false)
    }
  }

  // Callback stability for VyanaAssistant
  const handleTranscript = useCallback((text: string) => {
    setPrompt(prev => {
        const trimmedText = text.trim()
        return (prev + (prev ? ' ' : '') + trimmedText).slice(0, MAX_CHARS)
    })
  }, [])

  const handleAssistantGenerate = useCallback((text: string) => {
    setPrompt(prev => {
        const newPrompt = prev + (text ? (prev ? ' ' : '') + text : '')
        // Use a microtask to handle navigation after state update
        Promise.resolve().then(() => {
            if (selectedModel === 'vyana2') {
                router.push(`/workflow?goal=${encodeURIComponent(newPrompt.trim())}`)
            } else {
                onGenerate?.(newPrompt)
            }
        })
        return newPrompt
    })
  }, [selectedModel, router, onGenerate])

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

              {/* Vyana 2.0 / 3.0 badge hint */}
              <AnimatePresence>
                {(selectedModel === 'vyana2' || selectedModel === 'vyana3') && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    className="text-[10px] text-accent/60 font-medium italic"
                  >
                    ✦ {selectedModel === 'vyana2' ? 'Workflow Architect mode' : 'Multimodal Extractor mode'}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* File Preview (Vyana 3.0) */}
            <AnimatePresence>
              {selectedModel === 'vyana3' && file && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pt-3"
                >
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-accent/5 border border-accent/20 w-fit">
                    {file.mimeType.startsWith('image/') ? (
                      <ImageIcon className="w-4 h-4 text-accent" />
                    ) : (
                      <FileText className="w-4 h-4 text-accent" />
                    )}
                    <span className="text-xs text-foreground/80 font-medium">{file.name}</span>
                    <button
                      onClick={() => setFile(null)}
                      className="p-1 hover:bg-accent/10 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value.slice(0, MAX_CHARS))}
              placeholder={
                selectedModel === 'vyana2'
                  ? 'Describe your goal — e.g. build a pitch deck, grow Instagram, create a logo, launch a SaaS MVP…'
                  : selectedModel === 'vyana3'
                    ? 'What should I do with this file? E.g. summarize it, extract info, what color is the sky in this image?'
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
                {selectedModel === 'vyana3' && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,application/pdf,text/plain"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-xl border border-border bg-background/60 hover:border-accent/40 transition-colors text-muted-foreground hover:text-foreground"
                      title="Attach File"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </>
                )}
                <span className="text-xs text-muted-foreground tabular-nums">
                  {prompt.length}/{MAX_CHARS}
                </span>
                <div className="flex items-center gap-3 flex-1 sm:flex-initial">
                  <div className="hidden md:block">
                    <VyanaAssistant
                      onTranscript={handleTranscript}
                      onGenerate={handleAssistantGenerate}
                    />
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() && !file}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-background font-semibold text-sm hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex-1 sm:flex-initial disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                    style={{ boxShadow: '0 0 20px rgba(0,255,65,0.3)' }}
                  >
                    {selectedModel === 'vyana2' ? 'Design Workflow' : selectedModel === 'vyana3' ? 'Extract Info' : 'Generate Now'}
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
