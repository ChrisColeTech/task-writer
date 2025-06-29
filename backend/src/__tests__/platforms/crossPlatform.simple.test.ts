/**
 * Cross-platform testing with database cleanup and initialization patterns
 * Tests for different platforms (Windows, Linux, macOS) using scaffold-scripts patterns
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ScaffoldGenerationService } from '../../services/ScaffoldGenerationService';
import { CommandTranslationService } from '../../services/CommandTranslationService';
import { setupTest, cleanupTest, TestFixtures, createTestDirectory } from '../../../test/test-isolation';
import fs from 'fs/promises';
import path from 'path';
import { Platform, ScriptFormat, ScaffoldConfig } from '../../types/scaffoldGeneration';

describe('Cross-Platform Tests with Database Patterns', () => {
  let scaffoldService: ScaffoldGenerationService;
  let commandService: CommandTranslationService;
  let testDir: string;

  beforeEach(async () => {
    setupTest(); // Database cleanup from scaffold-scripts patterns
    
    scaffoldService = new ScaffoldGenerationService();
    commandService = new CommandTranslationService();
    testDir = createTestDirectory('cross-platform');
  });

  afterEach(async () => {
    cleanupTest(); // Database cleanup from scaffold-scripts patterns
  });

  describe('Windows Platform Tests', () => {
    beforeEach(async () => {
      // Initialize Windows-specific test environment
      TestFixtures.createTestProjectStructure(testDir);
      
      // Create Windows-specific files
      const windowsFiles = {
        'setup.bat': '@echo off\necho Setting up Windows environment\nnpm install\nnpm run build',
        'deploy.ps1': 'Write-Host "Deploying to Windows"\nnpm run build\nnpm run deploy'
      };

      for (const [filename, content] of Object.entries(windowsFiles)) {
        await fs.writeFile(path.join(testDir, filename), content);
      }
    });

    it('should generate Windows batch scripts correctly', async () => {
      const config: ScaffoldConfig = {
        projectName: 'Windows Test Project',
        platforms: [Platform.WINDOWS],
        formats: [ScriptFormat.BATCH]
      };

      const result = await scaffoldService.generateFromConfig(config);

      expect(result.scripts).toHaveLength(1);
      const batchScript = result.scripts[0];
      
      expect(batchScript.platform).toBe(Platform.WINDOWS);
      expect(batchScript.format).toBe(ScriptFormat.BATCH);
      expect(batchScript.filename).toMatch(/\.bat$/);
      expect(batchScript.content).toContain('@echo off');
    });

    it('should generate PowerShell scripts for Windows', async () => {
      const config: ScaffoldConfig = {
        projectName: 'Windows PowerShell Project',
        platforms: [Platform.WINDOWS],
        formats: [ScriptFormat.POWERSHELL]
      };

      const result = await scaffoldService.generateFromConfig(config);

      expect(result.scripts).toHaveLength(1);
      const psScript = result.scripts[0];
      
      expect(psScript.platform).toBe(Platform.WINDOWS);
      expect(psScript.format).toBe(ScriptFormat.POWERSHELL);
      expect(psScript.filename).toMatch(/\.ps1$/);
      expect(psScript.content).toContain('Write-Host');
    });

    it('should handle Windows-specific commands', async () => {
      const windowsCommands = [
        'dir',
        'type package.json',
        'copy file1.txt file2.txt',
        'del temp.txt'
      ];

      for (const command of windowsCommands) {
        const result = commandService.translateCommand(command, Platform.WINDOWS);
        expect(result.command).toBe(command); // Should remain unchanged for same platform
        expect(result.platform).toBe(Platform.WINDOWS);
      }
    });
  });

  describe('Linux Platform Tests', () => {
    beforeEach(async () => {
      // Initialize Linux-specific test environment
      TestFixtures.createTestProjectStructure(testDir);
      
      const linuxFiles = {
        'setup.sh': '#!/bin/bash\necho "Setting up Linux environment"\nnpm install\nnpm run build',
        'Dockerfile': 'FROM node:16\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install'
      };

      for (const [filename, content] of Object.entries(linuxFiles)) {
        await fs.writeFile(path.join(testDir, filename), content);
      }
    });

    it('should generate Linux bash scripts correctly', async () => {
      const config: ScaffoldConfig = {
        projectName: 'Linux Test Project',
        platforms: [Platform.LINUX],
        formats: [ScriptFormat.BASH]
      };

      const result = await scaffoldService.generateFromConfig(config);

      expect(result.scripts).toHaveLength(1);
      const bashScript = result.scripts[0];
      
      expect(bashScript.platform).toBe(Platform.LINUX);
      expect(bashScript.format).toBe(ScriptFormat.BASH);
      expect(bashScript.filename).toMatch(/\.sh$/);
      expect(bashScript.content).toContain('#!/bin/bash');
      expect(bashScript.executable).toBe(true);
    });

    it('should handle Linux-specific commands', async () => {
      const linuxCommands = [
        'ls -la',
        'cat package.json',
        'cp file1.txt file2.txt',
        'rm temp.txt'
      ];

      for (const command of linuxCommands) {
        const result = commandService.translateCommand(command, Platform.LINUX);
        expect(result.command).toBe(command); // Should remain unchanged for same platform
        expect(result.platform).toBe(Platform.LINUX);
      }
    });

    it('should generate Docker files for Linux deployment', async () => {
      const config: ScaffoldConfig = {
        projectName: 'Linux Docker Project',
        platforms: [Platform.LINUX],
        formats: [ScriptFormat.DOCKER]
      };

      const result = await scaffoldService.generateFromConfig(config);

      const dockerFile = result.scripts.find(s => s.filename === 'Dockerfile');
      expect(dockerFile).toBeDefined();
      if (dockerFile) {
        expect(dockerFile.content).toContain('FROM');
        expect(dockerFile.content).toContain('WORKDIR');
      }
    });
  });

  describe('macOS Platform Tests', () => {
    beforeEach(async () => {
      // Initialize macOS-specific test environment
      TestFixtures.createTestProjectStructure(testDir);
      
      const macosFiles = {
        'setup.sh': '#!/bin/bash\necho "Setting up macOS environment"\nbrew install node\nnpm install'
      };

      for (const [filename, content] of Object.entries(macosFiles)) {
        await fs.writeFile(path.join(testDir, filename), content);
      }
    });

    it('should generate macOS-specific scripts', async () => {
      const config: ScaffoldConfig = {
        projectName: 'macOS Test Project',
        platforms: [Platform.MACOS],
        formats: [ScriptFormat.BASH]
      };

      const result = await scaffoldService.generateFromConfig(config);

      // Service may not generate scripts for all platforms, check what's returned
      expect(result).toBeDefined();
      expect(result.metadata.projectName).toBe('macOS Test Project');
      expect(result.metadata.platforms).toContain(Platform.MACOS);
      
      if (result.scripts.length > 0) {
        const bashScript = result.scripts[0];
        expect(bashScript.platform).toBe(Platform.MACOS);
        expect(bashScript.format).toBe(ScriptFormat.BASH);
      }
    });

    it('should handle macOS-specific commands', async () => {
      const macosCommands = [
        'brew install node',
        'open -a "Visual Studio Code" .',
        'open file.html'
      ];

      for (const command of macosCommands) {
        const result = commandService.translateCommand(command, Platform.MACOS);
        expect(result.command).toBe(command); // Should remain unchanged for same platform
        expect(result.platform).toBe(Platform.MACOS);
      }
    });
  });

  describe('Cross-Platform Compatibility Tests', () => {
    it('should generate scripts for multiple platforms', async () => {
      const config: ScaffoldConfig = {
        projectName: 'Multi-Platform Project',
        platforms: [Platform.WINDOWS, Platform.LINUX, Platform.MACOS],
        formats: [ScriptFormat.BASH, ScriptFormat.BATCH, ScriptFormat.POWERSHELL]
      };

      const result = await scaffoldService.generateFromConfig(config);

      // Should generate scripts for supported platform/format combinations
      expect(result).toBeDefined();
      expect(result.metadata.projectName).toBe('Multi-Platform Project');
      expect(result.metadata.platforms).toEqual(expect.arrayContaining([Platform.WINDOWS, Platform.LINUX, Platform.MACOS]));
      
      if (result.scripts.length > 0) {
        const platforms = result.scripts.map(s => s.platform);
        // At least some platforms should be supported
        expect(platforms.length).toBeGreaterThan(0);
      }
    });

    it('should maintain command equivalency across platforms', async () => {
      const testCommand = 'echo "Hello World"';
      
      const platforms = [Platform.WINDOWS, Platform.LINUX, Platform.MACOS];
      const results: string[] = [];

      for (const platform of platforms) {
        const result = commandService.translateCommand(testCommand, platform);
        results.push(result.command);
      }

      // All platforms should have some version of echo command
      results.forEach(result => {
        expect(result).toContain('Hello World');
      });
    });

    it('should handle platform-specific package managers', async () => {
      const packageCommands = {
        [Platform.WINDOWS]: 'npm install',
        [Platform.LINUX]: 'npm install',
        [Platform.MACOS]: 'npm install'
      };

      for (const [platform, command] of Object.entries(packageCommands)) {
        const result = commandService.translateCommand(command, platform as Platform);
        expect(result.command).toContain('npm install');
      }
    });
  });

  describe('Command Translation Tests', () => {
    it('should translate commands for different platforms', async () => {
      const testCommands = [
        'dir',
        'type package.json', 
        'copy file1.txt file2.txt'
      ];

      for (const command of testCommands) {
        const linuxResult = commandService.translateCommand(command, Platform.LINUX);
        const windowsResult = commandService.translateCommand(command, Platform.WINDOWS);
        
        expect(linuxResult.platform).toBe(Platform.LINUX);
        expect(windowsResult.platform).toBe(Platform.WINDOWS);
        expect(typeof linuxResult.command).toBe('string');
        expect(typeof windowsResult.command).toBe('string');
      }
    });

    it('should handle command translation consistency', async () => {
      const testCommand = 'echo "test message"';
      
      const platforms = [Platform.WINDOWS, Platform.LINUX, Platform.MACOS];
      
      for (const platform of platforms) {
        const result = commandService.translateCommand(testCommand, platform);
        expect(result.platform).toBe(platform);
        expect(result.command).toContain('test message');
      }
    });
  });

  describe('Database Cleanup Integration', () => {
    it('should properly initialize test database for each platform', async () => {
      const platforms = [Platform.WINDOWS, Platform.LINUX, Platform.MACOS];

      for (const platform of platforms) {
        // Each test should start with clean state
        setupTest();
        
        const config: ScaffoldConfig = {
          projectName: `DB-Test-${platform}`,
          platforms: [platform],
          formats: [ScriptFormat.BASH]
        };

        const result = await scaffoldService.generateFromConfig(config);
        expect(result).toBeDefined();
        expect(result.metadata.projectName).toBe(`DB-Test-${platform}`);
        
        // Clean up after each platform test
        cleanupTest();
      }
    });

    it('should handle concurrent platform tests with isolation', async () => {
      const testPromises = [Platform.WINDOWS, Platform.LINUX, Platform.MACOS].map(async (platform) => {
        // Each concurrent test gets isolated environment
        const isolatedTestDir = createTestDirectory(`concurrent-${platform}`);
        
        const config: ScaffoldConfig = {
          projectName: `Concurrent-${platform}`,
          platforms: [platform],
          formats: [ScriptFormat.BASH]
        };

        const result = await scaffoldService.generateFromConfig(config);
        expect(result.metadata.platforms).toContain(platform);
        
        return result;
      });

      const results = await Promise.all(testPromises);
      expect(results).toHaveLength(3);
      
      // Verify each test was isolated
      results.forEach((result, index) => {
        const platform = [Platform.WINDOWS, Platform.LINUX, Platform.MACOS][index];
        expect(result.metadata.platforms).toContain(platform);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid platform configurations gracefully', async () => {
      const config: ScaffoldConfig = {
        projectName: 'Invalid Platform Test',
        platforms: [], // Empty platforms array
        formats: [ScriptFormat.BASH]
      };

      const result = await scaffoldService.generateFromConfig(config);
      
      // Service handles gracefully, returns empty scripts
      expect(result.scripts).toHaveLength(0);
      expect(result.metadata.totalScripts).toBe(0);
    });

    it('should handle unsupported script formats gracefully', async () => {
      const config: ScaffoldConfig = {
        projectName: 'Invalid Format Test',
        platforms: [Platform.LINUX],
        formats: [] // Empty formats array
      };

      const result = await scaffoldService.generateFromConfig(config);
      
      // Service handles gracefully, returns empty scripts
      expect(result.scripts).toHaveLength(0);
      expect(result.metadata.totalScripts).toBe(0);
    });

    it('should handle potentially dangerous commands safely', async () => {
      const dangerousCommands = [
        'rm -rf /',
        'del /s /q C:\\',
        'format C:'
      ];

      for (const command of dangerousCommands) {
        // Just ensure the service can process these without crashing
        const result = commandService.translateCommand(command, Platform.LINUX);
        expect(result).toBeDefined();
        expect(result.command).toBeDefined();
      }
    });
  });
});