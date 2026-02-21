'use client'

import dynamic from 'next/dynamic'
import { X } from 'lucide-react'
import { Loader2 } from 'lucide-react'

// Dynamically load Monaco with no SSR
const Editor = dynamic(
    () => import('@monaco-editor/react').then(mod => mod.default),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center w-full h-full bg-[#0d0d0d]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    <span className="text-xs text-muted-foreground">Loading editor…</span>
                </div>
            </div>
        ),
    }
)

interface MonacoEditorPanelProps {
    content: string
    language: string
    activeFilePath: string | null
    openTabs: string[]
    onTabClick: (path: string) => void
    onTabClose: (path: string) => void
}

function getTabLabel(path: string) {
    return path.split('/').pop() ?? path
}

function getTabColor(name: string) {
    if (name.endsWith('.css')) return 'text-blue-400'
    if (name.endsWith('.json')) return 'text-yellow-400'
    return 'text-green-400'
}

export default function MonacoEditorPanel({
    content,
    language,
    activeFilePath,
    openTabs,
    onTabClick,
    onTabClose,
}: MonacoEditorPanelProps) {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Tabs bar */}
            <div className="flex items-center border-b border-border/60 bg-background/40 overflow-x-auto flex-shrink-0 scrollbar-none">
                {openTabs.map(tabPath => {
                    const label = getTabLabel(tabPath)
                    const isActive = tabPath === activeFilePath
                    return (
                        <div
                            key={tabPath}
                            className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer border-r border-border/40 text-xs font-medium transition-all duration-150 flex-shrink-0 group ${isActive
                                    ? 'bg-card text-foreground border-b-2 border-b-accent'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }`}
                            onClick={() => onTabClick(tabPath)}
                        >
                            <span className={isActive ? getTabColor(label) : ''}>{label}</span>
                            <button
                                onClick={e => { e.stopPropagation(); onTabClose(tabPath) }}
                                className="opacity-0 group-hover:opacity-100 hover:text-foreground transition-opacity duration-150 rounded"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )
                })}
                {openTabs.length === 0 && (
                    <div className="px-4 py-2.5 text-xs text-muted-foreground/50 italic">
                        No files open
                    </div>
                )}
            </div>

            {/* Editor area */}
            <div className="flex-1 overflow-hidden relative">
                {activeFilePath ? (
                    <Editor
                        height="100%"
                        language={language === 'typescript' ? 'typescript' : language}
                        value={content}
                        theme="vs-dark"
                        options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 13,
                            lineHeight: 22,
                            fontFamily: '"Geist Mono", "Fira Code", Consolas, monospace',
                            fontLigatures: true,
                            scrollbar: { vertical: 'auto', horizontal: 'auto' },
                            padding: { top: 16, bottom: 16 },
                            renderLineHighlight: 'gutter',
                            smoothScrolling: true,
                            scrollBeyondLastLine: false,
                            overviewRulerLanes: 0,
                            lineNumbersMinChars: 3,
                            glyphMargin: false,
                            folding: true,
                            automaticLayout: true,
                            wordWrap: 'on',
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-[#0d0d0d]">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-2xl border border-border/40 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📄</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Select a file to view its contents</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
