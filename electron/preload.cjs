const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
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

  // File queue operations
  fileQueue: {
    saveFileQueue: (queue) => ipcRenderer.invoke('file-queue-save', queue),
    loadFileQueue: () => ipcRenderer.invoke('file-queue-load'),
    exportFileQueue: (queue) => ipcRenderer.invoke('file-queue-export', queue),
    importFileQueue: () => ipcRenderer.invoke('file-queue-import'),
  },

  // Window operations
  window: {
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    unmaximize: () => ipcRenderer.invoke('window-maximize'), // Same handler toggles
    close: () => ipcRenderer.invoke('window-close'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  },

  // Dialog operations
  dialog: {
    showSaveDialog: (defaultPath) => ipcRenderer.invoke('dialog-save', defaultPath),
    showOpenDialog: () => ipcRenderer.invoke('dialog-open'),
    showMessageBox: (message, type) => ipcRenderer.invoke('dialog-message', message, type),
  },

  // App operations
  app: {
    getVersion: () => ipcRenderer.invoke('app-get-version'),
    getPath: () => ipcRenderer.invoke('app-get-path'),
  },

  // Development operations
  dev: {
    openDevTools: () => ipcRenderer.invoke('dev-open-devtools'),
    reload: () => ipcRenderer.invoke('dev-reload'),
  },

  // API process control
  startApiProcess: () => ipcRenderer.invoke('api-start'),
  stopApiProcess: () => ipcRenderer.invoke('api-stop'),
  restartApiProcess: () => ipcRenderer.invoke('api-restart'),
  getApiStatus: () => ipcRenderer.invoke('api-status'),

  // Window state change listener
  onWindowStateChange: (callback) => {
    const listener = (event, state) => callback(state)
    ipcRenderer.on('window-state-change', listener)
    
    // Return cleanup function
    return () => {
      ipcRenderer.removeListener('window-state-change', listener)
    }
  },

  // Task Writer specific APIs
  
  // Directory operations
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  
  // Directory scanning
  scanDirectory: (path, settings) => ipcRenderer.invoke('scan-directory', path, settings),
  
  // Task generation
  generateTasks: (path, settings) => ipcRenderer.invoke('generate-tasks', path, settings),
  exportTasks: (tasks, format) => ipcRenderer.invoke('export-tasks', tasks, format),
  exportSingleTask: (task) => ipcRenderer.invoke('export-single-task', task),
  
  // Scaffold generation
  generateScaffold: (path, settings) => ipcRenderer.invoke('generate-scaffold', path, settings),
  exportScaffolds: (scaffolds) => ipcRenderer.invoke('export-scaffolds', scaffolds),
  exportSingleScaffold: (scaffold) => ipcRenderer.invoke('export-single-scaffold', scaffold),
})

// Log that preload script has loaded
console.log('Preload script loaded successfully')