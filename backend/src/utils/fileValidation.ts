import * as fs from 'fs/promises';
import * as path from 'path';
import { FileType } from '../types/fileAnalysis';

export class FileAnalysisConfig {
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  static readonly MAX_BINARY_THRESHOLD = 0.3; // 30% non-printable chars
  static readonly ASCII_CONTROL_CHARS = {
    TAB: 9,
    LF: 10,
    CR: 13,
    MIN_PRINTABLE: 32
  };
  
  // File type mappings
  static readonly FILE_TYPE_EXTENSIONS = {
    [FileType.CODE]: [
      '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
      '.py', '.rb', '.php', '.java', '.kt', '.swift', 
      '.go', '.rs', '.cpp', '.c', '.cs', '.vb', '.fs',
      '.dart', '.scala', '.clj', '.hs', '.elm', '.ml'
    ],
    [FileType.CONFIG]: [
      '.json', '.yaml', '.yml', '.toml', '.ini', '.env', 
      '.config', '.conf', '.cfg', '.properties'
    ],
    [FileType.DOCUMENTATION]: [
      '.md', '.txt', '.rst', '.adoc', '.tex'
    ],
    [FileType.SCRIPT]: [
      '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd'
    ],
    [FileType.DATA]: [
      '.sql', '.graphql', '.gql', '.xml', '.csv'
    ]
  };

  // Known filenames
  static readonly SPECIAL_FILES = {
    [FileType.CONFIG]: [
      'package.json', 'tsconfig.json', 'jsconfig.json',
      'webpack.config.js', 'vite.config.js', 'rollup.config.js',
      'next.config.js', 'nuxt.config.js', 'angular.json',
      'jest.config.js', 'vitest.config.js', 'cypress.config.js',
      '.eslintrc', '.prettierrc', 'tailwind.config.js',
      'Dockerfile', 'docker-compose.yml', 'Makefile'
    ],
    [FileType.DOCUMENTATION]: [
      'README', 'CHANGELOG', 'LICENSE', 'CONTRIBUTING',
      'INSTALL', 'AUTHORS', 'COPYING'
    ]
  };
}

export class SecurityValidator {
  validateFilePath(filePath: string): void {
    // Path traversal prevention
    if (filePath.includes('..') || filePath.includes('~')) {
      throw new Error('Invalid path: path traversal detected');
    }

    // Normalize and check for suspicious patterns
    const normalizedPath = path.normalize(filePath);
    if (normalizedPath.includes('..')) {
      throw new Error('Invalid path: normalized path contains traversal');
    }

    // Check for null bytes
    if (filePath.includes('\0')) {
      throw new Error('Invalid path: null byte detected');
    }
  }

  async validateFileSize(filePath: string, maxSize: number = FileAnalysisConfig.MAX_FILE_SIZE): Promise<void> {
    try {
      const stats = await fs.stat(filePath);
      if (stats.size > maxSize) {
        throw new Error(`File too large: ${stats.size} bytes (max: ${maxSize} bytes)`);
      }
    } catch (error) {
      if ((error as any)?.code === 'ENOENT') {
        throw new Error(`File not found: ${filePath}`);
      } else if ((error as any)?.code === 'EACCES') {
        throw new Error(`Permission denied: ${filePath}`);
      }
      throw error;
    }
  }
}

export class FileTypeDetector {
  detectFileType(filePath: string): FileType {
    const extension = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath);

    // Check special files first
    for (const [type, files] of Object.entries(FileAnalysisConfig.SPECIAL_FILES)) {
      if (files.includes(basename) || files.includes(basename.toLowerCase())) {
        return type as FileType;
      }
    }

    // Check by extension
    for (const [type, extensions] of Object.entries(FileAnalysisConfig.FILE_TYPE_EXTENSIONS)) {
      if (extensions.includes(extension)) {
        return type as FileType;
      }
    }

    return FileType.UNKNOWN;
  }

  detectLanguage(filePath: string): string | null {
    const extension = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath).toLowerCase();

    // Language mappings
    const languageMap: Record<string, string> = {
      '.js': 'javascript',
      '.mjs': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.vue': 'vue',
      '.svelte': 'svelte',
      '.py': 'python',
      '.rb': 'ruby',
      '.php': 'php',
      '.java': 'java',
      '.kt': 'kotlin',
      '.swift': 'swift',
      '.go': 'go',
      '.rs': 'rust',
      '.cpp': 'cpp',
      '.c': 'c',
      '.cs': 'csharp',
      '.vb': 'vb',
      '.fs': 'fsharp',
      '.dart': 'dart',
      '.scala': 'scala',
      '.clj': 'clojure',
      '.hs': 'haskell',
      '.elm': 'elm',
      '.ml': 'ocaml',
      '.sh': 'bash',
      '.bash': 'bash',
      '.zsh': 'zsh',
      '.fish': 'fish',
      '.ps1': 'powershell',
      '.bat': 'batch',
      '.cmd': 'batch',
      '.json': 'json',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.toml': 'toml',
      '.xml': 'xml',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.sass': 'sass',
      '.less': 'less',
      '.md': 'markdown',
      '.sql': 'sql',
      '.graphql': 'graphql',
      '.gql': 'graphql'
    };

    // Special file mappings
    const specialFileMap: Record<string, string> = {
      'dockerfile': 'dockerfile',
      'makefile': 'makefile',
      'gemfile': 'ruby',
      'podfile': 'ruby',
      'rakefile': 'ruby'
    };

    return specialFileMap[basename] || languageMap[extension] || null;
  }

  async isBinaryFile(filePath: string): Promise<boolean> {
    try {
      const buffer = await fs.readFile(filePath);
      
      // Check for null bytes in first 8KB (common binary indicator)
      const sampleSize = Math.min(buffer.length, 8192);
      const sample = buffer.subarray(0, sampleSize);
      
      // Look for null bytes
      const nullByteIndex = sample.indexOf(0);
      if (nullByteIndex !== -1) {
        return true;
      }

      // Check percentage of non-printable characters
      const { TAB, LF, CR, MIN_PRINTABLE } = FileAnalysisConfig.ASCII_CONTROL_CHARS;
      let nonPrintableCount = 0;

      for (let i = 0; i < sample.length; i++) {
        const byte = sample[i];
        if (byte < MIN_PRINTABLE && byte !== TAB && byte !== LF && byte !== CR) {
          nonPrintableCount++;
        }
      }

      const nonPrintableRatio = nonPrintableCount / sample.length;
      return nonPrintableRatio > FileAnalysisConfig.MAX_BINARY_THRESHOLD;
    } catch (error) {
      // If we can't read the file, assume it might be binary
      return true;
    }
  }
}

export class EncodingDetector {
  async detectEncoding(filePath: string): Promise<string> {
    try {
      const buffer = await fs.readFile(filePath);
      
      // Check for BOM (Byte Order Mark)
      if (buffer.length >= 3) {
        // UTF-8 BOM
        if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
          return 'utf8';
        }
        
        // UTF-16 BE BOM
        if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
          return 'utf16be';
        }
        
        // UTF-16 LE BOM
        if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
          return 'utf16le';
        }
      }

      // Try to decode as UTF-8 and check for replacement characters
      const utf8String = buffer.toString('utf8');
      if (!utf8String.includes('\uFFFD')) {
        return 'utf8';
      }

      // Fall back to latin1 for other encodings
      return 'latin1';
    } catch (error) {
      // Default encoding if detection fails
      return 'utf8';
    }
  }
}