const fs = require('fs').promises
const path = require('path')
const { v4: uuidv4 } = require('uuid')

class TaskGenerator {
  constructor() {
    this.supportedExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
      '.py', '.rb', '.php', '.java', '.kt', '.swift',
      '.go', '.rs', '.cpp', '.c', '.h', '.hpp',
      '.cs', '.vb', '.fs', '.clj', '.scala',
      '.html', '.htm', '.css', '.scss', '.sass', '.less',
      '.json', '.xml', '.yaml', '.yml', '.toml',
      '.md', '.txt', '.rst', '.adoc',
      '.sql', '.graphql', '.gql',
      '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd',
    ]
  }

  async generateTasks(directoryPath, settings = {}) {
    const defaultSettings = {
      includeFileContents: true,
      includeFolderStructure: true,
      includeImplementationSteps: true,
      groupByDirectory: true,
      outputFormat: 'markdown',
      maxFileSize: 10, // MB
      filesPerTask: 5,
      customInstructions: '',
    }

    const options = { ...defaultSettings, ...settings }
    const stats = {
      totalTasks: 0,
      completedTasks: 0,
      totalFiles: 0,
      processedFiles: 0,
    }

    try {
      // Scan directory to get file structure
      const files = await this.getProjectFiles(directoryPath, options)
      stats.totalFiles = files.length

      // Group files according to settings
      const fileGroups = this.groupFiles(files, options)
      
      // Generate tasks for each group
      const tasks = []
      for (const group of fileGroups) {
        const task = await this.generateTaskForGroup(group, options, directoryPath)
        if (task) {
          tasks.push(task)
          stats.processedFiles += group.files.length
        }
      }

      stats.totalTasks = tasks.length
      stats.completedTasks = tasks.length

      return { tasks, stats }
    } catch (error) {
      console.error('Error generating tasks:', error)
      throw error
    }
  }

  async getProjectFiles(directoryPath, options) {
    const files = []
    
    async function scanDirectory(dir, relativePath = '') {
      try {
        const entries = await fs.readdir(dir)
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry)
          const relativeFilePath = path.join(relativePath, entry)
          
          try {
            const stat = await fs.stat(fullPath)
            
            if (stat.isDirectory()) {
              // Skip certain directories
              if (this.shouldSkipDirectory(entry)) {
                continue
              }
              await scanDirectory(fullPath, relativeFilePath)
            } else if (stat.isFile()) {
              const ext = path.extname(entry).toLowerCase()
              const fileSizeMB = stat.size / (1024 * 1024)
              
              // Check if file should be included
              if (this.supportedExtensions.includes(ext) && fileSizeMB <= options.maxFileSize) {
                files.push({
                  name: entry,
                  path: fullPath,
                  relativePath: relativeFilePath,
                  directory: path.dirname(relativeFilePath) || '.',
                  extension: ext,
                  size: stat.size,
                  lastModified: stat.mtime,
                })
              }
            }
          } catch (error) {
            console.warn(`Skipping ${fullPath}: ${error.message}`)
          }
        }
      } catch (error) {
        console.error(`Error scanning directory ${dir}: ${error.message}`)
      }
    }

    await scanDirectory.call(this, directoryPath)
    return files
  }

  shouldSkipDirectory(dirName) {
    const skipDirs = [
      'node_modules', '.git', '.svn', '.hg',
      'dist', 'build', 'out', 'target',
      '__pycache__', '.pytest_cache',
      '.vscode', '.idea',
      'coverage', '.nyc_output',
      'vendor', 'bower_components',
    ]
    
    return skipDirs.includes(dirName) || dirName.startsWith('.')
  }

  groupFiles(files, options) {
    if (options.groupByDirectory) {
      return this.groupByDirectory(files, options)
    } else {
      return this.groupByFileCount(files, options)
    }
  }

  groupByDirectory(files, options) {
    const groups = new Map()
    
    for (const file of files) {
      const dir = file.directory
      if (!groups.has(dir)) {
        groups.set(dir, {
          id: uuidv4(),
          name: dir === '.' ? 'Root' : dir,
          directory: dir,
          files: [],
        })
      }
      groups.get(dir).files.push(file)
    }
    
    // Split large groups if they exceed filesPerTask
    const result = []
    for (const group of groups.values()) {
      if (group.files.length <= options.filesPerTask) {
        result.push(group)
      } else {
        // Split into smaller groups
        const chunks = this.chunkArray(group.files, options.filesPerTask)
        chunks.forEach((chunk, index) => {
          result.push({
            id: uuidv4(),
            name: `${group.name} (Part ${index + 1})`,
            directory: group.directory,
            files: chunk,
          })
        })
      }
    }
    
    return result
  }

  groupByFileCount(files, options) {
    const chunks = this.chunkArray(files, options.filesPerTask)
    return chunks.map((chunk, index) => ({
      id: uuidv4(),
      name: `Task ${index + 1}`,
      directory: 'mixed',
      files: chunk,
    }))
  }

  chunkArray(array, chunkSize) {
    const chunks = []
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
  }

  async generateTaskForGroup(group, options, projectPath) {
    try {
      const taskId = uuidv4()
      const content = await this.generateTaskContent(group, options, projectPath)
      
      const task = {
        id: taskId,
        name: `${group.name.replace(/[/\\]/g, '_')}_task`,
        content,
        directory: group.directory,
        fileCount: group.files.length,
        size: Buffer.byteLength(content, 'utf8'),
        createdAt: new Date(),
      }
      
      return task
    } catch (error) {
      console.error(`Error generating task for group ${group.name}:`, error)
      return null
    }
  }

  async generateTaskContent(group, options, projectPath) {
    const lines = []
    
    // Add custom instructions if provided
    if (options.customInstructions?.trim()) {
      lines.push('# Custom Instructions')
      lines.push('')
      lines.push(options.customInstructions.trim())
      lines.push('')
      lines.push('---')
      lines.push('')
    }
    
    // Task header
    lines.push(`# Task: ${group.name}`)
    lines.push('')
    lines.push('## Overview')
    lines.push('')
    lines.push(`This task covers the analysis and implementation work for the **${group.name}** directory/component.`)
    lines.push(`This task includes ${group.files.length} file(s) for review and potential modification.`)
    lines.push('')
    
    // Folder structure
    if (options.includeFolderStructure) {
      lines.push('## Directory Structure')
      lines.push('')
      lines.push('```')
      const structure = await this.generateDirectoryStructure(group.files, projectPath)
      lines.push(structure)
      lines.push('```')
      lines.push('')
    }
    
    // File analysis
    lines.push('## Files in This Task')
    lines.push('')
    
    for (const file of group.files) {
      lines.push(`### ${file.relativePath}`)
      lines.push('')
      
      // File metadata
      lines.push(`**Type:** ${this.getFileType(file.extension)}`)
      lines.push(`**Size:** ${this.formatFileSize(file.size)}`)
      lines.push(`**Last Modified:** ${file.lastModified.toISOString()}`)
      lines.push('')
      
      // File contents
      if (options.includeFileContents) {
        try {
          const content = await fs.readFile(file.path, 'utf8')
          lines.push('**Content:**')
          lines.push('')
          lines.push('```' + this.getLanguageForExtension(file.extension))
          lines.push(content)
          lines.push('```')
          lines.push('')
        } catch (error) {
          lines.push(`**Content:** *Error reading file: ${error.message}*`)
          lines.push('')
        }
      }
      
      // File analysis
      lines.push('**Analysis Points:**')
      lines.push('- [ ] Review code structure and organization')
      lines.push('- [ ] Check for potential improvements or optimizations')
      lines.push('- [ ] Verify adherence to coding standards')
      lines.push('- [ ] Identify any dependencies or relationships')
      lines.push('')
    }
    
    // Implementation steps
    if (options.includeImplementationSteps) {
      lines.push('## Implementation Checklist')
      lines.push('')
      lines.push('### Analysis Phase')
      lines.push('- [ ] Review all files in this task')
      lines.push('- [ ] Understand the current implementation')
      lines.push('- [ ] Identify areas for improvement')
      lines.push('- [ ] Document any issues or concerns')
      lines.push('')
      
      lines.push('### Development Phase')
      lines.push('- [ ] Plan necessary changes')
      lines.push('- [ ] Implement improvements')
      lines.push('- [ ] Update documentation if needed')
      lines.push('- [ ] Add or update tests')
      lines.push('')
      
      lines.push('### Testing Phase')
      lines.push('- [ ] Test functionality locally')
      lines.push('- [ ] Run automated tests')
      lines.push('- [ ] Verify integration with other components')
      lines.push('- [ ] Perform code review')
      lines.push('')
    }
    
    // Summary
    lines.push('## Summary')
    lines.push('')
    lines.push(`This task encompasses ${group.files.length} file(s) in the ${group.directory} area. `)
    lines.push('Complete all analysis and implementation steps before marking this task as done.')
    lines.push('')
    
    lines.push('---')
    lines.push(`*Generated on ${new Date().toISOString()} by Task Writer*`)
    
    return lines.join('\n')
  }

  async generateDirectoryStructure(files, projectPath) {
    const structure = new Map()
    
    for (const file of files) {
      const parts = file.relativePath.split(path.sep)
      let current = structure
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (!current.has(part)) {
          current.set(part, new Map())
        }
        current = current.get(part)
      }
    }
    
    return this.renderStructure(structure, '')
  }

  renderStructure(structure, prefix) {
    const lines = []
    const entries = Array.from(structure.entries())
    
    entries.forEach(([name, children], index) => {
      const isLast = index === entries.length - 1
      const hasChildren = children.size > 0
      
      const connector = isLast ? '└── ' : '├── '
      const icon = hasChildren ? '📁' : '📄'
      
      lines.push(`${prefix}${connector}${icon} ${name}`)
      
      if (hasChildren) {
        const childPrefix = prefix + (isLast ? '    ' : '│   ')
        lines.push(this.renderStructure(children, childPrefix))
      }
    })
    
    return lines.join('\n')
  }

  getFileType(extension) {
    const typeMap = {
      '.js': 'JavaScript',
      '.jsx': 'React JSX',
      '.ts': 'TypeScript',
      '.tsx': 'React TypeScript',
      '.vue': 'Vue Component',
      '.svelte': 'Svelte Component',
      '.py': 'Python',
      '.rb': 'Ruby',
      '.php': 'PHP',
      '.java': 'Java',
      '.kt': 'Kotlin',
      '.swift': 'Swift',
      '.go': 'Go',
      '.rs': 'Rust',
      '.cpp': 'C++',
      '.c': 'C',
      '.h': 'C/C++ Header',
      '.cs': 'C#',
      '.html': 'HTML',
      '.css': 'CSS',
      '.scss': 'SCSS',
      '.sass': 'Sass',
      '.json': 'JSON',
      '.xml': 'XML',
      '.yaml': 'YAML',
      '.yml': 'YAML',
      '.md': 'Markdown',
      '.txt': 'Text',
      '.sql': 'SQL',
      '.sh': 'Shell Script',
      '.bash': 'Bash Script',
    }
    
    return typeMap[extension.toLowerCase()] || 'Unknown'
  }

  getLanguageForExtension(extension) {
    const langMap = {
      '.js': 'javascript',
      '.jsx': 'jsx',
      '.ts': 'typescript',
      '.tsx': 'tsx',
      '.py': 'python',
      '.rb': 'ruby',
      '.php': 'php',
      '.java': 'java',
      '.kt': 'kotlin',
      '.swift': 'swift',
      '.go': 'go',
      '.rs': 'rust',
      '.cpp': 'cpp',
      '.c': 'c',
      '.h': 'c',
      '.cs': 'csharp',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.sass': 'sass',
      '.json': 'json',
      '.xml': 'xml',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.md': 'markdown',
      '.sql': 'sql',
      '.sh': 'bash',
      '.bash': 'bash',
    }
    
    return langMap[extension.toLowerCase()] || ''
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  async exportTasks(tasks, outputDirectory, format = 'markdown') {
    try {
      // Ensure output directory exists
      await fs.mkdir(outputDirectory, { recursive: true })
      
      for (const task of tasks) {
        const fileName = `${task.name}.${this.getExtensionForFormat(format)}`
        const filePath = path.join(outputDirectory, fileName)
        
        let content = task.content
        
        // Convert format if needed
        if (format === 'html') {
          content = this.convertMarkdownToHtml(content)
        } else if (format === 'text') {
          content = this.convertMarkdownToText(content)
        }
        
        await fs.writeFile(filePath, content, 'utf8')
      }
      
      // Create index file
      await this.createTaskIndex(tasks, outputDirectory, format)
      
      return true
    } catch (error) {
      console.error('Error exporting tasks:', error)
      throw error
    }
  }

  async createTaskIndex(tasks, outputDirectory, format) {
    const indexFileName = `index.${this.getExtensionForFormat(format)}`
    const indexPath = path.join(outputDirectory, indexFileName)
    
    const lines = []
    lines.push('# Task Index')
    lines.push('')
    lines.push(`Generated on: ${new Date().toISOString()}`)
    lines.push(`Total tasks: ${tasks.length}`)
    lines.push('')
    
    lines.push('## Tasks')
    lines.push('')
    
    tasks.forEach((task, index) => {
      lines.push(`${index + 1}. **${task.name}**`)
      lines.push(`   - Directory: ${task.directory}`)
      lines.push(`   - Files: ${task.fileCount}`)
      lines.push(`   - Size: ${this.formatFileSize(task.size)}`)
      lines.push(`   - Created: ${task.createdAt.toISOString()}`)
      lines.push('')
    })
    
    let content = lines.join('\n')
    
    if (format === 'html') {
      content = this.convertMarkdownToHtml(content)
    } else if (format === 'text') {
      content = this.convertMarkdownToText(content)
    }
    
    await fs.writeFile(indexPath, content, 'utf8')
  }

  getExtensionForFormat(format) {
    switch (format) {
      case 'html': return 'html'
      case 'text': return 'txt'
      case 'markdown':
      default: return 'md'
    }
  }

  convertMarkdownToHtml(markdown) {
    // Simple markdown to HTML conversion
    return markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br>\n')
  }

  convertMarkdownToText(markdown) {
    // Simple markdown to plain text conversion
    return markdown
      .replace(/^#{1,6} (.*$)/gm, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/```[\s\S]*?```/g, '[CODE BLOCK]')
      .replace(/`(.*?)`/g, '$1')
      .replace(/^\- /gm, '• ')
  }
}

module.exports = TaskGenerator