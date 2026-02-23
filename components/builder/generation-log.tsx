'use client'

import { motion } from 'framer-motion'
import { FileCode2, Loader2, CheckCircle2, Terminal } from 'lucide-react'

interface LogEntry {
    type: 'step' | 'file' | 'info'
    message: string
    timestamp: number
    status?: 'loading' | 'done' | 'pending'
}

interface GenerationLogProps {
    status: string | null
    isLoading: boolean
}

export default function GenerationLog({ status, isLoading }: GenerationLogProps) {
    // In a real app, we'd accumulate status history. 
    // Since we only get the current status from props, we'll simulate a log list or just show the current one beautifully.
    // For now, let's create a robust UI that looks like the image.

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] text-white/90 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-none">
                {/* Simulated build steps to match the image style */}
                <LogItem
                    message="Now let me create the main landing page with components. I'll create a header, hero section, features, and footer."
                />
                <LogItem
                    message="Built website pages"
                    isDone
                />

                {activeStatus(status)}

                {isLoading && (
                    <div className="flex items-center gap-3 px-2 py-4 text-white/40">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium animate-pulse">Designing next component...</span>
                    </div>
                )}
            </div>

            {/* Bottom Footer - matches the image's "Upgrade to Team" area style */}
            <div className="p-4 border-t border-white/5 bg-[#0d0d0d] space-y-3">
                <div className="flex items-center justify-between text-[11px] text-white/40">
                    <div className="flex items-center gap-2">
                        <span>Upgrade to Team for more credits</span>
                    </div>
                    <button className="text-accent hover:underline font-medium">Upgrade Plan</button>
                </div>
            </div>
        </div>
    )
}

function LogItem({ message, isDone, isFile }: { message: string, isDone?: boolean, isFile?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <div className={`text-sm md:text-[15px] leading-relaxed ${isDone ? 'text-white/40' : 'text-white shadow-[0_0_20px_rgba(255,255,255,0.02)]'}`}>
                {message}
            </div>
            {isDone && (
                <div className="flex items-center gap-2 text-xs text-white/30">
                    <FileCode2 className="w-3.5 h-3.5" />
                    <span>{isFile ? 'Created' : 'Built'} component</span>
                </div>
            )}
        </motion.div>
    )
}

function activeStatus(status: string | null) {
    if (!status) return null
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
        >
            <div className="text-sm md:text-[15px] text-white">
                Now let me create the {status}:
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 max-w-sm">
                <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white/90 truncate">{status.toLowerCase()}.tsx</div>
                    <div className="text-[10px] text-white/30 truncate">/components/{status.toLowerCase()}.tsx</div>
                </div>
            </div>
        </motion.div>
    )
}
