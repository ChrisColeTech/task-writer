# Scaffold All - Complete Project Setup
# Orchestrates all scaffold scripts in the correct order

Write-Host "=== Complete Project Scaffold ===" -ForegroundColor Blue
Write-Host "This script will set up the entire project structure including:" -ForegroundColor Yellow
Write-Host "1. Project initialization (root structure)" -ForegroundColor White
Write-Host "2. Frontend (React/Vite application)" -ForegroundColor White
Write-Host "3. Backend (.NET 8 Web API)" -ForegroundColor White
Write-Host "4. Electron (Desktop application wrapper)" -ForegroundColor White
Write-Host ""

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Script directory: $scriptDir" -ForegroundColor Yellow

# Prompt for project root path
Write-Host "Enter the full path where you want to create the project: " -NoNewline -ForegroundColor Yellow
$projectRoot = Read-Host

if ([string]::IsNullOrWhiteSpace($projectRoot)) {
    Write-Host "ERROR: Project root path is required." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting complete project scaffold..." -ForegroundColor Green
Write-Host "Target location: $projectRoot" -ForegroundColor Cyan
Write-Host ""

try {
    # Step 1: Initialize project structure
    Write-Host "=== Step 1: Initializing project structure ===" -ForegroundColor Magenta
    $initScript = Join-Path $scriptDir "scaffold-init.ps1"
    if (-not (Test-Path $initScript)) {
        throw "scaffold-init.ps1 not found in $scriptDir"
    }
    
    # Run init script with project root
    $env:SCAFFOLD_PROJECT_ROOT = $projectRoot
    & $initScript
    
    if ($LASTEXITCODE -ne 0) {
        throw "Project initialization failed"
    }
    
    # Change to project root for remaining steps
    Set-Location $projectRoot
    
    # Step 2: Setup frontend
    Write-Host ""
    Write-Host "=== Step 2: Setting up frontend (React/Vite) ===" -ForegroundColor Magenta
    $frontendScript = Join-Path $scriptDir "scaffold-frontend.ps1"
    if (-not (Test-Path $frontendScript)) {
        throw "scaffold-frontend.ps1 not found in $scriptDir"
    }
    
    & $frontendScript
    
    if ($LASTEXITCODE -ne 0) {
        throw "Frontend setup failed"
    }
    
    # Step 3: Setup backend
    Write-Host ""
    Write-Host "=== Step 3: Setting up backend (.NET 8 Web API) ===" -ForegroundColor Magenta
    $backendScript = Join-Path $scriptDir "scaffold-backend.ps1"
    if (-not (Test-Path $backendScript)) {
        throw "scaffold-backend.ps1 not found in $scriptDir"
    }
    
    & $backendScript
    
    if ($LASTEXITCODE -ne 0) {
        throw "Backend setup failed"
    }
    
    # Step 4: Setup electron
    Write-Host ""
    Write-Host "=== Step 4: Setting up Electron (Desktop wrapper) ===" -ForegroundColor Magenta
    $electronScript = Join-Path $scriptDir "scaffold-electron.ps1"
    if (-not (Test-Path $electronScript)) {
        throw "scaffold-electron.ps1 not found in $scriptDir"
    }
    
    & $electronScript
    
    if ($LASTEXITCODE -ne 0) {
        throw "Electron setup failed"
    }
    
    Write-Host ""
    Write-Host "🎉 COMPLETE PROJECT SCAFFOLD FINISHED! 🎉" -ForegroundColor Green
    Write-Host ""
    Write-Host "Project structure created at: $projectRoot" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Your project includes:" -ForegroundColor Yellow
    Write-Host "✓ Root package.json with Electron scripts" -ForegroundColor Green
    Write-Host "✓ frontend/app/ - React + TypeScript + Vite application" -ForegroundColor Green
    Write-Host "✓ backend/ - .NET 8 Web API with Entity Framework" -ForegroundColor Green
    Write-Host "✓ electron/ - Desktop application wrapper" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. cd `"$projectRoot`"" -ForegroundColor White
    Write-Host "2. Replace placeholder icon files in electron/assets/" -ForegroundColor White
    Write-Host "3. Start development: npm run dev" -ForegroundColor White
    Write-Host "4. Build for production: npm run build" -ForegroundColor White
    Write-Host ""
    Write-Host "Development workflow:" -ForegroundColor Yellow
    Write-Host "- npm run dev - Starts all services (backend, frontend, electron)" -ForegroundColor White
    Write-Host "- npm run build:web - Builds frontend only" -ForegroundColor White
    Write-Host "- npm run build:backend - Builds backend only" -ForegroundColor White
    Write-Host "- npm run build - Builds complete Electron app" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "ERROR: Complete scaffold failed: $_" -ForegroundColor Red
    Write-Host "Check the error messages above for details." -ForegroundColor Red
    exit 1
}