'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FileCode2, Loader2, CheckCircle2, Terminal, AlertCircle } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

interface LogEntry {
    type: 'step' | 'file' | 'error'
    message: string
    timestamp: number
    status?: 'loading' | 'done' | 'error'
}

interface GenerationLogProps {
    status: string | null
    isLoading: boolean
    error: string | null
}

export default function GenerationLog({ status, isLoading, error }: GenerationLogProps) {
    const [history, setHistory] = useState<LogEntry[]>([])
    const lastStatus = useRef<string | null>(null)

    useEffect(() => {
        if (status && status !== lastStatus.current) {
            // Check if last item was a "loading" step, mark it as done
            setHistory(prev => {
                const newHistory = [...prev]
                if (newHistory.length > 0 && newHistory[newHistory.length - 1].status === 'loading') {
                    newHistory[newHistory.length - 1].status = 'done'
                }

                // Add new status
                newHistory.push({
                    type: status.toLowerCase().includes('.') ? 'file' : 'step',
                    message: status,
                    timestamp: Date.now(),
                    status: 'loading'
                })
                return newHistory
            })
            lastStatus.current = status
        }
    }, [status])

    // Handle error logging
    useEffect(() => {
        if (error) {
            setHistory(prev => [
                ...prev,
                {
                    type: 'error',
                    message: error,
                    timestamp: Date.now(),
                    status: 'error'
                }
            ])
        }
    }, [error])

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] text-white/90 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-none">
                {/* Initializing Log */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-white/40 font-mono">
                    &gt; Initializing Vybex Builder...
                </motion.div>

                {history.map((entry, idx) => (
                    <div key={idx} className="space-y-4">
                        {entry.type === 'error' ? (
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <div>
                                    <div className="font-bold mb-1">Build Error</div>
                                    <div className="opacity-80">{entry.message}</div>
                                </div>
                            </div>
                        ) : (
                            <LogItem
                                message={entry.message}
                                status={entry.status}
                                isFile={entry.type === 'file'}
                            />
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-center gap-3 px-2 py-4 text-white/40">
                        <Loader2 className="w-4 h-4 animate-spin text-accent" />
                        <span className="text-sm font-medium animate-pulse">Processing generation request...</span>
                    </div>
                )}
            </div>

            {/* Bottom Footer */}
            <div className="p-4 border-t border-white/5 bg-[#0d0d0d] space-y-3">
                <div className="flex items-center justify-between text-[11px] text-white/40">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <span>AI Generation Engine Active</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Upgrade to Team</span>
                        <button className="text-accent hover:underline font-medium">Upgrade Plan</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LogItem({ message, status, isFile }: { message: string, status?: string, isFile?: boolean }) {
    const isDone = status === 'done'
    const isLoading = status === 'loading'

    // Attempt to parse out file name if it looks like one
    const fileName = message.includes('/') ? message.split('/').pop() : (message.endsWith('.tsx') || message.endsWith('.css') ? message : null)
    const filePath = message.includes('/') ? message : `/components/${fileName}`

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            <div className={`text-sm md:text-[15px] leading-relaxed font-medium transition-colors duration-500 ${isDone ? 'text-white/30' : 'text-white'}`}>
                {message.startsWith('Now') ? message : `Now let me create the ${message}:`}
            </div>

            {isLoading && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 max-w-md shadow-2xl"
                >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                        {message.toLowerCase().includes('css') ? (
                            <Terminal className="w-5 h-5 text-accent" />
                        ) : (
                            <FileCode2 className="w-5 h-5 text-accent" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{fileName || 'Building...'}</div>
                        <div className="text-[11px] text-white/30 truncate">{filePath}</div>
                    </div>
                    <Loader2 className="w-4 h-4 animate-spin text-accent/50" />
                </motion.div>
            )}

            {isDone && (
                <div className="flex items-center gap-2 text-xs text-accent/40 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Module established successfully</span>
                </div>
            )}
        </motion.div>
    )
}
