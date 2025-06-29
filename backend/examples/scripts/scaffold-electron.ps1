# Scaffold Electron - Electron Application Setup
# Implements task_01.0.md from 4_electron folder

Write-Host "=== Electron Application Scaffold ===" -ForegroundColor Blue
Write-Host ""

# Get current directory and ensure we're in project root
$currentDir = Get-Location
Write-Host "Current directory: $currentDir" -ForegroundColor Yellow

# Check if we're in a project root (should have package.json and electron folder)
if (-not (Test-Path "package.json") -or -not (Test-Path "electron")) {
    Write-Host "ERROR: Must be run from project root directory (should contain package.json and electron folder)" -ForegroundColor Red
    Write-Host "Run scaffold-init.ps1 first if you haven't already." -ForegroundColor Red
    exit 1
}

Write-Host "Starting Electron application setup..." -ForegroundColor Green

try {
    # 1. Install Electron & Build Tool Dependencies (at Root)
    Write-Host "Step 1: Installing Electron dependencies..." -ForegroundColor Yellow
    npm install --save-dev electron electron-builder electron-reload wait-on cross-env concurrently
    
    # 2. Create electron/package.json (minimal)
    Write-Host "Step 2: Creating electron package.json..." -ForegroundColor Yellow
    Set-Location "electron"
    
    $electronPackageJson = @"
{
  "name": "insightllm-studio-electron",
  "version": "1.0.0",
  "main": "main.js"
}
"@
    $electronPackageJson | Set-Content "package.json"
    
    # 3. Create main.js
    Write-Host "Step 3: Creating main.js..." -ForegroundColor Yellow
    $mainJs = @"
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const { spawn } = require('child_process')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

let mainWindow
let apiProcess = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hidden',
    show: false
  })

  if (isDev) {
    console.log('Development mode: Loading from http://localhost:5173')
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    const resourcesPath = app.isPackaged
      ? process.resourcesPath
      : process.env.ELECTRON_EXTRA_RESOURCES_DIR
    const indexPath = app.isPackaged
      ? path.join(resourcesPath, 'frontend', 'index.html')
      : path.join(resourcesPath, 'frontend', 'app', 'dist', 'index.html')
    console.log('Loading from:', indexPath)
    mainWindow.loadFile(indexPath)
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function startApi() {
  if (isDev) {
    console.log('Development mode: .NET API should be started manually.')
    return
  }

  const apiName = process.platform === 'win32' ? 'backend.exe' : 'backend'
  const resourcesPath = app.isPackaged
    ? process.resourcesPath
    : process.env.ELECTRON_EXTRA_RESOURCES_DIR
  const apiPath = app.isPackaged
    ? path.join(resourcesPath, 'backend', 'publish', apiName)
    : path.join(resourcesPath, 'backend', 'publish', apiName)

  const env = { ...process.env, ASPNETCORE_URLS: 'http://localhost:5001' }
  if (app.isPackaged) {
    env.IS_PACKAGED = 'true'
  }

  console.log(`Attempting to start packaged API from: ${apiPath}`)

  try {
    apiProcess = spawn(apiPath, [], {
      stdio: 'pipe',
      detached: false,
      env: env,
    })

    apiProcess.stdout.on('data', (data) => {
      console.log(`API stdout: ${data.toString()}`)
    })

    apiProcess.stderr.on('data', (data) => {
      console.error(`API stderr: ${data.toString()}`)
    })

    apiProcess.on('error', (error) => {
      console.error('Failed to start API process:', error)
      apiProcess = null
    })

    apiProcess.on('close', (code) => {
      console.log(`API process exited with code ${code}`)
      apiProcess = null
    })

    console.log('Packaged API process started.')
  } catch (error) {
    console.error('Error spawning API process:', error)
    apiProcess = null
  }
}

function stopApi() {
  if (apiProcess) {
    console.log('Attempting to kill API process...')
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', apiProcess.pid, '/f', '/t'])
    } else {
      apiProcess.kill('SIGTERM')
    }
    apiProcess = null
  }
}

app.whenReady().then(() => {
  createWindow()
  
  if (!isDev) {
    startApi()
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  stopApi()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  stopApi()
})

// Hide default menu
Menu.setApplicationMenu(null)

// IPC handlers
ipcMain.handle('get-platform', () => {
  return process.platform
})

ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})
"@
    $mainJs | Set-Content "main.js"
    
    # 4. Create preload.js
    Write-Host "Step 4: Creating preload.js..." -ForegroundColor Yellow
    $preloadJs = @"
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // File system operations
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  selectFile: (options) => ipcRenderer.invoke('select-file', options),
  
  // Application info
  isElectron: true,
  isDevelopment: process.env.NODE_ENV === 'development'
})
"@
    $preloadJs | Set-Content "preload.js"
    
    # Return to project root
    Set-Location $currentDir
    
    # 5. Update Root package.json
    Write-Host "Step 5: Updating root package.json..." -ForegroundColor Yellow
    
    # Read existing package.json
    $packageJsonPath = "package.json"
    $existingPackageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    
    # Update the package.json with Electron configuration
    $existingPackageJson.name = "insightllm-studio"
    $existingPackageJson.version = "1.0.0"
    $existingPackageJson.description = "InsightLLM Studio Application"
    $existingPackageJson.main = "electron/main.js"
    
    # Update scripts
    $existingPackageJson.scripts = @{
        "start:backend" = "cd backend && dotnet watch run"
        "start:frontend" = "cd frontend/app && npm run dev"
        "start:electron" = "wait-on http://localhost:5173 && cross-env NODE_ENV=development electron ."
        "start" = "concurrently --kill-others `"npm:start:backend`" `"npm:start:frontend`" `"npm:start:electron`""
        "dev" = "npm run start"
        "build:web" = "cd frontend/app && npm run build"
        "build:backend" = "cd backend && dotnet publish -c Release -o ./publish"
        "build:backend:win" = "cd backend && dotnet publish -c Release -r win-x64 -o ./publish"
        "build:backend:mac" = "cd backend && dotnet publish -c Release -r osx-x64 -o ./publish"
        "build:backend:linux" = "cd backend && dotnet publish -c Release -r linux-x64 -o ./publish"
        "build:electron" = "npm run build:web && npm run build:backend && electron-builder"
        "build:win" = "npm run build:web && npm run build:backend:win && electron-builder --win"
        "build:mac" = "npm run build:web && npm run build:backend:mac && electron-builder --mac"
        "build:linux" = "npm run build:web && npm run build:backend:linux && electron-builder --linux"
        "build" = "npm run build:electron"
    }
    
    # Add build configuration for electron-builder
    $existingPackageJson | Add-Member -MemberType NoteProperty -Name "build" -Value @{
        "appId" = "com.insightllm.studio"
        "productName" = "InsightLLM Studio"
        "directories" = @{
            "output" = "dist_electron"
            "buildResources" = "electron/assets"
        }
        "files" = @(
            "electron/main.js",
            "electron/preload.js",
            "electron/package.json",
            "!**/*.map",
            "!node_modules/.bin/**/*"
        )
        "extraResources" = @(
            @{
                "from" = "backend/publish"
                "to" = "backend/publish"
                "filter" = @("**/*")
            },
            @{
                "from" = "frontend/app/dist"
                "to" = "frontend"
                "filter" = @("**/*")
            }
        )
        "win" = @{
            "target" = "nsis"
            "icon" = "electron/assets/icon.ico"
        }
        "mac" = @{
            "target" = "dmg"
            "icon" = "electron/assets/icon.icns"
            "category" = "public.app-category.utilities"
        }
        "linux" = @{
            "target" = "AppImage"
            "icon" = "electron/assets/icon.png"
            "category" = "Utility"
        }
    }
    
    # Add devDependencies if they don't exist
    if (-not $existingPackageJson.devDependencies) {
        $existingPackageJson | Add-Member -MemberType NoteProperty -Name "devDependencies" -Value @{}
    }
    
    $devDeps = @{
        "electron" = "^latest"
        "electron-builder" = "^latest"
        "electron-reload" = "^latest"
        "wait-on" = "^latest"
        "cross-env" = "^latest"
        "concurrently" = "^latest"
    }
    
    foreach ($dep in $devDeps.GetEnumerator()) {
        $existingPackageJson.devDependencies | Add-Member -MemberType NoteProperty -Name $dep.Key -Value $dep.Value -Force
    }
    
    # Save updated package.json
    $existingPackageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath
    
    # 6. Create assets directory and placeholder icons
    Write-Host "Step 6: Creating assets directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path "electron/assets" | Out-Null
    
    # Create placeholder icon files
    New-Item -ItemType File -Force -Path "electron/assets/icon.ico" | Out-Null
    New-Item -ItemType File -Force -Path "electron/assets/icon.icns" | Out-Null
    New-Item -ItemType File -Force -Path "electron/assets/icon.png" | Out-Null
    
    Write-Host "✓ Electron application setup completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "ERROR: Failed to set up Electron application: $_" -ForegroundColor Red
    exit 1
} finally {
    # Return to project root
    Set-Location $currentDir
}

Write-Host ""
Write-Host "Electron application created successfully!" -ForegroundColor Green
Write-Host "Location: electron/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files created:" -ForegroundColor Cyan
Write-Host "- electron/main.js (Main Electron process)" -ForegroundColor White
Write-Host "- electron/preload.js (Preload script for IPC)" -ForegroundColor White
Write-Host "- electron/package.json (Electron package config)" -ForegroundColor White
Write-Host "- electron/assets/ (Icon placeholder files)" -ForegroundColor White
Write-Host "- Updated root package.json with Electron scripts and build config" -ForegroundColor White
Write-Host ""