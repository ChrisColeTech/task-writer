import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import * as fs from 'fs/promises';
import { ExportService } from '../../services/ExportService';
import { TaskGenerationService } from '../../services/TaskGenerationService';
import { ScaffoldGenerationService } from '../../services/ScaffoldGenerationService';
import { ExportFormat, FileEncoding } from '../../types/export';

// Mock dependencies
jest.mock('fs/promises');
jest.mock('../../services/TaskGenerationService');
jest.mock('../../services/ScaffoldGenerationService');

const mockFs = fs as jest.Mocked<typeof fs>;
const MockTaskGenerationService = TaskGenerationService as jest.MockedClass<typeof TaskGenerationService>;
const MockScaffoldGenerationService = ScaffoldGenerationService as jest.MockedClass<typeof ScaffoldGenerationService>;

describe('ExportService', () => {
  let service: ExportService;
  let mockTaskGeneration: jest.Mocked<TaskGenerationService>;
  let mockScaffoldGeneration: jest.Mocked<ScaffoldGenerationService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockTaskGeneration = new MockTaskGenerationService() as jest.Mocked<TaskGenerationService>;
    mockScaffoldGeneration = new MockScaffoldGenerationService() as jest.Mocked<ScaffoldGenerationService>;
    
    service = new ExportService(mockTaskGeneration, mockScaffoldGeneration);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('exportTaskFile', () => {
    it('should export task file successfully', async () => {
      const taskResult = {
        content: '# Test Task\n\nThis is a test task.',
        metadata: {
          title: 'Test Task',
          version: '1.0',
          type: 'initialization' as any,
          category: 'development' as any,
          estimatedDuration: '30 minutes',
          prerequisites: [],
          outputFiles: [],
          commands: [],
          framework: null,
          platform: null
        },
        sections: [],
        estimatedComplexity: 'simple' as any
      };

      const outputPath = '/test/output/task.md';

      mockFs.writeFile.mockResolvedValue();

      const result = await service.exportTaskFile(taskResult, outputPath);

      expect(result).toMatchObject({
        filename: 'task.md',
        path: outputPath,
        content: taskResult.content,
        format: ExportFormat.MARKDOWN,
        encoding: FileEncoding.UTF8
      });

      expect(result.size).toBeGreaterThan(0);
      expect(result.checksum).toBeDefined();
      expect(result.mimeType).toBe('text/markdown');
    });

    it('should handle dry run mode', async () => {
      const taskResult = {
        content: '# Test Task',
        metadata: {
          title: 'Test Task',
          version: '1.0',
          type: 'initialization' as any,
          category: 'development' as any,
          estimatedDuration: '30 minutes',
          prerequisites: [],
          outputFiles: [],
          commands: [],
          framework: null,
          platform: null
        },
        sections: [],
        estimatedComplexity: 'simple' as any
      };

      const outputPath = '/test/output/task.md';

      const result = await service.exportTaskFile(taskResult, outputPath, { dryRun: true });

      expect(mockFs.writeFile).not.toHaveBeenCalled();
      expect(result.filename).toBe('task.md');
    });
  });

  describe('getSupportedFormats', () => {
    it('should return all supported export formats', () => {
      const formats = service.getSupportedFormats();

      expect(formats).toContain(ExportFormat.MARKDOWN);
      expect(formats).toContain(ExportFormat.BASH);
      expect(formats).toContain(ExportFormat.POWERSHELL);
      expect(formats).toContain(ExportFormat.JSON);
      expect(formats.length).toBeGreaterThan(10);
    });
  });

  describe('validateConfig', () => {
    it('should validate valid export config', () => {
      const config = {
        projectName: 'Test Project',
        outputDirectory: '/test/output',
        formats: [ExportFormat.MARKDOWN, ExportFormat.BASH]
      };

      const result = service.validateConfig(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject config with missing project name', () => {
      const config = {
        projectName: '',
        outputDirectory: '/test/output',
        formats: [ExportFormat.MARKDOWN]
      };

      const result = service.validateConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Project name is required');
    });

    it('should reject config with missing output directory', () => {
      const config = {
        projectName: 'Test Project',
        outputDirectory: '',
        formats: [ExportFormat.MARKDOWN]
      };

      const result = service.validateConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Output directory is required');
    });

    it('should reject config with no formats', () => {
      const config = {
        projectName: 'Test Project',
        outputDirectory: '/test/output',
        formats: []
      };

      const result = service.validateConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('At least one export format must be specified');
    });
  });
});