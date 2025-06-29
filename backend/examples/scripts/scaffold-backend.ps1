# Scaffold Backend - .NET 8 Web API Project Setup
# Implements task_01.0.md from 3_backend folder

Write-Host "=== Backend Project Scaffold ===" -ForegroundColor Blue
Write-Host ""

# Get current directory and ensure we're in project root
$currentDir = Get-Location
Write-Host "Current directory: $currentDir" -ForegroundColor Yellow

# Check if we're in a project root (should have package.json and backend folder)
if (-not (Test-Path "package.json") -or -not (Test-Path "backend")) {
    Write-Host "ERROR: Must be run from project root directory (should contain package.json and backend folder)" -ForegroundColor Red
    Write-Host "Run scaffold-init.ps1 first if you haven't already." -ForegroundColor Red
    exit 1
}

Write-Host "Starting backend project setup..." -ForegroundColor Green

try {
    # 1. Scaffold Project and Install Packages
    Write-Host "Step 1: Creating .NET Web API project..." -ForegroundColor Yellow
    Set-Location "backend"
    dotnet new webapi -f net8.0 --no-https --output .
    
    # 2. Create NuGet.config file
    Write-Host "Step 2: Creating NuGet.config..." -ForegroundColor Yellow
    $nugetConfig = @"
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <clear />
    <add key="LocalPackages" value="C:\Projects\NuGet" />
  </packageSources>
</configuration>
"@
    $nugetConfig | Set-Content "NuGet.config"
    
    # 3. Edit the backend.csproj file
    Write-Host "Step 3: Updating project file..." -ForegroundColor Yellow
    $csprojContent = @"
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
    <NoWarn>`$(NoWarn);1591</NoWarn>
  </PropertyGroup>

  <ItemGroup>
  <PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.15" />
    <PackageReference Include="Microsoft.AspNetCore.SignalR" Version="1.2.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.0.5">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="9.0.5" />
    <PackageReference Include="Serilog.AspNetCore" Version="9.0.0" />
    <PackageReference Include="Serilog.Sinks.File" Version="7.0.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="8.1.2" />
  </ItemGroup>

</Project>
"@
    $csprojContent | Set-Content "backend.csproj"
    
    # 4. Create Project Structure
    Write-Host "Step 4: Creating project structure..." -ForegroundColor Yellow
    
    # Create directories
    $directories = @(
        'Data',
        'Data\Repositories',
        'Data\Models',
        'Services',
        'Services\Dtos',
        'Models',
        'Hubs',
        'Sinks',
        'Controllers'
    )
    
    foreach ($dir in $directories) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    
    # Create empty placeholder files
    $files = @(
        'Data\ApplicationDbContext.cs',
        'Data\DataSeeder.cs',
        'Data\Repositories\ILlmModelRepository.cs',
        'Data\Repositories\LlmModelRepository.cs',
        'Data\Repositories\IComparisonRepository.cs',
        'Data\Repositories\ComparisonRepository.cs',
        'Services\ILlmModelService.cs',
        'Services\LlmModelService.cs',
        'Services\IComparisonService.cs',
        'Services\ComparisonService.cs',
        'Services\MappingProfile.cs',
        'Services\IApiDocumentationService.cs',
        'Services\ReflectionApiDocumentationService.cs',
        'Services\ILogService.cs',
        'Services\LogService.cs',
        'Services\Dtos\LlmModelDto.cs',
        'Services\Dtos\CreateLlmModelDto.cs',
        'Services\Dtos\UpdateLlmModelDto.cs',
        'Services\Dtos\ComparisonRecordDto.cs',
        'Services\Dtos\CreateComparisonRecordDto.cs',
        'Services\Dtos\UpdateComparisonRecordDto.cs',
        'Models\LogEntry.cs',
        'Models\ApiDocumentation.cs',
        'Data\Models\LlmModel.cs',
        'Data\Models\ComparisonRecord.cs',
        'Hubs\LogHub.cs',
        'Sinks\SignalRSink.cs',
        'Controllers\LlmModelsController.cs',
        'Controllers\ComparisonRecordsController.cs',
        'Controllers\ApiManagementController.cs'
    )
    
    foreach ($file in $files) {
        New-Item -ItemType File -Force -Path $file | Out-Null
    }
    
    # 5. Restore packages and build
    Write-Host "Step 5: Restoring packages and building..." -ForegroundColor Yellow
    dotnet restore
    dotnet build
    
    Write-Host "✓ Backend project setup completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "ERROR: Failed to set up backend project: $_" -ForegroundColor Red
    exit 1
} finally {
    # Return to project root
    Set-Location $currentDir
}

Write-Host ""
Write-Host "Backend project created successfully!" -ForegroundColor Green
Write-Host "Location: backend/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project structure created:" -ForegroundColor Cyan
Write-Host "- Data/ (Entity Framework context and models)" -ForegroundColor White
Write-Host "- Services/ (Business logic and DTOs)" -ForegroundColor White
Write-Host "- Controllers/ (API endpoints)" -ForegroundColor White
Write-Host "- Hubs/ (SignalR hubs)" -ForegroundColor White
Write-Host "- Models/ (Application models)" -ForegroundColor White
Write-Host ""
