export interface ScaffoldGenerationResult {
  scripts: GeneratedScript[];
  metadata: ScaffoldMetadata;
  summary: ScaffoldSummary;
}

export interface GeneratedScript {
  platform: Platform;
  format: ScriptFormat;
  filename: string;
  content: string;
  executable: boolean;
  permissions: string;
  encoding: string;
}

export interface ScaffoldMetadata {
  projectName: string;
  framework: string;
  platforms: Platform[];
  formats: ScriptFormat[];
  generatedAt: Date;
  totalScripts: number;
  estimatedRuntime: string;
}

export interface ScaffoldSummary {
  scriptsGenerated: number;
  platformsCovered: number;
  commandsIncluded: number;
  prerequisites: string[];
  outputFiles: string[];
}

export interface ScaffoldConfig {
  projectName: string;
  framework?: string;
  projectType?: string;
  platforms: Platform[];
  formats: ScriptFormat[];
  includeCleanup?: boolean;
  includeValidation?: boolean;
  customCommands?: CustomCommand[];
  variables?: Record<string, any>;
}

export interface CustomCommand {
  name: string;
  command: string;
  description: string;
  platforms: Platform[];
  stage: CommandStage;
  required: boolean;
}

export interface ScriptTemplate {
  id: string;
  name: string;
  platform: Platform;
  format: ScriptFormat;
  header: string;
  footer: string;
  commandSeparator: string;
  commentPrefix: string;
  variablePrefix: string;
  conditionalSyntax: ConditionalSyntax;
  errorHandling: ErrorHandling;
}

export interface ConditionalSyntax {
  ifStatement: string;
  elseStatement: string;
  endStatement: string;
  existsCheck: string;
  notExistsCheck: string;
}

export interface ErrorHandling {
  exitOnError: string;
  continueOnError: string;
  errorCapture: string;
  errorOutput: string;
}

export interface CommandMapping {
  generic: string;
  windows: string;
  macos: string;
  linux: string;
  description: string;
  category: CommandCategory;
}

export interface DirectoryStructure {
  name: string;
  path: string;
  children?: DirectoryStructure[];
  files?: FileStructure[];
}

export interface FileStructure {
  name: string;
  content?: string;
  template?: string;
  permissions?: string;
}

export enum Platform {
  WINDOWS = 'windows',
  MACOS = 'macos',
  LINUX = 'linux',
  CROSS_PLATFORM = 'cross-platform'
}

export enum ScriptFormat {
  BATCH = 'batch',           // .bat
  POWERSHELL = 'powershell', // .ps1
  BASH = 'bash',            // .sh
  ZSH = 'zsh',              // .zsh
  FISH = 'fish',            // .fish
  CMD = 'cmd',              // .cmd
  PYTHON = 'python',        // .py
  NODE = 'node',            // .js
  MAKE = 'make',            // Makefile
  DOCKER = 'docker',        // Dockerfile
  DOCKER_COMPOSE = 'docker-compose', // docker-compose.yml
  VAGRANT = 'vagrant'       // Vagrantfile
}

export enum CommandStage {
  PRE_SETUP = 'pre-setup',
  SETUP = 'setup',
  POST_SETUP = 'post-setup',
  VALIDATION = 'validation',
  CLEANUP = 'cleanup'
}

export enum CommandCategory {
  DIRECTORY = 'directory',
  FILE = 'file',
  PACKAGE = 'package',
  BUILD = 'build',
  TEST = 'test',
  SERVER = 'server',
  DATABASE = 'database',
  ENVIRONMENT = 'environment',
  GIT = 'git',
  DOCKER = 'docker'
}

export class ScaffoldGenerationError extends Error {
  constructor(
    message: string,
    public readonly stage: string,
    public readonly platform?: Platform,
    public readonly format?: ScriptFormat,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'ScaffoldGenerationError';
  }
}

export interface ScaffoldGenerationOptions {
  includeComments?: boolean;
  includeErrorHandling?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
  outputDirectory?: string;
  overwriteExisting?: boolean;
}