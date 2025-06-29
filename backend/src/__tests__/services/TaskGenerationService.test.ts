import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import * as fs from 'fs/promises';
import { TaskGenerationService } from '../../services/TaskGenerationService';
import { FileAnalysisService } from '../../services/FileAnalysisService';
import { FrameworkDetectionService } from '../../services/FrameworkDetectionService';
import {
  TaskType,
  TaskCategory,
  SectionType,
  TaskComplexity,
  TaskGenerationError
} from '../../types/taskGeneration';
import {
  FrameworkType,
  ProjectType,
  ProjectArchitecture,
  FrameworkCategory
} from '../../types/framework';

// Mock dependencies
jest.mock('fs/promises');
jest.mock('../../services/FileAnalysisService');
jest.mock('../../services/FrameworkDetectionService');

const mockFs = fs as jest.Mocked<typeof fs>;
const MockFileAnalysisService = FileAnalysisService as jest.MockedClass<typeof FileAnalysisService>;
const MockFrameworkDetectionService = FrameworkDetectionService as jest.MockedClass<typeof FrameworkDetectionService>;

describe('TaskGenerationService', () => {
  let service: TaskGenerationService;
  let mockFileAnalysis: jest.Mocked<FileAnalysisService>;
  let mockFrameworkDetection: jest.Mocked<FrameworkDetectionService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockFileAnalysis = new MockFileAnalysisService() as jest.Mocked<FileAnalysisService>;
    mockFrameworkDetection = new MockFrameworkDetectionService() as jest.Mocked<FrameworkDetectionService>;
    
    service = new TaskGenerationService(mockFileAnalysis, mockFrameworkDetection);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('generateTask', () => {
    it('should generate React frontend task', async () => {
      const projectPath = '/test/react-project';
      
      // Mock framework detection result
      mockFrameworkDetection.detectFrameworks.mockResolvedValue({
        frameworks: [
          {
            name: FrameworkType.REACT,
            version: '18.2.0',
            confidence: 0.9,
            category: FrameworkCategory.FRONTEND
          }
        ],
        projectType: ProjectType.FRONTEND,
        architecture: ProjectArchitecture.SPA,
        buildTools: {
          bundler: 'vite',
          transpiler: 'typescript',
          taskRunner: 'npm',
          packageManager: 'npm'
        },
        confidence: 0.9,
        evidence: {
          packageJson: {
            dependencies: ['react', 'react-dom'],
            devDependencies: ['@types/react', 'vite'],
            scripts: ['dev', 'build'],
            framework: ['react']
          },
          configFiles: {
            found: ['vite.config.ts'],
            frameworks: ['vite']
          },
          filePatterns: {
            extensions: ['.tsx', '.ts'],
            patterns: ['*.tsx'],
            frameworks: ['react']
          }
        }
      });

      mockFrameworkDetection.getPrimaryFramework.mockReturnValue({
        name: FrameworkType.REACT,
        version: '18.2.0',
        confidence: 0.9,
        category: FrameworkCategory.FRONTEND
      });

      // Mock file analysis result
      mockFileAnalysis.analyzeDirectory.mockResolvedValue({
        results: [
          {
            path: 'src/App.tsx',
            metadata: {
              size: 2048,
              modifiedAt: new Date(),
              createdAt: new Date(),
              type: 'code' as any,
              language: 'TypeScript',
              encoding: 'utf-8',
              permissions: 'rw-r--r--'
            },
            content: {
              raw: 'import React from "react"',
              lines: 10,
              characters: 100,
              isEmpty: false,
              isBinary: false
            },
            structure: {
              imports: ['React'],
              exports: ['App'],
              functions: [],
              classes: [],
              comments: { todos: [], fixmes: [], documentation: [] }
            },
            relationships: {
              dependencies: ['React'],
              dependents: []
            }
          }
        ],
        errors: []
      });

      const config = {
        framework: 'React',
        projectType: 'frontend',
        variables: {
          taskNumber: '3.0',
          projectName: 'React Frontend'
        }
      };

      const result = await service.generateTask(projectPath, config);

      expect(result).toBeDefined();
      expect(result.content).toContain('# Task 3.0: React Frontend');
      expect(result.content).toContain('### Rules');
      expect(result.metadata.title).toBe('React Frontend Setup');
      expect(result.metadata.framework).toBe('react');
      expect(result.sections).toHaveLength(2); // Rules and Title sections
      expect(result.estimatedComplexity).toBe(TaskComplexity.SIMPLE);
    });

    it('should generate .NET backend task', async () => {
      const projectPath = '/test/dotnet-project';
      
      mockFrameworkDetection.detectFrameworks.mockResolvedValue({
        frameworks: [
          {
            name: FrameworkType.EXPRESS,
            version: '4.18.0',
            confidence: 0.85,
            category: FrameworkCategory.BACKEND
          }
        ],
        projectType: ProjectType.BACKEND,
        architecture: ProjectArchitecture.API,
        buildTools: {
          bundler: null,
          transpiler: null,
          taskRunner: 'npm',
          packageManager: 'npm'
        },
        confidence: 0.85,
        evidence: {
          packageJson: {
            dependencies: ['express'],
            devDependencies: ['@types/express'],
            scripts: ['start', 'dev'],
            framework: ['express']
          },
          configFiles: { found: [], frameworks: [] },
          filePatterns: {
            extensions: ['.js', '.ts'],
            patterns: [],
            frameworks: []
          }
        }
      });

      mockFrameworkDetection.getPrimaryFramework.mockReturnValue({
        name: FrameworkType.EXPRESS,
        version: '4.18.0',
        confidence: 0.85,
        category: FrameworkCategory.BACKEND
      });

      mockFileAnalysis.analyzeDirectory.mockResolvedValue({
        results: [
          {
            path: 'server.js',
            metadata: {
              size: 1024,
              modifiedAt: new Date(),
              createdAt: new Date(),
              type: 'code' as any,
              language: 'JavaScript',
              encoding: 'utf-8',
              permissions: 'rw-r--r--'
            },
            content: {
              raw: 'const express = require("express")',
              lines: 30,
              characters: 500,
              isEmpty: false,
              isBinary: false
            },
            structure: {
              imports: ['express'],
              exports: [],
              functions: ['app'],
              classes: [],
              comments: { todos: [], fixmes: [], documentation: ['API documentation'] }
            },
            relationships: {
              dependencies: ['express'],
              dependents: []
            }
          }
        ],
        errors: []
      });

      const config = {
        framework: '.NET',
        projectType: 'backend',
        variables: {
          taskNumber: '2.0',
          projectName: 'Backend API'
        }
      };

      const result = await service.generateTask(projectPath, config);

      expect(result).toBeDefined();
      expect(result.content).toContain('# Task 2.0: Backend API');
      expect(result.metadata.framework).toBe('express');
      expect(result.sections.some(s => s.type === SectionType.RULES)).toBe(true);
    });

    it('should generate initialization task for empty project', async () => {
      const projectPath = '/test/empty-project';
      
      mockFrameworkDetection.detectFrameworks.mockResolvedValue({
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
          packageJson: {
            dependencies: [],
            devDependencies: [],
            scripts: [],
            framework: []
          },
          configFiles: { found: [], frameworks: [] },
          filePatterns: {
            extensions: [],
            patterns: [],
            frameworks: []
          }
        }
      });

      mockFrameworkDetection.getPrimaryFramework.mockReturnValue(null);

      mockFileAnalysis.analyzeDirectory.mockResolvedValue({
        results: [],
        errors: []
      });

      const config = {
        variables: {
          taskNumber: '1.0',
          projectName: 'New Project'
        }
      };

      const result = await service.generateTask(projectPath, config);

      expect(result).toBeDefined();
      expect(result.content).toContain('# Task 1.0: Project Initialization');
      expect(result.content).toContain('mkdir electron, frontend, backend');
      expect(result.estimatedComplexity).toBe(TaskComplexity.SIMPLE);
    });

    it('should handle analysis errors gracefully', async () => {
      const projectPath = '/test/error-project';
      
      mockFrameworkDetection.detectFrameworks.mockRejectedValue(new Error('Access denied'));

      const config = { projectType: 'frontend' };

      await expect(service.generateTask(projectPath, config)).rejects.toThrow(TaskGenerationError);
    });
  });

  describe('generateFromTemplate', () => {
    it('should generate task from initialization template', async () => {
      const variables = {
        taskNumber: '1.0',
        projectName: 'Test Project',
        platform: 'Windows'
      };

      const result = await service.generateFromTemplate('initialization', variables);

      expect(result).toBeDefined();
      expect(result.content).toContain('# Task 1.0: Project Initialization');
      expect(result.content).toContain('PowerShell');
      expect(result.metadata.title).toBe('Project Initialization');
      expect(result.metadata.version).toBe('1.0');
    });

    it('should generate task from React frontend template', async () => {
      const variables = {
        taskNumber: '2.0',
        packageManager: 'npm',
        styling: 'tailwind'
      };

      const result = await service.generateFromTemplate('frontend-react', variables);

      expect(result).toBeDefined();
      expect(result.content).toContain('React Frontend Setup');
      expect(result.metadata.framework).toBe('React');
    });

    it('should throw error for unknown template', async () => {
      const variables = {};

      await expect(
        service.generateFromTemplate('unknown-template', variables)
      ).rejects.toThrow('Template not found: unknown-template');
    });
  });

  describe('template management', () => {
    it('should return available templates', () => {
      const templates = service.getAvailableTemplates();

      expect(templates).toBeInstanceOf(Array);
      expect(templates.length).toBeGreaterThan(0);
      expect(templates.some(t => t.id === 'initialization')).toBe(true);
      expect(templates.some(t => t.id === 'frontend-react')).toBe(true);
    });

    it('should get specific template by ID', () => {
      const template = service.getTemplate('initialization');

      expect(template).toBeDefined();
      expect(template?.id).toBe('initialization');
      expect(template?.name).toBe('Project Initialization');
      expect(template?.type).toBe(TaskType.INITIALIZATION);
    });

    it('should return null for non-existent template', () => {
      const template = service.getTemplate('non-existent');

      expect(template).toBeNull();
    });

    it('should register custom template', () => {
      const customTemplate = {
        id: 'custom-test',
        name: 'Custom Test Template',
        description: 'A custom template for testing',
        type: TaskType.CUSTOM,
        category: TaskCategory.DEVELOPMENT,
        sections: [
          {
            type: SectionType.TITLE,
            title: 'Custom Task',
            required: true,
            order: 1
          }
        ],
        variables: []
      };

      service.registerTemplate(customTemplate);

      const retrieved = service.getTemplate('custom-test');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Custom Test Template');
    });
  });

  describe('variable substitution', () => {
    it('should substitute variables in generated content', async () => {
      const variables = {
        taskNumber: '5.0',
        projectName: 'Custom App Name',
        customVariable: 'custom value'
      };

      const result = await service.generateFromTemplate('initialization', variables);

      expect(result.content).toContain('Task 5.0');
      expect(result.content).toContain('Custom App Name');
    });
  });

  describe('complexity assessment', () => {
    it('should assess simple project complexity', async () => {
      const projectPath = '/test/simple-project';
      
      mockFrameworkDetection.detectFrameworks.mockResolvedValue({
        frameworks: [
          {
            name: FrameworkType.REACT,
            version: '18.2.0',
            confidence: 0.9,
            category: FrameworkCategory.FRONTEND
          }
        ],
        projectType: ProjectType.FRONTEND,
        architecture: ProjectArchitecture.SPA,
        buildTools: { bundler: 'vite', transpiler: 'typescript', taskRunner: 'npm', packageManager: 'npm' },
        confidence: 0.9,
        evidence: {
          packageJson: { dependencies: ['react'], devDependencies: [], scripts: [], framework: [] },
          configFiles: { found: [], frameworks: [] },
          filePatterns: { extensions: ['.tsx'], patterns: [], frameworks: [] }
        }
      });

      mockFrameworkDetection.getPrimaryFramework.mockReturnValue({
        name: FrameworkType.REACT,
        version: '18.2.0',
        confidence: 0.9,
        category: FrameworkCategory.FRONTEND
      });

      // Small project - 5 files
      mockFileAnalysis.analyzeDirectory.mockResolvedValue({
        results: Array(5).fill(null).map((_, i) => ({
          path: `file${i}.tsx`,
          metadata: {
            size: 2048,
            modifiedAt: new Date(),
            createdAt: new Date(),
            type: 'code' as any,
            language: 'TypeScript',
            encoding: 'utf-8',
            permissions: 'rw-r--r--'
          },
          content: {
            raw: 'sample content',
            lines: 10,
            characters: 100,
            isEmpty: false,
            isBinary: false
          },
          structure: {
            imports: [],
            exports: [],
            functions: [],
            classes: [],
            comments: { todos: [], fixmes: [], documentation: [] }
          },
          relationships: {
            dependencies: [],
            dependents: []
          }
        })),
        errors: []
      });

      const config = { framework: 'React' };
      const result = await service.generateTask(projectPath, config);

      expect(result.estimatedComplexity).toBe(TaskComplexity.SIMPLE);
    });

    it('should assess complex project complexity', async () => {
      const projectPath = '/test/complex-project';
      
      mockFrameworkDetection.detectFrameworks.mockResolvedValue({
        frameworks: [
          {
            name: FrameworkType.REACT,
            version: '18.2.0',
            confidence: 0.9,
            category: FrameworkCategory.FRONTEND
          },
          {
            name: FrameworkType.EXPRESS,
            version: '4.18.0',
            confidence: 0.8,
            category: FrameworkCategory.BACKEND
          }
        ],
        projectType: ProjectType.FULLSTACK,
        architecture: ProjectArchitecture.SSR,
        buildTools: { bundler: 'webpack', transpiler: 'typescript', taskRunner: 'yarn', packageManager: 'yarn' },
        confidence: 0.85,
        evidence: {
          packageJson: { dependencies: ['react', 'express'], devDependencies: [], scripts: [], framework: [] },
          configFiles: { found: ['webpack.config.js'], frameworks: [] },
          filePatterns: { extensions: ['.tsx', '.ts'], patterns: [], frameworks: [] }
        }
      });

      mockFrameworkDetection.getPrimaryFramework.mockReturnValue({
        name: FrameworkType.REACT,
        version: '18.2.0',
        confidence: 0.9,
        category: FrameworkCategory.FRONTEND
      });

      // Large project - 100 files
      mockFileAnalysis.analyzeDirectory.mockResolvedValue({
        results: Array(100).fill(null).map((_, i) => ({
          path: `file${i}.tsx`,
          metadata: {
            size: 10240,
            modifiedAt: new Date(),
            createdAt: new Date(),
            type: 'code' as any,
            language: 'TypeScript',
            encoding: 'utf-8',
            permissions: 'rw-r--r--'
          },
          content: {
            raw: 'sample content',
            lines: 50,
            characters: 2000,
            isEmpty: false,
            isBinary: false
          },
          structure: {
            imports: [],
            exports: [],
            functions: [],
            classes: [],
            comments: { todos: [], fixmes: [], documentation: [] }
          },
          relationships: {
            dependencies: [],
            dependents: []
          }
        })),
        errors: []
      });

      const config = { framework: 'React' };
      const result = await service.generateTask(projectPath, config);

      expect(result.estimatedComplexity).toBe(TaskComplexity.COMPLEX);
    });
  });

  describe('output validation', () => {
    it('should validate generated task output when requested', async () => {
      const variables = {
        taskNumber: '1.0',
        projectName: 'Valid Project'
      };

      const options = { validateOutput: true };

      const result = await service.generateFromTemplate('initialization', variables, options);

      expect(result).toBeDefined();
      expect(result.content).toBeTruthy();
      expect(result.metadata.title).toBeTruthy();
      expect(result.sections.length).toBeGreaterThan(0);
    });
  });
});