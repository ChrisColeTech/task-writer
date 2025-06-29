### Rules

1.) **CONCISENESS CLAUSE** When replying use as few words as needed to explain, plan or analyze. Long winded replies waste time and tokens. No long explanations. Stick to the main points an keep it breif. Do not perform extra work or validation.

2.) **WORKSPACE DIRECTIVE** Before you write any code or run any terminal commands, Verify you are in the workspace. Do not create files or folders outside of the workspace. No other files are permitted to be created other than what is in the task files. Create files only where specified: frontend, backend, electron, (or root if main package.json).

3.) **COMMAND FORMATTING** Always use && to chain commands in terminal! Use tools properly when needed, especially: **read file, write to file, execute command, read multiple files, list files, new task and complete task.**

4.) **READ THE TASK FILE AND THEN SUMMARIZE** Summarize and list the steps in the task file in chat after you read it (**HIGH LEVEL SUMMARY ONLY - NO CODE, NO COMMANDS**). Then follow the steps **VERBATIM** in the **EXACT** order they appear in the task file. Read rules **VERBATIM**, and follow them explicitly. For efficiency, do not explain code or make overly verbose comments. Only spend a maximum of 10 seconds thinking.

5.) **IMPORTANT** do not stop to resolve build errors, missing files or missing imports.

6.) **FULL PATHS ONLY** Always confirm you are in the correct working directory first! When running terminal commands always use full paths for folders (e.g. cd C:/Projects/foo) to avoid errors.

7.) **READ FIRST DIRECTIVE** Read folders and files first before you write! File content is changed by the linter after you save. So before writing to a file you must read it first to get its latest content!

8.) Complete all work in the task file. Do not create or modify anything outside of these files.

9.) **TOOL USAGE CLAUSE** Always use the appropriate tools provided by the system for file operations. Specifically:

Use read_file to read files instead of command line utilities like type
Use write_to_file or insert_content to modify files
Use execute_command for running terminal commands Failing to use these tools properly may result in incomplete or incorrect task execution.

10.) **FINAL CHECKLIST** Always verify location before executing terminal commands. Use Full Paths: Always use full paths for directories when executing terminal commands. Resolve Terminal errors and syntax errors, ignore missing imports and do not create "placeholder" files unless instructed to do so. Do not create files or folders outside the workspace. **Only create files specified.** Only fix syntax errors and do not run the build to verify until the final task and all components have been fully populated.

# (Do not use terminal to populate files) Write the code for Frontend

## Content:

Create or update the files below.

# Service Documentation: BrowserService

**Location**: `frontend\app\src\services\browserService.tsx`

### Verbatim Code Sample (Key Methods):

```typescript
export class BrowserService {
  private readonly SETTINGS_STORAGE_KEY = 'app-settings'
  private readonly FILE_QUEUE_STORAGE_KEY = 'app-file-queue'

  constructor() {
    console.log('BrowserService initialized - running in browser environment')
  }

  // Settings operations using localStorage
  async saveSettings(settings: Record<string, unknown>): Promise<void> {
    try {
      localStorage.setItem(this.SETTINGS_STORAGE_KEY, JSON.stringify(settings))
      console.log('Settings saved to localStorage:', settings)
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error)
      throw new Error('Failed to save settings')
    }
  }

  async loadSettings(): Promise<Record<string, unknown> | null> {
    try {
      const stored = localStorage.getItem(this.SETTINGS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log('Settings loaded from localStorage:', parsed)
        return parsed
      }
      console.log('No settings found in localStorage')
      return null
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error)
      return null
    }
  }

  // File operations - mock implementations using browser APIs
  async openFile(): Promise<{ path: string; content: string } | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '*/*'

      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const content = e.target?.result as string
            resolve({
              path: file.name, // In browser, we only have the filename
              content: content,
            })
          }
          reader.onerror = () => {
            console.error('Failed to read file')
            resolve(null)
          }
          reader.readAsText(file)
        } else {
          resolve(null)
        }
      }

      input.oncancel = () => resolve(null)
      input.click()
    })
  }

  async saveFile(path: string, content: string): Promise<boolean> {
    try {
      // In browser, we can't save to a specific path, so we'll trigger a download
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = path.split('/').pop() || 'file.txt' // Use filename from path
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      URL.revokeObjectURL(url)

      console.log(`File saved (downloaded): ${path}`)
      return true
    } catch (error) {
      console.error('Failed to save file:', error)
      return false
    }
  }

  async saveFileAs(content: string): Promise<{ path: string; success: boolean } | null> {
    try {
      // Create a default filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const defaultFilename = `file-${timestamp}.txt`

      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = defaultFilename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      URL.revokeObjectURL(url)

      console.log(`File saved as (downloaded): ${defaultFilename}`)
      return {
        path: defaultFilename,
        success: true,
      }
    } catch (error) {
      console.error('Failed to save file as:', error)
      return null
    }
  }

  // Window operations - mock implementations
  minimizeWindow(): void {
    console.log('Mock: Window minimize requested (not supported in browser)')
    // In a real browser app, you might show a notification or hide the app in some way
  }

  async maximizeWindow(): Promise<void> {
    console.log('Mock: Window maximize requested')
    // Try to enter fullscreen mode as a browser equivalent
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log('Failed to enter fullscreen:', err)
      })
    }
  }

  closeWindow(): void {
    console.log('Mock: Window close requested')
    // In browser, we can only close the current tab/window
    if (confirm('Are you sure you want to close this tab?')) {
      window.close()
    }
  }

  async isMaximized(): Promise<boolean> {
    // Check if in fullscreen mode as browser equivalent
    return !!document.fullscreenElement
  }

  // Dialog operations - browser implementations
  async showSaveDialog(defaultPath?: string): Promise<string | null> {
    console.log('Mock: Save dialog requested with default path:', defaultPath)

    // Use browser prompt as a simple implementation
    const filename = prompt('Enter filename to save:', defaultPath || 'file.txt')
    return filename
  }

  async showOpenDialog(): Promise<string[] | null> {
    console.log('Mock: Open dialog requested')

    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = true
      input.accept = '*/*'

      input.onchange = (event) => {
        const files = Array.from((event.target as HTMLInputElement).files || [])
        const filenames = files.map((file) => file.name)
        resolve(filenames.length > 0 ? filenames : null)
      }

      input.oncancel = () => resolve(null)
      input.click()
    })
  }

  async showMessageBox(
    message: string,
    type: 'info' | 'warning' | 'error' = 'info',
  ): Promise<void> {
    console.log(`Mock: Message box (${type}):`, message)

    // Use browser alert for simple implementation
    switch (type) {
      case 'error':
        alert(`Error: ${message}`)
        break
      case 'warning':
        alert(`Warning: ${message}`)
        break
      case 'info':
      default:
        alert(message)
        break
    }
  }

  // File queue operations using localStorage
  async saveFileQueue(queue: any[]): Promise<void> {
    try {
      localStorage.setItem(this.FILE_QUEUE_STORAGE_KEY, JSON.stringify(queue))
      console.log('File queue saved to localStorage:', queue.length, 'items')
    } catch (error) {
      console.error('Failed to save file queue to localStorage:', error)
      throw new Error('Failed to save file queue')
    }
  }

  async loadFileQueue(): Promise<any[] | null> {
    try {
      const stored = localStorage.getItem(this.FILE_QUEUE_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log('File queue loaded from localStorage:', parsed.length, 'items')
        return parsed
      }
      console.log('No file queue found in localStorage')
      return null
    } catch (error) {
      console.error('Failed to load file queue from localStorage:', error)
      return null
    }
  }

  async exportFileQueue(queue: any[]): Promise<string | null> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `file-queue-${timestamp}.json`
      const content = JSON.stringify(queue, null, 2)

      const blob = new Blob([content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      URL.revokeObjectURL(url)

      console.log('File queue exported (downloaded):', filename)
      return filename
    } catch (error) {
      console.error('Failed to export file queue:', error)
      return null
    }
  }

  async importFileQueue(): Promise<any[] | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'

      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            try {
              const content = e.target?.result as string
              const queue = JSON.parse(content)
              console.log('File queue imported from file:', queue.length, 'items')
              resolve(queue)
            } catch (error) {
              console.error('Failed to parse imported file queue:', error)
              resolve(null)
            }
          }
          reader.onerror = () => {
            console.error('Failed to read file queue file')
            resolve(null)
          }
          reader.readAsText(file)
        } else {
          resolve(null)
        }
      }

      input.oncancel = () => resolve(null)
      input.click()
    })
  }
}
```

---

# Service Documentation: ElectronService

**Location**: `frontend\app\src\services\electronService.tsx`

### Dependencies:

```typescript
import type { ElectronAPI } from '@/types/electron-api.d'
```

### Class Structure:

```typescript
export class ElectronService {
  private electronAPI: ElectronAPI | undefined

  constructor() {
    this.electronAPI = (window as Window).electronAPI
  }

  isAvailable(): boolean {
    return !!this.electronAPI
  }

  // Settings operations
  async saveSettings(settings: Record<string, unknown>): Promise<void> {
    if (this.isAvailable() && this.electronAPI?.storage) {
      await this.electronAPI.storage.saveSettings(settings)
    }
  }

  async loadSettings(): Promise<Record<string, unknown> | null> {
    if (this.isAvailable() && this.electronAPI?.storage) {
      return await this.electronAPI.storage.loadSettings()
    }
    return null
  }

  // File operations
  async openFile(): Promise<{ path: string; content: string } | null> {
    if (this.isAvailable() && this.electronAPI?.file) {
      return await this.electronAPI.file.openFile()
    }
    return null
  }

  async saveFile(path: string, content: string): Promise<boolean> {
    if (this.isAvailable() && this.electronAPI?.file) {
      return await this.electronAPI.file.saveFile(path, content)
    }
    return false
  }

  async saveFileAs(content: string): Promise<{ path: string; success: boolean } | null> {
    if (this.isAvailable() && this.electronAPI?.file) {
      return await this.electronAPI.file.saveFileAs(content)
    }
    return null
  }

  // File queue operations
  async saveFileQueue(queue: any[]): Promise<void> {
    if (this.isAvailable() && this.electronAPI?.fileQueue) {
      await this.electronAPI.fileQueue.saveFileQueue(queue)
    }
  }

  async loadFileQueue(): Promise<any[] | null> {
    if (this.isAvailable() && this.electronAPI?.fileQueue) {
      return await this.electronAPI.fileQueue.loadFileQueue()
    }
    return null
  }

  async exportFileQueue(queue: any[]): Promise<string | null> {
    if (this.isAvailable() && this.electronAPI?.fileQueue) {
      return await this.electronAPI.fileQueue.exportFileQueue(queue)
    }
    return null
  }

  async importFileQueue(): Promise<any[] | null> {
    if (this.isAvailable() && this.electronAPI?.fileQueue) {
      return await this.electronAPI.fileQueue.importFileQueue()
    }
    return null
  }

  // Window operations
  async minimizeWindow(): Promise<void> {
    if (this.isAvailable() && this.electronAPI?.window) {
      this.electronAPI.window.minimize()
    }
  }

  async maximizeWindow(): Promise<void> {
    if (this.isAvailable() && this.electronAPI?.window) {
      this.electronAPI.window.maximize()
    }
  }

  closeWindow(): void {
    if (this.isAvailable() && this.electronAPI?.window) {
      this.electronAPI.window.close()
    }
  }

  async isMaximized(): Promise<boolean> {
    if (this.isAvailable() && this.electronAPI?.window) {
      return this.electronAPI.window.isMaximized()
    }
    return false
  }

  // Dialog operations
  async showSaveDialog(defaultPath?: string): Promise<string | null> {
    if (this.isAvailable() && this.electronAPI?.dialog) {
      return await this.electronAPI.dialog.showSaveDialog(defaultPath)
    }
    return null
  }

  async showOpenDialog(): Promise<string[] | null> {
    if (this.isAvailable() && this.electronAPI?.dialog) {
      return await this.electronAPI.dialog.showOpenDialog()
    }
    return null
  }

  async showMessageBox(message: string, type?: 'info' | 'warning' | 'error'): Promise<void> {
    if (this.isAvailable() && this.electronAPI?.dialog) {
      await this.electronAPI.dialog.showMessageBox(message, type)
    }
  }

  // API Process Control
  async startApiProcess(): Promise<boolean> {
    if (this.isAvailable() && this.electronAPI?.startApiProcess) {
      return await this.electronAPI.startApiProcess()
    }
    return false
  }

  async stopApiProcess(): Promise<boolean> {
    if (this.isAvailable() && this.electronAPI?.stopApiProcess) {
      return await this.electronAPI.stopApiProcess()
    }
    return false
  }

  async restartApiProcess(): Promise<boolean> {
    if (this.isAvailable() && this.electronAPI?.restartApiProcess) {
      return await this.electronAPI.restartApiProcess()
    }
    return false
  }

  async getApiStatus(): Promise<{ isRunning: boolean; pid: number | null }> {
    if (this.isAvailable() && this.electronAPI?.getApiStatus) {
      return await this.electronAPI.getApiStatus()
    }
    return { isRunning: false, pid: null }
  }

  // Window State Change Listener
  onWindowStateChange(callback: (state: { isMaximized: boolean }) => void): () => void {
    if (this.isAvailable() && this.electronAPI?.onWindowStateChange) {
      return this.electronAPI.onWindowStateChange(callback)
    }
    return () => {} // Return no-op function
  }

  // App operations
  getVersion(): string {
    if (this.isAvailable() && this.electronAPI?.app) {
      return this.electronAPI.app.getVersion()
    }
    return '1.0.0'
  }

  getPath(): string {
    if (this.isAvailable() && this.electronAPI?.app) {
      return this.electronAPI.app.getPath()
    }
    return ''
  }

  // Development operations
  openDevTools(): void {
    if (this.isAvailable() && this.electronAPI?.dev) {
      this.electronAPI.dev.openDevTools()
    }
  }

  reload(): void {
    if (this.isAvailable() && this.electronAPI?.dev) {
      this.electronAPI.dev.reload()
    }
  }
}
```

# Service Documentation: PlatformService

**Location**: `frontend\app\src\services\platformService.tsx`

### `PlatformService` Interface:

```typescript
export interface PlatformService {
  // Settings operations
  saveSettings(settings: Record<string, unknown>): Promise<void>
  loadSettings(): Promise<Record<string, unknown> | null>

  // File operations
  openFile(): Promise<{ path: string; content: string } | null>
  saveFile(path: string, content: string): Promise<boolean>
  saveFileAs(content: string): Promise<{ path: string; success: boolean } | null>

  // File queue operations
  saveFileQueue(files: any[]): Promise<void>
  loadFileQueue(): Promise<any[] | null>
  exportFileQueue(files: any[]): Promise<string | null>
  importFileQueue(): Promise<any[] | null>

  // Window operations
  minimizeWindow(): void
  maximizeWindow(): Promise<void>
  closeWindow(): void
  isMaximized(): Promise<boolean>
  onWindowStateChange: (callback: (state: { isMaximized: boolean }) => void) => () => void

  // Dialog operations
  showSaveDialog(defaultPath?: string): Promise<string | null>
  showOpenDialog(): Promise<string[] | null>
  showMessageBox(message: string, type?: 'info' | 'warning' | 'error'): Promise<void>

  // Platform detection
  isElectron(): boolean
  isBrowser(): boolean
  getPlatform(): 'electron' | 'browser'
}
```

### Verbatim Code Sample (Core Structure):

```typescript
import { BrowserService } from '@/services/browserService'
import { ElectronService } from '@/services/electronService'

class PlatformServiceImpl implements PlatformService {
  private electronService: ElectronService
  private browserService: BrowserService
  private _isElectron: boolean

  constructor() {
    // Detect if we're running in Electron
    this._isElectron =
      !!(window as Window & { electronAPI?: unknown }).electronAPI ||
      !!(window as Window & { require?: unknown }).require

    console.log('PlatformService initialized - isElectron:', this._isElectron)

    this.electronService = new ElectronService()
    this.browserService = new BrowserService()
  }

  isElectron(): boolean {
    return this._isElectron
  }

  isBrowser(): boolean {
    return !this._isElectron
  }

  getPlatform(): 'electron' | 'browser' {
    return this._isElectron ? 'electron' : 'browser'
  }

  // Settings operations
  async saveSettings(settings: Record<string, unknown>): Promise<void> {
    if (this._isElectron) {
      return this.electronService.saveSettings(settings)
    } else {
      return this.browserService.saveSettings(settings)
    }
  }

  async loadSettings(): Promise<Record<string, unknown> | null> {
    if (this._isElectron) {
      return this.electronService.loadSettings()
    } else {
      return this.browserService.loadSettings()
    }
  }

  // File operations
  async openFile(): Promise<{ path: string; content: string } | null> {
    if (this._isElectron) {
      return this.electronService.openFile()
    } else {
      return this.browserService.openFile()
    }
  }

  async saveFile(path: string, content: string): Promise<boolean> {
    if (this._isElectron) {
      return this.electronService.saveFile(path, content)
    } else {
      return this.browserService.saveFile(path, content)
    }
  }

  async saveFileAs(content: string): Promise<{ path: string; success: boolean } | null> {
    if (this._isElectron) {
      return this.electronService.saveFileAs(content)
    } else {
      return this.browserService.saveFileAs(content)
    }
  }

  // File queue operations
  async saveFileQueue(files: any[]): Promise<void> {
    console.log(
      'PlatformService.saveFileQueue called - using',
      this._isElectron ? 'Electron' : 'Browser',
    )
    if (this._isElectron) {
      return this.electronService.saveFileQueue(files)
    } else {
      return this.browserService.saveFileQueue(files)
    }
  }

  async loadFileQueue(): Promise<any[] | null> {
    console.log(
      'PlatformService.loadFileQueue called - using',
      this._isElectron ? 'Electron' : 'Browser',
    )
    if (this._isElectron) {
      return this.electronService.loadFileQueue()
    } else {
      return this.browserService.loadFileQueue()
    }
  }

  async exportFileQueue(files: any[]): Promise<string | null> {
    if (this._isElectron) {
      return this.electronService.exportFileQueue(files)
    } else {
      return this.browserService.exportFileQueue(files)
    }
  }

  async importFileQueue(): Promise<any[] | null> {
    if (this._isElectron) {
      return this.electronService.importFileQueue()
    } else {
      return this.browserService.importFileQueue()
    }
  }

  // Window operations
  minimizeWindow(): void {
    if (this._isElectron) {
      this.electronService.minimizeWindow()
    } else {
      this.browserService.minimizeWindow()
    }
  }

  async maximizeWindow(): Promise<void> {
    if (this._isElectron) {
      await this.electronService.maximizeWindow()
    } else {
      await this.browserService.maximizeWindow()
    }
  }

  closeWindow(): void {
    if (this._isElectron) {
      this.electronService.closeWindow()
    } else {
      this.browserService.closeWindow()
    }
  }

  async isMaximized(): Promise<boolean> {
    if (this._isElectron) {
      return await this.electronService.isMaximized()
    } else {
      return await this.browserService.isMaximized()
    }
  }

  onWindowStateChange(callback: (state: { isMaximized: boolean }) => void): () => void {
    if (this._isElectron) {
      return this.electronService.onWindowStateChange(callback)
    } else {
      // In browser, we can simulate this or return a no-op
      console.warn('onWindowStateChange is not fully supported in browser environment.')
      return () => {} // No-op unsubscribe
    }
  }

  // Dialog operations
  async showSaveDialog(defaultPath?: string): Promise<string | null> {
    if (this._isElectron) {
      return this.electronService.showSaveDialog(defaultPath)
    } else {
      return this.browserService.showSaveDialog(defaultPath)
    }
  }

  async showOpenDialog(): Promise<string[] | null> {
    if (this._isElectron) {
      return this.electronService.showOpenDialog()
    } else {
      return this.browserService.showOpenDialog()
    }
  }

  async showMessageBox(
    message: string,
    type: 'info' | 'warning' | 'error' = 'info',
  ): Promise<void> {
    if (this._isElectron) {
      return this.electronService.showMessageBox(message, type)
    } else {
      return this.browserService.showMessageBox(message, type)
    }
  }
}

// Singleton instance
let platformServiceInstance: PlatformServiceImpl | null = null

export const getPlatformService = (): PlatformService => {
  if (!platformServiceInstance) {
    platformServiceInstance = new PlatformServiceImpl()
  }
  return platformServiceInstance
}

export const initializePlatformService = (): PlatformService => {
  platformServiceInstance = new PlatformServiceImpl()
  return platformServiceInstance
}
```

## Then call attempt completion
