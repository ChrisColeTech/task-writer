import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import * as fs from 'fs/promises';
import { FrameworkDetectionService } from '../../services/FrameworkDetectionService';
import {
  FrameworkType,
  FrameworkCategory,
  ProjectType,
  ProjectArchitecture,
  FrameworkDetectionError
} from '../../types/framework';

// Mock fs module
jest.mock('fs/promises');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('FrameworkDetectionService', () => {
  let service: FrameworkDetectionService;

  beforeEach(() => {
    service = new FrameworkDetectionService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('React project detection', () => {
    it('should detect React project from package.json', async () => {
      const projectPath = '/test/react-project';
      const packageJson = {
        name: 'react-app',
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0'
        },
        devDependencies: {
          '@types/react': '^18.0.0',
          '@types/react-dom': '^18.0.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue([]);

      const result = await service.detectFrameworks(projectPath);

      expect(result.frameworks).toHaveLength(1);
      expect(result.frameworks[0].name).toBe(FrameworkType.REACT);
      expect(result.frameworks[0].version).toBe('18.2.0');
      expect(result.frameworks[0].category).toBe(FrameworkCategory.FRONTEND);
      expect(result.projectType).toBe(ProjectType.FRONTEND);
      expect(result.architecture).toBe(ProjectArchitecture.SPA);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should detect React with TypeScript', async () => {
      const projectPath = '/test/react-ts-project';
      const packageJson = {
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0'
        },
        devDependencies: {
          typescript: '^4.9.0',
          '@types/react': '^18.0.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue([]);

      const result = await service.detectFrameworks(projectPath);

      expect(result.frameworks[0].name).toBe(FrameworkType.REACT);
      expect(result.buildTools.transpiler).toBe('typescript');
    });

    it('should detect React from .jsx files', async () => {
      const projectPath = '/test/react-project';

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockRejectedValue(new Error('package.json not found'));
      mockFs.readdir
        .mockResolvedValueOnce([]) // Root directory config files
        .mockResolvedValueOnce([
          { name: 'Component.jsx', isFile: () => true, isDirectory: () => false },
          { name: 'App.jsx', isFile: () => true, isDirectory: () => false }
        ] as any); // File pattern scan

      const result = await service.detectFrameworks(projectPath);

      expect(result.frameworks).toHaveLength(1);
      expect(result.frameworks[0].name).toBe(FrameworkType.REACT);
      expect(result.evidence.filePatterns.extensions).toContain('.jsx');
    });
  });

  describe('Vue project detection', () => {
    it('should detect Vue 3 project', async () => {
      const projectPath = '/test/vue-project';
      const packageJson = {
        dependencies: {
          vue: '^3.3.0'
        },
        devDependencies: {
          '@vitejs/plugin-vue': '^4.0.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue([]);

      const result = await service.detectFrameworks(projectPath);

      expect(result.frameworks[0].name).toBe(FrameworkType.VUE);
      expect(result.frameworks[0].version).toBe('3.3.0');
      expect(result.projectType).toBe(ProjectType.FRONTEND);
    });

    it('should detect Vue from vue.config.js', async () => {
      const projectPath = '/test/vue-project';

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockRejectedValue(new Error('package.json not found'));
      mockFs.readdir.mockResolvedValue(['vue.config.js', 'src'] as any);

      const result = await service.detectFrameworks(projectPath);

      expect(result.frameworks[0].name).toBe(FrameworkType.VUE);
      expect(result.evidence.configFiles.found).toContain('vue.config.js');
    });
  });

  describe('Angular project detection', () => {
    it('should detect Angular project', async () => {
      const projectPath = '/test/angular-project';
      const packageJson = {
        dependencies: {
          '@angular/core': '^16.0.0',
          '@angular/common': '^16.0.0'
        },
        devDependencies: {
          '@angular/cli': '^16.0.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue(['angular.json'] as any);

      const result = await service.detectFrameworks(projectPath);

      expect(result.frameworks[0].name).toBe(FrameworkType.ANGULAR);
      expect(result.frameworks[0].confidence).toBeGreaterThan(0.9); // High confidence due to both package.json and config file
      expect(result.evidence.configFiles.found).toContain('angular.json');
    });
  });

  describe('Next.js project detection', () => {
    it('should detect Next.js project', async () => {
      const projectPath = '/test/nextjs-project';
      const packageJson = {
        dependencies: {
          next: '^13.0.0',
          react: '^18.2.0',
          'react-dom': '^18.2.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue(['next.config.js'] as any);

      const result = await service.detectFrameworks(projectPath);

      const nextFramework = result.frameworks.find(f => f.name === FrameworkType.NEXT_JS);
      const reactFramework = result.frameworks.find(f => f.name === FrameworkType.REACT);

      expect(nextFramework).toBeDefined();
      expect(reactFramework).toBeDefined();
      expect(result.projectType).toBe(ProjectType.FULLSTACK);
      expect(result.architecture).toBe(ProjectArchitecture.SSR);
    });
  });

  describe('Express backend detection', () => {
    it('should detect Express backend', async () => {
      const projectPath = '/test/express-api';
      const packageJson = {
        dependencies: {
          express: '^4.18.0',
          cors: '^2.8.5'
        },
        devDependencies: {
          '@types/express': '^4.17.0',
          nodemon: '^2.0.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue([]);

      const result = await service.detectFrameworks(projectPath);

      expect(result.frameworks[0].name).toBe(FrameworkType.EXPRESS);
      expect(result.projectType).toBe(ProjectType.BACKEND);
      expect(result.architecture).toBe(ProjectArchitecture.API);
    });
  });

  describe('Mobile project detection', () => {
    it('should detect React Native project', async () => {
      const projectPath = '/test/react-native-app';
      const packageJson = {
        dependencies: {
          'react-native': '^0.72.0',
          react: '^18.2.0'
        },
        devDependencies: {
          '@react-native/cli': '^12.0.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue([]);

      const result = await service.detectFrameworks(projectPath);

      const rnFramework = result.frameworks.find(f => f.name === FrameworkType.REACT_NATIVE);
      expect(rnFramework).toBeDefined();
      expect(result.projectType).toBe(ProjectType.MOBILE);
    });

    it('should detect Expo project', async () => {
      const projectPath = '/test/expo-app';
      const packageJson = {
        dependencies: {
          expo: '^49.0.0',
          react: '^18.2.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue(['expo.json', 'app.json'] as any);

      const result = await service.detectFrameworks(projectPath);

      expect(result.frameworks[0].name).toBe(FrameworkType.EXPO);
      expect(result.projectType).toBe(ProjectType.MOBILE);
      expect(result.evidence.configFiles.found).toContain('expo.json');
    });
  });

  describe('Build tools detection', () => {
    it('should detect Vite as bundler', async () => {
      const projectPath = '/test/vite-project';
      const packageJson = {
        dependencies: {
          react: '^18.2.0'
        },
        devDependencies: {
          vite: '^4.0.0',
          '@vitejs/plugin-react': '^4.0.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue(['vite.config.js'] as any);

      const result = await service.detectFrameworks(projectPath);

      expect(result.buildTools.bundler).toBe('vite');
      const viteFramework = result.frameworks.find(f => f.name === FrameworkType.VITE);
      expect(viteFramework).toBeDefined();
    });

    it('should detect Webpack as bundler', async () => {
      const projectPath = '/test/webpack-project';
      const packageJson = {
        devDependencies: {
          webpack: '^5.0.0',
          'webpack-cli': '^5.0.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue(['webpack.config.js'] as any);

      const result = await service.detectFrameworks(projectPath);

      expect(result.buildTools.bundler).toBe('webpack');
    });
  });

  describe('Complex projects', () => {
    it('should handle fullstack project with multiple frameworks', async () => {
      const projectPath = '/test/fullstack-project';
      const packageJson = {
        dependencies: {
          next: '^13.0.0',
          react: '^18.2.0',
          express: '^4.18.0'
        },
        devDependencies: {
          typescript: '^4.9.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue(['next.config.js'] as any);

      const result = await service.detectFrameworks(projectPath);

      expect(result.frameworks).toHaveLength(3); // Next.js, React, Express
      expect(result.projectType).toBe(ProjectType.FULLSTACK);
      expect(result.buildTools.transpiler).toBe('typescript');
    });

    it('should handle monorepo with workspaces', async () => {
      const projectPath = '/test/monorepo';
      const packageJson = {
        workspaces: ['packages/*'],
        devDependencies: {
          lerna: '^6.0.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue([]);

      const result = await service.detectFrameworks(projectPath);

      expect(result.buildTools.taskRunner).toBe('yarn'); // Workspaces indicate Yarn
      expect(result.projectType).toBe(ProjectType.MONOREPO);
    });
  });

  describe('Error handling', () => {
    it('should throw error for invalid project path', async () => {
      const projectPath = '/test/nonexistent';

      mockFs.access.mockRejectedValue(new Error('Path does not exist'));

      await expect(service.detectFrameworks(projectPath)).rejects.toThrow(FrameworkDetectionError);
    });

    it('should handle corrupt package.json gracefully', async () => {
      const projectPath = '/test/corrupt-project';

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue('{ invalid json }');
      mockFs.readdir.mockResolvedValue([]);

      const result = await service.detectFrameworks(projectPath);

      expect(result.frameworks).toHaveLength(0);
      expect(result.projectType).toBe(ProjectType.UNKNOWN);
      expect(result.confidence).toBe(0);
    });

    it('should handle missing package.json', async () => {
      const projectPath = '/test/no-package-json';

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockRejectedValue(new Error('File not found'));
      mockFs.readdir.mockResolvedValue([]);

      const result = await service.detectFrameworks(projectPath);

      // Should still work with config file and file pattern detection
      expect(result).toBeDefined();
      expect(result.projectType).toBe(ProjectType.UNKNOWN);
    });
  });

  describe('Utility methods', () => {
    it('should get primary framework', async () => {
      const projectPath = '/test/react-project';
      const packageJson = {
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue([]);

      const result = await service.detectFrameworks(projectPath);
      const primary = service.getPrimaryFramework(result);

      expect(primary?.name).toBe(FrameworkType.REACT);
    });

    it('should check if specific framework exists', async () => {
      const projectPath = '/test/react-project';
      const packageJson = {
        dependencies: {
          react: '^18.2.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue([]);

      const result = await service.detectFrameworks(projectPath);

      expect(service.hasFramework(result, FrameworkType.REACT)).toBe(true);
      expect(service.hasFramework(result, FrameworkType.VUE)).toBe(false);
    });

    it('should get frameworks by category', async () => {
      const projectPath = '/test/fullstack-project';
      const packageJson = {
        dependencies: {
          react: '^18.2.0',
          express: '^4.18.0'
        },
        devDependencies: {
          jest: '^29.0.0'
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue([]);

      const result = await service.detectFrameworks(projectPath);
      const frontendFrameworks = service.getFrameworksByCategory(result, FrameworkCategory.FRONTEND);
      const backendFrameworks = service.getFrameworksByCategory(result, FrameworkCategory.BACKEND);

      expect(frontendFrameworks).toHaveLength(1);
      expect(frontendFrameworks[0].name).toBe(FrameworkType.REACT);
      expect(backendFrameworks).toHaveLength(1);
      expect(backendFrameworks[0].name).toBe(FrameworkType.EXPRESS);
    });
  });

  describe('Confidence filtering', () => {
    it('should filter frameworks by minimum confidence', async () => {
      const projectPath = '/test/mixed-project';
      const packageJson = {
        dependencies: {
          react: '^18.2.0' // High confidence
        },
        devDependencies: {
          jest: '^29.0.0' // Lower confidence
        }
      };

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(JSON.stringify(packageJson));
      mockFs.readdir.mockResolvedValue([]);

      const result = await service.detectFrameworks(projectPath, { minConfidence: 0.8 });

      expect(result.frameworks).toHaveLength(1);
      expect(result.frameworks[0].name).toBe(FrameworkType.REACT);
    });
  });
});