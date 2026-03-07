'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import dynamic from 'next/dynamic'
import chatbotAnimation from '@/public/Chatbot.json'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

// Memoized Lottie component to prevent unnecessary re-renders
const MemoizedLottie = React.memo(() => (
  <Lottie 
    animationData={chatbotAnimation} 
    loop={true}
    rendererSettings={{ 
      preserveAspectRatio: 'xMidYMid meet',
      progressiveLoad: false,
      hideOnTransparent: true 
    }}
    style={{ width: '100%', height: '100%' }}
  />
))

MemoizedLottie.displayName = 'MemoizedLottie'

const botVariants: Variants = {
  base: {
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      x: { duration: 0.8, ease: "anticipate" },
      y: { duration: 0.5 },
      rotate: { duration: 0.3 }
    }
  },
  roaming: {
    x: ['0%', '150%', '-150%', '100%', '-100%', '0%'],
    y: [0, -10, 0, -15, 0],
    rotate: [0, 5, -5, 10, -10, 0],
    transition: {
      x: { 
        duration: 20, 
        repeat: Infinity,
        ease: "easeInOut" 
      },
      y: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      },
      rotate: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
}

export default function VybeteraSection() {
  const [isIdle, setIsIdle] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)

  const stopIdleTimer = useCallback(() => {
    setIsIdle(false)
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = null
    }
  }, [])

  const startIdleTimer = useCallback(() => {
    stopIdleTimer()
    if (!isHovering) {
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true)
      }, 3000)
    }
  }, [isHovering, stopIdleTimer])

  useEffect(() => {
    startIdleTimer()
    return stopIdleTimer
  }, [startIdleTimer, stopIdleTimer])

  const activeVariant = isIdle && !isHovering ? 'roaming' : 'base'

  return (
    <section className="py-32 px-4 overflow-hidden relative">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Meet <span className="text-accent">Vybetera</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Our cute bot assistant. But he has a funny habit...
            </p>
          </div>

          <div className="relative h-64 flex items-center justify-center">
            {/* Background elements */}
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent bottom-0" />
            
            <motion.div
              variants={botVariants}
              animate={activeVariant}
              className="relative z-20 cursor-pointer"
              onMouseEnter={() => {
                setIsHovering(true)
                stopIdleTimer()
              }}
              onMouseLeave={() => {
                setIsHovering(false)
                startIdleTimer()
              }}
              onClick={() => {
                setIsIdle(false)
                startIdleTimer()
              }}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,255,65,0.2)] bg-background/50 backdrop-blur-sm border border-white/5 relative group">
                <div className="absolute inset-0 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors" />
                <div className="relative z-10 w-full h-full p-2">
                  <MemoizedLottie />
                </div>

                <AnimatePresence>
                  {isIdle && !isHovering && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 20 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium text-foreground/80 shadow-xl"
                    >
                      Bored... going for a walk 🚶‍♂️
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {isHovering && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 20 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-accent/90 backdrop-blur-md border border-accent px-3 py-1.5 rounded-full text-xs font-bold text-black shadow-xl"
                    >
                      I'm back! 😊
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Stage/Platform markers */}
            <div className="absolute bottom-8 left-1/4 w-2 h-2 rounded-full bg-white/5" />
            <div className="absolute bottom-8 right-1/4 w-2 h-2 rounded-full bg-white/5" />
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed italic">
              "If nobody interacts with him for some time, he gets bored and goes for a walk."
            </p>
            <p className="mt-4 text-base text-accent/80 font-medium">
              Touch him, and he quickly comes back to his place like a very obedient assistant.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Background glow enhancement */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  )
}
