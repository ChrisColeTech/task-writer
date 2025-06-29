# Task Writer Backend

**Status: 🔧 Framework Detection Complete, Core Services In Progress (25% Complete)**

A Node.js/Express backend service for the Task Writer application that provides the core functionality for generating AI-ready task files and cross-platform scaffold scripts from any directory structure. Framework detection supports 115 frameworks across 6 programming languages.

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

## ✅ **COMPLETE: Multi-Language Framework Detection**

**The system supports comprehensive multi-language development with 115 framework detection rules across 6 major programming languages.**

## 🔧 Current Implementation Status

### ✅ **Fully Implemented Services (25%)**
- **Database Service** - SQLite-based storage for settings, templates, and recent projects ✅
- **Framework Detection Service** - 115 frameworks across Python, Rust, .NET, Go, Java, JavaScript ✅
- **File Analysis Service** - Text file reading, metadata extraction, and content analysis ✅
- **Export Service Foundation** - Multi-format export structure with template system ✅

### 🔧 **Partially Implemented Services (50%)**
- **Task Generation Service** - Architecture exists, core logic needs completion 🔧  
- **Scaffold Generation Service** - Interface defined, route handlers incomplete 🔧
- **API Routes** - Basic endpoints exist, many return stubs/404s 🔧

### ❌ **Not Yet Implemented (25%)**
- **Template Management System** - GitHub integration and local storage ❌
- **Command Translation Service** - Cross-platform command conversion ❌
- **Complete API Integration** - Many endpoints need real service implementations ❌
- **Comprehensive Testing** - Currently 30% test pass rate (265/376 tests passing) ❌

### ✅ **Multi-Language Framework Detection (Fully Implemented)**
The framework detection system now comprehensively supports:

#### **Python Projects (100% Complete)** ✅
- ✅ **Requirements Detection**: requirements.txt, pyproject.toml, setup.py, setup.cfg, Pipfile
- ✅ **Framework Detection**: Django, Flask, FastAPI, Pyramid, Tornado, Bottle, CherryPy, Quart, Sanic, Starlette
- ✅ **Data Science**: Jupyter, Streamlit, Dash, Gradio frameworks
- ✅ **Testing**: pytest, unittest, nose2 framework detection
- ✅ **Build Systems**: Poetry, setuptools, flit, hatch, PDM detection

#### **Rust Projects (100% Complete)** ✅
- ✅ **Cargo Detection**: Cargo.toml, Cargo.lock analysis
- ✅ **Web Frameworks**: Actix-web, Rocket, Axum, Warp, Tide, Poem detection
- ✅ **Application Types**: Tauri (desktop), Yew (WebAssembly), Bevy (game engine)
- ✅ **CLI Tools**: Clap, structopt framework detection
- ✅ **Async Runtime**: Tokio, async-std detection

#### **.NET Projects (100% Complete)** ✅
- ✅ **Project Detection**: .csproj, .sln, .fsproj, .vbproj files
- ✅ **Web Frameworks**: ASP.NET Core, Blazor Server, Blazor WebAssembly
- ✅ **Desktop**: WPF, WinForms, MAUI framework detection
- ✅ **Testing**: xUnit, NUnit, MSTest framework detection
- ✅ **Package Management**: PackageReference, packages.config detection

#### **Go Projects (100% Complete)** ✅
- ✅ **Module Detection**: go.mod, go.sum analysis
- ✅ **Web Frameworks**: Gin, Echo, Fiber, Chi, Gorilla Mux, Beego
- ✅ **CLI Tools**: Cobra, urfave/cli framework detection
- ✅ **gRPC & APIs**: gRPC-Go, go-kit, go-micro detection
- ✅ **Testing**: Testify, Ginkgo framework detection

#### **Java Projects (100% Complete)** ✅
- ✅ **Build Systems**: Maven (pom.xml), Gradle (build.gradle), SBT (build.sbt)
- ✅ **Spring Ecosystem**: Spring Boot, Spring MVC, Spring WebFlux, Spring Security
- ✅ **Enterprise**: Jakarta EE, Hibernate, Apache Camel detection
- ✅ **Android**: Android Gradle Plugin, Android SDK detection
- ✅ **Testing**: JUnit, TestNG, Mockito framework detection

#### **JavaScript/Node.js Projects (Enhanced)** ✅
- ✅ **Frontend**: React, Vue, Angular, Svelte, Next.js, Nuxt.js, Gatsby
- ✅ **Backend**: Express, NestJS, Fastify, Koa, Hapi detection
- ✅ **Build Tools**: Vite, Webpack, Rollup, Parcel, esbuild
- ✅ **Testing**: Jest, Vitest, Cypress, Playwright, Mocha detection

## 🏗️ Implemented Services Architecture

### **File Analysis Service** ✅ **IMPLEMENTED**
**Status**: Complete implementation with comprehensive file analysis capabilities

**Implemented Capabilities**:
- ✅ Read any text-based file (programming languages, configs, docs, scripts)
- ✅ Extract file metadata (size, modification date, type, encoding)
- ✅ Handle encoding detection (UTF-8, ASCII, etc.)
- ✅ Filter out binary files automatically
- ✅ Support file size limits and validation (configurable)
- ✅ Cross-platform path handling and permissions
- ✅ Error handling for locked/inaccessible files

**Value Delivered**:
- **Task Generation**: Provides complete file contents for markdown inclusion
- **Scaffold Generation**: Analyzes existing file structures for template matching

### **Framework Detection Service** ✅ **IMPLEMENTED - Multi-Language Support**
**Current Status**: Comprehensive detection across 6 programming languages with 115 frameworks

**Implemented Capabilities**:
- **Python**: requirements.txt, pyproject.toml, setup.py detection ✅
- **Rust**: Cargo.toml analysis and Rust framework detection ✅
- **.NET**: .csproj, .sln file parsing and ASP.NET detection ✅
- **Go**: go.mod analysis and Go framework detection ✅
- **Java**: Maven/Gradle file parsing and Spring detection ✅
- **JavaScript**: Enhanced package.json analysis with build tools ✅
- **Multi-language**: Cross-ecosystem project detection ✅

**What Works**:
- ✅ 115 frameworks across 6 languages with confidence scoring
- ✅ Strategy pattern for extensible detection methods
- ✅ Package manager and dependency analysis
- ✅ Framework-specific file pattern recognition

**Current Issues**:
- 🔧 Confidence score calculations need refinement
- 🔧 Some test failures in framework priority logic

### **Task Generation Service** 🔧 **ARCHITECTURE COMPLETE - LOGIC IN PROGRESS**
**Current Status**: Service architecture and interfaces implemented, core generation logic needs completion

**Implemented Foundation**:
- ✅ Service class structure with proper TypeScript interfaces
- ✅ Template loading and management system
- ✅ Integration with Framework Detection Service
- ✅ Basic markdown generation structure

**Missing Implementation**:
- 🔧 Language-specific task templates (currently has 1 generic template)
- 🔧 Framework-specific task generation logic
- 🔧 Complete variable substitution and content generation
- 🔧 File content inclusion and organization

### **Scaffold Generation Service** 🔧 **INTERFACE DEFINED - HANDLERS INCOMPLETE**
**Current Status**: Service interfaces exist but route handlers and core logic incomplete

**Implemented Foundation**:
- ✅ Service class structure and TypeScript definitions
- ✅ Basic template system architecture
- ✅ Integration points with framework detection

**Missing Implementation**:
- 🔧 API route handlers (/analyze, /preview, /templates, /validate endpoints return 404)
- 🔧 Template selection logic based on detected frameworks
- 🔧 Cross-platform script generation implementation
- 🔧 Integration with language-specific package managers

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

### **Task Generator Routes** (`/api/task-generator`) 🔧 **Partial Implementation**
- `POST /analyze` - Analyze directory for task generation 🔧
- `POST /generate` - Generate AI-ready task files 🔧
- `POST /export` - Export tasks in markdown format 🔧
- `GET /templates` - Get available task templates ❌

### **Scaffold Generator Routes** (`/api/scaffold-generator`) 🔧 **Basic Structure, Missing Handlers**
- `POST /analyze` - Analyze project for scaffold patterns ❌ (returns 404)
- `POST /generate` - Generate cross-platform scripts 🔧 (basic implementation)
- `POST /preview` - Preview scaffold generation ❌ (returns 404)
- `POST /export` - Export scaffolds in all formats 🔧 (basic implementation)
- `GET /templates` - Get available scaffold templates ❌ (returns 404)
- `POST /validate` - Validate scaffold settings ❌ (returns 404)

### **Template Management Routes** (`/api/templates`) ❌ **Not Implemented**
- `GET /list` - List all available templates ❌
- `POST /download` - Download template from GitHub ❌
- `GET /:id` - Get specific template ❌
- `POST /create` - Create custom template ❌
- `PUT /:id` - Update template ❌
- `DELETE /:id` - Delete template ❌

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

1. **75% Implementation Gaps**: Core business logic incomplete in Task/Scaffold generation
2. **High Test Failure Rate**: 30% pass rate (265/376 tests) due to incomplete implementations
3. **Missing API Handlers**: Many scaffold generator endpoints return 404
4. **Template System**: No GitHub integration or comprehensive template management
5. **Limited Task Templates**: Only 1 generic template vs. 100+ language-specific needed
6. **Cross-Platform Commands**: Command translation service not implemented

## 📋 Success Metrics

### Implementation Complete When:
- [x] Framework detection works for major technologies (115 frameworks ✅)
- [x] All text files can be read and analyzed (✅)
- [ ] Task files generated in exact format of examples (🔧 in progress)
- [ ] All 12+ script types generated simultaneously (🔧 partial)
- [ ] Templates can be downloaded from GitHub and stored locally (❌)
- [ ] Cross-platform command conversion works properly (❌)
- [ ] 80%+ test coverage with passing tests (❌ currently 30%)

### Performance Targets:
- **File Analysis**: <500ms for 100 files
- **Task Generation**: <2s for comprehensive project  
- **Script Generation**: <1s for all 12+ formats
- **Memory Usage**: <200MB for large projects

## 📝 Contributing

### Current Priority: Complete Core Services
1. **Task Generation Service** - Complete language-specific template system ✅ Architecture | ❌ Templates
2. **Scaffold Generator API** - Implement missing route handlers (/analyze, /preview, /templates, /validate)
3. **Template Management** - GitHub integration and local storage system
4. **Test Coverage** - Fix failing tests to achieve 80%+ pass rate (currently 30%)
5. **API Integration** - Complete service-to-route connections

### Development Guidelines
- TypeScript strict mode with full type coverage
- Comprehensive error handling with user-friendly messages
- 80%+ test coverage for all new code
- Performance optimization for large projects
- Cross-platform compatibility

## 📄 License

MIT License - see LICENSE file for details