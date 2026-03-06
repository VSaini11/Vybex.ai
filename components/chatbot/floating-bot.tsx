'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Sparkles, MessageCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
import chatbotAnimation from '@/public/Chatbot.json'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface FloatingBotProps {
  onClick: () => void
  isOpen: boolean
}

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
    backgroundColor: 'rgba(0, 0, 0, 0)',
    transition: {
      x: { duration: 0.8, ease: "anticipate" },
      y: { duration: 0.5 },
      rotate: { duration: 0.3 },
      backgroundColor: { duration: 0.3 }
    }
  },
  open: {
    x: 0,
    y: 0,
    rotate: 90,
    backgroundColor: 'var(--background)',
    transition: {
      x: { duration: 0.5, ease: "anticipate" },
      rotate: { duration: 0.3 },
      backgroundColor: { duration: 0.3 }
    }
  },
  roaming: {
    x: 'calc(-100vw + 8rem)',
    y: 0,
    rotate: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    transition: {
      x: { duration: 25, ease: "linear" }
    }
  },
  bouncing: {
    x: 'calc(-100vw + 8rem)',
    y: [0, -20, 0],
    rotate: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    transition: {
      y: { 
        repeat: Infinity, 
        duration: 1.5, 
        ease: "easeInOut" 
      }
    }
  }
}

export default function FloatingBot({ onClick, isOpen }: FloatingBotProps) {
  const [isIdle, setIsIdle] = useState(false)
  const [hasReachedLeft, setHasReachedLeft] = useState(false)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)

  const resetIdleTimer = useCallback(() => {
    setIsIdle(false)
    setHasReachedLeft(false)
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    
    if (!isOpen) {
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true)
      }, 3000)
    }
  }, [isOpen])

  useEffect(() => {
    resetIdleTimer()
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [resetIdleTimer, isOpen])

  // Determine current active variant
  let activeVariant = 'base'
  if (isOpen) {
    activeVariant = 'open'
  } else if (isIdle) {
    activeVariant = hasReachedLeft ? 'bouncing' : 'roaming'
  }

  return (
    <div className="fixed bottom-6 right-6 z-[101]">
      <AnimatePresence>
        {isIdle && !hasReachedLeft && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-full mb-4 left-0 right-0 flex justify-center translate-x-[calc(-100vw+8rem)]"
            style={{ 
              x: isIdle ? 'calc(-100vw + 8rem)' : 0, // This is technically inaccurate, let's fix it below
            }}
          >
            {/* We wrap the whole thing in a motion.div that follows the button */}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={botVariants}
        animate={activeVariant}
        onAnimationComplete={(definition) => {
          if (definition === 'roaming') {
            setHasReachedLeft(true)
          }
        }}
        className="relative"
      >
        <AnimatePresence>
          {isIdle && !hasReachedLeft && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background border border-border px-3 py-1.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              I'm going for a walk 🚶
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={(e) => {
            resetIdleTimer()
            onClick()
          }}
          onMouseEnter={resetIdleTimer}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,65,0.4)] border-accent/0 preserve-3d will-change-transform ${
            isOpen ? 'border-border overflow-hidden' : ''
          }`}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {!isOpen && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="absolute inset-0 bg-accent rounded-full blur-xl"
              />
            )}

            <div className="relative z-10 w-full h-full">
              <motion.div
                initial={false}
                animate={{ 
                  opacity: isOpen ? 0 : 1,
                  scale: isOpen ? 0.5 : 1.1,
                  pointerEvents: isOpen ? 'none' : 'auto'
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full"
              >
                <MemoizedLottie />
              </motion.div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: -90 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex items-center justify-center bg-background"
                  >
                    <Sparkles className="w-8 h-8 text-accent" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.button>
      </motion.div>
    </div>
  )
}
