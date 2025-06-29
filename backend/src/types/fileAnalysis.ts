export interface FileAnalysisResult {
  path: string;
  metadata: FileMetadata;
  content: FileContent;
  structure: FileStructure;
  relationships: FileRelationships;
}

export interface FileMetadata {
  size: number;
  modifiedAt: Date;
  createdAt: Date;
  type: FileType;
  language: string | null;
  encoding: string;
  permissions: string;
}

export interface FileContent {
  raw: string;
  lines: number;
  characters: number;
  isEmpty: boolean;
  isBinary: boolean;
}

export interface FileStructure {
  imports: string[];
  exports: string[];
  functions: string[];
  classes: string[];
  comments: CommentAnalysis;
}

export interface CommentAnalysis {
  todos: string[];
  fixmes: string[];
  documentation: string[];
}

export interface FileRelationships {
  dependencies: string[];  // Files this file imports
  dependents: string[];    // Files that import this file
}

export enum FileType {
  CODE = 'code',
  CONFIG = 'config',
  DOCUMENTATION = 'documentation',
  SCRIPT = 'script',
  DATA = 'data',
  UNKNOWN = 'unknown'
}

export interface FileAnalysisOptions {
  maxFileSize?: number;
  includeContent?: boolean;
  analyzeStructure?: boolean;
  detectLanguage?: boolean;
}

export class FileAnalysisError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'FileAnalysisError';
  }
}

export class FileTooLargeError extends FileAnalysisError {
  constructor(filePath: string, size: number, maxSize: number) {
    super(
      `File too large: ${size} bytes (max: ${maxSize} bytes)`,
      filePath
    );
    this.name = 'FileTooLargeError';
  }
}

export class BinaryFileError extends FileAnalysisError {
  constructor(filePath: string) {
    super('Binary files are not supported for analysis', filePath);
    this.name = 'BinaryFileError';
  }
}

export class FilePermissionError extends FileAnalysisError {
  constructor(filePath: string, originalError: Error) {
    super(`Permission denied: ${filePath}`, filePath, originalError);
    this.name = 'FilePermissionError';
  }
}