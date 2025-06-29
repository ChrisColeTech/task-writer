# Backend Implementation Plan

## Table of Contents

- [Files to Create/Update Summary](#files-to-createupdate-summary)
- [Overview](#overview)
- [Current Status](#current-status)
- [Implementation Focus](#implementation-focus)
- [Feature-Focused Implementation](#feature-focused-implementation)
  - [Feature 1: Task Generation Service Completion](#feature-1-task-generation-service-completion)
  - [Feature 2: Export Service Implementation](#feature-2-export-service-implementation)
  - [Feature 3: Example Management Service Implementation](#feature-3-example-management-service-implementation)
  - [Feature 4: Scaffold Generation Service Completion](#feature-4-scaffold-generation-service-completion)
  - [Feature 5: Command Translation Service Implementation](#feature-5-command-translation-service-implementation)
  - [Feature 6: Python Framework Detection](#feature-6-python-framework-detection)
  - [Feature 7: Rust Framework Detection](#feature-7-rust-framework-detection)
  - [Feature 8: .NET Framework Detection](#feature-8-net-framework-detection)
  - [Feature 9: Go Framework Detection](#feature-9-go-framework-detection)
  - [Feature 10: Java Framework Detection](#feature-10-java-framework-detection)
  - [Feature 11: Task Generator Routes](#feature-11-task-generator-routes)
  - [Feature 12: Scaffold Generator Routes](#feature-12-scaffold-generator-routes)
  - [Feature 13: Example Management Routes](#feature-13-example-management-routes)
  - [Feature 14: Integration Testing and Validation](#feature-14-integration-testing-and-validation)
  - [Feature 15: Error Handling and Validation](#feature-15-error-handling-and-validation)
  - [Feature 16: Performance Optimization](#feature-16-performance-optimization)
- [Implementation Timeline](#implementation-timeline)
- [Implementation Guidelines](#implementation-guidelines)
- [Dependencies and Packages](#dependencies-and-packages)
- [Risk Mitigation](#risk-mitigation)
- [Success Metrics](#success-metrics)

## Files to Create/Update Summary

### 📄 **Files to Update/Fix (7 files)**

- `src/services/TaskGenerationService.ts` - Complete core generation logic
- `src/services/ScaffoldGenerationService.ts` - Complete rewrite for multi-language support
- `src/services/ExportService.ts` - Implement actual file writing and multi-format export
- `src/routes/taskGenerator.ts` - Replace stub implementations with real service calls
- `src/routes/scaffoldGenerator.ts` - Replace stub implementations with real service calls
- `src/__tests__/integration.test.ts` - Update for real implementations
- `README.md` - Update implementation status to 100%

### 🆕 **Files to Create (22 files)**

#### **New Services (9 files)**

- `src/services/PythonFrameworkDetector.ts` - Python framework detection
- `src/services/RustFrameworkDetector.ts` - Rust framework detection
- `src/services/DotNetFrameworkDetector.ts` - .NET framework detection
- `src/services/GoFrameworkDetector.ts` - Go framework detection
- `src/services/JavaFrameworkDetector.ts` - Java framework detection
- `src/services/ExampleManagementService.ts` - Local examples folder access and management
- `src/services/CommandTranslationService.ts` - Cross-platform command conversion
- `src/services/FileAnalysisService.ts` - Universal text file analysis (if not exists)
- `src/services/ExportService.ts` - Multi-format export service (if not exists)

#### **New Routes (1 file)**

- `src/routes/examples.ts` - Example management API routes

#### **New Types (6 files)**

- `src/types/pythonFramework.ts` - Python framework types
- `src/types/rustFramework.ts` - Rust framework types
- `src/types/dotnetFramework.ts` - .NET framework types
- `src/types/goFramework.ts` - Go framework types
- `src/types/javaFramework.ts` - Java framework types
- `src/types/example.ts` - Example management types

#### **New Utilities (8 files)**

- `src/utils/templateEngine.ts` - Variable substitution and template processing
- `src/utils/scriptGeneration.ts` - Multi-format script generation
- `src/utils/commandTranslation.ts` - Cross-platform command conversion
- `src/utils/fileGeneration.ts` - File writing and archive creation
- `src/utils/errorHandling.ts` - Comprehensive error handling
- `src/utils/validation.ts` - Input validation utilities
- `src/utils/performance.ts` - Performance monitoring and benchmarking
- `src/middleware/caching.ts` - Caching middleware

#### **New Data Files (5 files)**

- `src/data/pythonFrameworks.json` - Python framework detection rules
- `src/data/rustFrameworks.json` - Rust framework detection rules
- `src/data/dotnetFrameworks.json` - .NET framework detection rules
- `src/data/goFrameworks.json` - Go framework detection rules
- `src/data/javaFrameworks.json` - Java framework detection rules

### 🧪 **Test Files to Create/Update (15 files)**

#### **New Service Tests (8 files)**

- `src/__tests__/services/PythonFrameworkDetector.test.ts`
- `src/__tests__/services/RustFrameworkDetector.test.ts`
- `src/__tests__/services/DotNetFrameworkDetector.test.ts`
- `src/__tests__/services/GoFrameworkDetector.test.ts`
- `src/__tests__/services/JavaFrameworkDetector.test.ts`
- `src/__tests__/services/TemplateManagementService.test.ts`
- `src/__tests__/services/CommandTranslationService.test.ts`
- `src/__tests__/services/FileAnalysisService.test.ts` (if not exists)

#### **New Route Tests (1 file)**

- `src/__tests__/routes/templates.test.ts`

#### **Test Files to Update (6 files)**

- `src/__tests__/services/TaskGenerationService.test.ts` - Update for real implementation
- `src/__tests__/services/ScaffoldGenerationService.test.ts` - Update for multi-language support
- `src/__tests__/services/ExportService.test.ts` - Update for actual file writing
- `src/__tests__/routes/taskGenerator.test.ts` - Update for real service integration
- `src/__tests__/routes/scaffoldGenerator.test.ts` - Update for real service integration
- All other test files - Update coverage and fix failing tests

### 📦 **Dependencies to Add**

```json
{
  "dependencies": {
    "archiver": "^5.3.1", // ZIP file creation for script packages
    "marked": "^4.0.0", // Markdown generation for task files
    "prettier": "^2.8.0", // Code formatting in generated scripts
    "ignore": "^5.2.0", // .gitignore parsing for file filtering
    "semver": "^7.3.0", // Version comparison for framework detection
    "node-cache": "^5.1.2", // Caching for framework detection results
    "iconv-lite": "^0.6.0" // Encoding detection for text files
  },
  "devDependencies": {
    "@types/archiver": "^5.3.1",
    "@types/marked": "^4.0.0",
    "@types/semver": "^7.3.0"
  }
}
```

**Total Files**: 44 files (7 updates + 22 new + 15 test files)

## Overview

This document outlines the **massive** step-by-step implementation plan to complete the Task Writer backend from its current **5% JavaScript-only state** to 100% **multi-language** completion. The backend serves **two core functions**: generating AI-ready task files and creating cross-platform scaffold scripts.

**⚠️ REALITY CHECK: This represents approximately 18-24 months of development work to implement properly across all major programming languages and ecosystems.**

## 🎯 Implementation Focus: Two Core Tasks

Every service must directly support one or both core tasks:

1. **📄 Generate AI-Ready Task Files** - Markdown with complete source code inclusion
2. **🔧 Generate Cross-Platform Scaffold Scripts** - 12+ formats that recreate projects

## Feature-Focused Implementation

---

## **Feature 1: Task Generation Service Completion**

**Estimated Time: 30-45 minutes**
**Current Status: 73.7% coverage, working but needs rules formatting fix**

### Purpose

Complete the existing Task Generation Service that's already 73.7% implemented and working. Ensure generated task files match the exact format from `/backend/examples/tasks/`.

**For task file format details, see:** [Task File Example](README.md#task-file-example) and [Generated Output Examples](README.md#💻-generated-output-examples)

### Required Task File Format

Based on `/backend/examples/tasks/2_frontend/task_01.0.md`, generated task files must include:

**Exact Rules Section (10 numbered rules):**

```markdown
### Rules

1.) **CONCISENESS CLAUSE** When replying use as few words as needed...
2.) **WORKSPACE DIRECTIVE** Before you write any code...
3.) **COMMAND FORMATTING** Always use && to chain commands...
4.) **READ THE TASK FILE AND THEN SUMMARIZE** Summarize and list...
5.) **IMPORTANT** you should stop to resolve ALL build errors...
6.) **FULL PATHS ONLY** Always confirm you are in the correct...
7.) **READ FIRST DIRECTIVE** Read folders and files first...
8.) Complete all work in the task file...
9.) **TOOL USAGE CLAUSE** Always use the appropriate tools...
10.) **FINAL CHECKLIST** Always verify location before...
```

**Task Structure:**

- Task title with version number (e.g., "# Task 3.0: Create Frontend Project - Part 1")
- Step-by-step instructions with PowerShell code blocks
- Specific file creation commands
- Configuration file contents (package.json, tsconfig.json, etc.)
- Final build and validation steps

### Files to Fix

- `src/services/TaskGenerationService.ts` - Fix rules section formatting to match examples exactly
- `src/__tests__/services/TaskGenerationService.test.ts` - Update failing tests

### Implementation Steps

#### Step 1: Fix Rules Section Formatting (15 min)
**Problem**: Current rules section doesn't match exact format from `examples/tasks/2_frontend/task_01.0.md`

**Required Format**:
```markdown
### Rules

1.) **CONCISENESS CLAUSE** When replying use as few words as needed...
2.) **WORKSPACE DIRECTIVE** Before you write any code...
3.) **COMMAND FORMATTING** Always use && to chain commands...
4.) **READ THE TASK FILE AND THEN SUMMARIZE** Summarize and list...
5.) **IMPORTANT** you should stop to resolve ALL build errors...
6.) **READ FIRST DIRECTIVE** Read folders and files first...
7.) Complete all work in the task file...
8.) **TOOL USAGE CLAUSE** Always use the appropriate tools...
9.) **FINAL CHECKLIST** Always verify location before...
10.) **FINAL CHECKLIST** Always verify location before...
```

**Files to Edit**:
- `src/services/TaskGenerationService.ts:generateRulesSection()`
- Update template to match exact numbering and formatting

#### Step 2: Fix Task Structure (10 min)
**Current Issue**: Task structure doesn't match examples exactly

**Required Structure**:
```markdown
# Task 3.0: Create Frontend Project - Part 1

## Step 1: Initial Project Setup
[PowerShell commands with error handling]

## Step 2: Create Directory Structure  
[Specific mkdir commands]

## Step 3: Create Configuration Files
[Package.json content, tsconfig content]

## Final Verification
[Build and validation steps]
```

**Fix Location**: `src/services/TaskGenerationService.ts:buildTaskContent()`

#### Step 3: Update Tests (15 min)
**Test Files to Update**:
- `src/__tests__/services/TaskGenerationService.test.ts`
- Update expected outputs to match corrected format
- Add specific tests for rules section formatting
- Verify 10 rules are present and correctly formatted

#### Step 4: Integration Verification (5 min)
- Generate test task file
- Compare output against `examples/tasks/2_frontend/task_01.0.md`
- Ensure exact match in formatting and structure

### Acceptance Criteria

- ✅ All TaskGenerationService tests pass
- ✅ Generated markdown matches backend/examples format exactly
- ✅ Rules section contains all 10 rules with exact formatting
- ✅ Custom instructions integration working
- ✅ Task structure follows step-by-step format with code blocks

### Dependencies

- `src/services/FileAnalysisService.ts` (already complete)
- `src/services/FrameworkDetectionService.ts` (already complete)

---

## **Feature 2: Export Service Implementation**

**Estimated Time: 3-4 days**  
**Current Status: Structure exists, file writing implementation missing**

### Purpose

Write the generated content to actual files on disk. The Task Generation Service creates markdown content in memory, but the Export Service takes that content and writes it to .md files that users can save. Similarly for scaffold scripts - it takes generated script content and writes it to .sh, .ps1, .py files etc. that users can download and run.

**For details on supported file formats, see:** [📜 Supported Script Types](README.md#📜-supported-script-types) and [Generated Output Examples](README.md#💻-generated-output-examples)

### Task File Export Format Requirements

Based on `/backend/examples/tasks/`

**Cross-Platform Requirements:**

- All 12+ script formats: `.sh` `.bash` `.zsh` `.fish` `.ps1` `.psm1` `.bat` `.cmd` `.py` `.js` `.ts` `.rb` `.pl` `.txt`
- Proper shebang lines for Unix scripts
- UTF-8 encoding with appropriate line endings
- Executable permissions for Unix scripts

### Files to Create/Update

- `src/services/ExportService.ts` - Implement actual file writing and multi-format export
- `src/types/export.ts` - Export type definitions
- `src/utils/fileGeneration.ts` - File writing and archive creation
- `src/__tests__/services/ExportService.test.ts` - Update for actual file writing

### Implementation Steps

#### Phase 1: Core File Writing (Day 1, 4 hours)

##### Step 1: Implement Basic File Writing (2 hours)
**Current Issue**: ExportService structure exists but `writeToFile()` is not implemented

**Files to Update**:
```typescript
// src/services/ExportService.ts
async writeTaskFile(content: string, filename: string): Promise<ExportResult> {
  // Write .md files with UTF-8 encoding
  // Handle Windows CRLF vs Unix LF line endings
  // Return file metadata (size, path, checksum)
}

async writeScriptFile(content: string, format: ScriptFormat, filename: string): Promise<ExportResult> {
  // Write script files with proper encoding
  // Set executable permissions for Unix scripts (chmod +x)
  // Handle platform-specific requirements
}
```

**Platform Handling**:
- **Windows**: CRLF line endings, UTF-8 with BOM for .bat/.cmd
- **Unix**: LF line endings, executable permissions for .sh/.bash/.zsh/.fish
- **Cross-platform**: UTF-8 encoding, proper file extensions

##### Step 2: Cross-Platform Permission Handling (1 hour)
```typescript
// src/utils/fileGeneration.ts
async setExecutablePermissions(filePath: string, format: string): Promise<void> {
  if (process.platform !== 'win32') {
    // chmod +x for .sh, .bash, .zsh, .fish, .py, .rb, .pl
    await fs.chmod(filePath, 0o755);
  }
}
```

##### Step 3: Encoding and Line Ending Management (1 hour)
```typescript
interface PlatformConfig {
  lineEnding: '\r\n' | '\n';
  encoding: 'utf8' | 'utf8-bom';
  executable: boolean;
}

const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  '.sh': { lineEnding: '\n', encoding: 'utf8', executable: true },
  '.ps1': { lineEnding: '\r\n', encoding: 'utf8-bom', executable: false },
  '.bat': { lineEnding: '\r\n', encoding: 'utf8', executable: false },
  // ... other formats
};
```

#### Phase 2: Multi-Format Generation (Day 2, 4 hours)

##### Step 4: Implement All 12+ Script Formats (2 hours)
**Generate simultaneously from single template**:
```typescript
async generateAllScriptFormats(template: ScaffoldTemplate, variables: Record<string, any>): Promise<ExportResult[]> {
  const formats = ['.sh', '.bash', '.zsh', '.fish', '.ps1', '.psm1', '.bat', '.cmd', '.py', '.js', '.ts', '.rb', '.pl', '.txt'];
  
  return Promise.all(
    formats.map(format => this.generateScriptFormat(template, variables, format))
  );
}
```

**Format-Specific Generation**:
- Use Command Translation Service for platform-specific syntax
- Apply format-specific templates (PowerShell vs Bash vs Python)
- Include proper error handling for each format

##### Step 5: Archive/ZIP Creation (1 hour)
```typescript
// Use 'archiver' package
async createScriptPackage(scripts: ExportResult[]): Promise<Buffer> {
  const archive = archiver('zip');
  
  // Organize by platform:
  // /windows/ - .ps1, .bat, .cmd files
  // /unix/ - .sh, .bash, .zsh, .fish files  
  // /cross-platform/ - .py, .js, .ts, .rb files
  // /manual/ - .txt instructions
  
  return archive.finalize();
}
```

##### Step 6: Batch Export Implementation (1 hour)
```typescript
async exportMultipleFiles(files: Array<{content: string, type: 'task' | 'script', metadata: any}>): Promise<BatchExportResult> {
  // Export all files in single operation
  // Maintain transaction-like behavior (all succeed or all fail)
  // Return comprehensive metadata about exported files
}
```

#### Phase 3: Integration & Testing (Day 3-4, 8 hours)

##### Step 7: Integration with Task Generation Service (2 hours)
```typescript
// src/routes/taskGenerator.ts
app.post('/export', async (req, res) => {
  const taskContent = await taskGenerationService.generate(req.body);
  const exportResult = await exportService.writeTaskFile(taskContent.content, taskContent.filename);
  res.json(exportResult);
});
```

##### Step 8: Integration with Scaffold Generation Service (2 hours)
```typescript
// src/routes/scaffoldGenerator.ts  
app.post('/export', async (req, res) => {
  const scaffoldContent = await scaffoldGenerationService.generate(req.body);
  const exportResults = await exportService.generateAllScriptFormats(scaffoldContent.template, scaffoldContent.variables);
  const archive = await exportService.createScriptPackage(exportResults);
  res.json({ files: exportResults, archive });
});
```

##### Step 9: Comprehensive Testing (3 hours)
**Test Files to Create/Update**:
- `src/__tests__/services/ExportService.test.ts`
  - Test file writing with different encodings
  - Test permission setting on Unix systems
  - Test archive creation
  - Test batch export functionality

**Integration Tests**:
- End-to-end: Generate task → Export → Verify file contents
- End-to-end: Generate scaffold → Export all formats → Verify scripts work
- Cross-platform: Test on Windows and Unix systems

##### Step 10: Error Handling & Validation (1 hour)
```typescript
// Comprehensive error handling
try {
  await exportService.writeFile(content, path);
} catch (error) {
  if (error.code === 'EACCES') {
    throw new ExportError('Permission denied - check folder write permissions');
  } else if (error.code === 'ENOSPC') {
    throw new ExportError('Insufficient disk space');
  } else if (error.code === 'ENAMETOOLONG') {
    throw new ExportError('Filename too long');
  }
  throw new ExportError(`File write failed: ${error.message}`);
}
```

### Dependencies Integration
- **Command Translation Service**: Convert commands to platform-specific syntax
- **Task Generation Service**: Provides content to export
- **Scaffold Generation Service**: Provides templates and variables
- **File System Service**: File path validation and directory creation

### Acceptance Criteria

- ✅ Export .md files matching backend/examples format exactly
- ✅ Generate all 12+ script formats with platform-specific syntax
- ✅ Handle cross-platform line endings and permissions correctly
- ✅ Support packaging multiple files into archives
- ✅ Scripts include error handling and user feedback
- ✅ All ExportService tests pass

### Dependencies

-- Feature 1 (Task Generation Service)

---

## **Feature 3: Example Management Service Implementation**

**Estimated Time: 1-2 days**
**Current Status: Example files exist, service not implemented (0% coverage)**

### Purpose

Provide access to local example files in examples/tasks and examples/scripts folders. Examples define the structure and content for both task files and scaffold scripts using a simple dropdown UI selection system.

**For example templates, see:** [Example Scripts](README.md#💻-generated-output-examples) and local examples folder

### Example Format Requirements

Based on the examples/tasks and examples/scripts folders, examples must support:

**Task Examples:**

- Pre-built task files in examples/tasks folder (e.g., task_01.0.md)
- Frontend project setup examples with exact 10-rule format
- PowerShell command examples for React TypeScript projects
- Complete markdown structure with step-by-step instructions

**Scaffold Examples:**

- 12+ script format examples in examples/scripts folder
- Complete project setup scripts (.sh, .ps1, .py, .ts, .rb, .pl, etc.)
- Cross-platform command variations already implemented
- Package.json configurations with exact dependency versions
- Directory structure creation with specific folder hierarchies

**Built-in Example Requirements:**

- **React TypeScript**: Already created in examples/scripts (all 12+ formats)
- **Frontend Setup**: Complete Vite + React + TypeScript project scaffold
- **Cross-Platform Scripts**: PowerShell, Bash, Python, TypeScript, Ruby, Perl versions
- **Task Files**: Frontend project setup instructions in examples/tasks
- **Text Instructions**: Plain text version available for manual setup

### Files to Create

- `src/services/ExampleManagementService.ts` - Local examples folder access
- `src/types/example.ts` - Example management types
- `src/utils/exampleLoader.ts` - File system access to examples folders
- `src/__tests__/services/ExampleManagementService.test.ts` - Create comprehensive tests

### Implementation Steps

#### Step 1: Create ExampleManagementService.ts (30 min)
```typescript
// src/services/ExampleManagementService.ts
class ExampleManagementService {
  private examplesPath = path.join(__dirname, '../../examples');
  
  async listTaskExamples(): Promise<TaskExample[]> {
    // Scan examples/tasks/ folder
    // Read file headers for metadata
    // Return structured list
  }
  
  async listScriptExamples(): Promise<ScriptExample[]> {
    // Scan examples/scripts/ folder  
    // Group by script type (.sh, .ps1, etc.)
    // Extract metadata from file headers
  }
  
  async getExampleContent(id: string): Promise<string> {
    // Read specific example file
    // Validate file exists and is readable
    // Return raw content
  }
}
```

#### Step 2: Create API Routes (45 min)
```typescript
// src/routes/examples.ts
router.get('/list', async (req, res) => {
  // Return both tasks and scripts in structured format
});

router.get('/tasks', async (req, res) => {
  // Return only task examples for UI dropdown
});

router.get('/scripts', async (req, res) => {
  // Return script examples grouped by format
});

router.get('/:id', async (req, res) => {
  // Return specific example content
});
```

#### Step 3: File System Integration (20 min)
- Use existing FileSystemService patterns
- Implement proper error handling for missing files
- Add file validation (readable, correct format)
- Cache results for performance

#### Step 4: Frontend Integration Design (15 min)
```typescript
// Frontend will call:
GET /api/examples/tasks 
// Returns: [{ id: "frontend-setup", name: "Frontend Project Setup", framework: ["react", "typescript"] }]

GET /api/examples/scripts
// Returns: [{ id: "scaffold-frontend", formats: [".sh", ".ps1", ".py"], framework: ["react"] }]

GET /api/examples/frontend-setup
// Returns: { content: "# Task 3.0: Create Frontend Project...", metadata: {...} }
```

#### Step 5: Testing (30 min)
- Unit tests for file reading
- Integration tests for API endpoints  
- Test error handling for missing files
- Verify metadata extraction works correctly

### Detailed Requirements

#### Example Storage

- **File System**: Local storage in examples/tasks and examples/scripts folders
- **Example Types**: Task files (.md), scaffold scripts (12+ formats)
- **Metadata Management**: Extract name, description, framework from file headers
- **Content Access**: Direct file reading with caching

#### Local File Management

- **Folder Scanning**: List available examples from local directories
- **Content Loading**: Read and cache example files for fast access
- **Format Detection**: Identify script types and task categories
- **Organization**: Group examples by type (frontend, backend, fullstack)

#### Example Processing

- **Content Reading**: Read example files with proper encoding
- **Metadata Extraction**: Parse headers for name, description, framework info
- **Format Validation**: Ensure examples follow expected structure
- **Caching**: Cache loaded examples for performance

#### Built-in Examples

- **React TypeScript**: Complete frontend project setup (all 12+ script formats)
- **Task Examples**: Frontend project setup instructions
- **Script Examples**: Cross-platform project scaffolding
- **Text Examples**: Manual setup instructions
- **Future Examples**: Backend, fullstack, mobile project templates

### Acceptance Criteria

- ✅ Access local examples from file system
- ✅ Enumerate examples for UI dropdown selection
- ✅ Load example content for scaffold generation
- ✅ Support all 12+ script formats from examples/scripts
- ✅ All ExampleManagementService tests pass

### Dependencies

- File system access to examples/ folder (existing)
- `src/services/FileSystemService.ts` (existing)

---

## **Feature 4: Scaffold Generation Service Completion**

**Estimated Time: 2-3 days**
**Current Status: 55.7% coverage - Basic structure exists, core generation incomplete**

### Purpose

Generate scripts for ALL programming languages and frameworks in 12+ formats, following the exact patterns from `/backend/examples/scripts/`.

**For script format details, see:** [Supported Script Types](README.md#📜-supported-script-types) and [Script Examples](README.md#generated-output-examples)

**Cross-Platform Equivalents:**

- **Bash (.sh)**: `set -e`, `echo "🚀 message"`, proper error handling
- **Python (.py)**: subprocess.run(), proper main() function
- **JavaScript (.js)**: Node.js with fs and child_process modules
- **All other formats**: Platform-appropriate syntax and error handling

**Content Generation:**

- Exact file content from templates (package.json, tsconfig.json, etc.)
- Framework-specific directory structures
- Dependency installation commands
- Build and validation steps

### Files to Create/Update

- `src/services/ScaffoldGenerationService.ts` - Complete rewrite for multi-language support
- `src/types/scaffold.ts` - Scaffold generation types
- `src/utils/scriptGeneration.ts` - Multi-format script generation
- `src/__tests__/services/ScaffoldGenerationService.test.ts` - Update for multi-language support

### Implementation Steps

#### Phase 1: Core Generation Logic (Day 1, 6 hours)

##### Step 1: Implement Template Application Engine (3 hours)
**Current Issue**: ScaffoldGenerationService has structure but no template processing logic

**Files to Update**:
```typescript
// src/services/ScaffoldGenerationService.ts
async applyTemplate(template: ExampleTemplate, variables: ScaffoldVariables): Promise<GeneratedContent> {
  // Load template from Example Management Service
  const exampleContent = await this.exampleService.getExampleContent(template.id);
  
  // Apply variable substitution
  const processedContent = this.substituteVariables(exampleContent, variables);
  
  // Generate platform-specific versions
  return this.generateAllPlatformVersions(processedContent, variables);
}

private substituteVariables(content: string, variables: ScaffoldVariables): string {
  // Replace {{projectName}}, {{framework}}, {{dependencies}}, etc.
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match;
  });
}
```

**Variable Substitution Patterns**:
```typescript
interface ScaffoldVariables {
  projectName: string;           // {{projectName}} -> "my-react-app"
  framework: string;             // {{framework}} -> "react"
  dependencies: string[];        // {{dependencies}} -> ["react", "typescript"]
  targetPath: string;           // {{targetPath}} -> "./frontend/app"
  packageManager: 'npm' | 'yarn' | 'pnpm';  // {{packageManager}} -> "npm"
  buildTool: string;            // {{buildTool}} -> "vite"
}
```

##### Step 2: Implement Multi-Platform Generation (2 hours)
```typescript
// Generate all 12+ formats simultaneously
async generateAllPlatformVersions(baseContent: string, variables: ScaffoldVariables): Promise<ScriptVersion[]> {
  const platforms = [
    { format: '.sh', platform: 'unix', shell: 'bash' },
    { format: '.bash', platform: 'unix', shell: 'bash' },
    { format: '.zsh', platform: 'unix', shell: 'zsh' },
    { format: '.fish', platform: 'unix', shell: 'fish' },
    { format: '.ps1', platform: 'windows', shell: 'powershell' },
    { format: '.psm1', platform: 'windows', shell: 'powershell-module' },
    { format: '.bat', platform: 'windows', shell: 'batch' },
    { format: '.cmd', platform: 'windows', shell: 'cmd' },
    { format: '.py', platform: 'cross-platform', shell: 'python' },
    { format: '.js', platform: 'cross-platform', shell: 'node' },
    { format: '.ts', platform: 'cross-platform', shell: 'tsx' },
    { format: '.rb', platform: 'cross-platform', shell: 'ruby' },
    { format: '.pl', platform: 'cross-platform', shell: 'perl' },
    { format: '.txt', platform: 'manual', shell: 'text' }
  ];
  
  return Promise.all(
    platforms.map(platform => this.generatePlatformVersion(baseContent, variables, platform))
  );
}
```

##### Step 3: Command Translation Integration (1 hour)
```typescript
// Integration with Command Translation Service
private async translateCommands(content: string, targetPlatform: PlatformConfig): Promise<string> {
  const commands = this.extractCommands(content);
  const translatedCommands = await this.commandTranslationService.translateBatch(commands, targetPlatform);
  return this.replaceCommands(content, translatedCommands);
}

private extractCommands(content: string): Command[] {
  // Extract commands like: mkdir, npm install, cd, etc.
  const commandRegex = /^(mkdir|cd|npm|yarn|pnpm|touch|echo|cp|mv)\s+(.+)$/gm;
  return Array.from(content.matchAll(commandRegex)).map(match => ({
    type: match[1],
    args: match[2],
    original: match[0]
  }));
}
```

#### Phase 2: File Content Management (Day 2, 4 hours)

##### Step 4: File Content vs Empty File Logic (2 hours)
**Problem**: Need to handle both file content inclusion and empty file creation

```typescript
interface FileInstruction {
  path: string;
  type: 'content' | 'empty' | 'template';
  content?: string;
  templatePath?: string;
}

async processFileInstructions(instructions: FileInstruction[], variables: ScaffoldVariables): Promise<GeneratedFile[]> {
  return Promise.all(instructions.map(async (instruction) => {
    switch (instruction.type) {
      case 'content':
        // Include actual file content (package.json, tsconfig.json, etc.)
        return this.createFileWithContent(instruction.path, instruction.content, variables);
      
      case 'empty':
        // Create empty placeholder file
        return this.createEmptyFile(instruction.path);
      
      case 'template':
        // Load content from template file
        const templateContent = await this.loadTemplate(instruction.templatePath);
        return this.createFileWithContent(instruction.path, templateContent, variables);
    }
  }));
}
```

**Example File Instructions**:
```typescript
const fileInstructions: FileInstruction[] = [
  // Package.json with actual content
  {
    path: 'package.json',
    type: 'content',
    content: JSON.stringify(packageJsonTemplate, null, 2)
  },
  
  // Empty component files
  {
    path: 'src/components/Button.tsx',
    type: 'empty'
  },
  
  // Config from template
  {
    path: 'tsconfig.json',
    type: 'template',
    templatePath: 'configs/tsconfig.react.json'
  }
];
```

##### Step 5: Package Manager Integration (2 hours)
```typescript
// Generate package manager specific commands
generatePackageManagerCommands(packageManager: PackageManager, dependencies: string[]): PlatformCommands {
  const commands = {
    npm: {
      install: 'npm install',
      addDev: `npm install --save-dev ${dependencies.join(' ')}`,
      run: 'npm run',
      create: 'npm create'
    },
    yarn: {
      install: 'yarn install',
      addDev: `yarn add --dev ${dependencies.join(' ')}`,
      run: 'yarn',
      create: 'yarn create'
    },
    pnpm: {
      install: 'pnpm install',
      addDev: `pnpm add --save-dev ${dependencies.join(' ')}`,
      run: 'pnpm run',
      create: 'pnpm create'
    }
  };
  
  return commands[packageManager];
}
```

#### Phase 3: Framework-Specific Logic (Day 3, 6 hours)

##### Step 6: Framework Detection Integration (2 hours)
```typescript
// Connect with Framework Detection Service for intelligent template selection
async selectOptimalTemplate(projectPath: string, userPreferences: UserPreferences): Promise<ExampleTemplate> {
  // Analyze existing project structure
  const detectionResult = await this.frameworkDetectionService.detectFrameworks(projectPath);
  
  // Find matching templates
  const availableTemplates = await this.exampleService.listScriptExamples();
  const matchingTemplates = this.filterTemplatesByFramework(availableTemplates, detectionResult);
  
  // Score templates by compatibility
  return this.selectBestTemplate(matchingTemplates, detectionResult, userPreferences);
}

private selectBestTemplate(templates: ExampleTemplate[], detection: FrameworkDetectionResult, preferences: UserPreferences): ExampleTemplate {
  return templates
    .map(template => ({
      template,
      score: this.calculateCompatibilityScore(template, detection, preferences)
    }))
    .sort((a, b) => b.score - a.score)[0]?.template || templates[0];
}
```

##### Step 7: Complex Project Structure Handling (2 hours)
```typescript
// Handle complex directory structures and nested projects
async generateComplexStructure(structure: ProjectStructure, variables: ScaffoldVariables): Promise<StructureInstructions> {
  const instructions: StructureInstructions = {
    directories: [],
    files: [],
    commands: []
  };
  
  // Process nested directories
  for (const dir of structure.directories) {
    instructions.directories.push(this.generateDirectoryInstruction(dir, variables));
    
    // Handle subdirectories recursively
    if (dir.children) {
      const childInstructions = await this.generateComplexStructure(dir.children, variables);
      instructions.directories.push(...childInstructions.directories);
      instructions.files.push(...childInstructions.files);
    }
  }
  
  return instructions;
}
```

##### Step 8: Error Handling and Validation (2 hours)
```typescript
// Comprehensive error handling and script validation
async validateGeneratedScript(script: GeneratedScript): Promise<ValidationResult> {
  const validationResults: ValidationResult = {
    syntax: await this.validateSyntax(script),
    dependencies: await this.validateDependencies(script),
    paths: await this.validatePaths(script),
    permissions: await this.validatePermissions(script),
    crossPlatform: await this.validateCrossPlatformCompatibility(script)
  };
  
  return validationResults;
}

private async validateSyntax(script: GeneratedScript): Promise<SyntaxValidation> {
  switch (script.format) {
    case '.ps1':
      return this.validatePowerShellSyntax(script.content);
    case '.sh':
    case '.bash':
      return this.validateBashSyntax(script.content);
    case '.py':
      return this.validatePythonSyntax(script.content);
    // ... other formats
  }
}
```

#### Phase 4: Integration & Testing (Day 4, 8 hours)

##### Step 9: Example Management Service Integration (2 hours)
```typescript
// Integration with Example Management Service
async loadExampleTemplate(templateId: string): Promise<ExampleTemplate> {
  const exampleContent = await this.exampleService.getExampleContent(templateId);
  const exampleMetadata = await this.exampleService.getExampleMetadata(templateId);
  
  return {
    id: templateId,
    content: exampleContent,
    metadata: exampleMetadata,
    variables: this.extractTemplateVariables(exampleContent)
  };
}

private extractTemplateVariables(content: string): TemplateVariable[] {
  // Extract {{variableName}} patterns and infer types
  const variableRegex = /\{\{(\w+)\}\}/g;
  const variables = new Set<string>();
  
  let match;
  while ((match = variableRegex.exec(content)) !== null) {
    variables.add(match[1]);
  }
  
  return Array.from(variables).map(name => ({
    name,
    type: this.inferVariableType(name),
    required: true,
    description: this.generateVariableDescription(name)
  }));
}
```

##### Step 10: API Route Integration (1 hour)
```typescript
// src/routes/scaffoldGenerator.ts updates
router.post('/generate', async (req, res) => {
  try {
    const { templateId, variables, options } = req.body;
    
    // Load template from examples
    const template = await scaffoldService.loadExampleTemplate(templateId);
    
    // Generate all platform versions
    const generatedScripts = await scaffoldService.generateAllPlatformVersions(template, variables);
    
    // Validate generated scripts
    const validationResults = await Promise.all(
      generatedScripts.map(script => scaffoldService.validateGeneratedScript(script))
    );
    
    res.json({
      scripts: generatedScripts,
      validation: validationResults,
      metadata: {
        templateUsed: templateId,
        generatedAt: new Date(),
        totalScripts: generatedScripts.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

##### Step 11: Comprehensive Testing (3 hours)
**Test Files to Create/Update**:
```typescript
// src/__tests__/services/ScaffoldGenerationService.test.ts
describe('ScaffoldGenerationService', () => {
  describe('Template Application', () => {
    it('should substitute all variables correctly', async () => {
      const template = { content: 'Project: {{projectName}}, Framework: {{framework}}' };
      const variables = { projectName: 'test-app', framework: 'react' };
      const result = await service.applyTemplate(template, variables);
      expect(result).toContain('Project: test-app, Framework: react');
    });
  });
  
  describe('Multi-Platform Generation', () => {
    it('should generate all 12+ script formats', async () => {
      const result = await service.generateAllPlatformVersions(baseTemplate, variables);
      expect(result).toHaveLength(14); // 12+ formats
      expect(result.map(r => r.format)).toContain('.sh', '.ps1', '.py', '.txt');
    });
  });
  
  describe('Command Translation Integration', () => {
    it('should translate commands for each platform', async () => {
      const bashScript = await service.generatePlatformVersion(template, variables, { format: '.sh' });
      const psScript = await service.generatePlatformVersion(template, variables, { format: '.ps1' });
      
      expect(bashScript.content).toContain('mkdir -p');
      expect(psScript.content).toContain('New-Item -ItemType Directory');
    });
  });
});
```

**Integration Tests**:
- End-to-end: Select template → Generate → Export → Verify scripts work
- Cross-platform: Test generated scripts on Windows, macOS, Linux
- Performance: Large project structure generation (<1s for all formats)

##### Step 12: Real Script Testing (2 hours)
```typescript
// Automated testing of generated scripts
async testGeneratedScripts(scripts: GeneratedScript[]): Promise<TestResults> {
  const testResults: TestResults = {};
  
  for (const script of scripts) {
    try {
      // Create temporary directory for testing
      const testDir = await this.createTestEnvironment();
      
      // Write script to file
      const scriptPath = path.join(testDir, `test-script${script.format}`);
      await fs.writeFile(scriptPath, script.content);
      
      // Make executable if needed
      if (script.executable) {
        await fs.chmod(scriptPath, 0o755);
      }
      
      // Execute script in test environment
      const result = await this.executeScript(scriptPath, testDir);
      
      testResults[script.format] = {
        success: result.exitCode === 0,
        output: result.stdout,
        errors: result.stderr,
        executionTime: result.duration
      };
      
      // Cleanup
      await this.cleanupTestEnvironment(testDir);
      
    } catch (error) {
      testResults[script.format] = {
        success: false,
        error: error.message
      };
    }
  }
  
  return testResults;
}
```

### Dependencies Integration
- **Example Management Service**: Load templates and examples
- **Framework Detection Service**: Intelligent template selection
- **Command Translation Service**: Platform-specific command conversion
- **Export Service**: Output generated scripts

### Detailed Requirements

- Template selection logic connected to framework detection
- Cross-platform script generation for all 115 frameworks
- Language-specific package manager integration
- Multi-format template system integration

### Acceptance Criteria

- ✅ Generate all 12+ script types simultaneously
- ✅ Scripts work with scaffold-scripts CLI
- ✅ Support both empty files and content inclusion
- ✅ Handle cross-platform compatibility automatically
- ✅ All ScaffoldGenerationService tests pass

### Dependencies

- Feature 3 (Example Management Service)
- `src/services/FrameworkDetectionService.ts` (already complete)

---

## **Feature 5: Command Translation Service Implementation**

**Estimated Time: 2-3 days**
**Current Status: No cross-platform command conversion**

### Purpose

Convert commands between different platform syntaxes to enable true cross-platform scaffold scripts.

**For cross-platform examples, see:** [PowerShell Script Example](README.md#powershell-script-example), [Bash Script Example](README.md#bash-script-example), and [Python Script Example](README.md#python-script-example)

### Command Translation Requirements

Based on the main README.md script examples, must support conversion between:

**Directory Operations:**

- PowerShell: `New-Item -ItemType Directory -Force -Path $ProjectName`
- Bash: `mkdir -p "$PROJECT_NAME"`
- Python: `os.makedirs(project_name, exist_ok=True)`
- Batch: `mkdir "%PROJECT_NAME%"`

**File Operations:**

- PowerShell: `New-Item -ItemType File -Force -Path "file.txt"`
- Bash: `touch "file.txt"`
- Python: `open("file.txt", "w").close()`

**Content Writing:**

- PowerShell: `@'\ncontent\n'@ | Out-File -FilePath "file.txt" -Encoding UTF8`
- Bash: `cat > file.txt << 'EOF'\ncontent\nEOF`
- Python: `with open("file.txt", "w") as f: f.write("content")`

**Package Manager Commands:**

- npm/yarn/pnpm variations across platforms
- Language-specific package managers (pip, cargo, composer, etc.)

**Variable Syntax:**

- PowerShell: `$ProjectName`, `$env:VARIABLE`
- Bash: `$PROJECT_NAME`, `$VARIABLE`
- Batch: `%PROJECT_NAME%`, `%VARIABLE%`
- Python: `project_name`, `os.environ['VARIABLE']`

### Files to Create

- `src/services/CommandTranslationService.ts` - Cross-platform command conversion
- `src/utils/commandTranslation.ts` - Cross-platform command conversion
- `src/__tests__/services/CommandTranslationService.test.ts` - Create tests

### Implementation Steps

#### Phase 1: Core Command Translation Engine (Day 1, 6 hours)

##### Step 1: Build Command Parser and Tokenizer (2 hours)
**Current Issue**: No command parsing or translation logic exists

**Files to Create**:
```typescript
// src/services/CommandTranslationService.ts
interface Command {
  type: CommandType;
  operation: string;
  arguments: string[];
  options: Record<string, any>;
  originalString: string;
}

class CommandParser {
  parseCommand(commandString: string): Command {
    // Parse command into structured format
    const tokens = this.tokenize(commandString);
    return {
      type: this.identifyCommandType(tokens[0]),
      operation: tokens[0],
      arguments: tokens.slice(1).filter(t => !t.startsWith('-')),
      options: this.parseOptions(tokens),
      originalString: commandString
    };
  }
  
  private tokenize(command: string): string[] {
    // Handle quoted arguments, escaped spaces, etc.
    return command.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
  }
  
  private identifyCommandType(operation: string): CommandType {
    const commandMap: Record<string, CommandType> = {
      'mkdir': 'directory',
      'cd': 'navigation',
      'npm': 'package-manager',
      'yarn': 'package-manager',
      'pnpm': 'package-manager',
      'touch': 'file-operation',
      'echo': 'output',
      'cp': 'file-operation',
      'mv': 'file-operation',
      'rm': 'file-operation'
    };
    
    return commandMap[operation] || 'unknown';
  }
}
```

##### Step 2: Platform-Specific Translation Maps (2 hours)
```typescript
interface PlatformTranslation {
  operation: string;
  syntax: string;
  argumentMapping: Record<string, string>;
  variableSyntax: string;
  pathSeparator: string;
  lineEnding: string;
  commentPrefix: string;
}

const PLATFORM_TRANSLATIONS: Record<string, Record<CommandType, PlatformTranslation[]>> = {
  windows: {
    'directory': [
      {
        operation: 'mkdir',
        syntax: 'New-Item -ItemType Directory -Force -Path {{path}}',
        argumentMapping: { recursive: '-Force', parents: '-Force' },
        variableSyntax: '${{name}}',
        pathSeparator: '\\',
        lineEnding: '\r\n',
        commentPrefix: '#'
      },
      {
        operation: 'mkdir',
        syntax: 'mkdir {{path}}',
        argumentMapping: {},
        variableSyntax: '%{{name}}%',
        pathSeparator: '\\',
        lineEnding: '\r\n',
        commentPrefix: 'REM'
      }
    ],
    'file-operation': [
      {
        operation: 'touch',
        syntax: 'New-Item -ItemType File -Force -Path {{path}}',
        argumentMapping: {},
        variableSyntax: '${{name}}',
        pathSeparator: '\\',
        lineEnding: '\r\n',
        commentPrefix: '#'
      }
    ]
  },
  unix: {
    'directory': [
      {
        operation: 'mkdir',
        syntax: 'mkdir -p {{path}}',
        argumentMapping: { recursive: '-p', parents: '-p' },
        variableSyntax: '${{name}}',
        pathSeparator: '/',
        lineEnding: '\n',
        commentPrefix: '#'
      }
    ],
    'file-operation': [
      {
        operation: 'touch',
        syntax: 'touch {{path}}',
        argumentMapping: {},
        variableSyntax: '${{name}}',
        pathSeparator: '/',
        lineEnding: '\n',
        commentPrefix: '#'
      }
    ]
  }
};
```

##### Step 3: Variable and Path Translation (1 hour)
```typescript
class VariableTranslator {
  translateVariables(content: string, targetPlatform: TargetPlatform): string {
    // Convert variable syntax between platforms
    const variableRegex = /\$\{(\w+)\}/g;
    
    return content.replace(variableRegex, (match, varName) => {
      switch (targetPlatform.shell) {
        case 'powershell':
          return `$${varName}`;
        case 'batch':
        case 'cmd':
          return `%${varName}%`;
        case 'bash':
        case 'zsh':
        case 'fish':
          return `$${varName}`;
        case 'python':
          return `{${varName}}`;
        default:
          return match;
      }
    });
  }
  
  translatePaths(content: string, targetPlatform: TargetPlatform): string {
    const pathSeparator = targetPlatform.pathSeparator;
    
    // Convert path separators
    if (pathSeparator === '\\') {
      return content.replace(/\//g, '\\');
    } else {
      return content.replace(/\\/g, '/');
    }
  }
}
```

##### Step 4: Advanced Command Translation Logic (1 hour)
```typescript
async translateCommand(command: Command, targetPlatform: TargetPlatform): Promise<TranslationResult> {
  const platformTranslations = PLATFORM_TRANSLATIONS[targetPlatform.type];
  const commandTranslations = platformTranslations[command.type];
  
  if (!commandTranslations) {
    return {
      success: false,
      error: `No translation available for command type: ${command.type}`,
      unsupportedReason: 'UNSUPPORTED_COMMAND_TYPE'
    };
  }
  
  // Find best translation for target shell
  const translation = this.selectBestTranslation(commandTranslations, targetPlatform);
  
  if (!translation) {
    return {
      success: false,
      error: `No translation available for shell: ${targetPlatform.shell}`,
      unsupportedReason: 'UNSUPPORTED_SHELL'
    };
  }
  
  // Apply translation
  const translatedCommand = this.applyTranslation(command, translation, targetPlatform);
  
  return {
    success: true,
    translatedCommand,
    confidence: this.calculateTranslationConfidence(command, translation),
    warnings: this.generateWarnings(command, translation, targetPlatform)
  };
}

private applyTranslation(command: Command, translation: PlatformTranslation, platform: TargetPlatform): string {
  let result = translation.syntax;
  
  // Replace path placeholders
  command.arguments.forEach((arg, index) => {
    const placeholder = `{{path}}`;
    if (result.includes(placeholder)) {
      const translatedPath = this.variableTranslator.translatePaths(arg, platform);
      result = result.replace(placeholder, translatedPath);
    }
  });
  
  // Apply variable syntax
  result = this.variableTranslator.translateVariables(result, platform);
  
  return result;
}
```

#### Phase 2: Package Manager Translation (Day 2, 4 hours)

##### Step 5: Package Manager Command Translation (2 hours)
```typescript
// Handle npm, yarn, pnpm command translation
class PackageManagerTranslator {
  translatePackageCommand(command: Command, targetPlatform: TargetPlatform): TranslationResult {
    const packageManager = command.operation; // npm, yarn, pnpm
    const subcommand = command.arguments[0]; // install, run, create, etc.
    
    const translations = this.getPackageManagerTranslations(packageManager, subcommand, targetPlatform);
    
    switch (subcommand) {
      case 'install':
        return this.translateInstallCommand(command, targetPlatform, translations);
      case 'run':
        return this.translateRunCommand(command, targetPlatform, translations);
      case 'create':
        return this.translateCreateCommand(command, targetPlatform, translations);
      default:
        return this.translateGenericPackageCommand(command, targetPlatform, translations);
    }
  }
  
  private translateInstallCommand(command: Command, platform: TargetPlatform, translations: any): TranslationResult {
    const packages = command.arguments.slice(1);
    const hasDevFlag = command.options['save-dev'] || command.options['D'];
    
    let translatedCommand = `${translations.baseCommand} ${translations.installSubcommand}`;
    
    if (packages.length > 0) {
      translatedCommand += ` ${packages.join(' ')}`;
    }
    
    if (hasDevFlag) {
      translatedCommand += ` ${translations.devFlag}`;
    }
    
    return {
      success: true,
      translatedCommand,
      confidence: 0.95,
      warnings: []
    };
  }
  
  private getPackageManagerTranslations(pm: string, subcommand: string, platform: TargetPlatform) {
    const translations = {
      npm: {
        baseCommand: 'npm',
        installSubcommand: 'install',
        devFlag: '--save-dev',
        runCommand: 'npm run',
        createCommand: 'npm create'
      },
      yarn: {
        baseCommand: 'yarn',
        installSubcommand: 'add',
        devFlag: '--dev',
        runCommand: 'yarn',
        createCommand: 'yarn create'
      },
      pnpm: {
        baseCommand: 'pnpm',
        installSubcommand: 'add',
        devFlag: '--save-dev',
        runCommand: 'pnpm run',
        createCommand: 'pnpm create'
      }
    };
    
    return translations[pm] || translations.npm;
  }
}
```

##### Step 6: Build Tool Command Translation (2 hours)
```typescript
// Handle webpack, vite, rollup, etc.
class BuildToolTranslator {
  translateBuildCommand(command: Command, targetPlatform: TargetPlatform): TranslationResult {
    const buildTool = this.detectBuildTool(command);
    
    switch (buildTool) {
      case 'webpack':
        return this.translateWebpackCommand(command, targetPlatform);
      case 'vite':
        return this.translateViteCommand(command, targetPlatform);
      case 'rollup':
        return this.translateRollupCommand(command, targetPlatform);
      default:
        return this.translateGenericBuildCommand(command, targetPlatform);
    }
  }
  
  private translateViteCommand(command: Command, platform: TargetPlatform): TranslationResult {
    const viteCommands = {
      'dev': 'vite',
      'build': 'vite build',
      'preview': 'vite preview',
      'serve': 'vite --host'
    };
    
    const subcommand = command.arguments[0] || 'dev';
    const translatedCommand = viteCommands[subcommand] || `vite ${subcommand}`;
    
    return {
      success: true,
      translatedCommand,
      confidence: 0.9,
      warnings: subcommand in viteCommands ? [] : [`Unknown vite subcommand: ${subcommand}`]
    };
  }
}
```

#### Phase 3: Error Handling and Edge Cases (Day 3, 4 hours)

##### Step 7: Unsupported Command Handling (2 hours)
```typescript
class UnsupportedCommandHandler {
  handleUnsupportedCommand(command: Command, targetPlatform: TargetPlatform): TranslationResult {
    const alternatives = this.findAlternatives(command, targetPlatform);
    const fallbackOptions = this.generateFallbacks(command, targetPlatform);
    
    return {
      success: false,
      error: `Command '${command.operation}' is not supported on ${targetPlatform.type}`,
      unsupportedReason: 'PLATFORM_INCOMPATIBLE',
      alternatives,
      fallbackOptions,
      suggestions: this.generateSuggestions(command, targetPlatform)
    };
  }
  
  private findAlternatives(command: Command, platform: TargetPlatform): Alternative[] {
    // Find similar commands that work on target platform
    const alternatives: Alternative[] = [];
    
    if (command.operation === 'grep' && platform.type === 'windows') {
      alternatives.push({
        command: 'Select-String',
        description: 'PowerShell equivalent to grep',
        confidence: 0.8,
        example: `Select-String -Pattern "${command.arguments[0]}" -Path "${command.arguments[1]}"`
      });
    }
    
    if (command.operation === 'curl' && platform.type === 'windows') {
      alternatives.push({
        command: 'Invoke-WebRequest',
        description: 'PowerShell web request command',
        confidence: 0.9,
        example: `Invoke-WebRequest -Uri "${command.arguments[0]}"`
      });
    }
    
    return alternatives;
  }
  
  private generateFallbacks(command: Command, platform: TargetPlatform): FallbackOption[] {
    return [
      {
        type: 'manual',
        description: `Manual alternative for ${command.operation}`,
        instructions: this.generateManualInstructions(command, platform)
      },
      {
        type: 'skip',
        description: 'Skip this command',
        impact: 'Command will be omitted from generated script'
      },
      {
        type: 'comment',
        description: 'Include as comment for manual execution',
        example: `${platform.commentPrefix} Original command: ${command.originalString}`
      }
    ];
  }
}
```

##### Step 8: Cross-Platform Compatibility Validation (2 hours)
```typescript
class CompatibilityValidator {
  validateTranslation(original: Command, translated: string, platform: TargetPlatform): ValidationResult {
    const validationResults = {
      syntaxValid: this.validateSyntax(translated, platform),
      semanticEquivalent: this.validateSemantics(original, translated, platform),
      securitySafe: this.validateSecurity(translated, platform),
      performanceOptimal: this.validatePerformance(translated, platform)
    };
    
    return {
      overall: Object.values(validationResults).every(v => v.valid),
      details: validationResults,
      warnings: this.collectWarnings(validationResults),
      recommendations: this.generateRecommendations(validationResults, platform)
    };
  }
  
  private validateSyntax(command: string, platform: TargetPlatform): SyntaxValidation {
    switch (platform.shell) {
      case 'powershell':
        return this.validatePowerShellSyntax(command);
      case 'bash':
        return this.validateBashSyntax(command);
      case 'python':
        return this.validatePythonSyntax(command);
      default:
        return { valid: true, warnings: ['Syntax validation not available for this platform'] };
    }
  }
  
  private validatePowerShellSyntax(command: string): SyntaxValidation {
    // Basic PowerShell syntax validation
    const issues: string[] = [];
    
    // Check for common PowerShell syntax patterns
    if (command.includes('-') && !command.match(/-\w+/)) {
      issues.push('Invalid parameter syntax');
    }
    
    if (command.includes('$') && !command.match(/\$\w+/)) {
      issues.push('Invalid variable syntax');
    }
    
    return {
      valid: issues.length === 0,
      warnings: issues
    };
  }
}
```

#### Phase 4: Integration and Testing (Day 4, 8 hours)

##### Step 9: Batch Translation API (2 hours)
```typescript
// Main service API for batch command translation
class CommandTranslationService {
  async translateBatch(commands: Command[], targetPlatform: TargetPlatform): Promise<BatchTranslationResult> {
    const results: TranslationResult[] = [];
    const errors: TranslationError[] = [];
    const unsupportedCommands: Command[] = [];
    
    for (const command of commands) {
      try {
        const result = await this.translateCommand(command, targetPlatform);
        
        if (result.success) {
          results.push(result);
        } else {
          unsupportedCommands.push(command);
          errors.push({
            command: command.originalString,
            error: result.error,
            alternatives: result.alternatives
          });
        }
      } catch (error) {
        errors.push({
          command: command.originalString,
          error: `Translation failed: ${error.message}`,
          alternatives: []
        });
      }
    }
    
    return {
      translatedCommands: results.map(r => r.translatedCommand),
      errors,
      unsupportedCommands,
      successRate: results.length / commands.length,
      warnings: results.flatMap(r => r.warnings || []),
      metadata: {
        totalCommands: commands.length,
        successful: results.length,
        failed: errors.length,
        targetPlatform: targetPlatform.type
      }
    };
  }
}
```

##### Step 10: Integration with Scaffold Generation Service (2 hours)
```typescript
// Integration points with other services
// src/services/ScaffoldGenerationService.ts
async generatePlatformSpecificScript(template: string, platform: TargetPlatform): Promise<string> {
  // Extract commands from template
  const commands = await this.extractCommands(template);
  
  // Translate commands to target platform
  const translationResult = await this.commandTranslationService.translateBatch(commands, platform);
  
  // Replace commands in template
  let processedTemplate = template;
  commands.forEach((original, index) => {
    const translated = translationResult.translatedCommands[index];
    if (translated) {
      processedTemplate = processedTemplate.replace(original.originalString, translated);
    }
  });
  
  // Handle any unsupported commands
  if (translationResult.unsupportedCommands.length > 0) {
    processedTemplate += this.generateUnsupportedCommandsSection(
      translationResult.unsupportedCommands, 
      platform
    );
  }
  
  return processedTemplate;
}

private generateUnsupportedCommandsSection(unsupported: Command[], platform: TargetPlatform): string {
  const commentPrefix = platform.commentPrefix;
  
  let section = `\n${commentPrefix} The following commands could not be automatically translated:\n`;
  
  unsupported.forEach(cmd => {
    section += `${commentPrefix} ${cmd.originalString}\n`;
    section += `${commentPrefix} Please implement manually or find platform-specific alternative\n\n`;
  });
  
  return section;
}
```

##### Step 11: Comprehensive Testing (3 hours)
```typescript
// src/__tests__/services/CommandTranslationService.test.ts
describe('CommandTranslationService', () => {
  describe('Basic Command Translation', () => {
    it('should translate mkdir command to PowerShell', async () => {
      const command = parser.parseCommand('mkdir -p src/components');
      const result = await service.translateCommand(command, { type: 'windows', shell: 'powershell' });
      
      expect(result.success).toBe(true);
      expect(result.translatedCommand).toContain('New-Item -ItemType Directory');
      expect(result.translatedCommand).toContain('src\\components');
    });
    
    it('should translate npm commands correctly', async () => {
      const command = parser.parseCommand('npm install --save-dev typescript');
      const result = await service.translateCommand(command, { type: 'unix', shell: 'bash' });
      
      expect(result.success).toBe(true);
      expect(result.translatedCommand).toBe('npm install --save-dev typescript');
    });
  });
  
  describe('Variable Translation', () => {
    it('should convert variable syntax between platforms', () => {
      const bashVar = '$PROJECT_NAME';
      const psVar = variableTranslator.translateVariables(bashVar, { shell: 'powershell' });
      const batchVar = variableTranslator.translateVariables(bashVar, { shell: 'batch' });
      
      expect(psVar).toBe('$PROJECT_NAME');
      expect(batchVar).toBe('%PROJECT_NAME%');
    });
  });
  
  describe('Error Handling', () => {
    it('should handle unsupported commands gracefully', async () => {
      const command = parser.parseCommand('grep "pattern" file.txt');
      const result = await service.translateCommand(command, { type: 'windows', shell: 'batch' });
      
      expect(result.success).toBe(false);
      expect(result.alternatives).toBeDefined();
      expect(result.alternatives.length).toBeGreaterThan(0);
    });
  });
  
  describe('Batch Translation', () => {
    it('should translate multiple commands maintaining order', async () => {
      const commands = [
        'mkdir src',
        'cd src',
        'npm install'
      ].map(cmd => parser.parseCommand(cmd));
      
      const result = await service.translateBatch(commands, { type: 'windows', shell: 'powershell' });
      
      expect(result.translatedCommands).toHaveLength(3);
      expect(result.successRate).toBeGreaterThan(0.8);
    });
  });
});
```

##### Step 12: Performance Optimization and Caching (1 hour)
```typescript
// Performance optimization with caching
class CommandTranslationCache {
  private cache = new Map<string, TranslationResult>();
  
  getCacheKey(command: Command, platform: TargetPlatform): string {
    return `${command.type}:${command.originalString}:${platform.type}:${platform.shell}`;
  }
  
  get(command: Command, platform: TargetPlatform): TranslationResult | undefined {
    return this.cache.get(this.getCacheKey(command, platform));
  }
  
  set(command: Command, platform: TargetPlatform, result: TranslationResult): void {
    this.cache.set(this.getCacheKey(command, platform), result);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

// Integration in main service
async translateCommand(command: Command, platform: TargetPlatform): Promise<TranslationResult> {
  // Check cache first
  const cached = this.cache.get(command, platform);
  if (cached) {
    return cached;
  }
  
  // Perform translation
  const result = await this.performTranslation(command, platform);
  
  // Cache result
  this.cache.set(command, platform, result);
  
  return result;
}
```

### Dependencies Integration
- **Scaffold Generation Service**: Provides commands to translate
- **Export Service**: Uses translated commands in generated scripts
- **Example Management Service**: May contain platform-specific command examples

### Detailed Requirements

#### Basic Command Translation

- **Directory Operations**: mkdir, rmdir, cd
- **File Operations**: touch, copy, move, delete
- **Content Operations**: echo, cat, grep
- **Permission Operations**: chmod, attrib

#### Platform-Specific Syntax

- **Variables**: $var (Unix) vs %var% (Batch) vs $env:var (PowerShell)
- **Path Separators**: / vs \\
- **Command Chaining**: && vs ; vs |
- **Error Handling**: set -e vs $ErrorActionPreference

#### Advanced Features

- **Package Managers**: npm vs yarn vs pnpm
- **Build Tools**: make vs msbuild vs gradle
- **System Commands**: ps vs Get-Process vs tasklist
- **Network Commands**: curl vs Invoke-WebRequest vs wget

### Acceptance Criteria

- ✅ Convert basic file operations between platforms
- ✅ Handle variable syntax differences
- ✅ Support path separator conversion
- ✅ Graceful handling of unsupported commands
- ✅ All CommandTranslationService tests pass

### Dependencies

- Feature 4 (Scaffold Generation Service)

---

## **Feature 6: Python Framework Detection**

**Estimated Time: 2-3 weeks**
**Current Status: ✅ COMPLETE - Already implemented**

### Purpose

Detect Python projects and frameworks (Django, Flask, FastAPI).

### Files Already Created

- `src/services/PythonFrameworkDetector.ts` ✅
- `src/types/pythonFramework.ts` ✅
- `src/data/pythonFrameworks.json` ✅
- `src/__tests__/services/PythonFrameworkDetector.test.ts` ✅

### Implementation Completed

1. Parse requirements.txt, pyproject.toml, setup.py ✅
2. Detect Django (manage.py, settings.py, django dependencies) ✅
3. Detect Flask (app.py, Flask dependencies) ✅
4. Detect FastAPI (main.py, FastAPI dependencies) ✅
5. Detect Poetry, Pipenv, virtualenv configurations ✅
6. Support for 15+ Python frameworks and tools ✅

### Status: ✅ COMPLETE

---

## **Feature 7: Rust Framework Detection**

**Estimated Time: 2-3 weeks**
**Current Status: ✅ COMPLETE - Already implemented**

### Purpose

Detect Rust projects and frameworks (Actix, Rocket, Axum).

### Files Already Created

- `src/services/RustFrameworkDetector.ts` ✅
- `src/types/rustFramework.ts` ✅
- `src/data/rustFrameworks.json` ✅
- `src/__tests__/services/RustFrameworkDetector.test.ts` ✅

### Implementation Completed

1. Parse Cargo.toml for dependencies and project structure ✅
2. Detect Actix Web (actix-web dependencies) ✅
3. Detect Rocket (rocket dependencies) ✅
4. Detect Axum (axum dependencies) ✅
5. Detect workspace configurations ✅
6. Support for 10+ Rust frameworks ✅

### Status: ✅ COMPLETE

---

## **Feature 8: .NET Framework Detection**

**Estimated Time: 2-3 weeks**
**Current Status: ✅ COMPLETE - Already implemented**

### Purpose

Detect .NET projects and frameworks (ASP.NET Core, Blazor).

### Files Already Created

- `src/services/DotNetFrameworkDetector.ts` ✅
- `src/types/dotnetFramework.ts` ✅
- `src/data/dotnetFrameworks.json` ✅
- `src/__tests__/services/DotNetFrameworkDetector.test.ts` ✅

### Implementation Completed

1. Parse .csproj, .sln, Directory.Build.props files ✅
2. Detect ASP.NET Core (Microsoft.AspNetCore dependencies) ✅
3. Detect Blazor (Blazor dependencies) ✅
4. Detect MAUI (Microsoft.Maui dependencies) ✅
5. Detect Entity Framework configurations ✅
6. Support for 15+ .NET frameworks ✅

### Status: ✅ COMPLETE

---

## **Feature 9: Go Framework Detection**

**Estimated Time: 2-3 weeks**
**Current Status: ✅ COMPLETE - Already implemented**

### Purpose

Detect Go projects and frameworks (Gin, Echo, Fiber).

### Files Already Created

- `src/services/GoFrameworkDetector.ts` ✅
- `src/types/goFramework.ts` ✅
- `src/data/goFrameworks.json` ✅
- `src/__tests__/services/GoFrameworkDetector.test.ts` ✅

### Implementation Completed

1. Parse go.mod files for dependencies ✅
2. Detect Gin (gin-gonic/gin) ✅
3. Detect Echo (labstack/echo) ✅
4. Detect Fiber (gofiber/fiber) ✅
5. Detect Go module workspace configurations ✅
6. Support for 10+ Go frameworks ✅

### Status: ✅ COMPLETE

---

## **Feature 10: Java Framework Detection**

**Estimated Time: 3-4 weeks**
**Current Status: ✅ COMPLETE - Already implemented**

### Purpose

Detect Java projects and frameworks (Spring Boot, Quarkus).

### Files Already Created

- `src/services/JavaFrameworkDetector.ts` ✅
- `src/types/javaFramework.ts` ✅
- `src/data/javaFrameworks.json` ✅
- `src/__tests__/services/JavaFrameworkDetector.test.ts` ✅

### Implementation Completed

1. Parse pom.xml (Maven) and build.gradle (Gradle) ✅
2. Detect Spring Boot (spring-boot dependencies) ✅
3. Detect Quarkus (quarkus dependencies) ✅
4. Detect Micronaut (micronaut dependencies) ✅
5. Detect multi-module project structures ✅
6. Support for 15+ Java frameworks ✅

### Status: ✅ COMPLETE

---

## **Feature 11: Task Generator Routes**

**Estimated Time: 2 days**
**Current Status: Route definitions exist, endpoints return stubs**

### Purpose

Replace stub implementations with real service calls for task generation API.

### Files to Update

- `src/routes/taskGenerator.ts` - Replace stub implementations with real service calls
- `src/__tests__/routes/taskGenerator.test.ts` - Update for real service integration

### Implementation Steps

#### Phase 1: Route Handler Implementation (Day 1, 4 hours)

##### Step 1: Update POST /analyze endpoint (1 hour)
**Current Issue**: Returns stub response, needs real implementation

**File to Update**: `src/routes/taskGenerator.ts`
```typescript
// Current: 
router.post('/analyze', (req, res) => {
  res.json({ stub: true, message: 'Task analysis endpoint not implemented' });
});

// Replace with:
router.post('/analyze', async (req, res) => {
  try {
    const { directoryPath, customInstructions } = req.body;
    
    // Validate input
    if (!directoryPath) {
      return res.status(400).json({ error: 'Directory path is required' });
    }
    
    // Use File Analysis Service to scan directory
    const fileAnalysisResults = await fileAnalysisService.analyzeDirectory(directoryPath);
    
    // Use Framework Detection Service to identify technologies
    const frameworkResults = await frameworkDetectionService.detectFrameworks(directoryPath);
    
    // Calculate task breakdown
    const taskBreakdown = await taskGenerationService.calculateTaskBreakdown(
      fileAnalysisResults, 
      frameworkResults, 
      customInstructions
    );
    
    res.json({
      directoryPath,
      analysis: {
        totalFiles: fileAnalysisResults.totalFiles,
        totalSize: fileAnalysisResults.totalSize,
        fileTypes: fileAnalysisResults.fileTypes,
        frameworks: frameworkResults.frameworks,
        suggestedTasks: taskBreakdown.suggestedTasks,
        estimatedTaskCount: taskBreakdown.estimatedTaskCount
      },
      recommendations: {
        customInstructions: taskBreakdown.recommendedInstructions,
        excludePatterns: taskBreakdown.recommendedExcludes,
        splitStrategy: taskBreakdown.splitStrategy
      }
    });
  } catch (error) {
    console.error('Task analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze directory', 
      details: error.message 
    });
  }
});
```

##### Step 2: Update POST /generate endpoint (1.5 hours)
**Current Issue**: Basic implementation exists but needs enhancement

**Implementation**:
```typescript
router.post('/generate', async (req, res) => {
  try {
    const { 
      directoryPath, 
      customInstructions, 
      excludePatterns = [],
      maxTaskSize = 50,
      splitByDirectory = true 
    } = req.body;
    
    // Validate required fields
    const validationErrors = [];
    if (!directoryPath) validationErrors.push('directoryPath is required');
    if (!customInstructions) validationErrors.push('customInstructions is required');
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }
    
    // Generate tasks using Task Generation Service
    const generationOptions = {
      directoryPath,
      customInstructions,
      excludePatterns,
      maxTaskSize,
      splitByDirectory
    };
    
    const taskResults = await taskGenerationService.generateTasks(generationOptions);
    
    // Store generation results for potential export
    const sessionId = crypto.randomUUID();
    await taskGenerationService.storeGenerationResults(sessionId, taskResults);
    
    res.json({
      sessionId,
      tasks: taskResults.tasks.map(task => ({
        id: task.id,
        filename: task.filename,
        title: task.title,
        fileCount: task.metadata.fileCount,
        totalSize: task.metadata.totalSize
      })),
      summary: taskResults.summary,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Task generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate tasks', 
      details: error.message 
    });
  }
});
```

##### Step 3: Update POST /export endpoint (1 hour)
**Current Issue**: Basic structure exists, needs export service integration

**Implementation**:
```typescript
router.post('/export', async (req, res) => {
  try {
    const { sessionId, taskIds, format = 'markdown' } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    // Retrieve stored generation results
    const storedResults = await taskGenerationService.getStoredResults(sessionId);
    if (!storedResults) {
      return res.status(404).json({ error: 'Generation session not found' });
    }
    
    // Filter tasks if specific IDs requested
    let tasksToExport = storedResults.tasks;
    if (taskIds && taskIds.length > 0) {
      tasksToExport = storedResults.tasks.filter(task => taskIds.includes(task.id));
    }
    
    // Export using Export Service
    const exportResults = await exportService.exportTasks(tasksToExport, {
      format,
      includeSummary: true,
      includeMetadata: true
    });
    
    // Log successful export
    console.log(`Exported ${tasksToExport.length} tasks for session ${sessionId}`);
    
    res.json({
      exportedFiles: exportResults.files,
      summary: {
        totalFiles: exportResults.files.length,
        totalSize: exportResults.totalSize,
        format: format
      },
      downloadLinks: exportResults.downloadLinks
    });
    
  } catch (error) {
    console.error('Task export error:', error);
    res.status(500).json({ 
      error: 'Failed to export tasks', 
      details: error.message 
    });
  }
});
```

##### Step 4: Add POST /export-single endpoint enhancement (30 minutes)
**Current Issue**: Basic implementation needs error handling and validation

**Implementation**:
```typescript
router.post('/export-single', async (req, res) => {
  try {
    const { sessionId, taskId } = req.body;
    
    if (!sessionId || !taskId) {
      return res.status(400).json({ 
        error: 'Both sessionId and taskId are required' 
      });
    }
    
    // Retrieve and find specific task
    const storedResults = await taskGenerationService.getStoredResults(sessionId);
    if (!storedResults) {
      return res.status(404).json({ error: 'Generation session not found' });
    }
    
    const task = storedResults.tasks.find(t => t.id === taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found in session' });
    }
    
    // Export single task
    const exportResult = await exportService.exportSingleTask(task);
    
    res.json({
      filename: exportResult.filename,
      content: exportResult.content,
      size: exportResult.size,
      downloadUrl: exportResult.downloadUrl
    });
    
  } catch (error) {
    console.error('Single task export error:', error);
    res.status(500).json({ 
      error: 'Failed to export task', 
      details: error.message 
    });
  }
});
```

#### Phase 2: Error Handling and Validation (Day 2, 2 hours)

##### Step 5: Add Comprehensive Input Validation (1 hour)
```typescript
// src/middleware/taskGeneratorValidation.ts
import { body, validationResult } from 'express-validator';

export const validateAnalyzeRequest = [
  body('directoryPath')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Directory path must be a non-empty string'),
  body('customInstructions')
    .optional()
    .isString()
    .isLength({ max: 10000 })
    .withMessage('Custom instructions must be a string under 10,000 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    next();
  }
];

export const validateGenerateRequest = [
  body('directoryPath')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Directory path is required'),
  body('customInstructions')
    .isString()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Custom instructions are required (max 10,000 characters)'),
  body('excludePatterns')
    .optional()
    .isArray()
    .withMessage('Exclude patterns must be an array'),
  body('maxTaskSize')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Max task size must be between 1 and 1000'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    next();
  }
];

// Apply to routes:
router.post('/analyze', validateAnalyzeRequest, async (req, res) => { /* ... */ });
router.post('/generate', validateGenerateRequest, async (req, res) => { /* ... */ });
```

##### Step 6: Add Rate Limiting and Security (1 hour)
```typescript
// src/middleware/taskGeneratorSecurity.ts
import rateLimit from 'express-rate-limit';
import path from 'path';

// Rate limiting for task generation (expensive operation)
export const taskGenerationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 task generations per 15 minutes
  message: {
    error: 'Too many task generation requests',
    details: 'Please wait 15 minutes before generating more tasks'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Path traversal prevention
export const validateDirectoryPath = (req, res, next) => {
  const { directoryPath } = req.body;
  
  if (!directoryPath) {
    return next();
  }
  
  // Prevent path traversal attacks
  const resolvedPath = path.resolve(directoryPath);
  const normalizedPath = path.normalize(directoryPath);
  
  // Check for suspicious patterns
  if (normalizedPath.includes('..') || normalizedPath.includes('~')) {
    return res.status(400).json({
      error: 'Invalid directory path',
      details: 'Path traversal attempts are not allowed'
    });
  }
  
  // Check if path exists and is accessible
  if (!fs.existsSync(resolvedPath)) {
    return res.status(400).json({
      error: 'Directory not found',
      details: 'The specified directory does not exist or is not accessible'
    });
  }
  
  req.body.directoryPath = resolvedPath;
  next();
};

// Apply to routes:
router.use(taskGenerationRateLimit);
router.use(validateDirectoryPath);
```

#### Phase 3: Testing and Integration (Day 2, 4 hours)

##### Step 7: Update Integration Tests (2 hours)
```typescript
// src/__tests__/routes/taskGenerator.test.ts
describe('Task Generator Routes', () => {
  describe('POST /analyze', () => {
    it('should analyze directory and return framework detection', async () => {
      const mockDirectoryPath = '/test/react-project';
      
      // Mock file analysis results
      jest.spyOn(fileAnalysisService, 'analyzeDirectory').mockResolvedValue({
        totalFiles: 25,
        totalSize: 1024000,
        fileTypes: ['tsx', 'ts', 'json', 'css']
      });
      
      // Mock framework detection
      jest.spyOn(frameworkDetectionService, 'detectFrameworks').mockResolvedValue({
        frameworks: { frontend: [{ name: 'react', confidence: 0.95 }] }
      });
      
      const response = await request(app)
        .post('/api/task-generator/analyze')
        .send({
          directoryPath: mockDirectoryPath,
          customInstructions: 'Focus on React components'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.analysis.frameworks.frontend).toBeDefined();
      expect(response.body.analysis.totalFiles).toBe(25);
    });
    
    it('should return 400 for missing directory path', async () => {
      const response = await request(app)
        .post('/api/task-generator/analyze')
        .send({
          customInstructions: 'Test'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Directory path is required');
    });
  });
  
  describe('POST /generate', () => {
    it('should generate tasks and return session ID', async () => {
      // Mock task generation
      jest.spyOn(taskGenerationService, 'generateTasks').mockResolvedValue({
        tasks: [
          { id: 'task-1', filename: 'task_01.0.md', title: 'Component Analysis' }
        ],
        summary: { totalFiles: 10, totalTasks: 1 }
      });
      
      const response = await request(app)
        .post('/api/task-generator/generate')
        .send({
          directoryPath: '/test/project',
          customInstructions: 'Analyze React components'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.sessionId).toBeDefined();
      expect(response.body.tasks).toHaveLength(1);
    });
  });
  
  describe('POST /export', () => {
    it('should export tasks from valid session', async () => {
      const mockSessionId = 'test-session-123';
      
      // Mock stored results
      jest.spyOn(taskGenerationService, 'getStoredResults').mockResolvedValue({
        tasks: [{ id: 'task-1', content: 'Test content' }]
      });
      
      // Mock export service
      jest.spyOn(exportService, 'exportTasks').mockResolvedValue({
        files: [{ filename: 'task_01.0.md', size: 1024 }],
        totalSize: 1024
      });
      
      const response = await request(app)
        .post('/api/task-generator/export')
        .send({
          sessionId: mockSessionId
        });
      
      expect(response.status).toBe(200);
      expect(response.body.exportedFiles).toBeDefined();
    });
  });
});
```

##### Step 8: Add Performance Monitoring (1 hour)
```typescript
// src/middleware/performanceMonitoring.ts
export const taskGenerationMetrics = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const endpoint = req.route?.path || req.path;
    
    // Log performance metrics
    console.log(`Task Generator Performance: ${endpoint} took ${duration}ms`);
    
    // Add warning for slow operations
    if (duration > 30000) { // 30 seconds
      console.warn(`Slow task generation detected: ${endpoint} took ${duration}ms`);
    }
    
    // Could integrate with monitoring service here
    // metricsService.recordDuration('task-generator', endpoint, duration);
  });
  
  next();
};

// Apply to all task generator routes
router.use(taskGenerationMetrics);
```

##### Step 9: Add Request/Response Logging (1 hour)
```typescript
// Enhanced logging for debugging and monitoring
export const taskGeneratorLogger = (req, res, next) => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  
  // Log incoming request
  console.log(`[${requestId}] Task Generator Request: ${req.method} ${req.path}`, {
    body: {
      directoryPath: req.body.directoryPath,
      customInstructions: req.body.customInstructions?.substring(0, 100) + '...',
      sessionId: req.body.sessionId
    },
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  
  // Capture original json method to log responses
  const originalJson = res.json;
  res.json = function(obj) {
    console.log(`[${requestId}] Task Generator Response: ${res.statusCode}`, {
      success: res.statusCode < 400,
      dataKeys: Object.keys(obj || {}),
      errorMessage: obj?.error
    });
    
    return originalJson.call(this, obj);
  };
  
  next();
};
```

### Dependencies Integration
- **Task Generation Service**: Core service for task creation logic
- **File Analysis Service**: Directory scanning and file analysis
- **Framework Detection Service**: Technology identification
- **Export Service**: File output and download functionality

### Acceptance Criteria

- ✅ All task generator route tests pass
- ✅ Routes integrate with real TaskGenerationService
- ✅ Export functionality working with ExportService

### Dependencies

- Feature 1 (Task Generation Service)
- Feature 2 (Export Service)

---

## **Feature 12: Scaffold Generator Routes**

**Estimated Time: 2 days**
**Current Status: Route definitions exist, many endpoints return 404**

### Purpose

Replace stub implementations with real service calls for scaffold generation API.

### Files to Update

- `src/routes/scaffoldGenerator.ts` - Replace stub implementations with real service calls
- `src/__tests__/routes/scaffoldGenerator.test.ts` - Update for real service integration

### Implementation Steps

#### Phase 1: Core Route Implementation (Day 1, 6 hours)

##### Step 1: Implement POST /analyze endpoint (1.5 hours)
**Current Issue**: Returns 404, needs full implementation

**File to Update**: `src/routes/scaffoldGenerator.ts`
```typescript
// Add new endpoint:
router.post('/analyze', async (req, res) => {
  try {
    const { directoryPath, targetFramework } = req.body;
    
    // Validate input
    if (!directoryPath) {
      return res.status(400).json({ error: 'Directory path is required' });
    }
    
    // Analyze existing project structure
    const projectAnalysis = await scaffoldGenerationService.analyzeProjectStructure(directoryPath);
    
    // Detect frameworks if not specified
    let frameworks = [];
    if (!targetFramework) {
      const detectionResult = await frameworkDetectionService.detectFrameworks(directoryPath);
      frameworks = detectionResult.frameworks;
    } else {
      frameworks = [{ name: targetFramework, confidence: 1.0 }];
    }
    
    // Find compatible scaffold examples
    const compatibleExamples = await exampleManagementService.findCompatibleExamples(frameworks);
    
    // Generate scaffold recommendations
    const recommendations = await scaffoldGenerationService.generateRecommendations(
      projectAnalysis,
      frameworks,
      compatibleExamples
    );
    
    res.json({
      projectAnalysis: {
        directoryStructure: projectAnalysis.directoryStructure,
        fileCount: projectAnalysis.fileCount,
        detectedPatterns: projectAnalysis.detectedPatterns,
        complexity: projectAnalysis.complexity
      },
      frameworks,
      recommendations: {
        suggestedExamples: recommendations.suggestedExamples,
        scaffoldStrategy: recommendations.scaffoldStrategy,
        estimatedFiles: recommendations.estimatedFiles,
        estimatedDirectories: recommendations.estimatedDirectories
      },
      compatibleExamples: compatibleExamples.map(ex => ({
        id: ex.id,
        name: ex.name,
        description: ex.description,
        compatibility: ex.compatibilityScore
      }))
    });
    
  } catch (error) {
    console.error('Scaffold analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze project for scaffolding', 
      details: error.message 
    });
  }
});
```

##### Step 2: Implement POST /preview endpoint (1.5 hours)
**Current Issue**: Returns 404, needs full implementation

**Implementation**:
```typescript
router.post('/preview', async (req, res) => {
  try {
    const { 
      exampleId, 
      projectName, 
      targetPath, 
      variables = {},
      platforms = ['windows', 'unix', 'cross-platform']
    } = req.body;
    
    // Validate required fields
    if (!exampleId || !projectName) {
      return res.status(400).json({ 
        error: 'Example ID and project name are required' 
      });
    }
    
    // Load example template
    const exampleTemplate = await exampleManagementService.getExampleContent(exampleId);
    if (!exampleTemplate) {
      return res.status(404).json({ error: 'Example template not found' });
    }
    
    // Prepare scaffold variables
    const scaffoldVariables = {
      projectName,
      targetPath: targetPath || `./${projectName}`,
      ...variables
    };
    
    // Generate preview for each requested platform
    const previews = await Promise.all(
      platforms.map(async (platform) => {
        const preview = await scaffoldGenerationService.generatePreview(
          exampleTemplate,
          scaffoldVariables,
          platform
        );
        
        return {
          platform,
          fileStructure: preview.fileStructure,
          sampleCommands: preview.sampleCommands.slice(0, 5), // First 5 commands
          estimatedDuration: preview.estimatedDuration,
          warnings: preview.warnings
        };
      })
    );
    
    // Calculate summary statistics
    const summary = {
      totalFiles: previews[0]?.fileStructure?.files?.length || 0,
      totalDirectories: previews[0]?.fileStructure?.directories?.length || 0,
      supportedPlatforms: platforms,
      variablesUsed: Object.keys(scaffoldVariables)
    };
    
    res.json({
      exampleId,
      projectName,
      previews,
      summary,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Scaffold preview error:', error);
    res.status(500).json({ 
      error: 'Failed to generate scaffold preview', 
      details: error.message 
    });
  }
});
```

##### Step 3: Update POST /generate endpoint (2 hours)
**Current Issue**: Basic implementation exists, needs enhancement for all 12+ formats

**Enhanced Implementation**:
```typescript
router.post('/generate', async (req, res) => {
  try {
    const {
      exampleId,
      projectName,
      targetPath,
      variables = {},
      platforms = ['all'], // 'all' or specific platforms
      includeDocumentation = true,
      customCommands = []
    } = req.body;
    
    // Validate input
    if (!exampleId || !projectName) {
      return res.status(400).json({ 
        error: 'Example ID and project name are required' 
      });
    }
    
    // Load example template
    const exampleTemplate = await exampleManagementService.getExampleContent(exampleId);
    if (!exampleTemplate) {
      return res.status(404).json({ error: 'Example template not found' });
    }
    
    // Prepare scaffold variables
    const scaffoldVariables = {
      projectName,
      targetPath: targetPath || `./${projectName}`,
      timestamp: new Date().toISOString(),
      ...variables
    };
    
    // Determine target platforms
    let targetPlatforms = platforms;
    if (platforms.includes('all')) {
      targetPlatforms = ['windows', 'unix', 'cross-platform'];
    }
    
    // Generate scripts for all formats
    const generationResults = await scaffoldGenerationService.generateAllFormats(
      exampleTemplate,
      scaffoldVariables,
      targetPlatforms,
      {
        includeDocumentation,
        customCommands,
        validateSyntax: true
      }
    );
    
    // Store generation results for export
    const sessionId = crypto.randomUUID();
    await scaffoldGenerationService.storeGenerationResults(sessionId, generationResults);
    
    // Prepare response with script summaries (not full content)
    const scriptSummaries = generationResults.scripts.map(script => ({
      format: script.format,
      platform: script.platform,
      filename: script.filename,
      size: script.content.length,
      lineCount: script.content.split('\n').length,
      hasErrors: script.validationErrors.length > 0,
      warnings: script.warnings
    }));
    
    res.json({
      sessionId,
      projectName,
      scripts: scriptSummaries,
      summary: {
        totalScripts: generationResults.scripts.length,
        platforms: targetPlatforms,
        totalSize: generationResults.totalSize,
        hasErrors: generationResults.scripts.some(s => s.validationErrors.length > 0),
        warningCount: generationResults.scripts.reduce((acc, s) => acc + s.warnings.length, 0)
      },
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Scaffold generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate scaffold scripts', 
      details: error.message 
    });
  }
});
```

##### Step 4: Update POST /export endpoint (1 hour)
**Current Issue**: Partial implementation, needs all format support

**Enhanced Implementation**:
```typescript
router.post('/export', async (req, res) => {
  try {
    const { 
      sessionId, 
      formats = ['all'], // Specific formats or 'all'
      packaging = 'individual', // 'individual', 'platform-grouped', 'archive'
      includeReadme = true
    } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    // Retrieve stored generation results
    const storedResults = await scaffoldGenerationService.getStoredResults(sessionId);
    if (!storedResults) {
      return res.status(404).json({ error: 'Generation session not found' });
    }
    
    // Filter scripts by requested formats
    let scriptsToExport = storedResults.scripts;
    if (!formats.includes('all')) {
      scriptsToExport = storedResults.scripts.filter(script => 
        formats.includes(script.format)
      );
    }
    
    // Export scripts using Export Service
    const exportResults = await exportService.exportScaffoldScripts(scriptsToExport, {
      packaging,
      includeReadme,
      generateArchive: packaging === 'archive'
    });
    
    // Generate download links
    const downloadLinks = exportResults.files.map(file => ({
      filename: file.filename,
      downloadUrl: `/downloads/${file.id}`,
      size: file.size,
      format: file.format
    }));
    
    // Include archive if requested
    let archiveInfo = null;
    if (packaging === 'archive' && exportResults.archive) {
      archiveInfo = {
        filename: exportResults.archive.filename,
        downloadUrl: `/downloads/${exportResults.archive.id}`,
        size: exportResults.archive.size,
        fileCount: scriptsToExport.length
      };
    }
    
    res.json({
      exportedFiles: downloadLinks,
      archive: archiveInfo,
      summary: {
        totalFiles: exportResults.files.length,
        totalSize: exportResults.totalSize,
        packaging,
        formats: [...new Set(scriptsToExport.map(s => s.format))]
      },
      exportedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Scaffold export error:', error);
    res.status(500).json({ 
      error: 'Failed to export scaffold scripts', 
      details: error.message 
    });
  }
});
```

#### Phase 2: Example Selection and Validation (Day 2, 4 hours)

##### Step 5: Add GET /examples endpoint (1 hour)
**New endpoint for example selection**:
```typescript
router.get('/examples', async (req, res) => {
  try {
    const { framework, category, platform } = req.query;
    
    // Get all available scaffold examples
    const allExamples = await exampleManagementService.listScriptExamples();
    
    // Filter by criteria
    let filteredExamples = allExamples;
    
    if (framework) {
      filteredExamples = filteredExamples.filter(ex => 
        ex.framework.includes(framework as string)
      );
    }
    
    if (category) {
      filteredExamples = filteredExamples.filter(ex => 
        ex.category === category
      );
    }
    
    if (platform) {
      filteredExamples = filteredExamples.filter(ex => 
        ex.supportedPlatforms.includes(platform as string)
      );
    }
    
    // Add metadata for each example
    const enrichedExamples = await Promise.all(
      filteredExamples.map(async (example) => {
        const metadata = await exampleManagementService.getExampleMetadata(example.id);
        return {
          ...example,
          estimatedFiles: metadata.estimatedFiles,
          estimatedSize: metadata.estimatedSize,
          lastUpdated: metadata.lastUpdated,
          popularity: metadata.downloadCount || 0
        };
      })
    );
    
    // Sort by popularity and framework match
    enrichedExamples.sort((a, b) => {
      if (framework && a.framework.includes(framework as string) && !b.framework.includes(framework as string)) {
        return -1;
      }
      return b.popularity - a.popularity;
    });
    
    res.json({
      examples: enrichedExamples,
      filters: {
        framework,
        category,
        platform
      },
      totalCount: enrichedExamples.length,
      availableFrameworks: [...new Set(allExamples.flatMap(ex => ex.framework))],
      availableCategories: [...new Set(allExamples.map(ex => ex.category))]
    });
    
  } catch (error) {
    console.error('Examples listing error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve examples', 
      details: error.message 
    });
  }
});
```

##### Step 6: Add POST /validate endpoint (1.5 hours)
**New endpoint for validating scaffold configuration**:
```typescript
router.post('/validate', async (req, res) => {
  try {
    const { 
      exampleId, 
      projectName, 
      targetPath, 
      variables = {},
      platforms = ['all']
    } = req.body;
    
    // Validate basic requirements
    const validationResults = {
      valid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };
    
    // Validate example exists
    if (!exampleId) {
      validationResults.errors.push('Example ID is required');
    } else {
      const exampleExists = await exampleManagementService.exampleExists(exampleId);
      if (!exampleExists) {
        validationResults.errors.push(`Example '${exampleId}' not found`);
      }
    }
    
    // Validate project name
    if (!projectName) {
      validationResults.errors.push('Project name is required');
    } else {
      // Check project name format
      if (!/^[a-zA-Z0-9\-_]+$/.test(projectName)) {
        validationResults.errors.push('Project name can only contain letters, numbers, hyphens, and underscores');
      }
      
      // Check for reserved names
      const reservedNames = ['node_modules', 'dist', 'build', '.git'];
      if (reservedNames.includes(projectName.toLowerCase())) {
        validationResults.errors.push(`'${projectName}' is a reserved name`);
      }
    }
    
    // Validate target path
    if (targetPath) {
      try {
        const resolvedPath = path.resolve(targetPath);
        
        // Check if path already exists
        if (fs.existsSync(resolvedPath)) {
          const stats = fs.statSync(resolvedPath);
          if (stats.isDirectory()) {
            const files = fs.readdirSync(resolvedPath);
            if (files.length > 0) {
              validationResults.warnings.push('Target directory is not empty - files may be overwritten');
            }
          } else {
            validationResults.errors.push('Target path exists but is not a directory');
          }
        }
        
        // Check write permissions
        const parentDir = path.dirname(resolvedPath);
        if (!fs.existsSync(parentDir)) {
          validationResults.errors.push('Parent directory does not exist');
        } else {
          try {
            fs.accessSync(parentDir, fs.constants.W_OK);
          } catch {
            validationResults.errors.push('No write permission for target directory');
          }
        }
      } catch (error) {
        validationResults.errors.push(`Invalid target path: ${error.message}`);
      }
    }
    
    // Validate platform selections
    const validPlatforms = ['windows', 'unix', 'cross-platform', 'all'];
    const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
    if (invalidPlatforms.length > 0) {
      validationResults.errors.push(`Invalid platforms: ${invalidPlatforms.join(', ')}`);
    }
    
    // Validate variables if example is available
    if (exampleId && validationResults.errors.length === 0) {
      try {
        const exampleTemplate = await exampleManagementService.getExampleContent(exampleId);
        const requiredVariables = await scaffoldGenerationService.extractRequiredVariables(exampleTemplate);
        
        const missingVariables = requiredVariables.filter(varName => 
          !(varName in variables) && variables[varName] !== ''
        );
        
        if (missingVariables.length > 0) {
          validationResults.errors.push(`Missing required variables: ${missingVariables.join(', ')}`);
        }
        
        // Add suggestions for optional variables
        const optionalVariables = await scaffoldGenerationService.extractOptionalVariables(exampleTemplate);
        const missingOptional = optionalVariables.filter(varName => !(varName in variables));
        
        if (missingOptional.length > 0) {
          validationResults.suggestions.push(`Consider providing optional variables: ${missingOptional.join(', ')}`);
        }
      } catch (error) {
        validationResults.warnings.push('Could not validate example-specific requirements');
      }
    }
    
    // Set overall validation result
    validationResults.valid = validationResults.errors.length === 0;
    
    res.json(validationResults);
    
  } catch (error) {
    console.error('Scaffold validation error:', error);
    res.status(500).json({ 
      error: 'Failed to validate scaffold configuration', 
      details: error.message 
    });
  }
});
```

##### Step 7: Add error handling and middleware (1.5 hours)
```typescript
// Enhanced error handling and validation middleware
import { body, query, validationResult } from 'express-validator';

// Validation middleware for scaffold generation
export const validateScaffoldRequest = [
  body('exampleId')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Example ID is required'),
  body('projectName')
    .isString()
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('Project name can only contain letters, numbers, hyphens, and underscores'),
  body('targetPath')
    .optional()
    .isString()
    .withMessage('Target path must be a string'),
  body('variables')
    .optional()
    .isObject()
    .withMessage('Variables must be an object'),
  body('platforms')
    .optional()
    .isArray()
    .withMessage('Platforms must be an array'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    next();
  }
];

// Rate limiting for scaffold generation
export const scaffoldRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // 10 scaffold generations per 10 minutes
  message: {
    error: 'Too many scaffold generation requests',
    details: 'Please wait 10 minutes before generating more scaffolds'
  }
});

// Apply middleware to routes
router.use(scaffoldRateLimit);
router.post('/generate', validateScaffoldRequest, async (req, res) => { /* ... */ });
router.post('/preview', validateScaffoldRequest, async (req, res) => { /* ... */ });
```

#### Phase 3: Testing and Integration (Day 3, 6 hours)

##### Step 8: Comprehensive Route Testing (4 hours)
```typescript
// src/__tests__/routes/scaffoldGenerator.test.ts
describe('Scaffold Generator Routes', () => {
  describe('POST /analyze', () => {
    it('should analyze project and suggest compatible examples', async () => {
      // Mock services
      jest.spyOn(scaffoldGenerationService, 'analyzeProjectStructure').mockResolvedValue({
        directoryStructure: { files: 25, directories: 8 },
        detectedPatterns: ['component-based', 'typescript']
      });
      
      jest.spyOn(frameworkDetectionService, 'detectFrameworks').mockResolvedValue({
        frameworks: { frontend: [{ name: 'react', confidence: 0.9 }] }
      });
      
      const response = await request(app)
        .post('/api/scaffold-generator/analyze')
        .send({
          directoryPath: '/test/react-project'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.projectAnalysis).toBeDefined();
      expect(response.body.frameworks).toBeDefined();
      expect(response.body.compatibleExamples).toBeInstanceOf(Array);
    });
  });
  
  describe('POST /preview', () => {
    it('should generate scaffold preview for all platforms', async () => {
      jest.spyOn(exampleManagementService, 'getExampleContent').mockResolvedValue({
        id: 'react-setup',
        content: 'mock template content'
      });
      
      jest.spyOn(scaffoldGenerationService, 'generatePreview').mockResolvedValue({
        fileStructure: { files: ['package.json', 'src/App.tsx'] },
        sampleCommands: ['npm install', 'npm run dev'],
        estimatedDuration: '5 minutes'
      });
      
      const response = await request(app)
        .post('/api/scaffold-generator/preview')
        .send({
          exampleId: 'react-setup',
          projectName: 'test-project',
          platforms: ['windows', 'unix']
        });
      
      expect(response.status).toBe(200);
      expect(response.body.previews).toHaveLength(2);
      expect(response.body.summary.supportedPlatforms).toEqual(['windows', 'unix']);
    });
  });
  
  describe('POST /generate', () => {
    it('should generate scripts for all 12+ formats', async () => {
      const mockGenerationResults = {
        scripts: [
          { format: '.sh', platform: 'unix', filename: 'setup.sh', content: '#!/bin/bash\n', validationErrors: [], warnings: [] },
          { format: '.ps1', platform: 'windows', filename: 'setup.ps1', content: '# PowerShell\n', validationErrors: [], warnings: [] },
          // ... other formats
        ],
        totalSize: 50000
      };
      
      jest.spyOn(scaffoldGenerationService, 'generateAllFormats').mockResolvedValue(mockGenerationResults);
      jest.spyOn(scaffoldGenerationService, 'storeGenerationResults').mockResolvedValue(undefined);
      
      const response = await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          exampleId: 'react-setup',
          projectName: 'test-project'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.sessionId).toBeDefined();
      expect(response.body.scripts.length).toBeGreaterThanOrEqual(12);
    });
  });
});
```

##### Step 9: Integration Testing with Other Services (2 hours)
```typescript
// Integration tests with Example Management and Export Services
describe('Scaffold Generator Integration', () => {
  it('should work end-to-end: analyze → preview → generate → export', async () => {
    // Step 1: Analyze
    const analyzeResponse = await request(app)
      .post('/api/scaffold-generator/analyze')
      .send({ directoryPath: '/test/project' });
    
    expect(analyzeResponse.status).toBe(200);
    const exampleId = analyzeResponse.body.compatibleExamples[0].id;
    
    // Step 2: Preview
    const previewResponse = await request(app)
      .post('/api/scaffold-generator/preview')
      .send({
        exampleId,
        projectName: 'integration-test'
      });
    
    expect(previewResponse.status).toBe(200);
    
    // Step 3: Generate
    const generateResponse = await request(app)
      .post('/api/scaffold-generator/generate')
      .send({
        exampleId,
        projectName: 'integration-test'
      });
    
    expect(generateResponse.status).toBe(200);
    const sessionId = generateResponse.body.sessionId;
    
    // Step 4: Export
    const exportResponse = await request(app)
      .post('/api/scaffold-generator/export')
      .send({
        sessionId,
        packaging: 'archive'
      });
    
    expect(exportResponse.status).toBe(200);
    expect(exportResponse.body.archive).toBeDefined();
  });
});
```

### Dependencies Integration
- **Scaffold Generation Service**: Core scaffold logic and template processing
- **Example Management Service**: Template/example loading and enumeration
- **Framework Detection Service**: Intelligent example selection
- **Export Service**: Multi-format script output and packaging
- **Command Translation Service**: Cross-platform command conversion

### Acceptance Criteria

- ✅ All scaffold generator route tests pass
- ✅ Routes integrate with real ScaffoldGenerationService
- ✅ Template selection working with TemplateManagementService

### Dependencies

- Feature 4 (Scaffold Generation Service)
- Feature 5 (Command Translation Service)

---

## **Feature 13: Example Management Routes**

**Estimated Time: 1 day**
**Current Status: No example management API exists**

### Purpose

Create API endpoints for local example management functionality.

### Implementation Phases

#### Phase 1: Core API Routes (4 hours)
**Files to create:**
- `src/routes/examples.ts`
- `src/types/example.ts` (if not exists from Feature 3)

**Step 1: Create Base Route Structure (1 hour)**
```typescript
// src/routes/examples.ts
import express from 'express'
import { ExampleManagementService } from '../services/ExampleManagementService'

const router = express.Router()
const exampleService = new ExampleManagementService()

// GET /api/examples - List all examples
router.get('/', async (req, res) => {
  try {
    const examples = await exampleService.scanExamples()
    res.json({
      success: true,
      data: examples,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to list examples:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to load examples',
      details: error.message
    })
  }
})

export default router
```

**Step 2: Add Content Retrieval Routes (1.5 hours)**
```typescript
// GET /api/examples/:type/:id - Get specific example content
router.get('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params
    
    // Validate type parameter
    if (!['task', 'script'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid example type',
        validTypes: ['task', 'script']
      })
    }
    
    const example = await exampleService.getExampleContent(id, type as 'task' | 'script')
    
    res.json({
      success: true,
      data: example,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: 'Example not found',
        details: error.message
      })
    } else {
      console.error('Failed to get example content:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to load example content',
        details: error.message
      })
    }
  }
})

// GET /api/examples/tasks - List task examples only
router.get('/tasks', async (req, res) => {
  try {
    const examples = await exampleService.scanExamples()
    res.json({
      success: true,
      data: examples.tasks,
      count: examples.tasks.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to list task examples:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to load task examples',
      details: error.message
    })
  }
})

// GET /api/examples/scripts - List script examples only
router.get('/scripts', async (req, res) => {
  try {
    const examples = await exampleService.scanExamples()
    res.json({
      success: true,
      data: examples.scripts,
      count: examples.scripts.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to list script examples:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to load script examples',
      details: error.message
    })
  }
})
```

**Step 3: Add Framework Filtering Routes (1 hour)**
```typescript
// GET /api/examples/framework/:framework - Filter by framework
router.get('/framework/:framework', async (req, res) => {
  try {
    const { framework } = req.params
    const examples = await exampleService.getExamplesByFramework(framework)
    
    res.json({
      success: true,
      data: examples,
      framework: framework,
      count: {
        tasks: examples.tasks.length,
        scripts: examples.scripts.length,
        total: examples.tasks.length + examples.scripts.length
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to filter examples by framework:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to filter examples',
      details: error.message
    })
  }
})

// GET /api/examples/formats - Get available script formats
router.get('/formats', async (req, res) => {
  try {
    const formats = await exampleService.getAvailableFormats()
    res.json({
      success: true,
      data: formats,
      count: formats.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to get available formats:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get formats',
      details: error.message
    })
  }
})
```

**Step 4: Add Validation Middleware (30 minutes)**
```typescript
// Request validation middleware
const validateExampleRequest = (req: Request, res: Response, next: NextFunction) => {
  const { type, id } = req.params
  
  if (type && !['task', 'script'].includes(type)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid example type',
      validTypes: ['task', 'script']
    })
  }
  
  if (id && (!/^[a-zA-Z0-9\-_]+$/.test(id))) {
    return res.status(400).json({
      success: false,
      error: 'Invalid example ID format',
      details: 'ID can only contain letters, numbers, hyphens, and underscores'
    })
  }
  
  next()
}

// Apply validation to specific routes
router.get('/:type/:id', validateExampleRequest, async (req, res) => { /* ... */ })
```

#### Phase 2: Integration and Registration (2 hours)
**Files to update:**
- `src/app.ts`

**Step 1: Register Routes in App (15 minutes)**
```typescript
// src/app.ts
import exampleRoutes from './routes/examples'

// Register example management routes
app.use('/api/examples', exampleRoutes)
```

**Step 2: Add Error Handling Middleware (45 minutes)**
```typescript
// Enhanced error handling for example routes
router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Example route error:', error)
  
  if (error.code === 'ENOENT') {
    return res.status(404).json({
      success: false,
      error: 'Example file not found',
      details: 'The requested example file does not exist'
    })
  }
  
  if (error.code === 'EACCES') {
    return res.status(403).json({
      success: false,
      error: 'Permission denied',
      details: 'Cannot access example file due to permissions'
    })
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: error.message
  })
})
```

**Step 3: Add Request Logging (30 minutes)**
```typescript
// Request logging middleware for examples
const logExampleRequests = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - startTime
    console.log(`[Examples] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`)
  })
  
  next()
}

router.use(logExampleRequests)
```

**Step 4: Add Rate Limiting (30 minutes)**
```typescript
// Rate limiting for example requests
import rateLimit from 'express-rate-limit'

const exampleRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    success: false,
    error: 'Too many requests',
    details: 'Please wait before making more example requests'
  }
})

router.use(exampleRateLimit)
```

#### Phase 3: Testing and Validation (2 hours)
**Files to create:**
- `src/__tests__/routes/examples.test.ts`

**Step 1: Basic Route Tests (1 hour)**
```typescript
// src/__tests__/routes/examples.test.ts
import request from 'supertest'
import { app } from '../../app'

describe('Example Management Routes', () => {
  describe('GET /api/examples', () => {
    it('should return list of all examples', async () => {
      const response = await request(app).get('/api/examples')
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('tasks')
      expect(response.body.data).toHaveProperty('scripts')
      expect(Array.isArray(response.body.data.tasks)).toBe(true)
      expect(Array.isArray(response.body.data.scripts)).toBe(true)
    })
  })
  
  describe('GET /api/examples/tasks', () => {
    it('should return only task examples', async () => {
      const response = await request(app).get('/api/examples/tasks')
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.count).toBeGreaterThanOrEqual(0)
    })
  })
  
  describe('GET /api/examples/scripts', () => {
    it('should return only script examples', async () => {
      const response = await request(app).get('/api/examples/scripts')
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.count).toBeGreaterThanOrEqual(0)
    })
  })
})
```

**Step 2: Content Retrieval Tests (45 minutes)**
```typescript
describe('Example Content Retrieval', () => {
  it('should return specific example content', async () => {
    // First get list of examples
    const listResponse = await request(app).get('/api/examples')
    const firstTask = listResponse.body.data.tasks[0]
    
    if (firstTask) {
      const response = await request(app).get(`/api/examples/task/${firstTask.id}`)
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('content')
      expect(response.body.data).toHaveProperty('metadata')
    }
  })
  
  it('should return 404 for non-existent example', async () => {
    const response = await request(app).get('/api/examples/task/non-existent-id')
    
    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toContain('not found')
  })
  
  it('should return 400 for invalid example type', async () => {
    const response = await request(app).get('/api/examples/invalid/test-id')
    
    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toContain('Invalid example type')
  })
})
```

**Step 3: Framework Filtering Tests (15 minutes)**
```typescript
describe('Framework Filtering', () => {
  it('should filter examples by framework', async () => {
    const response = await request(app).get('/api/examples/framework/react')
    
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.framework).toBe('react')
    expect(response.body.count).toHaveProperty('tasks')
    expect(response.body.count).toHaveProperty('scripts')
    expect(response.body.count).toHaveProperty('total')
  })
  
  it('should return available formats', async () => {
    const response = await request(app).get('/api/examples/formats')
    
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.count).toBeGreaterThan(0)
  })
})
```

### Acceptance Criteria

- ✅ All example route tests pass
- ✅ Local file system access working
- ✅ Example listing and content retrieval functional
- ✅ Framework filtering working correctly
- ✅ Error handling for missing files and invalid requests
- ✅ Rate limiting and security measures in place

### Dependencies

- Feature 3 (Example Management Service) - MUST be completed first

---

## **Feature 14: Integration Testing and Validation**

**Estimated Time: 1 day**
**Current Status: 30% test pass rate (265/376 tests passing) vs. target 80%**

### Purpose

Fix all failing tests and achieve 80%+ test coverage.

### Implementation Phases

#### Phase 1: Fix Failing Tests (4 hours)
**Current Issue**: 111 tests failing due to targeting unimplemented features

**Step 1: Update Service Tests for Real Implementations (2 hours)**
```typescript
// src/__tests__/services/TaskGenerationService.test.ts
describe('TaskGenerationService', () => {
  // Fix tests to match actual implementation
  it('should generate tasks with framework detection', async () => {
    const mockDirectory = '/test/react-project'
    const customInstructions = 'Focus on React components'
    
    // Mock actual service dependencies that exist
    jest.spyOn(fileAnalysisService, 'analyzeDirectory').mockResolvedValue({
      files: [
        { path: 'src/App.tsx', content: 'React component content', language: 'typescript' }
      ],
      totalFiles: 1,
      totalSize: 1024
    })
    
    jest.spyOn(frameworkDetectionService, 'detectFrameworks').mockResolvedValue({
      frameworks: { frontend: [{ name: 'react', confidence: 0.9 }] }
    })
    
    const result = await taskGenerationService.generateTasks({
      directoryPath: mockDirectory,
      customInstructions
    })
    
    // Test actual implementation behavior
    expect(result.tasks).toBeDefined()
    expect(result.tasks.length).toBeGreaterThan(0)
    expect(result.summary.frameworks).toContain('react')
  })
})
```

**Step 2: Update Route Tests for Actual Endpoints (1.5 hours)**
```typescript
// src/__tests__/routes/taskGenerator.test.ts
describe('Task Generator Routes', () => {
  // Fix POST /generate to test actual implementation
  it('should generate tasks via API', async () => {
    const requestBody = {
      directoryPath: '/test/project',
      customInstructions: 'Test instructions',
      excludePatterns: ['node_modules'],
      maxTaskSize: 50
    }
    
    // Mock actual service methods that exist
    jest.spyOn(taskGenerationService, 'generateTasks').mockResolvedValue({
      tasks: [
        {
          id: 'task_01.0',
          filename: 'task_01.0.md',
          title: 'Test Task',
          content: 'Generated task content',
          metadata: { fileCount: 5, totalSize: 2048, framework: 'react' }
        }
      ],
      summary: { totalFiles: 5, totalTasks: 1, frameworks: ['react'] }
    })
    
    jest.spyOn(taskGenerationService, 'storeGenerationResults').mockResolvedValue(undefined)
    
    const response = await request(app)
      .post('/api/task-generator/generate')
      .send(requestBody)
    
    expect(response.status).toBe(200)
    expect(response.body.sessionId).toBeDefined()
    expect(response.body.tasks).toHaveLength(1)
    expect(response.body.summary.frameworks).toContain('react')
  })
})
```

**Step 3: Update Scaffold Generator Tests (30 minutes)**
```typescript
// src/__tests__/routes/scaffoldGenerator.test.ts
describe('Scaffold Generator Routes', () => {
  // Update tests to match partial implementation
  it('should handle scaffold generation with partial implementation', async () => {
    const requestBody = {
      exampleId: 'react-setup',
      projectName: 'test-project',
      variables: { description: 'Test project' }
    }
    
    // Mock the services that exist
    jest.spyOn(scaffoldGenerationService, 'generateScaffold').mockResolvedValue({
      scripts: [
        { format: '.sh', content: 'mock script', platform: 'unix' },
        { format: '.ps1', content: 'mock powershell', platform: 'windows' }
      ],
      metadata: { example: 'react-setup', projectName: 'test-project' }
    })
    
    const response = await request(app)
      .post('/api/scaffold-generator/generate')
      .send(requestBody)
    
    // Expect current implementation behavior
    expect(response.status).toBe(200)
    expect(response.body.sessionId).toBeDefined()
  })
})
```

#### Phase 2: Create Complete Workflow Tests (2 hours)
**Files to update:**
- `src/__tests__/integration.test.ts`

**Step 1: Task Generation Workflow Test (1 hour)**
```typescript
// src/__tests__/integration.test.ts
describe('Complete Task Generation Workflow', () => {
  it('should complete end-to-end task generation', async () => {
    const testDirectory = path.join(__dirname, '../test-data/sample-project')
    
    // Step 1: Analyze directory
    const analyzeResponse = await request(app)
      .post('/api/task-generator/analyze')
      .send({
        directoryPath: testDirectory,
        customInstructions: 'Integration test'
      })
    
    expect(analyzeResponse.status).toBe(200)
    expect(analyzeResponse.body.analysis).toBeDefined()
    
    // Step 2: Generate tasks
    const generateResponse = await request(app)
      .post('/api/task-generator/generate')
      .send({
        directoryPath: testDirectory,
        customInstructions: 'Integration test',
        maxTaskSize: 20
      })
    
    expect(generateResponse.status).toBe(200)
    expect(generateResponse.body.sessionId).toBeDefined()
    const sessionId = generateResponse.body.sessionId
    
    // Step 3: Export tasks
    const exportResponse = await request(app)
      .post('/api/task-generator/export')
      .send({
        sessionId,
        format: 'markdown'
      })
    
    expect(exportResponse.status).toBe(200)
    expect(exportResponse.body.exportedFiles).toBeDefined()
    expect(exportResponse.body.summary.totalFiles).toBeGreaterThan(0)
  })
})
```

**Step 2: Scaffold Generation Workflow Test (45 minutes)**
```typescript
describe('Complete Scaffold Generation Workflow', () => {
  it('should complete end-to-end scaffold generation', async () => {
    // Step 1: List available examples
    const examplesResponse = await request(app).get('/api/examples/scripts')
    
    expect(examplesResponse.status).toBe(200)
    expect(examplesResponse.body.data.length).toBeGreaterThan(0)
    
    const firstExample = examplesResponse.body.data[0]
    
    // Step 2: Preview scaffold
    const previewResponse = await request(app)
      .post('/api/scaffold-generator/preview')
      .send({
        exampleId: firstExample.id,
        projectName: 'integration-test-project',
        variables: { description: 'Integration test' }
      })
    
    expect(previewResponse.status).toBe(200)
    
    // Step 3: Generate scaffold
    const generateResponse = await request(app)
      .post('/api/scaffold-generator/generate')
      .send({
        exampleId: firstExample.id,
        projectName: 'integration-test-project',
        variables: { description: 'Integration test' }
      })
    
    expect(generateResponse.status).toBe(200)
    expect(generateResponse.body.sessionId).toBeDefined()
  })
})
```

**Step 3: Cross-Service Integration Test (15 minutes)**
```typescript
describe('Cross-Service Integration', () => {
  it('should integrate framework detection with task generation', async () => {
    const testProject = path.join(__dirname, '../test-data/react-project')
    
    // Framework detection should influence task generation
    const response = await request(app)
      .post('/api/task-generator/generate')
      .send({
        directoryPath: testProject,
        customInstructions: 'React project analysis'
      })
    
    expect(response.status).toBe(200)
    expect(response.body.summary.frameworks).toContain('react')
    
    // Tasks should be framework-aware
    const taskContent = response.body.tasks[0]
    expect(taskContent.title).toMatch(/react|component/i)
  })
})
```

#### Phase 3: Performance and Load Testing (2 hours)
**Files to create:**
- `src/__tests__/performance.test.ts`

**Step 1: Large Project Performance Tests (1 hour)**
```typescript
// src/__tests__/performance.test.ts
describe('Performance Tests', () => {
  jest.setTimeout(30000) // 30 second timeout for performance tests
  
  it('should handle large directories efficiently', async () => {
    const largeProjectPath = path.join(__dirname, '../test-data/large-project')
    
    // Create test data with 100+ files if not exists
    await createLargeTestProject(largeProjectPath, 100)
    
    const startTime = Date.now()
    
    const response = await request(app)
      .post('/api/task-generator/analyze')
      .send({
        directoryPath: largeProjectPath
      })
    
    const duration = Date.now() - startTime
    
    expect(response.status).toBe(200)
    expect(duration).toBeLessThan(5000) // Should complete in under 5 seconds
    expect(response.body.analysis.totalFiles).toBeGreaterThan(90)
  })
  
  it('should handle framework detection on large projects', async () => {
    const complexProjectPath = path.join(__dirname, '../test-data/complex-project')
    
    const startTime = Date.now()
    
    const response = await request(app)
      .post('/api/framework-detection/detect')
      .send({
        directoryPath: complexProjectPath
      })
    
    const duration = Date.now() - startTime
    
    expect(response.status).toBe(200)
    expect(duration).toBeLessThan(2000) // Framework detection under 2 seconds
  })
})

// Helper function to create test data
async function createLargeTestProject(projectPath: string, fileCount: number) {
  if (!fs.existsSync(projectPath)) {
    await fs.mkdir(projectPath, { recursive: true })
    
    // Create multiple directories and files
    for (let i = 0; i < fileCount; i++) {
      const dir = path.join(projectPath, `dir${Math.floor(i / 10)}`)
      await fs.mkdir(dir, { recursive: true })
      
      const filePath = path.join(dir, `file${i}.js`)
      const content = `// Test file ${i}\nexport const test${i} = () => 'test';\n`
      await fs.writeFile(filePath, content)
    }
    
    // Add package.json for framework detection
    const packageJson = {
      name: 'large-test-project',
      dependencies: { react: '^18.0.0', typescript: '^4.0.0' }
    }
    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    )
  }
}
```

**Step 2: Memory Usage Monitoring (45 minutes)**
```typescript
describe('Memory Usage Tests', () => {
  it('should not exceed memory limits during task generation', async () => {
    const initialMemory = process.memoryUsage()
    
    // Generate tasks for multiple projects
    const projects = [
      'test-data/project1',
      'test-data/project2',
      'test-data/project3'
    ]
    
    for (const project of projects) {
      await request(app)
        .post('/api/task-generator/generate')
        .send({
          directoryPath: project,
          customInstructions: 'Memory test'
        })
    }
    
    const finalMemory = process.memoryUsage()
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed
    
    // Memory increase should be reasonable (less than 100MB)
    expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024)
  })
})
```

**Step 3: Concurrent Request Testing (15 minutes)**
```typescript
describe('Concurrent Request Tests', () => {
  it('should handle multiple simultaneous requests', async () => {
    const concurrentRequests = Array(5).fill(null).map(() =>
      request(app)
        .post('/api/task-generator/analyze')
        .send({
          directoryPath: 'test-data/sample-project'
        })
    )
    
    const results = await Promise.all(concurrentRequests)
    
    // All requests should succeed
    results.forEach(response => {
      expect(response.status).toBe(200)
    })
  })
})
```

### Acceptance Criteria

- ✅ 80%+ test pass rate achieved
- ✅ Integration tests cover complete workflows  
- ✅ Performance tests for large projects (100+ files)
- ✅ Memory usage monitoring and limits
- ✅ Concurrent request handling
- ✅ All service integration points tested

### Dependencies

- All previous features completed (1-5, 11-13)

---

## **Feature 15: Error Handling and Validation**

**Estimated Time: 2 days**
**Current Status: Basic error handling exists**

### Purpose

Comprehensive input validation and user-friendly error messages.

### Implementation Phases

#### Phase 1: Core Validation Utilities (Day 1, 6 hours)
**Files to create:**
- `src/utils/validation.ts`
- `src/utils/errorHandling.ts`
- `src/middleware/validation.ts`

**Step 1: Create Core Validation Functions (2 hours)**
```typescript
// src/utils/validation.ts
import path from 'path'
import fs from 'fs/promises'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export class ValidationService {
  // Path validation
  async validateDirectoryPath(directoryPath: string): Promise<ValidationResult> {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [] }
    
    if (!directoryPath) {
      result.errors.push('Directory path is required')
      result.isValid = false
      return result
    }
    
    // Prevent path traversal attacks
    const resolvedPath = path.resolve(directoryPath)
    if (resolvedPath.includes('..') || !path.isAbsolute(resolvedPath)) {
      result.errors.push('Invalid directory path - path traversal not allowed')
      result.isValid = false
      return result
    }
    
    try {
      const stats = await fs.stat(resolvedPath)
      if (!stats.isDirectory()) {
        result.errors.push('Path exists but is not a directory')
        result.isValid = false
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        result.errors.push('Directory does not exist')
      } else if (error.code === 'EACCES') {
        result.errors.push('Permission denied - cannot access directory')
      } else {
        result.errors.push(`Cannot access directory: ${error.message}`)
      }
      result.isValid = false
    }
    
    return result
  }
  
  // Custom instructions validation
  validateCustomInstructions(instructions: string): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [] }
    
    if (!instructions || instructions.trim().length === 0) {
      result.errors.push('Custom instructions are required')
      result.isValid = false
      return result
    }
    
    if (instructions.length > 10000) {
      result.errors.push('Custom instructions must be less than 10,000 characters')
      result.isValid = false
    }
    
    if (instructions.length < 10) {
      result.warnings.push('Custom instructions are very short - consider adding more detail')
    }
    
    // Check for potentially harmful content
    const suspiciousPatterns = [
      /system\s*\(/i,
      /exec\s*\(/i,
      /eval\s*\(/i,
      /<script/i
    ]
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(instructions)) {
        result.warnings.push('Custom instructions contain potentially unsafe content')
        break
      }
    }
    
    return result
  }
  
  // Project name validation
  validateProjectName(projectName: string): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [] }
    
    if (!projectName) {
      result.errors.push('Project name is required')
      result.isValid = false
      return result
    }
    
    // Valid project name pattern
    if (!/^[a-zA-Z0-9\-_]+$/.test(projectName)) {
      result.errors.push('Project name can only contain letters, numbers, hyphens, and underscores')
      result.isValid = false
    }
    
    if (projectName.length < 2) {
      result.errors.push('Project name must be at least 2 characters long')
      result.isValid = false
    }
    
    if (projectName.length > 100) {
      result.errors.push('Project name must be less than 100 characters')
      result.isValid = false
    }
    
    // Check for reserved names
    const reservedNames = ['node_modules', 'dist', 'build', '.git', 'src', 'test', 'tests']
    if (reservedNames.includes(projectName.toLowerCase())) {
      result.errors.push(`'${projectName}' is a reserved name`)
      result.isValid = false
    }
    
    return result
  }
  
  // File size validation
  async validateFileSize(filePath: string, maxSizeBytes: number = 10 * 1024 * 1024): Promise<ValidationResult> {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [] }
    
    try {
      const stats = await fs.stat(filePath)
      
      if (stats.size > maxSizeBytes) {
        result.errors.push(`File is too large: ${this.formatFileSize(stats.size)} (max: ${this.formatFileSize(maxSizeBytes)})`)
        result.isValid = false
      }
      
      if (stats.size > maxSizeBytes * 0.8) {
        result.warnings.push(`File is approaching size limit: ${this.formatFileSize(stats.size)}`)
      }
    } catch (error) {
      result.errors.push(`Cannot check file size: ${error.message}`)
      result.isValid = false
    }
    
    return result
  }
  
  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }
}
```

**Step 2: Create Error Handling Utilities (2 hours)**
```typescript
// src/utils/errorHandling.ts
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  FILE_SYSTEM_ERROR = 'FILE_SYSTEM_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVICE_ERROR = 'SERVICE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface StandardError {
  type: ErrorType
  message: string
  details?: string
  code?: string
  statusCode: number
  timestamp: string
  requestId?: string
}

export class ErrorHandler {
  static createError(
    type: ErrorType,
    message: string,
    details?: string,
    statusCode: number = 500
  ): StandardError {
    return {
      type,
      message,
      details,
      statusCode,
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    }
  }
  
  static handleFileSystemError(error: any): StandardError {
    switch (error.code) {
      case 'ENOENT':
        return this.createError(
          ErrorType.FILE_SYSTEM_ERROR,
          'File or directory not found',
          'The specified path does not exist',
          404
        )
      case 'EACCES':
        return this.createError(
          ErrorType.PERMISSION_ERROR,
          'Permission denied',
          'Insufficient permissions to access the requested resource',
          403
        )
      case 'ENOTDIR':
        return this.createError(
          ErrorType.FILE_SYSTEM_ERROR,
          'Not a directory',
          'The specified path is not a directory',
          400
        )
      case 'EISDIR':
        return this.createError(
          ErrorType.FILE_SYSTEM_ERROR,
          'Is a directory',
          'Expected a file but found a directory',
          400
        )
      case 'EMFILE':
      case 'ENFILE':
        return this.createError(
          ErrorType.FILE_SYSTEM_ERROR,
          'Too many open files',
          'System limit for open files reached',
          503
        )
      case 'ENOSPC':
        return this.createError(
          ErrorType.FILE_SYSTEM_ERROR,
          'No space left on device',
          'Insufficient disk space',
          507
        )
      default:
        return this.createError(
          ErrorType.FILE_SYSTEM_ERROR,
          'File system error',
          error.message,
          500
        )
    }
  }
  
  static handleValidationError(validationResult: any): StandardError {
    return this.createError(
      ErrorType.VALIDATION_ERROR,
      'Validation failed',
      Array.isArray(validationResult.errors) 
        ? validationResult.errors.join(', ')
        : 'Invalid input provided',
      400
    )
  }
  
  static handleServiceError(serviceName: string, error: any): StandardError {
    return this.createError(
      ErrorType.SERVICE_ERROR,
      `${serviceName} service error`,
      error.message || 'An error occurred in the service',
      500
    )
  }
  
  static createUserFriendlyMessage(error: StandardError): string {
    const baseMessages = {
      [ErrorType.VALIDATION_ERROR]: 'Please check your input and try again.',
      [ErrorType.FILE_SYSTEM_ERROR]: 'There was a problem accessing the file system.',
      [ErrorType.PERMISSION_ERROR]: 'You don\'t have permission to access this resource.',
      [ErrorType.NETWORK_ERROR]: 'There was a network connection problem.',
      [ErrorType.SERVICE_ERROR]: 'A service is temporarily unavailable.',
      [ErrorType.UNKNOWN_ERROR]: 'An unexpected error occurred.'
    }
    
    const baseMessage = baseMessages[error.type] || baseMessages[ErrorType.UNKNOWN_ERROR]
    return `${error.message} ${baseMessage}`
  }
  
  private static generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15)
  }
}
```

**Step 3: Create Validation Middleware (1.5 hours)**
```typescript
// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express'
import { body, param, query, validationResult } from 'express-validator'
import { ValidationService, ErrorHandler, ErrorType } from '../utils'

const validationService = new ValidationService()

// Task generator validation
export const validateTaskGenerationRequest = [
  body('directoryPath')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Directory path is required')
    .custom(async (value) => {
      const result = await validationService.validateDirectoryPath(value)
      if (!result.isValid) {
        throw new Error(result.errors.join(', '))
      }
      return true
    }),
  
  body('customInstructions')
    .isString()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Custom instructions are required (max 10,000 characters)')
    .custom((value) => {
      const result = validationService.validateCustomInstructions(value)
      if (!result.isValid) {
        throw new Error(result.errors.join(', '))
      }
      return true
    }),
  
  body('excludePatterns')
    .optional()
    .isArray()
    .withMessage('Exclude patterns must be an array'),
  
  body('maxTaskSize')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Max task size must be between 1 and 1000'),
  
  handleValidationErrors
]

// Scaffold generator validation
export const validateScaffoldGenerationRequest = [
  body('exampleId')
    .isString()
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('Example ID must contain only letters, numbers, hyphens, and underscores'),
  
  body('projectName')
    .isString()
    .custom((value) => {
      const result = validationService.validateProjectName(value)
      if (!result.isValid) {
        throw new Error(result.errors.join(', '))
      }
      return true
    }),
  
  body('variables')
    .optional()
    .isObject()
    .withMessage('Variables must be an object'),
  
  body('platforms')
    .optional()
    .isArray()
    .withMessage('Platforms must be an array')
    .custom((value) => {
      const validPlatforms = ['windows', 'unix', 'cross-platform', 'all']
      const invalidPlatforms = value.filter(p => !validPlatforms.includes(p))
      if (invalidPlatforms.length > 0) {
        throw new Error(`Invalid platforms: ${invalidPlatforms.join(', ')}`)
      }
      return true
    }),
  
  handleValidationErrors
]

// Example management validation
export const validateExampleRequest = [
  param('type')
    .optional()
    .isIn(['task', 'script'])
    .withMessage('Type must be either "task" or "script"'),
  
  param('id')
    .optional()
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('ID must contain only letters, numbers, hyphens, and underscores'),
  
  param('framework')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Framework name must be 1-50 characters'),
  
  handleValidationErrors
]

// Handle validation errors
function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }))
    
    const standardError = ErrorHandler.createError(
      ErrorType.VALIDATION_ERROR,
      'Request validation failed',
      errorDetails.map(e => `${e.field}: ${e.message}`).join('; '),
      400
    )
    
    return res.status(400).json({
      success: false,
      error: standardError,
      details: errorDetails
    })
  }
  
  next()
}

// Security middleware
export const securityValidation = (req: Request, res: Response, next: NextFunction) => {
  // Check for suspicious patterns in request body
  const bodyString = JSON.stringify(req.body)
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /eval\s*\(/i,
    /exec\s*\(/i,
    /system\s*\(/i
  ]
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(bodyString)) {
      const error = ErrorHandler.createError(
        ErrorType.VALIDATION_ERROR,
        'Suspicious content detected',
        'Request contains potentially harmful content',
        400
      )
      
      return res.status(400).json({
        success: false,
        error,
        details: 'Request blocked for security reasons'
      })
    }
  }
  
  next()
}
```

**Step 4: Global Error Handler (30 minutes)**
```typescript
// Add to existing error handling middleware
export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', error)
  
  let standardError: StandardError
  
  // Handle different types of errors
  if (error.code && error.code.startsWith('E')) {
    // File system error
    standardError = ErrorHandler.handleFileSystemError(error)
  } else if (error.name === 'ValidationError') {
    // Validation error
    standardError = ErrorHandler.handleValidationError(error)
  } else if (error.name === 'SyntaxError') {
    // JSON parsing error
    standardError = ErrorHandler.createError(
      ErrorType.VALIDATION_ERROR,
      'Invalid JSON in request body',
      error.message,
      400
    )
  } else {
    // Unknown error
    standardError = ErrorHandler.createError(
      ErrorType.UNKNOWN_ERROR,
      'An unexpected error occurred',
      error.message,
      500
    )
  }
  
  // Log error for monitoring
  console.error(`[${standardError.requestId}] ${standardError.type}: ${standardError.message}`)
  
  res.status(standardError.statusCode).json({
    success: false,
    error: {
      message: ErrorHandler.createUserFriendlyMessage(standardError),
      type: standardError.type,
      requestId: standardError.requestId,
      timestamp: standardError.timestamp
    },
    ...(process.env.NODE_ENV === 'development' && { details: standardError.details })
  })
}
```

#### Phase 2: Apply Validation to All Routes (Day 2, 4 hours)
**Files to update:**
- All route files in `src/routes/`

**Step 1: Update Task Generator Routes (1 hour)**
```typescript
// src/routes/taskGenerator.ts
import { validateTaskGenerationRequest, securityValidation } from '../middleware/validation'

// Apply validation to all routes
router.use(securityValidation)
router.post('/analyze', validateTaskGenerationRequest, async (req, res) => { /* ... */ })
router.post('/generate', validateTaskGenerationRequest, async (req, res) => { /* ... */ })
```

**Step 2: Update All Other Routes (2 hours)**
Apply similar validation patterns to:
- `src/routes/scaffoldGenerator.ts`
- `src/routes/examples.ts`
- `src/routes/filesystem.ts`

**Step 3: Add Route-Specific Error Handling (1 hour)**
```typescript
// Enhanced error handling for each route
router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  // Route-specific error handling
  if (req.path.includes('/task-generator')) {
    console.error('Task Generator route error:', error)
  } else if (req.path.includes('/scaffold-generator')) {
    console.error('Scaffold Generator route error:', error)
  }
  
  next(error) // Pass to global error handler
})
```

### Acceptance Criteria

- ✅ Input validation working for all endpoints
- ✅ Error messages are user-friendly and informative
- ✅ Security vulnerabilities addressed (path traversal, XSS, code injection)
- ✅ File system errors handled gracefully
- ✅ All validation has comprehensive test coverage
- ✅ Error logging for debugging and monitoring

### Dependencies

- All service features completed

---

## **Feature 16: Performance Optimization**

**Estimated Time: 2 days**
**Current Status: Basic performance, needs optimization**

### Purpose

Caching and performance optimization for production use.

### Implementation Phases

#### Phase 1: Caching Infrastructure (Day 1, 6 hours)
**Files to create:**
- `src/middleware/caching.ts`
- `src/utils/cache.ts`
- `src/services/CacheService.ts`

**Step 1: Create Cache Service (2 hours)**
```typescript
// src/services/CacheService.ts
export interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
  accessCount: number
  lastAccessed: number
}

export class CacheService {
  private cache = new Map<string, CacheEntry<any>>()
  private maxSize: number
  private defaultTTL: number
  
  constructor(maxSize: number = 1000, defaultTTL: number = 300000) { // 5 minutes default
    this.maxSize = maxSize
    this.defaultTTL = defaultTTL
    
    // Clean expired entries every 5 minutes
    setInterval(() => this.cleanup(), 300000)
  }
  
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now()
    const expiresAt = now + (ttl || this.defaultTTL)
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
      accessCount: 0,
      lastAccessed: now
    })
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }
    
    const now = Date.now()
    
    // Check if expired
    if (now > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    // Update access statistics
    entry.accessCount++
    entry.lastAccessed = now
    
    return entry.data as T
  }
  
  has(key: string): boolean {
    return this.get(key) !== null
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key)
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  // Get cache statistics
  getStats(): {
    size: number
    maxSize: number
    hitRate: number
    oldestEntry: number
    newestEntry: number
  } {
    const entries = Array.from(this.cache.values())
    const totalAccess = entries.reduce((sum, entry) => sum + entry.accessCount, 0)
    const hits = entries.filter(entry => entry.accessCount > 0).length
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.cache.size > 0 ? hits / this.cache.size : 0,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : 0,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : 0
    }
  }
  
  private cleanup(): void {
    const now = Date.now()
    const toDelete: string[] = []
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        toDelete.push(key)
      }
    }
    
    toDelete.forEach(key => this.cache.delete(key))
    
    if (toDelete.length > 0) {
      console.log(`Cache cleanup: removed ${toDelete.length} expired entries`)
    }
  }
  
  private evictOldest(): void {
    let oldestKey = ''
    let oldestTime = Infinity
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed
        oldestKey = key
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }
}

// Global cache instances
export const frameworkDetectionCache = new CacheService(500, 600000) // 10 minutes
export const fileAnalysisCache = new CacheService(1000, 300000) // 5 minutes
export const exampleCache = new CacheService(200, 1800000) // 30 minutes
```

**Step 2: Create Framework Detection Caching (1.5 hours)**
```typescript
// src/services/FrameworkDetectionService.ts - Add caching
import { frameworkDetectionCache } from './CacheService'
import crypto from 'crypto'

export class FrameworkDetectionService {
  async detectFrameworks(directoryPath: string): Promise<FrameworkDetectionResult> {
    // Generate cache key based on directory path and modification time
    const cacheKey = await this.generateCacheKey(directoryPath)
    
    // Check cache first
    const cached = frameworkDetectionCache.get<FrameworkDetectionResult>(cacheKey)
    if (cached) {
      console.log(`Framework detection cache hit for ${directoryPath}`)
      return cached
    }
    
    console.log(`Framework detection cache miss for ${directoryPath}`)
    
    // Perform actual detection
    const result = await this.performFrameworkDetection(directoryPath)
    
    // Cache the result
    frameworkDetectionCache.set(cacheKey, result)
    
    return result
  }
  
  private async generateCacheKey(directoryPath: string): Promise<string> {
    try {
      // Include directory modification time in cache key
      const stats = await fs.stat(directoryPath)
      const packageJsonPath = path.join(directoryPath, 'package.json')
      
      let packageJsonMtime = 0
      try {
        const packageStats = await fs.stat(packageJsonPath)
        packageJsonMtime = packageStats.mtime.getTime()
      } catch {
        // package.json doesn't exist
      }
      
      const keyData = `${directoryPath}:${stats.mtime.getTime()}:${packageJsonMtime}`
      return crypto.createHash('sha256').update(keyData).digest('hex').substring(0, 16)
    } catch (error) {
      // Fallback to directory path only
      return crypto.createHash('sha256').update(directoryPath).digest('hex').substring(0, 16)
    }
  }
}
```

**Step 3: Create File Analysis Caching (1.5 hours)**
```typescript
// src/services/FileAnalysisService.ts - Add caching
import { fileAnalysisCache } from './CacheService'

export class FileAnalysisService {
  async analyzeFile(filePath: string): Promise<FileAnalysisResult> {
    // Generate cache key based on file path and modification time
    const cacheKey = await this.generateFileCacheKey(filePath)
    
    // Check cache first
    const cached = fileAnalysisCache.get<FileAnalysisResult>(cacheKey)
    if (cached) {
      return cached
    }
    
    // Perform actual analysis
    const result = await this.performFileAnalysis(filePath)
    
    // Cache the result (smaller TTL for file analysis)
    fileAnalysisCache.set(cacheKey, result, 180000) // 3 minutes
    
    return result
  }
  
  async analyzeDirectory(directoryPath: string): Promise<DirectoryAnalysisResult> {
    const cacheKey = await this.generateDirectoryCacheKey(directoryPath)
    
    const cached = fileAnalysisCache.get<DirectoryAnalysisResult>(cacheKey)
    if (cached) {
      console.log(`Directory analysis cache hit for ${directoryPath}`)
      return cached
    }
    
    console.log(`Directory analysis cache miss for ${directoryPath}`)
    
    const result = await this.performDirectoryAnalysis(directoryPath)
    
    // Cache directory analysis for longer (more expensive operation)
    fileAnalysisCache.set(cacheKey, result, 600000) // 10 minutes
    
    return result
  }
  
  private async generateFileCacheKey(filePath: string): Promise<string> {
    try {
      const stats = await fs.stat(filePath)
      const keyData = `${filePath}:${stats.mtime.getTime()}:${stats.size}`
      return crypto.createHash('sha256').update(keyData).digest('hex').substring(0, 16)
    } catch (error) {
      return crypto.createHash('sha256').update(filePath).digest('hex').substring(0, 16)
    }
  }
}
```

**Step 4: Create Caching Middleware (1 hour)**
```typescript
// src/middleware/caching.ts
import { Request, Response, NextFunction } from 'express'
import { CacheService } from '../services/CacheService'

const routeCache = new CacheService(100, 60000) // 1 minute for API responses

export interface CacheOptions {
  ttl?: number
  keyGenerator?: (req: Request) => string
  condition?: (req: Request, res: Response) => boolean
}

export function cacheMiddleware(options: CacheOptions = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests by default
    if (req.method !== 'GET' && !options.condition) {
      return next()
    }
    
    // Generate cache key
    const cacheKey = options.keyGenerator 
      ? options.keyGenerator(req)
      : `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`
    
    // Check cache
    const cached = routeCache.get(cacheKey)
    if (cached) {
      console.log(`Route cache hit: ${cacheKey}`)
      return res.json(cached)
    }
    
    console.log(`Route cache miss: ${cacheKey}`)
    
    // Intercept response
    const originalJson = res.json
    res.json = function(data: any) {
      // Cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        routeCache.set(cacheKey, data, options.ttl)
      }
      
      // Call original json method
      return originalJson.call(this, data)
    }
    
    next()
  }
}

// Specific caching for different route types
export const cacheExamples = cacheMiddleware({
  ttl: 300000, // 5 minutes - examples don't change often
  keyGenerator: (req) => `examples:${req.path}:${req.params.framework || 'all'}`
})

export const cacheFrameworkDetection = cacheMiddleware({
  ttl: 600000, // 10 minutes - framework detection is expensive
  keyGenerator: (req) => `framework:${req.body.directoryPath}`,
  condition: (req) => req.method === 'POST' && req.path.includes('detect')
})
```

#### Phase 2: Performance Monitoring (Day 2, 4 hours)
**Files to create:**
- `src/utils/performance.ts`
- `src/middleware/performance.ts`

**Step 1: Create Performance Monitoring Utils (2 hours)**
```typescript
// src/utils/performance.ts
export interface PerformanceMetrics {
  timestamp: number
  duration: number
  memory: NodeJS.MemoryUsage
  operation: string
  metadata?: Record<string, any>
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private maxMetrics: number = 1000
  
  startTiming(operation: string): PerformanceTimer {
    return new PerformanceTimer(operation, this)
  }
  
  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric)
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }
    
    // Log slow operations
    if (metric.duration > 5000) { // 5 seconds
      console.warn(`Slow operation detected: ${metric.operation} took ${metric.duration}ms`)
    }
  }
  
  getMetrics(operation?: string): PerformanceMetrics[] {
    if (operation) {
      return this.metrics.filter(m => m.operation === operation)
    }
    return this.metrics.slice()
  }
  
  getAverageTime(operation: string): number {
    const operationMetrics = this.getMetrics(operation)
    if (operationMetrics.length === 0) return 0
    
    const totalTime = operationMetrics.reduce((sum, m) => sum + m.duration, 0)
    return totalTime / operationMetrics.length
  }
  
  getStats(): {
    totalOperations: number
    averageMemoryUsage: number
    slowOperations: PerformanceMetrics[]
    operationCounts: Record<string, number>
  } {
    const slowOperations = this.metrics.filter(m => m.duration > 1000)
    const totalMemory = this.metrics.reduce((sum, m) => sum + m.memory.heapUsed, 0)
    
    const operationCounts = this.metrics.reduce((counts, m) => {
      counts[m.operation] = (counts[m.operation] || 0) + 1
      return counts
    }, {} as Record<string, number>)
    
    return {
      totalOperations: this.metrics.length,
      averageMemoryUsage: this.metrics.length > 0 ? totalMemory / this.metrics.length : 0,
      slowOperations,
      operationCounts
    }
  }
}

export class PerformanceTimer {
  private startTime: number
  private operation: string
  private monitor: PerformanceMonitor
  private metadata: Record<string, any> = {}
  
  constructor(operation: string, monitor: PerformanceMonitor) {
    this.operation = operation
    this.monitor = monitor
    this.startTime = Date.now()
  }
  
  addMetadata(key: string, value: any): void {
    this.metadata[key] = value
  }
  
  end(): number {
    const duration = Date.now() - this.startTime
    const memory = process.memoryUsage()
    
    this.monitor.recordMetric({
      timestamp: this.startTime,
      duration,
      memory,
      operation: this.operation,
      metadata: this.metadata
    })
    
    return duration
  }
}

// Global performance monitor
export const performanceMonitor = new PerformanceMonitor()

// Convenience function for timing async operations
export async function timeOperation<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const timer = performanceMonitor.startTiming(operation)
  
  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      timer.addMetadata(key, value)
    })
  }
  
  try {
    const result = await fn()
    timer.end()
    return result
  } catch (error) {
    timer.addMetadata('error', error.message)
    timer.end()
    throw error
  }
}
```

**Step 2: Create Performance Middleware (1 hour)**
```typescript
// src/middleware/performance.ts
import { Request, Response, NextFunction } from 'express'
import { performanceMonitor } from '../utils/performance'

export interface RequestMetrics {
  method: string
  path: string
  duration: number
  statusCode: number
  contentLength: number
  userAgent?: string
  timestamp: number
}

const requestMetrics: RequestMetrics[] = []

export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  const timer = performanceMonitor.startTiming(`${req.method} ${req.path}`)
  
  // Add request metadata
  timer.addMetadata('method', req.method)
  timer.addMetadata('path', req.path)
  timer.addMetadata('userAgent', req.get('User-Agent'))
  timer.addMetadata('contentLength', req.get('Content-Length') || 0)
  
  // Intercept response end
  const originalEnd = res.end
  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - startTime
    const contentLength = parseInt(res.get('Content-Length') || '0', 10)
    
    // Record request metrics
    requestMetrics.push({
      method: req.method,
      path: req.path,
      duration,
      statusCode: res.statusCode,
      contentLength,
      userAgent: req.get('User-Agent'),
      timestamp: startTime
    })
    
    // End performance timer
    timer.addMetadata('statusCode', res.statusCode)
    timer.addMetadata('responseSize', contentLength)
    timer.end()
    
    // Log slow requests
    if (duration > 2000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`)
    }
    
    // Call original end
    originalEnd.call(this, chunk, encoding)
  }
  
  next()
}

// Memory monitoring
export const memoryMonitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const memoryUsage = process.memoryUsage()
  
  // Warn about high memory usage
  const memoryMB = memoryUsage.heapUsed / 1024 / 1024
  if (memoryMB > 500) { // 500MB threshold
    console.warn(`High memory usage: ${memoryMB.toFixed(2)}MB`)
  }
  
  // Add memory info to response headers in development
  if (process.env.NODE_ENV === 'development') {
    res.set('X-Memory-Usage', `${memoryMB.toFixed(2)}MB`)
  }
  
  next()
}

// Request timeout middleware
export const timeoutMiddleware = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          error: 'Request timeout',
          details: `Request took longer than ${timeoutMs}ms`
        })
      }
    }, timeoutMs)
    
    // Clear timeout when response is sent
    res.on('finish', () => clearTimeout(timeout))
    res.on('close', () => clearTimeout(timeout))
    
    next()
  }
}

// Get request statistics
export function getRequestStats(): {
  totalRequests: number
  averageResponseTime: number
  slowRequests: RequestMetrics[]
  statusCodeCounts: Record<string, number>
  pathCounts: Record<string, number>
} {
  const slowRequests = requestMetrics.filter(m => m.duration > 1000)
  const totalTime = requestMetrics.reduce((sum, m) => sum + m.duration, 0)
  
  const statusCodeCounts = requestMetrics.reduce((counts, m) => {
    counts[m.statusCode] = (counts[m.statusCode] || 0) + 1
    return counts
  }, {} as Record<string, number>)
  
  const pathCounts = requestMetrics.reduce((counts, m) => {
    counts[m.path] = (counts[m.path] || 0) + 1
    return counts
  }, {} as Record<string, number>)
  
  return {
    totalRequests: requestMetrics.length,
    averageResponseTime: requestMetrics.length > 0 ? totalTime / requestMetrics.length : 0,
    slowRequests,
    statusCodeCounts,
    pathCounts
  }
}
```

**Step 3: Add Performance Endpoints (45 minutes)**
```typescript
// src/routes/monitoring.ts
import express from 'express'
import { performanceMonitor } from '../utils/performance'
import { getRequestStats } from '../middleware/performance'
import { frameworkDetectionCache, fileAnalysisCache, exampleCache } from '../services/CacheService'

const router = express.Router()

// Performance statistics
router.get('/performance', (req, res) => {
  const performanceStats = performanceMonitor.getStats()
  const requestStats = getRequestStats()
  
  res.json({
    performance: performanceStats,
    requests: requestStats,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

// Cache statistics
router.get('/cache', (req, res) => {
  res.json({
    frameworkDetection: frameworkDetectionCache.getStats(),
    fileAnalysis: fileAnalysisCache.getStats(),
    examples: exampleCache.getStats(),
    timestamp: new Date().toISOString()
  })
})

// Health check with performance data
router.get('/health', (req, res) => {
  const memory = process.memoryUsage()
  const memoryMB = memory.heapUsed / 1024 / 1024
  
  const health = {
    status: 'healthy',
    uptime: process.uptime(),
    memory: {
      used: `${memoryMB.toFixed(2)}MB`,
      total: `${(memory.heapTotal / 1024 / 1024).toFixed(2)}MB`
    },
    cache: {
      frameworkDetection: frameworkDetectionCache.getStats().size,
      fileAnalysis: fileAnalysisCache.getStats().size,
      examples: exampleCache.getStats().size
    },
    timestamp: new Date().toISOString()
  }
  
  // Mark as unhealthy if memory usage is too high
  if (memoryMB > 1000) { // 1GB threshold
    health.status = 'unhealthy'
  }
  
  res.json(health)
})

export default router
```

**Step 4: Apply Performance Optimizations to Services (15 minutes)**
```typescript
// Update existing services to use performance monitoring
// src/services/TaskGenerationService.ts
import { timeOperation } from '../utils/performance'

export class TaskGenerationService {
  async generateTasks(options: TaskGenerationOptions): Promise<TaskGenerationResult> {
    return timeOperation('task-generation', async () => {
      return this.performTaskGeneration(options)
    }, {
      directoryPath: options.directoryPath,
      maxTaskSize: options.maxTaskSize
    })
  }
}
```

### Acceptance Criteria

- ✅ Caching implemented for expensive operations (framework detection, file analysis)
- ✅ Memory monitoring for large projects with warnings and limits
- ✅ Performance benchmarks and monitoring endpoints established
- ✅ Request timeout handling to prevent hanging requests
- ✅ Cache hit rates above 60% for repeated operations
- ✅ Average response times under 2 seconds for all endpoints
- ✅ Memory usage monitoring with alerts above thresholds

### Dependencies

- All core features completed

## Implementation Timeline

### Months 1-3: Core Business Logic

**Focus: Complete core task generation and scaffold generation**

- Feature 1: Task Generation Service Completion (8-12 weeks)
- Feature 2: Export Service Implementation (3-4 days)
- Feature 3: Example Management Service Implementation (1-2 days)

### Months 4-6: Scaffold System

**Focus: Complete scaffold generation with cross-platform support**

- Feature 4: Scaffold Generation Service Completion (8-12 weeks)
- Feature 5: Command Translation Service Implementation (2-3 days)

### Months 7-12: Framework Detection Enhancement

**Focus: Additional language support (optional - already complete)**

- Features 6-10: Framework Detection (already complete)
- Additional Language Detectors (PHP, Ruby, Swift, Kotlin, Dart, C/C++)

### Months 13-15: API Integration & Testing

**Focus: Connect all services to API routes**

- Feature 11: Task Generator Routes (2 days)
- Feature 12: Scaffold Generator Routes (2 days)
- Feature 13: Example Management Routes (1 day)
- Feature 14: Integration Testing and Validation (1 day)

### Months 16-18: Polish & Production Ready

**Focus: Error handling, performance, documentation**

- Feature 15: Error Handling and Validation (2 days)
- Feature 16: Performance Optimization (2 days)
- Documentation and Examples (1 day)

## Implementation Guidelines

### Code Quality Standards

- **TypeScript**: Strict mode with full type coverage
- **Testing**: 80%+ test coverage for all new code
- **Focus**: Every service must support one or both core tasks
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance**: <500ms for file analysis, <2s for task generation, <1s for script generation
- **Security**: Input validation, path traversal prevention, file size limits

### Development Process

1. **Core Task Focus**: Always ask "Does this support task generation or scaffold generation?"
2. **Test Real Examples**: Use backend/examples for testing
3. **Integration Testing**: Test complete workflows from directory to output files
4. **Performance Testing**: Benchmark with large projects (1000+ files)
5. **Cross-Platform Testing**: Verify scripts work on Windows, macOS, Linux

### Feature Completion Criteria

- **One Feature at a Time**: Complete each feature 100% before starting the next
- **All Tests Pass**: Feature is complete when all its tests pass
- **No Mixed Features**: No mixing of features within implementation phases
- **Clear Dependencies**: Each feature lists exactly what it depends on

## Dependencies and Packages

**New Dependencies to Add:**

```json
{
  "dependencies": {
    "archiver": "^5.3.1", // ZIP file creation for script packages
    "marked": "^4.0.0", // Markdown generation for task files
    "prettier": "^2.8.0", // Code formatting in generated scripts
    "ignore": "^5.2.0", // .gitignore parsing for file filtering
    "semver": "^7.3.0", // Version comparison for framework detection
    "node-cache": "^5.1.2", // Caching for framework detection results
    "iconv-lite": "^0.6.0" // Encoding detection for text files
  },
  "devDependencies": {
    "@types/archiver": "^5.3.1",
    "@types/marked": "^4.0.0",
    "@types/semver": "^7.3.0"
  }
}
```

## Risk Mitigation

### Technical Risks

- **Complexity**: Break down complex features into smaller, testable units
- **Performance**: Implement caching and optimization from the start
- **Memory Usage**: Monitor memory consumption and implement limits
- **File System**: Handle permission errors and edge cases gracefully

### Timeline Risks

- **Scope Creep**: Stick to defined features for initial implementation
- **Testing Time**: Allocate sufficient time for comprehensive testing
- **Integration Issues**: Test with frontend regularly
- **Performance Issues**: Include performance testing in each phase

### Quality Risks

- **Test Coverage**: Maintain high test coverage throughout
- **Documentation**: Document as you go, not at the end
- **Error Handling**: Implement comprehensive error handling
- **Security**: Security review at each phase

## Current Implementation Status

### ✅ **UPDATED: Multi-Language Framework Detection Complete (25% Complete)**

**The framework detection implementation is now complete across 6 languages, but core business logic services remain incomplete.**

#### ✅ Fully Completed (25%)

- **Database Service** with SQLite (settings, templates, recent projects) ✅
- **Framework Detection Service** with 115 frameworks across 6 languages ✅
- **File Analysis Service** with comprehensive text file reading and metadata extraction ✅
- **Export Service Foundation** with multi-format template system ✅
- Basic Express server with route structure and CORS ✅
- TypeScript configuration and build pipeline ✅

#### 🔧 Architecture Complete, Logic Incomplete (50%)

- **Task Generation Service** - Service architecture and interfaces exist, core generation logic needs completion
- **Scaffold Generation Service** - Basic structure exists, missing most API route handlers
- **API Routes** - Route definitions exist, many endpoints return 404 or stub responses

#### ❌ Not Yet Implemented (25%)

- **Example Management System** - Example files exist, service not implemented (0% coverage)
- **Command Translation Service** - No cross-platform command conversion
- **Complete API Integration** - Service-to-route connections incomplete
- **Comprehensive Testing** - 30% test pass rate (265/376 tests passing) vs. target 80%

### ✅ **COMPLETE: Multi-Language Framework Detection (100%)**

**Framework detection is now fully implemented across all major development ecosystems:**

#### **Python Projects (100% Complete)** ✅

- ✅ Detection of requirements.txt, pyproject.toml, setup.py, Pipfile
- ✅ Framework detection for Django, Flask, FastAPI, Pyramid, Tornado, Bottle
- ✅ Python project structure analysis and confidence scoring
- ✅ Poetry, Pipenv, virtualenv configuration detection

#### **Rust Projects (100% Complete)** ✅

- ✅ Detection of Cargo.toml and Cargo.lock
- ✅ Framework detection for Actix-web, Rocket, Axum, Warp, Tide
- ✅ Rust project structure analysis and workspace detection
- ✅ Tauri, Yew, Bevy framework support

#### **.NET Projects (100% Complete)** ✅

- ✅ Detection of .csproj, .sln, .fsproj, .vbproj files
- ✅ Framework detection for ASP.NET Core, Blazor, MAUI, WPF
- ✅ C# project structure analysis and package reference detection
- ✅ Entity Framework and testing framework detection

#### **Go Projects (100% Complete)** ✅

- ✅ Detection of go.mod and go.sum files
- ✅ Framework detection for Gin, Echo, Fiber, Chi, Gorilla Mux
- ✅ Go project structure analysis and module detection
- ✅ gRPC, CLI tools, and testing framework support

#### **Java Projects (100% Complete)** ✅

- ✅ Detection of pom.xml, build.gradle, build.sbt files
- ✅ Framework detection for Spring Boot, Quarkus, Micronaut, Jakarta EE
- ✅ Java project structure analysis and multi-module support
- ✅ Android, testing frameworks, and build system detection

#### **JavaScript/Node.js Projects (Enhanced)** ✅

- ✅ Enhanced package.json analysis with build tools
- ✅ Framework detection for React, Vue, Angular, Next.js, Express, NestJS
- ✅ Build tool detection for Vite, Webpack, Rollup, Parcel
- ✅ Testing framework support for Jest, Vitest, Cypress, Playwright

### ❌ **Critical Missing: Template & Generation Logic (75%)**

**While detection works, the core business logic for generating templates is incomplete:**

#### **Task Generation Templates (5% Complete)**

- ❌ Only 1 generic template vs. 100+ language-specific templates needed
- ❌ No framework-specific task generation (Django, Spring Boot, ASP.NET Core)
- ❌ No project type templates (microservice, library, CLI tool)
- ❌ Limited variable substitution and content generation

#### **Scaffold Generation Logic (25% Complete)**

- ❌ Missing API route handlers (/analyze, /preview, /examples, /validate return 404)
- ❌ Example selection logic not connected to framework detection
- ❌ Cross-platform script generation incomplete
- ❌ Language-specific package manager integration missing

## Success Metrics

### Completion Criteria

- [ ] **File Analysis Service**: Can read any text-based file and extract content
- [ ] **Framework Detection Service**: Identifies 10+ major frameworks accurately
- [ ] **Task Generation Service**: Creates markdown files matching backend/examples format
- [ ] **Scaffold Generation Service**: Generates all 12+ script types simultaneously
- [ ] **Example Management Service**: Accesses local examples and provides UI dropdown options
- [ ] **Export Service**: Outputs properly formatted .md and script files
- [ ] **Route Implementation**: All APIs work with real service implementations
- [ ] **Test Coverage**: 80%+ coverage with tests targeting actual functionality
- [ ] **Integration Tests**: Complete workflows from directory input to file output

### Performance Targets

- **File Analysis**: <500ms for 100 text files
- **Framework Detection**: <200ms per project
- **Task Generation**: <2s for comprehensive project analysis
- **Scaffold Generation**: <1s for all 12+ script formats
- **Memory Usage**: <200MB for large projects (1000+ files)
- **Example Operations**: <100ms for example loading and processing

### Quality Targets

- **Output Accuracy**: Generated files match backend/examples format exactly
- **Cross-Platform**: Scripts work on Windows, macOS, and Linux
- **Error Handling**: Graceful handling of permission errors, large files, corrupted data
- **Security**: No path traversal vulnerabilities, proper file size limits
- **Integration**: Seamless frontend integration with real backend services

```

```

```

```
