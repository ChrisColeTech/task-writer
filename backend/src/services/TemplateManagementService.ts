import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  TemplateManagementResult,
  ManagedTemplate,
  TemplateMetadata,
  TemplateSummary,
  TemplateSearchOptions,
  TemplateInstallOptions,
  TemplateRepository,
  GitHubRepository,
  TemplateManifest,
  TemplateCategory,
  TemplateType,
  TemplateSource,
  RepositoryType,
  TemplateSortBy,
  TemplateManagementError,
  TemplateManagementOptions
} from '../types/templateManagement';

export class TemplateManagementService {
  private storageDirectory: string;
  private cacheDirectory: string;
  private repositories: Map<string, TemplateRepository>;
  private templates: Map<string, ManagedTemplate>;
  private options: TemplateManagementOptions;

  constructor(options: TemplateManagementOptions = {}) {
    this.options = {
      storageDirectory: options.storageDirectory || './templates',
      cacheDirectory: options.cacheDirectory || './cache/templates',
      enableRemoteSync: options.enableRemoteSync ?? true,
      autoUpdate: options.autoUpdate ?? false,
      maxCacheSize: options.maxCacheSize || 100 * 1024 * 1024, // 100MB
      repositories: options.repositories || [],
      ...options
    };

    this.storageDirectory = this.options.storageDirectory!;
    this.cacheDirectory = this.options.cacheDirectory!;
    this.repositories = new Map();
    this.templates = new Map();

    this.initializeRepositories();
  }

  /**
   * Initialize the template management system
   */
  async initialize(): Promise<void> {
    try {
      await this.ensureDirectories();
      await this.loadLocalTemplates();
      
      if (this.options.enableRemoteSync) {
        await this.syncRepositories();
      }
    } catch (error) {
      throw new TemplateManagementError(
        'Failed to initialize template management system',
        'initialization',
        undefined,
        error as Error
      );
    }
  }

  /**
   * Search for templates with filters
   */
  async searchTemplates(options: TemplateSearchOptions = {}): Promise<ManagedTemplate[]> {
    try {
      let results = Array.from(this.templates.values());

      // Apply filters
      if (options.query) {
        const query = options.query.toLowerCase();
        results = results.filter(template =>
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.metadata.keywords.some(keyword => keyword.toLowerCase().includes(query))
        );
      }

      if (options.category) {
        results = results.filter(template => template.category === options.category);
      }

      if (options.framework) {
        results = results.filter(template => template.framework === options.framework);
      }

      if (options.platform) {
        results = results.filter(template => template.platform === options.platform);
      }

      if (options.source) {
        results = results.filter(template => template.source === options.source);
      }

      if (options.tags && options.tags.length > 0) {
        results = results.filter(template =>
          options.tags!.some(tag => template.metadata.tags.includes(tag))
        );
      }

      // Sort results
      results = this.sortTemplates(results, options.sortBy || TemplateSortBy.NAME);

      // Apply limit
      if (options.limit && options.limit > 0) {
        results = results.slice(0, options.limit);
      }

      return results;
    } catch (error) {
      throw new TemplateManagementError(
        'Failed to search templates',
        'search',
        undefined,
        error as Error
      );
    }
  }

  /**
   * Get template by ID
   */
  async getTemplate(templateId: string): Promise<ManagedTemplate | null> {
    return this.templates.get(templateId) || null;
  }

  /**
   * Install template from various sources
   */
  async installTemplate(
    source: string,
    templateId: string,
    options: TemplateInstallOptions = {}
  ): Promise<ManagedTemplate> {
    try {
      let template: ManagedTemplate;

      // Determine source type and install accordingly
      if (source.startsWith('github:')) {
        template = await this.installFromGitHub(source, templateId, options);
      } else if (source.startsWith('npm:')) {
        template = await this.installFromNpm(source, templateId, options);
      } else if (source.startsWith('git:')) {
        template = await this.installFromGit(source, templateId, options);
      } else if (source.startsWith('http')) {
        template = await this.installFromUrl(source, templateId, options);
      } else {
        template = await this.installFromLocal(source, templateId, options);
      }

      // Validate template if not skipped
      if (!options.skipValidation) {
        await this.validateTemplate(template);
      }

      // Store template
      await this.storeTemplate(template);
      this.templates.set(template.id, template);

      return template;
    } catch (error) {
      throw new TemplateManagementError(
        `Failed to install template ${templateId} from ${source}`,
        'installation',
        templateId,
        error as Error
      );
    }
  }

  /**
   * Uninstall template
   */
  async uninstallTemplate(templateId: string): Promise<boolean> {
    try {
      const template = this.templates.get(templateId);
      if (!template) {
        return false;
      }

      // Remove from storage
      const templatePath = path.join(this.storageDirectory, templateId);
      await fs.rm(templatePath, { recursive: true, force: true });

      // Remove from memory
      this.templates.delete(templateId);

      return true;
    } catch (error) {
      throw new TemplateManagementError(
        `Failed to uninstall template ${templateId}`,
        'uninstallation',
        templateId,
        error as Error
      );
    }
  }

  /**
   * Update template
   */
  async updateTemplate(templateId: string): Promise<ManagedTemplate | null> {
    try {
      const template = this.templates.get(templateId);
      if (!template) {
        return null;
      }

      // Check if update is available
      const latestVersion = await this.getLatestVersion(template);
      if (latestVersion === template.version) {
        return template; // Already up to date
      }

      // Reinstall with latest version
      const sourceUrl = this.reconstructSourceUrl(template);
      return await this.installTemplate(sourceUrl, templateId, { overwrite: true });
    } catch (error) {
      throw new TemplateManagementError(
        `Failed to update template ${templateId}`,
        'update',
        templateId,
        error as Error
      );
    }
  }

  /**
   * Export template
   */
  async exportTemplate(templateId: string, targetPath: string): Promise<void> {
    try {
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      await this.exportTemplateToPath(template, targetPath);
    } catch (error) {
      throw new TemplateManagementError(
        `Failed to export template ${templateId}`,
        'export',
        templateId,
        error as Error
      );
    }
  }

  /**
   * Import template from file system
   */
  async importTemplate(sourcePath: string, templateId?: string): Promise<ManagedTemplate> {
    try {
      const template = await this.loadTemplateFromPath(sourcePath, templateId);
      await this.storeTemplate(template);
      this.templates.set(template.id, template);
      return template;
    } catch (error) {
      throw new TemplateManagementError(
        `Failed to import template from ${sourcePath}`,
        'import',
        templateId,
        error as Error
      );
    }
  }

  /**
   * Get template management statistics
   */
  async getStats(): Promise<TemplateManagementResult> {
    const templates = Array.from(this.templates.values());
    
    const metadata: TemplateMetadata = {
      totalTemplates: templates.length,
      categories: [...new Set(templates.map(t => t.category))],
      frameworks: [...new Set(templates.map(t => t.framework).filter((f): f is string => Boolean(f)))],
      platforms: [...new Set(templates.map(t => t.platform).filter((p): p is string => Boolean(p)))],
      sources: [...new Set(templates.map(t => t.source))],
      lastUpdated: new Date()
    };

    const summary: TemplateSummary = {
      local: templates.filter(t => t.source === TemplateSource.LOCAL).length,
      remote: templates.filter(t => t.source !== TemplateSource.LOCAL).length,
      official: templates.filter(t => t.source === TemplateSource.OFFICIAL).length,
      community: templates.filter(t => t.source === TemplateSource.COMMUNITY).length,
      private: templates.filter(t => t.source === TemplateSource.LOCAL).length
    };

    return {
      templates,
      metadata,
      summary
    };
  }

  /**
   * Add repository
   */
  async addRepository(repository: TemplateRepository): Promise<void> {
    this.repositories.set(repository.id, repository);
    
    if (repository.enabled) {
      await this.syncRepository(repository);
    }
  }

  /**
   * Remove repository
   */
  async removeRepository(repositoryId: string): Promise<boolean> {
    return this.repositories.delete(repositoryId);
  }

  /**
   * Sync all repositories
   */
  async syncRepositories(): Promise<void> {
    const syncPromises = Array.from(this.repositories.values())
      .filter(repo => repo.enabled)
      .map(repo => this.syncRepository(repo));

    await Promise.allSettled(syncPromises);
  }

  private initializeRepositories(): void {
    // Add default official repository
    this.repositories.set('official', {
      id: 'official',
      name: 'Official Templates',
      url: 'https://github.com/task-writer/templates',
      type: RepositoryType.GITHUB,
      enabled: true
    });

    // Add configured repositories
    if (this.options.repositories) {
      for (const repo of this.options.repositories) {
        this.repositories.set(repo.id, repo);
      }
    }
  }

  private async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.storageDirectory, { recursive: true });
    await fs.mkdir(this.cacheDirectory, { recursive: true });
  }

  private async loadLocalTemplates(): Promise<void> {
    try {
      const entries = await fs.readdir(this.storageDirectory, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          try {
            const template = await this.loadTemplateFromPath(
              path.join(this.storageDirectory, entry.name),
              entry.name
            );
            this.templates.set(template.id, template);
          } catch (error) {
            console.warn(`Failed to load template ${entry.name}:`, error);
          }
        }
      }
    } catch (error) {
      // Directory doesn't exist yet, that's fine
    }
  }

  private async loadTemplateFromPath(templatePath: string, templateId?: string): Promise<ManagedTemplate> {
    const manifestPath = path.join(templatePath, 'template.json');
    
    try {
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      const manifest: TemplateManifest = JSON.parse(manifestContent);
      
      // Load template content
      const content = await this.loadTemplateContent(templatePath);
      
      // Generate checksum
      const checksum = await this.generateChecksum(templatePath);
      
      const template: ManagedTemplate = {
        id: templateId || manifest.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: manifest.name,
        description: manifest.description,
        version: manifest.version,
        author: manifest.author,
        category: manifest.category,
        type: TemplateType.FULL_PROJECT, // Default type
        framework: manifest.framework,
        platform: manifest.platform,
        source: TemplateSource.LOCAL,
        content,
        metadata: {
          size: 0, // Will be calculated
          createdAt: new Date(),
          updatedAt: new Date(),
          checksum,
          tags: [],
          keywords: manifest.keywords || []
        },
        dependencies: manifest.dependencies || [],
        variables: manifest.variables || [],
        validation: {
          rules: [],
          warnings: [],
          errors: []
        }
      };

      return template;
    } catch (error) {
      throw new TemplateManagementError(
        `Failed to load template from ${templatePath}`,
        'load',
        templateId,
        error as Error
      );
    }
  }

  private async loadTemplateContent(templatePath: string): Promise<any> {
    // This would load the actual template content structure
    // For now, return a placeholder
    return {
      files: [],
      directories: [],
      scripts: [],
      configurations: []
    };
  }

  private async storeTemplate(template: ManagedTemplate): Promise<void> {
    const templatePath = path.join(this.storageDirectory, template.id);
    await fs.mkdir(templatePath, { recursive: true });

    // Save manifest
    const manifestPath = path.join(templatePath, 'template.json');
    const manifest: TemplateManifest = {
      name: template.name,
      version: template.version,
      description: template.description,
      author: template.author,
      license: 'MIT', // Default license
      keywords: template.metadata.keywords,
      framework: template.framework,
      platform: template.platform,
      category: template.category,
      dependencies: template.dependencies,
      variables: template.variables,
      files: [], // Template files list
      scripts: {} // Template scripts
    };

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  }

  private async validateTemplate(template: ManagedTemplate): Promise<void> {
    const errors: string[] = [];

    // Basic validation
    if (!template.name || template.name.trim().length === 0) {
      errors.push('Template name is required');
    }

    if (!template.version || template.version.trim().length === 0) {
      errors.push('Template version is required');
    }

    if (!template.description || template.description.trim().length === 0) {
      errors.push('Template description is required');
    }

    if (errors.length > 0) {
      throw new TemplateManagementError(
        `Template validation failed: ${errors.join(', ')}`,
        'validation',
        template.id
      );
    }
  }

  private async generateChecksum(templatePath: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    
    // For simplicity, we'll hash the manifest file
    // In a real implementation, we'd hash all template files
    try {
      const manifestPath = path.join(templatePath, 'template.json');
      const content = await fs.readFile(manifestPath);
      hash.update(content);
      return hash.digest('hex');
    } catch (error) {
      return 'unknown';
    }
  }

  private sortTemplates(templates: ManagedTemplate[], sortBy: TemplateSortBy): ManagedTemplate[] {
    return templates.sort((a, b) => {
      switch (sortBy) {
        case TemplateSortBy.NAME:
          return a.name.localeCompare(b.name);
        case TemplateSortBy.CREATED:
          return a.metadata.createdAt.getTime() - b.metadata.createdAt.getTime();
        case TemplateSortBy.UPDATED:
          return b.metadata.updatedAt.getTime() - a.metadata.updatedAt.getTime();
        case TemplateSortBy.CATEGORY:
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }

  private async installFromGitHub(
    source: string,
    templateId: string,
    options: TemplateInstallOptions
  ): Promise<ManagedTemplate> {
    // Parse GitHub URL: github:owner/repo[/path][@branch]
    const githubUrl = source.replace('github:', '');
    const [repoInfo, branch] = githubUrl.split('@');
    const [owner, repo, ...pathParts] = repoInfo.split('/');
    
    const ghRepo: GitHubRepository = {
      owner,
      repo,
      branch: branch || 'main',
      path: pathParts.join('/') || undefined
    };

    // For now, return a mock template
    // In a real implementation, this would clone the GitHub repository
    return this.createMockTemplate(templateId, TemplateSource.GITHUB);
  }

  private async installFromNpm(
    source: string,
    templateId: string,
    options: TemplateInstallOptions
  ): Promise<ManagedTemplate> {
    // Parse npm package: npm:package[@version]
    const npmPackage = source.replace('npm:', '');
    
    // In a real implementation, this would install from npm
    return this.createMockTemplate(templateId, TemplateSource.NPM);
  }

  private async installFromGit(
    source: string,
    templateId: string,
    options: TemplateInstallOptions
  ): Promise<ManagedTemplate> {
    // Parse git URL: git:https://github.com/user/repo.git
    const gitUrl = source.replace('git:', '');
    
    // In a real implementation, this would clone the git repository
    return this.createMockTemplate(templateId, TemplateSource.GIT);
  }

  private async installFromUrl(
    source: string,
    templateId: string,
    options: TemplateInstallOptions
  ): Promise<ManagedTemplate> {
    // Download from URL
    // In a real implementation, this would download and extract the template
    return this.createMockTemplate(templateId, TemplateSource.URL);
  }

  private async installFromLocal(
    source: string,
    templateId: string,
    options: TemplateInstallOptions
  ): Promise<ManagedTemplate> {
    return await this.loadTemplateFromPath(source, templateId);
  }

  private createMockTemplate(templateId: string, source: TemplateSource): ManagedTemplate {
    return {
      id: templateId,
      name: `Template ${templateId}`,
      description: `Mock template from ${source}`,
      version: '1.0.0',
      author: 'System',
      category: TemplateCategory.PROJECT_STARTER,
      type: TemplateType.FULL_PROJECT,
      source,
      content: {
        files: [],
        directories: [],
        scripts: [],
        configurations: []
      },
      metadata: {
        size: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        checksum: 'mock-checksum',
        tags: [],
        keywords: []
      },
      dependencies: [],
      variables: [],
      validation: {
        rules: [],
        warnings: [],
        errors: []
      }
    };
  }

  private async syncRepository(repository: TemplateRepository): Promise<void> {
    // In a real implementation, this would sync templates from the repository
    console.log(`Syncing repository: ${repository.name}`);
  }

  private async getLatestVersion(template: ManagedTemplate): Promise<string> {
    // In a real implementation, this would check for the latest version
    return template.version;
  }

  private reconstructSourceUrl(template: ManagedTemplate): string {
    // In a real implementation, this would reconstruct the original source URL
    return `${template.source}:${template.id}`;
  }

  private async exportTemplateToPath(template: ManagedTemplate, targetPath: string): Promise<void> {
    // In a real implementation, this would export the template
    await fs.mkdir(targetPath, { recursive: true });
    
    const manifestPath = path.join(targetPath, 'template.json');
    const manifest = {
      name: template.name,
      version: template.version,
      description: template.description,
      author: template.author
    };
    
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  }
}