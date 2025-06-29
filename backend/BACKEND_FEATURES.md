# Backend Features Specification

## Overview

This document outlines all required features for the Task Writer backend, providing detailed specifications for each service that enables the application's **two core tasks**: generating AI-ready task files and creating cross-platform scaffold scripts.

## 🎯 Core Task Alignment

Every backend feature directly supports one or both core tasks:

1. **📄 Generate AI-Ready Task Files** - Markdown files with complete source code inclusion
2. **🔧 Generate Cross-Platform Scaffold Scripts** - 12+ script formats that recreate project structures

## 1. File Analysis Service ✅ **IMPLEMENTED (91.8% Test Coverage)**

### Implementation Status: **COMPLETE AND WORKING**
Universal text file analysis with 600+ lines of sophisticated logic supporting all major programming languages.

### ✅ Implemented Features

#### Text File Reading - **COMPLETE**
- ✅ **Universal File Support**: Reads any text-based file regardless of extension
- ✅ **Encoding Detection**: Automatic UTF-8, ASCII detection with encoding validation
- ✅ **Binary File Filtering**: Sophisticated binary detection and filtering
- ✅ **Size Limits**: Configurable file size limits with graceful handling
- ✅ **Error Handling**: Comprehensive permission and corruption error handling

#### Metadata Extraction - **COMPLETE**
- ✅ **File Information**: Complete metadata including size, dates, permissions
- ✅ **File Type Detection**: Language detection for JS/TS, Python, Java, Go, C#, etc.
- ✅ **Content Analysis**: Line counting, character analysis, complexity assessment
- ✅ **Path Analysis**: Relative path handling and directory depth tracking

#### Content Processing - **COMPLETE**
- ✅ **Syntax Detection**: Language-specific parsing for 10+ programming languages
- ✅ **Structure Analysis**: Extract imports, exports, functions, classes from code
- ✅ **Comment Extraction**: Parse TODO/FIXME comments and documentation blocks
- ✅ **Dependency Tracking**: File relationship mapping and import dependency tracking

### API Response Format
```typescript
interface FileAnalysisResult {
  path: string
  metadata: {
    size: number
    modifiedAt: Date
    type: 'code' | 'config' | 'documentation' | 'script' | 'data'
    language: string | null
    encoding: string
  }
  content: {
    raw: string
    lines: number
    characters: number
    isEmpty: boolean
  }
  structure: {
    imports: string[]
    exports: string[]
    functions: string[]
    classes: string[]
    comments: {
      todos: string[]
      fixmes: string[]
      documentation: string[]
    }
  }
  relationships: {
    dependencies: string[]  // Files this file imports
    dependents: string[]    // Files that import this file
  }
}
```

### Value to Core Tasks
- **Task Files**: Provides complete file contents with metadata for AI analysis
- **Scaffold Scripts**: Enables understanding of existing project patterns

## 2. Framework Detection Service ✅ **IMPLEMENTED (87.9% Test Coverage)**

### Implementation Status: **COMPLETE AND WORKING**
Sophisticated multi-strategy framework detection with 1,902 lines of code supporting 30+ frameworks across 6 programming languages.

### ✅ Implemented Features

#### Package.json Analysis - **COMPLETE**
- ✅ **Dependency Detection**: Comprehensive parsing of dependencies and devDependencies
- ✅ **Framework Identification**: React, Vue, Angular, Express, Next.js, NestJS, Fastify, and 20+ more
- ✅ **Tool Detection**: Vite, Webpack, TypeScript, Babel, ESLint, Prettier, Jest, Vitest
- ✅ **Version Analysis**: Framework version extraction and compatibility checking

#### Configuration File Detection - **COMPLETE**
- ✅ **Build Tools**: webpack.config.js, vite.config.js, rollup.config.js detection
- ✅ **TypeScript**: tsconfig.json, jsconfig.json parsing
- ✅ **Framework Configs**: next.config.js, nuxt.config.js, angular.json analysis
- ✅ **Testing**: jest.config.js, vitest.config.js, cypress.config.js detection
- ✅ **Multi-Language**: go.mod, Cargo.toml, pom.xml, .csproj, requirements.txt

#### File Pattern Recognition - **COMPLETE**
- ✅ **JavaScript/TypeScript**: .jsx, .tsx, component patterns, module detection
- ✅ **Python**: Django models, Flask apps, FastAPI patterns
- ✅ **Java**: Spring Boot annotations, Maven/Gradle structures
- ✅ **C#/.NET**: ASP.NET Core patterns, Blazor components
- ✅ **Go**: Module structures, framework-specific patterns
- ✅ **Rust**: Cargo workspace detection, framework identification

#### Project Architecture Detection - **COMPLETE**
- ✅ **Frontend Projects**: React SPA, Vue app, Angular app classification
- ✅ **Backend Projects**: Express API, Django, Spring Boot, ASP.NET Core
- ✅ **Full-Stack**: Next.js, Nuxt, MERN/MEAN stack detection
- ✅ **Multi-Language**: Cross-language project detection
- ✅ **Confidence Scoring**: Evidence-based confidence algorithms

### API Response Format
```typescript
interface FrameworkDetectionResult {
  frameworks: {
    frontend: Array<{
      name: string          // 'react', 'vue', 'angular'
      version: string       // '18.2.0'
      confidence: number    // 0-1 confidence score
    }>
    backend: Array<{
      name: string          // 'express', 'fastapi', 'django'
      version: string
      confidence: number
    }>
    mobile: Array<{
      name: string          // 'react-native', 'flutter'
      version: string
      confidence: number
    }>
    desktop: Array<{
      name: string          // 'electron', 'tauri'
      version: string
      confidence: number
    }>
  }
  buildTools: {
    bundler: string | null    // 'webpack', 'vite', 'rollup'
    transpiler: string | null // 'typescript', 'babel'
    taskRunner: string | null // 'npm', 'yarn', 'pnpm'
  }
  projectType: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'desktop' | 'library'
  architecture: 'spa' | 'ssr' | 'static' | 'api' | 'monorepo' | 'microservices'
  evidence: {
    [framework: string]: {
      packageJson: string[]     // Dependencies found
      configFiles: string[]    // Config files found
      filePatterns: string[]   // File patterns matched
    }
  }
}
```

### Value to Core Tasks
- **Task Files**: Enables framework-specific analysis and instructions
- **Scaffold Scripts**: Determines which templates to use and how to structure output

## 3. Task Generation Service 🚧 **MAJOR IMPLEMENTATION (73.7% Test Coverage)**

### Implementation Status: **WORKING BUT NEEDS REFINEMENT**
Complete service implementation with 1,054 lines of sophisticated task generation logic. Core functionality working with framework detection integration.

### ✅ Implemented Features

#### Task File Structure - **COMPLETE**
- ✅ **Custom Instructions Section**: User context integration at top of files
- ✅ **Task Header**: Dynamic task numbering, titles, and framework-specific overviews
- ✅ **File Listing**: Directory structure visualization with file metadata
- ✅ **File Content**: Full source code inclusion with proper formatting
- ✅ **Syntax Highlighting**: Language-appropriate code blocks for 10+ languages

#### Content Organization - **COMPLETE**
- ✅ **Logical Grouping**: Directory-based and functionality-based file grouping
- ✅ **File Ordering**: Dependency-aware ordering and importance-based sorting
- ✅ **Size Management**: Support for splitting large projects into multiple tasks
- ✅ **Filtering**: Comprehensive exclusion of binary files and build artifacts

#### Markdown Generation - **WORKING (NEEDS REFINEMENT)**
- ✅ **Template System**: Sophisticated template loading and variable substitution
- ✅ **Metadata Inclusion**: File size, modification dates, language detection
- ✅ **Code Block Formatting**: Proper syntax highlighting with language detection
- 🔧 **Format Compliance**: Working but rules section formatting needs adjustment

#### Framework Integration - **COMPLETE**
- ✅ **Framework Detection**: Deep integration with framework detection service
- ✅ **Template Selection**: Framework-specific template selection (React, .NET, Django, etc.)
- ✅ **Context Awareness**: Framework-specific instructions and analysis patterns
- ✅ **Variable Substitution**: Dynamic content based on detected technologies

### API Response Format
```typescript
interface TaskGenerationResult {
  tasks: Array<{
    id: string              // 'task_01.0'
    filename: string        // 'task_01.0.md'
    title: string          // 'Frontend Components Analysis'
    content: string        // Complete markdown content
    metadata: {
      fileCount: number
      totalSize: number
      framework: string
      generatedAt: Date
    }
    files: Array<{
      path: string
      size: number
      type: string
      modifiedAt: Date
    }>
  }>
  summary: {
    totalFiles: number
    totalTasks: number
    totalSize: number
    frameworks: string[]
    customInstructions: string
  }
}
```

### Example Output Format
```markdown
# Custom Instructions

Your project uses React with TypeScript. Focus on component reusability and proper type definitions.

---

# Task: Frontend Component Analysis

## Overview
This task covers the analysis and implementation work for React UI components.
This task includes 5 file(s) for review and potential modification.

## Directory Structure

```
└── 📁 src/components/
    ├── 📄 Button.tsx
    ├── 📄 Modal.tsx
    └── 📄 Input.tsx
```

## Files in This Task

### src/components/Button.tsx
**Type:** React TypeScript Component
**Size:** 2.3 KB
**Last Modified:** 2024-01-15T10:30:00.000Z

**Content:**
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children }) => {
  return (
    <button className={cn('btn', `btn-${variant}`)}>
      {children}
    </button>
  );
};
```
```

### Value to Core Tasks
- **Task Generation**: This IS the core task generation feature
- **Scaffold Generation**: N/A

## 4. Scaffold Generation Service 🔧 **PARTIAL IMPLEMENTATION (55.7% Test Coverage)**

### Implementation Status: **STRUCTURE EXISTS, CORE LOGIC INCOMPLETE**
Service architecture with 600+ lines of code, platform enumeration, and basic template framework. Missing core generation logic and template integration.

### ✅ Implemented Features

#### Platform & Format Support - **COMPLETE**
- ✅ **Platform Enumeration**: Windows, macOS, Linux, cross-platform classification
- ✅ **Script Format Support**: .sh, .bash, .zsh, .ps1, .bat, .py, .js, .ts, .rb, .pl
- ✅ **Format Mapping**: Automatic format selection based on platform
- ✅ **Configuration Mapping**: Request parameter validation and mapping

#### Service Architecture - **COMPLETE**
- ✅ **Service Structure**: Comprehensive TypeScript class with proper interfaces
- ✅ **Framework Integration**: Integration points with framework detection
- ✅ **Template Loading**: Basic template loading infrastructure
- ✅ **Configuration Processing**: Platform and format configuration handling

### 🔧 Incomplete Features

#### Example Application - **MISSING**
- ✅ **Built-in Examples**: Example files exist but no service to access them
- ❌ **Example Selection**: No logic to select examples based on frameworks
- ❌ **Variable Substitution**: Example variable replacement not implemented
- ❌ **Conditional Logic**: Framework-based inclusion/exclusion missing

#### Script Generation - **INCOMPLETE**
- 🔧 **Basic Structure**: Framework exists but generation logic missing
- ❌ **Content Inclusion**: No file content vs empty file logic
- ❌ **Command Generation**: No cross-platform command creation
- ❌ **Dependency Integration**: No package manager command generation

### 🚨 Critical Dependencies Missing
- ❌ **Example Management Service**: Example files exist but no service implementation (0% coverage)
- ❌ **Command Translation Service**: No cross-platform command conversion

### API Response Format
```typescript
interface ScaffoldGenerationResult {
  scripts: Array<{
    filename: string        // 'setup-project.ps1'
    format: string         // 'powershell'
    content: string        // Complete script content
    platform: string      // 'windows', 'unix', 'cross-platform'
    executable: boolean    // Whether script should be executable
  }>
  metadata: {
    example: string        // Example used
    projectName: string    // Project name
    framework: string      // Target framework
    totalFiles: number     // Files to be created
    totalDirectories: number
    generatedAt: Date
  }
  instructions: {
    usage: string          // How to run the script
    requirements: string[] // Prerequisites
    nextSteps: string[]    // What to do after running
  }
}
```

### Example Script Outputs

#### PowerShell (.ps1)
```powershell
# React TypeScript Project Setup
# Generated by Task Writer on 2024-01-15T15:45:30.000Z

param([Parameter(Mandatory=$true)][string]$ProjectName)

Write-Host "Setting up React TypeScript project: $ProjectName" -ForegroundColor Green

# Create project directory
New-Item -ItemType Directory -Force -Path $ProjectName
Set-Location $ProjectName

# Initialize with Vite
npm create vite@latest . -- --template react-ts

# Create directory structure
New-Item -ItemType Directory -Force -Path "src/components/ui"
New-Item -ItemType Directory -Force -Path "src/hooks"

# Create component files with content
@'
import React from 'react';

export const Button = ({ children }) => <button>{children}</button>;
'@ | Out-File -FilePath "src/components/ui/Button.tsx" -Encoding UTF8

npm install
Write-Host "✅ Setup completed!" -ForegroundColor Green
```

#### Bash (.sh)
```bash
#!/bin/bash
# React TypeScript Project Setup
# Generated by Task Writer on 2024-01-15T15:45:30.000Z

set -e
PROJECT_NAME="$1"

if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: $0 <project-name>"
    exit 1
fi

echo "🚀 Setting up React TypeScript project: $PROJECT_NAME"

mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

npm create vite@latest . -- --template react-ts

mkdir -p src/components/ui
mkdir -p src/hooks

cat > src/components/ui/Button.tsx << 'EOF'
import React from 'react';

export const Button = ({ children }) => <button>{children}</button>;
EOF

npm install
echo "✅ Setup completed!"
```

#### Python (.py)
```python
#!/usr/bin/env python3
# React TypeScript Project Setup
# Generated by Task Writer on 2024-01-15T15:45:30.000Z

import os
import sys
import subprocess

def main():
    if len(sys.argv) != 2:
        print("Usage: python setup-project.py <project-name>")
        sys.exit(1)
    
    project_name = sys.argv[1]
    print(f"🚀 Setting up React TypeScript project: {project_name}")
    
    # Create project directory
    os.makedirs(project_name, exist_ok=True)
    os.chdir(project_name)
    
    # Initialize with Vite
    subprocess.run(["npm", "create", "vite@latest", ".", "--", "--template", "react-ts"])
    
    # Create directory structure
    os.makedirs("src/components/ui", exist_ok=True)
    os.makedirs("src/hooks", exist_ok=True)
    
    # Create component file
    with open("src/components/ui/Button.tsx", "w") as f:
        f.write("""import React from 'react';

export const Button = ({ children }) => <button>{children}</button>;
""")
    
    subprocess.run(["npm", "install"])
    print("✅ Setup completed!")

if __name__ == "__main__":
    main()
```

### Value to Core Tasks
- **Task Generation**: N/A
- **Scaffold Generation**: This IS the core scaffold generation feature

## 5. Example Management Service ❌ **NOT IMPLEMENTED (0% Coverage)**

### Purpose
Provide access to local example files for both task generation patterns and scaffold creation using a simple dropdown UI selection system.

### Implementation Status: **FILES EXIST, SERVICE MISSING**
Example files are created but no backend service exists to access them.

### ✅ **What Exists**
- ✅ **Example Files**: 12+ script formats in examples/scripts folder
- ✅ **Task Files**: Complete task examples in examples/tasks folder  
- ✅ **All Formats**: .sh, .ps1, .py, .ts, .rb, .pl, .txt versions available
- ✅ **Real Content**: Working scripts that create React TypeScript projects

### ❌ **What's Missing (Everything Functional)**
- ❌ **ExampleManagementService.ts**: No service implementation exists
- ❌ **API Routes**: No `/api/examples` endpoints 
- ❌ **File System Access**: No code to read examples folder
- ❌ **UI Integration**: No way for frontend to get example list
- ❌ **Enumeration Logic**: No scanning/listing of available examples
- ❌ **Content Serving**: No way to serve example content to frontend

### Why Essential But Missing
- **Task Generation**: Need service to provide example task structures
- **Scaffold Generation**: Need service to load example scripts for generation
- **UI Functionality**: Frontend needs API to populate dropdown with examples

### API Response Format
```typescript
interface Example {
  id: string
  name: string
  description: string
  type: 'task' | 'script'
  framework: string[]           // ['react', 'typescript']
  category: string              // 'frontend', 'backend', 'fullstack'
  content: string               // Example file content
  format: string                // 'markdown', 'powershell', 'bash', etc.
  path: string                  // File path in examples folder
  metadata: {
    author: string
    version: string
    source: 'built-in'
    created: Date
    updated: Date
    size: number                // File size in bytes
  }
}

interface ExampleList {
  tasks: Array<{
    id: string
    name: string
    description: string
    framework: string[]
    path: string
  }>
  scripts: Array<{
    id: string
    name: string
    description: string
    framework: string[]
    format: string              // Script format (.sh, .ps1, .py, etc.)
    path: string
  }>
}
```

### Value to Core Tasks
- **Task Generation**: Provides consistent task file structures from examples/tasks
- **Scaffold Generation**: Examples define the entire scaffold content from examples/scripts

## 6. Multi-Format Export Service ⭐⭐⭐ **CRITICAL**

### Purpose
Generate and export the actual output files in all required formats.

### Why Essential
This provides the final deliverables - without export, there's no output for users

### Features

#### Task File Export
- **Markdown Generation**: Export task files as properly formatted .md files
- **Encoding Handling**: UTF-8 encoding with proper line endings
- **File Naming**: Sequential naming (task_01.0.md, task_01.1.md, etc.)
- **Batch Export**: Export multiple task files simultaneously

#### Script Export
- **All Script Formats**: Generate all 12+ script types simultaneously
- **Platform-Specific**: Proper line endings, file permissions, encoding
- **Executable Permissions**: chmod +x for Unix scripts
- **File Organization**: Organize by platform or keep all together

#### Cross-Platform Handling
- **Line Endings**: CRLF for Windows, LF for Unix
- **Path Separators**: \ for Windows, / for Unix
- **File Permissions**: Executable permissions for script files
- **Encoding**: UTF-8 with BOM for Windows when needed

#### Packaging Options
- **Individual Files**: Export each file separately
- **Archive Creation**: ZIP files with all formats
- **Directory Structure**: Organize outputs in logical directories
- **README Generation**: Include usage instructions

### API Response Format
```typescript
interface ExportResult {
  files: Array<{
    filename: string
    format: string             // 'markdown', 'powershell', 'bash', etc.
    content: string            // File content
    size: number               // File size in bytes
    platform: string          // 'windows', 'unix', 'cross-platform'
    executable: boolean        // Whether file should be executable
  }>
  archive?: {
    filename: string           // 'project-scripts.zip'
    content: Buffer            // ZIP file content
    size: number
  }
  metadata: {
    totalFiles: number
    totalSize: number
    formats: string[]
    generatedAt: Date
    exportType: 'tasks' | 'scaffolds'
  }
  instructions: {
    usage: string[]            // How to use the exported files
    requirements: string[]     // Prerequisites
    examples: string[]         // Usage examples
  }
}
```

### Value to Core Tasks
- **Task Generation**: Outputs the actual .md files users need
- **Scaffold Generation**: Outputs the actual script files users need

## 7. Command Translation Service ⭐⭐ **IMPORTANT**

### Purpose
Convert commands between different platform syntaxes to enable true cross-platform scaffold scripts.

### Why Essential
Cross-platform support requires different command formats for the same operations

### Features

#### Basic Command Translation
- **Directory Operations**: mkdir, rmdir, cd
- **File Operations**: touch, copy, move, delete
- **Content Operations**: echo, cat, grep
- **Permission Operations**: chmod, attrib

#### Platform-Specific Syntax
- **Variables**: $var (Unix) vs %var% (Batch) vs $env:var (PowerShell)
- **Path Separators**: / vs \ 
- **Command Chaining**: && vs ; vs |
- **Error Handling**: set -e vs $ErrorActionPreference

#### Advanced Features
- **Package Managers**: npm vs yarn vs pnpm
- **Build Tools**: make vs msbuild vs gradle
- **System Commands**: ps vs Get-Process vs tasklist
- **Network Commands**: curl vs Invoke-WebRequest vs wget

### API Response Format
```typescript
interface CommandTranslationResult {
  translations: {
    [platform: string]: {
      commands: string[]
      variables: Record<string, string>
      syntax: {
        variableDeclaration: string
        commandChaining: string
        errorHandling: string
      }
    }
  }
  unsupported: string[]        // Commands that can't be translated
  warnings: string[]           // Platform-specific warnings
}
```

### Value to Core Tasks
- **Task Generation**: N/A
- **Scaffold Generation**: Enables true cross-platform script generation

## 🎯 Service Integration Flow

### Task Generation Flow
1. **File Analysis** → Reads all text files, extracts content
2. **Framework Detection** → Identifies project type
3. **Task Generation** → Creates markdown with custom instructions
4. **Export Service** → Outputs .md files

### Scaffold Generation Flow
1. **Example Management** → Loads selected example from local folder
2. **Framework Detection** → Identifies target framework
3. **Scaffold Generation** → Applies example with variables
4. **Command Translation** → Converts to all platform formats
5. **Export Service** → Outputs 12+ script files

### Cross-Service Dependencies
- **File Analysis** ← **Framework Detection** (needs file content analysis)
- **Task Generation** ← **File Analysis** + **Framework Detection** (needs both)
- **Scaffold Generation** ← **Example Management** + **Framework Detection**
- **Command Translation** ← **Scaffold Generation** (converts generated commands)
- **Export Service** ← **All Services** (final output stage)

## 📊 Success Metrics

### Functionality Complete When:
- [ ] Any text-based file can be analyzed and content extracted
- [ ] Framework detection works for 10+ major frameworks
- [ ] Task files generated in exact format of examples
- [ ] All 12+ script types generated simultaneously with proper syntax
- [ ] Examples can be accessed from local file system and used for generation
- [ ] Cross-platform command conversion works for basic operations
- [ ] Export service outputs properly formatted files with correct encoding

### Performance Targets:
- **File Analysis**: <500ms for 100 files
- **Framework Detection**: <200ms per project
- **Task Generation**: <2s for 50 files
- **Scaffold Generation**: <1s for all 12+ formats
- **Example Management**: <100ms for example operations
- **Export Service**: <500ms for file generation

Each service directly contributes to delivering the two core tasks that define Task Writer's value proposition.