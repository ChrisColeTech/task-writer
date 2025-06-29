import express from 'express'
import { DatabaseService } from '../services/DatabaseService'
import { ApiResponse } from '../types/api'

const router = express.Router()
let dbService: DatabaseService

// Initialize database service
try {
  dbService = new DatabaseService()
  console.log('📊 Database service initialized')
} catch (error) {
  console.error('❌ Failed to initialize database:', error)
}

// ==================== SETTINGS ROUTES ====================

/**
 * Get all settings or by category
 * GET /api/database/settings?category=appearance
 */
router.get('/settings', (req, res) => {
  try {
    const { category } = req.query
    const settings = dbService.getSettings(category as string)
    
    return res.json({
      success: true,
      data: settings
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to get settings'
    } as ApiResponse)
  }
})

/**
 * Get single setting by key
 * GET /api/database/settings/:key
 */
router.get('/settings/:key', (req, res) => {
  try {
    const { key } = req.params
    const setting = dbService.getSetting(key)
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found'
      } as ApiResponse)
    }
    
    return res.json({
      success: true,
      data: setting
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to get setting'
    } as ApiResponse)
  }
})

/**
 * Set setting value
 * POST /api/database/settings
 */
router.post('/settings', (req, res) => {
  try {
    const { key, value, type, category } = req.body
    
    if (!key) {
      return res.status(400).json({
        success: false,
        error: 'Setting key is required'
      } as ApiResponse)
    }
    
    dbService.setSetting(key, value, type, category)
    
    return res.json({
      success: true,
      message: 'Setting saved successfully'
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to save setting'
    } as ApiResponse)
  }
})

/**
 * Update multiple settings at once
 * PUT /api/database/settings
 */
router.put('/settings', (req, res) => {
  try {
    const { settings } = req.body
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Settings object is required'
      } as ApiResponse)
    }
    
    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      dbService.setSetting(key, value)
    }
    
    return res.json({
      success: true,
      message: `${Object.keys(settings).length} settings updated successfully`
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update settings'
    } as ApiResponse)
  }
})

/**
 * Delete setting
 * DELETE /api/database/settings/:key
 */
router.delete('/settings/:key', (req, res) => {
  try {
    const { key } = req.params
    const deleted = dbService.deleteSetting(key)
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found'
      } as ApiResponse)
    }
    
    return res.json({
      success: true,
      message: 'Setting deleted successfully'
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete setting'
    } as ApiResponse)
  }
})

// ==================== RECENT FOLDERS ROUTES ====================

/**
 * Get recent folders
 * GET /api/database/recent-folders?limit=10&type=input
 */
router.get('/recent-folders', (req, res) => {
  try {
    const { limit, type } = req.query
    const folders = dbService.getRecentFolders(
      limit ? parseInt(limit as string) : undefined,
      type as any
    )
    
    return res.json({
      success: true,
      data: folders
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to get recent folders'
    } as ApiResponse)
  }
})

/**
 * Get favorite folders
 * GET /api/database/favorite-folders
 */
router.get('/favorite-folders', (req, res) => {
  try {
    const folders = dbService.getFavoriteFolders()
    
    return res.json({
      success: true,
      data: folders
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to get favorite folders'
    } as ApiResponse)
  }
})

/**
 * Add recent folder
 * POST /api/database/recent-folders
 */
router.post('/recent-folders', (req, res) => {
  try {
    const { path, name, type, projectType, favorite } = req.body
    
    if (!path || !name) {
      return res.status(400).json({
        success: false,
        error: 'Path and name are required'
      } as ApiResponse)
    }
    
    dbService.addRecentFolder({
      path,
      name,
      type: type || 'input',
      projectType,
      favorite: favorite || false
    })
    
    return res.json({
      success: true,
      message: 'Recent folder added successfully'
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to add recent folder'
    } as ApiResponse)
  }
})

/**
 * Toggle folder favorite
 * PUT /api/database/recent-folders/:path/favorite
 */
router.put('/recent-folders/favorite', (req, res) => {
  try {
    const { path } = req.body
    
    if (!path) {
      return res.status(400).json({
        success: false,
        error: 'Path is required'
      } as ApiResponse)
    }
    
    const isFavorite = dbService.toggleFavoriteFolder(path)
    
    return res.json({
      success: true,
      data: { favorite: isFavorite },
      message: `Folder ${isFavorite ? 'added to' : 'removed from'} favorites`
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to toggle favorite'
    } as ApiResponse)
  }
})

/**
 * Remove recent folder
 * DELETE /api/database/recent-folders
 */
router.delete('/recent-folders', (req, res) => {
  try {
    const { path } = req.body
    
    if (!path) {
      return res.status(400).json({
        success: false,
        error: 'Path is required'
      } as ApiResponse)
    }
    
    const deleted = dbService.removeRecentFolder(path)
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Folder not found'
      } as ApiResponse)
    }
    
    return res.json({
      success: true,
      message: 'Recent folder removed successfully'
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to remove recent folder'
    } as ApiResponse)
  }
})

// ==================== RECENT PROJECTS ROUTES ====================

/**
 * Get recent projects
 * GET /api/database/recent-projects?limit=15
 */
router.get('/recent-projects', (req, res) => {
  try {
    const { limit } = req.query
    const projects = dbService.getRecentProjects(
      limit ? parseInt(limit as string) : undefined
    )
    
    return res.json({
      success: true,
      data: projects
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to get recent projects'
    } as ApiResponse)
  }
})

/**
 * Add recent project
 * POST /api/database/recent-projects
 */
router.post('/recent-projects', (req, res) => {
  try {
    const { name, inputPath, outputPath, settings, description } = req.body
    
    if (!name || !inputPath) {
      return res.status(400).json({
        success: false,
        error: 'Name and input path are required'
      } as ApiResponse)
    }
    
    dbService.addRecentProject({
      name,
      inputPath,
      outputPath,
      settings: settings || {},
      description
    })
    
    return res.json({
      success: true,
      message: 'Recent project added successfully'
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to add recent project'
    } as ApiResponse)
  }
})

/**
 * Remove recent project
 * DELETE /api/database/recent-projects
 */
router.delete('/recent-projects', (req, res) => {
  try {
    const { inputPath } = req.body
    
    if (!inputPath) {
      return res.status(400).json({
        success: false,
        error: 'Input path is required'
      } as ApiResponse)
    }
    
    const deleted = dbService.removeRecentProject(inputPath)
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      } as ApiResponse)
    }
    
    return res.json({
      success: true,
      message: 'Recent project removed successfully'
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to remove recent project'
    } as ApiResponse)
  }
})

// ==================== UTILITY ROUTES ====================

/**
 * Get database statistics
 * GET /api/database/stats
 */
router.get('/stats', (req, res) => {
  try {
    const stats = dbService.getStats()
    
    return res.json({
      success: true,
      data: stats
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to get database stats'
    } as ApiResponse)
  }
})

/**
 * Clear all data (reset)
 * POST /api/database/reset
 */
router.post('/reset', (req, res) => {
  try {
    dbService.clearAllData()
    
    return res.json({
      success: true,
      message: 'Database reset successfully'
    } as ApiResponse)
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to reset database'
    } as ApiResponse)
  }
})

// Export the router and database service for use in other parts of the app
export { router as databaseRoutes, dbService }