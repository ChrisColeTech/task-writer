# Task Writer - Electron Integration Documentation

## Overview

The Task Writer application is built as an Electron desktop application that combines a React frontend with Node.js backend services. This document provides comprehensive details on the Electron integration architecture, IPC communication, security model, and service integration.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Process Model](#process-model)
3. [Security Model](#security-model)
4. [IPC Communication](#ipc-communication)
5. [Platform Services](#platform-services)
6. [Backend Services](#backend-services)
7. [File System Operations](#file-system-operations)
8. [Window Management](#window-management)
9. [Settings Persistence](#settings-persistence)
10. [Development vs Production](#development-vs-production)
11. [API Integration](#api-integration)
12. [Error Handling](#error-handling)
13. [Performance Considerations](#performance-considerations)
14. [Security Best Practices](#security-best-practices)

## Architecture Overview

The Task Writer Electron integration follows a secure, multi-process architecture:

```
┌─────────────────────────────────────────┐
│              Main Process               │
│     (Node.js + Electron Native APIs)   │
│  ┌─────────────────────────────────────┐│
│  │         Backend Services            ││
│  │   DirectoryScanner, TaskGenerator   ││
│  │      ScaffoldGenerator, etc.        ││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│              IPC Bridge                 │
│           (Secure Context)              │
├─────────────────────────────────────────┤
│           Renderer Process              │
│         (React + TypeScript)            │
│  ┌─────────────────────────────────────┐│
│  │         Platform Services           ││
│  │   ElectronService, BrowserService   ││
│  │      PlatformService (Unified)      ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Key Design Principles

- **Security First**: Context isolation and minimal API exposure
- **Process Separation**: Clear separation between main and renderer processes
- **Platform Abstraction**: Unified interface for Electron and browser environments
- **Service-Oriented**: Modular backend services for different features
- **Type Safety**: Full TypeScript integration with IPC APIs

## Process Model

### Main Process

**Location**: `/electron/main.cjs`

The main process controls the application lifecycle and manages native APIs:

```javascript
const { app, BrowserWindow, dialog, ipcMain } = require('electron')

// Import backend services
const DirectoryScanner = require('./services/DirectoryScanner.cjs')
const TaskGenerator = require('./services/TaskGenerator.cjs')
const ScaffoldGenerator = require('./services/ScaffoldGenerator.cjs')

// Initialize services
const directoryScanner = new DirectoryScanner()
const taskGenerator = new TaskGenerator()
const scaffoldGenerator = new ScaffoldGenerator()

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,        // Security: No Node.js in renderer
      contextIsolation: true,        // Security: Isolated context
      enableRemoteModule: false,     // Security: No remote module
      preload: path.join(__dirname, 'preload.cjs'),
    },
    titleBarStyle: 'hidden',         // Custom title bar
    frame: false,                    // Frameless window
    show: false,                     // Hide until ready
  })
}
```

**Responsibilities**:
- Application lifecycle management
- Window creation and management
- Native API access (file system, dialogs)
- Backend service coordination
- IPC handler registration

### Renderer Process

**Location**: `/frontend/app/src/` (React application)

The renderer process runs the user interface in a sandboxed environment:

```typescript
// Platform abstraction layer
export class ElectronService {
  private electronAPI: ElectronAPI | undefined

  constructor() {
    this.electronAPI = (window as Window).electronAPI
  }

  isAvailable(): boolean {
    return !!this.electronAPI
  }
  
  // Service methods use IPC to communicate with main process
}
```

**Responsibilities**:
- User interface rendering
- User interaction handling
- State management
- IPC communication via preload script
- Platform service abstraction

### Preload Script

**Location**: `/electron/preload.cjs`

The preload script provides a secure bridge between processes:

```javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Storage operations
  storage: {
    saveSettings: (settings) => ipcRenderer.invoke('storage-save-settings', settings),
    loadSettings: () => ipcRenderer.invoke('storage-load-settings'),
  },
  
  // File operations
  file: {
    openFile: () => ipcRenderer.invoke('file-open'),
    saveFile: (path, content) => ipcRenderer.invoke('file-save', path, content),
    saveFileAs: (content) => ipcRenderer.invoke('file-save-as', content),
  },
  
  // Window operations
  window: {
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  },
  
  // Task Writer specific APIs
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  scanDirectory: (path, settings) => ipcRenderer.invoke('scan-directory', path, settings),
  generateTasks: (path, settings) => ipcRenderer.invoke('generate-tasks', path, settings),
  generateScaffold: (path, settings) => ipcRenderer.invoke('generate-scaffold', path, settings),
})
```

## Security Model

### Context Isolation

The application uses Electron's context isolation for maximum security:

```javascript
webPreferences: {
  nodeIntegration: false,         // Renderer has no Node.js access
  contextIsolation: true,         // Isolated JavaScript context
  enableRemoteModule: false,      // No remote module access
  preload: path.join(__dirname, 'preload.cjs'),
}
```

### API Surface Minimization

Only essential APIs are exposed to the renderer process:

```typescript
export interface ElectronAPI {
  storage: StorageAPI            // Settings persistence
  file: FileAPI                  // File operations
  window: WindowAPI              // Window management
  dialog: DialogAPI              // Native dialogs
  app: AppAPI                    // App information
  dev: DevAPI                    // Development tools
  
  // Task Writer specific
  selectDirectory: () => Promise<DirectoryResult>
  scanDirectory: (path: string, settings: ScanSettings) => Promise<ScanResult>
  generateTasks: (path: string, settings: TaskSettings) => Promise<TaskResult>
  generateScaffold: (path: string, settings: ScaffoldSettings) => Promise<ScaffoldResult>
}
```

### Input Validation

All IPC handlers validate input parameters:

```javascript
ipcMain.handle('file-save', async (event, filePath, content) => {
  try {
    // Validate inputs
    if (typeof filePath !== 'string' || typeof content !== 'string') {
      throw new Error('Invalid parameters')
    }
    
    // Sanitize file path
    const safePath = path.resolve(filePath)
    
    // Perform operation
    await fs.writeFile(safePath, content, 'utf8')
    return true
  } catch (error) {
    console.error('File save error:', error)
    return false
  }
})
```

## IPC Communication

### Communication Pattern

The application uses a request-response pattern for IPC:

```typescript
// Renderer process (via ElectronService)
async saveFile(path: string, content: string): Promise<boolean> {
  try {
    if (this.isAvailable() && this.electronAPI?.file) {
      return await this.electronAPI.file.saveFile(path, content)
    }
    return false
  } catch (error) {
    console.error('Failed to save file via Electron:', error)
    return false
  }
}

// Main process (IPC handler)
ipcMain.handle('file-save', async (event, filePath, content) => {
  try {
    await fs.writeFile(filePath, content, 'utf8')
    return true
  } catch (error) {
    console.error('File save error:', error)
    return false
  }
})
```

### Error Handling

IPC errors are handled gracefully at multiple levels:

```typescript
// Service level error handling
async loadSettings(): Promise<Record<string, unknown> | null> {
  try {
    if (this.isAvailable() && this.electronAPI?.storage) {
      return await this.electronAPI.storage.loadSettings()
    }
    return null
  } catch (error) {
    console.error('Failed to load settings via Electron:', error)
    return null  // Graceful fallback
  }
}

// Main process error handling
ipcMain.handle('storage-load-settings', async () => {
  try {
    const settingsPath = path.join(app.getPath('userData'), 'settings.json')
    const data = await fs.readFile(settingsPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null  // File doesn't exist
    }
    console.error('Settings load error:', error)
    throw error
  }
})
```

## Platform Services

### Platform Abstraction Layer

**Location**: `/frontend/app/src/services/platformService.ts`

The platform service provides a unified interface for Electron and browser environments:

```typescript
export interface PlatformService {
  // File operations
  openFile(): Promise<{ path: string; content: string } | null>
  saveFile(path: string, content: string): Promise<boolean>
  saveFileAs(content: string): Promise<{ path: string; success: boolean } | null>
  
  // Storage operations
  saveSettings(settings: Record<string, unknown>): Promise<void>
  loadSettings(): Promise<Record<string, unknown> | null>
  
  // Window operations
  minimizeWindow(): void
  maximizeWindow(): Promise<void>
  closeWindow(): void
  isMaximized(): Promise<boolean>
  
  // Environment detection
  isElectron(): boolean
  isBrowser(): boolean
  isMac(): boolean
  getPlatform(): 'electron' | 'browser'
}
```

### Service Implementation

```typescript
class PlatformServiceImpl implements PlatformService {
  private electronService: ElectronService
  private browserService: BrowserService
  private _isElectron: boolean

  constructor() {
    this._isElectron = !!(window as Window & { electronAPI?: unknown }).electronAPI
    this.electronService = new ElectronService()
    this.browserService = new BrowserService()
  }

  async saveSettings(settings: Record<string, unknown>): Promise<void> {
    if (this._isElectron) {
      return this.electronService.saveSettings(settings)
    } else {
      return this.browserService.saveSettings(settings)
    }
  }
  
  // Other methods delegate to appropriate service...
}
```

### Environment Detection

```typescript
// Robust Electron detection
const isElectron = !!(window as Window & { electronAPI?: unknown }).electronAPI ||
                   !!(window as Window & { require?: unknown }).require

// Platform detection
isMac(): boolean {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0
}
```

## Backend Services

### Service Architecture

The backend services are modular and focused on specific functionality:

```
electron/services/
├── DirectoryScanner.cjs     # File system scanning and analysis
├── TaskGenerator.cjs        # Task file generation with source code
└── ScaffoldGenerator.cjs    # Cross-platform script generation
```

### DirectoryScanner Service

**Location**: `/electron/services/DirectoryScanner.cjs`

```javascript
class DirectoryScanner {
  async scanDirectory(directoryPath, options = {}) {
    const {
      excludeNodeModules = true,
      excludeGitIgnored = true,
      includeDotFiles = false,
      maxDepth = 10,
      maxFileSize = 50, // MB
    } = options

    try {
      const stats = { files: 0, directories: 0, totalSize: 0 }
      const tree = await this.buildTree(directoryPath, stats, 0, maxDepth, options)
      
      return {
        tree,
        stats: {
          ...stats,
          totalSizeFormatted: this.formatSize(stats.totalSize)
        }
      }
    } catch (error) {
      console.error('Directory scan error:', error)
      throw new Error(`Failed to scan directory: ${error.message}`)
    }
  }
  
  async buildTree(dirPath, stats, currentDepth, maxDepth, options) {
    // Recursive directory tree building with filtering
  }
}
```

### TaskGenerator Service

**Location**: `/electron/services/TaskGenerator.cjs`

```javascript
class TaskGenerator {
  async generateTasks(directoryPath, settings) {
    const {
      includeFileContents = true,
      includeFolderStructure = true,
      includeImplementationSteps = true,
      groupByDirectory = true,
      outputFormat = 'markdown',
      filesPerTask = 5,
      customInstructions = '',
    } = settings

    try {
      // Scan directory for files
      const scanResult = await this.scanDirectory(directoryPath)
      
      // Group files according to settings
      const fileGroups = this.groupFiles(scanResult.files, settings)
      
      // Generate task files
      const tasks = await this.generateTaskFiles(fileGroups, settings)
      
      return {
        tasks,
        stats: {
          totalTasks: tasks.length,
          totalFiles: scanResult.files.length,
          groupCount: fileGroups.length
        }
      }
    } catch (error) {
      console.error('Task generation error:', error)
      throw new Error(`Failed to generate tasks: ${error.message}`)
    }
  }
}
```

### ScaffoldGenerator Service

**Location**: `/electron/services/ScaffoldGenerator.cjs`

```javascript
class ScaffoldGenerator {
  async generateScaffold(directoryPath, settings) {
    const {
      targetOS = 'cross-platform',
      includeContent = false,
      createDirectoriesOnly = false,
      addComments = true,
      scriptName = 'scaffold',
      outputFormat = 'bash',
    } = settings

    try {
      // Analyze directory structure
      const structure = await this.analyzeStructure(directoryPath)
      
      // Generate script based on format
      const scriptContent = await this.generateScript(structure, settings)
      
      return {
        scaffolds: [{
          id: Date.now().toString(),
          name: scriptName,
          content: scriptContent,
          format: outputFormat,
          os: targetOS,
          fileCount: structure.files.length,
          directoryCount: structure.directories.length,
          createdAt: new Date()
        }],
        stats: {
          totalScripts: 1,
          totalFiles: structure.files.length,
          totalDirectories: structure.directories.length
        }
      }
    } catch (error) {
      console.error('Scaffold generation error:', error)
      throw new Error(`Failed to generate scaffold: ${error.message}`)
    }
  }
}
```

## File System Operations

### Native File Operations

```javascript
// File selection dialog
ipcMain.handle('select-directory', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Project Directory'
    })
    
    return result
  } catch (error) {
    console.error('Directory selection error:', error)
    throw error
  }
})

// File save dialog
ipcMain.handle('dialog-save', async (event, defaultPath) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath,
      filters: [
        { name: 'All Files', extensions: ['*'] },
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'Markdown Files', extensions: ['md'] },
      ]
    })
    
    return result.canceled ? null : result.filePath
  } catch (error) {
    console.error('Save dialog error:', error)
    return null
  }
})
```

### File Content Operations

```javascript
// Read file with encoding detection
async readFile(filePath) {
  try {
    const stats = await fs.stat(filePath)
    if (stats.size > this.maxFileSize) {
      throw new Error(`File too large: ${stats.size} bytes`)
    }
    
    const buffer = await fs.readFile(filePath)
    const encoding = this.detectEncoding(buffer)
    
    return {
      content: buffer.toString(encoding),
      size: stats.size,
      encoding
    }
  } catch (error) {
    console.error('File read error:', error)
    throw error
  }
}

// Write file with atomic operation
async writeFile(filePath, content) {
  try {
    const tempPath = `${filePath}.tmp`
    await fs.writeFile(tempPath, content, 'utf8')
    await fs.rename(tempPath, filePath)
    return true
  } catch (error) {
    console.error('File write error:', error)
    // Cleanup temp file if it exists
    try {
      await fs.unlink(`${filePath}.tmp`)
    } catch {}
    throw error
  }
}
```

## Window Management

### Window Creation and Configuration

```javascript
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    titleBarStyle: 'hidden',    // Custom title bar
    frame: false,               // Frameless for custom controls
    show: false,                // Hide until ready to prevent flash
  })
}
```

### Window State Management

```javascript
// Window control handlers
ipcMain.handle('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize()
  }
})

ipcMain.handle('window-maximize', async () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
    return mainWindow.isMaximized()
  }
  return false
})

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false
})

// Window state change events
mainWindow.on('maximize', () => {
  mainWindow.webContents.send('window-state-changed', { isMaximized: true })
})

mainWindow.on('unmaximize', () => {
  mainWindow.webContents.send('window-state-changed', { isMaximized: false })
})
```

### Custom Title Bar

The application uses a custom title bar with integrated controls:

```typescript
// TitleBar component integrates window controls
<TitleBar
  sidebarPosition={settings.sidebarPosition}
  onToggleSidebarPosition={handleToggleSidebarPosition}
  theme={settings.theme}
  onToggleTheme={handleToggleTheme}
  onOpenSearch={handleOpenSearch}
  tabs={tabsWithIcons}
  onTabClick={handleTabClick}
  onTabClose={handleTabClose}
  onTabReorder={handleTabReorder}
  activeTabId={activeTabId}
/>
```

## Settings Persistence

### Settings Storage

```javascript
// Settings file location
const settingsPath = path.join(app.getPath('userData'), 'settings.json')

// Save settings
ipcMain.handle('storage-save-settings', async (event, settings) => {
  try {
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf8')
  } catch (error) {
    console.error('Settings save error:', error)
    throw error
  }
})

// Load settings
ipcMain.handle('storage-load-settings', async () => {
  try {
    const data = await fs.readFile(settingsPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null  // File doesn't exist, use defaults
    }
    throw error
  }
})
```

### Settings Migration

```javascript
// Settings version migration
function migrateSettings(settings) {
  const currentVersion = 1
  const settingsVersion = settings.version || 0
  
  if (settingsVersion < currentVersion) {
    // Perform migration steps
    if (settingsVersion < 1) {
      // Migrate from version 0 to 1
      settings.newProperty = 'defaultValue'
    }
    
    settings.version = currentVersion
  }
  
  return settings
}
```

## Development vs Production

### Environment Detection

```javascript
const isDev = process.env.NODE_ENV === 'development'

// Load appropriate content
if (isDev) {
  mainWindow.loadURL('http://localhost:5173')  // Vite dev server
  mainWindow.webContents.openDevTools()        // Auto-open dev tools
} else {
  mainWindow.loadFile(path.join(__dirname, '../frontend/app/dist/index.html'))
}
```

### Development Features

```javascript
// Development-only APIs
if (isDev) {
  contextBridge.exposeInMainWorld('electronAPI', {
    // ... production APIs
    dev: {
      openDevTools: () => ipcRenderer.invoke('dev-open-devtools'),
      reload: () => ipcRenderer.invoke('dev-reload'),
    }
  })
}

// Development IPC handlers
if (isDev) {
  ipcMain.handle('dev-open-devtools', () => {
    if (mainWindow) {
      mainWindow.webContents.openDevTools()
    }
  })
  
  ipcMain.handle('dev-reload', () => {
    if (mainWindow) {
      mainWindow.webContents.reload()
    }
  })
}
```

## API Integration

### External API Process Management

```javascript
let apiProcess = null

// Start external API process
ipcMain.handle('start-api-process', async () => {
  try {
    if (apiProcess) {
      return true  // Already running
    }
    
    apiProcess = spawn('node', ['api-server.js'], {
      cwd: path.join(__dirname, 'api'),
      stdio: 'pipe'
    })
    
    return new Promise((resolve) => {
      apiProcess.on('spawn', () => resolve(true))
      apiProcess.on('error', () => resolve(false))
    })
  } catch (error) {
    console.error('API process start error:', error)
    return false
  }
})

// Stop API process
ipcMain.handle('stop-api-process', async () => {
  try {
    if (apiProcess) {
      apiProcess.kill()
      apiProcess = null
    }
    return true
  } catch (error) {
    console.error('API process stop error:', error)
    return false
  }
})
```

## Error Handling

### Global Error Handling

```javascript
// Main process error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  // Log to file, show dialog, etc.
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
})

// Renderer process error reporting
mainWindow.webContents.on('crashed', () => {
  console.error('Renderer process crashed')
  // Handle renderer crash
})
```

### IPC Error Handling

```javascript
// Standardized error response format
ipcMain.handle('operation-name', async (event, ...args) => {
  try {
    const result = await performOperation(...args)
    return { success: true, data: result }
  } catch (error) {
    console.error('Operation error:', error)
    return { 
      success: false, 
      error: {
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR'
      }
    }
  }
})
```

## Performance Considerations

### Memory Management

```javascript
// Cleanup resources on window close
mainWindow.on('closed', () => {
  mainWindow = null
  
  // Stop background processes
  if (apiProcess) {
    apiProcess.kill()
    apiProcess = null
  }
  
  // Clear service caches
  directoryScanner.clearCache()
  taskGenerator.clearCache()
  scaffoldGenerator.clearCache()
})
```

### IPC Optimization

```typescript
// Batch IPC operations when possible
async batchOperation(items: Item[]): Promise<Result[]> {
  // Process multiple items in single IPC call
  return await this.electronAPI.batchProcess(items)
}

// Use streaming for large data
async streamLargeFile(filePath: string): Promise<ReadableStream> {
  return await this.electronAPI.createFileStream(filePath)
}
```

### Renderer Process Optimization

```typescript
// Debounce frequent IPC calls
const debouncedSave = debounce(async (settings: AppSettings) => {
  await platformService.saveSettings(settings)
}, 1000)

// Cache expensive operations
const resultCache = new Map<string, CacheEntry>()

async getCachedResult(key: string, operation: () => Promise<any>): Promise<any> {
  const cached = resultCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  
  const result = await operation()
  resultCache.set(key, { data: result, timestamp: Date.now() })
  return result
}
```

## Security Best Practices

### Input Sanitization

```javascript
// Path sanitization
function sanitizePath(inputPath) {
  const normalized = path.normalize(inputPath)
  const resolved = path.resolve(normalized)
  
  // Ensure path is within allowed directories
  const allowedPaths = [
    app.getPath('documents'),
    app.getPath('desktop'),
    app.getPath('downloads')
  ]
  
  const isAllowed = allowedPaths.some(allowedPath => 
    resolved.startsWith(path.resolve(allowedPath))
  )
  
  if (!isAllowed) {
    throw new Error('Path not allowed')
  }
  
  return resolved
}
```

### Content Security Policy

```javascript
// CSP for renderer process
mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': [
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data:; " +
        "connect-src 'self' ws://localhost:*;"
      ]
    }
  })
})
```

### Secure Defaults

```javascript
// Secure window configuration
new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,           // No Node.js in renderer
    contextIsolation: true,           // Isolated context
    enableRemoteModule: false,        // No remote module
    allowRunningInsecureContent: false,
    webSecurity: true,                // Enable web security
    experimentalFeatures: false,      // Disable experimental features
  }
})
```

## Troubleshooting

### Common Issues

1. **IPC Communication Failures**
   - Check preload script is loaded
   - Verify handler registration in main process
   - Ensure proper error handling

2. **File System Access Issues**
   - Validate file paths and permissions
   - Check platform-specific path handling
   - Verify sandboxing restrictions

3. **Window Management Problems**
   - Confirm window state synchronization
   - Check custom title bar event handling
   - Verify platform-specific window behavior

### Debug Tools

```javascript
// Enable IPC debugging
if (isDev) {
  ipcMain.on('debug-ipc', (event, channel, data) => {
    console.log(`IPC Debug: ${channel}`, data)
  })
  
  // Log all IPC invocations
  const originalHandle = ipcMain.handle
  ipcMain.handle = function(channel, handler) {
    return originalHandle.call(this, channel, async (...args) => {
      console.log(`IPC Invoke: ${channel}`, args)
      const result = await handler(...args)
      console.log(`IPC Result: ${channel}`, result)
      return result
    })
  }
}
```

---

This Electron integration provides a secure, performant, and maintainable foundation for the Task Writer desktop application. The separation of concerns between processes, comprehensive error handling, and platform abstraction ensure a robust user experience across different operating systems.