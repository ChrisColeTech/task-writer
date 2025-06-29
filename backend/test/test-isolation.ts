/**
 * Test isolation utilities for task-writer tests
 * Ensures each test runs with clean database state and proper setup/teardown
 * Based on patterns from scaffold-scripts project
 */

import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync, rmSync, mkdirSync, writeFileSync, mkdtempSync } from 'fs';
import { tmpdir } from 'os';

// Use a unique test directory path to avoid conflicts
const TEST_TEMP_DIR = join(tmpdir(), '.task-writer-test-' + process.pid + '-' + Date.now());

// Export the test environment for use in tests
export const TEST_ENV = { 
  ...process.env, 
  TASK_WRITER_TEMP_DIR: TEST_TEMP_DIR 
};

/**
 * Clean the test directories completely
 */
export function cleanTestDirectories(): void {
  try {
    // Clean the test-specific temp directory
    if (existsSync(TEST_TEMP_DIR)) {
      rmSync(TEST_TEMP_DIR, { recursive: true, force: true });
    }
    
    // Clean any other test directories that might exist
    const testDirs = [
      join(__dirname, '../test-routes-scaffold-generator'),
      join(__dirname, '../test-routes-task-generation'),
      join(__dirname, '../test-routes-file-analysis'),
      join(__dirname, '../test-routes-framework-detection'),
      join(__dirname, '../test-routes-export'),
      join(__dirname, '../test-temp-files')
    ];
    
    for (const dir of testDirs) {
      if (existsSync(dir)) {
        rmSync(dir, { recursive: true, force: true });
      }
    }
  } catch (error) {
    // Ignore cleanup errors
  }
}

/**
 * Create a temporary test directory with proper isolation
 */
export function createTestDirectory(name: string): string {
  const tempDir = mkdtempSync(join(TEST_TEMP_DIR, name + '-'));
  mkdirSync(tempDir, { recursive: true });
  return tempDir;
}

/**
 * Create test fixture files for various test scenarios
 */
export class TestFixtures {
  private static FIXTURES_DIR = join(__dirname, 'files');
  
  static getFixturePath(category: 'valid' | 'invalid', filename: string): string {
    return join(this.FIXTURES_DIR, category, filename);
  }
  
  static copyFixtureToTemp(category: 'valid' | 'invalid', filename: string, tempDir: string): string {
    const sourcePath = this.getFixturePath(category, filename);
    const destPath = join(tempDir, filename);
    
    if (!existsSync(sourcePath)) {
      throw new Error(`Fixture file not found: ${sourcePath}`);
    }
    
    // Ensure destination directory exists
    mkdirSync(join(tempDir), { recursive: true });
    
    // Read and write file to ensure proper copying
    const fs = require('fs');
    const content = fs.readFileSync(sourcePath);
    fs.writeFileSync(destPath, content);
    
    return destPath;
  }
  
  static createTestProjectStructure(tempDir: string): void {
    // Create a realistic project structure for testing
    const projectStructure = {
      'package.json': JSON.stringify({
        name: 'test-project',
        version: '1.0.0',
        dependencies: {
          'react': '^18.0.0',
          'express': '^4.18.0'
        },
        scripts: {
          'test': 'jest',
          'build': 'webpack'
        }
      }, null, 2),
      
      'src/index.ts': `
import express from 'express';
import { UserService } from './services/UserService';

const app = express();

// TODO: Add proper error handling
// FIXME: Implement authentication middleware

app.listen(3000);
export default app;
      `,
      
      'src/services/UserService.ts': `
export interface User {
  id: string;
  name: string;
  email: string;
}

export class UserService {
  // TODO: Connect to database
  async getUser(id: string): Promise<User | null> {
    return null;
  }
  
  // FIXME: Add validation
  async createUser(userData: Partial<User>): Promise<User> {
    throw new Error('Not implemented');
  }
}
      `,
      
      'src/components/Button.tsx': `
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

// TODO: Add accessibility features
export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary' }) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
      `,
      
      'README.md': `
# Test Project

This is a test project for the task-writer application.

## TODO
- [ ] Add comprehensive tests
- [ ] Implement user authentication
- [ ] Add database integration

## FIXME
- Fix error handling in API routes
- Update deprecated dependencies
      `,
      
      '.gitignore': `
node_modules/
dist/
.env
*.log
      `,
      
      'webpack.config.js': `
module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
};
      `
    };
    
    // Create all files and directories
    for (const [filePath, content] of Object.entries(projectStructure)) {
      const fullPath = join(tempDir, filePath);
      mkdirSync(join(fullPath, '..'), { recursive: true });
      writeFileSync(fullPath, content.trim());
    }
  }
  
  static createMalformedFiles(tempDir: string): void {
    // Create files with various issues for error testing
    const malformedFiles = {
      'malformed.json': '{ "name": "test", invalid json }',
      'empty.js': '',
      'binary.exe': Buffer.from([0x00, 0x01, 0x02, 0x03]),
      'very-long-filename-that-exceeds-normal-limits-and-might-cause-issues-in-file-systems.txt': 'content'
    };
    
    for (const [filename, content] of Object.entries(malformedFiles)) {
      const fullPath = join(tempDir, filename);
      if (content instanceof Buffer) {
        require('fs').writeFileSync(fullPath, content);
      } else {
        writeFileSync(fullPath, content);
      }
    }
  }
}

/**
 * Setup for each test - ensures clean state
 */
export function setupTest(): void {
  cleanTestDirectories();
  // Ensure TEST_TEMP_DIR exists
  mkdirSync(TEST_TEMP_DIR, { recursive: true });
}

/**
 * Cleanup after each test - ensures no leftovers
 */
export function cleanupTest(): void {
  cleanTestDirectories();
}

/**
 * Complete test isolation - run a test function with guaranteed clean state
 */
export function isolatedTest(testFn: () => void | Promise<void>): () => Promise<void> {
  return async () => {
    setupTest();
    try {
      await testFn();
    } finally {
      cleanupTest();
    }
  };
}

/**
 * Mock implementation for fs.promises that can be used in tests
 */
export function createMockFs(mockFiles: Record<string, string | Error> = {}) {
  return {
    readFile: jest.fn((path: string) => {
      const content = mockFiles[path];
      if (content instanceof Error) {
        return Promise.reject(content);
      }
      if (content !== undefined) {
        return Promise.resolve(Buffer.from(content));
      }
      return Promise.reject(new Error(`File not found: ${path}`));
    }),
    
    writeFile: jest.fn(() => Promise.resolve()),
    
    mkdir: jest.fn(() => Promise.resolve()),
    
    chmod: jest.fn(() => Promise.resolve()),
    
    stat: jest.fn((path: string) => {
      if (mockFiles[path] !== undefined) {
        return Promise.resolve({
          isFile: () => true,
          isDirectory: () => false,
          size: typeof mockFiles[path] === 'string' ? mockFiles[path].length : 0,
          mtime: new Date()
        });
      }
      return Promise.reject(new Error(`File not found: ${path}`));
    }),
    
    access: jest.fn((path: string) => {
      if (mockFiles[path] !== undefined) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(`File not accessible: ${path}`));
    })
  };
}

/**
 * Helper to create mock request/response objects for route testing
 */
export function createMockExpressObjects() {
  const req = {
    body: {},
    params: {},
    query: {},
    headers: {},
    method: 'GET',
    url: '/',
    path: '/'
  };
  
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    header: jest.fn().mockReturnThis()
  };
  
  const next = jest.fn();
  
  return { req, res, next };
}