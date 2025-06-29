export interface ExportResult {
  files: ExportedFile[];
  metadata: ExportMetadata;
  summary: ExportSummary;
}

export interface ExportedFile {
  filename: string;
  path: string;
  content: string;
  format: ExportFormat;
  encoding: FileEncoding;
  size: number;
  permissions: FilePermissions;
  checksum: string;
  mimeType: string;
}

export interface ExportMetadata {
  projectName: string;
  exportedAt: Date;
  totalFiles: number;
  totalSize: number;
  formats: ExportFormat[];
  outputDirectory: string;
  generatedBy: string;
  version: string;
}

export interface ExportSummary {
  taskFiles: number;
  scriptFiles: number;
  configFiles: number;
  documentationFiles: number;
  totalFiles: number;
  platforms: string[];
  frameworks: string[];
}

export interface ExportConfig {
  projectName: string;
  outputDirectory: string;
  formats: ExportFormat[];
  includeMetadata?: boolean;
  includeReadme?: boolean;
  overwriteExisting?: boolean;
  createDirectoryStructure?: boolean;
  preservePermissions?: boolean;
  compressionLevel?: CompressionLevel;
  customVariables?: Record<string, any>;
}

export interface FilePermissions {
  owner: PermissionSet;
  group: PermissionSet;
  other: PermissionSet;
  octal: string;
  symbolic: string;
}

export interface PermissionSet {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface CompressionOptions {
  enabled: boolean;
  level: CompressionLevel;
  format: CompressionFormat;
  includeManifest?: boolean;
}

export interface ArchiveMetadata {
  files: string[];
  totalSize: number;
  compressedSize: number;
  compressionRatio: number;
  createdAt: Date;
}

export enum ExportFormat {
  // Task files
  MARKDOWN = 'markdown',
  
  // Script files
  BATCH = 'batch',
  POWERSHELL = 'powershell',
  BASH = 'bash',
  ZSH = 'zsh',
  FISH = 'fish',
  PYTHON = 'python',
  NODE_JS = 'nodejs',
  
  // Build files
  MAKEFILE = 'makefile',
  DOCKERFILE = 'dockerfile',
  DOCKER_COMPOSE = 'docker-compose',
  VAGRANT = 'vagrant',
  
  // Config files
  JSON = 'json',
  YAML = 'yaml',
  TOML = 'toml',
  
  // Documentation
  README = 'readme',
  CHANGELOG = 'changelog',
  
  // Archives
  ZIP = 'zip',
  TAR = 'tar',
  TAR_GZ = 'tar.gz'
}

export enum FileEncoding {
  UTF8 = 'utf-8',
  UTF16 = 'utf-16',
  ASCII = 'ascii',
  ISO_8859_1 = 'iso-8859-1',
  WINDOWS_1252 = 'windows-1252'
}

export enum CompressionLevel {
  NONE = 0,
  FASTEST = 1,
  BALANCED = 5,
  BEST = 9
}

export enum CompressionFormat {
  ZIP = 'zip',
  GZIP = 'gzip',
  BZIP2 = 'bzip2',
  XZ = 'xz'
}

export enum OutputStructure {
  FLAT = 'flat',
  GROUPED_BY_TYPE = 'grouped-by-type',
  GROUPED_BY_PLATFORM = 'grouped-by-platform',
  HIERARCHICAL = 'hierarchical'
}

export class ExportError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly filename?: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'ExportError';
  }
}

export interface ExportOptions {
  encoding?: FileEncoding;
  permissions?: Partial<FilePermissions>;
  outputStructure?: OutputStructure;
  compression?: CompressionOptions;
  includeTimestamp?: boolean;
  includeChecksum?: boolean;
  validateOutput?: boolean;
  dryRun?: boolean;
}