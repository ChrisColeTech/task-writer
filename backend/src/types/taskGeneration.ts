export interface TaskGenerationResult {
  content: string;
  metadata: TaskMetadata;
  sections: TaskSection[];
  estimatedComplexity: TaskComplexity;
}

export interface TaskMetadata {
  title: string;
  version: string;
  type: TaskType;
  category: TaskCategory;
  estimatedDuration: string;
  prerequisites: string[];
  outputFiles: string[];
  commands: string[];
  framework: string | null;
  platform: string | null;
}

export interface TaskSection {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  order: number;
  subsections?: TaskSubsection[];
}

export interface TaskSubsection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  category: TaskCategory;
  sections: TemplateSectionConfig[];
  variables: TemplateVariable[];
  framework?: string;
  platform?: string;
}

export interface TemplateSectionConfig {
  type: SectionType;
  title: string;
  required: boolean;
  order: number;
  defaultContent?: string;
  variables?: string[];
}

export interface TemplateVariable {
  name: string;
  type: VariableType;
  description: string;
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: ValidationRule;
}

export interface ValidationRule {
  pattern?: string;
  min?: number;
  max?: number;
  required?: boolean;
  custom?: (value: any) => boolean;
}

export interface TaskGenerationConfig {
  framework?: string;
  projectType?: string;
  platform?: string;
  includeRules?: boolean;
  includeCommands?: boolean;
  complexity?: TaskComplexity;
  customSections?: CustomSection[];
  variables?: Record<string, any>;
}

export interface CustomSection {
  title: string;
  content: string;
  position: 'before' | 'after';
  targetSection: SectionType;
}

export interface ProjectAnalysis {
  projectType: string;
  framework: string;
  language: string;
  buildSystem: string;
  dependencies: string[];
  structure: ProjectStructure;
  complexity: TaskComplexity;
}

export interface ProjectStructure {
  directories: string[];
  files: string[];
  configFiles: string[];
  sourceFiles: string[];
  testFiles: string[];
}

export enum TaskType {
  INITIALIZATION = 'initialization',
  FRONTEND_SETUP = 'frontend-setup',
  BACKEND_SETUP = 'backend-setup',
  COMPONENT_CREATION = 'component-creation',
  SERVICE_IMPLEMENTATION = 'service-implementation',
  CONFIGURATION = 'configuration',
  TESTING = 'testing',
  DEPLOYMENT = 'deployment',
  CUSTOM = 'custom'
}

export enum TaskCategory {
  PROJECT_SETUP = 'project-setup',
  DEVELOPMENT = 'development',
  CONFIGURATION = 'configuration',
  TESTING = 'testing',
  DEPLOYMENT = 'deployment',
  MAINTENANCE = 'maintenance'
}

export enum SectionType {
  RULES = 'rules',
  TITLE = 'title',
  PREREQUISITES = 'prerequisites',
  OVERVIEW = 'overview',
  STEPS = 'steps',
  COMMANDS = 'commands',
  CODE_BLOCKS = 'code-blocks',
  CONFIGURATION = 'configuration',
  FILES = 'files',
  VALIDATION = 'validation',
  COMPLETION = 'completion',
  TROUBLESHOOTING = 'troubleshooting'
}

export enum TaskComplexity {
  SIMPLE = 'simple',
  MODERATE = 'moderate',
  COMPLEX = 'complex',
  EXPERT = 'expert'
}

export enum VariableType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  SELECT = 'select',
  PATH = 'path'
}

export class TaskGenerationError extends Error {
  constructor(
    message: string,
    public readonly stage: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'TaskGenerationError';
  }
}

export interface TaskGenerationOptions {
  templateId?: string;
  customTemplate?: TaskTemplate;
  includeExamples?: boolean;
  outputFormat?: 'markdown' | 'json';
  minify?: boolean;
  validateOutput?: boolean;
}