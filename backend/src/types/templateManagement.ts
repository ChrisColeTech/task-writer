export interface TemplateManagementResult {
  templates: ManagedTemplate[];
  metadata: TemplateMetadata;
  summary: TemplateSummary;
}

export interface ManagedTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: TemplateCategory;
  type: TemplateType;
  framework?: string;
  platform?: string;
  source: TemplateSource;
  content: TemplateContent;
  metadata: TemplateFileMetadata;
  dependencies: TemplateDependency[];
  variables: TemplateVariable[];
  validation: TemplateValidation;
}

export interface TemplateContent {
  files: TemplateFile[];
  directories: TemplateDirectory[];
  scripts: TemplateScript[];
  configurations: TemplateConfiguration[];
}

export interface TemplateFile {
  path: string;
  content: string;
  template: boolean;
  encoding: string;
  permissions?: string;
  variables?: string[];
}

export interface TemplateDirectory {
  path: string;
  description?: string;
  optional?: boolean;
}

export interface TemplateScript {
  name: string;
  description: string;
  content: string;
  platform: string[];
  stage: ScriptStage;
}

export interface TemplateConfiguration {
  file: string;
  format: ConfigFormat;
  content: Record<string, any>;
  merge?: boolean;
}

export interface TemplateVariable {
  name: string;
  type: VariableType;
  description: string;
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: ValidationRule;
  scope: VariableScope;
}

export interface ValidationRule {
  pattern?: string;
  min?: number;
  max?: number;
  custom?: string;
}

export interface TemplateDependency {
  name: string;
  version?: string;
  type: DependencyType;
  required: boolean;
  description?: string;
}

export interface TemplateValidation {
  schema?: Record<string, any>;
  rules: ValidationRule[];
  warnings: string[];
  errors: string[];
}

export interface TemplateMetadata {
  totalTemplates: number;
  categories: TemplateCategory[];
  frameworks: string[];
  platforms: string[];
  sources: TemplateSource[];
  lastUpdated: Date;
}

export interface TemplateSummary {
  local: number;
  remote: number;
  official: number;
  community: number;
  private: number;
}

export interface TemplateFileMetadata {
  size: number;
  createdAt: Date;
  updatedAt: Date;
  checksum: string;
  tags: string[];
  keywords: string[];
}

export interface TemplateRepository {
  id: string;
  name: string;
  url: string;
  type: RepositoryType;
  enabled: boolean;
  authentication?: RepositoryAuth;
}

export interface RepositoryAuth {
  type: AuthType;
  token?: string;
  username?: string;
  password?: string;
}

export interface TemplateSearchOptions {
  query?: string;
  category?: TemplateCategory;
  framework?: string;
  platform?: string;
  source?: TemplateSource;
  tags?: string[];
  includeRemote?: boolean;
  sortBy?: TemplateSortBy;
  limit?: number;
}

export interface TemplateInstallOptions {
  overwrite?: boolean;
  skipValidation?: boolean;
  customVariables?: Record<string, any>;
  targetDirectory?: string;
}

export interface GitHubRepository {
  owner: string;
  repo: string;
  branch?: string;
  path?: string;
  token?: string;
}

export interface TemplateManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  keywords: string[];
  framework?: string;
  platform?: string;
  category: TemplateCategory;
  dependencies: TemplateDependency[];
  variables: TemplateVariable[];
  files: string[];
  scripts: Record<string, string>;
}

export enum TemplateCategory {
  PROJECT_STARTER = 'project-starter',
  COMPONENT = 'component',
  FEATURE = 'feature',
  CONFIGURATION = 'configuration',
  DEPLOYMENT = 'deployment',
  TESTING = 'testing',
  DOCUMENTATION = 'documentation',
  UTILITY = 'utility',
  CUSTOM = 'custom'
}

export enum TemplateType {
  FULL_PROJECT = 'full-project',
  PARTIAL = 'partial',
  SNIPPET = 'snippet',
  SCAFFOLD = 'scaffold',
  BOILERPLATE = 'boilerplate'
}

export enum TemplateSource {
  LOCAL = 'local',
  GITHUB = 'github',
  NPM = 'npm',
  GIT = 'git',
  URL = 'url',
  OFFICIAL = 'official',
  COMMUNITY = 'community'
}

export enum RepositoryType {
  GITHUB = 'github',
  GITLAB = 'gitlab',
  BITBUCKET = 'bitbucket',
  GIT = 'git',
  NPM = 'npm',
  LOCAL = 'local'
}

export enum AuthType {
  TOKEN = 'token',
  BASIC = 'basic',
  SSH = 'ssh',
  NONE = 'none'
}

export enum VariableType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  SELECT = 'select',
  PATH = 'path',
  URL = 'url',
  EMAIL = 'email'
}

export enum VariableScope {
  GLOBAL = 'global',
  PROJECT = 'project',
  FILE = 'file',
  SCRIPT = 'script'
}

export enum DependencyType {
  RUNTIME = 'runtime',
  DEVELOPMENT = 'development',
  PEER = 'peer',
  OPTIONAL = 'optional',
  SYSTEM = 'system'
}

export enum ScriptStage {
  PRE_INSTALL = 'pre-install',
  POST_INSTALL = 'post-install',
  PRE_BUILD = 'pre-build',
  POST_BUILD = 'post-build',
  SETUP = 'setup',
  CLEANUP = 'cleanup'
}

export enum ConfigFormat {
  JSON = 'json',
  YAML = 'yaml',
  TOML = 'toml',
  INI = 'ini',
  ENV = 'env',
  XML = 'xml'
}

export enum TemplateSortBy {
  NAME = 'name',
  CREATED = 'created',
  UPDATED = 'updated',
  POPULARITY = 'popularity',
  CATEGORY = 'category'
}

export class TemplateManagementError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly templateId?: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'TemplateManagementError';
  }
}

export interface TemplateManagementOptions {
  storageDirectory?: string;
  cacheDirectory?: string;
  enableRemoteSync?: boolean;
  autoUpdate?: boolean;
  maxCacheSize?: number;
  repositories?: TemplateRepository[];
}