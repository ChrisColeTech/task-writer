"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestFixtures = exports.TEST_ENV = void 0;
exports.cleanTestDirectories = cleanTestDirectories;
exports.createTestDirectory = createTestDirectory;
exports.setupTest = setupTest;
exports.cleanupTest = cleanupTest;
exports.isolatedTest = isolatedTest;
exports.createMockFs = createMockFs;
exports.createMockExpressObjects = createMockExpressObjects;
const path_1 = require("path");
const fs_1 = require("fs");
const os_1 = require("os");
const TEST_TEMP_DIR = (0, path_1.join)((0, os_1.tmpdir)(), '.task-writer-test-' + process.pid + '-' + Date.now());
exports.TEST_ENV = {
    ...process.env,
    TASK_WRITER_TEMP_DIR: TEST_TEMP_DIR
};
function cleanTestDirectories() {
    try {
        if ((0, fs_1.existsSync)(TEST_TEMP_DIR)) {
            (0, fs_1.rmSync)(TEST_TEMP_DIR, { recursive: true, force: true });
        }
        const testDirs = [
            (0, path_1.join)(__dirname, '../test-routes-scaffold-generator'),
            (0, path_1.join)(__dirname, '../test-routes-task-generation'),
            (0, path_1.join)(__dirname, '../test-routes-file-analysis'),
            (0, path_1.join)(__dirname, '../test-routes-framework-detection'),
            (0, path_1.join)(__dirname, '../test-routes-export'),
            (0, path_1.join)(__dirname, '../test-temp-files')
        ];
        for (const dir of testDirs) {
            if ((0, fs_1.existsSync)(dir)) {
                (0, fs_1.rmSync)(dir, { recursive: true, force: true });
            }
        }
    }
    catch (error) {
    }
}
function createTestDirectory(name) {
    const tempDir = (0, fs_1.mkdtempSync)((0, path_1.join)(TEST_TEMP_DIR, name + '-'));
    (0, fs_1.mkdirSync)(tempDir, { recursive: true });
    return tempDir;
}
class TestFixtures {
    static FIXTURES_DIR = (0, path_1.join)(__dirname, 'files');
    static getFixturePath(category, filename) {
        return (0, path_1.join)(this.FIXTURES_DIR, category, filename);
    }
    static copyFixtureToTemp(category, filename, tempDir) {
        const sourcePath = this.getFixturePath(category, filename);
        const destPath = (0, path_1.join)(tempDir, filename);
        if (!(0, fs_1.existsSync)(sourcePath)) {
            throw new Error(`Fixture file not found: ${sourcePath}`);
        }
        (0, fs_1.mkdirSync)((0, path_1.join)(tempDir), { recursive: true });
        const fs = require('fs');
        const content = fs.readFileSync(sourcePath);
        fs.writeFileSync(destPath, content);
        return destPath;
    }
    static createTestProjectStructure(tempDir) {
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
        for (const [filePath, content] of Object.entries(projectStructure)) {
            const fullPath = (0, path_1.join)(tempDir, filePath);
            (0, fs_1.mkdirSync)((0, path_1.join)(fullPath, '..'), { recursive: true });
            (0, fs_1.writeFileSync)(fullPath, content.trim());
        }
    }
    static createMalformedFiles(tempDir) {
        const malformedFiles = {
            'malformed.json': '{ "name": "test", invalid json }',
            'empty.js': '',
            'binary.exe': Buffer.from([0x00, 0x01, 0x02, 0x03]),
            'very-long-filename-that-exceeds-normal-limits-and-might-cause-issues-in-file-systems.txt': 'content'
        };
        for (const [filename, content] of Object.entries(malformedFiles)) {
            const fullPath = (0, path_1.join)(tempDir, filename);
            if (content instanceof Buffer) {
                require('fs').writeFileSync(fullPath, content);
            }
            else {
                (0, fs_1.writeFileSync)(fullPath, content);
            }
        }
    }
}
exports.TestFixtures = TestFixtures;
function setupTest() {
    cleanTestDirectories();
    (0, fs_1.mkdirSync)(TEST_TEMP_DIR, { recursive: true });
}
function cleanupTest() {
    cleanTestDirectories();
}
function isolatedTest(testFn) {
    return async () => {
        setupTest();
        try {
            await testFn();
        }
        finally {
            cleanupTest();
        }
    };
}
function createMockFs(mockFiles = {}) {
    return {
        readFile: jest.fn((path) => {
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
        stat: jest.fn((path) => {
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
        access: jest.fn((path) => {
            if (mockFiles[path] !== undefined) {
                return Promise.resolve();
            }
            return Promise.reject(new Error(`File not accessible: ${path}`));
        })
    };
}
function createMockExpressObjects() {
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
//# sourceMappingURL=test-isolation.js.map