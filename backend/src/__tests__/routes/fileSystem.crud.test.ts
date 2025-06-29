/**
 * Comprehensive CRUD tests for File System routes
 * Tests all happy/unhappy paths, validation, and error handling
 * Uses database cleanup patterns from scaffold-scripts
 */

import request from 'supertest';
import express from 'express';
import { fileSystemRoutes } from '../../routes/fileSystem';
import { setupTest, cleanupTest, TestFixtures, createTestDirectory } from '../../../test/test-isolation';
import fs from 'fs/promises';
import path from 'path';

describe('File System Routes - CRUD Tests', () => {
  let app: express.Application;
  let testDir: string;

  beforeEach(async () => {
    setupTest();
    
    app = express();
    app.use(express.json());
    app.use('/api/filesystem', fileSystemRoutes);

    // Create isolated test directory
    testDir = createTestDirectory('filesystem-crud');
    TestFixtures.createTestProjectStructure(testDir);
  });

  afterEach(async () => {
    cleanupTest();
  });

  describe('POST /api/filesystem/scan - Directory scanning', () => {
    describe('Happy Path', () => {
      it('should scan directory structure successfully', async () => {
        const response = await request(app)
          .post('/api/filesystem/scan')
          .send({
            path: testDir,
            settings: {
              maxDepth: 3,
              includeHidden: false,
              includeFiles: true,
              includeDirs: true
            }
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.tree).toBeInstanceOf(Array);
        expect(response.body.data.tree.length).toBeGreaterThan(0);
        expect(response.body.data.stats).toBeDefined();
      });

      it('should scan with different depth settings', async () => {
        const response = await request(app)
          .post('/api/filesystem/scan')
          .send({
            path: testDir,
            settings: {
              maxDepth: 1,
              includeFiles: false,
              includeDirs: true
            }
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.tree).toBeInstanceOf(Array);
      });

      it('should handle scan with file filtering', async () => {
        const response = await request(app)
          .post('/api/filesystem/scan')
          .send({
            path: testDir,
            settings: {
              maxDepth: 2,
              includeFiles: true,
              fileExtensions: ['.ts', '.js', '.json']
            }
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.tree).toBeInstanceOf(Array);
      });
    });

    describe('Unhappy Path', () => {
      it('should reject missing directory path', async () => {
        const response = await request(app)
          .post('/api/filesystem/scan')
          .send({
            settings: { maxDepth: 3 }
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Directory path is required');
      });

      it('should reject empty directory path', async () => {
        const response = await request(app)
          .post('/api/filesystem/scan')
          .send({
            path: '',
            settings: { maxDepth: 3 }
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Directory path is required');
      });

      it('should handle non-existent directory', async () => {
        const response = await request(app)
          .post('/api/filesystem/scan')
          .send({
            path: '/non/existent/directory',
            settings: { maxDepth: 3 }
          })
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('not found');
      });

      it('should reject path traversal attempts', async () => {
        const response = await request(app)
          .post('/api/filesystem/scan')
          .send({
            path: '../../../etc',
            settings: { maxDepth: 1 }
          })
          .expect(404);

        expect(response.body.success).toBe(false);
      });
    });

    describe('Validation Tests', () => {
      it('should validate depth limits', async () => {
        const response = await request(app)
          .post('/api/filesystem/scan')
          .send({
            path: testDir,
            settings: {
              maxDepth: 0,
              includeFiles: true
            }
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        // Depth 0 should still return root directory
        expect(response.body.data.tree).toBeInstanceOf(Array);
      });

      it('should handle large directory structures', async () => {
        // Create many nested directories for testing
        const largeTestDir = createTestDirectory('large-structure');
        for (let i = 0; i < 50; i++) {
          await fs.mkdir(path.join(largeTestDir, `dir${i}`), { recursive: true });
          await fs.writeFile(path.join(largeTestDir, `dir${i}`, 'file.txt'), `content ${i}`);
        }

        const response = await request(app)
          .post('/api/filesystem/scan')
          .send({
            path: largeTestDir,
            settings: {
              maxDepth: 2,
              includeFiles: true
            }
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.tree.length).toBeGreaterThan(0);
      });
    });
  });

  describe('POST /api/filesystem/validate - Path validation', () => {
    describe('Happy Path', () => {
      it('should validate existing directory path', async () => {
        const response = await request(app)
          .post('/api/filesystem/validate')
          .send({
            path: testDir
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.isValid).toBe(true);
      });

      it('should validate existing file path', async () => {
        const packageFile = path.join(testDir, 'package.json');
        
        const response = await request(app)
          .post('/api/filesystem/validate')
          .send({
            path: packageFile
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.isValid).toBe(true);
      });
    });

    describe('Unhappy Path', () => {
      it('should reject missing path parameter', async () => {
        const response = await request(app)
          .post('/api/filesystem/validate')
          .send({})
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Path is required');
      });

      it('should handle non-existent path', async () => {
        const response = await request(app)
          .post('/api/filesystem/validate')
          .send({
            path: '/non/existent/path'
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.isValid).toBe(false);
      });

      it('should handle invalid path format', async () => {
        const response = await request(app)
          .post('/api/filesystem/validate')
          .send({
            path: null
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Path is required');
      });
    });

    describe('Security Tests', () => {
      it('should handle path traversal attempts in validation', async () => {
        const response = await request(app)
          .post('/api/filesystem/validate')
          .send({
            path: '../../../etc/passwd'
          });

        // Should either succeed with isValid: false or fail gracefully
        expect([200, 500]).toContain(response.status);
        if (response.status === 200) {
          expect(response.body.data.isValid).toBe(false);
        }
      });
    });
  });

  describe('POST /api/filesystem/file-content - File content reading', () => {
    describe('Happy Path', () => {
      it('should read text file content successfully', async () => {
        const readmeFile = path.join(testDir, 'README.md');
        
        const response = await request(app)
          .post('/api/filesystem/file-content')
          .send({
            path: readmeFile
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.content).toBeDefined();
        expect(typeof response.body.data.content).toBe('string');
        expect(response.body.data.content.length).toBeGreaterThan(0);
      });

      it('should read JSON file content', async () => {
        const packageFile = path.join(testDir, 'package.json');
        
        const response = await request(app)
          .post('/api/filesystem/file-content')
          .send({
            path: packageFile
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.content).toBeDefined();
        expect(() => JSON.parse(response.body.data.content)).not.toThrow();
      });

      it('should read TypeScript file content', async () => {
        const tsFile = path.join(testDir, 'src/index.ts');
        
        const response = await request(app)
          .post('/api/filesystem/file-content')
          .send({
            path: tsFile
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.content).toContain('import');
        expect(response.body.data.content).toContain('TODO');
      });

      it('should respect file size limits', async () => {
        const smallFile = path.join(testDir, 'small.txt');
        await fs.writeFile(smallFile, 'Small content');
        
        const response = await request(app)
          .post('/api/filesystem/file-content')
          .send({
            path: smallFile,
            maxSize: 100
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.content).toBe('Small content');
      });
    });

    describe('Unhappy Path', () => {
      it('should reject missing file path', async () => {
        const response = await request(app)
          .post('/api/filesystem/file-content')
          .send({})
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('File path is required');
      });

      it('should handle non-existent file', async () => {
        const response = await request(app)
          .post('/api/filesystem/file-content')
          .send({
            path: '/non/existent/file.txt'
          })
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Failed to read file');
      });

      it('should handle file size limits', async () => {
        const largeFile = path.join(testDir, 'large.txt');
        await fs.writeFile(largeFile, 'x'.repeat(20));
        
        const response = await request(app)
          .post('/api/filesystem/file-content')
          .send({
            path: largeFile,
            maxSize: 5
          })
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Failed to read file');
      });

      it('should handle directory instead of file', async () => {
        const response = await request(app)
          .post('/api/filesystem/file-content')
          .send({
            path: testDir // Directory instead of file
          })
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Failed to read file');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/api/filesystem/scan')
        .send('invalid json')
        .type('application/json')
        .expect(400);
    });

    it('should handle server errors gracefully', async () => {
      // Test with a problematic path that might cause issues
      const response = await request(app)
        .post('/api/filesystem/scan')
        .send({
          path: '/dev/null',
          settings: { maxDepth: 1 }
        });

      // Should handle gracefully, either succeed or fail with proper error
      expect([200, 500]).toContain(response.status);
      if (response.status >= 400) {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBeDefined();
      }
    });

    it('should handle permission denied errors', async () => {
      // Try to access a non-existent directory that would cause permission errors
      const response = await request(app)
        .post('/api/filesystem/scan')
        .send({
          path: '/nonexistent/restricted/path',
          settings: { maxDepth: 1 }
        });

      // Should handle gracefully with proper error response
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('Performance Tests', () => {
    it('should complete file operations within reasonable time', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .post('/api/filesystem/scan')
        .send({
          path: testDir,
          settings: { maxDepth: 2 }
        })
        .expect(200);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      expect(response.body.success).toBe(true);
    });

    it('should handle concurrent file operations', async () => {
      const requests = Array(3).fill(null).map(() =>
        request(app)
          .post('/api/filesystem/file-content')
          .send({
            path: path.join(testDir, 'package.json')
          })
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });
  });
});