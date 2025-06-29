export interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  page: string
  section?: string
  keywords: string[]
  priority: number // Lower number = higher priority
}

export const searchData: SearchResult[] = [
  // Welcome Page - Main entry point
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Welcome page - AI-Powered Development Assistant',
    category: 'Navigation',
    page: 'welcome',
    keywords: ['welcome', 'home', 'start', 'main', 'ai', 'development', 'assistant'],
    priority: 1
  },

  // Task Generator - Main features based on actual implementation
  {
    id: 'task-generator',
    title: 'Task Generator',
    description: 'Generate detailed task files with source code for project documentation',
    category: 'Tools',
    page: 'tasks',
    keywords: ['task', 'generator', 'documentation', 'files', 'source', 'code', 'project'],
    priority: 2
  },
  {
    id: 'task-directory-selection',
    title: 'Select Directory',
    description: 'Select your project directory for task generation',
    category: 'Actions',
    page: 'tasks',
    keywords: ['directory', 'select', 'folder', 'project', 'browse', 'path'],
    priority: 3
  },
  {
    id: 'task-file-contents',
    title: 'Include File Contents',
    description: 'Include actual file contents in generated tasks',
    category: 'Settings',
    page: 'tasks',
    keywords: ['file', 'contents', 'include', 'source', 'code', 'embed'],
    priority: 4
  },
  {
    id: 'task-folder-structure',
    title: 'Include Folder Structure',
    description: 'Include directory structure in task documentation',
    category: 'Settings',
    page: 'tasks',
    keywords: ['folder', 'structure', 'directory', 'tree', 'hierarchy'],
    priority: 4
  },
  {
    id: 'task-implementation-steps',
    title: 'Implementation Steps',
    description: 'Include implementation steps in generated tasks',
    category: 'Settings',
    page: 'tasks',
    keywords: ['implementation', 'steps', 'instructions', 'workflow'],
    priority: 4
  },
  {
    id: 'task-group-by-directory',
    title: 'Group by Directory',
    description: 'Organize tasks by directory structure',
    category: 'Organization',
    page: 'tasks',
    keywords: ['group', 'directory', 'organize', 'structure'],
    priority: 4
  },
  {
    id: 'task-output-format',
    title: 'Output Format',
    description: 'Choose output format: Markdown, Text, or HTML',
    category: 'Export',
    page: 'tasks',
    keywords: ['output', 'format', 'markdown', 'text', 'html', 'export'],
    priority: 4
  },
  {
    id: 'task-files-per-task',
    title: 'Files per Task',
    description: 'Configure how many files to include in each task',
    category: 'Settings',
    page: 'tasks',
    keywords: ['files', 'task', 'count', 'limit', 'batch'],
    priority: 4
  },
  {
    id: 'task-custom-instructions',
    title: 'Custom Instructions',
    description: 'Add custom instructions to generated tasks',
    category: 'Customization',
    page: 'tasks',
    keywords: ['custom', 'instructions', 'notes', 'description'],
    priority: 4
  },
  {
    id: 'task-drag-drop',
    title: 'Drag & Drop File Organization',
    description: 'Organize files with drag and drop interface',
    category: 'Organization',
    page: 'tasks',
    keywords: ['drag', 'drop', 'organize', 'files', 'reorder', 'groups'],
    priority: 3
  },

  // Scaffold Generator - Based on actual implementation
  {
    id: 'scaffold-generator',
    title: 'Scaffold Generator',
    description: 'Generate cross-platform scripts to recreate directory structures',
    category: 'Tools',
    page: 'scaffold',
    keywords: ['scaffold', 'generator', 'scripts', 'directory', 'structure', 'template'],
    priority: 2
  },
  {
    id: 'scaffold-target-os',
    title: 'Target Operating System',
    description: 'Choose target OS: Windows, macOS, Linux, or Cross-platform',
    category: 'Configuration',
    page: 'scaffold',
    keywords: ['os', 'operating', 'system', 'windows', 'macos', 'linux', 'cross-platform'],
    priority: 4
  },
  {
    id: 'scaffold-include-content',
    title: 'Include File Content',
    description: 'Include actual file contents in scaffold scripts',
    category: 'Settings',
    page: 'scaffold',
    keywords: ['content', 'files', 'include', 'source'],
    priority: 4
  },
  {
    id: 'scaffold-directories-only',
    title: 'Create Directories Only',
    description: 'Generate scripts that create only directory structure',
    category: 'Settings',
    page: 'scaffold',
    keywords: ['directories', 'folders', 'structure', 'only'],
    priority: 4
  },
  {
    id: 'scaffold-output-format',
    title: 'Script Format',
    description: 'Choose script format: PowerShell, Bash, Python, Node.js, etc.',
    category: 'Configuration',
    page: 'scaffold',
    keywords: ['script', 'format', 'powershell', 'bash', 'python', 'nodejs', 'ruby', 'perl'],
    priority: 4
  },
  {
    id: 'scaffold-comments',
    title: 'Add Comments',
    description: 'Include comments in generated scaffold scripts',
    category: 'Settings',
    page: 'scaffold',
    keywords: ['comments', 'documentation', 'script'],
    priority: 4
  },

  // Settings Page - Based on actual implementation
  {
    id: 'settings',
    title: 'Settings',
    description: 'Customize your editor experience and preferences',
    category: 'Configuration',
    page: 'settings',
    keywords: ['settings', 'preferences', 'configuration', 'customize'],
    priority: 2
  },
  {
    id: 'appearance-settings',
    title: 'Appearance',
    description: 'Customize the visual appearance of your editor',
    category: 'Appearance',
    page: 'settings',
    keywords: ['appearance', 'visual', 'theme', 'display'],
    priority: 3
  },
  {
    id: 'theme-setting',
    title: 'Theme',
    description: 'Choose between light and dark theme',
    category: 'Appearance',
    page: 'settings',
    keywords: ['theme', 'light', 'dark', 'color', 'mode'],
    priority: 3
  },
  {
    id: 'high-contrast',
    title: 'High Contrast',
    description: 'Enable high contrast mode for better accessibility',
    category: 'Accessibility',
    page: 'settings',
    keywords: ['high', 'contrast', 'accessibility', 'vision'],
    priority: 4
  },
  {
    id: 'font-size',
    title: 'Font Size',
    description: 'Adjust font size: Small, Medium, or Large',
    category: 'Appearance',
    page: 'settings',
    keywords: ['font', 'size', 'text', 'small', 'medium', 'large'],
    priority: 4
  },
  {
    id: 'icon-size',
    title: 'Icon Size',
    description: 'Adjust icon size: Small, Medium, or Large',
    category: 'Appearance',
    page: 'settings',
    keywords: ['icon', 'size', 'small', 'medium', 'large'],
    priority: 4
  },
  {
    id: 'border-thickness',
    title: 'Border Thickness',
    description: 'Adjust border thickness: None, Thin, Medium, or Thick',
    category: 'Appearance',
    page: 'settings',
    keywords: ['border', 'thickness', 'none', 'thin', 'medium', 'thick'],
    priority: 4
  },
  {
    id: 'sidebar-position',
    title: 'Sidebar Position',
    description: 'Choose sidebar position: Left or Right',
    category: 'Layout',
    page: 'settings',
    keywords: ['sidebar', 'position', 'left', 'right', 'layout'],
    priority: 4
  },
  {
    id: 'show-status-bar',
    title: 'Show Status Bar',
    description: 'Toggle status bar visibility',
    category: 'Layout',
    page: 'settings',
    keywords: ['status', 'bar', 'show', 'hide', 'visibility'],
    priority: 4
  }
]

// Helper functions for searching
export const searchResults = (query: string, limit: number = 10): SearchResult[] => {
  if (!query.trim()) return []
  
  const normalizedQuery = query.toLowerCase().trim()
  const words = normalizedQuery.split(/\s+/)
  
  // Score each result based on relevance
  const scoredResults = searchData.map(item => {
    let score = 0
    
    // Exact title match gets highest score
    if (item.title.toLowerCase() === normalizedQuery) {
      score += 100
    } else if (item.title.toLowerCase().includes(normalizedQuery)) {
      score += 50
    }
    
    // Check if title starts with query
    if (item.title.toLowerCase().startsWith(normalizedQuery)) {
      score += 30
    }
    
    // Description match
    if (item.description.toLowerCase().includes(normalizedQuery)) {
      score += 20
    }
    
    // Keyword matches
    const keywordMatches = item.keywords.filter(keyword => 
      keyword.toLowerCase().includes(normalizedQuery) ||
      words.some(word => keyword.toLowerCase().includes(word))
    )
    score += keywordMatches.length * 10
    
    // Category match
    if (item.category.toLowerCase().includes(normalizedQuery)) {
      score += 15
    }
    
    // Word-by-word matching
    words.forEach(word => {
      if (word.length > 2) { // Skip very short words
        if (item.title.toLowerCase().includes(word)) score += 5
        if (item.description.toLowerCase().includes(word)) score += 3
        if (item.keywords.some(k => k.toLowerCase().includes(word))) score += 2
      }
    })
    
    // Priority bonus (lower priority number = higher bonus)
    score += (5 - item.priority) * 2
    
    return { ...item, score }
  })
  
  // Filter out results with no score and sort by score
  return scoredResults
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export const getSearchResultsByCategory = (category: string): SearchResult[] => {
  return searchData.filter(item => item.category === category)
}

export const getAllCategories = (): string[] => {
  return Array.from(new Set(searchData.map(item => item.category))).sort()
}