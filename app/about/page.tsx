'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import Navbar from '@/components/navbar'
import FinalCTA from '@/components/final-cta'
import VybeteraSection from '@/components/about/vybetera-section'

const MODELS = [
  {
    version: 'Vyana 1.0',
    title: 'Landing Page Generator',
    description: 'The foundation of Vybex AI. Vyana 1.0 is an AI-powered landing page generator that allows users to create clean, modern, and impressive landing pages in just 5 minutes. It simplifies the process by quickly generating structured layouts, UI components, and ready-to-use designs, helping users launch professional-looking pages without spending hours on design and development.',
    image: '/1.png',
    features: ['Builder', 'Generator', 'Design'],
    accent: '#d8e2db'
  },
  {
    version: 'Vyana 2.0',
    title: 'Workflow Architecture Engine',
    description: 'Vyana 2.0 is an AI-powered workflow architecture engine that helps users plan and build projects step-by-step. Instead of just giving ideas, it creates a complete execution path—suggesting the right tools for each stage of development and generating ready-to-use prompts for those tools. This allows users to quickly move from an idea to a structured workflow and start building efficiently.',
    image: '/2.png',
    features: ['Workflow Architecture', 'Tool Suggestion', 'Prompt Generation'],
    accent: '#c4290e'
  },
  {
    version: 'Vyana 3.0',
    title: 'Multimodal AI Analysis Engine',
    description: 'Vyana 3.0 is an AI-powered model that analyzes documents, images, and visual data to extract meaningful insights. Users can simply upload a file and ask questions about it, and Vyana intelligently understands the content, interprets the information, and provides clear explanations, insights, and contextual understanding in seconds',
    image: '/3.png',
    features: ['Multimodal', 'Insights', 'Intelligence'],
    accent: '#00ff41'
  }
]

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Use scroll progress to determine active index
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const index = Math.min(
        Math.floor(latest * MODELS.length),
        MODELS.length - 1
      )
      if (index !== activeIndex) {
        setActiveIndex(index)
      }
    })
    return () => unsubscribe()
  }, [scrollYProgress, activeIndex])

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_70%)] opacity-[0.03] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              The Evolution of <span className="text-accent underline decoration-accent/30 underline-offset-8">Intelligence</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Meet the Vyana models—the architects behind your next big idea.
              Our journey from simple layouts to complex digital ecosystems.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Scroll Showcase */}
      <section ref={containerRef} className="relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">

            {/* Sticky Left: Image */}
            <div className="hidden md:flex sticky top-0 w-full md:w-1/2 h-screen items-center justify-center py-12">
              <div className="relative w-full aspect-square max-h-[70vh] group">
                {/* Background glow that changes with the model */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`glow-${activeIndex}`}
                    className="absolute -inset-10 rounded-[3rem] opacity-20 blur-3xl transition-opacity duration-1000"
                    style={{ background: MODELS[activeIndex].accent }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  />
                </AnimatePresence>

                <div className="relative h-full rounded-2xl overflow-hidden border border-white/10 shadow-3xl bg-[#0a0a0a]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0.2, scale: 1.05, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0.2, scale: 0.98, filter: 'blur(8px)' }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute inset-0"
                    >
                      <img
                        src={MODELS[activeIndex].image}
                        alt={MODELS[activeIndex].version}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <div className="absolute bottom-8 left-8">
                        <motion.span
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase bg-accent text-black shadow-[0_0_30px_rgba(0,255,65,0.4)]"
                        >
                          {MODELS[activeIndex].version}
                        </motion.span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Scrollable Right: Info */}
            <div className="w-full md:w-1/2">
              {MODELS.map((model, index) => (
                <motion.div
                  key={model.version}
                  initial={{ opacity: 0.2 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ margin: "-30% 0px -30% 0px", once: false }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col justify-center min-h-[60vh] md:min-h-screen py-12 md:py-20"
                >
                  {/* Mobile Image (only visible on mobile) */}
                  <div className="md:hidden mb-12 relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src={model.image} alt={model.version} className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 left-4 font-bold text-accent bg-black/60 px-3 py-1 rounded-lg">
                      {model.version}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                      {model.title}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                      {model.description}
                    </p>

                    <div className="flex flex-wrap gap-3 pt-4">
                      {model.features.map(feature => (
                        <span
                          key={feature}
                          className="px-4 py-2 rounded-xl text-sm border border-white/5 bg-white/[0.03] text-foreground/80 hover:bg-white/[0.08] transition-colors"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <VybeteraSection />

      <div className="mt-32">
        <FinalCTA />
      </div>
    </main>
  )
}
