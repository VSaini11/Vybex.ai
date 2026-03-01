'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Code2,
    Eye,
    Terminal
} from "lucide-react"
import FileExplorer from './file-explorer'
import MonacoEditorPanel from './monaco-editor-panel'
import PreviewPanel from './preview-panel'
import BuilderTopBar from './builder-topbar'
import FollowupChat from './followup-chat'
import type { GeneratedProject } from '@/lib/builder-types'
import GenerationLog from './generation-log'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import TiredVyana from '@/components/tired-vyana'
import { VYANA_TIRED_ERROR } from '@/lib/ai-errors'

interface BuilderLayoutProps {
    project: GeneratedProject | null
    activeFilePath: string | null
    openTabs: string[]
    isLoading: boolean
    status: string | null
    error: string | null
    refinementCount: number
    onSelectFile: (path: string) => void
    onTabClick: (path: string) => void
    onTabClose: (path: string) => void
    onBack: () => void
    onRegenerate: () => void
    onDownloadZip: () => void
    onRefine: (message: string) => void
}

const panelClass =
    'flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md h-full w-full'

const panelGlow = {
    boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
}

export default function BuilderLayout({
    project,
    activeFilePath,
    openTabs,
    isLoading,
    status,
    error,
    refinementCount,
    onSelectFile,
    onTabClick,
    onTabClose,
    onBack,
    onRegenerate,
    onDownloadZip,
    onRefine,
}: BuilderLayoutProps) {
    const [viewMode, setViewMode] = useState<'chat' | 'preview' | 'code'>('chat')
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const activeContent = useMemo(() => {
        if (!project || !activeFilePath) return ''
        return project.fileMap[activeFilePath]?.content ?? ''
    }, [project, activeFilePath])

    const activeLanguage = useMemo(() => {
        if (!project || !activeFilePath) return 'typescript'
        return project.fileMap[activeFilePath]?.language ?? 'typescript'
    }, [project, activeFilePath])

    const pageContent = useMemo(() => {
        if (!project) return undefined
        // Check for common entry point paths
        return project.fileMap['app/page.tsx']?.content || project.fileMap['page.tsx']?.content
    }, [project])

    return (
        <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: 'var(--vybex-black)' }}
        >
            {/* Top bar */}
            <BuilderTopBar
                onBack={onBack}
                onRegenerate={onRegenerate}
                onDownloadZip={onDownloadZip}
                isLoading={isLoading}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                projectTitle={project?.files[0]?.name.split('.')[0] || 'vybex-app'}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden min-h-0 bg-[#0a0a0a]">
                {/* Collapsible Sidebar (File Explorer) */}
                <motion.div
                    initial={false}
                    animate={{ width: isSidebarOpen ? 240 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="border-r border-white/5 overflow-hidden flex flex-col relative"
                >
                    <div className="flex-1 min-w-[240px]">
                        <FileExplorer
                            files={project?.files ?? []}
                            activeFilePath={activeFilePath}
                            onSelectFile={onSelectFile}
                        />
                    </div>
                </motion.div>

                {/* Main Viewport */}
                <div className="flex-1 flex flex-col min-w-0 relative">
                    {/* Content Switcher */}
                    <div className="flex-1 overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            {viewMode === 'chat' ? (
                                <motion.div
                                    key="chat"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="h-full w-full"
                                >
                                    <GenerationLog status={status} isLoading={isLoading} error={error} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="content-container"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    className="h-full w-full"
                                >
                                    {viewMode === 'preview' ? (
                                        <PreviewSection
                                            isLoading={isLoading}
                                            error={error}
                                            project={project}
                                            status={status}
                                            pageContent={pageContent}
                                        />
                                    ) : (
                                        <EditorSection
                                            isLoading={isLoading}
                                            error={error}
                                            project={project}
                                            activeContent={activeContent}
                                            activeLanguage={activeLanguage}
                                            activeFilePath={activeFilePath}
                                            openTabs={openTabs}
                                            onTabClick={onTabClick}
                                            onTabClose={onTabClose}
                                            onBack={onBack}
                                        />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* AI Follow-up Chat */}
                    {project && !error && (
                        <FollowupChat
                            onRefine={onRefine}
                            isLoading={isLoading}
                            refinementCount={refinementCount}
                        />
                    )}

                    {/* Bottom Sidebar Toggle Arrow */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="absolute bottom-4 left-4 z-20 w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-[#2a2a2a] transition-all shadow-xl"
                    >
                        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
// Sub-components for better organization
function EditorSection({ isLoading, error, project, activeContent, activeLanguage, activeFilePath, openTabs, onTabClick, onTabClose, onBack }: any) {
    return (
        <AnimatePresence mode="wait">
            {error && !project ? (
                <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                >
                    {error === VYANA_TIRED_ERROR ? (
                        <TiredVyana onRetry={onBack} />
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                                <span className="text-3xl text-destructive">⚠️</span>
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">Generation Failed</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mb-6">
                                {error}
                            </p>
                            <button
                                onClick={onBack}
                                className="px-6 py-2 rounded-xl border border-border bg-card hover:bg-white/5 transition-all"
                            >
                                Go Back
                            </button>
                        </>
                    )}
                </motion.div>
            ) : isLoading ? (
                <motion.div
                    key="editor-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col"
                >
                    <div className="h-10 border-b border-border/60 flex items-center px-4 gap-4">
                        <div className="h-3 bg-white/5 rounded animate-pulse w-20" />
                    </div>
                    <div className="flex-1 p-6 space-y-2.5">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="h-2.5 bg-white/5 rounded animate-pulse"
                                style={{
                                    width: `${20 + Math.random() * 65}%`,
                                    marginLeft: i % 3 === 0 ? 0 : i % 3 === 1 ? 24 : 48,
                                    animationDelay: `${i * 60}ms`
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-hidden flex flex-col h-full">
                    <MonacoEditorPanel
                        content={activeContent}
                        language={activeLanguage}
                        activeFilePath={activeFilePath}
                        openTabs={openTabs}
                        onTabClick={onTabClick}
                        onTabClose={onTabClose}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

function PreviewSection({ isLoading, error, project, status, pageContent }: any) {
    return (
        <AnimatePresence mode="wait">
            {error && !project ? (
                <div className="flex-1 bg-background/20" />
            ) : isLoading ? (
                <motion.div
                    key="preview-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col"
                >
                    <div className="h-10 border-b border-border/60 flex items-center px-4 gap-2">
                        <div className="h-6 w-20 bg-white/5 rounded-lg animate-pulse" />
                        <div className="h-6 w-16 bg-white/5 rounded-lg animate-pulse" />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center space-y-3">
                            <motion.div
                                animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                                className="w-12 h-12 rounded-2xl border border-accent/30 flex items-center justify-center mx-auto"
                                style={{ background: 'rgba(0,255,65,0.05)', boxShadow: '0 0 30px rgba(0,255,65,0.1)' }}
                            >
                                <span className="text-2xl">✦</span>
                            </motion.div>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={status || 'default'}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="text-xs text-muted-foreground font-mono"
                                >
                                    {status || 'Generating your landing page…'}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-hidden flex flex-col h-full">
                    <PreviewPanel pageContent={pageContent} />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
