export interface FileNode {
    name: string
    path: string
    type: 'file' | 'folder'
    children?: FileNode[]
    content?: string
    language?: string
}

export interface GeneratedProject {
    files: FileNode[]
    fileMap: Record<string, { content: string; language: string }>
}

export interface BuilderState {
    project: GeneratedProject | null
    activeFilePath: string | null
    openTabs: string[]
    isLoading: boolean
    status: string | null
    error: string | null
}
