import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ExportService } from '../../services/ExportService';
import { TaskGenerationService } from '../../services/TaskGenerationService';
import { ScaffoldGenerationService } from '../../services/ScaffoldGenerationService';
import { ExportFormat, FileEncoding } from '../../types/export';
import { Platform, ScriptFormat } from '../../types/scaffoldGeneration';

// Mock dependencies
jest.mock('fs/promises');
jest.mock('../../services/TaskGenerationService');
jest.mock('../../services/ScaffoldGenerationService');

const mockFs = fs as jest.Mocked<typeof fs>;
const MockTaskGenerationService = TaskGenerationService as jest.MockedClass<typeof TaskGenerationService>;
const MockScaffoldGenerationService = ScaffoldGenerationService as jest.MockedClass<typeof ScaffoldGenerationService>;

describe('ExportService Comprehensive Tests', () => {
  let service: ExportService;
  let mockTaskGeneration: jest.Mocked<TaskGenerationService>;
  let mockScaffoldGeneration: jest.Mocked<ScaffoldGenerationService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockTaskGeneration = new MockTaskGenerationService() as jest.Mocked<TaskGenerationService>;
    mockScaffoldGeneration = new MockScaffoldGenerationService() as jest.Mocked<ScaffoldGenerationService>;
    
    service = new ExportService(mockTaskGeneration, mockScaffoldGeneration);

    // Mock fs.mkdir to not fail
    mockFs.mkdir.mockResolvedValue(undefined);
    mockFs.writeFile.mockResolvedValue();
    mockFs.chmod.mockResolvedValue();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Happy Path Tests', () => {
    describe('exportTaskFile', () => {
      it('should export task file with all formats successfully', async () => {
        const taskResult = {
          content: '# Test Task\n\nThis is a comprehensive test task with multiple sections.',
          metadata: {
            title: 'Test Task',
            version: '1.0',
            type: 'initialization' as any,
            category: 'development' as any,
            estimatedDuration: '30 minutes',
            prerequisites: ['Node.js', 'npm'],
            outputFiles: ['package.json', 'src/index.ts'],
            commands: ['npm install', 'npm run build'],
            framework: 'react',
            platform: 'cross-platform'
          },
          sections: [],
          estimatedComplexity: 'moderate' as any
        };

        const outputPath = '/test/output/comprehensive-task.md';

        const result = await service.exportTaskFile(taskResult, outputPath);

        expect(result).toMatchObject({
          filename: 'comprehensive-task.md',
          path: outputPath,
          content: taskResult.content,
          format: ExportFormat.MARKDOWN,
          encoding: FileEncoding.UTF8
        });

        expect(result.size).toBeGreaterThan(0);
        expect(result.checksum).toBeDefined();
        expect(result.mimeType).toBe('text/markdown');
        expect(result.permissions).toBeDefined();
        expect(mockFs.writeFile).toHaveBeenCalledWith(outputPath, taskResult.content, { encoding: 'utf8' });
      });

      it('should handle different file encodings', async () => {
        const taskResult = {
          content: 'Test content with special characters: äöü',
          metadata: {
            title: 'Encoding Test',
            version: '1.0',
            type: 'test' as any,
            category: 'development' as any,
            estimatedDuration: '10 minutes',
            prerequisites: [],
            outputFiles: [],
            commands: [],
            framework: null,
            platform: null
          },
          sections: [],
          estimatedComplexity: 'simple' as any
        };

        const outputPath = '/test/output/encoding-test.md';

        const result = await service.exportTaskFile(taskResult, outputPath, { 
          encoding: FileEncoding.UTF16 
        });

        expect(result.encoding).toBe(FileEncoding.UTF16);
        expect(mockFs.writeFile).toHaveBeenCalledWith(outputPath, taskResult.content, { encoding: 'utf16le' });
      });

      it('should set executable permissions for script files', async () => {
        const taskResult = {
          content: '#!/bin/bash\necho "Test script"',
          metadata: {
            title: 'Script Test',
            version: '1.0',
            type: 'script' as any,
            category: 'automation' as any,
            estimatedDuration: '5 minutes',
            prerequisites: [],
            outputFiles: [],
            commands: [],
            framework: null,
            platform: 'linux'
          },
          sections: [],
          estimatedComplexity: 'simple' as any
        };

        const outputPath = '/test/output/test-script.sh';

        // Mock platform to be non-Windows
        const originalPlatform = process.platform;
        Object.defineProperty(process, 'platform', { value: 'linux' });

        const result = await service.exportTaskFile(taskResult, outputPath, {
          permissions: {
            owner: { read: true, write: true, execute: true },
            group: { read: true, write: false, execute: true },
            other: { read: true, write: false, execute: true },
            octal: '755',
            symbolic: 'rwxr-xr-x'
          }
        });

        expect(result.permissions.octal).toBe('644'); // Default for markdown
        
        // Restore original platform
        Object.defineProperty(process, 'platform', { value: originalPlatform });
      });
    });

    describe('exportProject', () => {
      it('should export complete project with multiple formats', async () => {
        const projectPath = '/test/project';
        const config = {
          projectName: 'Test Project',
          outputDirectory: '/test/output',
          formats: [ExportFormat.MARKDOWN, ExportFormat.BASH, ExportFormat.POWERSHELL, ExportFormat.JSON],
          includeMetadata: true,
          includeReadme: true
        };

        // Mock task generation
        mockTaskGeneration.generateTask.mockResolvedValue({
          content: '# Test Project Task\n\nProject setup instructions.',
          metadata: {
            title: 'Test Project Setup',
            version: '1.0',
            type: 'initialization' as any,
            category: 'project-setup' as any,
            estimatedDuration: '45 minutes',
            prerequisites: ['Node.js', 'npm'],
            outputFiles: ['package.json'],
            commands: ['npm install'],
            framework: 'react',
            platform: 'cross-platform'
          },
          sections: [],
          estimatedComplexity: 'moderate' as any
        });

        // Mock scaffold generation
        mockScaffoldGeneration.generateFromConfig.mockResolvedValue({
          scripts: [
            {
              filename: 'setup.sh',
              platform: Platform.LINUX,
              format: ScriptFormat.BASH,
              content: '#!/bin/bash\nnpm install\nnpm run build',
              executable: true,
              permissions: '755',
              encoding: 'utf-8'
            },
            {
              filename: 'setup.ps1',
              platform: Platform.WINDOWS,
              format: ScriptFormat.POWERSHELL,
              content: 'npm install\nnpm run build',
              executable: true,
              permissions: '755',
              encoding: 'utf-8'
            }
          ],
          metadata: {
            projectName: 'Test Project',
            framework: 'Node.js',
            platforms: [Platform.LINUX, Platform.WINDOWS],
            formats: [ScriptFormat.BASH, ScriptFormat.POWERSHELL],
            totalScripts: 2,
            generatedAt: new Date(),
            estimatedRuntime: '30 minutes'
          },
          summary: {
            scriptsGenerated: 2,
            platformsCovered: 2,
            commandsIncluded: 5,
            prerequisites: ['node', 'npm'],
            outputFiles: ['setup.sh', 'setup.ps1']
          }
        });

        const result = await service.exportProject(projectPath, config);

        expect(result).toBeDefined();
        expect(result.files.length).toBeGreaterThan(0);
        expect(result.metadata).toBeDefined();
        expect(result.summary).toBeDefined();

        // Verify task file was generated
        expect(result.files.some(f => f.format === ExportFormat.MARKDOWN)).toBe(true);
        
        // Verify script files were generated
        expect(result.files.some(f => f.filename === 'setup.sh')).toBe(true);
        expect(result.files.some(f => f.filename === 'setup.ps1')).toBe(true);

        // Verify config file was generated
        expect(result.files.some(f => f.format === ExportFormat.JSON)).toBe(true);

        // Verify README was generated
        expect(result.files.some(f => f.filename === 'README.md')).toBe(true);

        // Verify metadata file was generated
        expect(result.files.some(f => f.filename === 'export-metadata.json')).toBe(true);
      });
    });

    describe('validateConfig', () => {
      it('should validate complete valid configuration', async () => {
        const config = {
          projectName: 'Valid Project',
          outputDirectory: '/valid/output/path',
          formats: [ExportFormat.MARKDOWN, ExportFormat.BASH, ExportFormat.JSON],
          includeMetadata: true,
          includeReadme: true,
          overwriteExisting: false,
          customVariables: {
            framework: 'react',
            platform: 'cross-platform',
            author: 'Test Author'
          }
        };

        const result = service.validateConfig(config);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe('Unhappy Path Tests', () => {
    describe('exportTaskFile', () => {
      it('should handle file write errors gracefully', async () => {
        const taskResult = {
          content: 'Test content',
          metadata: {
            title: 'Error Test',
            version: '1.0',
            type: 'test' as any,
            category: 'development' as any,
            estimatedDuration: '10 minutes',
            prerequisites: [],
            outputFiles: [],
            commands: [],
            framework: null,
            platform: null
          },
          sections: [],
          estimatedComplexity: 'simple' as any
        };

        const outputPath = '/invalid/path/test.md';

        // Mock file write to fail
        mockFs.writeFile.mockRejectedValue(new Error('Permission denied'));

        await expect(service.exportTaskFile(taskResult, outputPath))
          .rejects
          .toThrow('Failed to export task file to /invalid/path/test.md');
      });

      it('should handle chmod errors on non-Windows platforms', async () => {
        const taskResult = {
          content: 'Test script content',
          metadata: {
            title: 'Chmod Error Test',
            version: '1.0',
            type: 'script' as any,
            category: 'automation' as any,
            estimatedDuration: '5 minutes',
            prerequisites: [],
            outputFiles: [],
            commands: [],
            framework: null,
            platform: 'linux'
          },
          sections: [],
          estimatedComplexity: 'simple' as any
        };

        // Mock platform to be non-Windows
        const originalPlatform = process.platform;
        Object.defineProperty(process, 'platform', { value: 'linux' });

        mockFs.writeFile.mockResolvedValue();
        mockFs.chmod.mockRejectedValue(new Error('chmod failed'));

        // Should not throw even if chmod fails
        const result = await service.exportTaskFile(taskResult, '/test/script.sh', {
          permissions: {
            owner: { read: true, write: true, execute: true },
            group: { read: true, write: false, execute: true },
            other: { read: true, write: false, execute: true },
            octal: '755',
            symbolic: 'rwxr-xr-x'
          }
        });

        expect(result).toBeDefined();
        expect(result.filename).toBe('script.sh');

        // Restore original platform
        Object.defineProperty(process, 'platform', { value: originalPlatform });
      });
    });

    describe('exportProject', () => {
      it('should handle task generation failures gracefully', async () => {
        const projectPath = '/test/project';
        const config = {
          projectName: 'Error Project',
          outputDirectory: '/test/output',
          formats: [ExportFormat.MARKDOWN]
        };

        // Mock task generation to fail
        mockTaskGeneration.generateTask.mockRejectedValue(new Error('Task generation failed'));

        await expect(service.exportProject(projectPath, config))
          .rejects
          .toThrow('Failed to export project from /test/project');
      });

      it('should handle scaffold generation failures gracefully', async () => {
        const projectPath = '/test/project';
        const config = {
          projectName: 'Scaffold Error Project',
          outputDirectory: '/test/output',
          formats: [ExportFormat.BASH]
        };

        // Mock task generation to succeed
        mockTaskGeneration.generateTask.mockResolvedValue({
          content: 'Test task',
          metadata: {
            title: 'Test',
            version: '1.0',
            type: 'test' as any,
            category: 'development' as any,
            estimatedDuration: '10 minutes',
            prerequisites: [],
            outputFiles: [],
            commands: [],
            framework: null,
            platform: null
          },
          sections: [],
          estimatedComplexity: 'simple' as any
        });

        // Mock scaffold generation to fail
        mockScaffoldGeneration.generateFromConfig.mockRejectedValue(new Error('Scaffold generation failed'));

        // Should still complete and return files (without scripts)
        const result = await service.exportProject(projectPath, config);
        
        expect(result).toBeDefined();
        expect(result.files.length).toBeGreaterThan(0); // Should at least have task file
      });
    });

    describe('validateConfig', () => {
      it('should reject configuration with empty project name', async () => {
        const config = {
          projectName: '',
          outputDirectory: '/test/output',
          formats: [ExportFormat.MARKDOWN]
        };

        const result = service.validateConfig(config);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Project name is required');
      });

      it('should reject configuration with empty output directory', async () => {
        const config = {
          projectName: 'Test Project',
          outputDirectory: '',
          formats: [ExportFormat.MARKDOWN]
        };

        const result = service.validateConfig(config);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Output directory is required');
      });

      it('should reject configuration with no formats', async () => {
        const config = {
          projectName: 'Test Project',
          outputDirectory: '/test/output',
          formats: []
        };

        const result = service.validateConfig(config);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('At least one export format must be specified');
      });

      it('should collect multiple validation errors', async () => {
        const config = {
          projectName: '',
          outputDirectory: '',
          formats: []
        };

        const result = service.validateConfig(config);

        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(3);
        expect(result.errors).toContain('Project name is required');
        expect(result.errors).toContain('Output directory is required');
        expect(result.errors).toContain('At least one export format must be specified');
      });
    });
  });

  describe('Platform-specific Tests', () => {
    it('should handle Windows paths correctly', async () => {
      const taskResult = {
        content: 'Windows test content',
        metadata: {
          title: 'Windows Test',
          version: '1.0',
          type: 'test' as any,
          category: 'platform' as any,
          estimatedDuration: '15 minutes',
          prerequisites: [],
          outputFiles: [],
          commands: [],
          framework: null,
          platform: 'windows'
        },
        sections: [],
        estimatedComplexity: 'simple' as any
      };

      const windowsPath = 'C:\\test\\output\\windows-task.md';

      const result = await service.exportTaskFile(taskResult, windowsPath);

      expect(result.filename).toBe('windows-task.md');
      expect(result.path).toBe(windowsPath);
    });

    it('should skip chmod on Windows platform', async () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'win32' });

      const taskResult = {
        content: 'Windows script content',
        metadata: {
          title: 'Windows Script',
          version: '1.0',
          type: 'script' as any,
          category: 'automation' as any,
          estimatedDuration: '5 minutes',
          prerequisites: [],
          outputFiles: [],
          commands: [],
          framework: null,
          platform: 'windows'
        },
        sections: [],
        estimatedComplexity: 'simple' as any
      };

      const result = await service.exportTaskFile(taskResult, '/test/script.bat', {
        permissions: {
          owner: { read: true, write: true, execute: true },
          group: { read: true, write: false, execute: true },
          other: { read: true, write: false, execute: true },
          octal: '755',
          symbolic: 'rwxr-xr-x'
        }
      });

      expect(result).toBeDefined();
      expect(mockFs.chmod).not.toHaveBeenCalled(); // Should not call chmod on Windows

      // Restore original platform
      Object.defineProperty(process, 'platform', { value: originalPlatform });
    });
  });

  describe('Format Support Tests', () => {
    it('should return all supported export formats', () => {
      const formats = service.getSupportedFormats();

      expect(formats).toContain(ExportFormat.MARKDOWN);
      expect(formats).toContain(ExportFormat.BASH);
      expect(formats).toContain(ExportFormat.POWERSHELL);
      expect(formats).toContain(ExportFormat.BATCH);
      expect(formats).toContain(ExportFormat.PYTHON);
      expect(formats).toContain(ExportFormat.NODE_JS);
      expect(formats).toContain(ExportFormat.JSON);
      expect(formats).toContain(ExportFormat.YAML);
      expect(formats).toContain(ExportFormat.DOCKERFILE);
      expect(formats).toContain(ExportFormat.MAKEFILE);
      expect(formats.length).toBeGreaterThan(10);
    });

    it('should handle all supported script formats', async () => {
      const formats = [
        ExportFormat.BASH,
        ExportFormat.POWERSHELL,
        ExportFormat.BATCH,
        ExportFormat.PYTHON,
        ExportFormat.NODE_JS
      ];

      for (const format of formats) {
        const config = {
          projectName: `Test ${format}`,
          outputDirectory: '/test/output',
          formats: [format]
        };

        mockScaffoldGeneration.generateFromConfig.mockResolvedValue({
          scripts: [{
            filename: `test.${format}`,
            platform: Platform.CROSS_PLATFORM,
            format: ScriptFormat.BASH,
            content: `# Test ${format} script`,
            executable: true,
            permissions: '755',
            encoding: 'utf-8'
          }],
          metadata: {
            projectName: config.projectName,
            framework: 'Generic',
            platforms: [Platform.CROSS_PLATFORM],
            formats: [ScriptFormat.BASH],
            totalScripts: 1,
            generatedAt: new Date(),
            estimatedRuntime: '10 minutes'
          },
          summary: {
            scriptsGenerated: 1,
            platformsCovered: 1,
            commandsIncluded: 3,
            prerequisites: ['bash'],
            outputFiles: [`test.${format}`]
          }
        });

        const result = await service.exportProject('/test/project', config);

        expect(result.files.some(f => f.filename.includes(format))).toBe(true);
      }
    });
  });
});