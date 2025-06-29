/**
 * Framework Detection Demo
 * Shows how framework detection works for frontend and backend projects
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { FrameworkDetectionService } from '../../services/FrameworkDetectionService';
import { createMockDirectoryStructure, cleanupMockDirectory } from '../setup';
import fs from 'fs/promises';
import path from 'path';
import { FrameworkType, FrameworkCategory } from '../../types/framework';

describe('Framework Detection Demo - Frontend vs Backend', () => {
  let frameworkService: FrameworkDetectionService;
  let testDir: string;

  beforeEach(async () => {
    frameworkService = new FrameworkDetectionService();
    testDir = createMockDirectoryStructure();
  });

  afterEach(async () => {
    cleanupMockDirectory(testDir);
  });

  describe('🎨 Frontend Framework Detection', () => {
    it('should detect React frontend project', async () => {
      // Create React project
      const packageJson = {
        name: 'react-frontend',
        version: '1.0.0',
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0',
          'react-router-dom': '^6.0.0'
        },
        devDependencies: {
          '@types/react': '^18.0.0',
          '@types/react-dom': '^18.0.0',
          'vite': '^4.0.0'
        },
        scripts: {
          'dev': 'vite',
          'build': 'vite build',
          'preview': 'vite preview'
        }
      };

      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const result = await frameworkService.detectFrameworks(testDir);

      console.log('🎨 React Frontend Detection:');
      console.log('Frameworks:', result.frameworks.map(f => f.name));
      console.log('Project Type:', result.projectType);
      console.log('Architecture:', result.architecture);
      console.log('Build Tools:', result.buildTools);

      expect(result.frameworks.some(f => f.name === FrameworkType.REACT)).toBe(true);
      expect(result.frameworks.some(f => f.category === FrameworkCategory.FRONTEND)).toBe(true);
      expect(result.projectType).toBe('frontend');
      expect(result.buildTools.bundler).toBe('vite');
    });

    it('should detect Vue 3 frontend project', async () => {
      const packageJson = {
        name: 'vue-frontend',
        version: '1.0.0',
        dependencies: {
          'vue': '^3.3.0',
          'vue-router': '^4.0.0',
          'pinia': '^2.0.0'
        },
        devDependencies: {
          '@vitejs/plugin-vue': '^4.0.0',
          'vite': '^4.0.0',
          '@vue/cli': '^5.0.0'
        },
        scripts: {
          'dev': 'vite',
          'build': 'vite build'
        }
      };

      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const result = await frameworkService.detectFrameworks(testDir);

      console.log('🎨 Vue Frontend Detection:');
      console.log('Frameworks:', result.frameworks.map(f => f.name));
      console.log('Project Type:', result.projectType);

      expect(result.frameworks.some(f => f.name === FrameworkType.VUE)).toBe(true);
      expect(result.frameworks.some(f => f.category === FrameworkCategory.FRONTEND)).toBe(true);
      expect(result.projectType).toBe('frontend');
    });

    it('should detect Next.js meta-framework', async () => {
      const packageJson = {
        name: 'nextjs-app',
        version: '1.0.0',
        dependencies: {
          'next': '^14.0.0',
          'react': '^18.2.0',
          'react-dom': '^18.2.0'
        },
        scripts: {
          'dev': 'next dev',
          'build': 'next build',
          'start': 'next start'
        }
      };

      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const result = await frameworkService.detectFrameworks(testDir);

      console.log('🎨 Next.js Meta-Framework Detection:');
      console.log('Frameworks:', result.frameworks.map(f => ({ name: f.name, category: f.category })));
      console.log('Project Type:', result.projectType);

      expect(result.frameworks.some(f => f.name === FrameworkType.NEXT_JS)).toBe(true);
      expect(result.frameworks.some(f => f.category === FrameworkCategory.META_FRAMEWORK)).toBe(true);
      expect(result.projectType).toBe('frontend');
    });
  });

  describe('⚙️ Backend Framework Detection', () => {
    it('should detect Express.js backend project', async () => {
      const packageJson = {
        name: 'express-api',
        version: '1.0.0',
        dependencies: {
          'express': '^4.18.0',
          'cors': '^2.8.5',
          'helmet': '^7.0.0',
          'dotenv': '^16.0.0'
        },
        devDependencies: {
          '@types/express': '^4.17.0',
          '@types/cors': '^2.8.0',
          'nodemon': '^3.0.0',
          'typescript': '^5.0.0'
        },
        scripts: {
          'start': 'node dist/index.js',
          'dev': 'nodemon src/index.ts',
          'build': 'tsc'
        }
      };

      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const result = await frameworkService.detectFrameworks(testDir);

      console.log('⚙️ Express Backend Detection:');
      console.log('Frameworks:', result.frameworks.map(f => f.name));
      console.log('Project Type:', result.projectType);
      console.log('Architecture:', result.architecture);
      console.log('Build Tools:', result.buildTools);

      expect(result.frameworks.some(f => f.name === FrameworkType.EXPRESS)).toBe(true);
      expect(result.frameworks.some(f => f.category === FrameworkCategory.BACKEND)).toBe(true);
      expect(result.projectType).toBe('backend');
      expect(result.buildTools.transpiler).toBe('typescript');
    });

    it('should detect NestJS backend framework', async () => {
      const packageJson = {
        name: 'nestjs-api',
        version: '1.0.0',
        dependencies: {
          '@nestjs/core': '^10.0.0',
          '@nestjs/common': '^10.0.0',
          '@nestjs/platform-express': '^10.0.0',
          'reflect-metadata': '^0.1.13',
          'rxjs': '^7.0.0'
        },
        devDependencies: {
          '@nestjs/cli': '^10.0.0',
          '@nestjs/testing': '^10.0.0',
          'typescript': '^5.0.0'
        },
        scripts: {
          'start': 'nest start',
          'start:dev': 'nest start --watch',
          'build': 'nest build'
        }
      };

      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const result = await frameworkService.detectFrameworks(testDir);

      console.log('⚙️ NestJS Backend Detection:');
      console.log('Frameworks:', result.frameworks.map(f => f.name));
      console.log('Project Type:', result.projectType);

      expect(result.frameworks.some(f => f.name === FrameworkType.NEST_JS)).toBe(true);
      expect(result.frameworks.some(f => f.category === FrameworkCategory.BACKEND)).toBe(true);
      expect(result.projectType).toBe('backend');
    });

    it('should detect Fastify backend framework', async () => {
      const packageJson = {
        name: 'fastify-api',
        version: '1.0.0',
        dependencies: {
          'fastify': '^4.24.0',
          '@fastify/cors': '^8.0.0',
          '@fastify/helmet': '^11.0.0'
        },
        devDependencies: {
          '@types/node': '^20.0.0',
          'typescript': '^5.0.0'
        },
        scripts: {
          'start': 'node dist/server.js',
          'dev': 'ts-node src/server.ts',
          'build': 'tsc'
        }
      };

      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const result = await frameworkService.detectFrameworks(testDir);

      console.log('⚙️ Fastify Backend Detection:');
      console.log('Frameworks:', result.frameworks.map(f => f.name));
      console.log('Project Type:', result.projectType);

      expect(result.frameworks.some(f => f.name === FrameworkType.FASTIFY)).toBe(true);
      expect(result.frameworks.some(f => f.category === FrameworkCategory.BACKEND)).toBe(true);
      expect(result.projectType).toBe('backend');
    });
  });

  describe('📱 Mobile Framework Detection', () => {
    it('should detect React Native mobile project', async () => {
      const packageJson = {
        name: 'ReactNativeMobileApp',
        version: '1.0.0',
        dependencies: {
          'react': '^18.2.0',
          'react-native': '^0.72.0',
          '@react-navigation/native': '^6.0.0'
        },
        devDependencies: {
          '@react-native/cli': '^12.0.0',
          '@types/react': '^18.0.0'
        },
        scripts: {
          'android': 'react-native run-android',
          'ios': 'react-native run-ios',
          'start': 'react-native start'
        }
      };

      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const result = await frameworkService.detectFrameworks(testDir);

      console.log('📱 React Native Mobile Detection:');
      console.log('Frameworks:', result.frameworks.map(f => f.name));
      console.log('Project Type:', result.projectType);

      expect(result.frameworks.some(f => f.name === FrameworkType.REACT_NATIVE)).toBe(true);
      expect(result.frameworks.some(f => f.category === FrameworkCategory.MOBILE)).toBe(true);
      expect(result.projectType).toBe('mobile');
    });

    it('should detect Expo mobile project', async () => {
      const packageJson = {
        name: 'expo-mobile-app',
        version: '1.0.0',
        dependencies: {
          'expo': '^49.0.0',
          'react': '^18.2.0',
          'react-native': '^0.72.0'
        },
        devDependencies: {
          '@expo/cli': '^0.10.0'
        },
        scripts: {
          'start': 'expo start',
          'android': 'expo start --android',
          'ios': 'expo start --ios'
        }
      };

      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const result = await frameworkService.detectFrameworks(testDir);

      console.log('📱 Expo Mobile Detection:');
      console.log('Frameworks:', result.frameworks.map(f => f.name));
      console.log('Project Type:', result.projectType);

      expect(result.frameworks.some(f => f.name === FrameworkType.EXPO)).toBe(true);
      expect(result.frameworks.some(f => f.category === FrameworkCategory.MOBILE)).toBe(true);
      expect(result.projectType).toBe('mobile');
    });
  });

  describe('🏗️ Full-Stack Project Detection', () => {
    it('should detect monorepo with frontend and backend', async () => {
      const packageJson = {
        name: 'fullstack-monorepo',
        version: '1.0.0',
        workspaces: ['frontend', 'backend'],
        dependencies: {
          // Frontend deps
          'react': '^18.2.0',
          'react-dom': '^18.2.0',
          // Backend deps  
          'express': '^4.18.0',
          '@nestjs/core': '^10.0.0',
          '@nestjs/common': '^10.0.0'
        },
        devDependencies: {
          '@types/react': '^18.0.0',
          '@types/express': '^4.17.0',
          'typescript': '^5.0.0',
          'vite': '^4.0.0'
        },
        scripts: {
          'dev:frontend': 'cd frontend && npm run dev',
          'dev:backend': 'cd backend && npm run dev',
          'build': 'npm run build:frontend && npm run build:backend'
        }
      };

      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const result = await frameworkService.detectFrameworks(testDir);

      console.log('🏗️ Full-Stack Monorepo Detection:');
      console.log('Frameworks:', result.frameworks.map(f => ({ name: f.name, category: f.category })));
      console.log('Project Type:', result.projectType);
      console.log('Architecture:', result.architecture);

      // Should detect both frontend and backend frameworks
      expect(result.frameworks.some(f => f.category === FrameworkCategory.FRONTEND)).toBe(true);
      expect(result.frameworks.some(f => f.category === FrameworkCategory.BACKEND)).toBe(true);
      expect(result.projectType).toBe('fullstack');
      expect(result.architecture).toBe('monorepo');
    });
  });

  describe('🔧 Build Tools Detection', () => {
    it('should detect various build tools correctly', async () => {
      const packageJson = {
        name: 'build-tools-demo',
        version: '1.0.0',
        dependencies: {
          'react': '^18.2.0'
        },
        devDependencies: {
          // Bundlers
          'webpack': '^5.0.0',
          'vite': '^4.0.0',
          // Transpilers
          'typescript': '^5.0.0',
          '@babel/core': '^7.0.0',
          // Task runners
          'npm-run-all': '^4.0.0'
        },
        scripts: {
          'build:webpack': 'webpack',
          'build:vite': 'vite build',
          'typecheck': 'tsc --noEmit'
        }
      };

      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      const result = await frameworkService.detectFrameworks(testDir);

      console.log('🔧 Build Tools Detection:');
      console.log('Bundler:', result.buildTools.bundler);
      console.log('Transpiler:', result.buildTools.transpiler);
      console.log('Task Runner:', result.buildTools.taskRunner);
      console.log('Package Manager:', result.buildTools.packageManager);

      expect(result.buildTools.bundler).toBeTruthy();
      expect(result.buildTools.transpiler).toBe('typescript');
    });
  });
});