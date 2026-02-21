'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, Download, Loader2, Zap } from 'lucide-react'

interface BuilderTopBarProps {
    onBack: () => void
    onRegenerate: () => void
    onDownloadZip: () => void
    isLoading: boolean
    projectTitle?: string
}

export default function BuilderTopBar({
    onBack,
    onRegenerate,
    onDownloadZip,
    isLoading,
    projectTitle = 'vybex-generated-app',
}: BuilderTopBarProps) {
    return (
        <div
            className="flex items-center justify-between px-4 h-12 border-b border-border/60 flex-shrink-0"
            style={{
                background: 'rgba(10,10,10,0.9)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
            }}
        >
            {/* Left: Logo + project name */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div
                        className="w-6 h-6 rounded-md flex items-center justify-center"
                        style={{ background: '#00ff41', boxShadow: '0 0 12px rgba(0,255,65,0.5)' }}
                    >
                        <Zap className="w-3.5 h-3.5 text-black" />
                    </div>
                    <span className="text-sm font-bold text-foreground tracking-tight">Vybex AI</span>
                </div>
                <span className="text-border/60">|</span>
                <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                    {projectTitle}
                </span>

                {/* Loading pill */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20"
                    >
                        <Loader2 className="w-3 h-3 text-accent animate-spin" />
                        <span className="text-xs text-accent font-medium">Generating…</span>
                    </motion.div>
                )}
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onRegenerate}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border/60 text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-accent/5 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    Regenerate
                </button>

                <button
                    onClick={onDownloadZip}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border/60 text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-accent/5 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Download className="w-3.5 h-3.5" />
                    Download ZIP
                </button>

                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-card border border-border/60 text-foreground hover:border-accent/40 hover:bg-accent/5 transition-all duration-150"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                </button>
            </div>
        </div>
    )
}
