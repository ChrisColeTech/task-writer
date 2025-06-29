import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  ExportResult,
  ExportedFile,
  ExportMetadata,
  ExportSummary,
  ExportConfig,
  ExportFormat,
  FileEncoding,
  FilePermissions,
  CompressionLevel,
  CompressionFormat,
  OutputStructure,
  ExportError,
  ExportOptions
} from '../types/export';
import { TaskGenerationService } from './TaskGenerationService';
import { ScaffoldGenerationService } from './ScaffoldGenerationService';
import { Platform, ScriptFormat } from '../types/scaffoldGeneration';
import { TaskGenerationResult } from '../types/taskGeneration';
import { ScaffoldGenerationResult } from '../types/scaffoldGeneration';

export class ExportService {
  private taskGenerationService: TaskGenerationService;
  private scaffoldGenerationService: ScaffoldGenerationService;

  constructor(
    taskGenerationService?: TaskGenerationService,
    scaffoldGenerationService?: ScaffoldGenerationService
  ) {
    this.taskGenerationService = taskGenerationService || new TaskGenerationService();
    this.scaffoldGenerationService = scaffoldGenerationService || new ScaffoldGenerationService();
  }

  /**
   * Export task files and scripts for a project
   */
  async exportProject(
    projectPath: string,
    config: ExportConfig,
    options: ExportOptions = {}
  ): Promise<ExportResult> {
    try {
      const files: ExportedFile[] = [];
      
      // Ensure output directory exists
      await this.ensureOutputDirectory(config.outputDirectory);
      
      // Generate and export task files
      if (config.formats.includes(ExportFormat.MARKDOWN)) {
        const taskFiles = await this.exportTaskFiles(projectPath, config, options);
        files.push(...taskFiles);
      }
      
      // Generate and export scaffold scripts
      const scriptFormats = this.getScriptFormats(config.formats);
      if (scriptFormats.length > 0) {
        const scriptFiles = await this.exportScaffoldScripts(projectPath, config, scriptFormats, options);
        files.push(...scriptFiles);
      }
      
      // Generate and export config files
      const configFormats = this.getConfigFormats(config.formats);
      if (configFormats.length > 0) {
        const configFiles = await this.exportConfigFiles(config, configFormats, options);
        files.push(...configFiles);
      }
      
      // Generate README if requested
      if (config.includeReadme) {
        const readmeFile = await this.generateReadme(config, files, options);
        files.push(readmeFile);
      }
      
      // Generate metadata file if requested
      if (config.includeMetadata) {
        const metadataFile = await this.generateMetadataFile(config, files, options);
        files.push(metadataFile);
      }
      
      // Create archive if compression is enabled
      if (options.compression?.enabled) {
        await this.createArchive(files, config, options);
      }
      
      // Generate export metadata and summary
      const metadata = this.createExportMetadata(config, files);
      const summary = this.createExportSummary(files);
      
      return {
        files,
        metadata,
        summary
      };
    } catch (error) {
      throw new ExportError(
        `Failed to export project from ${projectPath}`,
        'export',
        undefined,
        error as Error
      );
    }
  }

  /**
   * Export single task file
   */
  async exportTaskFile(
    taskResult: TaskGenerationResult,
    outputPath: string,
    options: ExportOptions = {}
  ): Promise<ExportedFile> {
    try {
      const filename = path.basename(outputPath);
      const content = taskResult.content;
      const encoding = options.encoding || FileEncoding.UTF8;
      const nodeEncoding = this.convertToNodeEncoding(encoding);
      
      // Write file
      if (!options.dryRun) {
        await fs.writeFile(outputPath, content, { encoding: nodeEncoding });
        
        // Set permissions
        if (options.permissions && !process.platform.startsWith('win')) {
          const permissions = this.calculateOctalPermissions(options.permissions);
          await fs.chmod(outputPath, parseInt(permissions, 8));
        }
      }
      
      const exportedFile: ExportedFile = {
        filename,
        path: outputPath,
        content,
        format: ExportFormat.MARKDOWN,
        encoding,
        size: Buffer.byteLength(content, nodeEncoding),
        permissions: options.permissions ? { ...this.getDefaultPermissions(ExportFormat.MARKDOWN), ...options.permissions } : this.getDefaultPermissions(ExportFormat.MARKDOWN),
        checksum: this.calculateChecksum(content),
        mimeType: this.getMimeType(ExportFormat.MARKDOWN)
      };
      
      return exportedFile;
    } catch (error) {
      throw new ExportError(
        `Failed to export task file to ${outputPath}`,
        'task-export',
        outputPath,
        error as Error
      );
    }
  }

  /**
   * Export scaffold scripts
   */
  async exportScaffoldScript(
    scriptContent: string,
    format: ScriptFormat,
    outputPath: string,
    options: ExportOptions = {}
  ): Promise<ExportedFile> {
    try {
      const filename = path.basename(outputPath);
      const encoding = options.encoding || FileEncoding.UTF8;
      const nodeEncoding = this.convertToNodeEncoding(encoding);
      const exportFormat = this.mapScriptFormatToExportFormat(format);
      
      // Write file
      if (!options.dryRun) {
        await fs.writeFile(outputPath, scriptContent, { encoding: nodeEncoding });
        
        // Set executable permissions for script files
        if (this.isExecutableFormat(format) && !process.platform.startsWith('win')) {
          await fs.chmod(outputPath, 0o755);
        }
      }
      
      const exportedFile: ExportedFile = {
        filename,
        path: outputPath,
        content: scriptContent,
        format: exportFormat,
        encoding,
        size: Buffer.byteLength(scriptContent, nodeEncoding),
        permissions: this.getDefaultPermissions(exportFormat),
        checksum: this.calculateChecksum(scriptContent),
        mimeType: this.getMimeType(exportFormat)
      };
      
      return exportedFile;
    } catch (error) {
      throw new ExportError(
        `Failed to export scaffold script to ${outputPath}`,
        'script-export',
        outputPath,
        error as Error
      );
    }
  }

  /**
   * Get supported export formats
   */
  getSupportedFormats(): ExportFormat[] {
    return Object.values(ExportFormat);
  }

  /**
   * Validate export configuration
   */
  validateConfig(config: ExportConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config.projectName || config.projectName.trim().length === 0) {
      errors.push('Project name is required');
    }
    
    if (!config.outputDirectory || config.outputDirectory.trim().length === 0) {
      errors.push('Output directory is required');
    }
    
    if (!config.formats || config.formats.length === 0) {
      errors.push('At least one export format must be specified');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  private async ensureOutputDirectory(outputDir: string): Promise<void> {
    await fs.mkdir(outputDir, { recursive: true });
  }

  private async exportTaskFiles(
    projectPath: string,
    config: ExportConfig,
    options: ExportOptions
  ): Promise<ExportedFile[]> {
    const files: ExportedFile[] = [];
    
    try {
      // Generate task for the project
      const taskConfig = {
        framework: config.customVariables?.framework,
        projectType: config.customVariables?.projectType,
        variables: config.customVariables || {}
      };
      
      const taskResult = await this.taskGenerationService.generateTask(projectPath, taskConfig);
      
      // Export task file
      const filename = `${config.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-task.md`;
      const outputPath = path.join(config.outputDirectory, filename);
      
      const exportedFile = await this.exportTaskFile(taskResult, outputPath, options);
      files.push(exportedFile);
      
    } catch (error) {
      console.warn('Failed to generate task file:', error);
    }
    
    return files;
  }

  private async exportScaffoldScripts(
    projectPath: string,
    config: ExportConfig,
    scriptFormats: ScriptFormat[],
    options: ExportOptions
  ): Promise<ExportedFile[]> {
    const files: ExportedFile[] = [];
    
    try {
      // Generate scaffold scripts
      const scaffoldConfig = {
        projectName: config.projectName,
        framework: config.customVariables?.framework,
        platforms: [Platform.WINDOWS, Platform.MACOS, Platform.LINUX],
        formats: scriptFormats,
        customCommands: config.customVariables?.customCommands || []
      };
      
      const scaffoldResult = await this.scaffoldGenerationService.generateFromConfig(scaffoldConfig);
      
      // Export each script
      for (const script of scaffoldResult.scripts) {
        const outputPath = path.join(config.outputDirectory, script.filename);
        const exportedFile = await this.exportScaffoldScript(
          script.content,
          script.format as ScriptFormat,
          outputPath,
          options
        );
        files.push(exportedFile);
      }
      
    } catch (error) {
      console.warn('Failed to generate scaffold scripts:', error);
    }
    
    return files;
  }

  private async exportConfigFiles(
    config: ExportConfig,
    configFormats: ExportFormat[],
    options: ExportOptions
  ): Promise<ExportedFile[]> {
    const files: ExportedFile[] = [];
    
    for (const format of configFormats) {
      try {
        const configContent = this.generateConfigContent(format, config);
        const filename = this.getConfigFilename(format, config.projectName);
        const outputPath = path.join(config.outputDirectory, filename);
        
        const fileEncoding = options.encoding || FileEncoding.UTF8;
        const nodeEncoding = this.convertToNodeEncoding(fileEncoding);
        if (!options.dryRun) {
          await fs.writeFile(outputPath, configContent, { encoding: nodeEncoding });
        }
        
        const exportedFile: ExportedFile = {
          filename,
          path: outputPath,
          content: configContent,
          format,
          encoding: fileEncoding,
          size: Buffer.byteLength(configContent, nodeEncoding),
          permissions: this.getDefaultPermissions(format),
          checksum: this.calculateChecksum(configContent),
          mimeType: this.getMimeType(format)
        };
        
        files.push(exportedFile);
      } catch (error) {
        console.warn(`Failed to generate ${format} config file:`, error);
      }
    }
    
    return files;
  }

  private async generateReadme(
    config: ExportConfig,
    files: ExportedFile[],
    options: ExportOptions
  ): Promise<ExportedFile> {
    const content = this.generateReadmeContent(config, files);
    const filename = 'README.md';
    const outputPath = path.join(config.outputDirectory, filename);
    const encoding = options.encoding || FileEncoding.UTF8;
    const nodeEncoding = this.convertToNodeEncoding(encoding);
    
    if (!options.dryRun) {
      await fs.writeFile(outputPath, content, { encoding: nodeEncoding });
    }
    
    return {
      filename,
      path: outputPath,
      content,
      format: ExportFormat.README,
      encoding,
      size: Buffer.byteLength(content, nodeEncoding),
      permissions: this.getDefaultPermissions(ExportFormat.README),
      checksum: this.calculateChecksum(content),
      mimeType: this.getMimeType(ExportFormat.README)
    };
  }

  private async generateMetadataFile(
    config: ExportConfig,
    files: ExportedFile[],
    options: ExportOptions
  ): Promise<ExportedFile> {
    const metadata = {
      projectName: config.projectName,
      exportedAt: new Date().toISOString(),
      totalFiles: files.length,
      formats: [...new Set(files.map(f => f.format))],
      files: files.map(f => ({
        filename: f.filename,
        format: f.format,
        size: f.size,
        checksum: f.checksum
      }))
    };
    
    const content = JSON.stringify(metadata, null, 2);
    const filename = 'export-metadata.json';
    const outputPath = path.join(config.outputDirectory, filename);
    const encoding = options.encoding || FileEncoding.UTF8;
    const nodeEncoding = this.convertToNodeEncoding(encoding);
    
    if (!options.dryRun) {
      await fs.writeFile(outputPath, content, { encoding: nodeEncoding });
    }
    
    return {
      filename,
      path: outputPath,
      content,
      format: ExportFormat.JSON,
      encoding,
      size: Buffer.byteLength(content, nodeEncoding),
      permissions: this.getDefaultPermissions(ExportFormat.JSON),
      checksum: this.calculateChecksum(content),
      mimeType: this.getMimeType(ExportFormat.JSON)
    };
  }

  private async createArchive(
    files: ExportedFile[],
    config: ExportConfig,
    options: ExportOptions
  ): Promise<void> {
    // Archive creation would be implemented here
    // For now, we'll just log that it would be created
    console.log(`Would create archive with ${files.length} files`);
  }

  private getScriptFormats(formats: ExportFormat[]): ScriptFormat[] {
    const scriptFormatMap: Partial<Record<ExportFormat, ScriptFormat>> = {
      [ExportFormat.BATCH]: ScriptFormat.BATCH,
      [ExportFormat.POWERSHELL]: ScriptFormat.POWERSHELL,
      [ExportFormat.BASH]: ScriptFormat.BASH,
      [ExportFormat.ZSH]: ScriptFormat.ZSH,
      [ExportFormat.FISH]: ScriptFormat.FISH,
      [ExportFormat.PYTHON]: ScriptFormat.PYTHON,
      [ExportFormat.NODE_JS]: ScriptFormat.NODE,
      [ExportFormat.MAKEFILE]: ScriptFormat.MAKE,
      [ExportFormat.DOCKERFILE]: ScriptFormat.DOCKER,
      [ExportFormat.DOCKER_COMPOSE]: ScriptFormat.DOCKER_COMPOSE,
      [ExportFormat.VAGRANT]: ScriptFormat.VAGRANT
    };
    
    return formats
      .filter(format => format in scriptFormatMap)
      .map(format => scriptFormatMap[format])
      .filter((format): format is ScriptFormat => format !== undefined);
  }

  private getConfigFormats(formats: ExportFormat[]): ExportFormat[] {
    const configFormats = [ExportFormat.JSON, ExportFormat.YAML, ExportFormat.TOML];
    return formats.filter(format => configFormats.includes(format));
  }

  private mapScriptFormatToExportFormat(format: ScriptFormat): ExportFormat {
    const formatMap: Record<ScriptFormat, ExportFormat> = {
      [ScriptFormat.BATCH]: ExportFormat.BATCH,
      [ScriptFormat.POWERSHELL]: ExportFormat.POWERSHELL,
      [ScriptFormat.BASH]: ExportFormat.BASH,
      [ScriptFormat.ZSH]: ExportFormat.ZSH,
      [ScriptFormat.FISH]: ExportFormat.FISH,
      [ScriptFormat.PYTHON]: ExportFormat.PYTHON,
      [ScriptFormat.NODE]: ExportFormat.NODE_JS,
      [ScriptFormat.MAKE]: ExportFormat.MAKEFILE,
      [ScriptFormat.DOCKER]: ExportFormat.DOCKERFILE,
      [ScriptFormat.DOCKER_COMPOSE]: ExportFormat.DOCKER_COMPOSE,
      [ScriptFormat.VAGRANT]: ExportFormat.VAGRANT,
      [ScriptFormat.CMD]: ExportFormat.BATCH // Fallback
    };
    
    return formatMap[format] || ExportFormat.BASH;
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

  private getDefaultPermissions(format: ExportFormat): FilePermissions {
    const isExecutable = [
      ExportFormat.BASH,
      ExportFormat.ZSH,
      ExportFormat.FISH,
      ExportFormat.PYTHON,
      ExportFormat.NODE_JS
    ].includes(format);
    
    if (isExecutable) {
      return {
        owner: { read: true, write: true, execute: true },
        group: { read: true, write: false, execute: true },
        other: { read: true, write: false, execute: true },
        octal: '755',
        symbolic: 'rwxr-xr-x'
      };
    } else {
      return {
        owner: { read: true, write: true, execute: false },
        group: { read: true, write: false, execute: false },
        other: { read: true, write: false, execute: false },
        octal: '644',
        symbolic: 'rw-r--r--'
      };
    }
  }

  private calculateOctalPermissions(permissions: Partial<FilePermissions>): string {
    return permissions.octal || '644';
  }

  private calculateChecksum(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  private getMimeType(format: ExportFormat): string {
    const mimeTypes: Record<ExportFormat, string> = {
      [ExportFormat.MARKDOWN]: 'text/markdown',
      [ExportFormat.JSON]: 'application/json',
      [ExportFormat.YAML]: 'application/x-yaml',
      [ExportFormat.TOML]: 'application/toml',
      [ExportFormat.BASH]: 'application/x-sh',
      [ExportFormat.ZSH]: 'application/x-sh',
      [ExportFormat.FISH]: 'application/x-sh',
      [ExportFormat.PYTHON]: 'text/x-python',
      [ExportFormat.NODE_JS]: 'application/javascript',
      [ExportFormat.BATCH]: 'application/bat',
      [ExportFormat.POWERSHELL]: 'application/x-powershell',
      [ExportFormat.MAKEFILE]: 'text/x-makefile',
      [ExportFormat.DOCKERFILE]: 'text/x-dockerfile',
      [ExportFormat.DOCKER_COMPOSE]: 'application/x-yaml',
      [ExportFormat.VAGRANT]: 'text/x-ruby',
      [ExportFormat.README]: 'text/markdown',
      [ExportFormat.CHANGELOG]: 'text/markdown',
      [ExportFormat.ZIP]: 'application/zip',
      [ExportFormat.TAR]: 'application/x-tar',
      [ExportFormat.TAR_GZ]: 'application/gzip'
    };
    
    return mimeTypes[format] || 'text/plain';
  }

  private generateConfigContent(format: ExportFormat, config: ExportConfig): string {
    const configData = {
      name: config.projectName,
      version: '1.0.0',
      description: `Configuration for ${config.projectName}`,
      author: 'Task Writer',
      scripts: {
        setup: './setup.sh',
        build: 'npm run build',
        test: 'npm test',
        start: 'npm start'
      }
    };
    
    switch (format) {
      case ExportFormat.JSON:
        return JSON.stringify(configData, null, 2);
      case ExportFormat.YAML:
        // Simple YAML serialization (in real implementation, use yaml library)
        return `name: ${configData.name}\nversion: ${configData.version}\ndescription: ${configData.description}\n`;
      case ExportFormat.TOML:
        // Simple TOML serialization (in real implementation, use toml library)
        return `name = "${configData.name}"\nversion = "${configData.version}"\ndescription = "${configData.description}"\n`;
      default:
        return JSON.stringify(configData, null, 2);
    }
  }

  private getConfigFilename(format: ExportFormat, projectName: string): string {
    const sanitizedName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    switch (format) {
      case ExportFormat.JSON:
        return `${sanitizedName}.json`;
      case ExportFormat.YAML:
        return `${sanitizedName}.yml`;
      case ExportFormat.TOML:
        return `${sanitizedName}.toml`;
      default:
        return `${sanitizedName}.json`;
    }
  }

  private generateReadmeContent(config: ExportConfig, files: ExportedFile[]): string {
    const scriptFiles = files.filter(f => this.isScriptFormat(f.format));
    const configFiles = files.filter(f => this.isConfigFormat(f.format));
    const taskFiles = files.filter(f => f.format === ExportFormat.MARKDOWN);
    
    return `# ${config.projectName}

Generated project setup files for ${config.projectName}.

## Files Included

### Task Files
${taskFiles.map(f => `- ${f.filename}`).join('\n') || 'None'}

### Setup Scripts
${scriptFiles.map(f => `- ${f.filename}`).join('\n') || 'None'}

### Configuration Files
${configFiles.map(f => `- ${f.filename}`).join('\n') || 'None'}

## Usage

1. Choose the appropriate setup script for your platform
2. Run the script to set up the project
3. Follow any additional instructions in the task files

## Generated Files

Total files: ${files.length}
Total size: ${files.reduce((sum, f) => sum + f.size, 0)} bytes

Generated on ${new Date().toISOString().split('T')[0]} by Task Writer
`;
  }

  private isScriptFormat(format: ExportFormat): boolean {
    const scriptFormats = [
      ExportFormat.BATCH,
      ExportFormat.POWERSHELL,
      ExportFormat.BASH,
      ExportFormat.ZSH,
      ExportFormat.FISH,
      ExportFormat.PYTHON,
      ExportFormat.NODE_JS,
      ExportFormat.MAKEFILE,
      ExportFormat.DOCKERFILE,
      ExportFormat.DOCKER_COMPOSE,
      ExportFormat.VAGRANT
    ];
    
    return scriptFormats.includes(format);
  }

  private isConfigFormat(format: ExportFormat): boolean {
    const configFormats = [
      ExportFormat.JSON,
      ExportFormat.YAML,
      ExportFormat.TOML
    ];
    
    return configFormats.includes(format);
  }

  private convertToNodeEncoding(encoding: FileEncoding): BufferEncoding {
    const encodingMap: Record<FileEncoding, BufferEncoding> = {
      [FileEncoding.UTF8]: 'utf8',
      [FileEncoding.UTF16]: 'utf16le',
      [FileEncoding.ASCII]: 'ascii',
      [FileEncoding.ISO_8859_1]: 'latin1',
      [FileEncoding.WINDOWS_1252]: 'latin1' // Closest match
    };
    return encodingMap[encoding] || 'utf8';
  }

  private createExportMetadata(config: ExportConfig, files: ExportedFile[]): ExportMetadata {
    return {
      projectName: config.projectName,
      exportedAt: new Date(),
      totalFiles: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      formats: [...new Set(files.map(f => f.format))],
      outputDirectory: config.outputDirectory,
      generatedBy: 'Task Writer Export Service',
      version: '1.0.0'
    };
  }

  private createExportSummary(files: ExportedFile[]): ExportSummary {
    return {
      taskFiles: files.filter(f => f.format === ExportFormat.MARKDOWN).length,
      scriptFiles: files.filter(f => this.isScriptFormat(f.format)).length,
      configFiles: files.filter(f => this.isConfigFormat(f.format)).length,
      documentationFiles: files.filter(f => f.format === ExportFormat.README || f.format === ExportFormat.CHANGELOG).length,
      totalFiles: files.length,
      platforms: ['windows', 'macos', 'linux'], // Would be determined from actual files
      frameworks: [] // Would be determined from config
    };
  }
}