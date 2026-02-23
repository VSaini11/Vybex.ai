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
        <div className="flex h-full overflow-hidden bg-[#0d0d0d]">
            {/* Sidebar Narrow Icons - as seen in the image */}
            <div className="w-12 border-r border-white/5 flex flex-col items-center py-4 gap-4 flex-shrink-0">
                <Files className="w-5 h-5 text-white/70" />
                <ChevronRight className="w-5 h-5 text-white/30" />
                <Files className="w-5 h-5 text-white/30" />
                <div className="mt-auto">
                    <ChevronDown className="w-5 h-5 text-white/30" />
                </div>
            </div>

            {/* Tree Section */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        Explorer
                    </span>
                    <button className="text-white/40 hover:text-white/70 transition-colors">
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Tree */}
                <div className="flex-1 overflow-y-auto py-2 px-1 space-y-0.5 scrollbar-none">
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
        </div>
    )
}
