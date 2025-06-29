// Shared API types that match frontend expectations

export interface DirectoryResult {
  canceled: boolean
  filePaths: string[]
}

export interface TreeNode {
  id: string
  name: string
  path: string
  type: 'file' | 'directory'
  size?: number
  modified?: Date
  children?: TreeNode[]
  expanded?: boolean
}

export interface ScanResult {
  tree: TreeNode[]
  stats: {
    totalFiles: number
    totalDirectories: number
    totalSize: number
    fileTypes: Record<string, number>
  }
}

export interface ExportResult {
  success: boolean
  filePath?: string
  directory?: string
  message?: string
}

export interface TaskSettings {
  includeContent: boolean
  excludePatterns: string[]
  maxFileSize: number
  outputFormat: 'markdown' | 'json' | 'txt'
  includeMetadata: boolean
  groupByType: boolean
}

export interface ScaffoldSettings {
  targetOS: 'windows' | 'macos' | 'linux' | 'cross-platform'
  includeContent: boolean
  createDirectoriesOnly: boolean
  addComments: boolean
  scriptName: string
  outputFormat: 'powershell' | 'bash' | 'batch' | 'python' | 'nodejs' | 'ruby' | 'perl' | 'fish' | 'zsh'
  templateVariables: Record<string, string>
  supportedFileTypes: string[]
}

export interface GeneratedTask {
  id: string
  name: string
  content: string
  path: string
  type: string
  size: number
  createdAt: Date
}

export interface GeneratedScaffold {
  id: string
  name: string
  content: string
  os: string
  fileCount: number
  directoryCount: number
  size: number
  createdAt: Date
  scriptPath?: string
  format: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}