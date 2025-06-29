# Backend Features Specification

## Overview

This document outlines all required features for the Task Writer backend, providing detailed specifications for each service that enables the application's **two core tasks**: generating AI-ready task files and creating cross-platform scaffold scripts.

## 🎯 Core Task Alignment

Every backend feature directly supports one or both core tasks:

1. **📄 Generate AI-Ready Task Files** - Markdown files with complete source code inclusion
2. **🔧 Generate Cross-Platform Scaffold Scripts** - 12+ script formats that recreate project structures

## 1. File Analysis Service ⭐⭐⭐ **CRITICAL**

### Purpose
Read and parse any text-based file to extract complete content and metadata for inclusion in task files.

### Why Essential for Core Tasks
- **Task Generation**: Provides the actual file contents that get embedded in markdown files
- **Scaffold Generation**: Understands existing file structures for accurate template application

### Features

#### Text File Reading
- **Universal File Support**: Read any text-based file regardless of extension
- **Encoding Detection**: Automatically detect UTF-8, ASCII, ISO-8859-1, etc.
- **Binary File Filtering**: Detect and skip binary files automatically
- **Size Limits**: Configurable maximum file size (default 10MB)
- **Error Handling**: Graceful handling of permission errors and corrupted files

#### Metadata Extraction
- **File Information**: Size, modification date, creation date, permissions
- **File Type Detection**: Programming language, configuration, documentation, script
- **Content Analysis**: Line count, character count, estimated complexity
- **Path Analysis**: Relative path, directory depth, file naming patterns

#### Content Processing
- **Syntax Detection**: Identify programming language for proper syntax highlighting
- **Structure Analysis**: Extract imports, exports, function definitions, classes
- **Comment Extraction**: Parse TODO/FIXME comments and documentation blocks
- **Dependency Tracking**: Track file relationships and imports

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

## 2. Framework Detection Service ⭐⭐⭐ **CRITICAL**

### Purpose
Automatically identify project types, frameworks, and technologies to enable framework-specific task generation and template selection.

### Why Essential for Core Tasks
- **Task Generation**: Creates framework-appropriate analysis ("React component patterns" vs "Vue composition API")
- **Scaffold Generation**: Selects correct templates and generates appropriate project structures

### Features

#### Package.json Analysis
- **Dependency Detection**: Parse dependencies and devDependencies for frameworks
- **Framework Identification**: React, Vue, Angular, Express, Next.js, Nuxt, etc.
- **Tool Detection**: Webpack, Vite, TypeScript, Babel, ESLint, Prettier
- **Version Analysis**: Framework versions for compatibility checks

#### Configuration File Detection
- **Build Tools**: webpack.config.js, vite.config.js, rollup.config.js
- **TypeScript**: tsconfig.json, jsconfig.json
- **Framework Configs**: next.config.js, nuxt.config.js, angular.json, vue.config.js
- **Testing**: jest.config.js, vitest.config.js, cypress.config.js
- **Linting**: .eslintrc, .prettierrc, lint-staged.config.js

#### File Pattern Recognition
- **React**: .jsx, .tsx files, component naming patterns
- **Vue**: .vue files, composition API patterns
- **Angular**: .component.ts, .module.ts, .service.ts patterns
- **Node.js**: server.js, app.js, API route patterns
- **Mobile**: React Native, Flutter, Expo patterns

#### Project Architecture Detection
- **Frontend Only**: React SPA, Vue app, static site
- **Backend Only**: Express API, FastAPI, Django
- **Full-Stack**: Next.js, Nuxt, MEAN/MERN stack
- **Mobile**: React Native, Flutter, Expo
- **Desktop**: Electron, Tauri

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

## 3. Task Generation Service ⭐⭐⭐ **CORE FEATURE**

### Purpose
Generate structured markdown task files with embedded source code in the exact format shown in examples.

### Why Essential
This IS the first core task - the entire purpose of "Generate AI-Ready Task Files"

### Features

#### Task File Structure
- **Custom Instructions Section**: User's custom context at the top of every file
- **Task Header**: Task number, title, and overview
- **File Listing**: Complete directory structure visualization
- **File Content**: Full source code with metadata for each file
- **Syntax Highlighting**: Language-appropriate code blocks

#### Content Organization
- **Logical Grouping**: Group files by directory, functionality, or custom rules
- **File Ordering**: Smart ordering based on dependencies and importance
- **Size Management**: Split large projects into multiple task files
- **Filtering**: Exclude binary files, node_modules, build artifacts

#### Markdown Generation
- **Example Format Compliance**: Match exact format from backend/examples/tasks/
- **Metadata Inclusion**: File size, modification date, file type
- **Code Block Formatting**: Proper syntax highlighting with language tags
- **Navigation Structure**: Clear headers and section organization

#### Custom Instructions Integration
- **Text Area Input**: Accept custom instructions from frontend
- **Template Variables**: Support dynamic content (project name, framework, etc.)
- **Context Awareness**: Combine custom instructions with detected framework info

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

## 4. Scaffold Generation Service ⭐⭐⭐ **CORE FEATURE**

### Purpose
Generate executable scripts in 12+ formats that recreate project structures, supporting both template-based creation and structure replication.

### Why Essential
This IS the second core task - the entire purpose of "Generate Cross-Platform Scaffold Scripts"

### Features

#### Multi-Platform Script Generation
- **Shell Scripts**: .sh (bash), .bash, .zsh, .fish
- **Windows Scripts**: .ps1 (PowerShell), .psm1, .bat, .cmd
- **Language Scripts**: .py, .js, .ts, .rb, .pl
- **Text Scripts**: .txt, no extension (treated as shell)

#### Template Application
- **Built-in Templates**: React, Vue, Angular, Express, etc.
- **Custom Templates**: User-created or GitHub-downloaded templates
- **Variable Substitution**: Project name, paths, dependencies
- **Conditional Logic**: Include/exclude sections based on framework

#### Script Content Options
- **Empty Files**: Create directory structure with empty files
- **Original Content**: Include actual file contents from source
- **Template Content**: Use template-provided content
- **Hybrid Mode**: Mix of empty files and template content

#### Command Generation
- **Directory Creation**: mkdir, New-Item, os.makedirs
- **File Creation**: touch, New-Item, open().write()
- **Content Writing**: cat, Out-File, file.write()
- **Package Installation**: npm install, pip install, etc.
- **Build Commands**: npm run build, make, etc.

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
    template: string       // Template used
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

## 5. Template Management Service ⭐⭐⭐ **CRITICAL**

### Purpose
Store, manage, and apply templates for both task generation patterns and scaffold creation.

### Why Essential
- **Task Generation**: Provides consistent task file structures and patterns
- **Scaffold Generation**: Templates ARE the scaffold content - defines what gets created

### Features

#### Template Storage
- **SQLite Database**: Local storage for templates with versioning
- **Template Types**: Task templates, scaffold templates, hybrid templates
- **Metadata Management**: Name, description, framework, author, version
- **Content Storage**: Template content with variable placeholders

#### GitHub Integration
- **Repository Browsing**: List available templates from GitHub repos
- **Download Management**: Download and store templates locally
- **Version Control**: Track template versions and updates
- **Authentication**: Handle GitHub API authentication if needed

#### Template Engine
- **Variable Substitution**: Replace {{projectName}}, {{framework}}, etc.
- **Conditional Logic**: Include/exclude sections based on framework
- **Template Inheritance**: Base templates with framework-specific overrides
- **Validation**: Ensure template syntax is correct

#### Built-in Templates
- **React Templates**: Component, hook, page, context templates
- **Vue Templates**: Component, composable, page, store templates
- **Angular Templates**: Component, service, module templates
- **Node.js Templates**: Express API, middleware, model templates
- **Full-Stack Templates**: Complete project setups

### API Response Format
```typescript
interface Template {
  id: string
  name: string
  description: string
  type: 'task' | 'scaffold' | 'hybrid'
  framework: string[]           // ['react', 'typescript']
  category: string              // 'component', 'api', 'fullstack'
  content: string               // Template content with variables
  variables: Array<{
    name: string                // 'projectName'
    type: 'string' | 'boolean' | 'select'
    required: boolean
    default?: any
    options?: string[]          // For select type
    description: string
  }>
  files: Array<{
    path: string                // Output path with variables
    content: string             // File content with variables
    condition?: string          // When to include this file
  }>
  metadata: {
    author: string
    version: string
    source: 'built-in' | 'github' | 'custom'
    sourceUrl?: string          // GitHub URL
    created: Date
    updated: Date
  }
}
```

### Value to Core Tasks
- **Task Generation**: Provides consistent task file structures
- **Scaffold Generation**: Templates define the entire scaffold content

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
1. **Template Management** → Loads selected template
2. **Framework Detection** → Identifies target framework
3. **Scaffold Generation** → Applies template with variables
4. **Command Translation** → Converts to all platform formats
5. **Export Service** → Outputs 12+ script files

### Cross-Service Dependencies
- **File Analysis** ← **Framework Detection** (needs file content analysis)
- **Task Generation** ← **File Analysis** + **Framework Detection** (needs both)
- **Scaffold Generation** ← **Template Management** + **Framework Detection**
- **Command Translation** ← **Scaffold Generation** (converts generated commands)
- **Export Service** ← **All Services** (final output stage)

## 📊 Success Metrics

### Functionality Complete When:
- [ ] Any text-based file can be analyzed and content extracted
- [ ] Framework detection works for 10+ major frameworks
- [ ] Task files generated in exact format of examples
- [ ] All 12+ script types generated simultaneously with proper syntax
- [ ] Templates can be downloaded from GitHub and stored locally
- [ ] Cross-platform command conversion works for basic operations
- [ ] Export service outputs properly formatted files with correct encoding

### Performance Targets:
- **File Analysis**: <500ms for 100 files
- **Framework Detection**: <200ms per project
- **Task Generation**: <2s for 50 files
- **Scaffold Generation**: <1s for all 12+ formats
- **Template Management**: <100ms for template operations
- **Export Service**: <500ms for file generation

Each service directly contributes to delivering the two core tasks that define Task Writer's value proposition.