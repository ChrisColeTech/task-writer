/**
 * Simplified file type validation tests
 * Tests valid and invalid file types across different frameworks
 * Uses database cleanup patterns from scaffold-scripts
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { FileAnalysisService } from '../../services/FileAnalysisService';
import { setupTest, cleanupTest, TestFixtures, createTestDirectory } from '../../../test/test-isolation';
import fs from 'fs/promises';
import path from 'path';
import { FileType } from '../../types/fileAnalysis';

describe('File Type Validation Tests', () => {
  let fileAnalysisService: FileAnalysisService;
  let testDir: string;

  beforeEach(async () => {
    setupTest();
    
    fileAnalysisService = new FileAnalysisService();
    testDir = createTestDirectory('file-types-validation');
  });

  afterEach(async () => {
    cleanupTest();
  });

  describe('Valid JavaScript Files', () => {
    it('should analyze React component files (.jsx)', async () => {
      const componentContent = `
import React from 'react';

export const MyComponent = () => {
  return <div>Hello World</div>;
};
      `;
      const componentFile = path.join(testDir, 'MyComponent.jsx');
      await fs.writeFile(componentFile, componentContent);

      const result = await fileAnalysisService.analyzeFile(componentFile);
      
      expect(result.metadata.type).toBe(FileType.CODE);
      expect(result.metadata.language).toBe('javascript');
      expect(result.content.raw).toContain('React');
    });

    it('should analyze TypeScript files (.ts)', async () => {
      const tsContent = `
interface User {
  id: string;
  name: string;
}

export class UserService {
  getUser(id: string): User | null {
    return null;
  }
}
      `;
      const tsFile = path.join(testDir, 'UserService.ts');
      await fs.writeFile(tsFile, tsContent);

      const result = await fileAnalysisService.analyzeFile(tsFile);
      
      expect(result.metadata.type).toBe(FileType.CODE);
      expect(result.metadata.language).toBe('typescript');
      expect(result.content.raw).toContain('interface');
    });

    it('should analyze Python files (.py)', async () => {
      const pythonContent = `
class UserService:
    def get_user(self, user_id):
        return None

if __name__ == "__main__":
    service = UserService()
      `;
      const pythonFile = path.join(testDir, 'user_service.py');
      await fs.writeFile(pythonFile, pythonContent);

      const result = await fileAnalysisService.analyzeFile(pythonFile);
      
      expect(result.metadata.type).toBe(FileType.CODE);
      expect(result.metadata.language).toBe('python');
      expect(result.content.raw).toContain('class');
    });
  });

  describe('Configuration Files', () => {
    it('should analyze package.json files', async () => {
      const packageJson = {
        name: 'test-package',
        version: '1.0.0',
        dependencies: {
          'react': '^18.0.0'
        }
      };
      const packageFile = path.join(testDir, 'package.json');
      await fs.writeFile(packageFile, JSON.stringify(packageJson, null, 2));

      const result = await fileAnalysisService.analyzeFile(packageFile);
      
      expect(result.metadata.type).toBe(FileType.CONFIG);
      expect(result.metadata.language).toBe('json');
      expect(result.content.raw).toContain('test-package');
    });

    it('should analyze TypeScript config files', async () => {
      const tsConfig = {
        compilerOptions: {
          target: 'es5',
          module: 'commonjs',
          strict: true
        }
      };
      const tsConfigFile = path.join(testDir, 'tsconfig.json');
      await fs.writeFile(tsConfigFile, JSON.stringify(tsConfig, null, 2));

      const result = await fileAnalysisService.analyzeFile(tsConfigFile);
      
      expect(result.metadata.type).toBe(FileType.CONFIG);
      expect(result.metadata.language).toBe('json');
      expect(result.content.raw).toContain('compilerOptions');
    });

    it('should analyze YAML configuration files', async () => {
      const yamlContent = `
name: test-project
version: 1.0.0
scripts:
  build: npm run build
  test: npm test
      `;
      const yamlFile = path.join(testDir, 'config.yml');
      await fs.writeFile(yamlFile, yamlContent);

      const result = await fileAnalysisService.analyzeFile(yamlFile);
      
      expect(result.metadata.type).toBe(FileType.CONFIG);
      expect(result.metadata.language).toBe('yaml');
      expect(result.content.raw).toContain('test-project');
    });
  });

  describe('Documentation Files', () => {
    it('should analyze Markdown files', async () => {
      const markdownContent = `
# Test Project

This is a test project with the following features:

- Feature 1
- Feature 2

## Installation

\`\`\`bash
npm install
\`\`\`
      `;
      const markdownFile = path.join(testDir, 'README.md');
      await fs.writeFile(markdownFile, markdownContent);

      const result = await fileAnalysisService.analyzeFile(markdownFile);
      
      expect(result.metadata.type).toBe(FileType.DOCUMENTATION);
      expect(result.metadata.language).toBe('markdown');
      expect(result.content.raw).toContain('# Test Project');
    });

    it('should analyze text files', async () => {
      const textContent = `
This is a plain text file.
It contains documentation for the project.
      `;
      const textFile = path.join(testDir, 'notes.txt');
      await fs.writeFile(textFile, textContent);

      const result = await fileAnalysisService.analyzeFile(textFile);
      
      expect(result.metadata.type).toBe(FileType.DOCUMENTATION);
      expect(result.metadata.language).toBeNull();
      expect(result.content.raw).toContain('plain text');
    });
  });

  describe('Script Files', () => {
    it('should analyze shell scripts', async () => {
      const bashContent = `
#!/bin/bash
echo "Setting up project"
npm install
npm run build
      `;
      const bashFile = path.join(testDir, 'setup.sh');
      await fs.writeFile(bashFile, bashContent);

      const result = await fileAnalysisService.analyzeFile(bashFile);
      
      expect(result.metadata.type).toBe(FileType.SCRIPT);
      expect(result.metadata.language).toBe('bash');
      expect(result.content.raw).toContain('#!/bin/bash');
    });

    it('should analyze PowerShell scripts', async () => {
      const powershellContent = `
Write-Host "Setting up Windows project"
npm install
npm run build
      `;
      const powershellFile = path.join(testDir, 'setup.ps1');
      await fs.writeFile(powershellFile, powershellContent);

      const result = await fileAnalysisService.analyzeFile(powershellFile);
      
      expect(result.metadata.type).toBe(FileType.SCRIPT);
      expect(result.metadata.language).toBe('powershell');
      expect(result.content.raw).toContain('Write-Host');
    });
  });

  describe('Invalid File Types', () => {
    it('should reject binary executable files', async () => {
      const executableFile = path.join(testDir, 'app.exe');
      await fs.writeFile(executableFile, Buffer.from([0x4D, 0x5A, 0x90, 0x00])); // PE header

      await expect(
        fileAnalysisService.analyzeFile(executableFile)
      ).rejects.toThrow();
    });

    it('should handle malformed JSON gracefully', async () => {
      const malformedJson = path.join(testDir, 'malformed.json');
      await fs.writeFile(malformedJson, '{ "name": "test", invalid json }');

      // Should not throw, but may return with error info
      const result = await fileAnalysisService.analyzeFile(malformedJson);
      expect(result.metadata.type).toBe(FileType.CONFIG);
      expect(result.metadata.language).toBe('json');
    });

    it('should handle empty files', async () => {
      const emptyFile = path.join(testDir, 'empty.js');
      await fs.writeFile(emptyFile, '');

      const result = await fileAnalysisService.analyzeFile(emptyFile);
      
      expect(result.metadata.type).toBe(FileType.CODE);
      expect(result.content.isEmpty).toBe(true);
      expect(result.content.characters).toBe(0);
    });

    it('should handle unknown file extensions', async () => {
      const unknownFile = path.join(testDir, 'test.unknown');
      await fs.writeFile(unknownFile, 'Some content');

      const result = await fileAnalysisService.analyzeFile(unknownFile);
      
      expect(result.metadata.type).toBe(FileType.UNKNOWN);
      expect(result.metadata.language).toBeNull();
    });
  });

  describe('Framework Detection Integration', () => {
    it('should detect React-specific patterns', async () => {
      // Create React project structure
      const packageJson = {
        name: 'react-app',
        dependencies: { 'react': '^18.0.0' }
      };
      await fs.writeFile(
        path.join(testDir, 'package.json'), 
        JSON.stringify(packageJson, null, 2)
      );

      const reactComponent = `
import React from 'react';

const App = () => {
  return <div>React App</div>;
};

export default App;
      `;
      const componentFile = path.join(testDir, 'App.jsx');
      await fs.writeFile(componentFile, reactComponent);

      const result = await fileAnalysisService.analyzeFile(componentFile);
      
      expect(result.metadata.type).toBe(FileType.CODE);
      expect(result.metadata.language).toBe('javascript');
      expect(result.content.raw).toContain('React');
      expect(result.structure.imports).toContain('react');
    });

    it('should detect Vue-specific patterns', async () => {
      const vueComponent = `
<template>
  <div class="hello">Vue Component</div>
</template>

<script>
export default {
  name: 'HelloWorld'
}
</script>
      `;
      const vueFile = path.join(testDir, 'HelloWorld.vue');
      await fs.writeFile(vueFile, vueComponent);

      const result = await fileAnalysisService.analyzeFile(vueFile);
      
      expect(result.metadata.type).toBe(FileType.CODE);
      expect(result.metadata.language).toBe('vue');
      expect(result.content.raw).toContain('<template>');
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent files', async () => {
      const nonExistentFile = path.join(testDir, 'does-not-exist.txt');

      await expect(
        fileAnalysisService.analyzeFile(nonExistentFile)
      ).rejects.toThrow();
    });

    it('should handle permission errors gracefully', async () => {
      const protectedFile = path.join(testDir, 'protected.txt');
      await fs.writeFile(protectedFile, 'protected content');
      
      try {
        await fs.chmod(protectedFile, 0o000); // Remove all permissions
        
        await expect(
          fileAnalysisService.analyzeFile(protectedFile)
        ).rejects.toThrow();
      } finally {
        // Restore permissions for cleanup
        await fs.chmod(protectedFile, 0o644);
      }
    });
  });
});