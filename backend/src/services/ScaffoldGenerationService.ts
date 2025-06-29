import {
  ScaffoldGenerationResult,
  GeneratedScript,
  ScaffoldMetadata,
  ScaffoldSummary,
  ScaffoldConfig,
  ScriptTemplate,
  CommandMapping,
  Platform,
  ScriptFormat,
  CommandStage,
  CommandCategory,
  ScaffoldGenerationError,
  ScaffoldGenerationOptions,
  CustomCommand
} from '../types/scaffoldGeneration';
import { FrameworkDetectionService } from './FrameworkDetectionService';
import { TaskGenerationService } from './TaskGenerationService';
import { CommandTranslationService } from './CommandTranslationService';
import { FrameworkDetectionResult } from '../types/framework';
import * as scriptTemplatesData from '../data/scriptTemplates.json';

export class ScaffoldGenerationService {
  private frameworkDetectionService: FrameworkDetectionService;
  private taskGenerationService: TaskGenerationService;
  private commandTranslationService: CommandTranslationService;
  private templates: Map<string, ScriptTemplate>;
  private commandMappings: Map<string, CommandMapping>;

  constructor(
    frameworkDetectionService?: FrameworkDetectionService,
    taskGenerationService?: TaskGenerationService,
    commandTranslationService?: CommandTranslationService
  ) {
    this.frameworkDetectionService = frameworkDetectionService || new FrameworkDetectionService();
    this.taskGenerationService = taskGenerationService || new TaskGenerationService();
    this.commandTranslationService = commandTranslationService || new CommandTranslationService();
    this.templates = new Map();
    this.commandMappings = new Map();
    this.loadTemplates();
  }

  /**
   * Generate scaffold scripts from project analysis
   */
  async generateScaffolds(
    projectPath: string,
    config: ScaffoldConfig,
    options: ScaffoldGenerationOptions = {}
  ): Promise<ScaffoldGenerationResult> {
    try {
      // Analyze the project to understand framework and structure
      const frameworkResult = await this.frameworkDetectionService.detectFrameworks(projectPath);
      
      // Generate scripts for each platform/format combination
      const scripts = await this.generateAllScripts(frameworkResult, config, options);
      
      // Create metadata
      const metadata = this.createMetadata(config, scripts);
      
      // Create summary
      const summary = this.createSummary(scripts, config);
      
      return {
        scripts,
        metadata,
        summary
      };
    } catch (error) {
      throw new ScaffoldGenerationError(
        `Failed to generate scaffolds for ${projectPath}: ${(error as Error).message}`,
        'generation',
        undefined,
        undefined,
        error as Error
      );
    }
  }

  /**
   * Generate scaffold scripts from configuration only
   */
  async generateFromConfig(
    config: ScaffoldConfig,
    options: ScaffoldGenerationOptions = {}
  ): Promise<ScaffoldGenerationResult> {
    try {
      const scripts = await this.generateAllScripts(null, config, options);
      const metadata = this.createMetadata(config, scripts);
      const summary = this.createSummary(scripts, config);
      
      return {
        scripts,
        metadata,
        summary
      };
    } catch (error) {
      throw new ScaffoldGenerationError(
        `Failed to generate scaffolds from config: ${(error as Error).message}`,
        'config-generation',
        undefined,
        undefined,
        error as Error
      );
    }
  }

  /**
   * Generate specific script format for platform
   */
  async generateScript(
    platform: Platform,
    format: ScriptFormat,
    config: ScaffoldConfig,
    options: ScaffoldGenerationOptions = {}
  ): Promise<GeneratedScript> {
    try {
      const template = this.getTemplate(platform, format);
      if (!template) {
        throw new Error(`No template found for ${platform}/${format}`);
      }

      const content = await this.buildScriptContent(template, config, options);
      
      return {
        platform,
        format,
        filename: this.generateFilename(format, config.projectName),
        content,
        executable: this.isExecutableFormat(format),
        permissions: this.getDefaultPermissions(format),
        encoding: 'utf-8'
      };
    } catch (error) {
      throw new ScaffoldGenerationError(
        `Failed to generate ${format} script for ${platform}`,
        'script-generation',
        platform,
        format,
        error as Error
      );
    }
  }

  /**
   * Get available script formats for platform
   */
  getAvailableFormats(platform: Platform): ScriptFormat[] {
    const formats: ScriptFormat[] = [];
    
    for (const template of this.templates.values()) {
      if (template.platform === platform || template.platform === Platform.CROSS_PLATFORM) {
        formats.push(template.format);
      }
    }
    
    return [...new Set(formats)];
  }

  /**
   * Get supported platforms
   */
  getSupportedPlatforms(): Platform[] {
    return Object.values(Platform);
  }

  /**
   * Validate scaffold configuration
   */
  validateConfig(config: ScaffoldConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config.projectName || config.projectName.trim().length === 0) {
      errors.push('Project name is required');
    }
    
    if (!config.platforms || config.platforms.length === 0) {
      errors.push('At least one platform must be specified');
    }
    
    if (!config.formats || config.formats.length === 0) {
      errors.push('At least one script format must be specified');
    }
    
    // Validate platform/format combinations
    for (const platform of config.platforms) {
      for (const format of config.formats) {
        if (!this.isValidCombination(platform, format)) {
          errors.push(`Invalid combination: ${platform}/${format}`);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  private loadTemplates(): void {
    try {
      const templates = scriptTemplatesData.templates;
      const commandMappings = scriptTemplatesData.commandMappings;
      
      // Load script templates
      for (const [id, templateData] of Object.entries(templates)) {
        const template: ScriptTemplate = {
          id,
          name: templateData.name,
          platform: templateData.platform as Platform,
          format: templateData.format as ScriptFormat,
          header: templateData.header,
          footer: templateData.footer,
          commandSeparator: templateData.commandSeparator,
          commentPrefix: templateData.commentPrefix,
          variablePrefix: templateData.variablePrefix,
          conditionalSyntax: templateData.conditionalSyntax,
          errorHandling: templateData.errorHandling
        };
        
        this.templates.set(id, template);
      }
      
      // Load command mappings
      for (const [command, mappingData] of Object.entries(commandMappings)) {
        const mapping: CommandMapping = {
          generic: mappingData.generic,
          windows: mappingData.windows,
          macos: mappingData.macos,
          linux: mappingData.linux,
          description: mappingData.description,
          category: mappingData.category as CommandCategory
        };
        
        this.commandMappings.set(command, mapping);
      }
    } catch (error) {
      throw new ScaffoldGenerationError(
        'Failed to load script templates',
        'template-loading',
        undefined,
        undefined,
        error as Error
      );
    }
  }

  private async generateAllScripts(
    frameworkResult: FrameworkDetectionResult | null,
    config: ScaffoldConfig,
    options: ScaffoldGenerationOptions
  ): Promise<GeneratedScript[]> {
    const scripts: GeneratedScript[] = [];
    
    for (const platform of config.platforms) {
      for (const format of config.formats) {
        if (this.isValidCombination(platform, format)) {
          try {
            const script = await this.generateScript(platform, format, config, options);
            scripts.push(script);
          } catch (error) {
            if (options.verbose) {
              console.warn(`Skipping ${platform}/${format}: ${(error as Error).message}`);
            }
          }
        }
      }
    }
    
    return scripts;
  }

  private async buildScriptContent(
    template: ScriptTemplate,
    config: ScaffoldConfig,
    options: ScaffoldGenerationOptions
  ): Promise<string> {
    const sections: string[] = [];
    
    // Add header
    sections.push(this.processTemplate(template.header, config));
    
    // Add setup commands
    const commands = await this.generateCommands(config, template.platform);
    sections.push(this.formatCommands(commands, template, options));
    
    // Add custom commands if provided
    if (config.customCommands && config.customCommands.length > 0) {
      const customSection = this.generateCustomCommandsSection(
        config.customCommands,
        template,
        options
      );
      if (customSection) {
        sections.push(customSection);
      }
    }
    
    // Add validation commands if requested
    if (config.includeValidation) {
      const validationSection = this.generateValidationSection(config, template, options);
      if (validationSection) {
        sections.push(validationSection);
      }
    }
    
    // Add cleanup commands if requested
    if (config.includeCleanup) {
      const cleanupSection = this.generateCleanupSection(config, template, options);
      if (cleanupSection) {
        sections.push(cleanupSection);
      }
    }
    
    // Add footer
    sections.push(this.processTemplate(template.footer, config));
    
    return sections.filter(section => section.trim().length > 0).join('\n');
  }

  private async generateCommands(config: ScaffoldConfig, platform: Platform): Promise<string[]> {
    const commands: string[] = [];
    
    // Framework-specific commands
    if (config.framework) {
      const frameworkCommands = this.getFrameworkCommands(config.framework, config);
      commands.push(...frameworkCommands);
    }
    
    // Generic setup commands
    commands.push(
      this.translateCommand('createDirectory', { path: 'src' }, platform),
      this.translateCommand('createDirectory', { path: 'public' }, platform),
      this.translateCommand('createDirectory', { path: 'tests' }, platform)
    );
    
    // Add package installation
    if (config.framework && this.requiresPackageInstall(config.framework)) {
      commands.push(this.translateCommand('installNpmPackages', {}, platform));
    }
    
    return commands.filter(cmd => cmd.trim().length > 0);
  }

  private getFrameworkCommands(framework: string, config: ScaffoldConfig): string[] {
    const frameworkCommands = (scriptTemplatesData as any).frameworkCommands[framework.toLowerCase()];
    if (!frameworkCommands) {
      return [];
    }
    
    const commands: string[] = [];
    
    if (frameworkCommands.create) {
      commands.push(this.processTemplate(frameworkCommands.create, config));
    }
    
    if (frameworkCommands.install) {
      commands.push(frameworkCommands.install);
    }
    
    return commands;
  }

  private translateCommand(
    commandName: string,
    variables: Record<string, any>,
    platform: Platform
  ): string {
    const mapping = this.commandMappings.get(commandName);
    if (!mapping) {
      return '';
    }
    
    let command = '';
    switch (platform) {
      case Platform.WINDOWS:
        command = mapping.windows;
        break;
      case Platform.MACOS:
        command = mapping.macos;
        break;
      case Platform.LINUX:
        command = mapping.linux;
        break;
      default:
        command = mapping.generic;
    }
    
    return this.processTemplate(command, variables);
  }

  private formatCommands(
    commands: string[],
    template: ScriptTemplate,
    options: ScaffoldGenerationOptions
  ): string {
    const formattedCommands: string[] = [];
    
    for (const command of commands) {
      if (command.trim().length === 0) continue;
      
      let formattedCommand = command;
      
      // Add error handling if requested
      if (options.includeErrorHandling) {
        formattedCommand = this.addErrorHandling(formattedCommand, template);
      }
      
      // Add comments if requested
      if (options.includeComments) {
        const comment = this.generateCommandComment(command, template);
        if (comment) {
          formattedCommands.push(comment);
        }
      }
      
      formattedCommands.push(formattedCommand);
    }
    
    return formattedCommands.join('\n');
  }

  private generateCustomCommandsSection(
    customCommands: CustomCommand[],
    template: ScriptTemplate,
    options: ScaffoldGenerationOptions
  ): string | null {
    const platformCommands = customCommands.filter(cmd => 
      cmd.platforms.includes(template.platform) || 
      cmd.platforms.includes(Platform.CROSS_PLATFORM)
    );
    
    if (platformCommands.length === 0) {
      return null;
    }
    
    const section: string[] = [];
    section.push(template.commentPrefix + 'Custom Commands');
    
    for (const customCmd of platformCommands) {
      if (options.includeComments && customCmd.description) {
        section.push(template.commentPrefix + customCmd.description);
      }
      
      let command = customCmd.command;
      if (options.includeErrorHandling) {
        command = this.addErrorHandling(command, template);
      }
      
      section.push(command);
    }
    
    return section.join('\n');
  }

  private generateValidationSection(
    config: ScaffoldConfig,
    template: ScriptTemplate,
    options: ScaffoldGenerationOptions
  ): string | null {
    const section: string[] = [];
    section.push(template.commentPrefix + 'Validation');
    
    // Add framework-specific validation
    if (config.framework) {
      const buildCommand = this.getFrameworkBuildCommand(config.framework);
      if (buildCommand) {
        section.push(buildCommand);
      }
      
      const testCommand = this.getFrameworkTestCommand(config.framework);
      if (testCommand) {
        section.push(testCommand);
      }
    }
    
    return section.length > 1 ? section.join('\n') : null;
  }

  private generateCleanupSection(
    config: ScaffoldConfig,
    template: ScriptTemplate,
    options: ScaffoldGenerationOptions
  ): string | null {
    const section: string[] = [];
    section.push(template.commentPrefix + 'Cleanup');
    
    // Add cleanup commands
    section.push(
      this.translateCommand('removeDirectory', { path: 'node_modules' }, template.platform),
      this.translateCommand('removeDirectory', { path: 'dist' }, template.platform),
      this.translateCommand('removeDirectory', { path: '.tmp' }, template.platform)
    );
    
    return section.join('\n');
  }

  private addErrorHandling(command: string, template: ScriptTemplate): string {
    const errorHandling = template.errorHandling.exitOnError.replace('{{command}}', command);
    return errorHandling;
  }

  private generateCommandComment(command: string, template: ScriptTemplate): string | null {
    // Try to generate a meaningful comment for the command
    const commandType = this.identifyCommandType(command);
    if (commandType) {
      return template.commentPrefix + commandType;
    }
    return null;
  }

  private identifyCommandType(command: string): string | null {
    if (command.includes('mkdir') || command.includes('New-Item')) {
      return 'Create directory structure';
    }
    if (command.includes('npm install')) {
      return 'Install dependencies';
    }
    if (command.includes('npm run build') || command.includes('build')) {
      return 'Build project';
    }
    if (command.includes('npm test') || command.includes('test')) {
      return 'Run tests';
    }
    return null;
  }

  private processTemplate(template: string, variables: Record<string, any>): string {
    let result = template;
    
    // Add default variables
    const defaultVars = {
      date: new Date().toISOString().split('T')[0],
      projectName: variables.projectName || 'Project',
      framework: variables.framework || '',
      baseImage: this.getDefaultBaseImage(variables.framework),
      port: variables.port || '3000',
      startCommand: this.getDefaultStartCommand(variables.framework)
    };
    
    const allVars = { ...defaultVars, ...variables };
    
    for (const [key, value] of Object.entries(allVars)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value));
    }
    
    return result;
  }

  private getTemplate(platform: Platform, format: ScriptFormat): ScriptTemplate | null {
    // Try exact match first
    for (const template of this.templates.values()) {
      if (template.platform === platform && template.format === format) {
        return template;
      }
    }
    
    // Try cross-platform match
    for (const template of this.templates.values()) {
      if (template.platform === Platform.CROSS_PLATFORM && template.format === format) {
        return template;
      }
    }
    
    return null;
  }

  private generateFilename(format: ScriptFormat, projectName: string): string {
    const sanitizedName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    const extensions: Record<ScriptFormat, string> = {
      [ScriptFormat.BATCH]: '.bat',
      [ScriptFormat.POWERSHELL]: '.ps1',
      [ScriptFormat.BASH]: '.sh',
      [ScriptFormat.ZSH]: '.zsh',
      [ScriptFormat.FISH]: '.fish',
      [ScriptFormat.CMD]: '.cmd',
      [ScriptFormat.PYTHON]: '.py',
      [ScriptFormat.NODE]: '.js',
      [ScriptFormat.MAKE]: 'Makefile',
      [ScriptFormat.DOCKER]: 'Dockerfile',
      [ScriptFormat.DOCKER_COMPOSE]: 'docker-compose.yml',
      [ScriptFormat.VAGRANT]: 'Vagrantfile'
    };
    
    const extension = extensions[format];
    
    if (format === ScriptFormat.MAKE || format === ScriptFormat.DOCKER || 
        format === ScriptFormat.DOCKER_COMPOSE || format === ScriptFormat.VAGRANT) {
      return extension;
    }
    
    return `setup-${sanitizedName}${extension}`;
  }

  private isExecutableFormat(format: ScriptFormat): boolean {
    const executableFormats = [
      ScriptFormat.BASH,
      ScriptFormat.ZSH,
      ScriptFormat.FISH,
      ScriptFormat.PYTHON,
      ScriptFormat.NODE
    ];
    
    return executableFormats.includes(format);
  }

  private getDefaultPermissions(format: ScriptFormat): string {
    if (this.isExecutableFormat(format)) {
      return 'rwxr-xr-x'; // 755
    }
    return 'rw-r--r--'; // 644
  }

  private isValidCombination(platform: Platform, format: ScriptFormat): boolean {
    // Check if we have a template for this combination
    return this.getTemplate(platform, format) !== null;
  }

  private requiresPackageInstall(framework: string): boolean {
    const jsFrameworks = ['react', 'vue', 'angular', 'nextjs', 'express'];
    return jsFrameworks.includes(framework.toLowerCase());
  }

  private getFrameworkBuildCommand(framework: string): string | null {
    const commands = (scriptTemplatesData as any).frameworkCommands[framework.toLowerCase()];
    return commands?.build || null;
  }

  private getFrameworkTestCommand(framework: string): string | null {
    const commands = (scriptTemplatesData as any).frameworkCommands[framework.toLowerCase()];
    return commands?.test || null;
  }

  private getDefaultBaseImage(framework?: string): string {
    if (!framework) return 'node:18-alpine';
    
    const imageMap: Record<string, string> = {
      'react': 'node:18-alpine',
      'vue': 'node:18-alpine',
      'angular': 'node:18-alpine',
      'nextjs': 'node:18-alpine',
      'express': 'node:18-alpine',
      'dotnet': 'mcr.microsoft.com/dotnet/aspnet:8.0'
    };
    
    return imageMap[framework.toLowerCase()] || 'node:18-alpine';
  }

  private getDefaultStartCommand(framework?: string): string {
    if (!framework) return 'npm start';
    
    const commandMap: Record<string, string> = {
      'react': 'npm start',
      'vue': 'npm start',
      'angular': 'npm start',
      'nextjs': 'npm start',
      'express': 'npm start',
      'dotnet': 'dotnet run'
    };
    
    return commandMap[framework.toLowerCase()] || 'npm start';
  }

  private createMetadata(config: ScaffoldConfig, scripts: GeneratedScript[]): ScaffoldMetadata {
    return {
      projectName: config.projectName,
      framework: config.framework || 'unknown',
      platforms: config.platforms,
      formats: config.formats,
      generatedAt: new Date(),
      totalScripts: scripts.length,
      estimatedRuntime: this.estimateRuntime(scripts)
    };
  }

  private createSummary(scripts: GeneratedScript[], config: ScaffoldConfig): ScaffoldSummary {
    const platforms = new Set(scripts.map(s => s.platform));
    const commandCount = scripts.reduce((count, script) => {
      return count + (script.content.split('\n').filter(line => 
        line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('REM')
      ).length);
    }, 0);
    
    return {
      scriptsGenerated: scripts.length,
      platformsCovered: platforms.size,
      commandsIncluded: commandCount,
      prerequisites: this.generatePrerequisites(config),
      outputFiles: scripts.map(s => s.filename)
    };
  }

  private estimateRuntime(scripts: GeneratedScript[]): string {
    const avgTimePerScript = 2; // minutes
    const totalTime = scripts.length * avgTimePerScript;
    
    if (totalTime < 60) {
      return `${totalTime} minutes`;
    }
    
    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;
    return `${hours}h ${minutes}m`;
  }

  private generatePrerequisites(config: ScaffoldConfig): string[] {
    const prerequisites: string[] = [];
    
    if (config.framework) {
      const framework = config.framework.toLowerCase();
      
      if (['react', 'vue', 'angular', 'nextjs', 'express'].includes(framework)) {
        prerequisites.push('Node.js 18+', 'npm or yarn');
      }
      
      if (framework === 'dotnet') {
        prerequisites.push('.NET 8 SDK');
      }
      
      if (framework === 'angular') {
        prerequisites.push('Angular CLI');
      }
    }
    
    if (config.formats.includes(ScriptFormat.DOCKER)) {
      prerequisites.push('Docker');
    }
    
    if (config.formats.includes(ScriptFormat.DOCKER_COMPOSE)) {
      prerequisites.push('Docker', 'Docker Compose');
    }
    
    return [...new Set(prerequisites)];
  }
}