# Backend Project Structure

**Focus: Two Core Tasks Only**
1. **📄 Generate AI-Ready Task Files** - Markdown with complete source code
2. **🔧 Generate Cross-Platform Scaffold Scripts** - 12+ formats that recreate projects

## Current Structure

```
backend/
├── README.md                           ✅ Complete
├── BACKEND_FEATURES.md                 ✅ Complete
├── IMPLEMENTATION_PLAN.md              ✅ Complete
├── PROJECT_STRUCTURE.md                ✅ Complete (this file)
├── package.json                        ✅ Complete
├── tsconfig.json                       ✅ Complete
├── jest.config.js                      ✅ Complete
├── .gitignore                          ✅ Complete
├── .eslintrc.js                        ✅ Complete
├── data/                               ✅ Complete
│   └── task-writer.db                  # SQLite database file
├── coverage/                           ✅ Generated
│   └── [test coverage reports]
├── node_modules/                       ✅ Generated
└── src/
    ├── index.ts                        ✅ Complete - Main server entry point
    ├── types/                          🚧 Partial
    │   └── api.ts                      ✅ Complete - API response types
    ├── utils/                          🚧 Partial  
    │   └── dbMigrations.ts             ✅ Complete - Database migration utilities
    ├── services/                       🚧 Partial (20% complete)
    │   ├── DatabaseService.ts          ✅ Complete - SQLite database operations
    │   └── FileSystemService.ts        ✅ Complete - Basic file system operations
    ├── routes/                         🚧 Partial (25% complete)
    │   ├── database.ts                 ✅ Complete - Database API endpoints
    │   ├── fileSystem.ts               ✅ Complete - File system API endpoints
    │   ├── taskGenerator.ts            ❌ Stub only - Task generation endpoints
    │   └── scaffoldGenerator.ts        ❌ Stub only - Scaffold generation endpoints
    ├── controllers/                    📁 Empty directory
    └── __tests__/                      ✅ Test framework complete
        ├── setup.ts                    ✅ Complete - Test setup utilities
        ├── utils/                      📁 Empty directory
        ├── services/                   ✅ Complete
        │   ├── DatabaseService.test.ts ✅ Complete - Database service tests
        │   └── FileSystemService.test.ts ✅ Complete - File system service tests
        ├── routes/                     ✅ Complete (tests for unimplemented features)
        │   ├── database.test.ts        ✅ Complete - Database route tests
        │   ├── fileSystem.test.ts      ✅ Complete - File system route tests
        │   ├── taskGenerator.test.ts   ✅ Complete - Task generator route tests
        │   └── scaffoldGenerator.test.ts ✅ Complete - Scaffold generator route tests
        └── integration.test.ts         ✅ Complete - Full workflow integration tests
```

### ❌ **Critical Missing Services (80%)**
- **FileAnalysisService** - Read any text-based file content and metadata  
- **FrameworkDetectionService** - Identify project types and technologies
- **TaskGenerationService** - Create AI-ready markdown files with source code
- **ScaffoldGenerationService** - Generate 12+ script formats for project setup
- **TemplateManagementService** - Store templates and GitHub integration
- **ExportService** - Output .md files and 12+ script types
- **CommandTranslationService** - Convert commands between platforms

## Planned Structure (After Implementation)

```
backend/
├── README.md                           ✅ Complete
├── BACKEND_FEATURES.md                 ✅ Complete
├── IMPLEMENTATION_PLAN.md              ✅ Complete
├── PROJECT_STRUCTURE.md                ✅ Complete
├── package.json                        ✅ Complete
├── tsconfig.json                       ✅ Complete
├── jest.config.js                      ✅ Complete
├── .gitignore                          ✅ Complete
├── .eslintrc.js                        ✅ Complete
├── data/                               ✅ Complete
│   ├── task-writer.db                  # SQLite database file
│   └── backups/                        📋 Planned - Database backups
├── exports/                            📋 Planned - Generated export files
├── coverage/                           ✅ Generated
├── dist/                               📋 Generated - Compiled JavaScript
├── node_modules/                       ✅ Generated
└── src/
    ├── index.ts                        ✅ Complete
    ├── types/                          🚧 Essential types for core tasks
    │   ├── api.ts                      ✅ Complete
    │   ├── fileAnalysis.ts             📋 **NEEDED** - File content analysis types
    │   ├── framework.ts                📋 **NEEDED** - Framework detection types
    │   ├── task.ts                     📋 **NEEDED** - Task generation types
    │   ├── scaffold.ts                 📋 **NEEDED** - Scaffold generation types
    │   ├── template.ts                 📋 **NEEDED** - Template system types
    │   └── export.ts                   📋 **NEEDED** - Export system types
    ├── utils/                          🚧 Essential utilities for core tasks
    │   ├── dbMigrations.ts             ✅ Complete
    │   ├── fileValidation.ts           📋 **NEEDED** - File type validation
    │   ├── templateEngine.ts           📋 **NEEDED** - Template processing
    │   ├── markdownGeneration.ts       📋 **NEEDED** - Task file generation
    │   ├── scriptGeneration.ts         📋 **NEEDED** - Multi-format script generation
    │   ├── commandTranslation.ts       📋 **NEEDED** - Cross-platform commands
    │   ├── errorHandling.ts            📋 **NEEDED** - Error handling utilities
    │   └── performance.ts              📋 **NEEDED** - Performance monitoring
    ├── services/                       🚧 Core services needed for 2 tasks
    │   ├── DatabaseService.ts          ✅ Complete
    │   ├── FileSystemService.ts        ✅ Complete
    │   ├── FileAnalysisService.ts      📋 **CRITICAL** - Read any text file content
    │   ├── FrameworkDetectionService.ts 📋 **CRITICAL** - Identify project types
    │   ├── TaskGenerationService.ts    📋 **CORE TASK 1** - Generate AI-ready markdown
    │   ├── ScaffoldGenerationService.ts 📋 **CORE TASK 2** - Generate 12+ script formats
    │   ├── TemplateManagementService.ts 📋 **CRITICAL** - Template storage & GitHub
    │   ├── ExportService.ts            📋 **CRITICAL** - Output .md and script files
    │   └── CommandTranslationService.ts 📋 **IMPORTANT** - Cross-platform commands
    ├── middleware/                     📋 Minimal middleware for security
    │   ├── validation.ts               📋 **NEEDED** - Input validation
    │   └── caching.ts                  📋 **NEEDED** - Framework detection caching
    ├── routes/                         🚧 Core APIs for both tasks
    │   ├── database.ts                 ✅ Complete
    │   ├── fileSystem.ts               ✅ Complete
    │   ├── taskGenerator.ts            ❌ **CORE TASK 1 API** - Needs implementation
    │   ├── scaffoldGenerator.ts        ❌ **CORE TASK 2 API** - Needs implementation
    │   └── templates.ts                📋 **NEEDED** - Template management routes
    ├── controllers/                    📁 **NOT NEEDED** - Using services directly
    ├── templates/                      📋 Built-in scaffold templates
    │   ├── react/                      📋 **NEEDED** - React project setup
    │   │   ├── component.tsx.template  📋 **NEEDED** - React component template
    │   │   ├── page.tsx.template       📋 **NEEDED** - React page template
    │   │   └── hook.ts.template        📋 **NEEDED** - Custom hook template
    │   ├── vue/                        📋 **NEEDED** - Vue project setup
    │   │   ├── component.vue.template  📋 **NEEDED** - Vue component template
    │   │   └── composable.ts.template  📋 **NEEDED** - Vue composable template
    │   ├── angular/                    📋 **NEEDED** - Angular project setup
    │   │   ├── component.ts.template   📋 **NEEDED** - Angular component template
    │   │   └── service.ts.template     📋 **NEEDED** - Angular service template
    │   └── express/                    📋 **NEEDED** - Express API setup
    │       ├── route.ts.template       📋 **NEEDED** - Express route template
    │       └── middleware.ts.template  📋 **NEEDED** - Express middleware template
    ├── data/                           📋 Framework detection data
    │   ├── frameworks.json             📋 **NEEDED** - Framework detection rules
    │   └── fileTypes.json              📋 **NEEDED** - File type classifications
    └── __tests__/                      ✅ Framework complete
        ├── setup.ts                    ✅ Complete
        ├── fixtures/                   📋 Planned - Test data and fixtures
        │   ├── projects/               📋 Planned - Sample project structures
        │   ├── templates/              📋 Planned - Test templates
        │   └── responses/              📋 Planned - Expected API responses
        ├── utils/                      📋 Planned - Test utilities
        │   ├── testDatabase.ts         📋 Planned - Test database helpers
        │   ├── mockFileSystem.ts       📋 Planned - File system mocking
        │   └── apiHelpers.ts           📋 Planned - API testing helpers
        ├── services/                   🚧 Tests for core services
        │   ├── DatabaseService.test.ts ✅ Complete
        │   ├── FileSystemService.test.ts ✅ Complete
        │   ├── FileAnalysisService.test.ts 📋 **NEEDED** - File reading tests
        │   ├── FrameworkDetectionService.test.ts 📋 **NEEDED** - Framework detection tests
        │   ├── TaskGenerationService.test.ts 📋 **NEEDED** - Task generation tests
        │   ├── ScaffoldGenerationService.test.ts 📋 **NEEDED** - Scaffold generation tests
        │   ├── TemplateManagementService.test.ts 📋 **NEEDED** - Template tests
        │   └── ExportService.test.ts   📋 **NEEDED** - Export tests
        ├── routes/                     🚧 API endpoint tests
        │   ├── database.test.ts        ✅ Complete
        │   ├── fileSystem.test.ts      ✅ Complete
        │   ├── taskGenerator.test.ts   🚧 **UPDATE NEEDED** - Test real implementation
        │   ├── scaffoldGenerator.test.ts 🚧 **UPDATE NEEDED** - Test real implementation
        │   └── templates.test.ts       📋 **NEEDED** - Template API tests
        ├── integration/                📋 Planned - Separate integration tests
        │   ├── fullWorkflow.test.ts    📋 Planned - Complete workflow tests
        │   ├── performance.test.ts     📋 Planned - Performance benchmarks
        │   └── security.test.ts        📋 Planned - Security testing
        ├── unit/                       📋 Planned - Pure unit tests
        └── e2e/                        📋 Planned - End-to-end tests
```

## File Size and Complexity Estimates

### Current Implementation
- **Total Files**: 25 files
- **Lines of Code**: ~3,500 lines
- **Test Coverage**: 0% (tests exist but target unimplemented features)
- **Implementation**: 20% complete

### Planned Implementation (Focused on Core Tasks)
- **Total Files**: ~50-60 files (reduced scope)
- **Lines of Code**: ~8,000-12,000 lines (focused implementation)
- **Test Coverage**: 80%+ target
- **Implementation**: 100% complete for both core tasks

## Directory Purposes

### `/src/services/`
Core business logic services focused on the two main tasks:
- **File Analysis** - Read any text-based file content and metadata
- **Framework Detection** - Identify project types and technologies  
- **Task Generation** - Create AI-ready markdown files with source code
- **Scaffold Generation** - Generate 12+ script formats for project setup
- **Template Management** - Store templates and provide GitHub integration
- **Export** - Output .md files and 12+ script types
- **Command Translation** - Convert commands between platforms

### `/src/routes/`
Express.js route handlers for the core task APIs:
- **Database routes** - Settings and project data management
- **File system routes** - File operations and directory scanning
- **Task generator routes** - **CORE TASK 1 API** - Generate AI-ready task files
- **Scaffold generator routes** - **CORE TASK 2 API** - Generate cross-platform scripts
- **Template routes** - Template management API

### `/src/types/`
TypeScript type definitions for core functionality:
- **API types** - Request/response structures
- **File Analysis types** - File content and metadata
- **Framework types** - Framework detection results
- **Task types** - Task generation structures
- **Scaffold types** - Script generation structures
- **Template types** - Template system structures
- **Export types** - Export format structures

### `/src/utils/`
Utility functions supporting core tasks:
- **File validation** - File type and encoding detection
- **Template engine** - Variable substitution and rendering
- **Markdown generation** - Task file creation utilities
- **Script generation** - Multi-format script creation
- **Command translation** - Cross-platform command conversion
- **Error handling** - Centralized error management
- **Performance monitoring** - Metrics and benchmarking

### `/src/templates/`
Built-in scaffold templates for project setup:
- **React templates** - React component and project templates
- **Vue templates** - Vue component and project templates
- **Angular templates** - Angular component and service templates
- **Express templates** - Node.js API templates

### `/src/__tests__/`
Comprehensive test suite:
- **Unit tests** - Individual function/service testing
- **Integration tests** - Multi-service workflow testing
- **Route tests** - API endpoint testing
- **Performance tests** - Load and stress testing
- **Security tests** - Security vulnerability testing

## Key Design Principles

### Core Task Focus
- Every service must directly support one or both core tasks
- **Task Generation**: AI-ready markdown files with source code
- **Scaffold Generation**: Cross-platform scripts in 12+ formats
- No over-engineering beyond these requirements

### Separation of Concerns
- **Routes** handle HTTP requests/responses only
- **Services** contain all business logic for core tasks
- **Utils** provide utilities for file processing and generation
- **Types** define data structures for core functionality

### Error Handling
- Graceful handling of file permission errors
- Clear error messages for invalid file types
- Path traversal prevention for security
- File size limits to prevent memory issues

### Performance
- Framework detection result caching
- Efficient file reading for large projects
- Memory monitoring for projects with 1000+ files
- Streaming for large file operations

### Security
- Input validation for file paths
- Path traversal prevention
- File type validation (text vs binary)
- File size limits and request timeouts

### Testability
- Test against real examples in backend/examples
- Integration tests for complete workflows
- Performance tests with large projects
- Cross-platform compatibility testing