import express from 'express'
import { FileSystemService } from '../services/FileSystemService'
import { ApiResponse } from '../types/api'

const router = express.Router()
const fileSystemService = new FileSystemService()

/**
 * Scan directory and return tree structure
 * POST /api/filesystem/scan
 */
router.post('/scan', async (req, res) => {
  try {
    const { path: directoryPath, settings = {} } = req.body

    if (!directoryPath) {
      return res.status(400).json({
        success: false,
        error: 'Directory path is required'
      } as ApiResponse)
    }

    // Validate path exists
    const isValid = await fileSystemService.validatePath(directoryPath)
    if (!isValid) {
      return res.status(404).json({
        success: false,
        error: 'Directory not found or not accessible'
      } as ApiResponse)
    }

    // Scan directory
    const result = await fileSystemService.scanDirectory(directoryPath, settings)

    return res.json({
      success: true,
      data: result
    } as ApiResponse)

  } catch (error) {
    console.error('Directory scan error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to scan directory',
      message: (error as Error).message
    } as ApiResponse)
  }
})

/**
 * Validate if a path exists
 * POST /api/filesystem/validate
 */
router.post('/validate', async (req, res) => {
  try {
    const { path: targetPath } = req.body

    if (!targetPath) {
      return res.status(400).json({
        success: false,
        error: 'Path is required'
      } as ApiResponse)
    }

    const isValid = await fileSystemService.validatePath(targetPath)

    return res.json({
      success: true,
      data: { isValid }
    } as ApiResponse)

  } catch (error) {
    return res.status
    console.error('Path validation error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to validate path'
    } as ApiResponse)
  }
})

/**
 * Get file content
 * POST /api/filesystem/file-content
 */
router.post('/file-content', async (req, res) => {
  try {
    const { path: filePath, maxSize } = req.body

    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: 'File path is required'
      } as ApiResponse)
    }

    const content = await fileSystemService.getFileContent(filePath, maxSize)

    return res.json({
      success: true,
      data: { content }
    } as ApiResponse)

  } catch (error) {
    console.error('File read error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to read file',
      message: (error as Error).message
    } as ApiResponse)
  }
})

export { router as fileSystemRoutes }