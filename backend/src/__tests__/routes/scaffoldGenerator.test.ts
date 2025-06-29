import request from 'supertest'
import express from 'express'
import { scaffoldGeneratorRoutes } from '../../routes/scaffoldGenerator'
import fs from 'fs-extra'
import path from 'path'

describe('ScaffoldGenerator Routes', () => {
  let app: express.Application
  let testDir: string

  beforeAll(async () => {
    app = express()
    app.use(express.json())
    app.use('/api/scaffold-generator', scaffoldGeneratorRoutes)

    // Create test directory
    testDir = path.join(__dirname, '../../test-routes-scaffold-generator')
    await fs.ensureDir(testDir)
    await createTestProject()
  })

  afterAll(async () => {
    await fs.remove(testDir)
  })

  async function createTestProject() {
    const files = {
      'package.json': JSON.stringify({
        name: 'test-scaffold-project',
        version: '1.0.0',
        dependencies: {
          'react': '^18.0.0',
          'express': '^4.18.0',
          'typescript': '^4.9.0'
        }
      }),
      'README.md': '# Scaffold Test Project\n\nTest project for scaffold generation.',
      'src/models/User.ts': `
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

export class UserService {
  async getUser(id: string): Promise<User | null> {
    // Implementation here
    return null
  }
}
      `,
      'src/models/Product.ts': `
export interface Product {
  id: string
  name: string
  price: number
  category: string
}

export class ProductService {
  async getProduct(id: string): Promise<Product | null> {
    return null
  }
}
      `,
      'src/components/Button.tsx': `
import React from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', children }) => {
  return <button className={\`btn btn-\${variant} btn-\${size}\`}>{children}</button>
}
      `,
      'src/components/Modal.tsx': `
import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
      `,
      'src/api/userRoutes.ts': `
import express from 'express'
import { UserService } from '../models/User'

const router = express.Router()
const userService = new UserService()

router.get('/:id', async (req, res) => {
  const user = await userService.getUser(req.params.id)
  res.json(user)
})

export default router
      `,
      'src/styles/components.css': `
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}
      `
    }

    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(testDir, filePath)
      await fs.ensureDir(path.dirname(fullPath))
      await fs.writeFile(fullPath, content.trim())
    }
  }

  describe('POST /api/scaffold-generator/analyze', () => {
    test('should analyze project for scaffold patterns', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/analyze')
        .send({
          path: testDir,
          settings: {
            analyzePatterns: true,
            detectComponents: true,
            detectModels: true,
            detectRoutes: true,
            maxDepth: 5
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.detectedPatterns).toBeInstanceOf(Array)
      expect(response.body.data.components).toBeInstanceOf(Array)
      expect(response.body.data.models).toBeInstanceOf(Array)
      expect(response.body.data.routes).toBeInstanceOf(Array)
      expect(response.body.data.suggestions).toBeDefined()

      // Should detect React components
      const componentNames = response.body.data.components.map((c: any) => c.name)
      expect(componentNames).toContain('Button')
      expect(componentNames).toContain('Modal')

      // Should detect models
      const modelNames = response.body.data.models.map((m: any) => m.name)
      expect(modelNames).toContain('User')
      expect(modelNames).toContain('Product')
    })

    test('should require directory path', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/analyze')
        .send({
          settings: {}
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Directory path is required')
    })

    test('should handle non-existent directory', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/analyze')
        .send({
          path: '/non/existent/path',
          settings: {}
        })
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Directory not found or not accessible')
    })

    test('should detect different scaffold types', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/analyze')
        .send({
          path: testDir,
          settings: {
            scaffoldTypes: ['component', 'model', 'route', 'service'],
            analyzeExisting: true
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.scaffoldOpportunities).toBeInstanceOf(Array)
      
      const opportunities = response.body.data.scaffoldOpportunities
      const types = opportunities.map((opp: any) => opp.type)
      expect(types).toContain('component')
      expect(types).toContain('model')
    })
  })

  describe('POST /api/scaffold-generator/generate', () => {
    test('should generate scaffold files', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          path: testDir,
          settings: {
            scaffoldType: 'component',
            name: 'Card',
            template: 'react-component',
            outputPath: path.join(testDir, 'generated'),
            options: {
              includeStyles: true,
              includeTests: true,
              typescript: true
            }
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.generatedFiles).toBeInstanceOf(Array)
      expect(response.body.data.generatedFiles.length).toBeGreaterThan(0)
      expect(response.body.data.scaffoldInfo).toBeDefined()

      // Check generated file structure
      const files = response.body.data.generatedFiles
      const fileNames = files.map((f: any) => f.name)
      expect(fileNames.some(name => name.includes('Card'))).toBe(true)
    })

    test('should generate model scaffold', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          path: testDir,
          settings: {
            scaffoldType: 'model',
            name: 'Order',
            template: 'typescript-model',
            outputPath: path.join(testDir, 'generated'),
            options: {
              includeService: true,
              includeValidation: true,
              includeTypes: true
            }
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      
      const files = response.body.data.generatedFiles
      expect(files.some((f: any) => f.name.includes('Order'))).toBe(true)
      expect(files.some((f: any) => f.type === 'model')).toBe(true)
    })

    test('should generate route scaffold', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          path: testDir,
          settings: {
            scaffoldType: 'route',
            name: 'orders',
            template: 'express-route',
            outputPath: path.join(testDir, 'generated'),
            options: {
              includeCrud: true,
              includeMiddleware: true,
              includeValidation: true
            }
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      
      const files = response.body.data.generatedFiles
      expect(files.some((f: any) => f.name.includes('orders'))).toBe(true)
      expect(files.some((f: any) => f.type === 'route')).toBe(true)
    })

    test('should require scaffold settings', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          path: testDir
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Scaffold settings are required')
    })

    test('should validate scaffold name', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          path: testDir,
          settings: {
            scaffoldType: 'component',
            name: '', // Empty name
            template: 'react-component'
          }
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Scaffold name is required')
    })

    test('should validate scaffold type', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          path: testDir,
          settings: {
            scaffoldType: 'invalid',
            name: 'Test',
            template: 'react-component'
          }
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Invalid scaffold type')
    })

    test('should apply custom templates', async () => {
      const customTemplate = {
        name: 'custom-component',
        type: 'component',
        files: [
          {
            name: '{{ name }}.tsx',
            content: 'import React from "react"\n\nexport const {{ name }} = () => {\n  return <div>{{ name }}</div>\n}'
          }
        ]
      }

      const response = await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          path: testDir,
          settings: {
            scaffoldType: 'component',
            name: 'CustomCard',
            customTemplate,
            outputPath: path.join(testDir, 'generated')
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      
      const files = response.body.data.generatedFiles
      expect(files[0].content).toContain('CustomCard')
    })
  })

  describe('POST /api/scaffold-generator/preview', () => {
    test('should preview scaffold generation', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/preview')
        .send({
          settings: {
            scaffoldType: 'component',
            name: 'PreviewCard',
            template: 'react-component',
            options: {
              includeStyles: true,
              includeTests: true
            }
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.previewFiles).toBeInstanceOf(Array)
      expect(response.body.data.previewFiles.length).toBeGreaterThan(0)

      // Check preview structure
      const previewFile = response.body.data.previewFiles[0]
      expect(previewFile).toHaveProperty('name')
      expect(previewFile).toHaveProperty('content')
      expect(previewFile).toHaveProperty('type')
    })

    test('should preview with different templates', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/preview')
        .send({
          settings: {
            scaffoldType: 'model',
            name: 'PreviewModel',
            template: 'typescript-model',
            options: {
              includeService: true
            }
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      
      const files = response.body.data.previewFiles
      expect(files.some((f: any) => f.name.includes('PreviewModel'))).toBe(true)
    })

    test('should require scaffold settings for preview', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/preview')
        .send({})
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Scaffold settings are required')
    })
  })

  describe('GET /api/scaffold-generator/templates', () => {
    test('should return available scaffold templates', async () => {
      const response = await request(app)
        .get('/api/scaffold-generator/templates')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.templates).toBeInstanceOf(Array)
      expect(response.body.data.templates.length).toBeGreaterThan(0)

      // Check template structure
      const template = response.body.data.templates[0]
      expect(template).toHaveProperty('id')
      expect(template).toHaveProperty('name')
      expect(template).toHaveProperty('type')
      expect(template).toHaveProperty('description')
      expect(template).toHaveProperty('files')
    })

    test('should filter templates by type', async () => {
      const response = await request(app)
        .get('/api/scaffold-generator/templates?type=component')
        .expect(200)

      expect(response.body.success).toBe(true)
      response.body.data.templates.forEach((template: any) => {
        expect(template.type).toBe('component')
      })
    })

    test('should filter templates by framework', async () => {
      const response = await request(app)
        .get('/api/scaffold-generator/templates?framework=react')
        .expect(200)

      expect(response.body.success).toBe(true)
      response.body.data.templates.forEach((template: any) => {
        expect(template.frameworks).toContain('react')
      })
    })
  })

  describe('POST /api/scaffold-generator/export', () => {
    let generatedScaffolds: any[]

    beforeEach(async () => {
      // Generate scaffolds first
      const genResponse = await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          path: testDir,
          settings: {
            scaffoldType: 'component',
            name: 'ExportCard',
            template: 'react-component'
          }
        })

      generatedScaffolds = genResponse.body.data.generatedFiles
    })

    test('should export scaffolds as zip file', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/export')
        .send({
          scaffolds: generatedScaffolds,
          format: 'zip',
          options: {
            includeStructure: true,
            preservePaths: true
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.downloadUrl).toBeDefined()
      expect(response.body.data.filename).toMatch(/\.zip$/)
      expect(response.body.data.size).toBeGreaterThan(0)
    })

    test('should export scaffolds as individual files', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/export')
        .send({
          scaffolds: generatedScaffolds,
          format: 'files',
          options: {
            flatStructure: true
          }
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.files).toBeInstanceOf(Array)
      expect(response.body.data.files.length).toBe(generatedScaffolds.length)
    })

    test('should require scaffolds array', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/export')
        .send({
          format: 'zip'
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Scaffolds array is required')
    })

    test('should validate export format', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/export')
        .send({
          scaffolds: generatedScaffolds,
          format: 'invalid'
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Unsupported export format')
    })
  })

  describe('POST /api/scaffold-generator/validate', () => {
    test('should validate scaffold generation settings', async () => {
      const settings = {
        scaffoldType: 'component',
        name: 'ValidCard',
        template: 'react-component',
        options: {
          includeStyles: true,
          typescript: true
        }
      }

      const response = await request(app)
        .post('/api/scaffold-generator/validate')
        .send({ settings })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.isValid).toBe(true)
      expect(response.body.data.warnings).toBeInstanceOf(Array)
    })

    test('should detect invalid settings', async () => {
      const settings = {
        scaffoldType: 'invalid',
        name: '', // Invalid: empty name
        template: 'nonexistent'
      }

      const response = await request(app)
        .post('/api/scaffold-generator/validate')
        .send({ settings })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.isValid).toBe(false)
      expect(response.body.data.errors).toBeInstanceOf(Array)
      expect(response.body.data.errors.length).toBeGreaterThan(0)
    })

    test('should validate naming conventions', async () => {
      const settings = {
        scaffoldType: 'component',
        name: 'invalid-component-name!', // Invalid characters
        template: 'react-component'
      }

      const response = await request(app)
        .post('/api/scaffold-generator/validate')
        .send({ settings })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.isValid).toBe(false)
      expect(response.body.data.errors.some((err: any) => 
        err.includes('name') || err.includes('naming')
      )).toBe(true)
    })
  })

  describe('Error Handling', () => {
    test('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/analyze')
        .send('invalid json')
        .type('application/json')
        .expect(400)
    })

    test('should handle permission errors gracefully', async () => {
      const response = await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          path: testDir,
          settings: {
            scaffoldType: 'component',
            name: 'TestCard',
            template: 'react-component',
            outputPath: '/root/no-permission' // Directory we can't write to
          }
        })

      // Should handle gracefully
      expect([200, 403, 500]).toContain(response.status)
      if (response.status === 500) {
        expect(response.body.success).toBe(false)
        expect(response.body.error).toContain('permission')
      }
    })

    test('should handle existing file conflicts', async () => {
      // First, generate a scaffold
      await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          path: testDir,
          settings: {
            scaffoldType: 'component',
            name: 'ConflictCard',
            template: 'react-component',
            outputPath: path.join(testDir, 'generated')
          }
        })

      // Try to generate the same scaffold again
      const response = await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          path: testDir,
          settings: {
            scaffoldType: 'component',
            name: 'ConflictCard',
            template: 'react-component',
            outputPath: path.join(testDir, 'generated'),
            options: {
              overwriteExisting: false
            }
          }
        })

      // Should either succeed with warning or fail with conflict error
      if (response.status === 200) {
        expect(response.body.data.warnings).toBeDefined()
      } else {
        expect(response.status).toBe(409)
        expect(response.body.error).toContain('already exists')
      }
    })
  })

  describe('Performance Tests', () => {
    test('should complete analysis within reasonable time', async () => {
      const startTime = Date.now()
      
      const response = await request(app)
        .post('/api/scaffold-generator/analyze')
        .send({
          path: testDir,
          settings: {
            maxDepth: 3,
            analyzePatterns: true
          }
        })
        .expect(200)

      const duration = Date.now() - startTime
      expect(duration).toBeLessThan(5000) // Should complete within 5 seconds
      expect(response.body.success).toBe(true)
    })

    test('should handle multiple scaffold generations', async () => {
      const requests = Array(3).fill(null).map((_, index) =>
        request(app)
          .post('/api/scaffold-generator/generate')
          .send({
            path: testDir,
            settings: {
              scaffoldType: 'component',
              name: `MultiCard${index}`,
              template: 'react-component',
              outputPath: path.join(testDir, `generated-${index}`)
            }
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