import request from 'supertest'
import express from 'express'
import { fileSystemRoutes } from '../../routes/fileSystem'
import fs from 'fs-extra'
import path from 'path'

describe('FileSystem Routes', () => {
  let app: express.Application
  let testDir: string

  beforeAll(async () => {
    app = express()
    app.use(express.json())
    app.use('/api/filesystem', fileSystemRoutes)

    // Create test directory
    testDir = path.join(__dirname, '../../test-routes-filesystem')
    await fs.ensureDir(testDir)
    await createTestFiles()
  })

  afterAll(async () => {
    await fs.remove(testDir)
  })

  async function createTestFiles() {
    const files = {
      'package.json': JSON.stringify({ name: 'test', version: '1.0.0' }),
      'README.md': '# Test Project',
      'src/index.ts': 'console.log("hello");',
      'src/utils.ts': 'export const util = () => {};'
    }

    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(testDir, filePath)
      await fs.ensureDir(path.dirname(fullPath))
      await fs.writeFile(fullPath, content)
    }
  }

  describe('POST /api/filesystem/scan', () => {
    test('should scan directory successfully', async () => {
      const response = await request(app)
        .post('/api/filesystem/scan')
        .send({
          path: testDir,
          settings: {
            excludeNodeModules: true,
            maxDepth: 5
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.tree).toBeInstanceOf(Array)
      expect(response.body.data.stats).toBeDefined()
      expect(response.body.data.stats.totalFiles).toBeGreaterThan(0)
    })

    test('should require directory path', async () => {
      const response = await request(app)
        .post('/api/filesystem/scan')
        .send({
          settings: {}
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Directory path is required')
    })

    test('should handle non-existent directory', async () => {
      const response = await request(app)
        .post('/api/filesystem/scan')
        .send({
          path: '/non/existent/path'
        })
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Directory not found or not accessible')
    })

    test('should handle invalid directory (file instead)', async () => {
      const filePath = path.join(testDir, 'package.json')
      
      const response = await request(app)
        .post('/api/filesystem/scan')
        .send({
          path: filePath
        })
        .expect(500)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Failed to scan directory')
    })

    test('should apply scan settings', async () => {
      const response = await request(app)
        .post('/api/filesystem/scan')
        .send({
          path: testDir,
          settings: {
            maxDepth: 1,
            excludePatterns: ['**/src/**']
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      
      // Should not include src directory due to exclude pattern
      const treeStr = JSON.stringify(response.body.data.tree)
      expect(treeStr.includes('src')).toBe(false)
    })
  })

  describe('POST /api/filesystem/validate', () => {
    test('should validate existing path', async () => {
      const response = await request(app)
        .post('/api/filesystem/validate')
        .send({
          path: testDir
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.isValid).toBe(true)
    })

    test('should invalidate non-existent path', async () => {
      const response = await request(app)
        .post('/api/filesystem/validate')
        .send({
          path: '/non/existent/path'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.isValid).toBe(false)
    })

    test('should require path parameter', async () => {
      const response = await request(app)
        .post('/api/filesystem/validate')
        .send({})
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Path is required')
    })

    test('should validate files as well as directories', async () => {
      const filePath = path.join(testDir, 'package.json')
      
      const response = await request(app)
        .post('/api/filesystem/validate')
        .send({
          path: filePath
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.isValid).toBe(true)
    })
  })

  describe('POST /api/filesystem/file-content', () => {
    test('should read file content', async () => {
      const filePath = path.join(testDir, 'README.md')
      
      const response = await request(app)
        .post('/api/filesystem/file-content')
        .send({
          path: filePath
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.content).toBe('# Test Project')
    })

    test('should require file path', async () => {
      const response = await request(app)
        .post('/api/filesystem/file-content')
        .send({})
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('File path is required')
    })

    test('should handle non-existent file', async () => {
      const response = await request(app)
        .post('/api/filesystem/file-content')
        .send({
          path: '/non/existent/file.txt'
        })
        .expect(500)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Failed to read file')
    })

    test('should respect file size limits', async () => {
      const response = await request(app)
        .post('/api/filesystem/file-content')
        .send({
          path: path.join(testDir, 'README.md'),
          maxSize: 5 // Very small limit
        })
        .expect(500)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Failed to read file')
      expect(response.body.message).toContain('File too large')
    })

    test('should read JSON files correctly', async () => {
      const filePath = path.join(testDir, 'package.json')
      
      const response = await request(app)
        .post('/api/filesystem/file-content')
        .send({
          path: filePath
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      
      const content = JSON.parse(response.body.data.content)
      expect(content.name).toBe('test')
      expect(content.version).toBe('1.0.0')
    })
  })

  describe('Error Handling', () => {
    test('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/api/filesystem/scan')
        .send('invalid json')
        .type('application/json')
        .expect(400)
    })

    test('should handle missing request body', async () => {
      const response = await request(app)
        .post('/api/filesystem/scan')
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    test('should handle permission errors gracefully', async () => {
      // Test with a system directory that might have permission issues
      const response = await request(app)
        .post('/api/filesystem/scan')
        .send({
          path: process.platform === 'win32' ? 'C:\\System Volume Information' : '/root'
        })

      // Should handle gracefully - either succeed with empty results or fail cleanly
      expect([200, 404, 500]).toContain(response.status)
      expect(response.body.success).toBeDefined()
    })
  })

  describe('Performance and Large Files', () => {
    test('should handle directories with many files', async () => {
      // Create a directory with many files
      const manyFilesDir = path.join(testDir, 'many-files')
      await fs.ensureDir(manyFilesDir)
      
      // Create 50 small files
      for (let i = 0; i < 50; i++) {
        await fs.writeFile(
          path.join(manyFilesDir, `file${i}.txt`),
          `Content of file ${i}`
        )
      }

      const response = await request(app)
        .post('/api/filesystem/scan')
        .send({
          path: manyFilesDir
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.stats.totalFiles).toBe(50)

      // Cleanup
      await fs.remove(manyFilesDir)
    })

    test('should handle nested directory structures', async () => {
      // Create nested structure
      const nestedDir = path.join(testDir, 'a/b/c/d/e')
      await fs.ensureDir(nestedDir)
      await fs.writeFile(path.join(nestedDir, 'deep.txt'), 'deep content')

      const response = await request(app)
        .post('/api/filesystem/scan')
        .send({
          path: testDir,
          settings: {
            maxDepth: 10
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      
      // Should include the deep file
      const treeStr = JSON.stringify(response.body.data.tree)
      expect(treeStr.includes('deep.txt')).toBe(true)

      // Cleanup
      await fs.remove(path.join(testDir, 'a'))
    })
  })
})