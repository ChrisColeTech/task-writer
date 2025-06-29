import express from 'express'
import { ApiResponse } from '../types/api'
import { TaskGenerationService } from '../services/TaskGenerationService'
import { ExportService } from '../services/ExportService'
import { ExportFormat } from '../types/export'

const router = express.Router()
const taskGenerationService = new TaskGenerationService()
const exportService = new ExportService()

/**
 * Generate tasks from directory structure
 * POST /api/tasks/generate
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

    // Generate task using TaskGenerationService
    const taskConfig = {
      framework: settings.framework,
      projectType: settings.projectType,
      platform: settings.platform,
      includeRules: settings.includeRules ?? true,
      includeCommands: settings.includeCommands ?? true,
      complexity: settings.complexity,
      variables: settings.variables || {}
    }

    const taskResult = await taskGenerationService.generateTask(directoryPath, taskConfig)

    return res.json({
      success: true,
      data: {
        task: {
          id: `task-${Date.now()}`,
          content: taskResult.content,
          metadata: taskResult.metadata,
          sections: taskResult.sections,
          complexity: taskResult.estimatedComplexity
        },
        stats: {
          totalSections: taskResult.sections.length,
          estimatedDuration: taskResult.metadata.estimatedDuration,
          outputFiles: taskResult.metadata.outputFiles.length,
          commands: taskResult.metadata.commands.length
        }
      }
    } as ApiResponse)

  } catch (error) {
    console.error('Task generation error:', error)
    return res.status(500).json({
      success: false,
      error: `Failed to generate tasks: ${(error as Error).message}`
    } as ApiResponse)
  }
})

/**
 * Export tasks to files
 * POST /api/tasks/export
 */
router.post('/export', async (req, res) => {
  try {
    const { projectPath, outputPath, formats = ['markdown'], projectName, settings = {} } = req.body

    if (!projectPath) {
      return res.status(400).json({
        success: false,
        error: 'Project path is required'
      } as ApiResponse)
    }

    if (!outputPath) {
      return res.status(400).json({
        success: false,
        error: 'Output path is required'
      } as ApiResponse)
    }

    // Map string formats to ExportFormat enum
    const exportFormats = formats.map((format: string) => {
      const formatMap: Record<string, ExportFormat> = {
        'markdown': ExportFormat.MARKDOWN,
        'batch': ExportFormat.BATCH,
        'powershell': ExportFormat.POWERSHELL,
        'bash': ExportFormat.BASH,
        'python': ExportFormat.PYTHON,
        'json': ExportFormat.JSON,
        'yaml': ExportFormat.YAML
      }
      return formatMap[format.toLowerCase()] || ExportFormat.MARKDOWN
    })

    // Export project using ExportService
    const exportConfig = {
      projectName: projectName || 'project',
      outputDirectory: outputPath,
      formats: exportFormats,
      includeMetadata: settings.includeMetadata ?? true,
      includeReadme: settings.includeReadme ?? true,
      overwriteExisting: settings.overwriteExisting ?? false,
      customVariables: settings.variables || {}
    }

    const exportResult = await exportService.exportProject(projectPath, exportConfig)

    return res.json({
      success: true,
      data: {
        files: exportResult.files.map(f => ({
          filename: f.filename,
          path: f.path,
          format: f.format,
          size: f.size
        })),
        metadata: exportResult.metadata,
        summary: exportResult.summary
      }
    } as ApiResponse)

  } catch (error) {
    console.error('Task export error:', error)
    return res.status(500).json({
      success: false,
      error: `Failed to export tasks: ${(error as Error).message}`
    } as ApiResponse)
  }
})

/**
 * Export single task
 * POST /api/tasks/export-single
 */
router.post('/export-single', async (req, res) => {
  try {
    const { taskContent, outputPath, filename } = req.body

    if (!taskContent) {
      return res.status(400).json({
        success: false,
        error: 'Task content is required'
      } as ApiResponse)
    }

    if (!outputPath) {
      return res.status(400).json({
        success: false,
        error: 'Output path is required'
      } as ApiResponse)
    }

    // Create mock task result for export
    const taskResult = {
      content: taskContent,
      metadata: {
        title: 'Single Task Export',
        version: '1.0',
        type: 'custom' as any,
        category: 'development' as any,
        estimatedDuration: '30 minutes',
        prerequisites: [],
        outputFiles: [],
        commands: [],
        framework: null,
        platform: null
      },
      sections: [],
      estimatedComplexity: 'moderate' as any
    }

    // Export single task file
    const taskFilePath = outputPath.endsWith('.md') ? outputPath : `${outputPath}/${filename || 'task.md'}`
    const exportedFile = await exportService.exportTaskFile(taskResult, taskFilePath)

    return res.json({
      success: true,
      data: {
        file: {
          filename: exportedFile.filename,
          path: exportedFile.path,
          size: exportedFile.size,
          format: exportedFile.format,
          checksum: exportedFile.checksum
        }
      }
    } as ApiResponse)

  } catch (error) {
    console.error('Single task export error:', error)
    return res.status(500).json({
      success: false,
      error: `Failed to export task: ${(error as Error).message}`
    } as ApiResponse)
  }
})

export { router as taskGeneratorRoutes }