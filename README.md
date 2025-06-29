# Task Writer

A powerful desktop application for project analysis and automation. Scan any directory to generate AI-ready task files or create cross-platform scaffold scripts that recreate project structures. Built with Electron, React, and TypeScript.

## ✅ Current Development Status

**Project Status:** Framework Detection Complete - Core Services In Progress (25% Complete)

### ✅ **Completed Features (Backend)**
- ✅ **Multi-Language Framework Detection**: Python, Rust, .NET, Go, Java, JavaScript/Node.js (115 frameworks)
- ✅ **File Analysis Service**: Comprehensive text file reading and metadata extraction
- ✅ **Database Service**: SQLite for settings and template storage
- ✅ **Export Service Foundation**: Multi-format template system structure

### 🔧 **In Progress (Backend)**
- 🔧 **Task Generation Service**: Architecture complete, core logic needs implementation
- 🔧 **Scaffold Generation Service**: Basic structure exists, missing API route handlers
- 🔧 **API Integration**: Many endpoints return 404/stubs, need real implementations

### ❌ **Not Yet Implemented (Backend)**
- ❌ **Template Management System**: GitHub integration and comprehensive local storage
- ❌ **Command Translation Service**: Cross-platform command conversion
- ❌ **Comprehensive Testing**: Currently 30% pass rate (265/376 tests), not 87%

### ✅ **Completed Features (Frontend)**
- ✅ **UI Framework**: Modern React/TypeScript frontend with theming and navigation
- ✅ **Architecture Refactoring**: Complete component refactoring following architecture guide
- ✅ **Settings Management**: Persistent user preferences and configuration
- ✅ **Component Consolidation**: All duplicate page versions resolved and unified
- ✅ **Shared Component System**: Reusable generators, forms, and UI components
- ✅ **Advanced Theming**: 12+ color schemes × 4 modes each (48+ combinations)
- ✅ **Code Organization**: Clean separation of concerns, hooks, and services
- ✅ **Type Safety**: Enhanced TypeScript coverage and proper interfaces

### 🚧 **Remaining Work**
- 🚧 **Complete Backend Services**: Finish Task/Scaffold Generation core logic and API handlers
- 🚧 **Frontend-Backend Integration**: Connect React UI to backend services 
- 🚧 **Template Management**: GitHub integration and comprehensive template system
- 🚧 **Test Coverage**: Fix failing tests to achieve 80%+ pass rate
- 🚧 **Production Build**: Package distribution for Windows, macOS, Linux

## 🎯 What Does Task Writer Do?

Task Writer helps developers with **two core functions**:

### 1. 📄 **Generate AI-Ready Task Files**
Scan any project directory and create detailed markdown task files that provide AI assistants with complete context about your codebase.

**Perfect for:**
- Code reviews and documentation
- Onboarding new team members  
- Getting AI help with specific files or features
- Creating development roadmaps
- Project analysis and planning

### 2. 🔧 **Generate Cross-Platform Scaffold Scripts**
Analyze project structures and create executable scripts that recreate the same structure on any platform.

**Perfect for:**
- Project templates and boilerplate
- Sharing project setups with teams
- Automating repetitive project creation
- Cross-platform development workflows
- Standardizing project structures

## ✨ Core Features

### 📄 Task Generation
- **Comprehensive File Analysis**: Reads and includes complete file contents
- **Custom Instructions**: Add project-specific context via text area input
- **Intelligent Organization**: Groups files logically for AI consumption
- **Markdown Output**: Clean, structured task files in standard format
- **Any File Type**: Processes all text-based files automatically

### 🔧 Scaffold Generation  
- **12+ Script Types**: Generate scripts for all platforms and languages
- **Cross-Platform**: Automatic command conversion between operating systems
- **Template System**: Use built-in templates or create custom ones
- **GitHub Integration**: Download templates directly from repositories
- **Content Options**: Create empty files or include original contents

### 🎨 Template Management
- **Built-in Templates**: Pre-configured project structures
- **GitHub Downloads**: Import templates from repositories
- **Database Storage**: Templates saved locally for offline use
- **Variable Substitution**: Dynamic content generation
- **Custom Templates**: Create and share your own templates

## 📜 Supported Script Types

Task Writer generates scaffold scripts in **all formats supported by [scaffold-scripts](https://github.com/ChrisColeTech/scaffold-scripts)**:

### Shell Scripts
- `.sh` - Shell script (bash/sh)
- `.bash` - Bash script  
- `.zsh` - Zsh script
- `.fish` - Fish shell script

### Windows Scripts
- `.ps1` - PowerShell script
- `.psm1` - PowerShell module
- `.bat` - Batch script
- `.cmd` - CMD script

### Programming Languages
- `.py` / `.py3` - Python script
- `.js` / `.mjs` - JavaScript/Node.js script
- `.ts` - TypeScript script
- `.rb` - Ruby script
- `.pl` - Perl script

### Plain Text
- `.txt` / `.text` - Plain text (treated as shell script)
- No extension - Common for shell scripts

## 🔄 Example Workflows

### Workflow 1: Document Existing Project for AI
1. **Select Directory**: Choose any project folder (`/src/components`, `/api/routes`, etc.)
2. **Add Context**: Enter custom instructions in the text area
3. **Generate Tasks**: Create markdown files with complete source code
4. **Use with AI**: Feed task files to ChatGPT, Claude, or any AI assistant

**Example Output**: `task_01.0.md` with your custom rules + complete file analysis
```markdown
# Custom Instructions
Your project uses React with TypeScript. Focus on component reusability and proper type definitions.

---

# Task: Analyze UI Components

## Files in This Task
### src/components/Button.tsx
**Content:**
```typescript
import React from 'react';
// ... complete file contents
```
```

### Workflow 2: Create Project Template
1. **Select Template**: Choose from built-in templates or download from GitHub
2. **Configure Options**: Select script types and content preferences  
3. **Generate Scripts**: Create all 12+ script formats simultaneously
4. **Share & Use**: Distribute scripts for instant project setup

**Example Output**: Multiple script files that recreate your project structure
- `setup-project.sh` (Unix/Linux)
- `setup-project.ps1` (PowerShell)
- `setup-project.py` (Python)
- ... and 9+ more formats

### Workflow 3: Analyze Unknown Codebase
1. **Deep Scan**: Select root directory of unfamiliar project
2. **Generate Documentation**: Create comprehensive task files
3. **Understand Structure**: Review organized file contents and relationships
4. **Plan Changes**: Use AI assistance with complete context

### Workflow 4: Standardize Team Workflows
1. **Template Library**: Download team templates from GitHub repository
2. **Local Storage**: Templates saved in database for offline access
3. **Consistent Setup**: Generate same project structure across team
4. **Platform Agnostic**: Each team member gets scripts for their OS

## 🌟 Key Benefits

### For Developers
- **AI Integration**: Perfect input format for AI coding assistants
- **Time Saving**: Automate repetitive project setup tasks
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **No Vendor Lock-in**: Generated scripts work independently

### For Teams  
- **Standardization**: Consistent project structures across team
- **Knowledge Sharing**: Easy documentation and onboarding
- **Template Library**: Centralized template management
- **Flexibility**: Supports any project type or language

### For Project Management
- **Documentation**: Comprehensive project analysis files
- **Planning**: AI-ready files for development planning
- **Templates**: Reusable project structures
- **Automation**: Reduce manual setup time

## 💻 Generated Output Examples

### Task File Example
```markdown
# Custom Instructions

This is a React TypeScript project. Pay attention to component patterns and type safety.

---

# Task: Frontend Components Analysis

## Overview
This task covers analysis of the UI component library.
Includes 5 file(s) for review and implementation.

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
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md', 
  children,
  onClick
}) => {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded font-medium transition-colors',
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-500 text-white hover:bg-gray-600': variant === 'secondary',
          'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
        },
        {
          'px-2 py-1 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        }
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```
```

### PowerShell Script Example
```powershell
# React TypeScript Project Setup Script
# Generated by Task Writer on 2024-01-15T15:45:30.000Z
# Template: React TypeScript Starter

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectName
)

Write-Host "Setting up React TypeScript project: $ProjectName" -ForegroundColor Green

# Create project directory
New-Item -ItemType Directory -Force -Path $ProjectName
Set-Location $ProjectName

# Initialize project with Vite
npm create vite@latest . -- --template react-ts

# Install additional dependencies
npm install lucide-react clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer @types/node

# Create directory structure
$directories = @(
    "src/components/ui",
    "src/components/layout", 
    "src/hooks",
    "src/lib",
    "src/types"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path $dir
}

# Create component files
@'
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
'@ | Out-File -FilePath "src/components/ui/Button.tsx" -Encoding UTF8

# Install dependencies and build
npm install
npm run build

Write-Host "✅ Project setup completed successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  cd $ProjectName" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor Cyan
```

### Bash Script Example  
```bash
#!/bin/bash
# React TypeScript Project Setup Script
# Generated by Task Writer on 2024-01-15T15:45:30.000Z

set -e

PROJECT_NAME="$1"

if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: $0 <project-name>"
    exit 1
fi

echo "🚀 Setting up React TypeScript project: $PROJECT_NAME"

# Create project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Initialize project with Vite
npm create vite@latest . -- --template react-ts

# Create directory structure
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/types

# Create Button component
cat > src/components/ui/Button.tsx << 'EOF'
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
EOF

# Install dependencies
npm install

echo "✅ Project setup completed successfully!"
echo "Next steps:"
echo "  cd $PROJECT_NAME"
echo "  npm run dev"
```

## 📊 Supported File Types

Task Writer can analyze and include **any text-based file** in task generation:

### Programming Languages
**Frontend**: `.js` `.jsx` `.ts` `.tsx` `.vue` `.svelte` `.html` `.css` `.scss` `.sass` `.less`  
**Backend**: `.py` `.rb` `.php` `.java` `.kt` `.swift` `.go` `.rs` `.cpp` `.c` `.cs` `.vb` `.fs`  
**Functional**: `.clj` `.scala` `.hs` `.elm` `.ml`  
**Mobile**: `.dart` `.kotlin` `.swift` `.m` `.mm`

### Configuration & Data  
**Config**: `.json` `.yaml` `.yml` `.toml` `.ini` `.env` `.config`  
**Build**: `package.json` `Cargo.toml` `pom.xml` `build.gradle` `CMakeLists.txt`  
**Database**: `.sql` `.graphql` `.gql` `.prisma`

### Documentation & Scripts
**Docs**: `.md` `.txt` `.rst` `.adoc` `README` `CHANGELOG` `LICENSE`  
**Scripts**: `.sh` `.bash` `.zsh` `.fish` `.ps1` `.bat` `.cmd`

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/ChrisColeTech/task-writer.git
cd task-writer

# Install dependencies
npm install

# Launch in development mode (Electron + React)
npm run start:electron

# Or launch production build
npm run start:electron:prod
```

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Modern UI**: Clean, responsive interface with advanced theming
- **Component Library**: Reusable components following design system
- **State Management**: React hooks with localStorage persistence
- **Navigation**: Tab-based interface with intuitive workflows

### Backend (Electron + Node.js)  
- **Service Architecture**: Modular services for each core function
- **Database Integration**: SQLite for settings and template storage
- **File Operations**: Comprehensive file system analysis
- **Cross-Platform**: Windows, macOS, and Linux support

### Key Services (Implementation Status)
- **File Analysis Service**: Parse and understand any text-based file ✅
- **Framework Detection Service**: Identify project types and technologies (115 frameworks) ✅
- **Database Service**: SQLite for settings and template storage ✅
- **Export Service Foundation**: Multi-format template system structure ✅
- **Task Generation Service**: Architecture complete, core logic needs implementation 🔧
- **Scaffold Generation Service**: Basic structure, missing API route handlers 🔧
- **Template Management Service**: GitHub integration not yet implemented ❌

## 🎨 Advanced Features

### Template System
- **GitHub Integration**: Download templates directly from repositories  
- **Local Storage**: Templates cached in SQLite database
- **Variable Substitution**: Dynamic project name, paths, and configurations
- **Custom Templates**: Create and share your own project templates

### Multi-Platform Support
- **Command Translation**: Automatic conversion between shell syntaxes
- **Path Handling**: Cross-platform path separator conversion
- **Platform Detection**: Generate appropriate scripts for target OS
- **Universal Scripts**: Node.js and Python options for maximum compatibility

### User Experience
- **Custom Instructions**: Text area for project-specific context
- **Real-time Progress**: Visual feedback during generation
- **Drag & Drop**: Intuitive file organization
- **Settings Persistence**: Remember preferences across sessions

## 🔧 Development

### Prerequisites
- **Node.js 18+**
- **npm 8+**  
- **Windows, macOS, or Linux**

### Development Commands
```bash
# Install dependencies
npm install

# Frontend development only  
npm run dev

# Full Electron development
npm run start:electron

# Production build and run
npm run start:electron:prod

# Build for distribution
npm run electron:build
```

### Backend Implementation Status
**Current Status**: Framework detection complete, core business logic services in progress (25% complete)

**✅ Fully Implemented**:
- ✅ **Database Service**: SQLite for settings and templates
- ✅ **File Analysis Service**: Read and parse any text file with metadata
- ✅ **Framework Detection Service**: 115 frameworks across 6 languages (Python, Rust, .NET, Go, Java, JavaScript)
- ✅ **Export Service Foundation**: Multi-format template system structure

**🔧 Architecture Complete, Logic In Progress**:
- 🔧 **Task Generation Service**: Service architecture exists, core generation logic needs completion
- 🔧 **Scaffold Generation Service**: Basic structure exists, missing API route handlers
- 🔧 **API Integration**: Many endpoints return 404/stubs, need real implementations

**❌ Not Yet Implemented**:
- ❌ **Template Management Service**: GitHub integration and comprehensive local storage
- ❌ **Command Translation Service**: Cross-platform command conversion
- ❌ **Comprehensive Testing**: Currently 30% pass rate (265/376 tests), target 80%+
- ❌ **Frontend Integration**: Connect React UI to backend services

## 🎨 Theming

### Advanced Theme System
- **12+ Color Schemes**: Regular, Ocean Blue, Forest Green, Royal Purple, Sunset Orange, Cyberpunk, Office, Terminal, Midnight Blue, Crimson Red, Warm Sepia, Rose Gold
- **4 Modes per Scheme**: Light, Dark, High Contrast Light, High Contrast Dark  
- **48+ Total Combinations**: Complete independence between color scheme and mode
- **Special Effects**: Enhanced themes with glows, neon borders, and animations
- **CSS Variables**: Instant theme switching with consistent styling

## 📝 Contributing

### Current Priority Tasks

**High Priority (Complete Backend)**:
1. **Task Generation Service Logic** - Complete core template system and generation logic
2. **Scaffold Generator API** - Implement missing route handlers (/analyze, /preview, /templates, /validate)
3. **Template Management System** - GitHub integration and comprehensive local storage
4. **Test Coverage** - Fix failing tests to achieve 80%+ pass rate (currently 30%)

**Medium Priority (Integration)**:
1. **Frontend-Backend Integration** - Connect React UI to backend services
2. **API Endpoint Completion** - Connect all services to their route handlers
3. **End-to-End Testing** - Complete workflow testing from UI to file generation
4. **Production Packaging** - Build distribution packages for Windows, macOS, Linux

**Lower Priority (Polish)**:
1. **Performance Optimization** - Large project handling and memory efficiency
2. **Enhanced Error Handling** - Better user feedback and error recovery
3. **Additional Framework Support** - Expand beyond the current 115 frameworks

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable  
5. Submit a pull request

### Code Guidelines
- **Follow the Style Guide**: See [STYLE_GUIDE.md](./STYLE_GUIDE.md)
- **Theme Variables Only**: Use CSS custom properties, no hardcoded colors
- **TypeScript**: Strict typing, avoid `any` types
- **Accessibility**: WCAG 2.1 AA compliance
- **Error Handling**: Provide clear user feedback

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/ChrisColeTech/task-writer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ChrisColeTech/task-writer/discussions)
- **Documentation**: [Wiki](https://github.com/ChrisColeTech/task-writer/wiki)

---

**Built with ❤️ using Electron, React, and TypeScript**