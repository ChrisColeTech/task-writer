import fs from 'fs-extra'
import path from 'path'
import { glob } from 'glob'
import { v4 as uuidv4 } from 'uuid'
import { TreeNode, ScanResult } from '../types/api'

export class FileSystemService {
  private defaultExcludePatterns = [
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/.cache/**',
    '**/coverage/**',
    '**/.nyc_output/**',
    '**/logs/**',
    '**/*.log',
    '**/.DS_Store',
    '**/Thumbs.db'
  ]

  /**
   * Scan directory and build tree structure
   */
  async scanDirectory(
    directoryPath: string, 
    options: {
      excludeNodeModules?: boolean
      excludeGitIgnored?: boolean
      includeDotFiles?: boolean
      maxDepth?: number
      excludePatterns?: string[]
    } = {}
  ): Promise<ScanResult> {
    const {
      excludeNodeModules = true,
      excludeGitIgnored = true,
      includeDotFiles = false,
      maxDepth = 10,
      excludePatterns = []
    } = options

    // Build exclude patterns
    const patterns = [...this.defaultExcludePatterns, ...excludePatterns]
    if (!includeDotFiles) {
      patterns.push('**/.*')
    }

    // Validate directory exists and is accessible
    const stats = await fs.stat(directoryPath)
    if (!stats.isDirectory()) {
      throw new Error('Path is not a directory')
    }

    // Build tree structure
    const tree = await this.buildTree(directoryPath, patterns, maxDepth)
    
    // Calculate statistics
    const scanStats = this.calculateStats(tree)

    return {
      tree: [tree], // Wrap root in array for consistency
      stats: scanStats
    }
  }

  /**
   * Build tree structure recursively
   */
  private async buildTree(
    currentPath: string, 
    excludePatterns: string[], 
    maxDepth: number,
    currentDepth = 0,
    basePath = currentPath
  ): Promise<TreeNode> {
    const stats = await fs.stat(currentPath)
    const relativePath = path.relative(basePath, currentPath)
    const name = path.basename(currentPath)

    const node: TreeNode = {
      id: uuidv4(),
      name: name || path.basename(basePath),
      path: relativePath || '.',
      type: stats.isDirectory() ? 'directory' : 'file',
      size: stats.size,
      modified: stats.mtime
    }

    // If it's a file or we've reached max depth, return the node
    if (!stats.isDirectory() || currentDepth >= maxDepth) {
      return node
    }

    // For directories, get children
    try {
      const items = await fs.readdir(currentPath)
      const children: TreeNode[] = []

      for (const item of items) {
        const itemPath = path.join(currentPath, item)
        const itemRelativePath = path.relative(basePath, itemPath)

        // Check if item should be excluded
        const shouldExclude = excludePatterns.some(pattern => {
          // Convert glob pattern to regex for matching
          const globPattern = pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*')
          const regex = new RegExp(globPattern)
          return regex.test(itemRelativePath) || regex.test(item)
        })

        if (shouldExclude) {
          continue
        }

        try {
          const childNode = await this.buildTree(
            itemPath, 
            excludePatterns, 
            maxDepth, 
            currentDepth + 1, 
            basePath
          )
          children.push(childNode)
        } catch (error) {
          // Skip items we can't access (permissions, etc.)
          console.warn(`Skipping ${itemPath}:`, error)
        }
      }

      // Sort children: directories first, then files, both alphabetically
      children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1
        }
        return a.name.localeCompare(b.name)
      })

      node.children = children
    } catch (error) {
      console.warn(`Could not read directory ${currentPath}:`, error)
    }

    return node
  }

  /**
   * Calculate statistics for the scanned tree
   */
  private calculateStats(tree: TreeNode): ScanResult['stats'] {
    const stats = {
      totalFiles: 0,
      totalDirectories: 0,
      totalSize: 0,
      fileTypes: {} as Record<string, number>
    }

    const traverse = (node: TreeNode) => {
      if (node.type === 'directory') {
        stats.totalDirectories++
        if (node.children) {
          node.children.forEach(traverse)
        }
      } else {
        stats.totalFiles++
        stats.totalSize += node.size || 0
        
        // Track file extensions
        const ext = path.extname(node.name).toLowerCase()
        const fileType = ext || 'no-extension'
        stats.fileTypes[fileType] = (stats.fileTypes[fileType] || 0) + 1
      }
    }

    traverse(tree)
    return stats
  }

  /**
   * Validate if path exists and is accessible
   */
  async validatePath(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get file content (with size limits for safety)
   */
  async getFileContent(filePath: string, maxSize = 1024 * 1024): Promise<string> {
    const stats = await fs.stat(filePath)
    
    if (stats.size > maxSize) {
      throw new Error(`File too large: ${stats.size} bytes (max: ${maxSize})`)
    }

    return fs.readFile(filePath, 'utf-8')
  }

  /**
   * Write file to disk
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    await fs.ensureDir(path.dirname(filePath))
    await fs.writeFile(filePath, content, 'utf-8')
  }
}