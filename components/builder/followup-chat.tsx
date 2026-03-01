'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, AlertCircle } from 'lucide-react'

interface FollowupChatProps {
    onRefine: (message: string) => void
    isLoading: boolean
    refinementCount: number
    maxRefinements?: number
}

export default function FollowupChat({
    onRefine,
    isLoading,
    refinementCount,
    maxRefinements = 5
}: FollowupChatProps) {
    const [message, setMessage] = useState('')
    const remaining = maxRefinements - refinementCount
    const isDisabled = isLoading || remaining <= 0

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim() && !isDisabled) {
            onRefine(message.trim())
            setMessage('')
        }
    }

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-30">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative group"
            >
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <div className="flex-1 relative flex items-center">
                            <div className="pl-4 text-green-400">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={remaining > 0 ? "What would you like to change? (e.g., 'Make it dark mode')" : "Refinement limit reached"}
                                disabled={isDisabled}
                                className="w-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-zinc-500 py-3 pl-3 pr-4"
                            />
                        </div>

                        <div className="flex items-center gap-3 pr-2">
                            {/* Counter */}
                            <div className="hidden sm:flex flex-col items-end">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${remaining <= 1 ? 'text-red-400' : 'text-zinc-500'}`}>
                                    {remaining} left
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={!message.trim() || isDisabled}
                                className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${!message.trim() || isDisabled
                                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                        : 'bg-green-500 text-black hover:bg-green-400 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,65,0.2)]'
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Progress Bar (at bottom of chat box) */}
                    <div className="absolute bottom-0 left-0 h-[2px] bg-zinc-800 w-full">
                        <motion.div
                            className="h-full bg-green-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(refinementCount / maxRefinements) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Limit Warning */}
                <AnimatePresence>
                    {remaining <= 1 && remaining > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -top-10 left-0 right-0 flex justify-center pointer-events-none"
                        >
                            <div className="bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1 flex items-center gap-2 backdrop-blur-md">
                                <AlertCircle className="w-3 h-3 text-red-500" />
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                                    Last refinement remaining
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
