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
            className="flex flex-col items-center justify-center p-8 text-center"
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
                <h3 className="text-2xl font-black text-white mb-4 flex items-center justify-center gap-3">
                    Vyana is taking a break
                </h3>
                <p className="text-white/50 text-base leading-relaxed mb-10">
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/40">
                        <Timer className="w-3.5 h-3.5" />
                        Quota resets soon
                    </div>

                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="group flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all active:scale-95"
                        >
                            <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                            Try Again
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}
