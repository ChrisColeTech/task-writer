import request from 'supertest'
import express from 'express'
import cors from 'cors'
import { databaseRoutes } from '../routes/database'
import { fileSystemRoutes } from '../routes/fileSystem'
import { taskGeneratorRoutes } from '../routes/taskGenerator'
import { scaffoldGeneratorRoutes } from '../routes/scaffoldGenerator'
import { DatabaseService } from '../services/DatabaseService'
import fs from 'fs-extra'
import path from 'path'

describe('Integration Tests - Complete API Workflow', () => {
  let app: express.Application
  let testDir: string
  let testDbPath: string
  let dbService: DatabaseService

  beforeAll(async () => {
    // Set up Express app with all routes
    app = express()
    app.use(cors())
    app.use(express.json())
    
    // Mount all routes
    app.use('/api/database', databaseRoutes)
    app.use('/api/filesystem', fileSystemRoutes)
    app.use('/api/task-generator', taskGeneratorRoutes)
    app.use('/api/scaffold-generator', scaffoldGeneratorRoutes)

    // Create test directories
    testDir = path.join(__dirname, '../test-integration')
    testDbPath = path.join(__dirname, '../test-integration-db')
    await fs.ensureDir(testDir)
    await fs.ensureDir(testDbPath)
    
    // Initialize database service
    dbService = new DatabaseService(testDbPath)
    
    await createComplexTestProject()
  })

  afterAll(async () => {
    dbService.close()
    await fs.remove(testDir)
    await fs.remove(testDbPath)
  })

  beforeEach(async () => {
    // Clean up database state before each test
    dbService.clearAllRecentFolders()
    dbService.clearAllRecentProjects()
  })

  async function createComplexTestProject() {
    const files = {
      'package.json': JSON.stringify({
        name: 'integration-test-project',
        version: '1.0.0',
        dependencies: {
          'react': '^18.0.0',
          'express': '^4.18.0',
          'typescript': '^4.9.0',
          'prisma': '^4.0.0'
        },
        scripts: {
          'build': 'tsc',
          'test': 'jest',
          'dev': 'next dev'
        }
      }),
      'README.md': '# Integration Test Project\n\nA complex project for testing the complete workflow.',
      'tsconfig.json': JSON.stringify({
        compilerOptions: {
          target: 'es2020',
          module: 'commonjs',
          strict: true,
          esModuleInterop: true
        }
      }),
      'next.config.js': 'module.exports = { reactStrictMode: true }',
      'tailwind.config.js': 'module.exports = { content: ["./src/**/*.{js,ts,jsx,tsx}"] }',
      
      // Frontend structure
      'src/pages/index.tsx': `
import React from 'react'
import { Button } from '../components/ui/Button'
import { UserList } from '../components/users/UserList'

export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <UserList />
      <Button variant="primary">Get Started</Button>
    </div>
  )
}
      `,
      'src/pages/users/[id].tsx': `
import React from 'react'
import { useRouter } from 'next/router'
import { UserProfile } from '../../components/users/UserProfile'

export default function UserPage() {
  const router = useRouter()
  const { id } = router.query
  
  return <UserProfile userId={id as string} />
}
      `,
      'src/components/ui/Button.tsx': `
import React from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick,
  disabled 
}) => {
  return (
    <button 
      className={\`btn btn-\${variant} btn-\${size}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
      `,
      'src/components/ui/Modal.tsx': `
import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}) => {
  if (!isOpen) return null
  
  return (
    <div className="modal-overlay">
      <div className={\`modal modal-\${size}\`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}
      `,
      'src/components/users/UserList.tsx': `
import React, { useState, useEffect } from 'react'
import { User } from '../../types/User'
import { userService } from '../../services/userService'

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await userService.getUsers()
        setUsers(userData)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-item">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  )
}
      `,
      'src/components/users/UserProfile.tsx': `
import React, { useState, useEffect } from 'react'
import { User } from '../../types/User'
import { userService } from '../../services/userService'

interface UserProfileProps {
  userId: string
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getUser(userId)
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading) return <div>Loading...</div>
  if (!user) return <div>User not found</div>

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Created: {user.createdAt.toLocaleDateString()}</p>
    </div>
  )
}
      `,
      
      // Backend structure
      'src/types/User.ts': `
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
  profile?: UserProfile
}

export interface UserProfile {
  bio?: string
  avatar?: string
  location?: string
}

export interface CreateUserRequest {
  name: string
  email: string
  profile?: Partial<UserProfile>
}
      `,
      'src/types/Product.ts': `
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  inStock: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  category: string
  inStock?: boolean
}
      `,
      'src/services/userService.ts': `
import { User, CreateUserRequest } from '../types/User'

class UserService {
  async getUsers(): Promise<User[]> {
    // Mock implementation
    return []
  }

  async getUser(id: string): Promise<User | null> {
    // Mock implementation
    return null
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    // Mock implementation
    throw new Error('Not implemented')
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    // Mock implementation
    throw new Error('Not implemented')
  }

  async deleteUser(id: string): Promise<void> {
    // Mock implementation
    throw new Error('Not implemented')
  }
}

export const userService = new UserService()
      `,
      'src/services/productService.ts': `
import { Product, CreateProductRequest } from '../types/Product'

class ProductService {
  async getProducts(): Promise<Product[]> {
    return []
  }

  async getProduct(id: string): Promise<Product | null> {
    return null
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    throw new Error('Not implemented')
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    throw new Error('Not implemented')
  }

  async deleteProduct(id: string): Promise<void> {
    throw new Error('Not implemented')
  }
}

export const productService = new ProductService()
      `,
      
      // API routes
      'src/api/users.ts': `
import express from 'express'
import { userService } from '../services/userService'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const users = await userService.getUsers()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

router.post('/', async (req, res) => {
  try {
    const user = await userService.createUser(req.body)
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' })
  }
})

export default router
      `,
      
      // Styles
      'src/styles/globals.css': `
@tailwind base;
@tailwind components;
@tailwind utilities;

.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-secondary {
  @apply bg-gray-600 text-white hover:bg-gray-700;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center;
}

.modal {
  @apply bg-white rounded-lg shadow-xl max-h-full overflow-auto;
}

.modal-sm { @apply max-w-sm; }
.modal-md { @apply max-w-md; }
.modal-lg { @apply max-w-lg; }
.modal-xl { @apply max-w-xl; }
      `,
      
      // Tests
      'src/__tests__/components/Button.test.tsx': `
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Button } from '../../components/ui/Button'

describe('Button', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('applies variant classes', () => {
    render(<Button variant="danger">Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toHaveClass('btn-danger')
  })
})
      `,
      
      // Config files
      'jest.config.js': `
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
      `,
      '.env.example': `
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
      `,
      '.gitignore': `
node_modules/
.next/
dist/
*.log
.env
.env.local
coverage/
      `,
      'prisma/schema.prisma': `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Float
  category    String
  inStock     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("products")
}
      `
    }

    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(testDir, filePath)
      await fs.ensureDir(path.dirname(fullPath))
      await fs.writeFile(fullPath, content.trim())
    }
  }

  describe('Complete Task Generation Workflow', () => {
    test('should complete full task generation workflow', async () => {
      // Step 1: Scan directory structure
      const scanResponse = await request(app)
        .post('/api/filesystem/scan')
        .send({
          path: testDir,
          settings: {
            excludeNodeModules: true,
            maxDepth: 5
          }
        })
        .expect(200)

      expect(scanResponse.body.success).toBe(true)
      expect(scanResponse.body.data.tree).toBeDefined()

      // Step 2: Save recent folder
      const folderResponse = await request(app)
        .post('/api/database/recent-folders')
        .send({
          path: testDir,
          name: 'Integration Test Project',
          type: 'input',
          projectType: 'nextjs'
        })
        .expect(200)

      expect(folderResponse.body.success).toBe(true)

      // Step 3: Analyze project for task generation
      const analyzeResponse = await request(app)
        .post('/api/task-generator/analyze')
        .send({
          path: testDir,
          settings: {
            excludeNodeModules: true,
            analyzePackageJson: true,
            detectFrameworks: true
          }
        })
        .expect(200)

      expect(analyzeResponse.body.success).toBe(true)
      expect(analyzeResponse.body.data.detectedFrameworks).toContain('react')
      expect(analyzeResponse.body.data.detectedFrameworks).toContain('nextjs')

      // Step 4: Generate tasks
      const generateResponse = await request(app)
        .post('/api/task-generator/generate')
        .send({
          path: testDir,
          settings: {
            taskTypes: ['development', 'testing', 'documentation'],
            includeFileSpecific: true,
            includeProjectLevel: true,
            maxTasks: 20
          }
        })
        .expect(200)

      expect(generateResponse.body.success).toBe(true)
      expect(generateResponse.body.data.tasks).toBeInstanceOf(Array)
      expect(generateResponse.body.data.tasks.length).toBeGreaterThan(0)

      // Step 5: Save as recent project
      const projectResponse = await request(app)
        .post('/api/database/recent-projects')
        .send({
          name: 'Integration Test Task Generation',
          inputPath: testDir,
          outputPath: path.join(testDir, 'tasks'),
          settings: generateResponse.body.data.metadata,
          description: 'Generated tasks for integration test project'
        })
        .expect(200)

      expect(projectResponse.body.success).toBe(true)

      // Step 6: Export tasks
      const exportResponse = await request(app)
        .post('/api/task-generator/export')
        .send({
          tasks: generateResponse.body.data.tasks,
          format: 'markdown',
          options: {
            includeMetadata: true,
            groupByType: true
          }
        })
        .expect(200)

      expect(exportResponse.body.success).toBe(true)
      expect(exportResponse.body.data.content).toContain('# Task List')
    })
  })

  describe('Complete Scaffold Generation Workflow', () => {
    test('should complete full scaffold generation workflow', async () => {
      // Step 1: Analyze project for scaffold patterns
      const analyzeResponse = await request(app)
        .post('/api/scaffold-generator/analyze')
        .send({
          path: testDir,
          settings: {
            analyzePatterns: true,
            detectComponents: true,
            detectModels: true,
            detectRoutes: true
          }
        })
        .expect(200)

      expect(analyzeResponse.body.success).toBe(true)
      expect(analyzeResponse.body.data.components).toBeInstanceOf(Array)
      expect(analyzeResponse.body.data.models).toBeInstanceOf(Array)

      // Step 2: Preview scaffold generation
      const previewResponse = await request(app)
        .post('/api/scaffold-generator/preview')
        .send({
          settings: {
            scaffoldType: 'component',
            name: 'IntegrationCard',
            template: 'react-component',
            options: {
              includeStyles: true,
              includeTests: true,
              typescript: true
            }
          }
        })
        .expect(200)

      expect(previewResponse.body.success).toBe(true)
      expect(previewResponse.body.data.previewFiles).toBeInstanceOf(Array)

      // Step 3: Generate scaffold
      const generateResponse = await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          path: testDir,
          settings: {
            scaffoldType: 'component',
            name: 'IntegrationCard',
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

      expect(generateResponse.body.success).toBe(true)
      expect(generateResponse.body.data.generatedFiles).toBeInstanceOf(Array)

      // Step 4: Save as recent project
      const projectResponse = await request(app)
        .post('/api/database/recent-projects')
        .send({
          name: 'Integration Test Scaffold Generation',
          inputPath: testDir,
          outputPath: path.join(testDir, 'generated'),
          settings: generateResponse.body.data.scaffoldInfo,
          description: 'Generated scaffolds for integration test project'
        })
        .expect(200)

      expect(projectResponse.body.success).toBe(true)

      // Step 5: Export scaffolds
      const exportResponse = await request(app)
        .post('/api/scaffold-generator/export')
        .send({
          scaffolds: generateResponse.body.data.generatedFiles,
          format: 'zip',
          options: {
            includeStructure: true,
            preservePaths: true
          }
        })
        .expect(200)

      expect(exportResponse.body.success).toBe(true)
      expect(exportResponse.body.data.filename).toMatch(/\.zip$/)
    })
  })

  describe('Cross-Feature Integration', () => {
    test('should work across multiple features seamlessly', async () => {
      // Step 1: Initialize project analysis
      const scanResponse = await request(app)
        .post('/api/filesystem/scan')
        .send({
          path: testDir,
          settings: { maxDepth: 4 }
        })
        .expect(200)

      // Step 2: Generate tasks based on analysis
      const taskResponse = await request(app)
        .post('/api/task-generator/generate')
        .send({
          path: testDir,
          settings: {
            taskTypes: ['development'],
            maxTasks: 10
          }
        })
        .expect(200)

      // Step 3: Generate scaffolds for identified patterns
      const scaffoldResponse = await request(app)
        .post('/api/scaffold-generator/generate')
        .send({
          path: testDir,
          settings: {
            scaffoldType: 'model',
            name: 'IntegrationModel',
            template: 'typescript-model',
            outputPath: path.join(testDir, 'generated-models')
          }
        })
        .expect(200)

      // Step 4: Save complete workflow as project
      const projectResponse = await request(app)
        .post('/api/database/recent-projects')
        .send({
          name: 'Complete Integration Workflow',
          inputPath: testDir,
          outputPath: path.join(testDir, 'output'),
          settings: {
            tasks: taskResponse.body.data.tasks.length,
            scaffolds: scaffoldResponse.body.data.generatedFiles.length,
            workflow: 'complete'
          },
          description: 'Full workflow test with tasks and scaffolds'
        })
        .expect(200)

      // Step 5: Verify all data is properly stored
      const recentProjectsResponse = await request(app)
        .get('/api/database/recent-projects')
        .expect(200)

      expect(recentProjectsResponse.body.data.length).toBeGreaterThan(0)
      
      const project = recentProjectsResponse.body.data.find(
        (p: any) => p.name === 'Complete Integration Workflow'
      )
      expect(project).toBeDefined()
      expect(project.settings.tasks).toBeGreaterThan(0)
      expect(project.settings.scaffolds).toBeGreaterThan(0)
    })

    test('should handle error recovery across features', async () => {
      // Step 1: Attempt invalid operation
      const invalidTaskResponse = await request(app)
        .post('/api/task-generator/generate')
        .send({
          path: '/invalid/path',
          settings: {}
        })
        .expect(404)

      expect(invalidTaskResponse.body.success).toBe(false)

      // Step 2: Recover with valid operation
      const validResponse = await request(app)
        .post('/api/filesystem/scan')
        .send({
          path: testDir,
          settings: { maxDepth: 2 }
        })
        .expect(200)

      expect(validResponse.body.success).toBe(true)

      // Step 3: Continue workflow normally
      const taskResponse = await request(app)
        .post('/api/task-generator/generate')
        .send({
          path: testDir,
          settings: {
            taskTypes: ['testing'],
            maxTasks: 5
          }
        })
        .expect(200)

      expect(taskResponse.body.success).toBe(true)
      expect(taskResponse.body.data.tasks.length).toBeGreaterThan(0)
    })
  })

  describe('Database Persistence Integration', () => {
    test('should persist and retrieve data across multiple operations', async () => {
      const testProjectName = 'Persistence Test Project'
      
      // Step 1: Add recent folder
      await request(app)
        .post('/api/database/recent-folders')
        .send({
          path: testDir,
          name: testProjectName,
          type: 'input'
        })
        .expect(200)

      // Step 2: Add project
      await request(app)
        .post('/api/database/recent-projects')
        .send({
          name: testProjectName,
          inputPath: testDir,
          outputPath: path.join(testDir, 'output'),
          settings: { test: true },
          description: 'Test project for persistence'
        })
        .expect(200)

      // Step 3: Update settings
      await request(app)
        .put('/api/database/settings')
        .send({
          settings: {
            lastProject: testProjectName,
            autoSave: 'true',
            theme: 'dark'
          }
        })
        .expect(200)

      // Step 4: Verify all data persists
      const foldersResponse = await request(app)
        .get('/api/database/recent-folders')
        .expect(200)

      const projectsResponse = await request(app)
        .get('/api/database/recent-projects')
        .expect(200)

      const settingsResponse = await request(app)
        .get('/api/database/settings')
        .expect(200)

      // Verify data integrity
      expect(foldersResponse.body.data.some(
        (f: any) => f.name === testProjectName
      )).toBe(true)

      expect(projectsResponse.body.data.some(
        (p: any) => p.name === testProjectName
      )).toBe(true)

      const themeSettings = settingsResponse.body.data.find(
        (s: any) => s.key === 'theme'
      )
      expect(themeSettings.value).toBe('dark')
    })
  })

  describe('Performance and Scalability', () => {
    test('should handle large project analysis efficiently', async () => {
      const startTime = Date.now()

      // Analyze the complex project
      const analyzeResponse = await request(app)
        .post('/api/task-generator/analyze')
        .send({
          path: testDir,
          settings: {
            maxDepth: 5,
            analyzePackageJson: true,
            detectFrameworks: true
          }
        })
        .expect(200)

      const analyzeDuration = Date.now() - startTime

      // Generate tasks
      const taskStartTime = Date.now()
      const taskResponse = await request(app)
        .post('/api/task-generator/generate')
        .send({
          path: testDir,
          settings: {
            taskTypes: ['development', 'testing', 'documentation'],
            maxTasks: 30
          }
        })
        .expect(200)

      const taskDuration = Date.now() - taskStartTime

      // Verify performance benchmarks
      expect(analyzeDuration).toBeLessThan(10000) // 10 seconds
      expect(taskDuration).toBeLessThan(15000) // 15 seconds
      expect(analyzeResponse.body.success).toBe(true)
      expect(taskResponse.body.success).toBe(true)
      expect(taskResponse.body.data.tasks.length).toBeGreaterThan(0)
    })

    test('should handle concurrent requests without conflicts', async () => {
      const concurrentRequests = [
        request(app).post('/api/filesystem/scan').send({ path: testDir }),
        request(app).get('/api/database/recent-folders'),
        request(app).get('/api/database/settings'),
        request(app).post('/api/task-generator/analyze').send({ 
          path: testDir, 
          settings: { maxDepth: 2 } 
        }),
        request(app).get('/api/scaffold-generator/templates')
      ]

      const responses = await Promise.all(concurrentRequests)

      responses.forEach((response, index) => {
        expect([200, 404]).toContain(response.status)
        if (response.status === 200) {
          expect(response.body.success).toBe(true)
        }
      })
    })
  })
})