import express from 'express'
import { ApiResponse } from '../types/api'
import { ScaffoldGenerationService } from '../services/ScaffoldGenerationService'
import { Platform, ScriptFormat } from '../types/scaffoldGeneration'

const router = express.Router()
const scaffoldGenerationService = new ScaffoldGenerationService()

/**
 * Generate scaffolds from directory structure
 * POST /api/scaffolds/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { path: directoryPath, settings = {} } = req.body

    if (!directoryPath) {
      return res.status(400).json({
        success: false,
        error: 'Directory path is required'
      } as ApiResponse)
    }

    // Map platform strings to Platform enum
    const platforms = (settings.platforms || ['windows', 'macos', 'linux']).map((p: string) => {
      const platformMap: Record<string, Platform> = {
        'windows': Platform.WINDOWS,
        'macos': Platform.MACOS,
        'linux': Platform.LINUX,
        'cross-platform': Platform.CROSS_PLATFORM
      }
      return platformMap[p.toLowerCase()] || Platform.CROSS_PLATFORM
    })

    // Map format strings to ScriptFormat enum
    const formats = (settings.formats || ['batch', 'bash', 'powershell']).map((f: string) => {
      const formatMap: Record<string, ScriptFormat> = {
        'batch': ScriptFormat.BATCH,
        'powershell': ScriptFormat.POWERSHELL,
        'bash': ScriptFormat.BASH,
        'zsh': ScriptFormat.ZSH,
        'python': ScriptFormat.PYTHON,
        'node': ScriptFormat.NODE,
        'docker': ScriptFormat.DOCKER,
        'makefile': ScriptFormat.MAKE
      }
      return formatMap[f.toLowerCase()] || ScriptFormat.BASH
    })

    // Generate scaffolds using ScaffoldGenerationService
    const scaffoldConfig = {
      projectName: settings.projectName || 'project',
      framework: settings.framework,
      projectType: settings.projectType,
      platforms,
      formats,
      includeCleanup: settings.includeCleanup ?? false,
      includeValidation: settings.includeValidation ?? true,
      customCommands: settings.customCommands || [],
      variables: settings.variables || {}
    }

    const scaffoldResult = await scaffoldGenerationService.generateScaffolds(directoryPath, scaffoldConfig)

    return res.json({
      success: true,
      data: {
        scripts: scaffoldResult.scripts.map(script => ({
          filename: script.filename,
          platform: script.platform,
          format: script.format,
          content: script.content,
          executable: script.executable,
          size: script.content.length
        })),
        metadata: scaffoldResult.metadata,
        summary: scaffoldResult.summary
      }
    } as ApiResponse)

  } catch (error) {
    console.error('Scaffold generation error:', error)
    return res.status(500).json({
      success: false,
      error: `Failed to generate scaffolds: ${(error as Error).message}`
    } as ApiResponse)
  }
})

/**
 * Export scaffolds to files
 * POST /api/scaffolds/export
 */
router.post('/export', async (req, res) => {
  try {
    const { config, outputPath } = req.body

    if (!config || !config.projectName) {
      return res.status(400).json({
        success: false,
        error: 'Scaffold config with project name is required'
      } as ApiResponse)
    }

    if (!outputPath) {
      return res.status(400).json({
        success: false,
        error: 'Output path is required'
      } as ApiResponse)
    }

    // Map configuration
    const platforms = (config.platforms || ['windows', 'linux']).map((p: string) => {
      const platformMap: Record<string, Platform> = {
        'windows': Platform.WINDOWS,
        'macos': Platform.MACOS,
        'linux': Platform.LINUX
      }
      return platformMap[p.toLowerCase()] || Platform.CROSS_PLATFORM
    })

    const formats = (config.formats || ['batch', 'bash']).map((f: string) => {
      const formatMap: Record<string, ScriptFormat> = {
        'batch': ScriptFormat.BATCH,
        'bash': ScriptFormat.BASH,
        'powershell': ScriptFormat.POWERSHELL,
        'python': ScriptFormat.PYTHON
      }
      return formatMap[f.toLowerCase()] || ScriptFormat.BASH
    })

    const scaffoldConfig = {
      ...config,
      platforms,
      formats
    }

    // Generate and save scaffolds
    const scaffoldResult = await scaffoldGenerationService.generateFromConfig(scaffoldConfig)
    
    // Here we would actually write files to disk
    // For now, return the generated scripts
    return res.json({
      success: true,
      data: {
        outputDirectory: outputPath,
        files: scaffoldResult.scripts.map(script => ({
          filename: script.filename,
          path: `${outputPath}/${script.filename}`,
          size: script.content.length,
          platform: script.platform,
          format: script.format
        })),
        summary: scaffoldResult.summary
      }
    } as ApiResponse)

  } catch (error) {
    console.error('Scaffold export error:', error)
    return res.status(500).json({
      success: false,
      error: `Failed to export scaffolds: ${(error as Error).message}`
    } as ApiResponse)
  }
})

/**
 * Export single scaffold
 * POST /api/scaffolds/export-single
 */
router.post('/export-single', async (req, res) => {
  try {
    const { scaffold, outputPath } = req.body

    if (!scaffold) {
      return res.status(400).json({
        success: false,
        error: 'Scaffold is required'
      } as ApiResponse)
    }

    // TODO: Implement single scaffold export logic
    return res.json({
      success: true,
      data: {
        success: true,
        filePath: outputPath || 'default-output/scaffold.sh'
      }
    } as ApiResponse)

  } catch (error) {
    console.error('Single scaffold export error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to export scaffold'
    } as ApiResponse)
  }
})

export { router as scaffoldGeneratorRoutes }