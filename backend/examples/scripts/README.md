# Project14 Scaffold Scripts

This directory contains PowerShell scripts to scaffold a complete project structure with React frontend, .NET backend, and Electron desktop wrapper.

## Overview

The scaffold scripts implement the tasks defined in the `../tasks/` folder:
- **1_init/task_01.0.md** → `scaffold-init.ps1`
- **2_frontend/task_01.0.md** → `scaffold-frontend.ps1`  
- **3_backend/task_01.0.md** → `scaffold-backend.ps1`
- **4_electron/task_01.0.md** → `scaffold-electron.ps1`

## Quick Start

### Option 1: Complete Setup (Recommended)
```powershell
# Run from anywhere - will prompt for project location
.\scaffold-all.ps1
```

### Option 2: Individual Scripts
```powershell
# 1. Initialize project structure
.\scaffold-init.ps1

# 2. Set up React frontend (run from project root)
.\scaffold-frontend.ps1

# 3. Set up .NET backend (run from project root)  
.\scaffold-backend.ps1

# 4. Set up Electron wrapper (run from project root)
.\scaffold-electron.ps1
```

## What Gets Created

### Project Structure
```
your-project/
├── package.json (root - Electron scripts and config)
├── frontend/
│   └── app/ (React + TypeScript + Vite)
├── backend/ (.NET 8 Web API)
└── electron/ (Desktop wrapper)
```

### Frontend (`frontend/app/`)
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Features**: Component structure, hooks, services, utilities
- **Build**: Optimized for Electron integration

### Backend (`backend/`)
- **Framework**: .NET 8 Web API
- **Database**: Entity Framework Core with SQLite
- **Features**: Controllers, services, repositories, DTOs
- **Architecture**: Clean architecture with proper separation

### Electron (`electron/`)
- **Main Process**: Window management, API process control
- **Preload**: Secure IPC communication
- **Build**: electron-builder configuration for all platforms

## Prerequisites

### Required Software
- **Node.js** (v18 or later)
- **.NET 8 SDK**
- **PowerShell** (Windows PowerShell or PowerShell Core)

### Verification Commands
```powershell
node --version    # Should be v18+
npm --version     # Should be 8+
dotnet --version  # Should be 8.0+
```

## Development Workflow

After scaffolding, navigate to your project root:

```powershell
cd "your-project-path"

# Start all services (recommended for development)
npm run dev

# Or start individually:
npm run start:backend   # .NET API on http://localhost:5000
npm run start:frontend  # Vite dev server on http://localhost:5173  
npm run start:electron  # Electron app (waits for frontend)
```

## Build Commands

```powershell
# Build everything
npm run build

# Build components individually
npm run build:web      # Frontend only
npm run build:backend  # Backend only  
npm run build:electron # Complete Electron app

# Platform-specific builds
npm run build:win      # Windows executable
npm run build:mac      # macOS app
npm run build:linux    # Linux AppImage
```

## Script Details

### `scaffold-init.ps1`
- Cleans and creates root directory structure
- Creates `electron/`, `frontend/`, `backend/` folders
- Initializes root `package.json`

### `scaffold-frontend.ps1` 
- Creates Vite React TypeScript project
- Sets up complete component structure (60+ placeholder files)
- Configures TypeScript, ESLint, Tailwind
- Creates minimal working app with "Scaffold works 🚀" message

### `scaffold-backend.ps1`
- Creates .NET 8 Web API project
- Installs Entity Framework and required packages
- Creates complete project structure (Models, Services, Controllers, etc.)
- Generates 25+ placeholder class files

### `scaffold-electron.ps1`
- Installs Electron and build dependencies
- Creates `main.js` with window and API process management
- Creates `preload.js` for secure IPC
- Updates root `package.json` with Electron scripts and build config

## Customization

### Icons
Replace placeholder files in `electron/assets/`:
- `icon.ico` (Windows)
- `icon.icns` (macOS)  
- `icon.png` (Linux)

### Package Names
Update these in root `package.json`:
- `name`: Application name
- `productName`: Display name
- `appId`: Unique application identifier

### Ports
Default ports (configurable in scripts):
- Frontend dev server: 5173
- Backend API: 5000/5001

## Troubleshooting

### Common Issues

**Scripts require execution policy change:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**NPM install fails:**
- Ensure Node.js v18+ is installed
- Try clearing npm cache: `npm cache clean --force`

**.NET build fails:**
- Ensure .NET 8 SDK is installed
- Try: `dotnet nuget locals all --clear`

**Electron fails to start:**
- Ensure frontend dev server is running first
- Check port 5173 is available

### Getting Help

1. Check script output for specific error messages
2. Verify all prerequisites are installed
3. Ensure you're running from correct directory
4. Try running individual scripts to isolate issues

## Implementation Notes

These scripts implement **Task #1** from each subfolder:
- Creates foundational structure and empty files
- Establishes build pipeline and development workflow  
- Provides working skeleton for further development

The generated project serves as a starting point - placeholder files should be populated with actual implementation code for your specific use case.