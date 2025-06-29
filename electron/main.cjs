const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs').promises
const { spawn } = require('child_process')

// Import our backend services
const DirectoryScanner = require('./services/DirectoryScanner.cjs')
const TaskGenerator = require('./services/TaskGenerator.cjs')
const ScaffoldGenerator = require('./services/ScaffoldGenerator.cjs')

let mainWindow
let apiProcess = null
const isDev = process.env.NODE_ENV === 'development'

// Initialize services
const directoryScanner = new DirectoryScanner()
const taskGenerator = new TaskGenerator()
const scaffoldGenerator = new ScaffoldGenerator()

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
    titleBarStyle: 'hidden',
    frame: false,
    show: false,
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../frontend/app/dist/index.html'))
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle window state changes
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-state-change', { isMaximized: true })
  })

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-state-change', { isMaximized: false })
  })
}

// App event handlers
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (apiProcess) {
    apiProcess.kill()
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// IPC Handlers

// Window control
ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize()
})

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  }
})

ipcMain.handle('window-close', () => {
  if (mainWindow) mainWindow.close()
})

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false
})

// File operations
ipcMain.handle('file-open', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'All Files', extensions: ['*'] },
        { name: 'Text Files', extensions: ['txt', 'md', 'json'] },
      ],
    })

    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0]
      const content = await fs.readFile(filePath, 'utf8')
      return { path: filePath, content }
    }
    return null
  } catch (error) {
    console.error('Error opening file:', error)
    return null
  }
})

ipcMain.handle('file-save', async (event, filePath, content) => {
  try {
    await fs.writeFile(filePath, content, 'utf8')
    return true
  } catch (error) {
    console.error('Error saving file:', error)
    return false
  }
})

ipcMain.handle('file-save-as', async (event, content) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      filters: [
        { name: 'All Files', extensions: ['*'] },
        { name: 'Text Files', extensions: ['txt', 'md', 'json'] },
      ],
    })

    if (!result.canceled && result.filePath) {
      await fs.writeFile(result.filePath, content, 'utf8')
      return { path: result.filePath, success: true }
    }
    return null
  } catch (error) {
    console.error('Error saving file:', error)
    return { success: false }
  }
})

// Directory operations
ipcMain.handle('select-directory', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })
    return result
  } catch (error) {
    console.error('Error selecting directory:', error)
    return null
  }
})

// Task Writer specific operations
ipcMain.handle('scan-directory', async (event, directoryPath, settings) => {
  try {
    return await directoryScanner.scanDirectory(directoryPath, settings)
  } catch (error) {
    console.error('Error scanning directory:', error)
    return null
  }
})


ipcMain.handle('generate-tasks', async (event, directoryPath, settings) => {
  try {
    return await taskGenerator.generateTasks(directoryPath, settings)
  } catch (error) {
    console.error('Error generating tasks:', error)
    return null
  }
})

ipcMain.handle('export-tasks', async (event, tasks, format) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: 'tasks',
      properties: ['createDirectory'],
    })

    if (!result.canceled && result.filePath) {
      await taskGenerator.exportTasks(tasks, result.filePath, format)
      return { success: true, directory: result.filePath }
    }
    return null
  } catch (error) {
    console.error('Error exporting tasks:', error)
    return null
  }
})

ipcMain.handle('export-single-task', async (event, task) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: `${task.name}.md`,
      filters: [
        { name: 'Markdown Files', extensions: ['md'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })

    if (!result.canceled && result.filePath) {
      await fs.writeFile(result.filePath, task.content, 'utf8')
      return { success: true, filePath: result.filePath }
    }
    return null
  } catch (error) {
    console.error('Error exporting single task:', error)
    return null
  }
})

ipcMain.handle('generate-scaffold', async (event, directoryPath, settings) => {
  try {
    return await scaffoldGenerator.generateScaffold(directoryPath, settings)
  } catch (error) {
    console.error('Error generating scaffold:', error)
    return null
  }
})

ipcMain.handle('export-scaffolds', async (event, scaffolds) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: 'scaffolds',
      properties: ['createDirectory'],
    })

    if (!result.canceled && result.filePath) {
      await scaffoldGenerator.exportScaffolds(scaffolds, result.filePath)
      return { success: true, directory: result.filePath }
    }
    return null
  } catch (error) {
    console.error('Error exporting scaffolds:', error)
    return null
  }
})

ipcMain.handle('export-single-scaffold', async (event, scaffold) => {
  try {
    const extension = scaffoldGenerator.getExtensionForFormat(scaffold.format)
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: `${scaffold.name}${extension}`,
      filters: [
        { name: 'Script Files', extensions: [extension.substring(1)] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })

    if (!result.canceled && result.filePath) {
      await fs.writeFile(result.filePath, scaffold.content, 'utf8')
      return { success: true, filePath: result.filePath }
    }
    return null
  } catch (error) {
    console.error('Error exporting single scaffold:', error)
    return null
  }
})

// Storage operations
ipcMain.handle('storage-save-settings', async (event, settings) => {
  try {
    const userDataPath = app.getPath('userData')
    const settingsPath = path.join(userDataPath, 'settings.json')
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving settings:', error)
  }
})

ipcMain.handle('storage-load-settings', async () => {
  try {
    const userDataPath = app.getPath('userData')
    const settingsPath = path.join(userDataPath, 'settings.json')
    const data = await fs.readFile(settingsPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading settings:', error)
    return null
  }
})

// File queue operations
ipcMain.handle('file-queue-save', async (event, queue) => {
  try {
    const userDataPath = app.getPath('userData')
    const queuePath = path.join(userDataPath, 'file-queue.json')
    await fs.writeFile(queuePath, JSON.stringify(queue, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving file queue:', error)
  }
})

ipcMain.handle('file-queue-load', async () => {
  try {
    const userDataPath = app.getPath('userData')
    const queuePath = path.join(userDataPath, 'file-queue.json')
    const data = await fs.readFile(queuePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading file queue:', error)
    return null
  }
})

ipcMain.handle('file-queue-export', async (event, queue) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: 'file-queue.json',
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })

    if (!result.canceled && result.filePath) {
      await fs.writeFile(result.filePath, JSON.stringify(queue, null, 2), 'utf8')
      return result.filePath
    }
    return null
  } catch (error) {
    console.error('Error exporting file queue:', error)
    return null
  }
})

ipcMain.handle('file-queue-import', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })

    if (!result.canceled && result.filePaths.length > 0) {
      const data = await fs.readFile(result.filePaths[0], 'utf8')
      return JSON.parse(data)
    }
    return null
  } catch (error) {
    console.error('Error importing file queue:', error)
    return null
  }
})

// API process management
ipcMain.handle('api-start', async () => {
  try {
    if (apiProcess) {
      return true // Already running
    }

    // Start the API process (if you have one)
    // apiProcess = spawn('node', ['api/server.js'])
    return true
  } catch (error) {
    console.error('Error starting API process:', error)
    return false
  }
})

ipcMain.handle('api-stop', async () => {
  try {
    if (apiProcess) {
      apiProcess.kill()
      apiProcess = null
    }
    return true
  } catch (error) {
    console.error('Error stopping API process:', error)
    return false
  }
})

ipcMain.handle('api-restart', async () => {
  try {
    await ipcMain.handle('api-stop')
    return await ipcMain.handle('api-start')
  } catch (error) {
    console.error('Error restarting API process:', error)
    return false
  }
})

ipcMain.handle('api-status', async () => {
  return {
    isRunning: apiProcess !== null,
    pid: apiProcess ? apiProcess.pid : null,
  }
})

// App info
ipcMain.handle('app-get-version', () => {
  return app.getVersion()
})

ipcMain.handle('app-get-path', () => {
  return app.getAppPath()
})

// Dev tools
ipcMain.handle('dev-open-devtools', () => {
  if (mainWindow && isDev) {
    mainWindow.webContents.openDevTools()
  }
})

ipcMain.handle('dev-reload', () => {
  if (mainWindow && isDev) {
    mainWindow.webContents.reload()
  }
})

// Dialog operations
ipcMain.handle('dialog-save', async (event, defaultPath) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath,
    })
    return result.canceled ? null : result.filePath
  } catch (error) {
    console.error('Error showing save dialog:', error)
    return null
  }
})

ipcMain.handle('dialog-open', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
    })
    return result.canceled ? null : result.filePaths
  } catch (error) {
    console.error('Error showing open dialog:', error)
    return null
  }
})

ipcMain.handle('dialog-message', async (event, message, type = 'info') => {
  try {
    await dialog.showMessageBox(mainWindow, {
      type,
      message,
    })
  } catch (error) {
    console.error('Error showing message dialog:', error)
  }
})