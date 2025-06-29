import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FileAnalysisService } from '../../services/FileAnalysisService';
import {
  FileType,
  FileAnalysisError,
  FileTooLargeError,
  BinaryFileError,
  FilePermissionError
} from '../../types/fileAnalysis';

// Mock fs module
jest.mock('fs/promises');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('FileAnalysisService', () => {
  let service: FileAnalysisService;

  beforeEach(() => {
    service = new FileAnalysisService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('analyzeFile', () => {
    it('should analyze a JavaScript file successfully', async () => {
      const filePath = '/test/component.js';
      const fileContent = `
import React from 'react';
import { useState } from 'react';

export const Component = () => {
  const [count, setCount] = useState(0);
  
  // TODO: Add prop validation
  function handleClick() {
    setCount(count + 1);
  }
  
  return <div onClick={handleClick}>{count}</div>;
};

export default Component;
      `.trim();

      // Mock file system calls
      mockFs.stat.mockResolvedValue({
        size: fileContent.length,
        mtime: new Date('2024-01-15T10:30:00.000Z'),
        birthtime: new Date('2024-01-15T10:00:00.000Z'),
        mode: 0o644
      } as any);

      mockFs.readFile.mockResolvedValue(Buffer.from(fileContent));

      const result = await service.analyzeFile(filePath);

      expect(result).toMatchObject({
        path: filePath,
        metadata: {
          type: FileType.CODE,
          language: 'javascript',
          encoding: 'utf8'
        },
        content: {
          raw: fileContent,
          isEmpty: false,
          isBinary: false
        },
        structure: {
          imports: expect.arrayContaining(['react']),
          exports: expect.arrayContaining(['Component', 'default']),
          functions: expect.arrayContaining(['handleClick']),
          comments: {
            todos: expect.arrayContaining([expect.stringContaining('TODO: Add prop validation')])
          }
        }
      });
    });

    it('should analyze a TypeScript file with classes', async () => {
      const filePath = '/test/service.ts';
      const fileContent = `
export interface UserService {
  getUser(id: string): Promise<User>;
}

export class ApiUserService implements UserService {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async getUser(id: string): Promise<User> {
    // FIXME: Add error handling
    const response = await fetch(\`\${this.baseUrl}/users/\${id}\`);
    return response.json();
  }
}
      `.trim();

      mockFs.stat.mockResolvedValue({
        size: fileContent.length,
        mtime: new Date(),
        birthtime: new Date(),
        mode: 0o644
      } as any);

      mockFs.readFile.mockResolvedValue(Buffer.from(fileContent));

      const result = await service.analyzeFile(filePath);

      expect(result.metadata.language).toBe('typescript');
      expect(result.structure.classes).toContain('ApiUserService');
      expect(result.structure.functions).toContain('getUser');
      expect(result.structure.exports).toContain('ApiUserService');
      expect(result.structure.comments.fixmes).toHaveLength(1);
    });

    it('should analyze a Python file', async () => {
      const filePath = '/test/module.py';
      const fileContent = `
import os
from typing import List
import requests

class DataProcessor:
    def __init__(self, config):
        self.config = config
    
    def process_data(self, data: List[str]) -> List[str]:
        """Process the input data."""
        # TODO: Implement actual processing
        return [item.upper() for item in data]

def helper_function():
    pass
      `.trim();

      mockFs.stat.mockResolvedValue({
        size: fileContent.length,
        mtime: new Date(),
        birthtime: new Date(),
        mode: 0o644
      } as any);

      mockFs.readFile.mockResolvedValue(Buffer.from(fileContent));

      const result = await service.analyzeFile(filePath);

      expect(result.metadata.language).toBe('python');
      expect(result.structure.imports).toEqual(expect.arrayContaining(['os', 'typing', 'requests']));
      expect(result.structure.classes).toContain('DataProcessor');
      expect(result.structure.functions).toEqual(expect.arrayContaining(['process_data', 'helper_function']));
      expect(result.structure.comments.todos).toHaveLength(1);
      expect(result.structure.comments.documentation).toHaveLength(1);
    });

    it('should handle config files', async () => {
      const filePath = '/test/package.json';
      const fileContent = JSON.stringify({
        name: 'test-package',
        version: '1.0.0',
        dependencies: {
          react: '^18.0.0'
        }
      }, null, 2);

      mockFs.stat.mockResolvedValue({
        size: fileContent.length,
        mtime: new Date(),
        birthtime: new Date(),
        mode: 0o644
      } as any);

      mockFs.readFile.mockResolvedValue(Buffer.from(fileContent));

      const result = await service.analyzeFile(filePath);

      expect(result.metadata.type).toBe(FileType.CONFIG);
      expect(result.metadata.language).toBe('json');
      expect(result.content.raw).toBe(fileContent);
    });

    it('should throw error for files with path traversal', async () => {
      const filePath = '../../../etc/passwd';

      await expect(service.analyzeFile(filePath)).rejects.toThrow('Invalid path: path traversal detected');
    });

    it('should throw error for files that are too large', async () => {
      const filePath = '/test/large-file.js';

      mockFs.stat.mockResolvedValue({
        size: 20 * 1024 * 1024, // 20MB
        mtime: new Date(),
        birthtime: new Date(),
        mode: 0o644
      } as any);

      await expect(service.analyzeFile(filePath)).rejects.toThrow(FileTooLargeError);
    });

    it('should throw error for binary files', async () => {
      const filePath = '/test/image.png';
      const binaryContent = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]); // PNG header

      mockFs.stat.mockResolvedValue({
        size: binaryContent.length,
        mtime: new Date(),
        birthtime: new Date(),
        mode: 0o644
      } as any);

      mockFs.readFile.mockResolvedValue(binaryContent);

      await expect(service.analyzeFile(filePath)).rejects.toThrow(BinaryFileError);
    });

    it('should throw FilePermissionError for access denied', async () => {
      const filePath = '/test/protected-file.js';

      const accessError = new Error('Permission denied') as any;
      accessError.code = 'EACCES';
      mockFs.stat.mockRejectedValue(accessError);

      await expect(service.analyzeFile(filePath)).rejects.toThrow(FilePermissionError);
    });

    it('should throw FileAnalysisError for file not found', async () => {
      const filePath = '/test/nonexistent.js';

      const notFoundError = new Error('File not found') as any;
      notFoundError.code = 'ENOENT';
      mockFs.stat.mockRejectedValue(notFoundError);

      await expect(service.analyzeFile(filePath)).rejects.toThrow(FileAnalysisError);
      await expect(service.analyzeFile(filePath)).rejects.toThrow('File not found');
    });

    it('should handle empty files', async () => {
      const filePath = '/test/empty.js';
      const fileContent = '';

      mockFs.stat.mockResolvedValue({
        size: 0,
        mtime: new Date(),
        birthtime: new Date(),
        mode: 0o644
      } as any);

      mockFs.readFile.mockResolvedValue(Buffer.from(fileContent));

      const result = await service.analyzeFile(filePath);

      expect(result.content.isEmpty).toBe(true);
      expect(result.content.lines).toBe(1); // Empty file still has one line
      expect(result.content.characters).toBe(0);
    });

    it('should respect includeContent option', async () => {
      const filePath = '/test/component.js';
      const fileContent = 'export const Component = () => <div>Hello</div>;';

      mockFs.stat.mockResolvedValue({
        size: fileContent.length,
        mtime: new Date(),
        birthtime: new Date(),
        mode: 0o644
      } as any);

      mockFs.readFile.mockResolvedValue(Buffer.from(fileContent));

      const result = await service.analyzeFile(filePath, { includeContent: false });

      expect(result.content.raw).toBe('');
      expect(result.content.isEmpty).toBe(true);
    });

    it('should respect analyzeStructure option', async () => {
      const filePath = '/test/component.js';
      const fileContent = 'export const Component = () => <div>Hello</div>;';

      mockFs.stat.mockResolvedValue({
        size: fileContent.length,
        mtime: new Date(),
        birthtime: new Date(),
        mode: 0o644
      } as any);

      mockFs.readFile.mockResolvedValue(Buffer.from(fileContent));

      const result = await service.analyzeFile(filePath, { analyzeStructure: false });

      expect(result.structure.imports).toHaveLength(0);
      expect(result.structure.exports).toHaveLength(0);
      expect(result.structure.functions).toHaveLength(0);
      expect(result.structure.classes).toHaveLength(0);
    });
  });

  describe('analyzeDirectory', () => {
    it('should analyze all files in a directory', async () => {
      const directoryPath = '/test/src';
      const files = [
        { name: 'component.js', isFile: () => true, isDirectory: () => false },
        { name: 'utils.ts', isFile: () => true, isDirectory: () => false },
        { name: 'styles.css', isFile: () => true, isDirectory: () => false },
        { name: 'subfolder', isFile: () => false, isDirectory: () => true }
      ];

      mockFs.readdir.mockResolvedValue(files as any);

      // Mock successful file analysis for each file
      mockFs.stat.mockResolvedValue({
        size: 100,
        mtime: new Date(),
        birthtime: new Date(),
        mode: 0o644
      } as any);

      mockFs.readFile.mockResolvedValue(Buffer.from('test content'));

      const result = await service.analyzeDirectory(directoryPath);

      expect(result.results).toHaveLength(3); // Only files, not directories
      expect(result.errors).toHaveLength(0);
      expect(mockFs.readdir).toHaveBeenCalledWith(directoryPath, { withFileTypes: true });
    });

    it('should collect errors for files that fail analysis', async () => {
      const directoryPath = '/test/src';
      const files = [
        { name: 'good-file.js', isFile: () => true, isDirectory: () => false },
        { name: 'bad-file.js', isFile: () => true, isDirectory: () => false }
      ];

      mockFs.readdir.mockResolvedValue(files as any);

      // Mock one successful and one failed file analysis
      mockFs.stat
        .mockResolvedValueOnce({
          size: 100,
          mtime: new Date(),
          birthtime: new Date(),
          mode: 0o644
        } as any)
        .mockRejectedValueOnce(new Error('Permission denied'));

      mockFs.readFile.mockResolvedValue(Buffer.from('test content'));

      const result = await service.analyzeDirectory(directoryPath);

      expect(result.results).toHaveLength(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].file).toBe('bad-file.js');
    });

    it('should throw error for invalid directory path', async () => {
      const directoryPath = '../../../etc';

      await expect(service.analyzeDirectory(directoryPath)).rejects.toThrow('Invalid path: path traversal detected');
    });

    it('should throw error for directory that does not exist', async () => {
      const directoryPath = '/test/nonexistent';

      const notFoundError = new Error('Directory not found') as any;
      notFoundError.code = 'ENOENT';
      mockFs.readdir.mockRejectedValue(notFoundError);

      await expect(service.analyzeDirectory(directoryPath)).rejects.toThrow(FileAnalysisError);
    });
  });

  describe('language detection', () => {
    const testCases = [
      { file: 'component.jsx', expectedLanguage: 'javascript' },
      { file: 'service.ts', expectedLanguage: 'typescript' },
      { file: 'component.vue', expectedLanguage: 'vue' },
      { file: 'script.py', expectedLanguage: 'python' },
      { file: 'Controller.java', expectedLanguage: 'java' },
      { file: 'main.go', expectedLanguage: 'go' },
      { file: 'lib.rs', expectedLanguage: 'rust' },
      { file: 'setup.sh', expectedLanguage: 'bash' },
      { file: 'script.ps1', expectedLanguage: 'powershell' },
      { file: 'config.json', expectedLanguage: 'json' },
      { file: 'docker-compose.yml', expectedLanguage: 'yaml' },
      { file: 'README.md', expectedLanguage: 'markdown' },
      { file: 'Dockerfile', expectedLanguage: 'dockerfile' },
      { file: 'Makefile', expectedLanguage: 'makefile' }
    ];

    testCases.forEach(({ file, expectedLanguage }) => {
      it(`should detect ${expectedLanguage} for ${file}`, async () => {
        const filePath = `/test/${file}`;
        const fileContent = 'test content';

        mockFs.stat.mockResolvedValue({
          size: fileContent.length,
          mtime: new Date(),
          birthtime: new Date(),
          mode: 0o644
        } as any);

        mockFs.readFile.mockResolvedValue(Buffer.from(fileContent));

        const result = await service.analyzeFile(filePath);

        expect(result.metadata.language).toBe(expectedLanguage);
      });
    });
  });

  describe('file type detection', () => {
    const testCases = [
      { file: 'component.js', expectedType: FileType.CODE },
      { file: 'package.json', expectedType: FileType.CONFIG },
      { file: 'README.md', expectedType: FileType.DOCUMENTATION },
      { file: 'setup.sh', expectedType: FileType.SCRIPT },
      { file: 'schema.sql', expectedType: FileType.DATA },
      { file: 'unknown.xyz', expectedType: FileType.UNKNOWN }
    ];

    testCases.forEach(({ file, expectedType }) => {
      it(`should detect ${expectedType} for ${file}`, async () => {
        const filePath = `/test/${file}`;
        const fileContent = 'test content';

        mockFs.stat.mockResolvedValue({
          size: fileContent.length,
          mtime: new Date(),
          birthtime: new Date(),
          mode: 0o644
        } as any);

        mockFs.readFile.mockResolvedValue(Buffer.from(fileContent));

        const result = await service.analyzeFile(filePath);

        expect(result.metadata.type).toBe(expectedType);
      });
    });
  });
});