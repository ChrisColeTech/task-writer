# Scaffold Init - Project Initialization
# Implements task_01.0.md from 1_init folder

Write-Host "=== Project Initialization Scaffold ===" -ForegroundColor Blue
Write-Host ""

# Get current directory
$currentDir = Get-Location
Write-Host "Current directory: $currentDir" -ForegroundColor Yellow

# Prompt for project root path
Write-Host "Enter the full path to your project root (where you want to create the project): " -NoNewline -ForegroundColor Yellow
$projectRoot = Read-Host

if ([string]::IsNullOrWhiteSpace($projectRoot)) {
    Write-Host "ERROR: Project root path is required." -ForegroundColor Red
    exit 1
}

# Ensure the project root directory exists
if (-not (Test-Path $projectRoot)) {
    Write-Host "Creating project root directory: $projectRoot" -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $projectRoot | Out-Null
}

# Change to project root
Write-Host "Changing to project root: $projectRoot" -ForegroundColor Yellow
Set-Location $projectRoot

Write-Host "Starting project initialization..." -ForegroundColor Green

try {
    # STEP 1: Clean the root
    Write-Host "Step 1: Cleaning root directory..." -ForegroundColor Yellow
    Get-ChildItem -Path . -Recurse -Force | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
    
    # STEP 2: Create the three top-level folders
    Write-Host "Step 2: Creating top-level folders..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path "electron" | Out-Null
    New-Item -ItemType Directory -Force -Path "frontend" | Out-Null
    New-Item -ItemType Directory -Force -Path "backend" | Out-Null
    
    # STEP 3: Initialize a single root package.json
    Write-Host "Step 3: Initializing root package.json..." -ForegroundColor Yellow
    npm init -y
    
    Write-Host "✓ Project initialization completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Created structure:" -ForegroundColor Cyan
    Write-Host "- /electron" -ForegroundColor White
    Write-Host "- /frontend" -ForegroundColor White  
    Write-Host "- /backend" -ForegroundColor White
    Write-Host "- package.json" -ForegroundColor White
    
} catch {
    Write-Host "ERROR: Failed to initialize project: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Run scaffold-frontend.ps1 to set up the React frontend" -ForegroundColor White
Write-Host "2. Run scaffold-backend.ps1 to set up the .NET backend" -ForegroundColor White
Write-Host "3. Run scaffold-electron.ps1 to set up the Electron wrapper" -ForegroundColor White