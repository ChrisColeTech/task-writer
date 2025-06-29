import { FileSystemService } from '../../services/FileSystemService'
import fs from 'fs-extra'
import path from 'path'

describe('FileSystemService', () => {
  let fileSystemService: FileSystemService
  let testDir: string

  beforeAll(async () => {
    fileSystemService = new FileSystemService()
    testDir = path.join(__dirname, '../../test-filesystem')
    
    // Create test directory structure
    await fs.ensureDir(testDir)
    await createTestFileStructure()
  })

  afterAll(async () => {
    // Clean up test directory
    await fs.remove(testDir)
  })

  async function createTestFileStructure() {
    const structure = {
      'package.json': JSON.stringify({ name: 'test-project', version: '1.0.0' }),
      'README.md': '# Test Project\n\nThis is a test project.',
      'src/index.ts': 'console.log("Hello, world!");',
      'src/utils/helper.ts': 'export const helper = () => "help";',
      'src/components/Button.tsx': 'export const Button = () => <button />;',
      'tests/index.test.ts': 'test("basic", () => expect(true).toBe(true));',
      'dist/index.js': 'console.log("Built file");',
      'node_modules/react/package.json': '{}',
      '.git/config': '[core]',
      '.env': 'SECRET=test'
    }

    for (const [filePath, content] of Object.entries(structure)) {
      const fullPath = path.join(testDir, filePath)
      await fs.ensureDir(path.dirname(fullPath))
      await fs.writeFile(fullPath, content)
    }
  }

  describe('Directory Scanning', () => {
    test('should scan directory and return tree structure', async () => {
      const result = await fileSystemService.scanDirectory(testDir)
      
      expect(result.tree).toHaveLength(1)
      expect(result.tree[0].type).toBe('directory')
      expect(result.tree[0].children).toBeDefined()
      
      // Should have some files and directories
      expect(result.stats.totalFiles).toBeGreaterThan(0)
      expect(result.stats.totalDirectories).toBeGreaterThan(0)
    })

    test('should exclude node_modules by default', async () => {
      const result = await fileSystemService.scanDirectory(testDir)
      
      const hasNodeModules = JSON.stringify(result.tree).includes('node_modules')
      expect(hasNodeModules).toBe(false)
    })

    test('should exclude .git by default', async () => {
      const result = await fileSystemService.scanDirectory(testDir)
      
      const hasGit = JSON.stringify(result.tree).includes('.git')
      expect(hasGit).toBe(false)
    })

    test('should exclude dist directory by default', async () => {
      const result = await fileSystemService.scanDirectory(testDir)
      
      const hasDist = JSON.stringify(result.tree).includes('dist')
      expect(hasDist).toBe(false)
    })

    test('should include dot files when specified', async () => {
      const result = await fileSystemService.scanDirectory(testDir, {
        includeDotFiles: true,
        excludeNodeModules: true
      })
      
      const hasEnvFile = JSON.stringify(result.tree).includes('.env')
      expect(hasEnvFile).toBe(true)
    })

    test('should respect max depth setting', async () => {
      const result = await fileSystemService.scanDirectory(testDir, {
        maxDepth: 1
      })
      
      // Should only go 1 level deep, so src should not have children
      const tree = result.tree[0]
      const srcDir = tree.children?.find(child => child.name === 'src')
      
      if (srcDir) {
        expect(srcDir.children).toBeUndefined()
      }
    })

    test('should include custom exclude patterns', async () => {
      const result = await fileSystemService.scanDirectory(testDir, {
        excludePatterns: ['**/tests/**']
      })
      
      const hasTests = JSON.stringify(result.tree).includes('tests')
      expect(hasTests).toBe(false)
    })

    test('should calculate correct statistics', async () => {
      const result = await fileSystemService.scanDirectory(testDir)
      
      expect(result.stats.totalFiles).toBeGreaterThan(0)
      expect(result.stats.totalDirectories).toBeGreaterThan(0)
      expect(result.stats.totalSize).toBeGreaterThan(0)
      expect(result.stats.fileTypes).toBeDefined()
      
      // Should have different file types
      expect(Object.keys(result.stats.fileTypes).length).toBeGreaterThan(1)
      expect(result.stats.fileTypes['.json']).toBeGreaterThan(0)
      expect(result.stats.fileTypes['.ts']).toBeGreaterThan(0)
    })

    test('should sort children properly', async () => {
      const result = await fileSystemService.scanDirectory(testDir)
      const root = result.tree[0]
      
      if (root.children && root.children.length > 1) {
        // Directories should come before files
        let foundFile = false
        for (const child of root.children) {
          if (foundFile && child.type === 'directory') {
            fail('Directory found after file - sorting is incorrect')
          }
          if (child.type === 'file') {
            foundFile = true
          }
        }
      }
    })

    test('should handle non-existent directory', async () => {
      await expect(
        fileSystemService.scanDirectory('/non/existent/path')
      ).rejects.toThrow()
    })

    test('should handle file instead of directory', async () => {
      const filePath = path.join(testDir, 'package.json')
      await expect(
        fileSystemService.scanDirectory(filePath)
      ).rejects.toThrow('Path is not a directory')
    })
  })

  describe('Path Validation', () => {
    test('should validate existing paths', async () => {
      const isValid = await fileSystemService.validatePath(testDir)
      expect(isValid).toBe(true)
    })

    test('should invalidate non-existent paths', async () => {
      const isValid = await fileSystemService.validatePath('/non/existent/path')
      expect(isValid).toBe(false)
    })

    test('should validate files as well as directories', async () => {
      const filePath = path.join(testDir, 'package.json')
      const isValid = await fileSystemService.validatePath(filePath)
      expect(isValid).toBe(true)
    })
  })

  describe('File Operations', () => {
    test('should read file content', async () => {
      const filePath = path.join(testDir, 'README.md')
      const content = await fileSystemService.getFileContent(filePath)
      
      expect(content).toContain('# Test Project')
      expect(content).toContain('This is a test project')
    })

    test('should respect file size limits', async () => {
      const filePath = path.join(testDir, 'README.md')
      
      await expect(
        fileSystemService.getFileContent(filePath, 10) // Very small limit
      ).rejects.toThrow('File too large')
    })

    test('should handle non-existent files', async () => {
      await expect(
        fileSystemService.getFileContent('/non/existent/file.txt')
      ).rejects.toThrow()
    })

    test('should write files correctly', async () => {
      const testFilePath = path.join(testDir, 'test-write.txt')
      const testContent = 'This is test content'
      
      await fileSystemService.writeFile(testFilePath, testContent)
      
      const writtenContent = await fs.readFile(testFilePath, 'utf-8')
      expect(writtenContent).toBe(testContent)
      
      // Clean up
      await fs.remove(testFilePath)
    })

    test('should create directories when writing files', async () => {
      const testFilePath = path.join(testDir, 'new/nested/directory/file.txt')
      const testContent = 'Nested file content'
      
      await fileSystemService.writeFile(testFilePath, testContent)
      
      const exists = await fs.pathExists(testFilePath)
      expect(exists).toBe(true)
      
      const content = await fs.readFile(testFilePath, 'utf-8')
      expect(content).toBe(testContent)
      
      // Clean up
      await fs.remove(path.join(testDir, 'new'))
    })
  })

  describe('Error Handling', () => {
    test('should handle permission errors gracefully', async () => {
      // This test is platform-dependent and might not work on all systems
      // Skip on Windows where permission handling is different
      if (process.platform === 'win32') {
        return
      }
      
      // Create a directory we can't read
      const restrictedDir = path.join(testDir, 'restricted')
      await fs.ensureDir(restrictedDir)
      await fs.chmod(restrictedDir, 0o000)
      
      try {
        const result = await fileSystemService.scanDirectory(testDir)
        // Should not throw, just skip the restricted directory
        expect(result.tree).toBeDefined()
      } finally {
        // Restore permissions for cleanup
        await fs.chmod(restrictedDir, 0o755)
        await fs.remove(restrictedDir)
      }
    })

    test('should handle empty directories', async () => {
      const emptyDir = path.join(testDir, 'empty')
      await fs.ensureDir(emptyDir)
      
      const result = await fileSystemService.scanDirectory(emptyDir)
      
      expect(result.tree).toHaveLength(1)
      expect(result.tree[0].children).toEqual([])
      expect(result.stats.totalFiles).toBe(0)
      expect(result.stats.totalDirectories).toBe(1)
      
      await fs.remove(emptyDir)
    })

    test('should handle very deep directory structures', async () => {
      // Create a deep directory structure
      const deepPath = path.join(testDir, 'a/b/c/d/e/f/g/h/i/j')
      await fs.ensureDir(deepPath)
      await fs.writeFile(path.join(deepPath, 'deep.txt'), 'deep file')
      
      // Test with limited depth
      const result = await fileSystemService.scanDirectory(testDir, {
        maxDepth: 5
      })
      
      // Should not crash and should respect depth limit
      expect(result.tree).toBeDefined()
      
      await fs.remove(path.join(testDir, 'a'))
    })
  })
})