'use client'

import { motion } from 'framer-motion'
import { Moon, Coffee, Timer, RefreshCcw } from 'lucide-react'

interface TiredVyanaProps {
    onRetry?: () => void
    message?: string
}

export default function TiredVyana({
    onRetry,
    message = "Vyana is tired due to too many requests, try after some time."
}: TiredVyanaProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-8 text-center relative z-20"
            style={{ filter: 'brightness(1.15) contrast(1.1)' }}
        >
            <div className="relative mb-12">
                {/* Sleeping Vyana Avatar/Icon */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, -2, 2, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-32 h-32 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center relative z-10"
                >
                    <Coffee className="w-16 h-16 text-amber-400 opacity-80" />

                    {/* Floating Zzz's */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, y: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            x: [20, 40, 50],
                            y: [0, -30, -50],
                            scale: [0.8, 1.2, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                        className="absolute -top-4 -right-4"
                    >
                        <Moon className="w-8 h-8 text-amber-300" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 15, y: 10 }}
                        animate={{
                            opacity: [0, 1, 0],
                            x: [15, 30, 40],
                            y: [10, -20, -40],
                            scale: [0.6, 1, 0.8]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                        className="absolute -top-2 -right-8"
                    >
                        <Moon className="w-6 h-6 text-amber-400" />
                    </motion.div>
                </motion.div>

                {/* Ambient Glow */}
                <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full -z-10" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-md"
            >
                <h3 className="text-3xl font-black text-white mb-4 flex items-center justify-center gap-3">
                    Vyana is taking a break
                </h3>
                <p className="text-white text-lg leading-relaxed mb-10 font-medium">
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold font-mono text-white">
                        <Timer className="w-4 h-4 text-amber-500" />
                        Quota resets soon
                    </div>

                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="group flex items-center gap-3 px-8 py-3 rounded-2xl bg-amber-400 text-black font-black text-base hover:bg-amber-300 transition-all active:scale-95 shadow-[0_0_25px_rgba(251,191,36,0.4)]"
                        >
                            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            Try Again
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}
