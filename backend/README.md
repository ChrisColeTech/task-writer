# Task Writer Backend

**Status: 🚧 Work In Progress (5% Complete - JavaScript-Only Partial Implementation)**

A Node.js/Express backend service for the Task Writer application that provides the core functionality for generating AI-ready task files and cross-platform scaffold scripts from any directory structure.

## 🎯 Core Functionality

The backend provides **two essential services**:

### 1. 📄 **AI-Ready Task File Generation**
- **Input**: Any directory containing text-based files + user's custom instructions
- **Process**: Analyze all files, extract contents, organize logically
- **Output**: Structured markdown files with complete source code inclusion
- **Value**: Perfect input format for AI assistants (ChatGPT, Claude, etc.)

### 2. 🔧 **Cross-Platform Scaffold Script Generation**  
- **Input**: Directory structure + template selection
- **Process**: Analyze patterns, apply templates, convert commands
- **Output**: 12+ script formats that recreate the project structure
- **Value**: Instant project setup on any platform/language

## ⚠️ **CRITICAL: JavaScript-Only Implementation**

**The current implementation is severely limited and only supports JavaScript/Node.js projects.** This contradicts the stated goal of being a universal, multi-language development tool.

## ✅ Current Implementation Status

### ✅ **Actually Completed (5%)**
- **Database Service** - SQLite-based storage for settings, templates, and recent projects
- **Basic File System Service** - Directory scanning and file tree generation  
- **API Route Structure** - Express router setup with CORS and JSON middleware
- **Test Framework** - Jest setup with passing tests (67/67 passing)
- **JavaScript Framework Detection** - React, Vue, Angular, Express, NestJS (package.json only)
- **JavaScript File Analysis** - Basic analysis for .js/.ts files
- **JavaScript Task Generation** - Partial implementation for Node.js projects only

### 🚧 **Partially Implemented (JavaScript-Only)**
- **Framework Detection Service** - Only works for projects with package.json
- **File Analysis Service** - Can analyze files but lacks multi-language framework integration  
- **Task Generation Service** - Has templates but only for JavaScript ecosystem
- **Scaffold Generation Service** - Has templates for Python/Docker but can't detect when to use them

### ❌ **Critical Missing: Multi-Language Support (95%)**

**The system fails to support the majority of development ecosystems:**

#### **Python Projects (0% Complete)**
- ❌ No detection of requirements.txt, pyproject.toml, setup.py
- ❌ No framework detection for Django, Flask, FastAPI
- ❌ No Python-specific task templates
- ❌ Cannot analyze Python project structures

#### **Rust Projects (0% Complete)**  
- ❌ No detection of Cargo.toml
- ❌ No framework detection for Actix, Rocket, Axum
- ❌ No Rust-specific task templates
- ❌ Cannot analyze Rust project structures

#### **.NET Projects (0% Complete)**
- ❌ No detection of .csproj, .sln files
- ❌ No framework detection for ASP.NET Core, Blazor
- ❌ No .NET-specific task templates
- ❌ Cannot analyze C# project structures

#### **Go Projects (0% Complete)**
- ❌ No detection of go.mod files
- ❌ No framework detection for Gin, Echo, Fiber
- ❌ No Go-specific task templates
- ❌ Cannot analyze Go project structures

#### **Java Projects (0% Complete)**
- ❌ No detection of pom.xml, build.gradle
- ❌ No framework detection for Spring Boot, Quarkus
- ❌ No Java-specific task templates
- ❌ Cannot analyze Java project structures

#### **Additional Missing Languages**
- ❌ PHP (Laravel, Symfony)
- ❌ Ruby (Rails, Sinatra)
- ❌ Swift (iOS/macOS development)
- ❌ Kotlin (Android, Spring)
- ❌ Dart (Flutter)
- ❌ C/C++ (CMake, Make)

## 🏗️ Required Services Architecture (Needs Complete Rewrite)

### **File Analysis Service** ⭐⭐⭐ **CRITICAL**
**Purpose**: Read and parse any text-based file to extract content and metadata

**Why Essential**: 
- Task generation requires complete file contents to be included in markdown
- Must identify file types, sizes, modification dates for proper organization
- Needs to handle encoding detection and binary file filtering

**Capabilities Needed**:
- Read any text-based file (programming languages, configs, docs, scripts)
- Extract file metadata (size, modification date, type)
- Handle encoding detection (UTF-8, ASCII, etc.)
- Filter out binary files automatically
- Support file size limits and validation

**Value to Core Tasks**:
- **Task Generation**: Provides the actual file contents that go into markdown
- **Scaffold Generation**: Understands existing file structures for template matching

### **Framework Detection Service** ❌ **BROKEN - JavaScript-Only**
**Current Status**: Only detects JavaScript/Node.js frameworks via package.json

**Critical Missing Capabilities**:
- **Python**: requirements.txt, pyproject.toml, setup.py detection
- **Rust**: Cargo.toml analysis and Rust framework detection
- **.NET**: .csproj, .sln file parsing and ASP.NET detection
- **Go**: go.mod analysis and Go framework detection
- **Java**: Maven/Gradle file parsing and Spring detection
- **PHP**: composer.json analysis and Laravel/Symfony detection
- **Multi-language**: Cross-ecosystem project detection

**What Works (JavaScript Only)**:
- ✅ package.json dependency analysis
- ✅ React, Vue, Angular, Express, NestJS detection
- ✅ Basic build tool detection (Vite, Webpack)

**What's Broken**:
- ❌ 90% of development ecosystems not supported
- ❌ Cannot detect non-JavaScript projects
- ❌ Template selection fails for non-JS projects

### **Task Generation Service** ❌ **BROKEN - No Multi-Language Templates**
**Current Status**: Only has one generic "initialization" template

**Critical Missing Capabilities**:
- **Language-Specific Templates**: No Python, Rust, .NET, Go, Java templates
- **Framework-Specific Tasks**: No Django, Spring Boot, ASP.NET Core templates
- **Project Type Templates**: No microservice, library, CLI tool templates
- **Template Variety**: Only 1 template vs. hundreds needed

**What Works (Minimal)**:
- ✅ Basic template loading from JSON
- ✅ Variable substitution in templates
- ✅ Markdown generation structure

**What's Broken**:
- ❌ 99% of project types have no templates
- ❌ Cannot generate appropriate tasks for most languages
- ❌ No framework-specific task guidance

### **Scaffold Generation Service** ❌ **BROKEN - Detection Mismatch**
**Current Status**: Has templates but cannot detect when to use them

**Critical Missing Capabilities**:
- **Python Framework Commands**: No Django, Flask, FastAPI project creation
- **Rust Framework Commands**: No Cargo workspace, Actix, Rocket setup
- **.NET Framework Commands**: No dotnet new integration beyond basic template
- **Go Framework Commands**: No Go module, Gin, Echo project setup
- **Java Framework Commands**: No Maven, Gradle, Spring Boot integration

**What Works (Partial)**:
- ✅ Template system with multiple script formats
- ✅ Cross-platform script generation (Windows, Linux, macOS)
- ✅ Basic command translation between platforms
- ✅ Has Python, Docker, Makefile templates

**What's Broken**:
- ❌ Cannot detect which templates to use (detection service broken)
- ❌ Framework commands only exist for JavaScript + basic .NET
- ❌ No integration with language-specific package managers
- ❌ Cannot generate appropriate scaffolds for 90% of project types

### **Template Management Service** ⭐⭐⭐ **CRITICAL**
**Purpose**: Store, manage, and apply templates for scaffold generation

**Why Essential**:
- Users need built-in templates for common project types
- GitHub integration allows downloading community templates
- Local storage enables offline template usage

**Capabilities Needed**:
- Store templates in SQLite database with versioning
- Download templates from GitHub repositories
- Variable substitution (project name, paths, dependencies)
- Template inheritance and customization
- Template validation and error handling

**Value to Core Tasks**:
- **Task Generation**: Templates can provide task structure patterns
- **Scaffold Generation**: Templates ARE the scaffold content

### **Multi-Format Export Service** ⭐⭐⭐ **CRITICAL**
**Purpose**: Generate output files in all required formats

**Why Essential**: This provides the actual deliverables - without export, there's no output

**Capabilities Needed**:
- Export task files as markdown (.md) with proper formatting
- Generate 12+ script types simultaneously:
  - Shell: .sh, .bash, .zsh, .fish
  - Windows: .ps1, .psm1, .bat, .cmd  
  - Languages: .py, .js, .ts, .rb, .pl
  - Text: .txt (treated as shell)
- Handle cross-platform command conversion
- Proper file encoding and permissions (chmod +x for Unix)

**Value to Core Tasks**:
- **Task Generation**: Outputs the actual .md files
- **Scaffold Generation**: Outputs the actual script files

### **Command Translation Service** ⭐⭐ **IMPORTANT**
**Purpose**: Convert commands between different platform syntaxes

**Why Essential**: Cross-platform support requires different command formats

**Capabilities Needed**:
- Convert basic commands: mkdir, touch, cd, copy, move
- Handle path separators: / vs \
- Convert variables: $var vs %var% vs $env:var
- Platform-specific package managers and tools
- Error handling for unsupported conversions

**Value to Core Tasks**:
- **Task Generation**: N/A
- **Scaffold Generation**: Enables true cross-platform scripts

## 📜 Supported Output Formats

### **Task Files**
- `.md` - Markdown format with embedded source code

### **Scaffold Scripts** (All formats from scaffold-scripts)
- **Shell**: `.sh` `.bash` `.zsh` `.fish`
- **Windows**: `.ps1` `.psm1` `.bat` `.cmd`
- **Languages**: `.py` `.py3` `.js` `.mjs` `.ts` `.rb` `.pl`
- **Text**: `.txt` `.text` (no extension)

## 🔄 Example Workflows

### Workflow 1: Generate AI-Ready Tasks
1. **User selects directory**: `/src/components`
2. **User adds custom instructions**: "Focus on React component patterns"
3. **File Analysis Service**: Scans all .tsx files, reads contents
4. **Framework Detection**: Identifies React + TypeScript project
5. **Task Generation Service**: Creates markdown with custom instructions + file contents
6. **Export Service**: Outputs `task_01.0.md` with complete source code

### Workflow 2: Generate Scaffold Scripts
1. **User selects template**: "React TypeScript Starter" 
2. **Template Management**: Loads template from database
3. **Scaffold Generation**: Applies template with user's project name
4. **Command Translation**: Converts to all platform formats
5. **Export Service**: Outputs 12+ script files that create the project

### Workflow 3: Analyze Unknown Project
1. **User selects directory**: `/unknown-project`
2. **File Analysis**: Reads all text files, extracts contents
3. **Framework Detection**: Identifies technologies used
4. **Task Generation**: Creates comprehensive documentation
5. **Export**: Markdown files perfect for AI analysis

## 🚀 API Endpoints

### **File System Routes** (`/api/filesystem`) ✅ **Basic Implementation**
- `POST /scan` - Scan directory structure and return file tree
- `POST /validate` - Validate file/directory paths
- `POST /file-content` - Read individual file contents

### **Task Generator Routes** (`/api/task-generator`) ❌ **Needs Implementation**
- `POST /analyze` - Analyze directory for task generation
- `POST /generate` - Generate AI-ready task files
- `POST /export` - Export tasks in markdown format
- `GET /templates` - Get available task templates

### **Scaffold Generator Routes** (`/api/scaffold-generator`) ❌ **Needs Implementation**
- `POST /analyze` - Analyze project for scaffold patterns
- `POST /generate` - Generate cross-platform scripts
- `POST /preview` - Preview scaffold generation
- `POST /export` - Export scaffolds in all formats
- `GET /templates` - Get available scaffold templates

### **Template Management Routes** (`/api/templates`) ❌ **Needs Implementation**
- `GET /list` - List all available templates
- `POST /download` - Download template from GitHub
- `GET /:id` - Get specific template
- `POST /create` - Create custom template
- `PUT /:id` - Update template
- `DELETE /:id` - Delete template

### **Database Routes** (`/api/database`) ✅ **Complete**
- Settings management (get, set, update, delete)
- Recent folders tracking with favorites
- Recent projects tracking
- Database statistics and utilities

## 🎯 Value Proposition

### **For Developers**
- **AI Integration**: Generated task files work perfectly with ChatGPT, Claude, etc.
- **Time Saving**: Automate project documentation and setup
- **Cross-Platform**: Same project works on Windows, macOS, Linux
- **Any File Type**: Works with any text-based file or project structure

### **For Teams**
- **Standardization**: Consistent project structures across team
- **Knowledge Sharing**: Easy documentation and onboarding
- **Template Library**: Centralized template management with GitHub integration
- **Platform Agnostic**: Each team member gets scripts for their preferred OS

### **For Project Analysis**
- **Complete Context**: AI gets full file contents, not just names
- **Organized Output**: Logical grouping of files and functionality
- **Custom Instructions**: Project-specific context for better AI responses
- **Comprehensive Documentation**: Perfect for code reviews and planning

## 📊 Supported File Types

The backend can analyze **any text-based file**:

### Programming Languages
**Frontend**: `.js` `.jsx` `.ts` `.tsx` `.vue` `.svelte` `.html` `.css` `.scss` `.sass` `.less`  
**Backend**: `.py` `.rb` `.php` `.java` `.kt` `.swift` `.go` `.rs` `.cpp` `.c` `.cs` `.vb` `.fs`  
**Mobile**: `.dart` `.kotlin` `.swift` `.m` `.mm`  
**Functional**: `.clj` `.scala` `.hs` `.elm` `.ml`

### Configuration & Data
**Config**: `.json` `.yaml` `.yml` `.toml` `.ini` `.env` `.config`  
**Build**: `package.json` `Cargo.toml` `pom.xml` `build.gradle` `CMakeLists.txt`  
**Database**: `.sql` `.graphql` `.gql` `.prisma`

### Documentation & Scripts
**Docs**: `.md` `.txt` `.rst` `.adoc` `README` `CHANGELOG` `LICENSE`  
**Scripts**: `.sh` `.bash` `.zsh` `.fish` `.ps1` `.bat` `.cmd`

## 💻 Generated Output Examples

### Task File Output
```markdown
# Custom Instructions

This is a React TypeScript project. Focus on component patterns and type safety.

---

# Task: Component Analysis

## Overview
This task covers the analysis of UI components.
Includes 3 file(s) for review and implementation.

## Files in This Task

### src/components/Button.tsx
**Type:** React TypeScript Component
**Size:** 2.1 KB
**Last Modified:** 2024-01-15T10:30:00.000Z

**Content:**
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick
}) => {
  return (
    <button
      className={cn('btn', `btn-${variant}`)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```
```

### PowerShell Script Output
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

# Create Button component
@'
import React from 'react';

export const Button = ({ children }) => (
  <button>{children}</button>
);
'@ | Out-File -FilePath "src/components/ui/Button.tsx" -Encoding UTF8

npm install
Write-Host "✅ Setup completed!" -ForegroundColor Green
```

### Bash Script Output
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

export const Button = ({ children }) => (
  <button>{children}</button>
);
EOF

npm install
echo "✅ Setup completed!"
```

## 🏗️ Current Architecture

```
backend/
├── src/
│   ├── services/                   # Core business logic
│   │   ├── DatabaseService.ts      ✅ Complete - SQLite operations
│   │   ├── FileSystemService.ts    ✅ Basic - Directory scanning  
│   │   ├── FileAnalysisService.ts  ❌ Missing - File content analysis
│   │   ├── FrameworkDetectionService.ts ❌ Missing - Technology detection
│   │   ├── TaskGenerationService.ts ❌ Missing - Task file creation
│   │   ├── ScaffoldGenerationService.ts ❌ Missing - Script generation
│   │   ├── TemplateManagementService.ts ❌ Missing - Template storage
│   │   ├── CommandTranslationService.ts ❌ Missing - Cross-platform conversion
│   │   └── ExportService.ts        ❌ Missing - Multi-format output
│   ├── routes/                     # API endpoints
│   │   ├── database.ts             ✅ Complete - Database operations
│   │   ├── fileSystem.ts           ✅ Basic - File system operations  
│   │   ├── taskGenerator.ts        ❌ Stub - Task generation API
│   │   ├── scaffoldGenerator.ts    ❌ Stub - Scaffold generation API
│   │   └── templates.ts            ❌ Missing - Template management API
│   ├── types/                      # TypeScript definitions
│   │   ├── api.ts                  ✅ Complete - API response types
│   │   ├── fileAnalysis.ts         ❌ Missing - File analysis types
│   │   ├── framework.ts            ❌ Missing - Framework detection types
│   │   ├── task.ts                 ❌ Missing - Task generation types
│   │   ├── scaffold.ts             ❌ Missing - Scaffold generation types
│   │   └── template.ts             ❌ Missing - Template system types
│   └── utils/                      # Utility functions
│       ├── commandTranslation.ts   ❌ Missing - Platform command conversion
│       ├── templateEngine.ts       ❌ Missing - Template processing
│       └── fileValidation.ts       ❌ Missing - File type validation
```

## 🎯 Implementation Priority

### **Phase 1: Core Analysis (Week 1)**
1. **File Analysis Service** - Read any text file, extract metadata
2. **Framework Detection Service** - Identify project types and technologies
3. **Basic Export Service** - Output markdown and simple scripts

### **Phase 2: Generation Services (Week 2)**  
4. **Task Generation Service** - Create AI-ready markdown files
5. **Scaffold Generation Service** - Generate basic cross-platform scripts
6. **Template Management Service** - Store and apply templates

### **Phase 3: Cross-Platform & Polish (Week 3)**
7. **Command Translation Service** - Full cross-platform support
8. **Multi-Format Export** - All 12+ script types
9. **GitHub Integration** - Download templates from repositories

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd backend
npm install
```

### Development
```bash
npm run dev        # Start development server with hot reload
npm run build      # Build TypeScript to JavaScript
npm run start      # Start production server
npm run test       # Run test suite (currently targeting unimplemented features)
npm run test:coverage # Run tests with coverage report
npm run lint       # Run ESLint
```

### Environment Variables
```bash
# Optional - defaults to ./data/database.db
DATABASE_PATH=/path/to/database.db

# Optional - defaults to 3001
PORT=3001

# Optional - defaults to development
NODE_ENV=production
```

## 🗃️ Database Schema

### Templates Table
```sql
CREATE TABLE templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'task' | 'scaffold'
    framework TEXT,     -- 'react' | 'vue' | 'express' | etc.
    content TEXT NOT NULL, -- Template content with variables
    variables TEXT,     -- JSON array of variable definitions
    source TEXT,        -- 'built-in' | 'github' | 'custom'
    source_url TEXT,    -- GitHub URL if applicable
    version TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Recent Folders & Projects (Already Implemented)
- Track recently used directories
- Store project generation history  
- Favorite folder management

## 🧪 Testing

The backend includes comprehensive test framework:
- **Unit Tests**: Individual service testing
- **Integration Tests**: Full API workflow testing  
- **Route Tests**: HTTP endpoint testing with supertest
- **Performance Tests**: Large project handling

**Current Status**: Tests exist but target unimplemented features

## 🚨 Known Issues & Limitations

1. **80% Not Implemented**: Most core services are missing
2. **Test Failures**: Tests written for unimplemented features
3. **Stub Routes**: API endpoints return mock data
4. **No File Analysis**: Can't read file contents yet
5. **No Multi-Format Export**: Can't generate script files
6. **No Template System**: No template storage or GitHub integration

## 📋 Success Metrics

### Implementation Complete When:
- [ ] All text files can be read and analyzed
- [ ] Framework detection works for major technologies
- [ ] Task files generated in exact format of examples
- [ ] All 12+ script types generated simultaneously
- [ ] Templates can be downloaded from GitHub and stored locally
- [ ] Cross-platform command conversion works properly
- [ ] 80%+ test coverage with passing tests

### Performance Targets:
- **File Analysis**: <500ms for 100 files
- **Task Generation**: <2s for comprehensive project  
- **Script Generation**: <1s for all 12+ formats
- **Memory Usage**: <200MB for large projects

## 📝 Contributing

### Current Priority: Core Implementation
1. **File Analysis Service** - Enable reading any text file
2. **Framework Detection** - Identify project technologies
3. **Task Generation** - Create AI-ready markdown files
4. **Scaffold Generation** - Generate cross-platform scripts
5. **Template Management** - Store templates and GitHub integration

### Development Guidelines
- TypeScript strict mode with full type coverage
- Comprehensive error handling with user-friendly messages
- 80%+ test coverage for all new code
- Performance optimization for large projects
- Cross-platform compatibility

## 📄 License

MIT License - see LICENSE file for details