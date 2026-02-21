'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, FolderOpen, Folder, FileCode2, FileJson, Files } from 'lucide-react'
import type { FileNode } from '@/lib/builder-types'

interface FileExplorerProps {
    files: FileNode[]
    activeFilePath: string | null
    onSelectFile: (path: string) => void
}

function getFileIcon(name: string) {
    if (name.endsWith('.css')) return <Files className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
    if (name.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
    return <FileCode2 className="w-3.5 h-3.5 text-green-400/80 flex-shrink-0" />
}

function FileNodeRow({
    node,
    depth,
    activeFilePath,
    onSelectFile,
}: {
    node: FileNode
    depth: number
    activeFilePath: string | null
    onSelectFile: (path: string) => void
}) {
    const [open, setOpen] = useState(depth === 0)
    const isActive = node.path === activeFilePath

    if (node.type === 'folder') {
        return (
            <div>
                <button
                    onClick={() => setOpen(o => !o)}
                    className="flex items-center gap-1.5 w-full px-2 py-1 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-150 group"
                    style={{ paddingLeft: `${8 + depth * 14}px` }}
                >
                    <span className="text-muted-foreground/60">
                        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </span>
                    {open
                        ? <FolderOpen className="w-3.5 h-3.5 text-accent/70 flex-shrink-0" />
                        : <Folder className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />}
                    <span className="truncate font-medium">{node.name}</span>
                </button>
                <AnimatePresence>
                    {open && node.children && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden"
                        >
                            {node.children.map(child => (
                                <FileNodeRow
                                    key={child.path}
                                    node={child}
                                    depth={depth + 1}
                                    activeFilePath={activeFilePath}
                                    onSelectFile={onSelectFile}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    return (
        <button
            onClick={() => onSelectFile(node.path)}
            className={`flex items-center gap-1.5 w-full px-2 py-1 rounded-lg text-sm transition-all duration-150 truncate ${isActive
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
            style={{ paddingLeft: `${8 + depth * 14}px` }}
        >
            {getFileIcon(node.name)}
            <span className="truncate">{node.name}</span>
            {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
            )}
        </button>
    )
}

export default function FileExplorer({ files, activeFilePath, onSelectFile }: FileExplorerProps) {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/60 flex-shrink-0">
                <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                    Explorer
                </span>
            </div>

            {/* Project root label */}
            <div className="px-2 py-2 border-b border-border/40 flex-shrink-0">
                <div className="flex items-center gap-1.5 px-2 py-1">
                    <FolderOpen className="w-3.5 h-3.5 text-accent/60" />
                    <span className="text-xs font-semibold text-foreground/70 truncate">vybex-generated-app</span>
                </div>
            </div>

            {/* Tree */}
            <div className="flex-1 overflow-y-auto py-2 px-1 space-y-0.5 scrollbar-thin">
                {files.map(node => (
                    <FileNodeRow
                        key={node.path}
                        node={node}
                        depth={0}
                        activeFilePath={activeFilePath}
                        onSelectFile={onSelectFile}
                    />
                ))}
            </div>
        </div>
    )
}
