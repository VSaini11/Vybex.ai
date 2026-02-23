'use client'

import { motion } from 'framer-motion'
import { X, Download, Loader2, Zap, Eye, Code2, Menu, ChevronDown, Share2, Globe, User } from 'lucide-react'

interface BuilderTopBarProps {
    onBack: () => void
    onRegenerate: () => void
    onDownloadZip: () => void
    isLoading: boolean
    viewMode: 'codebase' | 'preview'
    onViewModeChange: (mode: 'codebase' | 'preview') => void
    projectTitle?: string
}

export default function BuilderTopBar({
    onBack,
    onRegenerate,
    onDownloadZip,
    isLoading,
    viewMode,
    onViewModeChange,
    projectTitle = 'vybex-generated-app',
}: BuilderTopBarProps) {
    return (
        <div className="flex flex-col border-b border-border/60 flex-shrink-0 bg-[#0a0a0a]">
            {/* Row 1: Navigation & Actions */}
            <div className="flex items-center justify-between px-3 h-10 md:h-12 border-b border-white/5">
                {/* Left: Menu + Breadcrumb-style Title */}
                <div className="flex items-center gap-2 overflow-hidden">
                    <button className="p-1 text-white/70 hover:text-white transition-colors">
                        <Menu className="w-4 h-4" />
                    </button>
                    <span className="text-white/20 text-sm font-light hidden sm:inline">/</span>
                    <button className="flex items-center gap-1 overflow-hidden">
                        <span className="text-xs md:text-sm font-medium text-white/90 truncate max-w-[120px] md:max-w-none">
                            {projectTitle}
                        </span>
                        <ChevronDown className="w-3 h-3 text-white/40" />
                    </button>

                    {/* Compact Loading Indicator */}
                    {isLoading && (
                        <div className="ml-2 flex items-center gap-1.5 text-[10px] text-accent font-medium">
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                            <span className="hidden sm:inline">Generating…</span>
                        </div>
                    )}
                </div>

                {/* Right: Utillity Icons (Download, Share, User/X) */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onDownloadZip}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 hover:text-white transition-all"
                        title="Download ZIP"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Download</span>
                    </button>

                    <button className="p-1.5 text-white/50 hover:text-white transition-colors hidden sm:block">
                        <Share2 className="w-4 h-4" />
                    </button>

                    <button
                        onClick={onBack}
                        className="p-1.5 text-white/70 hover:text-white transition-colors"
                    >
                        {/* Gradient Circle placeholder for User, using X for close action */}
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-400 flex items-center justify-center p-1 font-bold">
                            <X className="w-3.5 h-3.5 text-white" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Row 2: Segments (Matches the Image perfectly) */}
            <div className="flex items-center justify-center py-2 px-3 md:py-3 border-b border-white/5 bg-[#0a0a0a]">
                <div className="flex items-center bg-[#1a1a1a] rounded-lg p-0.5 border border-white/5 w-full md:w-auto md:min-w-[400px]">
                    <button
                        onClick={() => onViewModeChange('codebase')}
                        className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 ${viewMode === 'codebase'
                            ? 'bg-[#2a2a2a] text-white shadow-sm'
                            : 'text-white/40 hover:text-white/60'
                            }`}
                    >
                        Chat
                    </button>
                    <button
                        onClick={() => onViewModeChange('preview')}
                        className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 ${viewMode === 'preview'
                            ? 'bg-[#2a2a2a] text-white shadow-sm'
                            : 'text-white/40 hover:text-white/60'
                            }`}
                    >
                        Preview
                    </button>
                </div>
            </div>
        </div>
    )
}
