import {
  TaskGenerationResult,
  TaskMetadata,
  TaskSection,
  TaskTemplate,
  TaskGenerationConfig,
  TaskGenerationOptions,
  ProjectAnalysis,
  TaskType,
  TaskCategory,
  SectionType,
  TaskComplexity,
  VariableType,
  TaskGenerationError
} from '../types/taskGeneration';
import { FileAnalysisService } from './FileAnalysisService';
import { FrameworkDetectionService } from './FrameworkDetectionService';
import { FrameworkDetectionResult } from '../types/framework';
import * as taskTemplatesData from '../data/taskTemplates.json';

export class TaskGenerationService {
  private fileAnalysisService: FileAnalysisService;
  private frameworkDetectionService: FrameworkDetectionService;
  private templates: Map<string, TaskTemplate>;

  constructor(
    fileAnalysisService?: FileAnalysisService,
    frameworkDetectionService?: FrameworkDetectionService
  ) {
    this.fileAnalysisService = fileAnalysisService || new FileAnalysisService();
    this.frameworkDetectionService = frameworkDetectionService || new FrameworkDetectionService();
    this.templates = new Map();
    this.loadTemplates();
  }

  /**
   * Generate AI-ready task file from project analysis
   */
  async generateTask(
    projectPath: string,
    config: TaskGenerationConfig,
    options: TaskGenerationOptions = {}
  ): Promise<TaskGenerationResult> {
    try {
      // Analyze the project
      const projectAnalysis = await this.analyzeProject(projectPath);
      
      // Select appropriate template
      const template = this.selectTemplate(projectAnalysis, config);
      
      // Generate task content
      const result = await this.buildTaskFromTemplate(
        template, 
        projectAnalysis, 
        config, 
        options
      );
      
      // Validate output if requested
      if (options.validateOutput) {
        this.validateTaskOutput(result);
      }
      
      return result;
    } catch (error) {
      throw new TaskGenerationError(
        `Failed to generate task for ${projectPath}: ${(error as Error).message}`,
        'generation',
        error as Error
      );
    }
  }

  /**
   * Generate task from existing template
   */
  async generateFromTemplate(
    templateId: string,
    variables: Record<string, any>,
    options: TaskGenerationOptions = {}
  ): Promise<TaskGenerationResult> {
    try {
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      // Create mock project analysis for template-only generation
      const mockAnalysis: ProjectAnalysis = {
        projectType: template.type,
        framework: template.framework || 'unknown',
        language: this.inferLanguageFromFramework(template.framework),
        buildSystem: 'unknown',
        dependencies: [],
        structure: {
          directories: [],
          files: [],
          configFiles: [],
          sourceFiles: [],
          testFiles: []
        },
        complexity: TaskComplexity.MODERATE
      };

      const config: TaskGenerationConfig = {
        framework: template.framework,
        projectType: template.type,
        variables
      };

      return await this.buildTaskFromTemplate(template, mockAnalysis, config, options);
    } catch (error) {
      throw new TaskGenerationError(
        `Failed to generate task from template ${templateId}: ${(error as Error).message}`,
        'template-generation',
        error as Error
      );
    }
  }

  /**
   * Get available templates
   */
  getAvailableTemplates(): TaskTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId: string): TaskTemplate | null {
    return this.templates.get(templateId) || null;
  }

  /**
   * Register custom template
   */
  registerTemplate(template: TaskTemplate): void {
    this.templates.set(template.id, template);
  }

  private loadTemplates(): void {
    try {
      const templates = taskTemplatesData.templates;
      
      for (const [id, templateData] of Object.entries(templates)) {
        const template: TaskTemplate = {
          id,
          name: templateData.name,
          description: templateData.description,
          type: templateData.type as TaskType,
          category: templateData.category as TaskCategory,
          sections: templateData.sections.map(section => ({
            type: section.type as SectionType,
            title: section.title,
            required: section.required,
            order: section.order,
            defaultContent: (section as any).defaultContent || '',
            variables: (section as any).variables || []
          })),
          variables: templateData.variables?.map(variable => ({
            name: variable.name,
            type: variable.type as VariableType,
            description: variable.description,
            required: variable.required,
            defaultValue: (variable as any).defaultValue || '',
            options: (variable as any).options || [],
            validation: (variable as any).validation || {}
          })) || [],
          framework: (templateData as any).framework || null,
          platform: (templateData as any).platform || null
        };
        
        this.templates.set(id, template);
      }
    } catch (error) {
      throw new TaskGenerationError(
        'Failed to load task templates',
        'template-loading',
        error as Error
      );
    }
  }

  private async analyzeProject(projectPath: string): Promise<ProjectAnalysis> {
    try {
      // Get framework detection
      const frameworkResult = await this.frameworkDetectionService.detectFrameworks(projectPath);
      
      // Analyze project structure
      const structureAnalysis = await this.fileAnalysisService.analyzeDirectory(projectPath);
      
      // Determine primary language
      const language = this.inferPrimaryLanguage(structureAnalysis.results);
      
      // Determine build system
      const buildSystem = this.inferBuildSystem(frameworkResult);
      
      // Extract dependencies
      const dependencies = this.extractDependencies(frameworkResult);
      
      // Assess complexity
      const complexity = this.assessProjectComplexity(structureAnalysis, frameworkResult);

      return {
        projectType: frameworkResult.projectType,
        framework: this.getPrimaryFrameworkName(frameworkResult),
        language,
        buildSystem,
        dependencies,
        structure: {
          directories: [], // We'll need to extract this differently
          files: structureAnalysis.results.map(f => f.path),
          configFiles: frameworkResult.evidence.configFiles.found,
          sourceFiles: structureAnalysis.results
            .filter(f => this.isSourceFile(f.path))
            .map(f => f.path),
          testFiles: structureAnalysis.results
            .filter(f => this.isTestFile(f.path))
            .map(f => f.path)
        },
        complexity
      };
    } catch (error) {
      throw new TaskGenerationError(
        `Failed to analyze project at ${projectPath}`,
        'project-analysis',
        error as Error
      );
    }
  }

  private selectTemplate(
    projectAnalysis: ProjectAnalysis,
    config: TaskGenerationConfig
  ): TaskTemplate {
    // Priority order: custom template > framework-specific > project type > default
    
    if (config.framework) {
      const frameworkTemplate = this.findTemplateByFramework(config.framework);
      if (frameworkTemplate) return frameworkTemplate;
    }
    
    const projectTypeTemplate = this.findTemplateByProjectType(projectAnalysis.projectType);
    if (projectTypeTemplate) return projectTypeTemplate;
    
    // Default to initialization template
    const defaultTemplate = this.templates.get('initialization');
    if (!defaultTemplate) {
      throw new Error('No suitable template found and default template is missing');
    }
    
    return defaultTemplate;
  }

  private async buildTaskFromTemplate(
    template: TaskTemplate,
    projectAnalysis: ProjectAnalysis,
    config: TaskGenerationConfig,
    options: TaskGenerationOptions
  ): Promise<TaskGenerationResult> {
    const sections: TaskSection[] = [];
    const metadata = this.createTaskMetadata(template, projectAnalysis, config);
    
    // Process each section in order
    const sortedSections = template.sections.sort((a, b) => a.order - b.order);
    
    for (const sectionConfig of sortedSections) {
      const section = await this.buildSection(
        sectionConfig,
        template,
        projectAnalysis,
        config,
        options
      );
      
      if (section) {
        sections.push(section);
      }
    }
    
    // Generate final markdown content
    const content = this.renderTaskMarkdown(metadata, sections, options);
    
    return {
      content,
      metadata,
      sections,
      estimatedComplexity: projectAnalysis.complexity
    };
  }

  private async buildSection(
    sectionConfig: any,
    template: TaskTemplate,
    projectAnalysis: ProjectAnalysis,
    config: TaskGenerationConfig,
    options: TaskGenerationOptions
  ): Promise<TaskSection | null> {
    const sectionType = sectionConfig.type as SectionType;
    
    let content = '';
    
    switch (sectionType) {
      case SectionType.RULES:
        content = this.buildRulesSection(projectAnalysis, config);
        break;
        
      case SectionType.TITLE:
        content = this.buildTitleSection(template, config);
        break;
        
      case SectionType.STEPS:
        content = this.buildStepsSection(template, projectAnalysis, config);
        break;
        
      case SectionType.COMMANDS:
        content = this.buildCommandsSection(template, projectAnalysis, config);
        break;
        
      case SectionType.CONFIGURATION:
        content = this.buildConfigurationSection(template, projectAnalysis, config);
        break;
        
      case SectionType.CODE_BLOCKS:
        content = this.buildCodeBlocksSection(template, projectAnalysis, config);
        break;
        
      default:
        content = sectionConfig.defaultContent || '';
    }
    
    // Apply variable substitution
    content = this.substituteVariables(content, config.variables || {});
    
    return {
      id: `${template.id}-${sectionType}`,
      type: sectionType,
      title: sectionConfig.title,
      content,
      order: sectionConfig.order
    };
  }

  private buildRulesSection(projectAnalysis: ProjectAnalysis, config: TaskGenerationConfig): string {
    const rulesData = taskTemplatesData.rulesSections.standard;
    
    // Choose appropriate rules based on project type
    let rules: string;
    if (projectAnalysis.projectType.includes('frontend') || projectAnalysis.framework === 'React') {
      rules = rulesData.frontend;
    } else if (projectAnalysis.projectType.includes('backend')) {
      rules = rulesData.backend;
    } else {
      rules = rulesData.frontend; // Default
    }
    
    return `### Rules\n${rules}`;
  }

  private buildTitleSection(template: TaskTemplate, config: TaskGenerationConfig): string {
    const taskNumber = config.variables?.taskNumber || '1.0';
    const projectName = config.variables?.projectName || template.name;
    const framework = config.framework || '';
    
    const frameworkSuffix = framework ? ` (${framework})` : '';
    return `# Task ${taskNumber}: ${projectName}${frameworkSuffix}`;
  }

  private buildStepsSection(
    template: TaskTemplate,
    projectAnalysis: ProjectAnalysis,
    config: TaskGenerationConfig
  ): string {
    const steps: string[] = [];
    
    switch (template.type) {
      case TaskType.INITIALIZATION:
        steps.push(
          '**From the project root:**',
          '',
          '```powershell',
          'Get-ChildItem -Path . -Recurse | Remove-Item -Force -Recurse && mkdir electron, frontend, backend && npm init -y',
          '```'
        );
        break;
        
      case TaskType.FRONTEND_SETUP:
        if (projectAnalysis.framework === 'React' || config.framework === 'React') {
          steps.push(
            '### 1. Initial Project Setup & Dependency Installation',
            '',
            '```powershell',
            '# Navigate to frontend dir',
            '# Always use the FULL ABSOLUTE PATH when you cd',
            'cd frontend && npm create vite@latest app -- --template react-ts && cd app',
            '```'
          );
        }
        break;
        
      case TaskType.BACKEND_SETUP:
        if (projectAnalysis.framework === '.NET' || config.framework === '.NET') {
          steps.push(
            '### 1. Scaffold Project and Install Packages',
            '',
            '**From the project root:**',
            '',
            '```powershell',
            'cd backend && dotnet new webapi -f net8.0 --no-https --output .',
            '```'
          );
        }
        break;
    }
    
    return steps.join('\n');
  }

  private buildCommandsSection(
    template: TaskTemplate,
    projectAnalysis: ProjectAnalysis,
    config: TaskGenerationConfig
  ): string {
    const platform = config.variables?.platform || 'cross-platform';
    
    if (platform === 'Windows' || platform === 'cross-platform') {
      return '## Commands (PowerShell)\n\nEnsure you are in your project\'s root directory in a PowerShell terminal before running these commands.';
    }
    
    return '## Commands\n\nEnsure you are in your project\'s root directory before running these commands.';
  }

  private buildConfigurationSection(
    template: TaskTemplate,
    projectAnalysis: ProjectAnalysis,
    config: TaskGenerationConfig
  ): string {
    // Generate configuration based on framework
    const configs: string[] = [];
    
    if (projectAnalysis.framework === 'React') {
      configs.push(
        '#### TypeScript Configuration (`tsconfig.app.json`, `tsconfig.node.json`)',
        '',
        '**`tsconfig.app.json`:**',
        '',
        '```json',
        JSON.stringify({
          compilerOptions: {
            target: 'ES2020',
            lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'node',
            allowImportingTsExtensions: false,
            noEmit: true,
            jsx: 'react-jsx',
            strict: true,
            baseUrl: '.',
            paths: { '@/*': ['src/*'] }
          },
          include: ['src/**/*.ts', 'src/**/*.tsx']
        }, null, 2),
        '```'
      );
    }
    
    return configs.join('\n');
  }

  private buildCodeBlocksSection(
    template: TaskTemplate,
    projectAnalysis: ProjectAnalysis,
    config: TaskGenerationConfig
  ): string {
    const codeBlocks: string[] = [];
    
    if (template.type === TaskType.FRONTEND_SETUP && projectAnalysis.framework === 'React') {
      codeBlocks.push(
        '### Bootstrap Code',
        '',
        '**Create or update (`src/main.tsx`)**',
        '',
        '```tsx',
        'import React from \'react\'',
        'import ReactDOM from \'react-dom/client\'',
        'import App from \'./App\'',
        'import \'./index.css\'',
        '',
        'ReactDOM.createRoot(document.getElementById(\'root\') as HTMLElement).render(',
        '  <React.StrictMode>',
        '    <App />',
        '  </React.StrictMode>,',
        ')',
        '```'
      );
    }
    
    return codeBlocks.join('\n');
  }

  private createTaskMetadata(
    template: TaskTemplate,
    projectAnalysis: ProjectAnalysis,
    config: TaskGenerationConfig
  ): TaskMetadata {
    return {
      title: template.name,
      version: config.variables?.taskNumber || '1.0',
      type: template.type,
      category: template.category,
      estimatedDuration: this.estimateDuration(projectAnalysis.complexity),
      prerequisites: this.generatePrerequisites(projectAnalysis),
      outputFiles: this.generateOutputFiles(template, projectAnalysis),
      commands: this.extractCommands(template, projectAnalysis),
      framework: projectAnalysis.framework,
      platform: config.variables?.platform || null
    };
  }

  private renderTaskMarkdown(
    metadata: TaskMetadata,
    sections: TaskSection[],
    options: TaskGenerationOptions
  ): string {
    const lines: string[] = [];
    
    // Render sections in order
    const sortedSections = sections.sort((a, b) => a.order - b.order);
    
    for (const section of sortedSections) {
      if (section.content.trim()) {
        if (section.type !== SectionType.TITLE) {
          lines.push('');
        }
        lines.push(section.content);
      }
    }
    
    // Add completion call at the end
    lines.push('', '## Then call attempt completion', '');
    
    return lines.join('\n');
  }

  private substituteVariables(content: string, variables: Record<string, any>): string {
    let result = content;
    
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value));
    }
    
    return result;
  }

  // Helper methods for project analysis
  private inferPrimaryLanguage(results: any[]): string {
    const extensions = results.map(f => f.path.split('.').pop()?.toLowerCase()).filter(Boolean);
    const counts = extensions.reduce((acc, ext) => {
      acc[ext!] = (acc[ext!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const languageMap: Record<string, string> = {
      'ts': 'TypeScript',
      'tsx': 'TypeScript',
      'js': 'JavaScript',
      'jsx': 'JavaScript',
      'cs': 'C#',
      'py': 'Python',
      'java': 'Java',
      'go': 'Go',
      'rs': 'Rust'
    };
    
    const topExtension = Object.entries(counts).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];
    return languageMap[topExtension] || 'Unknown';
  }

  private inferBuildSystem(frameworkResult: FrameworkDetectionResult): string {
    if (frameworkResult.buildTools.bundler) return frameworkResult.buildTools.bundler;
    if (frameworkResult.buildTools.taskRunner) return frameworkResult.buildTools.taskRunner;
    return 'unknown';
  }

  private extractDependencies(frameworkResult: FrameworkDetectionResult): string[] {
    return [
      ...frameworkResult.evidence.packageJson.dependencies,
      ...frameworkResult.evidence.packageJson.devDependencies
    ];
  }

  private assessProjectComplexity(structureAnalysis: any, frameworkResult: FrameworkDetectionResult): TaskComplexity {
    const fileCount = structureAnalysis.results.length;
    const frameworkCount = frameworkResult.frameworks.length;
    
    if (fileCount < 10 && frameworkCount <= 1) return TaskComplexity.SIMPLE;
    if (fileCount < 50 && frameworkCount <= 2) return TaskComplexity.MODERATE;
    if (fileCount < 200 && frameworkCount <= 3) return TaskComplexity.COMPLEX;
    return TaskComplexity.EXPERT;
  }

  private getPrimaryFrameworkName(frameworkResult: FrameworkDetectionResult): string {
    const primaryFramework = this.frameworkDetectionService.getPrimaryFramework(frameworkResult);
    return primaryFramework?.name || 'Unknown';
  }

  private isSourceFile(filePath: string): boolean {
    const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx', '.cs', '.py', '.java', '.go', '.rs'];
    return sourceExtensions.some(ext => filePath.endsWith(ext));
  }

  private isTestFile(filePath: string): boolean {
    const testPatterns = ['.test.', '.spec.', '__tests__', '/tests/'];
    return testPatterns.some(pattern => filePath.includes(pattern));
  }

  private findTemplateByFramework(framework: string): TaskTemplate | null {
    const frameworkMap: Record<string, string> = {
      'React': 'frontend-react',
      '.NET': 'backend-dotnet',
      'Express': 'backend-express'
    };
    
    const templateId = frameworkMap[framework];
    return templateId ? this.templates.get(templateId) || null : null;
  }

  private findTemplateByProjectType(projectType: string): TaskTemplate | null {
    if (projectType.includes('frontend')) return this.templates.get('frontend-react') || null;
    if (projectType.includes('backend')) return this.templates.get('backend-dotnet') || null;
    return null;
  }

  private inferLanguageFromFramework(framework?: string): string {
    const frameworkLanguageMap: Record<string, string> = {
      'React': 'TypeScript',
      'Vue': 'TypeScript',
      'Angular': 'TypeScript',
      '.NET': 'C#',
      'Express': 'TypeScript',
      'Django': 'Python',
      'Spring': 'Java'
    };
    
    return frameworkLanguageMap[framework || ''] || 'JavaScript';
  }

  private estimateDuration(complexity: TaskComplexity): string {
    const durationMap = {
      [TaskComplexity.SIMPLE]: '15-30 minutes',
      [TaskComplexity.MODERATE]: '30-60 minutes',
      [TaskComplexity.COMPLEX]: '1-2 hours',
      [TaskComplexity.EXPERT]: '2+ hours'
    };
    
    return durationMap[complexity];
  }

  private generatePrerequisites(projectAnalysis: ProjectAnalysis): string[] {
    const prerequisites: string[] = [];
    
    if (projectAnalysis.language === 'TypeScript' || projectAnalysis.language === 'JavaScript') {
      prerequisites.push('Node.js 18+', 'npm or yarn');
    }
    
    if (projectAnalysis.language === 'C#') {
      prerequisites.push('.NET 8 SDK');
    }
    
    if (projectAnalysis.framework === 'React') {
      prerequisites.push('Basic React knowledge');
    }
    
    return prerequisites;
  }

  private generateOutputFiles(template: TaskTemplate, projectAnalysis: ProjectAnalysis): string[] {
    const files: string[] = [];
    
    switch (template.type) {
      case TaskType.INITIALIZATION:
        files.push('package.json', 'frontend/', 'backend/', 'electron/');
        break;
      case TaskType.FRONTEND_SETUP:
        files.push('src/App.tsx', 'src/main.tsx', 'tsconfig.json', 'vite.config.ts');
        break;
      case TaskType.BACKEND_SETUP:
        if (projectAnalysis.framework === '.NET') {
          files.push('Program.cs', 'appsettings.json', '*.csproj');
        }
        break;
    }
    
    return files;
  }

  private extractCommands(template: TaskTemplate, projectAnalysis: ProjectAnalysis): string[] {
    const commands: string[] = [];
    
    switch (template.type) {
      case TaskType.INITIALIZATION:
        commands.push('npm init -y', 'mkdir frontend backend electron');
        break;
      case TaskType.FRONTEND_SETUP:
        commands.push('npm create vite@latest', 'npm install', 'npm run build');
        break;
      case TaskType.BACKEND_SETUP:
        if (projectAnalysis.framework === '.NET') {
          commands.push('dotnet new webapi', 'dotnet restore', 'dotnet build');
        }
        break;
    }
    
    return commands;
  }

  private validateTaskOutput(result: TaskGenerationResult): void {
    if (!result.content || result.content.trim().length === 0) {
      throw new TaskGenerationError('Generated task content is empty', 'validation');
    }
    
    if (!result.metadata.title) {
      throw new TaskGenerationError('Task metadata missing title', 'validation');
    }
    
    if (result.sections.length === 0) {
      throw new TaskGenerationError('Task has no sections', 'validation');
    }
    
    // Validate required sections are present
    const hasRules = result.sections.some(s => s.type === SectionType.RULES);
    const hasTitle = result.sections.some(s => s.type === SectionType.TITLE);
    
    if (!hasRules) {
      throw new TaskGenerationError('Task missing required Rules section', 'validation');
    }
    
    if (!hasTitle) {
      throw new TaskGenerationError('Task missing required Title section', 'validation');
    }
  }
}