'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useMemo } from 'react'
import FileExplorer from './file-explorer'
import MonacoEditorPanel from './monaco-editor-panel'
import PreviewPanel from './preview-panel'
import BuilderTopBar from './builder-topbar'
import type { GeneratedProject } from '@/lib/builder-types'

interface BuilderLayoutProps {
    project: GeneratedProject | null
    activeFilePath: string | null
    openTabs: string[]
    isLoading: boolean
    error: string | null
    onSelectFile: (path: string) => void
    onTabClick: (path: string) => void
    onTabClose: (path: string) => void
    onBack: () => void
    onRegenerate: () => void
    onDownloadZip: () => void
}

const panelClass =
    'flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md'

const panelGlow = {
    boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
}

export default function BuilderLayout({
    project,
    activeFilePath,
    openTabs,
    isLoading,
    error,
    onSelectFile,
    onTabClick,
    onTabClose,
    onBack,
    onRegenerate,
    onDownloadZip,
}: BuilderLayoutProps) {
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
        return project.fileMap['app/page.tsx']?.content
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
            />

            {/* Main panels */}
            <div className="flex flex-1 gap-2 p-2 overflow-hidden min-h-0">

                {/* Left: File Explorer (25%) */}
                <div className={panelClass} style={{ width: '25%', minWidth: 180, maxWidth: 280, ...panelGlow }}>
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col p-4 gap-2"
                            >
                                <div className="h-3 bg-white/5 rounded animate-pulse mb-4 w-1/2" />
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-6 bg-white/5 rounded animate-pulse"
                                        style={{ width: `${55 + Math.random() * 35}%`, animationDelay: `${i * 80}ms` }}
                                    />
                                ))}
                            </motion.div>
                        ) : project ? (
                            <motion.div
                                key="explorer"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 overflow-hidden"
                            >
                                <FileExplorer
                                    files={project.files}
                                    activeFilePath={activeFilePath}
                                    onSelectFile={onSelectFile}
                                />
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>

                {/* Center: Monaco Editor (40%) */}
                <div className={panelClass} style={{ flex: '0 0 40%', ...panelGlow }}>
                    <AnimatePresence mode="wait">
                        {error && !project ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                            >
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
                            </motion.div>
                        ) : isLoading ? (
                            <motion.div
                                key="editor-loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col"
                            >
                                {/* Fake tab bar */}
                                <div className="h-10 border-b border-border/60 flex items-center px-4 gap-4">
                                    <div className="h-3 bg-white/5 rounded animate-pulse w-20" />
                                </div>
                                {/* Fake code lines */}
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
                            <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-hidden flex flex-col">
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
                </div>

                {/* Right: Preview Panel (35%) */}
                <div className={panelClass} style={{ flex: '1 1 0', ...panelGlow }}>
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
                                        <p className="text-xs text-muted-foreground">Generating your landing page…</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-hidden flex flex-col">
                                <PreviewPanel pageContent={pageContent} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}
