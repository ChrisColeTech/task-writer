import * as fs from 'fs/promises';
import * as path from 'path';
import {
  FileAnalysisResult,
  FileMetadata,
  FileContent,
  FileStructure,
  FileRelationships,
  FileType,
  FileAnalysisOptions,
  FileAnalysisError,
  FileTooLargeError,
  BinaryFileError,
  FilePermissionError,
  CommentAnalysis
} from '../types/fileAnalysis';
import {
  SecurityValidator,
  FileTypeDetector,
  EncodingDetector,
  FileAnalysisConfig
} from '../utils/fileValidation';

// Factory pattern for different file processors
interface FileProcessor {
  canProcess(filePath: string): boolean;
  processStructure(content: string, filePath: string): FileStructure;
}

class CodeFileProcessor implements FileProcessor {
  canProcess(filePath: string): boolean {
    const detector = new FileTypeDetector();
    return detector.detectFileType(filePath) === FileType.CODE;
  }

  processStructure(content: string, filePath: string): FileStructure {
    const language = new FileTypeDetector().detectLanguage(filePath);
    
    return {
      imports: this.extractImports(content, language),
      exports: this.extractExports(content, language),
      functions: this.extractFunctions(content, language),
      classes: this.extractClasses(content, language),
      comments: this.extractComments(content)
    };
  }

  private extractImports(content: string, language: string | null): string[] {
    const imports: string[] = [];
    
    if (!language) return imports;

    try {
      switch (language) {
        case 'javascript':
        case 'typescript':
          // ES6 imports: import ... from '...'
          const es6ImportRegex = /import\s+(?:[\w*{}\s,]+\s+from\s+)?['"`]([^'"`]+)['"`]/g;
          let match;
          while ((match = es6ImportRegex.exec(content)) !== null) {
            imports.push(match[1]);
          }
          
          // CommonJS requires: require('...')
          const requireRegex = /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
          while ((match = requireRegex.exec(content)) !== null) {
            imports.push(match[1]);
          }
          break;

        case 'python':
          // import module or from module import ...
          const pythonImportRegex = /(?:^|\n)(?:from\s+(\S+)\s+import|import\s+(\S+))/g;
          while ((match = pythonImportRegex.exec(content)) !== null) {
            imports.push(match[1] || match[2]);
          }
          break;

        case 'java':
        case 'kotlin':
          // import package.Class
          const javaImportRegex = /import\s+([a-zA-Z][a-zA-Z0-9._]*);/g;
          while ((match = javaImportRegex.exec(content)) !== null) {
            imports.push(match[1]);
          }
          break;

        case 'go':
          // import "package" or import ("package1", "package2")
          const goImportRegex = /import\s+(?:\(\s*)?['"`]([^'"`]+)['"`]/g;
          while ((match = goImportRegex.exec(content)) !== null) {
            imports.push(match[1]);
          }
          break;
      }
    } catch (error) {
      // If parsing fails, return empty array rather than throwing
      console.warn(`Failed to extract imports from ${language} file:`, error);
    }

    return [...new Set(imports)]; // Remove duplicates
  }

  private extractExports(content: string, language: string | null): string[] {
    const exports: string[] = [];
    
    if (!language) return exports;

    try {
      switch (language) {
        case 'javascript':
        case 'typescript':
          // export const/let/var/function/class name
          const namedExportRegex = /export\s+(?:const|let|var|function|class|interface|type|enum)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
          let match;
          while ((match = namedExportRegex.exec(content)) !== null) {
            exports.push(match[1]);
          }
          
          // export { name1, name2 }
          const destructuredExportRegex = /export\s*{\s*([^}]+)\s*}/g;
          while ((match = destructuredExportRegex.exec(content)) !== null) {
            const names = match[1].split(',').map(name => name.trim().split(/\s+as\s+/)[0].trim());
            exports.push(...names);
          }
          
          // export default
          if (content.includes('export default')) {
            exports.push('default');
          }
          break;

        case 'python':
          // def function_name or class ClassName
          const pythonDefRegex = /^(?:def|class)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm;
          while ((match = pythonDefRegex.exec(content)) !== null) {
            exports.push(match[1]);
          }
          break;
      }
    } catch (error) {
      console.warn(`Failed to extract exports from ${language} file:`, error);
    }

    return [...new Set(exports)];
  }

  private extractFunctions(content: string, language: string | null): string[] {
    const functions: string[] = [];
    
    if (!language) return functions;

    try {
      switch (language) {
        case 'javascript':
        case 'typescript':
          // function name() or const name = () => or const name = function()
          const jsFunctionRegex = /(?:function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)|(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?(?:function|\([^)]*\)\s*=>))/g;
          let match;
          while ((match = jsFunctionRegex.exec(content)) !== null) {
            functions.push(match[1] || match[2]);
          }
          break;

        case 'python':
          const pythonFunctionRegex = /^def\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm;
          while ((match = pythonFunctionRegex.exec(content)) !== null) {
            functions.push(match[1]);
          }
          break;

        case 'java':
        case 'kotlin':
          const javaMethodRegex = /(?:public|private|protected)?\s*(?:static)?\s*(?:\w+\s+)*([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*{/g;
          while ((match = javaMethodRegex.exec(content)) !== null) {
            if (match[1] !== 'class' && match[1] !== 'interface') {
              functions.push(match[1]);
            }
          }
          break;
      }
    } catch (error) {
      console.warn(`Failed to extract functions from ${language} file:`, error);
    }

    return [...new Set(functions)];
  }

  private extractClasses(content: string, language: string | null): string[] {
    const classes: string[] = [];
    
    if (!language) return classes;

    try {
      switch (language) {
        case 'javascript':
        case 'typescript':
          const jsClassRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
          let match;
          while ((match = jsClassRegex.exec(content)) !== null) {
            classes.push(match[1]);
          }
          break;

        case 'python':
          const pythonClassRegex = /^class\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm;
          while ((match = pythonClassRegex.exec(content)) !== null) {
            classes.push(match[1]);
          }
          break;

        case 'java':
        case 'kotlin':
          const javaClassRegex = /(?:public|private|protected)?\s*(?:abstract|final)?\s*class\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
          while ((match = javaClassRegex.exec(content)) !== null) {
            classes.push(match[1]);
          }
          break;
      }
    } catch (error) {
      console.warn(`Failed to extract classes from ${language} file:`, error);
    }

    return [...new Set(classes)];
  }

  private extractComments(content: string): CommentAnalysis {
    const todos: string[] = [];
    const fixmes: string[] = [];
    const documentation: string[] = [];

    try {
      // Extract single-line comments (// or #)
      const singleLineComments = content.match(/(?:\/\/|#)\s*(.+)$/gm) || [];
      
      // Extract multi-line comments (/* */ or """ """)
      const multiLineComments = content.match(/\/\*[\s\S]*?\*\/|"""[\s\S]*?"""/g) || [];
      
      const allComments = [...singleLineComments, ...multiLineComments];

      for (const comment of allComments) {
        const cleanComment = comment.replace(/^(?:\/\/|#|\/\*|\*\/|"""|''')\s*/, '').trim();
        
        if (/\b(?:todo|TODO|Todo)\b/.test(cleanComment)) {
          todos.push(cleanComment);
        } else if (/\b(?:fixme|FIXME|Fixme|fix|FIX|Fix)\b/.test(cleanComment)) {
          fixmes.push(cleanComment);
        } else if (cleanComment.length > 20) { // Consider longer comments as documentation
          documentation.push(cleanComment);
        }
      }
    } catch (error) {
      console.warn('Failed to extract comments:', error);
    }

    return { todos, fixmes, documentation };
  }
}

class ConfigFileProcessor implements FileProcessor {
  canProcess(filePath: string): boolean {
    const detector = new FileTypeDetector();
    return detector.detectFileType(filePath) === FileType.CONFIG;
  }

  processStructure(content: string, filePath: string): FileStructure {
    // Config files have minimal structure analysis
    return {
      imports: [],
      exports: [],
      functions: [],
      classes: [],
      comments: this.extractComments(content)
    };
  }

  private extractComments(content: string): CommentAnalysis {
    // Basic comment extraction for config files
    const comments = content.match(/(?:#|\/\/)\s*(.+)$/gm) || [];
    return {
      todos: comments.filter(c => /\btodo\b/i.test(c)),
      fixmes: comments.filter(c => /\bfixme\b/i.test(c)),
      documentation: comments.filter(c => c.length > 20)
    };
  }
}

class DefaultFileProcessor implements FileProcessor {
  canProcess(filePath: string): boolean {
    return true; // Default processor accepts any file
  }

  processStructure(content: string, filePath: string): FileStructure {
    return {
      imports: [],
      exports: [],
      functions: [],
      classes: [],
      comments: { todos: [], fixmes: [], documentation: [] }
    };
  }
}

class FileProcessorFactory {
  private processors: FileProcessor[] = [
    new CodeFileProcessor(),
    new ConfigFileProcessor(),
    new DefaultFileProcessor()
  ];

  getProcessor(filePath: string): FileProcessor {
    return this.processors.find(p => p.canProcess(filePath)) || new DefaultFileProcessor();
  }
}

export class FileAnalysisService {
  private securityValidator = new SecurityValidator();
  private fileTypeDetector = new FileTypeDetector();
  private encodingDetector = new EncodingDetector();
  private processorFactory = new FileProcessorFactory();

  async analyzeFile(
    filePath: string, 
    options: FileAnalysisOptions = {}
  ): Promise<FileAnalysisResult> {
    try {
      // 1. Security validation
      this.securityValidator.validateFilePath(filePath);
      
      // 2. File size validation
      await this.securityValidator.validateFileSize(
        filePath, 
        options.maxFileSize || FileAnalysisConfig.MAX_FILE_SIZE
      );

      // 3. Check if file is binary
      const isBinary = await this.fileTypeDetector.isBinaryFile(filePath);
      if (isBinary) {
        throw new BinaryFileError(filePath);
      }

      // 4. Extract metadata
      const metadata = await this.extractMetadata(filePath);

      // 5. Read content if requested
      const content = options.includeContent !== false 
        ? await this.readFileContent(filePath, metadata.encoding)
        : this.createEmptyContent();

      // 6. Analyze structure if requested
      const structure = options.analyzeStructure !== false
        ? this.analyzeStructure(content.raw, filePath)
        : this.createEmptyStructure();

      // 7. Analyze relationships (basic implementation)
      const relationships = this.analyzeRelationships(structure);

      return {
        path: filePath,
        metadata,
        content,
        structure,
        relationships
      };

    } catch (error) {
      if (error instanceof FileAnalysisError) {
        throw error;
      }

      if ((error as any)?.code === 'ENOENT') {
        throw new FileAnalysisError(`File not found: ${filePath}`, filePath, error as Error);
      } else if ((error as any)?.code === 'EACCES') {
        throw new FilePermissionError(filePath, error as Error);
      } else {
        throw new FileAnalysisError(
          `Failed to analyze file ${filePath}: ${(error as Error).message}`,
          filePath,
          error as Error
        );
      }
    }
  }

  private async extractMetadata(filePath: string): Promise<FileMetadata> {
    const stats = await fs.stat(filePath);
    const fileType = this.fileTypeDetector.detectFileType(filePath);
    const language = this.fileTypeDetector.detectLanguage(filePath);
    const encoding = await this.encodingDetector.detectEncoding(filePath);

    return {
      size: stats.size,
      modifiedAt: stats.mtime,
      createdAt: stats.birthtime,
      type: fileType,
      language,
      encoding,
      permissions: stats.mode.toString(8)
    };
  }

  private async readFileContent(filePath: string, encoding: string): Promise<FileContent> {
    const buffer = await fs.readFile(filePath);
    const content = buffer.toString(encoding as BufferEncoding);
    
    const lines = content.split(/\r?\n/).length;
    const characters = content.length;
    const isEmpty = content.trim().length === 0;

    return {
      raw: content,
      lines,
      characters,
      isEmpty,
      isBinary: false // We already checked for binary files
    };
  }

  private createEmptyContent(): FileContent {
    return {
      raw: '',
      lines: 0,
      characters: 0,
      isEmpty: true,
      isBinary: false
    };
  }

  private analyzeStructure(content: string, filePath: string): FileStructure {
    const processor = this.processorFactory.getProcessor(filePath);
    return processor.processStructure(content, filePath);
  }

  private createEmptyStructure(): FileStructure {
    return {
      imports: [],
      exports: [],
      functions: [],
      classes: [],
      comments: { todos: [], fixmes: [], documentation: [] }
    };
  }

  private analyzeRelationships(structure: FileStructure): FileRelationships {
    // Basic implementation - for now just return the imports as dependencies
    // In a full implementation, this would cross-reference with other analyzed files
    return {
      dependencies: structure.imports,
      dependents: [] // Would be populated when analyzing multiple files
    };
  }

  // Utility method for batch processing
  async analyzeDirectory(
    directoryPath: string, 
    options: FileAnalysisOptions = {}
  ): Promise<{ results: FileAnalysisResult[]; errors: Array<{ file: string; error: Error }> }> {
    const results: FileAnalysisResult[] = [];
    const errors: Array<{ file: string; error: Error }> = [];

    try {
      this.securityValidator.validateFilePath(directoryPath);
      
      const entries = await fs.readdir(directoryPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile()) {
          const filePath = path.join(directoryPath, entry.name);
          
          try {
            const result = await this.analyzeFile(filePath, options);
            results.push(result);
          } catch (error) {
            errors.push({ file: entry.name, error: error as Error });
          }
        }
      }
    } catch (error) {
      throw new FileAnalysisError(
        `Failed to analyze directory ${directoryPath}: ${(error as Error).message}`,
        directoryPath,
        error as Error
      );
    }

    return { results, errors };
  }
}