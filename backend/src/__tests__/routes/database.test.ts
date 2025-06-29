import request from 'supertest'
import express from 'express'
import { databaseRoutes } from '../../routes/database'
import { DatabaseService } from '../../services/DatabaseService'
import { createTestDatabase, cleanupTestDatabase } from '../setup'

// Mock the database service
jest.mock('../../routes/database', () => {
  let testDb: DatabaseService | undefined
  
  const mockDatabaseRoutes = jest.requireActual('../../routes/database').databaseRoutes
  
  // Override the database service initialization
  beforeEach(() => {
    testDb = createTestDatabase()
  })
  
  afterEach(() => {
    if (testDb) {
      cleanupTestDatabase(testDb)
    }
  })
  
  return {
    databaseRoutes: mockDatabaseRoutes,
    get dbService() { return testDb; }
  }
})

describe('Database Routes', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use('/api/database', databaseRoutes)
  })

  describe('Settings Routes', () => {
    describe('GET /api/database/settings', () => {
      test('should return all settings', async () => {
        const response = await request(app)
          .get('/api/database/settings')
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data.length).toBeGreaterThan(0)
      })

      test('should filter settings by category', async () => {
        const response = await request(app)
          .get('/api/database/settings?category=appearance')
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(Array.isArray(response.body.data)).toBe(true)
        
        // All returned settings should be in appearance category
        response.body.data.forEach((setting: any) => {
          expect(setting.category).toBe('appearance')
        })
      })
    })

    describe('GET /api/database/settings/:key', () => {
      test('should return specific setting', async () => {
        const response = await request(app)
          .get('/api/database/settings/theme')
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.data.key).toBe('theme')
      })

      test('should return 404 for non-existent setting', async () => {
        const response = await request(app)
          .get('/api/database/settings/nonexistent')
          .expect(404)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Setting not found')
      })
    })

    describe('POST /api/database/settings', () => {
      test('should create new setting', async () => {
        const newSetting = {
          key: 'testSetting',
          value: 'testValue',
          type: 'string',
          category: 'general'
        }

        const response = await request(app)
          .post('/api/database/settings')
          .send(newSetting)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.message).toContain('saved successfully')

        // Verify setting was created
        const getResponse = await request(app)
          .get('/api/database/settings/testSetting')
          .expect(200)

        expect(getResponse.body.data.value).toBe('testValue')
      })

      test('should require setting key', async () => {
        const response = await request(app)
          .post('/api/database/settings')
          .send({ value: 'test' })
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Setting key is required')
      })
    })

    describe('PUT /api/database/settings', () => {
      test('should update multiple settings', async () => {
        const settings = {
          theme: 'dark',
          sidebarPosition: 'right',
          newSetting: 'newValue'
        }

        const response = await request(app)
          .put('/api/database/settings')
          .send({ settings })
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.message).toContain('3 settings updated')

        // Verify settings were updated
        const themeResponse = await request(app)
          .get('/api/database/settings/theme')
          .expect(200)
        expect(themeResponse.body.data.value).toBe('dark')
      })

      test('should require settings object', async () => {
        const response = await request(app)
          .put('/api/database/settings')
          .send({})
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Settings object is required')
      })
    })

    describe('DELETE /api/database/settings/:key', () => {
      test('should delete existing setting', async () => {
        // First create a setting
        await request(app)
          .post('/api/database/settings')
          .send({ key: 'deleteme', value: 'test' })

        // Then delete it
        const response = await request(app)
          .delete('/api/database/settings/deleteme')
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.message).toContain('deleted successfully')

        // Verify it's gone
        await request(app)
          .get('/api/database/settings/deleteme')
          .expect(404)
      })

      test('should return 404 for non-existent setting', async () => {
        const response = await request(app)
          .delete('/api/database/settings/nonexistent')
          .expect(404)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Setting not found')
      })
    })
  })

  describe('Recent Folders Routes', () => {
    const testFolder = {
      path: '/test/folder',
      name: 'Test Folder',
      type: 'input',
      projectType: 'react'
    }

    describe('POST /api/database/recent-folders', () => {
      test('should add recent folder', async () => {
        const response = await request(app)
          .post('/api/database/recent-folders')
          .send(testFolder)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.message).toContain('added successfully')
      })

      test('should require path and name', async () => {
        const response = await request(app)
          .post('/api/database/recent-folders')
          .send({ type: 'input' })
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Path and name are required')
      })
    })

    describe('GET /api/database/recent-folders', () => {
      beforeEach(async () => {
        // Add test folder
        await request(app)
          .post('/api/database/recent-folders')
          .send(testFolder)
      })

      test('should return recent folders', async () => {
        const response = await request(app)
          .get('/api/database/recent-folders')
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data.length).toBeGreaterThan(0)
      })

      test('should filter by type', async () => {
        const response = await request(app)
          .get('/api/database/recent-folders?type=input')
          .expect(200)

        expect(response.body.success).toBe(true)
        response.body.data.forEach((folder: any) => {
          expect(['input', 'both']).toContain(folder.type)
        })
      })

      test('should limit results', async () => {
        const response = await request(app)
          .get('/api/database/recent-folders?limit=1')
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.data.length).toBeLessThanOrEqual(1)
      })
    })

    describe('PUT /api/database/recent-folders/favorite', () => {
      beforeEach(async () => {
        await request(app)
          .post('/api/database/recent-folders')
          .send(testFolder)
      })

      test('should toggle favorite status', async () => {
        const response = await request(app)
          .put('/api/database/recent-folders/favorite')
          .send({ path: testFolder.path })
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(typeof response.body.data.favorite).toBe('boolean')
      })

      test('should require path', async () => {
        const response = await request(app)
          .put('/api/database/recent-folders/favorite')
          .send({})
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Path is required')
      })
    })

    describe('DELETE /api/database/recent-folders', () => {
      beforeEach(async () => {
        await request(app)
          .post('/api/database/recent-folders')
          .send(testFolder)
      })

      test('should remove recent folder', async () => {
        const response = await request(app)
          .delete('/api/database/recent-folders')
          .send({ path: testFolder.path })
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.message).toContain('removed successfully')
      })

      test('should require path', async () => {
        const response = await request(app)
          .delete('/api/database/recent-folders')
          .send({})
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Path is required')
      })
    })
  })

  describe('Recent Projects Routes', () => {
    const testProject = {
      name: 'Test Project',
      inputPath: '/test/project',
      outputPath: '/test/output',
      settings: { framework: 'react' },
      description: 'Test project description'
    }

    describe('POST /api/database/recent-projects', () => {
      test('should add recent project', async () => {
        const response = await request(app)
          .post('/api/database/recent-projects')
          .send(testProject)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.message).toContain('added successfully')
      })

      test('should require name and inputPath', async () => {
        const response = await request(app)
          .post('/api/database/recent-projects')
          .send({ description: 'test' })
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Name and input path are required')
      })
    })

    describe('GET /api/database/recent-projects', () => {
      beforeEach(async () => {
        await request(app)
          .post('/api/database/recent-projects')
          .send(testProject)
      })

      test('should return recent projects', async () => {
        const response = await request(app)
          .get('/api/database/recent-projects')
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data.length).toBeGreaterThan(0)
      })

      test('should limit results', async () => {
        const response = await request(app)
          .get('/api/database/recent-projects?limit=1')
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.data.length).toBeLessThanOrEqual(1)
      })
    })

    describe('DELETE /api/database/recent-projects', () => {
      beforeEach(async () => {
        await request(app)
          .post('/api/database/recent-projects')
          .send(testProject)
      })

      test('should remove recent project', async () => {
        const response = await request(app)
          .delete('/api/database/recent-projects')
          .send({ inputPath: testProject.inputPath })
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.message).toContain('removed successfully')
      })

      test('should require inputPath', async () => {
        const response = await request(app)
          .delete('/api/database/recent-projects')
          .send({})
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Input path is required')
      })
    })
  })

  describe('Utility Routes', () => {
    describe('GET /api/database/stats', () => {
      test('should return database statistics', async () => {
        const response = await request(app)
          .get('/api/database/stats')
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(typeof response.body.data.settings).toBe('number')
        expect(typeof response.body.data.recentFolders).toBe('number')
        expect(typeof response.body.data.recentProjects).toBe('number')
      })
    })

    describe('POST /api/database/reset', () => {
      test('should reset database', async () => {
        // Add some data first
        await request(app)
          .post('/api/database/recent-folders')
          .send({
            path: '/test',
            name: 'Test',
            type: 'input'
          })

        // Reset database
        const response = await request(app)
          .post('/api/database/reset')
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.message).toContain('reset successfully')

        // Verify data is cleared
        const statsResponse = await request(app)
          .get('/api/database/stats')
          .expect(200)

        expect(statsResponse.body.data.recentFolders).toBe(0)
        expect(statsResponse.body.data.recentProjects).toBe(0)
      })
    })
  })
})