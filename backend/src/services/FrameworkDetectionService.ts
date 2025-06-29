import * as fs from 'fs/promises';
import * as path from 'path';
import {
  FrameworkDetectionResult,
  FrameworkInfo,
  FrameworkType,
  FrameworkCategory,
  ProjectType,
  ProjectArchitecture,
  BuildToolsInfo,
  FrameworkEvidence,
  PackageJsonEvidence,
  ConfigFileEvidence,
  FilePatternEvidence,
  FrameworkDetectionError,
  FrameworkDetectionOptions
} from '../types/framework';
import * as frameworkRules from '../data/frameworks.json';

// Strategy pattern with chain of responsibility
interface FrameworkDetector {
  detect(projectPath: string): Promise<FrameworkDetectionResult>;
  getConfidence(): number;
}

class PackageJsonDetector implements FrameworkDetector {
  private confidence = 0.9;

  getConfidence(): number {
    return this.confidence;
  }

  async detect(projectPath: string): Promise<FrameworkDetectionResult> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    try {
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageJsonContent);
      
      const frameworks = this.analyzePackageJson(packageJson);
      const buildTools = this.analyzeBuildTools(packageJson);
      const evidence = this.createPackageJsonEvidence(packageJson);
      
      return {
        frameworks,
        projectType: this.determineProjectType(frameworks),
        architecture: this.determineArchitecture(frameworks, packageJson),
        buildTools,
        confidence: this.calculateConfidence(frameworks),
        evidence: {
          packageJson: evidence,
          configFiles: { found: [], frameworks: [] },
          filePatterns: { extensions: [], patterns: [], frameworks: [] }
        }
      };
    } catch (error) {
      // If package.json doesn't exist or is invalid, return empty result
      return this.createEmptyResult();
    }
  }

  private analyzePackageJson(packageJson: any): FrameworkInfo[] {
    const frameworks: FrameworkInfo[] = [];
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    for (const [frameworkName, rules] of Object.entries(frameworkRules.packageJsonRules)) {
      const rule = rules as any;
      let matches = 0;
      let totalChecks = 0;
      
      // Check required dependencies
      for (const dep of rule.dependencies || []) {
        totalChecks++;
        if (dependencies[dep]) {
          matches++;
        }
      }
      
      // Check dev dependencies
      for (const dep of rule.devDependencies || []) {
        totalChecks++;
        if (dependencies[dep]) {
          matches++;
        }
      }
      
      if (matches > 0 && totalChecks > 0) {
        const confidence = (matches / totalChecks) * rule.confidence;
        
        frameworks.push({
          name: frameworkName as FrameworkType,
          version: this.extractVersion(dependencies, rule.dependencies || rule.devDependencies || []),
          confidence,
          category: rule.category as FrameworkCategory
        });
      }
    }
    
    return frameworks.sort((a, b) => b.confidence - a.confidence);
  }

  private extractVersion(dependencies: Record<string, string>, possibleDeps: string[]): string {
    for (const dep of possibleDeps) {
      if (dependencies[dep]) {
        return dependencies[dep].replace(/^[\^~]/, ''); // Remove semver prefixes
      }
    }
    return 'unknown';
  }

  private analyzeBuildTools(packageJson: any): BuildToolsInfo {
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const scripts = packageJson.scripts || {};
    
    return {
      bundler: this.detectBundler(dependencies),
      transpiler: this.detectTranspiler(dependencies),
      taskRunner: this.detectTaskRunner(packageJson),
      packageManager: this.detectPackageManager(packageJson)
    };
  }

  private detectBundler(dependencies: Record<string, string>): string | null {
    const bundlers = frameworkRules.buildToolMappings.bundlers;
    
    for (const [bundler, deps] of Object.entries(bundlers)) {
      for (const dep of deps) {
        if (dependencies[dep]) {
          return bundler;
        }
      }
    }
    
    return null;
  }

  private detectTranspiler(dependencies: Record<string, string>): string | null {
    const transpilers = frameworkRules.buildToolMappings.transpilers;
    
    for (const [transpiler, deps] of Object.entries(transpilers)) {
      for (const dep of deps) {
        if (dependencies[dep]) {
          return transpiler;
        }
      }
    }
    
    return null;
  }

  private detectTaskRunner(packageJson: any): string | null {
    // Check for lock files or package manager specific fields
    if (packageJson.workspaces) return 'yarn';
    if (packageJson.engines?.pnpm) return 'pnpm';
    
    return 'npm'; // Default
  }

  private detectPackageManager(packageJson: any): string | null {
    if (packageJson.packageManager) {
      return packageJson.packageManager.split('@')[0];
    }
    
    return null;
  }

  private createPackageJsonEvidence(packageJson: any): PackageJsonEvidence {
    return {
      dependencies: Object.keys(packageJson.dependencies || {}),
      devDependencies: Object.keys(packageJson.devDependencies || {}),
      scripts: Object.keys(packageJson.scripts || {}),
      framework: []
    };
  }

  private determineProjectType(frameworks: FrameworkInfo[]): ProjectType {
    const primaryFrameworks = frameworks.filter(f => f.confidence > 0.7);
    
    if (primaryFrameworks.length === 0) return ProjectType.UNKNOWN;
    
    // Check for specific project types
    const hasFullstackFramework = primaryFrameworks.some(f => 
      [FrameworkType.NEXT_JS, FrameworkType.NUXT, FrameworkType.REMIX, FrameworkType.GATSBY].includes(f.name)
    );
    
    if (hasFullstackFramework) return ProjectType.FULLSTACK;
    
    const hasFrontend = primaryFrameworks.some(f => f.category === FrameworkCategory.FRONTEND);
    const hasBackend = primaryFrameworks.some(f => f.category === FrameworkCategory.BACKEND);
    const hasMobile = primaryFrameworks.some(f => f.category === FrameworkCategory.MOBILE);
    const hasDesktop = primaryFrameworks.some(f => f.category === FrameworkCategory.DESKTOP);
    
    if (hasMobile) return ProjectType.MOBILE;
    if (hasDesktop) return ProjectType.DESKTOP;
    if (hasFrontend && hasBackend) return ProjectType.FULLSTACK;
    if (hasFrontend) return ProjectType.FRONTEND;
    if (hasBackend) return ProjectType.BACKEND;
    
    return ProjectType.LIBRARY;
  }

  private determineArchitecture(frameworks: FrameworkInfo[], packageJson: any): ProjectArchitecture {
    const primaryFramework = frameworks.find(f => f.confidence > 0.8);
    
    if (!primaryFramework) return ProjectArchitecture.UNKNOWN;
    
    switch (primaryFramework.name) {
      case FrameworkType.NEXT_JS:
      case FrameworkType.NUXT:
      case FrameworkType.REMIX:
        return ProjectArchitecture.SSR;
      
      case FrameworkType.GATSBY:
        return ProjectArchitecture.SSG;
      
      case FrameworkType.REACT:
      case FrameworkType.VUE:
      case FrameworkType.ANGULAR:
        return ProjectArchitecture.SPA;
      
      case FrameworkType.EXPRESS:
      case FrameworkType.FASTIFY:
      case FrameworkType.NEST_JS:
        return ProjectArchitecture.API;
      
      default:
        return ProjectArchitecture.UNKNOWN;
    }
  }

  private calculateConfidence(frameworks: FrameworkInfo[]): number {
    if (frameworks.length === 0) return 0;
    
    // Use the highest confidence score, weighted by number of frameworks detected
    const maxConfidence = Math.max(...frameworks.map(f => f.confidence));
    const averageConfidence = frameworks.reduce((sum, f) => sum + f.confidence, 0) / frameworks.length;
    
    return (maxConfidence * 0.7) + (averageConfidence * 0.3);
  }

  private createEmptyResult(): FrameworkDetectionResult {
    return {
      frameworks: [],
      projectType: ProjectType.UNKNOWN,
      architecture: ProjectArchitecture.UNKNOWN,
      buildTools: {
        bundler: null,
        transpiler: null,
        taskRunner: null,
        packageManager: null
      },
      confidence: 0,
      evidence: {
        packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
        configFiles: { found: [], frameworks: [] },
        filePatterns: { extensions: [], patterns: [], frameworks: [] }
      }
    };
  }
}

class ConfigFileDetector implements FrameworkDetector {
  private confidence = 0.8;

  getConfidence(): number {
    return this.confidence;
  }

  async detect(projectPath: string): Promise<FrameworkDetectionResult> {
    try {
      const files = await fs.readdir(projectPath);
      const frameworks: FrameworkInfo[] = [];
      const foundConfigs: string[] = [];
      const frameworksFromConfigs: string[] = [];
      
      for (const file of files) {
        if (file in frameworkRules.configFileRules) {
          const rule = (frameworkRules.configFileRules as any)[file];
          foundConfigs.push(file);
          frameworksFromConfigs.push(rule.framework);
          
          frameworks.push({
            name: rule.framework as FrameworkType,
            version: 'unknown',
            confidence: rule.confidence,
            category: this.getFrameworkCategory(rule.framework)
          });
        }
      }
      
      return {
        frameworks,
        projectType: this.determineProjectType(frameworks),
        architecture: ProjectArchitecture.UNKNOWN,
        buildTools: {
          bundler: null,
          transpiler: null,
          taskRunner: null,
          packageManager: null
        },
        confidence: this.calculateConfidence(frameworks),
        evidence: {
          packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
          configFiles: { found: foundConfigs, frameworks: frameworksFromConfigs },
          filePatterns: { extensions: [], patterns: [], frameworks: [] }
        }
      };
    } catch (error) {
      return this.createEmptyResult();
    }
  }

  private getFrameworkCategory(framework: string): FrameworkCategory {
    // Map framework names to categories
    const categoryMap: Record<string, FrameworkCategory> = {
      'react': FrameworkCategory.FRONTEND,
      'vue': FrameworkCategory.FRONTEND,
      'angular': FrameworkCategory.FRONTEND,
      'svelte': FrameworkCategory.FRONTEND,
      'nextjs': FrameworkCategory.META_FRAMEWORK,
      'nuxt': FrameworkCategory.META_FRAMEWORK,
      'gatsby': FrameworkCategory.META_FRAMEWORK,
      'remix': FrameworkCategory.META_FRAMEWORK,
      'vite': FrameworkCategory.BUILD_TOOL,
      'webpack': FrameworkCategory.BUILD_TOOL,
      'jest': FrameworkCategory.TESTING,
      'vitest': FrameworkCategory.TESTING,
      'cypress': FrameworkCategory.TESTING,
      'playwright': FrameworkCategory.TESTING,
      'expo': FrameworkCategory.MOBILE,
      'tauri': FrameworkCategory.DESKTOP
    };
    
    return categoryMap[framework] || FrameworkCategory.UTILITY;
  }

  private determineProjectType(frameworks: FrameworkInfo[]): ProjectType {
    if (frameworks.length === 0) return ProjectType.UNKNOWN;
    
    const primaryFramework = frameworks[0]; // Highest confidence
    
    switch (primaryFramework.category) {
      case FrameworkCategory.FRONTEND:
        return ProjectType.FRONTEND;
      case FrameworkCategory.META_FRAMEWORK:
        return ProjectType.FULLSTACK;
      case FrameworkCategory.MOBILE:
        return ProjectType.MOBILE;
      case FrameworkCategory.DESKTOP:
        return ProjectType.DESKTOP;
      default:
        return ProjectType.UNKNOWN;
    }
  }

  private calculateConfidence(frameworks: FrameworkInfo[]): number {
    if (frameworks.length === 0) return 0;
    return frameworks[0].confidence; // Use highest confidence
  }

  private createEmptyResult(): FrameworkDetectionResult {
    return {
      frameworks: [],
      projectType: ProjectType.UNKNOWN,
      architecture: ProjectArchitecture.UNKNOWN,
      buildTools: {
        bundler: null,
        transpiler: null,
        taskRunner: null,
        packageManager: null
      },
      confidence: 0,
      evidence: {
        packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
        configFiles: { found: [], frameworks: [] },
        filePatterns: { extensions: [], patterns: [], frameworks: [] }
      }
    };
  }
}

class FilePatternDetector implements FrameworkDetector {
  private confidence = 0.6;

  getConfidence(): number {
    return this.confidence;
  }

  async detect(projectPath: string): Promise<FrameworkDetectionResult> {
    try {
      const frameworks: FrameworkInfo[] = [];
      const extensions: string[] = [];
      const patterns: string[] = [];
      const frameworksFromPatterns: string[] = [];
      
      await this.scanDirectory(projectPath, frameworks, extensions, patterns, frameworksFromPatterns);
      
      return {
        frameworks,
        projectType: this.determineProjectType(frameworks),
        architecture: ProjectArchitecture.UNKNOWN,
        buildTools: {
          bundler: null,
          transpiler: null,
          taskRunner: null,
          packageManager: null
        },
        confidence: this.calculateConfidence(frameworks),
        evidence: {
          packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
          configFiles: { found: [], frameworks: [] },
          filePatterns: { extensions, patterns, frameworks: frameworksFromPatterns }
        }
      };
    } catch (error) {
      return this.createEmptyResult();
    }
  }

  private async scanDirectory(
    dirPath: string, 
    frameworks: FrameworkInfo[], 
    extensions: string[], 
    patterns: string[], 
    frameworksFromPatterns: string[],
    depth = 0
  ): Promise<void> {
    if (depth > 2) return; // Limit scan depth
    
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (ext && !extensions.includes(ext)) {
            extensions.push(ext);
          }
          
          // Check file patterns
          this.checkFilePatterns(entry.name, frameworks, patterns, frameworksFromPatterns);
        } else if (entry.isDirectory() && depth < 2) {
          await this.scanDirectory(fullPath, frameworks, extensions, patterns, frameworksFromPatterns, depth + 1);
        }
      }
    } catch (error) {
      // Ignore directory scan errors
    }
  }

  private checkFilePatterns(
    fileName: string, 
    frameworks: FrameworkInfo[], 
    patterns: string[], 
    frameworksFromPatterns: string[]
  ): void {
    for (const [pattern, rule] of Object.entries(frameworkRules.filePatternRules)) {
      if (this.matchPattern(fileName, pattern)) {
        patterns.push(pattern);
        frameworksFromPatterns.push(rule.framework);
        
        const existingFramework = frameworks.find(f => f.name === rule.framework);
        if (existingFramework) {
          existingFramework.confidence = Math.max(existingFramework.confidence, rule.confidence);
        } else {
          frameworks.push({
            name: rule.framework as FrameworkType,
            version: 'unknown',
            confidence: rule.confidence,
            category: this.getFrameworkCategory(rule.framework)
          });
        }
      }
    }
  }

  private matchPattern(fileName: string, pattern: string): boolean {
    // Simple pattern matching - could be enhanced with proper glob matching
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(fileName);
    }
    
    return fileName === pattern;
  }

  private getFrameworkCategory(framework: string): FrameworkCategory {
    const categoryMap: Record<string, FrameworkCategory> = {
      'react': FrameworkCategory.FRONTEND,
      'vue': FrameworkCategory.FRONTEND,
      'angular': FrameworkCategory.FRONTEND,
      'svelte': FrameworkCategory.FRONTEND,
      'nextjs': FrameworkCategory.META_FRAMEWORK
    };
    
    return categoryMap[framework] || FrameworkCategory.UTILITY;
  }

  private determineProjectType(frameworks: FrameworkInfo[]): ProjectType {
    if (frameworks.length === 0) return ProjectType.UNKNOWN;
    
    const primaryFramework = frameworks[0];
    
    switch (primaryFramework.category) {
      case FrameworkCategory.FRONTEND:
        return ProjectType.FRONTEND;
      case FrameworkCategory.META_FRAMEWORK:
        return ProjectType.FULLSTACK;
      default:
        return ProjectType.UNKNOWN;
    }
  }

  private calculateConfidence(frameworks: FrameworkInfo[]): number {
    if (frameworks.length === 0) return 0;
    return Math.max(...frameworks.map(f => f.confidence));
  }

  private createEmptyResult(): FrameworkDetectionResult {
    return {
      frameworks: [],
      projectType: ProjectType.UNKNOWN,
      architecture: ProjectArchitecture.UNKNOWN,
      buildTools: {
        bundler: null,
        transpiler: null,
        taskRunner: null,
        packageManager: null
      },
      confidence: 0,
      evidence: {
        packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
        configFiles: { found: [], frameworks: [] },
        filePatterns: { extensions: [], patterns: [], frameworks: [] }
      }
    };
  }
}

class PythonDetector implements FrameworkDetector {
  private confidence = 0.9;

  getConfidence(): number {
    return this.confidence;
  }

  async detect(projectPath: string): Promise<FrameworkDetectionResult> {
    try {
      const frameworks: FrameworkInfo[] = [];
      const foundConfigs: string[] = [];
      
      // Check for Python requirement files
      const files = await fs.readdir(projectPath);
      
      for (const file of files) {
        if (['requirements.txt', 'pyproject.toml', 'setup.py', 'Pipfile'].includes(file)) {
          foundConfigs.push(file);
          
          if (file === 'requirements.txt') {
            const content = await fs.readFile(path.join(projectPath, file), 'utf8');
            frameworks.push(...this.analyzeRequirementsTxt(content));
          } else if (file === 'pyproject.toml') {
            const content = await fs.readFile(path.join(projectPath, file), 'utf8');
            frameworks.push(...this.analyzePyprojectToml(content));
          }
        }
      }

      // Check for Python source files
      await this.scanForPythonFiles(projectPath, frameworks);

      return {
        frameworks: frameworks.sort((a, b) => b.confidence - a.confidence),
        projectType: this.determineProjectType(frameworks),
        architecture: ProjectArchitecture.API,
        buildTools: {
          bundler: null,
          transpiler: null,
          taskRunner: 'pip',
          packageManager: 'pip'
        },
        confidence: this.calculateConfidence(frameworks),
        evidence: {
          packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
          configFiles: { found: foundConfigs, frameworks: frameworks.map(f => f.name) },
          filePatterns: { extensions: ['.py'], patterns: [], frameworks: [] }
        }
      };
    } catch (error) {
      return this.createEmptyResult();
    }
  }

  private analyzeRequirementsTxt(content: string): FrameworkInfo[] {
    const frameworks: FrameworkInfo[] = [];
    const rules = frameworkRules.pythonRequirementsRules;

    for (const [frameworkName, rule] of Object.entries(rules)) {
      for (const dep of rule.dependencies) {
        if (content.toLowerCase().includes(dep.toLowerCase())) {
          frameworks.push({
            name: frameworkName as FrameworkType,
            version: this.extractVersionFromRequirements(content, dep),
            confidence: rule.confidence,
            category: rule.category as FrameworkCategory
          });
          break;
        }
      }
    }

    return frameworks;
  }

  private analyzePyprojectToml(content: string): FrameworkInfo[] {
    const frameworks: FrameworkInfo[] = [];
    const rules = frameworkRules.pythonRequirementsRules;

    for (const [frameworkName, rule] of Object.entries(rules)) {
      for (const dep of rule.dependencies) {
        if (content.toLowerCase().includes(dep.toLowerCase())) {
          frameworks.push({
            name: frameworkName as FrameworkType,
            version: 'unknown',
            confidence: rule.confidence,
            category: rule.category as FrameworkCategory
          });
          break;
        }
      }
    }

    return frameworks;
  }

  private async scanForPythonFiles(projectPath: string, frameworks: FrameworkInfo[]): Promise<void> {
    try {
      const files = await fs.readdir(projectPath);
      
      for (const file of files) {
        if (file === 'manage.py') {
          frameworks.push({
            name: FrameworkType.DJANGO,
            version: 'unknown',
            confidence: 0.9,
            category: FrameworkCategory.BACKEND
          });
        } else if (file.endsWith('.ipynb')) {
          frameworks.push({
            name: FrameworkType.JUPYTER,
            version: 'unknown',
            confidence: 0.8,
            category: FrameworkCategory.UTILITY
          });
        }
      }
    } catch (error) {
      // Ignore scan errors
    }
  }

  private extractVersionFromRequirements(content: string, pattern: string): string {
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes(pattern.toLowerCase())) {
        const match = line.match(/==([0-9.]+)/);
        if (match) return match[1];
      }
    }
    return 'unknown';
  }

  private determineProjectType(frameworks: FrameworkInfo[]): ProjectType {
    if (frameworks.some(f => f.name === FrameworkType.JUPYTER)) return ProjectType.DATA_SCIENCE;
    if (frameworks.some(f => f.category === FrameworkCategory.BACKEND || f.category === FrameworkCategory.WEB_FRAMEWORK)) return ProjectType.BACKEND;
    return ProjectType.UNKNOWN;
  }

  private calculateConfidence(frameworks: FrameworkInfo[]): number {
    if (frameworks.length === 0) return 0;
    return Math.max(...frameworks.map(f => f.confidence));
  }

  private createEmptyResult(): FrameworkDetectionResult {
    return {
      frameworks: [],
      projectType: ProjectType.UNKNOWN,
      architecture: ProjectArchitecture.UNKNOWN,
      buildTools: { bundler: null, transpiler: null, taskRunner: null, packageManager: null },
      confidence: 0,
      evidence: {
        packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
        configFiles: { found: [], frameworks: [] },
        filePatterns: { extensions: [], patterns: [], frameworks: [] }
      }
    };
  }
}

class RustDetector implements FrameworkDetector {
  private confidence = 0.9;

  getConfidence(): number {
    return this.confidence;
  }

  async detect(projectPath: string): Promise<FrameworkDetectionResult> {
    try {
      const frameworks: FrameworkInfo[] = [];
      const foundConfigs: string[] = [];

      // Check for Cargo.toml
      const files = await fs.readdir(projectPath);
      
      if (files.includes('Cargo.toml')) {
        foundConfigs.push('Cargo.toml');
        const content = await fs.readFile(path.join(projectPath, 'Cargo.toml'), 'utf8');
        frameworks.push(...this.analyzeCargoToml(content));
      }

      // Check for tauri.conf.json
      if (files.includes('tauri.conf.json')) {
        foundConfigs.push('tauri.conf.json');
        frameworks.push({
          name: FrameworkType.TAURI,
          version: 'unknown',
          confidence: 0.9,
          category: FrameworkCategory.DESKTOP
        });
      }

      return {
        frameworks: frameworks.sort((a, b) => b.confidence - a.confidence),
        projectType: this.determineProjectType(frameworks),
        architecture: this.determineArchitecture(frameworks),
        buildTools: {
          bundler: null,
          transpiler: null,
          taskRunner: 'cargo',
          packageManager: 'cargo'
        },
        confidence: this.calculateConfidence(frameworks),
        evidence: {
          packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
          configFiles: { found: foundConfigs, frameworks: frameworks.map(f => f.name) },
          filePatterns: { extensions: ['.rs'], patterns: [], frameworks: [] }
        }
      };
    } catch (error) {
      return this.createEmptyResult();
    }
  }

  private analyzeCargoToml(content: string): FrameworkInfo[] {
    const frameworks: FrameworkInfo[] = [];
    const rules = frameworkRules.rustCargoRules;

    for (const [frameworkName, rule] of Object.entries(rules)) {
      for (const dep of rule.dependencies) {
        if (content.includes(dep)) {
          frameworks.push({
            name: frameworkName as FrameworkType,
            version: 'unknown',
            confidence: rule.confidence,
            category: rule.category as FrameworkCategory
          });
          break;
        }
      }
    }

    return frameworks;
  }

  private determineProjectType(frameworks: FrameworkInfo[]): ProjectType {
    if (frameworks.some(f => f.name === FrameworkType.TAURI)) return ProjectType.DESKTOP;
    if (frameworks.some(f => f.name === FrameworkType.BEVY)) return ProjectType.GAME_ENGINE;
    if (frameworks.some(f => f.category === FrameworkCategory.BACKEND)) return ProjectType.BACKEND;
    return ProjectType.UNKNOWN;
  }

  private determineArchitecture(frameworks: FrameworkInfo[]): ProjectArchitecture {
    if (frameworks.some(f => f.category === FrameworkCategory.BACKEND)) return ProjectArchitecture.API;
    return ProjectArchitecture.UNKNOWN;
  }

  private calculateConfidence(frameworks: FrameworkInfo[]): number {
    if (frameworks.length === 0) return 0;
    return Math.max(...frameworks.map(f => f.confidence));
  }

  private createEmptyResult(): FrameworkDetectionResult {
    return {
      frameworks: [],
      projectType: ProjectType.UNKNOWN,
      architecture: ProjectArchitecture.UNKNOWN,
      buildTools: { bundler: null, transpiler: null, taskRunner: null, packageManager: null },
      confidence: 0,
      evidence: {
        packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
        configFiles: { found: [], frameworks: [] },
        filePatterns: { extensions: [], patterns: [], frameworks: [] }
      }
    };
  }
}

class DotNetDetector implements FrameworkDetector {
  private confidence = 0.9;

  getConfidence(): number {
    return this.confidence;
  }

  async detect(projectPath: string): Promise<FrameworkDetectionResult> {
    try {
      const frameworks: FrameworkInfo[] = [];
      const foundConfigs: string[] = [];

      const files = await fs.readdir(projectPath);
      
      // Check for .csproj files
      for (const file of files) {
        if (file.endsWith('.csproj')) {
          foundConfigs.push(file);
          const content = await fs.readFile(path.join(projectPath, file), 'utf8');
          frameworks.push(...this.analyzeCsproj(content));
        }
      }

      return {
        frameworks: frameworks.sort((a, b) => b.confidence - a.confidence),
        projectType: this.determineProjectType(frameworks),
        architecture: this.determineArchitecture(frameworks),
        buildTools: {
          bundler: null,
          transpiler: null,
          taskRunner: 'dotnet',
          packageManager: 'nuget'
        },
        confidence: this.calculateConfidence(frameworks),
        evidence: {
          packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
          configFiles: { found: foundConfigs, frameworks: frameworks.map(f => f.name) },
          filePatterns: { extensions: ['.cs', '.razor'], patterns: [], frameworks: [] }
        }
      };
    } catch (error) {
      return this.createEmptyResult();
    }
  }

  private analyzeCsproj(content: string): FrameworkInfo[] {
    const frameworks: FrameworkInfo[] = [];
    const rules = frameworkRules.dotnetProjectRules;

    for (const [frameworkName, rule] of Object.entries(rules)) {
      for (const packageRef of rule.packageReferences) {
        if (content.includes(packageRef)) {
          frameworks.push({
            name: frameworkName as FrameworkType,
            version: 'unknown',
            confidence: rule.confidence,
            category: rule.category as FrameworkCategory
          });
          break;
        }
      }
    }

    return frameworks;
  }

  private determineProjectType(frameworks: FrameworkInfo[]): ProjectType {
    if (frameworks.some(f => f.name === FrameworkType.MAUI)) return ProjectType.MOBILE;
    if (frameworks.some(f => f.category === FrameworkCategory.BACKEND)) return ProjectType.BACKEND;
    return ProjectType.UNKNOWN;
  }

  private determineArchitecture(frameworks: FrameworkInfo[]): ProjectArchitecture {
    if (frameworks.some(f => f.category === FrameworkCategory.BACKEND)) return ProjectArchitecture.API;
    return ProjectArchitecture.UNKNOWN;
  }

  private calculateConfidence(frameworks: FrameworkInfo[]): number {
    if (frameworks.length === 0) return 0;
    return Math.max(...frameworks.map(f => f.confidence));
  }

  private createEmptyResult(): FrameworkDetectionResult {
    return {
      frameworks: [],
      projectType: ProjectType.UNKNOWN,
      architecture: ProjectArchitecture.UNKNOWN,
      buildTools: { bundler: null, transpiler: null, taskRunner: null, packageManager: null },
      confidence: 0,
      evidence: {
        packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
        configFiles: { found: [], frameworks: [] },
        filePatterns: { extensions: [], patterns: [], frameworks: [] }
      }
    };
  }
}

class GoDetector implements FrameworkDetector {
  private confidence = 0.9;

  getConfidence(): number {
    return this.confidence;
  }

  async detect(projectPath: string): Promise<FrameworkDetectionResult> {
    try {
      const frameworks: FrameworkInfo[] = [];
      const foundConfigs: string[] = [];

      const files = await fs.readdir(projectPath);
      
      if (files.includes('go.mod')) {
        foundConfigs.push('go.mod');
        const content = await fs.readFile(path.join(projectPath, 'go.mod'), 'utf8');
        frameworks.push(...this.analyzeGoMod(content));
      }

      return {
        frameworks: frameworks.sort((a, b) => b.confidence - a.confidence),
        projectType: this.determineProjectType(frameworks),
        architecture: this.determineArchitecture(frameworks),
        buildTools: {
          bundler: null,
          transpiler: null,
          taskRunner: 'go',
          packageManager: 'go'
        },
        confidence: this.calculateConfidence(frameworks),
        evidence: {
          packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
          configFiles: { found: foundConfigs, frameworks: frameworks.map(f => f.name) },
          filePatterns: { extensions: ['.go'], patterns: [], frameworks: [] }
        }
      };
    } catch (error) {
      return this.createEmptyResult();
    }
  }

  private analyzeGoMod(content: string): FrameworkInfo[] {
    const frameworks: FrameworkInfo[] = [];
    const rules = frameworkRules.goModuleRules;

    for (const [frameworkName, rule] of Object.entries(rules)) {
      for (const dep of rule.dependencies) {
        if (content.includes(dep)) {
          frameworks.push({
            name: frameworkName as FrameworkType,
            version: 'unknown',
            confidence: rule.confidence,
            category: rule.category as FrameworkCategory
          });
          break;
        }
      }
    }

    return frameworks;
  }

  private determineProjectType(frameworks: FrameworkInfo[]): ProjectType {
    if (frameworks.some(f => f.name === FrameworkType.COBRA)) return ProjectType.CLI;
    if (frameworks.some(f => f.category === FrameworkCategory.BACKEND)) return ProjectType.BACKEND;
    return ProjectType.UNKNOWN;
  }

  private determineArchitecture(frameworks: FrameworkInfo[]): ProjectArchitecture {
    if (frameworks.some(f => f.category === FrameworkCategory.BACKEND)) return ProjectArchitecture.API;
    return ProjectArchitecture.UNKNOWN;
  }

  private calculateConfidence(frameworks: FrameworkInfo[]): number {
    if (frameworks.length === 0) return 0;
    return Math.max(...frameworks.map(f => f.confidence));
  }

  private createEmptyResult(): FrameworkDetectionResult {
    return {
      frameworks: [],
      projectType: ProjectType.UNKNOWN,
      architecture: ProjectArchitecture.UNKNOWN,
      buildTools: { bundler: null, transpiler: null, taskRunner: null, packageManager: null },
      confidence: 0,
      evidence: {
        packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
        configFiles: { found: [], frameworks: [] },
        filePatterns: { extensions: [], patterns: [], frameworks: [] }
      }
    };
  }
}

class JavaDetector implements FrameworkDetector {
  private confidence = 0.9;

  getConfidence(): number {
    return this.confidence;
  }

  async detect(projectPath: string): Promise<FrameworkDetectionResult> {
    try {
      const frameworks: FrameworkInfo[] = [];
      const foundConfigs: string[] = [];

      const files = await fs.readdir(projectPath);
      
      if (files.includes('pom.xml')) {
        foundConfigs.push('pom.xml');
        const content = await fs.readFile(path.join(projectPath, 'pom.xml'), 'utf8');
        frameworks.push(...this.analyzePomXml(content));
      }

      if (files.includes('build.gradle')) {
        foundConfigs.push('build.gradle');
        const content = await fs.readFile(path.join(projectPath, 'build.gradle'), 'utf8');
        frameworks.push(...this.analyzeBuildGradle(content));
      }

      // Check for Android manifest
      await this.checkForAndroid(projectPath, frameworks, foundConfigs);

      return {
        frameworks: frameworks.sort((a, b) => b.confidence - a.confidence),
        projectType: this.determineProjectType(frameworks),
        architecture: this.determineArchitecture(frameworks),
        buildTools: {
          bundler: null,
          transpiler: null,
          taskRunner: files.includes('pom.xml') ? 'maven' : files.includes('build.gradle') ? 'gradle' : null,
          packageManager: files.includes('pom.xml') ? 'maven' : files.includes('build.gradle') ? 'gradle' : null
        },
        confidence: this.calculateConfidence(frameworks),
        evidence: {
          packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
          configFiles: { found: foundConfigs, frameworks: frameworks.map(f => f.name) },
          filePatterns: { extensions: ['.java', '.kt'], patterns: [], frameworks: [] }
        }
      };
    } catch (error) {
      return this.createEmptyResult();
    }
  }

  private analyzePomXml(content: string): FrameworkInfo[] {
    const frameworks: FrameworkInfo[] = [];
    const rules = frameworkRules.javaBuildRules;

    for (const [frameworkName, rule] of Object.entries(rules)) {
      for (const dep of rule.dependencies) {
        if (content.includes(dep)) {
          frameworks.push({
            name: frameworkName as FrameworkType,
            version: 'unknown',
            confidence: rule.confidence,
            category: rule.category as FrameworkCategory
          });
          break;
        }
      }
    }

    return frameworks;
  }

  private analyzeBuildGradle(content: string): FrameworkInfo[] {
    const frameworks: FrameworkInfo[] = [];
    const rules = frameworkRules.javaBuildRules;

    for (const [frameworkName, rule] of Object.entries(rules)) {
      for (const dep of rule.dependencies) {
        if (content.includes(dep)) {
          frameworks.push({
            name: frameworkName as FrameworkType,
            version: 'unknown',
            confidence: rule.confidence,
            category: rule.category as FrameworkCategory
          });
          break;
        }
      }
    }

    // Add gradle framework
    frameworks.push({
      name: FrameworkType.GRADLE,
      version: 'unknown',
      confidence: 0.9,
      category: FrameworkCategory.BUILD_TOOL
    });

    return frameworks;
  }

  private async checkForAndroid(projectPath: string, frameworks: FrameworkInfo[], foundConfigs: string[]): Promise<void> {
    try {
      const appDir = path.join(projectPath, 'app');
      const srcDir = path.join(appDir, 'src', 'main');
      
      if (await this.pathExists(srcDir)) {
        const files = await fs.readdir(srcDir);
        if (files.includes('AndroidManifest.xml')) {
          foundConfigs.push('AndroidManifest.xml');
          frameworks.push({
            name: FrameworkType.ANDROID,
            version: 'unknown',
            confidence: 0.9,
            category: FrameworkCategory.MOBILE
          });
        }
      }
    } catch (error) {
      // Ignore errors
    }
  }

  private async pathExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private determineProjectType(frameworks: FrameworkInfo[]): ProjectType {
    if (frameworks.some(f => f.name === FrameworkType.ANDROID)) return ProjectType.MOBILE;
    if (frameworks.some(f => f.category === FrameworkCategory.BACKEND)) return ProjectType.BACKEND;
    return ProjectType.UNKNOWN;
  }

  private determineArchitecture(frameworks: FrameworkInfo[]): ProjectArchitecture {
    if (frameworks.some(f => f.category === FrameworkCategory.BACKEND)) return ProjectArchitecture.API;
    return ProjectArchitecture.UNKNOWN;
  }

  private calculateConfidence(frameworks: FrameworkInfo[]): number {
    if (frameworks.length === 0) return 0;
    return Math.max(...frameworks.map(f => f.confidence));
  }

  private createEmptyResult(): FrameworkDetectionResult {
    return {
      frameworks: [],
      projectType: ProjectType.UNKNOWN,
      architecture: ProjectArchitecture.UNKNOWN,
      buildTools: { bundler: null, transpiler: null, taskRunner: null, packageManager: null },
      confidence: 0,
      evidence: {
        packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
        configFiles: { found: [], frameworks: [] },
        filePatterns: { extensions: [], patterns: [], frameworks: [] }
      }
    };
  }
}

export class FrameworkDetectionService {
  private detectors: FrameworkDetector[] = [
    new PackageJsonDetector(),
    new ConfigFileDetector(),
    new FilePatternDetector(),
    new PythonDetector(),
    new RustDetector(),
    new DotNetDetector(),
    new GoDetector(),
    new JavaDetector()
  ];

  async detectFrameworks(
    projectPath: string, 
    options: FrameworkDetectionOptions = {}
  ): Promise<FrameworkDetectionResult> {
    try {
      // Validate project path
      await fs.access(projectPath);
      
      // Run all detectors
      const results = await Promise.all(
        this.detectors.map(detector => detector.detect(projectPath))
      );
      
      // Consolidate results
      const consolidatedResult = this.consolidateResults(results);
      
      // Filter by minimum confidence if specified
      if (options.minConfidence) {
        consolidatedResult.frameworks = consolidatedResult.frameworks.filter(
          f => f.confidence >= options.minConfidence!
        );
      }
      
      return consolidatedResult;
    } catch (error) {
      throw new FrameworkDetectionError(
        `Failed to detect frameworks in ${projectPath}: ${(error as Error).message}`,
        projectPath,
        error as Error
      );
    }
  }

  private consolidateResults(results: FrameworkDetectionResult[]): FrameworkDetectionResult {
    const frameworkMap = new Map<string, FrameworkInfo>();
    const allEvidence: FrameworkEvidence = {
      packageJson: { dependencies: [], devDependencies: [], scripts: [], framework: [] },
      configFiles: { found: [], frameworks: [] },
      filePatterns: { extensions: [], patterns: [], frameworks: [] }
    };
    
    // Merge frameworks from all detectors
    for (const result of results) {
      for (const framework of result.frameworks) {
        const key = framework.name;
        const existing = frameworkMap.get(key);
        
        if (existing) {
          // Combine confidence scores (weighted average)
          existing.confidence = Math.max(existing.confidence, framework.confidence);
          if (framework.version !== 'unknown' && existing.version === 'unknown') {
            existing.version = framework.version;
          }
        } else {
          frameworkMap.set(key, { ...framework });
        }
      }
      
      // Merge evidence
      allEvidence.packageJson.dependencies.push(...result.evidence.packageJson.dependencies);
      allEvidence.packageJson.devDependencies.push(...result.evidence.packageJson.devDependencies);
      allEvidence.packageJson.scripts.push(...result.evidence.packageJson.scripts);
      allEvidence.configFiles.found.push(...result.evidence.configFiles.found);
      allEvidence.configFiles.frameworks.push(...result.evidence.configFiles.frameworks);
      allEvidence.filePatterns.extensions.push(...result.evidence.filePatterns.extensions);
      allEvidence.filePatterns.patterns.push(...result.evidence.filePatterns.patterns);
      allEvidence.filePatterns.frameworks.push(...result.evidence.filePatterns.frameworks);
    }
    
    // Remove duplicates from evidence
    allEvidence.packageJson.dependencies = [...new Set(allEvidence.packageJson.dependencies)];
    allEvidence.packageJson.devDependencies = [...new Set(allEvidence.packageJson.devDependencies)];
    allEvidence.packageJson.scripts = [...new Set(allEvidence.packageJson.scripts)];
    allEvidence.configFiles.found = [...new Set(allEvidence.configFiles.found)];
    allEvidence.configFiles.frameworks = [...new Set(allEvidence.configFiles.frameworks)];
    allEvidence.filePatterns.extensions = [...new Set(allEvidence.filePatterns.extensions)];
    allEvidence.filePatterns.patterns = [...new Set(allEvidence.filePatterns.patterns)];
    allEvidence.filePatterns.frameworks = [...new Set(allEvidence.filePatterns.frameworks)];
    
    const frameworks = Array.from(frameworkMap.values()).sort((a, b) => b.confidence - a.confidence);
    
    // Determine project type based on all detected frameworks
    const projectType = this.determineConsolidatedProjectType(frameworks);
    
    // Use the result from the most confident detector for architecture and build tools
    const bestResult = results.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
    
    return {
      frameworks,
      projectType,
      architecture: bestResult.architecture,
      buildTools: bestResult.buildTools,
      confidence: this.calculateOverallConfidence(frameworks),
      evidence: allEvidence
    };
  }

  private calculateOverallConfidence(frameworks: FrameworkInfo[]): number {
    if (frameworks.length === 0) return 0;
    
    // Use weighted average with higher weight for higher confidence frameworks
    const totalWeight = frameworks.reduce((sum, f) => sum + f.confidence, 0);
    const weightedSum = frameworks.reduce((sum, f) => sum + f.confidence * f.confidence, 0);
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private determineConsolidatedProjectType(frameworks: FrameworkInfo[]): ProjectType {
    if (frameworks.length === 0) return ProjectType.UNKNOWN;

    // Check for specific project types
    if (frameworks.some(f => f.name === FrameworkType.JUPYTER)) return ProjectType.DATA_SCIENCE;
    if (frameworks.some(f => f.name === FrameworkType.ANDROID)) return ProjectType.MOBILE;
    if (frameworks.some(f => f.name === FrameworkType.TAURI)) return ProjectType.DESKTOP;
    if (frameworks.some(f => f.name === FrameworkType.BEVY)) return ProjectType.GAME_ENGINE;
    if (frameworks.some(f => f.name === FrameworkType.COBRA)) return ProjectType.CLI;

    // Check for fullstack frameworks
    const hasFullstackFramework = frameworks.some(f => 
      [FrameworkType.NEXT_JS, FrameworkType.NUXT, FrameworkType.REMIX, FrameworkType.GATSBY].includes(f.name)
    );
    if (hasFullstackFramework) return ProjectType.FULLSTACK;

    // Check categories
    const hasFrontend = frameworks.some(f => f.category === FrameworkCategory.FRONTEND);
    const hasBackend = frameworks.some(f => 
      f.category === FrameworkCategory.BACKEND || 
      f.category === FrameworkCategory.WEB_FRAMEWORK
    );
    const hasMobile = frameworks.some(f => f.category === FrameworkCategory.MOBILE);
    const hasDesktop = frameworks.some(f => f.category === FrameworkCategory.DESKTOP);

    if (hasMobile) return ProjectType.MOBILE;
    if (hasDesktop) return ProjectType.DESKTOP;
    if (hasFrontend && hasBackend) return ProjectType.FULLSTACK;
    if (hasFrontend) return ProjectType.FRONTEND;
    if (hasBackend) return ProjectType.BACKEND;

    return ProjectType.LIBRARY;
  }

  // Utility method to get primary framework
  getPrimaryFramework(result: FrameworkDetectionResult): FrameworkInfo | null {
    return result.frameworks.find(f => f.confidence > 0.7) || result.frameworks[0] || null;
  }

  // Utility method to check if specific framework is detected
  hasFramework(result: FrameworkDetectionResult, frameworkType: FrameworkType): boolean {
    return result.frameworks.some(f => f.name === frameworkType);
  }

  // Utility method to get frameworks by category
  getFrameworksByCategory(result: FrameworkDetectionResult, category: FrameworkCategory): FrameworkInfo[] {
    return result.frameworks.filter(f => f.category === category);
  }
}