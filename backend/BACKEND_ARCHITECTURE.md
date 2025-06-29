# Backend Architecture Guide

**Task Writer Backend - Design Patterns, Best Practices, and Implementation Strategy**

## Overview

This document outlines the architectural decisions, design patterns, and best practices that will guide the implementation of the Task Writer backend. The backend serves **two core functions**:

1. **📄 Generate AI-Ready Task Files** - Markdown files with complete source code inclusion
2. **🔧 Generate Cross-Platform Scaffold Scripts** - 12+ script formats that recreate project structures

Every architectural decision is made to support these core tasks efficiently, securely, and maintainably.

## 🎯 Core Design Principles

### 1. **Core Task Alignment**
- **Single Responsibility**: Each service has one clear purpose aligned with core tasks
- **Direct Value**: Every service directly supports task generation or scaffold generation
- **No Over-Engineering**: Avoid complex features not required for core functionality
- **Clear Boundaries**: Services have well-defined inputs, outputs, and responsibilities

### 2. **Simplicity First**
- **Focused Implementation**: Implement only what's needed for the two core tasks
- **Clear Data Flow**: Input → Process → Output with minimal complexity
- **Explicit Dependencies**: Clear service dependencies with no circular references
- **Readable Code**: Code that clearly expresses intent and business logic

### 3. **Performance by Design**
- **Efficient File Operations**: Stream large files, cache detection results
- **Memory Management**: Monitor memory usage for large projects (1000+ files)
- **Response Time Targets**: <500ms file analysis, <2s task generation, <1s script generation
- **Scalable Architecture**: Handle projects of varying sizes gracefully

### 4. **Security by Default**
- **Input Validation**: Validate all file paths and user inputs
- **Path Traversal Prevention**: Prevent access outside allowed directories
- **File Type Validation**: Distinguish text files from binary files
- **Resource Limits**: File size limits, request timeouts, memory limits

## 🏗️ Architecture Patterns

### **Layered Architecture**

```
┌─────────────────────────────────────────┐
│             HTTP Layer                  │
│         (Express Routes)                │
│   - Request/Response handling           │
│   - Input validation                    │
│   - Error formatting                    │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│           Business Logic Layer          │
│             (Services)                  │
│   - Core task implementations          │
│   - Framework detection                 │
│   - File analysis and generation        │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│           Data Access Layer             │
│        (Database/File System)          │
│   - SQLite database operations         │
│   - File system interactions           │
│   - Template storage                    │
└─────────────────────────────────────────┘
```

**Benefits**:
- Clear separation of concerns
- Easy to test individual layers
- Maintainable and scalable
- Follows Express.js conventions

### **Service-Oriented Architecture**

Each service is a standalone module with:
- **Single Responsibility**: One clear purpose
- **Well-Defined Interface**: Clear input/output contracts
- **Minimal Dependencies**: Only depend on what's necessary
- **Testable**: Easy to mock and unit test

```typescript
interface IService<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
```

### **Dependency Injection Pattern**

Services receive dependencies through constructor injection:

```typescript
class TaskGenerationService {
  constructor(
    private fileAnalysisService: FileAnalysisService,
    private frameworkDetectionService: FrameworkDetectionService
  ) {}
}
```

**Benefits**:
- Easy to test with mocked dependencies
- Clear dependency relationships
- Flexible service composition
- Follows SOLID principles

## 📁 Service Architecture

### **1. File Analysis Service** ⭐⭐⭐ **CRITICAL**

**Purpose**: Read any text-based file to extract content for task generation

**Design Pattern**: **Factory Pattern** for file processors
```typescript
interface FileProcessor {
  canProcess(filePath: string): boolean;
  process(filePath: string): Promise<FileAnalysisResult>;
}

class FileProcessorFactory {
  private processors: FileProcessor[] = [
    new TextFileProcessor(),
    new CodeFileProcessor(),
    new ConfigFileProcessor()
  ];

  getProcessor(filePath: string): FileProcessor {
    return this.processors.find(p => p.canProcess(filePath)) 
      || new DefaultFileProcessor();
  }
}
```

**Key Decisions**:
- **Encoding Detection**: Use `iconv-lite` for robust encoding detection
- **Binary File Filtering**: Check for null bytes and non-printable character percentage
- **Error Handling**: Graceful degradation for permission errors
- **Performance**: Stream large files to avoid memory issues

**Implementation Strategy**:
```typescript
class FileAnalysisService {
  async analyzeFile(filePath: string): Promise<FileAnalysisResult> {
    // 1. Validate file path (security)
    this.validatePath(filePath);
    
    // 2. Check file type (binary vs text)
    const fileType = await this.detectFileType(filePath);
    if (fileType === 'binary') {
      throw new Error('Binary files not supported');
    }
    
    // 3. Detect encoding
    const encoding = await this.detectEncoding(filePath);
    
    // 4. Read content with streaming for large files
    const content = await this.readFileContent(filePath, encoding);
    
    // 5. Extract metadata
    const metadata = await this.extractMetadata(filePath);
    
    return {
      path: filePath,
      content,
      metadata,
      encoding
    };
  }
}
```

### **2. Framework Detection Service** ⭐⭐⭐ **CRITICAL**

**Purpose**: Identify project types to create framework-specific tasks and templates

**Design Pattern**: **Strategy Pattern** with **Chain of Responsibility**
```typescript
interface FrameworkDetector {
  detect(projectPath: string): Promise<FrameworkDetectionResult>;
  getConfidence(): number;
}

class FrameworkDetectionService {
  private detectors: FrameworkDetector[] = [
    new PackageJsonDetector(),
    new ConfigFileDetector(),
    new FilePatternDetector()
  ];

  async detectFrameworks(projectPath: string): Promise<FrameworkDetectionResult> {
    const results = await Promise.all(
      this.detectors.map(detector => detector.detect(projectPath))
    );
    
    return this.consolidateResults(results);
  }
}
```

**Key Decisions**:
- **Multiple Detection Methods**: Package.json, config files, file patterns
- **Confidence Scoring**: Weight different detection methods
- **Caching**: Cache results per project path to avoid re-detection
- **Framework Database**: JSON file with detection rules

**Implementation Strategy**:
```typescript
class PackageJsonDetector implements FrameworkDetector {
  async detect(projectPath: string): Promise<FrameworkDetectionResult> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (!await fs.pathExists(packageJsonPath)) {
      return { frameworks: [], confidence: 0 };
    }
    
    const packageJson = await fs.readJson(packageJsonPath);
    const frameworks = this.analyzePackageJson(packageJson);
    
    return {
      frameworks,
      confidence: this.calculateConfidence(frameworks),
      evidence: {
        packageJson: Object.keys(packageJson.dependencies || {})
      }
    };
  }
}
```

### **3. Task Generation Service** ⭐⭐⭐ **CORE TASK 1**

**Purpose**: Generate AI-ready markdown files with complete source code - **THIS IS CORE TASK 1**

**Design Pattern**: **Template Method Pattern** with **Builder Pattern**
```typescript
abstract class TaskGenerator {
  // Template method defining the algorithm
  async generateTask(input: TaskGenerationInput): Promise<TaskResult> {
    const analysisResults = await this.analyzeFiles(input.files);
    const frameworkInfo = await this.detectFramework(input.projectPath);
    const taskStructure = this.createTaskStructure(analysisResults, frameworkInfo);
    const markdown = this.generateMarkdown(taskStructure, input.customInstructions);
    
    return this.finalizeTask(markdown);
  }

  // Abstract methods for customization
  protected abstract createTaskStructure(
    analysis: FileAnalysisResult[], 
    framework: FrameworkDetectionResult
  ): TaskStructure;
}

class MarkdownTaskBuilder {
  private task: TaskStructure = new TaskStructure();

  addCustomInstructions(instructions: string): this {
    this.task.customInstructions = instructions;
    return this;
  }

  addFileSection(file: FileAnalysisResult): this {
    this.task.fileSections.push(this.createFileSection(file));
    return this;
  }

  build(): string {
    return this.renderMarkdown(this.task);
  }
}
```

**Key Decisions**:
- **Exact Format Matching**: Generate markdown matching `backend/examples` exactly
- **Syntax Highlighting**: Use language detection for proper code blocks
- **File Organization**: Logical grouping by directory or functionality
- **Custom Instructions**: Always include user's custom context at the top

**Implementation Strategy**:
```typescript
class TaskGenerationService {
  async generateTasks(input: TaskGenerationInput): Promise<TaskGenerationResult> {
    // 1. Analyze all files in the directory
    const fileAnalysis = await Promise.all(
      input.files.map(file => this.fileAnalysisService.analyzeFile(file))
    );

    // 2. Detect framework for context
    const frameworkInfo = await this.frameworkDetectionService.detectFrameworks(
      input.projectPath
    );

    // 3. Group files logically
    const fileGroups = this.groupFilesByLogic(fileAnalysis, frameworkInfo);

    // 4. Generate task files
    const tasks = fileGroups.map((group, index) => {
      const builder = new MarkdownTaskBuilder()
        .addCustomInstructions(input.customInstructions)
        .addTaskHeader(`task_01.${index}`, group.title)
        .addDirectoryStructure(group.files)
        .addFileSections(group.files);

      return {
        id: `task_01.${index}`,
        filename: `task_01.${index}.md`,
        content: builder.build()
      };
    });

    return { tasks, summary: this.createSummary(tasks) };
  }
}
```

### **4. Scaffold Generation Service** ⭐⭐⭐ **CORE TASK 2**

**Purpose**: Generate 12+ cross-platform scripts that recreate project structures - **THIS IS CORE TASK 2**

**Design Pattern**: **Abstract Factory Pattern** with **Adapter Pattern**
```typescript
interface ScriptGenerator {
  generateScript(template: Template, variables: Variables): Promise<string>;
  getFileExtension(): string;
  getPlatform(): Platform;
}

class ScriptGeneratorFactory {
  createGenerator(format: ScriptFormat): ScriptGenerator {
    switch (format) {
      case 'bash': return new BashScriptGenerator();
      case 'powershell': return new PowerShellScriptGenerator();
      case 'python': return new PythonScriptGenerator();
      // ... 12+ formats
    }
  }
}

class PowerShellScriptGenerator implements ScriptGenerator {
  generateScript(template: Template, variables: Variables): Promise<string> {
    const adapter = new PowerShellCommandAdapter();
    const commands = template.commands.map(cmd => adapter.adapt(cmd));
    
    return this.renderPowerShellScript(commands, variables);
  }
}
```

**Key Decisions**:
- **All Formats Simultaneously**: Generate all 12+ script types in one operation
- **Template-Based**: Use templates for consistent structure
- **Variable Substitution**: Support project name, paths, dependencies
- **Command Translation**: Adapt commands for each platform
- **scaffold-scripts Compatibility**: Ensure generated scripts work with existing CLI

**Implementation Strategy**:
```typescript
class ScaffoldGenerationService {
  async generateScaffolds(input: ScaffoldGenerationInput): Promise<ScaffoldGenerationResult> {
    // 1. Load template
    const template = await this.templateManagementService.getTemplate(input.templateId);

    // 2. Prepare variables
    const variables = {
      projectName: input.projectName,
      targetPath: input.targetPath,
      ...input.customVariables
    };

    // 3. Generate all script formats
    const scriptFormats: ScriptFormat[] = [
      'bash', 'sh', 'zsh', 'fish',           // Unix shells
      'powershell', 'psm1', 'bat', 'cmd',   // Windows
      'python', 'javascript', 'typescript', 'ruby', 'perl', 'text'  // Languages
    ];

    const scripts = await Promise.all(
      scriptFormats.map(async format => {
        const generator = this.scriptGeneratorFactory.createGenerator(format);
        const content = await generator.generateScript(template, variables);
        
        return {
          filename: `${input.projectName}.${generator.getFileExtension()}`,
          format,
          content,
          platform: generator.getPlatform(),
          executable: generator.isExecutable()
        };
      })
    );

    return {
      scripts,
      metadata: this.createMetadata(template, variables),
      instructions: this.createUsageInstructions(scripts)
    };
  }
}
```

### **5. Template Management Service** ⭐⭐⭐ **CRITICAL**

**Purpose**: Store templates and provide GitHub integration for scaffold generation

**Design Pattern**: **Repository Pattern** with **Facade Pattern**
```typescript
interface TemplateRepository {
  save(template: Template): Promise<void>;
  findById(id: string): Promise<Template>;
  findByFramework(framework: string): Promise<Template[]>;
  delete(id: string): Promise<void>;
}

interface GitHubTemplateProvider {
  downloadTemplate(repoUrl: string): Promise<Template>;
  listTemplates(organization: string): Promise<TemplateMetadata[]>;
}

class TemplateManagementService {
  constructor(
    private repository: TemplateRepository,
    private githubProvider: GitHubTemplateProvider,
    private templateEngine: TemplateEngine
  ) {}

  // Facade methods that coordinate multiple operations
  async downloadAndStore(githubUrl: string): Promise<Template> {
    const template = await this.githubProvider.downloadTemplate(githubUrl);
    const validatedTemplate = await this.validateTemplate(template);
    await this.repository.save(validatedTemplate);
    return validatedTemplate;
  }
}
```

**Key Decisions**:
- **SQLite Storage**: Store templates in database for offline access
- **GitHub Integration**: Download templates directly from repositories
- **Version Control**: Track template versions and updates
- **Variable System**: Support {{projectName}}, {{framework}}, etc.
- **Validation**: Ensure template structure is correct

### **6. Export Service** ⭐⭐⭐ **CRITICAL**

**Purpose**: Generate the actual output files users need

**Design Pattern**: **Visitor Pattern** with **Chain of Responsibility**
```typescript
interface ExportFormatter {
  canHandle(format: ExportFormat): boolean;
  format(data: ExportData): Promise<FormattedOutput>;
}

class ExportService {
  private formatters: ExportFormatter[] = [
    new MarkdownFormatter(),
    new ScriptFormatter(),
    new ArchiveFormatter()
  ];

  async export(data: ExportData, format: ExportFormat): Promise<ExportResult> {
    const formatter = this.formatters.find(f => f.canHandle(format));
    if (!formatter) {
      throw new Error(`Unsupported format: ${format}`);
    }

    const output = await formatter.format(data);
    return this.finalizeExport(output);
  }
}
```

**Key Decisions**:
- **Multiple Formats**: .md files and 12+ script types
- **Cross-Platform Handling**: Proper line endings, file permissions, encoding
- **Batch Operations**: Export multiple files simultaneously
- **Archive Creation**: ZIP files for script packages

### **7. Command Translation Service** ⭐⭐ **IMPORTANT**

**Purpose**: Convert commands between different platform syntaxes

**Design Pattern**: **Command Pattern** with **Translator Pattern**
```typescript
interface Command {
  getType(): CommandType;
  getParameters(): Record<string, any>;
}

interface CommandTranslator {
  canTranslate(command: Command, targetPlatform: Platform): boolean;
  translate(command: Command, targetPlatform: Platform): string;
}

class CommandTranslationService {
  private translators: CommandTranslator[] = [
    new FileOperationTranslator(),
    new PackageManagerTranslator(),
    new VariableTranslator()
  ];

  translateCommand(command: Command, targetPlatform: Platform): string {
    const translator = this.translators.find(t => 
      t.canTranslate(command, targetPlatform)
    );
    
    if (!translator) {
      throw new UnsupportedCommandError(command, targetPlatform);
    }

    return translator.translate(command, targetPlatform);
  }
}
```

**Key Decisions**:
- **Basic Commands Only**: mkdir, touch, cd, copy, move
- **Platform-Specific Syntax**: Handle path separators, variables, command chaining
- **Graceful Degradation**: Error handling for unsupported conversions
- **Extensible**: Easy to add new command types

## 📊 Data Flow Architecture

### **Task Generation Flow**
```
User Input (Directory + Instructions)
           ↓
    FileSystemService (scan directory)
           ↓
    FileAnalysisService (read all text files)
           ↓
    FrameworkDetectionService (identify project type)
           ↓
    TaskGenerationService (create markdown)
           ↓
    ExportService (output .md files)
           ↓
    Final Output (AI-ready task files)
```

### **Scaffold Generation Flow**
```
User Input (Template + Project Name)
           ↓
    TemplateManagementService (load template)
           ↓
    FrameworkDetectionService (identify target framework)
           ↓
    ScaffoldGenerationService (apply template)
           ↓
    CommandTranslationService (convert to all platforms)
           ↓
    ExportService (output 12+ script files)
           ↓
    Final Output (Cross-platform scripts)
```

## 🔒 Security Architecture

### **Input Validation Strategy**
```typescript
class SecurityValidator {
  validateFilePath(filePath: string): void {
    // 1. Path traversal prevention
    if (filePath.includes('..') || filePath.includes('~')) {
      throw new SecurityError('Invalid path: path traversal detected');
    }

    // 2. Allowed directories only
    const allowedPaths = ['/home', '/Users', 'C:\\Users'];
    if (!allowedPaths.some(allowed => filePath.startsWith(allowed))) {
      throw new SecurityError('Access denied: path outside allowed directories');
    }

    // 3. File size limits
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      throw new SecurityError('File too large');
    }
  }
}
```

### **File Type Validation**
```typescript
class FileTypeValidator {
  async isTextFile(filePath: string): Promise<boolean> {
    const buffer = await fs.readFile(filePath);
    
    // Check for binary indicators
    const nullByteIndex = buffer.indexOf(0);
    if (nullByteIndex !== -1 && nullByteIndex < 8000) {
      return false; // Likely binary
    }

    // Check character distribution
    const nonPrintableCount = buffer.filter(byte => 
      byte < 32 && byte !== 9 && byte !== 10 && byte !== 13
    ).length;
    
    return (nonPrintableCount / buffer.length) < 0.3;
  }
}
```

## ⚡ Performance Architecture

### **Caching Strategy**
```typescript
class CacheManager {
  private fileAnalysisCache = new NodeCache({ stdTTL: 3600 }); // 1 hour
  private frameworkCache = new NodeCache({ stdTTL: 7200 });   // 2 hours

  async getCachedFileAnalysis(filePath: string): Promise<FileAnalysisResult | null> {
    const stat = await fs.stat(filePath);
    const cacheKey = `${filePath}:${stat.mtime.getTime()}`;
    
    return this.fileAnalysisCache.get(cacheKey) || null;
  }

  setCachedFileAnalysis(filePath: string, result: FileAnalysisResult): void {
    const stat = fs.statSync(filePath);
    const cacheKey = `${filePath}:${stat.mtime.getTime()}`;
    
    this.fileAnalysisCache.set(cacheKey, result);
  }
}
```

### **Memory Management**
```typescript
class MemoryManager {
  private readonly MAX_MEMORY_USAGE = 200 * 1024 * 1024; // 200MB

  checkMemoryUsage(): void {
    const usage = process.memoryUsage();
    
    if (usage.heapUsed > this.MAX_MEMORY_USAGE) {
      // Force garbage collection
      if (global.gc) {
        global.gc();
      }
      
      // If still over limit, throw error
      if (process.memoryUsage().heapUsed > this.MAX_MEMORY_USAGE) {
        throw new Error('Memory limit exceeded');
      }
    }
  }
}
```

### **Streaming for Large Files**
```typescript
class LargeFileProcessor {
  async processLargeFile(filePath: string): Promise<FileAnalysisResult> {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    let content = '';
    let lineCount = 0;

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: string) => {
        content += chunk;
        lineCount += (chunk.match(/\n/g) || []).length;
        
        // Memory protection
        if (content.length > MAX_CONTENT_SIZE) {
          stream.destroy();
          reject(new Error('File too large to process'));
        }
      });

      stream.on('end', () => {
        resolve({
          content,
          lineCount,
          // ... other metadata
        });
      });

      stream.on('error', reject);
    });
  }
}
```

## 🧪 Testing Architecture

### **Testing Strategy**
```typescript
// Unit Tests - Test individual services
describe('FileAnalysisService', () => {
  let service: FileAnalysisService;
  let mockFileSystem: jest.Mocked<FileSystemService>;

  beforeEach(() => {
    mockFileSystem = createMockFileSystemService();
    service = new FileAnalysisService(mockFileSystem);
  });

  it('should read text file content', async () => {
    // Arrange
    mockFileSystem.readFile.mockResolvedValue('file content');
    
    // Act
    const result = await service.analyzeFile('/test/file.txt');
    
    // Assert
    expect(result.content).toBe('file content');
  });
});

// Integration Tests - Test service interactions
describe('Task Generation Integration', () => {
  it('should generate task file from directory', async () => {
    // Arrange - use real examples from backend/examples
    const testDirectory = '/test/react-project';
    
    // Act
    const result = await taskGenerationService.generateTasks({
      projectPath: testDirectory,
      customInstructions: 'Focus on React patterns'
    });
    
    // Assert
    expect(result.tasks).toHaveLength(1);
    expect(result.tasks[0].content).toContain('# Custom Instructions');
    expect(result.tasks[0].content).toContain('Focus on React patterns');
  });
});

// Performance Tests - Test with large projects
describe('Performance Tests', () => {
  it('should handle 1000+ files within time limits', async () => {
    const startTime = Date.now();
    
    const result = await fileAnalysisService.analyzeDirectory('/large-project');
    
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(5000); // 5 seconds max
  });
});
```

### **Test Data Strategy**
- **Real Examples**: Use files from `backend/examples` for integration tests
- **Mock Data**: Create realistic mock data for unit tests
- **Edge Cases**: Test with empty files, binary files, permission errors
- **Performance Data**: Test with projects of various sizes

## 📋 Error Handling Architecture

### **Error Hierarchy**
```typescript
abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;
}

class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly isOperational = true;
}

class SecurityError extends AppError {
  readonly statusCode = 403;
  readonly isOperational = true;
}

class FileNotFoundError extends AppError {
  readonly statusCode = 404;
  readonly isOperational = true;
}

class InternalError extends AppError {
  readonly statusCode = 500;
  readonly isOperational = false;
}
```

### **Error Handling Middleware**
```typescript
class ErrorHandler {
  handleError(error: Error, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof AppError && error.isOperational) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message
      });
    } else {
      // Log unexpected errors
      console.error('Unexpected error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
```

## 🔧 Configuration Architecture

### **Environment-Based Configuration**
```typescript
interface AppConfig {
  database: {
    path: string;
    maxConnections: number;
  };
  fileSystem: {
    maxFileSize: number;
    allowedExtensions: string[];
    tempDirectory: string;
  };
  performance: {
    cacheTimeout: number;
    maxMemoryUsage: number;
    requestTimeout: number;
  };
  security: {
    allowedPaths: string[];
    maxRequestSize: number;
  };
}

class ConfigManager {
  private config: AppConfig;

  constructor() {
    this.config = {
      database: {
        path: process.env.DATABASE_PATH || './data/task-writer.db',
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10')
      },
      fileSystem: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
        allowedExtensions: (process.env.ALLOWED_EXTENSIONS || '.js,.ts,.jsx,.tsx,.vue,.py,.rb').split(','),
        tempDirectory: process.env.TEMP_DIR || './temp'
      },
      // ... other config sections
    };
  }
}
```

## 📈 Monitoring and Observability

### **Performance Monitoring**
```typescript
class PerformanceMonitor {
  private metrics = new Map<string, number[]>();

  measureExecution<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const startTime = Date.now();
    
    return fn().finally(() => {
      const duration = Date.now() - startTime;
      this.recordMetric(operation, duration);
    });
  }

  private recordMetric(operation: string, duration: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    
    const durations = this.metrics.get(operation)!;
    durations.push(duration);
    
    // Keep only last 100 measurements
    if (durations.length > 100) {
      durations.shift();
    }
  }

  getAverageTime(operation: string): number {
    const durations = this.metrics.get(operation) || [];
    return durations.reduce((sum, d) => sum + d, 0) / durations.length;
  }
}
```

### **Health Checks**
```typescript
class HealthChecker {
  async checkHealth(): Promise<HealthStatus> {
    const checks = await Promise.all([
      this.checkDatabase(),
      this.checkFileSystem(),
      this.checkMemoryUsage(),
      this.checkDiskSpace()
    ]);

    return {
      status: checks.every(check => check.healthy) ? 'healthy' : 'unhealthy',
      checks,
      timestamp: new Date()
    };
  }

  private async checkDatabase(): Promise<HealthCheck> {
    try {
      await this.databaseService.ping();
      return { name: 'database', healthy: true };
    } catch (error) {
      return { name: 'database', healthy: false, error: error.message };
    }
  }
}
```

## 📚 Implementation Roadmap

### **Week 1: Foundation Services**
1. **File Analysis Service**
   - Implement core file reading with encoding detection
   - Add binary file filtering and validation
   - Create comprehensive error handling
   - Write unit tests with mock file system

2. **Framework Detection Service**
   - Implement package.json parsing
   - Add config file detection
   - Create framework database with rules
   - Add caching layer for performance

### **Week 2: Core Generation**
3. **Task Generation Service**
   - Implement markdown generation matching examples
   - Add custom instruction integration
   - Create file grouping logic
   - Write integration tests with real examples

4. **Scaffold Generation Service**
   - Implement multi-format script generation
   - Add template application logic
   - Create variable substitution system
   - Test all 12+ script formats

### **Week 3-5: Supporting Services & Integration**
5. **Template Management** - GitHub integration and local storage
6. **Export Service** - Multi-format output with proper encoding
7. **Command Translation** - Cross-platform command conversion
8. **Route Implementation** - Connect services to API endpoints
9. **Testing & Performance** - Comprehensive testing and optimization

## 🚫 Antipatterns to Avoid

### **1. God Object Antipattern**
**Problem**: Creating massive services that do everything
**Example of What NOT to Do**:
```typescript
// ❌ BAD - God object doing everything
class TaskWriterService {
  scanFiles() { /* ... */ }
  detectFramework() { /* ... */ }
  generateTasks() { /* ... */ }
  generateScaffolds() { /* ... */ }
  manageTemplates() { /* ... */ }
  exportFiles() { /* ... */ }
  translateCommands() { /* ... */ }
  // 500+ lines of mixed responsibilities
}
```

**How I'll Avoid It**:
```typescript
// ✅ GOOD - Single responsibility services
class FileAnalysisService {
  analyzeFile(filePath: string): Promise<FileAnalysisResult> { /* focused logic */ }
}

class FrameworkDetectionService {
  detectFrameworks(projectPath: string): Promise<FrameworkDetectionResult> { /* focused logic */ }
}

class TaskGenerationService {
  constructor(
    private fileAnalysisService: FileAnalysisService,
    private frameworkDetectionService: FrameworkDetectionService
  ) {}
  
  generateTasks(input: TaskGenerationInput): Promise<TaskGenerationResult> { /* focused logic */ }
}
```

**Prevention Strategy**:
- Each service has ONE clear responsibility
- Services under 200 lines when possible
- Use composition over monolithic classes
- Regular refactoring to extract concerns

### **2. Tight Coupling Antipattern**
**Problem**: Services directly depending on concrete implementations
**Example of What NOT to Do**:
```typescript
// ❌ BAD - Tight coupling
class TaskGenerationService {
  private fileService = new FileSystemService(); // Hard dependency
  private frameworkService = new FrameworkDetectionService(); // Hard dependency
  
  async generateTasks(input: any) {
    // Tightly coupled to specific implementations
    const files = this.fileService.scanDirectory(input.path);
    const framework = this.frameworkService.detect(input.path);
  }
}
```

**How I'll Avoid It**:
```typescript
// ✅ GOOD - Dependency injection with interfaces
interface IFileAnalysisService {
  analyzeFile(filePath: string): Promise<FileAnalysisResult>;
}

interface IFrameworkDetectionService {
  detectFrameworks(projectPath: string): Promise<FrameworkDetectionResult>;
}

class TaskGenerationService {
  constructor(
    private fileAnalysisService: IFileAnalysisService,
    private frameworkDetectionService: IFrameworkDetectionService
  ) {}
  
  async generateTasks(input: TaskGenerationInput): Promise<TaskGenerationResult> {
    // Loose coupling through interfaces
  }
}
```

**Prevention Strategy**:
- Always inject dependencies through constructor
- Use interfaces to define contracts
- Never use `new` inside service methods
- Make dependencies explicit and testable

### **3. Shotgun Surgery Antipattern**
**Problem**: Changes require modifications across many files
**Example of What NOT to Do**:
```typescript
// ❌ BAD - Scattered file path logic
class FileAnalysisService {
  analyzeFile(path: string) {
    if (path.includes('..')) throw new Error('Invalid path'); // Validation here
  }
}

class ScaffoldService {
  generateScaffold(path: string) {
    if (path.includes('..')) throw new Error('Invalid path'); // Duplicated validation
  }
}

class TemplateService {
  loadTemplate(path: string) {
    if (path.includes('..')) throw new Error('Invalid path'); // Duplicated validation
  }
}
```

**How I'll Avoid It**:
```typescript
// ✅ GOOD - Centralized validation
class SecurityValidator {
  validateFilePath(filePath: string): void {
    if (filePath.includes('..') || filePath.includes('~')) {
      throw new SecurityError('Invalid path: path traversal detected');
    }
    // All path validation logic centralized here
  }
}

class FileAnalysisService {
  constructor(private validator: SecurityValidator) {}
  
  analyzeFile(path: string) {
    this.validator.validateFilePath(path); // Reuse centralized logic
  }
}
```

**Prevention Strategy**:
- Extract common logic into utility classes
- Use middleware for cross-cutting concerns
- Create shared validation and error handling
- Single source of truth for business rules

### **4. Primitive Obsession Antipattern**
**Problem**: Using primitive types instead of domain objects
**Example of What NOT to Do**:
```typescript
// ❌ BAD - Primitive obsession
interface TaskResult {
  files: string[];           // Just strings
  framework: string;         // Just a string
  confidence: number;        // Just a number
  errors: string[];          // Just strings
}

function generateTask(
  path: string,              // Just a string
  instructions: string,      // Just a string
  options: any              // Untyped object
): TaskResult {
  // Working with primitives throughout
}
```

**How I'll Avoid It**:
```typescript
// ✅ GOOD - Rich domain objects
class FilePath {
  constructor(private readonly path: string) {
    this.validatePath(path);
  }
  
  toString(): string { return this.path; }
  getExtension(): string { return path.extname(this.path); }
  isInDirectory(directory: string): boolean { /* logic */ }
}

class FrameworkInfo {
  constructor(
    public readonly name: string,
    public readonly version: string,
    public readonly confidence: number
  ) {
    if (confidence < 0 || confidence > 1) {
      throw new Error('Confidence must be between 0 and 1');
    }
  }
  
  isHighConfidence(): boolean { return this.confidence > 0.8; }
}

interface TaskGenerationInput {
  projectPath: FilePath;
  customInstructions: CustomInstructions;
  options: TaskGenerationOptions;
}
```

**Prevention Strategy**:
- Create value objects for domain concepts
- Use TypeScript classes with validation
- Encapsulate behavior with data
- Make illegal states unrepresentable

### **5. Magic Numbers/Strings Antipattern**
**Problem**: Hardcoded values scattered throughout code
**Example of What NOT to Do**:
```typescript
// ❌ BAD - Magic numbers and strings
class FileAnalysisService {
  analyzeFile(path: string) {
    const buffer = fs.readFileSync(path);
    if (buffer.length > 10485760) { // Magic number
      throw new Error('File too large');
    }
    
    const nonPrintableCount = buffer.filter(byte => 
      byte < 32 && byte !== 9 && byte !== 10 && byte !== 13 // Magic numbers
    ).length;
    
    if ((nonPrintableCount / buffer.length) > 0.3) { // Magic number
      return 'binary';
    }
  }
}
```

**How I'll Avoid It**:
```typescript
// ✅ GOOD - Named constants with clear meaning
class FileAnalysisConfig {
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  static readonly MAX_BINARY_THRESHOLD = 0.3; // 30% non-printable chars
  static readonly ASCII_CONTROL_CHARS = {
    TAB: 9,
    LF: 10,
    CR: 13,
    MIN_PRINTABLE: 32
  };
}

class FileAnalysisService {
  analyzeFile(path: string) {
    const buffer = fs.readFileSync(path);
    if (buffer.length > FileAnalysisConfig.MAX_FILE_SIZE) {
      throw new FileTooLargeError('File exceeds maximum size limit');
    }
    
    const { TAB, LF, CR, MIN_PRINTABLE } = FileAnalysisConfig.ASCII_CONTROL_CHARS;
    const nonPrintableCount = buffer.filter(byte => 
      byte < MIN_PRINTABLE && byte !== TAB && byte !== LF && byte !== CR
    ).length;
    
    if ((nonPrintableCount / buffer.length) > FileAnalysisConfig.MAX_BINARY_THRESHOLD) {
      return 'binary';
    }
  }
}
```

**Prevention Strategy**:
- Create configuration classes with named constants
- Use enums for related constants
- Document the meaning and reasoning behind values
- Make constants easily discoverable and changeable

### **6. Copy-Paste Programming Antipattern**
**Problem**: Duplicating code instead of abstracting common patterns
**Example of What NOT to Do**:
```typescript
// ❌ BAD - Copy-paste duplication
class BashScriptGenerator {
  generateScript(template: Template): string {
    let script = '#!/bin/bash\n';
    script += '# Generated by Task Writer\n';
    script += `# Created: ${new Date().toISOString()}\n\n`;
    
    for (const command of template.commands) {
      if (command.type === 'mkdir') {
        script += `mkdir -p "${command.path}"\n`;
      } else if (command.type === 'touch') {
        script += `touch "${command.path}"\n`;
      }
    }
    
    return script;
  }
}

class PowerShellScriptGenerator {
  generateScript(template: Template): string {
    let script = '# Generated by Task Writer\n';
    script += `# Created: ${new Date().toISOString()}\n\n`;
    
    for (const command of template.commands) {
      if (command.type === 'mkdir') {
        script += `New-Item -ItemType Directory -Force -Path "${command.path}"\n`;
      } else if (command.type === 'touch') {
        script += `New-Item -ItemType File -Force -Path "${command.path}"\n`;
      }
    }
    
    return script;
  }
}
```

**How I'll Avoid It**:
```typescript
// ✅ GOOD - Abstract base class with template method
abstract class BaseScriptGenerator {
  generateScript(template: Template): string {
    let script = this.getHeader();
    script += this.getGeneratedComment();
    script += '\n';
    
    for (const command of template.commands) {
      script += this.translateCommand(command);
    }
    
    return script;
  }
  
  protected abstract getHeader(): string;
  protected abstract translateCommand(command: Command): string;
  
  protected getGeneratedComment(): string {
    return `# Generated by Task Writer on ${new Date().toISOString()}`;
  }
}

class BashScriptGenerator extends BaseScriptGenerator {
  protected getHeader(): string {
    return '#!/bin/bash\n';
  }
  
  protected translateCommand(command: Command): string {
    switch (command.type) {
      case 'mkdir': return `mkdir -p "${command.path}"\n`;
      case 'touch': return `touch "${command.path}"\n`;
      default: throw new UnsupportedCommandError(command);
    }
  }
}

class PowerShellScriptGenerator extends BaseScriptGenerator {
  protected getHeader(): string {
    return '# PowerShell Script\n';
  }
  
  protected translateCommand(command: Command): string {
    switch (command.type) {
      case 'mkdir': return `New-Item -ItemType Directory -Force -Path "${command.path}"\n`;
      case 'touch': return `New-Item -ItemType File -Force -Path "${command.path}"\n`;
      default: throw new UnsupportedCommandError(command);
    }
  }
}
```

**Prevention Strategy**:
- Use template method pattern for common workflows
- Extract common logic into base classes or utilities
- Use composition to share behavior
- Regular code reviews to identify duplication

### **7. Anemic Domain Model Antipattern**
**Problem**: Objects that only hold data without behavior
**Example of What NOT to Do**:
```typescript
// ❌ BAD - Anemic model (just data containers)
interface Template {
  id: string;
  name: string;
  content: string;
  variables: Variable[];
}

interface FrameworkDetectionResult {
  frameworks: string[];
  confidence: number;
  evidence: any;
}

// All logic in separate service classes
class TemplateService {
  validateTemplate(template: Template): boolean { /* validation logic */ }
  applyVariables(template: Template, variables: any): string { /* application logic */ }
  isFrameworkCompatible(template: Template, framework: string): boolean { /* compatibility logic */ }
}
```

**How I'll Avoid It**:
```typescript
// ✅ GOOD - Rich domain model with behavior
class Template {
  constructor(
    public readonly id: string,
    public readonly name: string,
    private readonly content: string,
    private readonly variables: Variable[]
  ) {
    this.validateTemplate();
  }
  
  applyVariables(values: Record<string, any>): string {
    let result = this.content;
    for (const variable of this.variables) {
      result = variable.apply(result, values[variable.name]);
    }
    return result;
  }
  
  isCompatibleWith(framework: FrameworkInfo): boolean {
    return this.variables.some(v => 
      v.name === 'framework' && v.allowedValues.includes(framework.name)
    );
  }
  
  private validateTemplate(): void {
    if (!this.content.trim()) {
      throw new Error('Template content cannot be empty');
    }
    // Other validation logic
  }
}

class FrameworkDetectionResult {
  constructor(
    public readonly frameworks: FrameworkInfo[],
    public readonly confidence: number,
    public readonly evidence: Evidence
  ) {}
  
  getPrimaryFramework(): FrameworkInfo | null {
    return this.frameworks.find(f => f.isHighConfidence()) || null;
  }
  
  isHighConfidence(): boolean {
    return this.confidence > 0.8;
  }
  
  hasFramework(name: string): boolean {
    return this.frameworks.some(f => f.name === name);
  }
}
```

**Prevention Strategy**:
- Put behavior close to data
- Create rich domain objects with methods
- Encapsulate validation in constructors
- Use domain objects to express business rules

### **8. Exception Swallowing Antipattern**
**Problem**: Catching exceptions without proper handling
**Example of What NOT to Do**:
```typescript
// ❌ BAD - Swallowing exceptions
class FileAnalysisService {
  async analyzeFile(filePath: string): Promise<FileAnalysisResult> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return this.processContent(content);
    } catch (error) {
      // Silent failure - very bad!
      return null;
    }
  }
  
  async processDirectory(directoryPath: string): Promise<FileAnalysisResult[]> {
    const results = [];
    const files = await fs.readdir(directoryPath);
    
    for (const file of files) {
      try {
        const result = await this.analyzeFile(path.join(directoryPath, file));
        results.push(result);
      } catch (error) {
        // Ignoring errors - loses important information
        console.log('Error processing file', file);
      }
    }
    
    return results;
  }
}
```

**How I'll Avoid It**:
```typescript
// ✅ GOOD - Proper error handling with context
class FileAnalysisService {
  async analyzeFile(filePath: string): Promise<FileAnalysisResult> {
    try {
      this.securityValidator.validateFilePath(filePath);
      const content = await fs.readFile(filePath, 'utf8');
      return this.processContent(content, filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new FileNotFoundError(`File not found: ${filePath}`);
      } else if (error.code === 'EACCES') {
        throw new FilePermissionError(`Permission denied: ${filePath}`);
      } else if (error instanceof SecurityError) {
        throw error; // Re-throw security errors
      } else {
        // Wrap unexpected errors with context
        throw new FileAnalysisError(
          `Failed to analyze file ${filePath}: ${error.message}`,
          error
        );
      }
    }
  }
  
  async processDirectory(directoryPath: string): Promise<ProcessDirectoryResult> {
    const results: FileAnalysisResult[] = [];
    const errors: FileProcessingError[] = [];
    
    try {
      const files = await fs.readdir(directoryPath);
      
      for (const file of files) {
        try {
          const filePath = path.join(directoryPath, file);
          const result = await this.analyzeFile(filePath);
          results.push(result);
        } catch (error) {
          // Collect errors instead of ignoring them
          errors.push(new FileProcessingError(file, error));
          this.logger.warn(`Failed to process file ${file}`, error);
        }
      }
    } catch (error) {
      throw new DirectoryProcessingError(
        `Failed to process directory ${directoryPath}`,
        error
      );
    }
    
    return {
      results,
      errors,
      processedCount: results.length,
      errorCount: errors.length
    };
  }
}
```

**Prevention Strategy**:
- Always handle errors explicitly
- Provide meaningful error messages with context
- Use specific error types for different scenarios
- Log errors appropriately for debugging
- Return error information to callers when appropriate

### **9. Stringly Typed Antipattern**
**Problem**: Using strings for everything instead of proper types
**Example of What NOT to Do**:
```typescript
// ❌ BAD - Everything is strings
interface FrameworkDetectionResult {
  framework: string;        // Could be "react", "vue", "invalid"
  confidence: string;       // Could be "high", "0.8", "maybe"
  type: string;            // Could be "frontend", "back-end", "unknown"
}

function detectFramework(path: string): string {
  // Returns "react|18.2.0|high" or "vue|3.0|medium" - parsing nightmare
}

function generateScript(format: string, content: string): string {
  if (format === "bash" || format === "sh" || format === "shell") {
    // String comparisons everywhere
  }
}
```

**How I'll Avoid It**:
```typescript
// ✅ GOOD - Strong typing with enums and types
enum FrameworkType {
  REACT = 'react',
  VUE = 'vue',
  ANGULAR = 'angular',
  EXPRESS = 'express'
}

enum ProjectArchitecture {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  FULLSTACK = 'fullstack',
  MOBILE = 'mobile'
}

enum ScriptFormat {
  BASH = 'bash',
  POWERSHELL = 'powershell',
  PYTHON = 'python',
  JAVASCRIPT = 'javascript'
}

class ConfidenceScore {
  constructor(private readonly value: number) {
    if (value < 0 || value > 1) {
      throw new Error('Confidence must be between 0 and 1');
    }
  }
  
  isHigh(): boolean { return this.value > 0.8; }
  isMedium(): boolean { return this.value > 0.5 && this.value <= 0.8; }
  isLow(): boolean { return this.value <= 0.5; }
  
  getValue(): number { return this.value; }
}

interface FrameworkDetectionResult {
  framework: FrameworkType;
  confidence: ConfidenceScore;
  architecture: ProjectArchitecture;
}

class ScriptGenerator {
  generateScript(format: ScriptFormat, template: Template): string {
    switch (format) {
      case ScriptFormat.BASH:
        return this.generateBashScript(template);
      case ScriptFormat.POWERSHELL:
        return this.generatePowerShellScript(template);
      default:
        throw new UnsupportedScriptFormatError(format);
    }
  }
}
```

**Prevention Strategy**:
- Use TypeScript enums for fixed sets of values
- Create value objects for complex data
- Use union types for valid combinations
- Make invalid states unrepresentable
- Use type guards for runtime validation

## 🛡️ Prevention Strategies Summary

### **Code Review Checklist**
Before implementing any service, I will check:

- [ ] **Single Responsibility**: Does this class have only one reason to change?
- [ ] **Loose Coupling**: Are dependencies injected rather than created?
- [ ] **No Duplication**: Is this logic already implemented elsewhere?
- [ ] **Rich Objects**: Do domain objects contain behavior, not just data?
- [ ] **Proper Error Handling**: Are all errors handled with context and meaning?
- [ ] **Strong Typing**: Are we using appropriate types instead of strings/any?
- [ ] **No Magic Values**: Are all constants named and documented?
- [ ] **Testability**: Can this be easily unit tested with mocks?

### **Refactoring Signals**
I will refactor when I see:

- **Methods over 20 lines** → Extract smaller methods
- **Classes over 200 lines** → Split responsibilities
- **Duplicate code patterns** → Extract common abstractions
- **Complex conditional logic** → Use polymorphism or strategy pattern
- **Too many parameters** → Create parameter objects
- **Primitive types everywhere** → Create value objects
- **Try-catch blocks without specific handling** → Add proper error types

### **Architecture Reviews**
Regular architecture reviews will check for:

- **Service boundaries** → Are responsibilities clearly separated?
- **Data flow** → Is the flow from input to output clear?
- **Error paths** → Are all error scenarios handled gracefully?
- **Performance** → Are there any obvious bottlenecks?
- **Security** → Are all inputs validated and sanitized?
- **Testability** → Can we easily test edge cases and failures?

## 🎯 Success Metrics

By following this architecture and avoiding these antipatterns, the backend will achieve:

- **Performance**: File analysis <500ms, task generation <2s, script generation <1s
- **Reliability**: 80%+ test coverage, comprehensive error handling
- **Security**: Input validation, path traversal prevention, resource limits
- **Maintainability**: Clear service boundaries, dependency injection, documentation
- **Scalability**: Handle projects with 1000+ files, efficient memory usage
- **Code Quality**: No antipatterns, clear abstractions, rich domain model

This architecture ensures the backend delivers exactly what the frontend needs for its two core tasks while maintaining high code quality, security, and performance standards.