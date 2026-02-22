'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import FileExplorer from './file-explorer'
import MonacoEditorPanel from './monaco-editor-panel'
import PreviewPanel from './preview-panel'
import BuilderTopBar from './builder-topbar'
import type { GeneratedProject } from '@/lib/builder-types'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

interface BuilderLayoutProps {
    project: GeneratedProject | null
    activeFilePath: string | null
    openTabs: string[]
    isLoading: boolean
    status: string | null
    error: string | null
    onSelectFile: (path: string) => void
    onTabClick: (path: string) => void
    onTabClose: (path: string) => void
    onBack: () => void
    onRegenerate: () => void
    onDownloadZip: () => void
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
    onSelectFile,
    onTabClick,
    onTabClose,
    onBack,
    onRegenerate,
    onDownloadZip,
}: BuilderLayoutProps) {
    const [viewMode, setViewMode] = useState<'codebase' | 'preview'>('preview')

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
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {/* Main panels */}
            <div className="flex-1 p-2 overflow-hidden min-h-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={viewMode}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="h-full w-full"
                    >
                        <ResizablePanelGroup direction="horizontal" className="gap-2">

                            {/* Dual Mode Switch */}
                            {viewMode === 'codebase' ? (
                                <>
                                    {/* Codebase Mode: [Explorer | Editor] */}
                                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                                        <div className={panelClass} style={panelGlow}>
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
                                    </ResizablePanel>
                                    <ResizableHandle className="w-1 bg-transparent hover:bg-accent/10 transition-colors" />
                                    <ResizablePanel defaultSize={80}>
                                        <div className={panelClass} style={panelGlow}>
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
                                        </div>
                                    </ResizablePanel>
                                </>
                            ) : (
                                <>
                                    {/* Preview Mode: [Editor | Preview] */}
                                    <ResizablePanel defaultSize={45} minSize={30}>
                                        <div className={panelClass} style={panelGlow}>
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
                                        </div>
                                    </ResizablePanel>
                                    <ResizableHandle className="w-1 bg-transparent hover:bg-accent/10 transition-colors" />
                                    <ResizablePanel defaultSize={55} minSize={30}>
                                        <div className={panelClass} style={panelGlow}>
                                            <PreviewSection
                                                isLoading={isLoading}
                                                error={error}
                                                project={project}
                                                status={status}
                                                pageContent={pageContent}
                                            />
                                        </div>
                                    </ResizablePanel>
                                </>
                            )}
                        </ResizablePanelGroup>
                    </motion.div>
                </AnimatePresence>
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
