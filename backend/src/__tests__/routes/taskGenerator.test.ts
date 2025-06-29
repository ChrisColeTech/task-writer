import request from 'supertest'
import express from 'express'
import { taskGeneratorRoutes } from '../../routes/taskGenerator'
import fs from 'fs-extra'
import path from 'path'

describe('TaskGenerator Routes', () => {
  let app: express.Application
  let testDir: string

  beforeAll(async () => {
    app = express()
    app.use(express.json())
    app.use('/api/task-generator', taskGeneratorRoutes)

    // Create test directory
    testDir = path.join(__dirname, '../../test-routes-task-generator')
    await fs.ensureDir(testDir)
    await createTestProject()
  })

  afterAll(async () => {
    await fs.remove(testDir)
  })

  async function createTestProject() {
    const files = {
      'package.json': JSON.stringify({
        name: 'test-project',
        version: '1.0.0',
        dependencies: {
          'react': '^18.0.0',
          'typescript': '^4.9.0'
        },
        scripts: {
          'build': 'tsc',
          'test': 'jest'
        }
      }),
      'README.md': '# Test Project\n\nThis is a test project for task generation.',
      'tsconfig.json': JSON.stringify({
        compilerOptions: {
          target: 'es2020',
          module: 'commonjs',
          strict: true
        }
      }),
      'src/index.ts': `
// Main entry point
import { App } from './App'

const app = new App()
app.start()
      `,
      'src/App.ts': `
// Application class
export class App {
  start() {
    console.log('App started')
  }
}
      `,
      'src/utils/helpers.ts': `
// Utility functions
export const formatString = (str: string): string => {
  return str.trim().toLowerCase()
}

export const calculateSum = (a: number, b: number): number => {
  return a + b
}
      `,
      'src/components/Button.tsx': `
// React button component
import React from 'react'

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>
}
      `,
      'tests/App.test.ts': `
// Test file
import { App } from '../src/App'

describe('App', () => {
  test('should start successfully', () => {
    const app = new App()
    expect(() => app.start()).not.toThrow()
  })
})
      `,
      '.gitignore': `
node_modules/
dist/
*.log
.env
      `
    }

    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(testDir, filePath)
      await fs.ensureDir(path.dirname(fullPath))
      await fs.writeFile(fullPath, content.trim())
    }
  }

  describe('POST /api/task-generator/analyze', () => {
    test('should analyze project structure', async () => {
      const response = await request(app)
        .post('/api/task-generator/analyze')
        .send({
          path: testDir,
          settings: {
            excludeNodeModules: true,
            maxDepth: 5,
            includeHidden: false
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.projectInfo).toBeDefined()
      expect(response.body.data.fileStructure).toBeDefined()
      expect(response.body.data.detectedFrameworks).toBeInstanceOf(Array)
      expect(response.body.data.statistics).toBeDefined()

      // Should detect React and TypeScript
      expect(response.body.data.detectedFrameworks).toContain('react')
      expect(response.body.data.detectedFrameworks).toContain('typescript')

      // Should have correct file counts
      expect(response.body.data.statistics.totalFiles).toBeGreaterThan(0)
      expect(response.body.data.statistics.codeFiles).toBeGreaterThan(0)
    })

    test('should require directory path', async () => {
      const response = await request(app)
        .post('/api/task-generator/analyze')
        .send({
          settings: {}
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Directory path is required')
    })

    test('should handle non-existent directory', async () => {
      const response = await request(app)
        .post('/api/task-generator/analyze')
        .send({
          path: '/non/existent/path',
          settings: {}
        })
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Directory not found or not accessible')
    })

    test('should apply analysis settings', async () => {
      const response = await request(app)
        .post('/api/task-generator/analyze')
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
      const structureStr = JSON.stringify(response.body.data.fileStructure)
      expect(structureStr.includes('src')).toBe(false)
    })

    test('should detect project metadata correctly', async () => {
      const response = await request(app)
        .post('/api/task-generator/analyze')
        .send({
          path: testDir,
          settings: {
            analyzePackageJson: true,
            detectFrameworks: true
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.projectInfo.name).toBe('test-project')
      expect(response.body.data.projectInfo.version).toBe('1.0.0')
      expect(response.body.data.projectInfo.hasPackageJson).toBe(true)
      expect(response.body.data.projectInfo.hasTypeScript).toBe(true)
    })
  })

  describe('POST /api/task-generator/generate', () => {
    test('should generate tasks from project analysis', async () => {
      const response = await request(app)
        .post('/api/task-generator/generate')
        .send({
          path: testDir,
          settings: {
            taskTypes: ['development', 'testing', 'documentation'],
            includeFileSpecific: true,
            includeProjectLevel: true,
            prioritization: 'balanced',
            outputFormat: 'markdown'
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.tasks).toBeInstanceOf(Array)
      expect(response.body.data.tasks.length).toBeGreaterThan(0)
      expect(response.body.data.metadata).toBeDefined()
      expect(response.body.data.generationStats).toBeDefined()

      // Check task structure
      const firstTask = response.body.data.tasks[0]
      expect(firstTask).toHaveProperty('id')
      expect(firstTask).toHaveProperty('title')
      expect(firstTask).toHaveProperty('description')
      expect(firstTask).toHaveProperty('type')
      expect(firstTask).toHaveProperty('priority')
      expect(firstTask).toHaveProperty('estimatedTime')
    })

    test('should generate different task types based on settings', async () => {
      const response = await request(app)
        .post('/api/task-generator/generate')
        .send({
          path: testDir,
          settings: {
            taskTypes: ['testing'],
            includeFileSpecific: true,
            includeProjectLevel: false
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      
      // All tasks should be testing-related
      response.body.data.tasks.forEach((task: any) => {
        expect(['testing', 'test'].some(type => 
          task.type.toLowerCase().includes(type) || 
          task.title.toLowerCase().includes('test')
        )).toBe(true)
      })
    })

    test('should handle custom task templates', async () => {
      const customTemplate = {
        name: 'Custom Task',
        pattern: '*.custom',
        type: 'custom',
        priority: 'high',
        description: 'Custom task for {{ filename }}'
      }

      const response = await request(app)
        .post('/api/task-generator/generate')
        .send({
          path: testDir,
          settings: {
            customTemplates: [customTemplate],
            includeCustom: true
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.tasks).toBeInstanceOf(Array)
    })

    test('should respect task limits', async () => {
      const response = await request(app)
        .post('/api/task-generator/generate')
        .send({
          path: testDir,
          settings: {
            maxTasks: 5,
            taskTypes: ['development', 'testing', 'documentation']
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.tasks.length).toBeLessThanOrEqual(5)
    })

    test('should require directory path', async () => {
      const response = await request(app)
        .post('/api/task-generator/generate')
        .send({
          settings: {}
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Directory path is required')
    })

    test('should validate task generation settings', async () => {
      const response = await request(app)
        .post('/api/task-generator/generate')
        .send({
          path: testDir,
          settings: {
            taskTypes: [], // Empty task types
            maxTasks: -1   // Invalid max tasks
          }
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toContain('Invalid settings')
    })
  })

  describe('POST /api/task-generator/export', () => {
    let generatedTasks: any[]

    beforeEach(async () => {
      // Generate tasks first
      const genResponse = await request(app)
        .post('/api/task-generator/generate')
        .send({
          path: testDir,
          settings: {
            taskTypes: ['development', 'testing'],
            outputFormat: 'markdown'
          }
        })

      generatedTasks = genResponse.body.data.tasks
    })

    test('should export tasks in markdown format', async () => {
      const response = await request(app)
        .post('/api/task-generator/export')
        .send({
          tasks: generatedTasks,
          format: 'markdown',
          options: {
            includeMetadata: true,
            groupByType: true
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.content).toBeDefined()
      expect(response.body.data.format).toBe('markdown')
      expect(response.body.data.filename).toMatch(/\.md$/)
      
      // Check markdown content structure
      const content = response.body.data.content
      expect(content).toContain('# Task List')
      expect(content).toContain('##')
      expect(content).toContain('- [ ]')
    })

    test('should export tasks in JSON format', async () => {
      const response = await request(app)
        .post('/api/task-generator/export')
        .send({
          tasks: generatedTasks,
          format: 'json',
          options: {
            pretty: true
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.format).toBe('json')
      expect(response.body.data.filename).toMatch(/\.json$/)
      
      // Content should be valid JSON
      const parsedContent = JSON.parse(response.body.data.content)
      expect(parsedContent.tasks).toBeInstanceOf(Array)
      expect(parsedContent.metadata).toBeDefined()
    })

    test('should export tasks in CSV format', async () => {
      const response = await request(app)
        .post('/api/task-generator/export')
        .send({
          tasks: generatedTasks,
          format: 'csv',
          options: {
            includeHeaders: true
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.format).toBe('csv')
      expect(response.body.data.filename).toMatch(/\.csv$/)
      
      // Should have CSV headers
      const content = response.body.data.content
      expect(content).toContain('Title,Description,Type,Priority')
    })

    test('should require tasks array', async () => {
      const response = await request(app)
        .post('/api/task-generator/export')
        .send({
          format: 'markdown'
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Tasks array is required')
    })

    test('should validate export format', async () => {
      const response = await request(app)
        .post('/api/task-generator/export')
        .send({
          tasks: generatedTasks,
          format: 'invalid'
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Unsupported export format')
    })

    test('should handle empty tasks array', async () => {
      const response = await request(app)
        .post('/api/task-generator/export')
        .send({
          tasks: [],
          format: 'markdown'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.content).toContain('No tasks to export')
    })
  })

  describe('GET /api/task-generator/templates', () => {
    test('should return available task templates', async () => {
      const response = await request(app)
        .get('/api/task-generator/templates')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.templates).toBeInstanceOf(Array)
      expect(response.body.data.templates.length).toBeGreaterThan(0)

      // Check template structure
      const template = response.body.data.templates[0]
      expect(template).toHaveProperty('id')
      expect(template).toHaveProperty('name')
      expect(template).toHaveProperty('type')
      expect(template).toHaveProperty('pattern')
      expect(template).toHaveProperty('description')
    })

    test('should filter templates by type', async () => {
      const response = await request(app)
        .get('/api/task-generator/templates?type=development')
        .expect(200)

      expect(response.body.success).toBe(true)
      response.body.data.templates.forEach((template: any) => {
        expect(template.type).toBe('development')
      })
    })

    test('should filter templates by framework', async () => {
      const response = await request(app)
        .get('/api/task-generator/templates?framework=react')
        .expect(200)

      expect(response.body.success).toBe(true)
      response.body.data.templates.forEach((template: any) => {
        expect(template.frameworks).toContain('react')
      })
    })
  })

  describe('POST /api/task-generator/validate', () => {
    test('should validate task generation settings', async () => {
      const settings = {
        taskTypes: ['development', 'testing'],
        maxTasks: 50,
        includeFileSpecific: true,
        outputFormat: 'markdown'
      }

      const response = await request(app)
        .post('/api/task-generator/validate')
        .send({ settings })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.isValid).toBe(true)
      expect(response.body.data.warnings).toBeInstanceOf(Array)
    })

    test('should detect invalid settings', async () => {
      const settings = {
        taskTypes: [], // Invalid: empty array
        maxTasks: -5,  // Invalid: negative number
        outputFormat: 'invalid' // Invalid format
      }

      const response = await request(app)
        .post('/api/task-generator/validate')
        .send({ settings })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.isValid).toBe(false)
      expect(response.body.data.errors).toBeInstanceOf(Array)
      expect(response.body.data.errors.length).toBeGreaterThan(0)
    })

    test('should provide suggestions for improvements', async () => {
      const settings = {
        taskTypes: ['development'],
        maxTasks: 1000, // Very high number
        includeFileSpecific: false,
        includeProjectLevel: false
      }

      const response = await request(app)
        .post('/api/task-generator/validate')
        .send({ settings })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.suggestions).toBeInstanceOf(Array)
      expect(response.body.data.suggestions.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    test('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/api/task-generator/analyze')
        .send('invalid json')
        .type('application/json')
        .expect(400)
    })

    test('should handle permission errors gracefully', async () => {
      // Test with a system directory that might have permission issues
      const response = await request(app)
        .post('/api/task-generator/analyze')
        .send({
          path: process.platform === 'win32' ? 'C:\\System Volume Information' : '/root'
        })

      // Should handle gracefully - either succeed with empty results or fail cleanly
      expect([200, 404, 500]).toContain(response.status)
      expect(response.body.success).toBeDefined()
    })

    test('should handle very large projects', async () => {
      // Create a directory with many files
      const largeProjectDir = path.join(testDir, 'large-project')
      await fs.ensureDir(largeProjectDir)
      
      // Create 100 small files
      for (let i = 0; i < 100; i++) {
        await fs.writeFile(
          path.join(largeProjectDir, `file${i}.js`),
          `console.log('File ${i}');`
        )
      }

      const response = await request(app)
        .post('/api/task-generator/analyze')
        .send({
          path: largeProjectDir,
          settings: {
            maxTasks: 50 // Limit tasks to prevent timeout
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.statistics.totalFiles).toBe(100)

      // Cleanup
      await fs.remove(largeProjectDir)
    })
  })

  describe('Performance Tests', () => {
    test('should complete analysis within reasonable time', async () => {
      const startTime = Date.now()
      
      const response = await request(app)
        .post('/api/task-generator/analyze')
        .send({
          path: testDir,
          settings: {
            maxDepth: 3
          }
        })
        .expect(200)

      const duration = Date.now() - startTime
      expect(duration).toBeLessThan(5000) // Should complete within 5 seconds
      expect(response.body.success).toBe(true)
    })

    test('should handle concurrent requests', async () => {
      const requests = Array(3).fill(null).map(() =>
        request(app)
          .post('/api/task-generator/analyze')
          .send({
            path: testDir,
            settings: { maxDepth: 2 }
          })
      )

      const responses = await Promise.all(requests)
      
      responses.forEach(response => {
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
      })
    })
  })
})