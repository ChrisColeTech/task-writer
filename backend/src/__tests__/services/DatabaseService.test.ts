import { DatabaseService } from '../../services/DatabaseService'
import { createTestDatabase, cleanupTestDatabase, mockSettings, mockFolders, mockProjects } from '../setup'

describe('DatabaseService', () => {
  let db: DatabaseService

  beforeEach(() => {
    db = createTestDatabase()
  })

  afterEach(() => {
    cleanupTestDatabase(db)
  })

  describe('Settings Management', () => {
    test('should get default settings on initialization', () => {
      const settings = db.getSettings()
      expect(settings.length).toBeGreaterThan(0)
      
      // Check for some default settings
      const themeSet = settings.find(s => s.key === 'theme')
      expect(themeSet).toBeDefined()
      expect(themeSet?.value).toBe('system')
      
      const sidebarSet = settings.find(s => s.key === 'sidebarPosition')
      expect(sidebarSet).toBeDefined()
      expect(sidebarSet?.value).toBe('left')
    })

    test('should set and get individual settings', () => {
      const { key, value, type, category } = mockSettings.theme
      
      db.setSetting(key, value, type, category)
      const setting = db.getSetting(key)
      
      expect(setting).toBeDefined()
      expect(setting?.key).toBe(key)
      expect(setting?.value).toBe(value)
      expect(setting?.type).toBe(type)
      expect(setting?.category).toBe(category)
    })

    test('should update existing settings', () => {
      const key = 'theme'
      
      // Set initial value
      db.setSetting(key, 'light')
      let setting = db.getSetting(key)
      expect(setting?.value).toBe('light')
      
      // Update value
      db.setSetting(key, 'dark')
      setting = db.getSetting(key)
      expect(setting?.value).toBe('dark')
    })

    test('should get settings by category', () => {
      db.setSetting('theme', 'dark', 'string', 'appearance')
      db.setSetting('autoSave', 'true', 'boolean', 'behavior')
      
      const appearanceSettings = db.getSettings('appearance')
      const behaviorSettings = db.getSettings('behavior')
      
      expect(appearanceSettings.some(s => s.key === 'theme')).toBe(true)
      expect(behaviorSettings.some(s => s.key === 'autoSave')).toBe(true)
      expect(appearanceSettings.some(s => s.key === 'autoSave')).toBe(false)
    })

    test('should delete settings', () => {
      const key = 'testSetting'
      db.setSetting(key, 'testValue')
      
      expect(db.getSetting(key)).toBeDefined()
      
      const deleted = db.deleteSetting(key)
      expect(deleted).toBe(true)
      expect(db.getSetting(key)).toBeNull()
    })

    test('should return false when deleting non-existent setting', () => {
      const deleted = db.deleteSetting('nonExistentKey')
      expect(deleted).toBe(false)
    })

    test('should handle JSON settings', () => {
      const key = 'complexSetting'
      const value = { theme: 'dark', sidebar: { position: 'left', width: 300 } }
      
      db.setSetting(key, value, 'json')
      const setting = db.getSetting(key)
      
      expect(setting?.value).toBe(JSON.stringify(value))
      expect(setting?.type).toBe('json')
    })
  })

  describe('Recent Folders Management', () => {
    test('should add and retrieve recent folders', () => {
      const folder = mockFolders.inputFolder
      db.addRecentFolder(folder)
      
      const folders = db.getRecentFolders()
      expect(folders.length).toBe(1)
      expect(folders[0].path).toBe(folder.path)
      expect(folders[0].name).toBe(folder.name)
      expect(folders[0].type).toBe(folder.type)
    })

    test('should update existing folder when added again', () => {
      const folder = mockFolders.inputFolder
      
      // Add folder first time
      db.addRecentFolder(folder)
      let folders = db.getRecentFolders()
      expect(folders[0].useCount).toBe(1)
      
      // Add same folder again
      db.addRecentFolder(folder)
      folders = db.getRecentFolders()
      expect(folders.length).toBe(1)
      expect(folders[0].useCount).toBe(2)
    })

    test('should filter folders by type', () => {
      db.addRecentFolder(mockFolders.inputFolder)
      db.addRecentFolder(mockFolders.outputFolder)
      
      const inputFolders = db.getRecentFolders(10, 'input')
      const outputFolders = db.getRecentFolders(10, 'output')
      
      expect(inputFolders.length).toBe(1)
      expect(outputFolders.length).toBe(1)
      expect(inputFolders[0].type).toBe('input')
      expect(outputFolders[0].type).toBe('output')
    })

    test('should manage favorite folders', () => {
      const folder = mockFolders.inputFolder
      db.addRecentFolder(folder)
      
      // Toggle to favorite
      const isFavorite = db.toggleFavoriteFolder(folder.path)
      expect(isFavorite).toBe(true)
      
      const favorites = db.getFavoriteFolders()
      expect(favorites.length).toBe(1)
      expect(favorites[0].favorite).toBe(true)
      
      // Toggle back to not favorite
      const isNotFavorite = db.toggleFavoriteFolder(folder.path)
      expect(isNotFavorite).toBe(false)
    })

    test('should remove folders', () => {
      const folder = mockFolders.inputFolder
      db.addRecentFolder(folder)
      
      expect(db.getRecentFolders().length).toBe(1)
      
      const removed = db.removeRecentFolder(folder.path)
      expect(removed).toBe(true)
      expect(db.getRecentFolders().length).toBe(0)
    })

    test('should limit recent folders count', () => {
      // Set max to 3 for testing
      db.setSetting('maxRecentFolders', '3', 'number')
      
      // Add 5 folders
      for (let i = 0; i < 5; i++) {
        db.addRecentFolder({
          path: `/test/folder${i}`,
          name: `Folder ${i}`,
          type: 'input',
          favorite: false
        })
      }
      
      const folders = db.getRecentFolders()
      expect(folders.length).toBe(3)
    })

    test('should not remove favorite folders during cleanup', () => {
      // Set max to 2 for testing
      db.setSetting('maxRecentFolders', '2', 'number')
      
      // Add 3 folders, make first one favorite
      db.addRecentFolder({ ...mockFolders.inputFolder, path: '/test/folder1', name: 'Folder 1' })
      db.toggleFavoriteFolder('/test/folder1')
      
      db.addRecentFolder({ ...mockFolders.inputFolder, path: '/test/folder2', name: 'Folder 2' })
      db.addRecentFolder({ ...mockFolders.inputFolder, path: '/test/folder3', name: 'Folder 3' })
      
      const folders = db.getRecentFolders()
      const favorites = db.getFavoriteFolders()
      
      expect(favorites.length).toBe(1)
      expect(folders.some(f => f.path === '/test/folder1')).toBe(true)
    })
  })

  describe('Recent Projects Management', () => {
    test('should add and retrieve recent projects', () => {
      const project = mockProjects.reactProject
      db.addRecentProject(project)
      
      const projects = db.getRecentProjects()
      expect(projects.length).toBe(1)
      expect(projects[0].name).toBe(project.name)
      expect(projects[0].inputPath).toBe(project.inputPath)
      expect(projects[0].settings).toEqual(project.settings)
    })

    test('should update existing project when added again', () => {
      const project = mockProjects.reactProject
      
      // Add project first time
      db.addRecentProject(project)
      
      // Update project
      const updatedProject = {
        ...project,
        name: 'Updated React App',
        description: 'Updated description'
      }
      db.addRecentProject(updatedProject)
      
      const projects = db.getRecentProjects()
      expect(projects.length).toBe(1)
      expect(projects[0].name).toBe('Updated React App')
      expect(projects[0].description).toBe('Updated description')
    })

    test('should remove projects', () => {
      const project = mockProjects.reactProject
      db.addRecentProject(project)
      
      expect(db.getRecentProjects().length).toBe(1)
      
      const removed = db.removeRecentProject(project.inputPath)
      expect(removed).toBe(true)
      expect(db.getRecentProjects().length).toBe(0)
    })

    test('should limit recent projects count', () => {
      // Set max to 3 for testing
      db.setSetting('maxRecentProjects', '3', 'number')
      
      // Add 5 projects
      for (let i = 0; i < 5; i++) {
        db.addRecentProject({
          name: `Project ${i}`,
          inputPath: `/test/project${i}`,
          settings: {}
        })
      }
      
      const projects = db.getRecentProjects()
      expect(projects.length).toBe(3)
    })

    test('should order projects by last opened', () => {
      // Add projects with slight delay to ensure different timestamps
      db.addRecentProject({ ...mockProjects.reactProject, name: 'First' })
      
      // Small delay
      setTimeout(() => {
        db.addRecentProject({ ...mockProjects.nodeProject, name: 'Second' })
        
        const projects = db.getRecentProjects()
        expect(projects[0].name).toBe('Second') // Most recent first
        expect(projects[1].name).toBe('First')
      }, 10)
    })
  })

  describe('Database Statistics and Utilities', () => {
    test('should provide accurate statistics', () => {
      // Add some data
      db.setSetting('testSetting', 'value')
      db.addRecentFolder(mockFolders.inputFolder)
      db.addRecentProject(mockProjects.reactProject)
      
      const stats = db.getStats()
      
      expect(stats.settings).toBeGreaterThan(0) // Has default settings + test setting
      expect(stats.recentFolders).toBe(1)
      expect(stats.recentProjects).toBe(1)
    })

    test('should clear all data except default settings', () => {
      // Add some data
      db.setSetting('testSetting', 'value')
      db.addRecentFolder(mockFolders.inputFolder)
      db.addRecentProject(mockProjects.reactProject)
      
      let stats = db.getStats()
      expect(stats.recentFolders).toBe(1)
      expect(stats.recentProjects).toBe(1)
      
      // Clear all data
      db.clearAllData()
      
      stats = db.getStats()
      expect(stats.recentFolders).toBe(0)
      expect(stats.recentProjects).toBe(0)
      expect(stats.settings).toBeGreaterThan(0) // Default settings should remain
      
      // Test setting should be gone
      expect(db.getSetting('testSetting')).toBeNull()
      
      // Default settings should still exist
      expect(db.getSetting('theme')).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    test('should handle database close gracefully', () => {
      expect(() => db.close()).not.toThrow()
    })

    test('should return null for non-existent settings', () => {
      const setting = db.getSetting('nonExistentKey')
      expect(setting).toBeNull()
    })

    test('should return false for operations on non-existent data', () => {
      expect(db.deleteSetting('nonExistent')).toBe(false)
      expect(db.removeRecentFolder('nonExistent')).toBe(false)
      expect(db.removeRecentProject('nonExistent')).toBe(false)
    })
  })
})