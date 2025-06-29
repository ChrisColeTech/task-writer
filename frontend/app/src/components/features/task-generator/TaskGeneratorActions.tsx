import React from 'react'
import { Play, Download } from 'lucide-react'
import { GeneratorActions, type QueueItem } from '@/components/shared/generators'
import type { GenerationStats, GenerationProgress } from '@/services/TaskGeneratorService'

interface TaskGeneratorActionsProps {
  generating: boolean
  progress: GenerationProgress
  queueItems: QueueItem[]
  generationStats: GenerationStats
  canGenerate: boolean
  canExport: boolean
  onStartGeneration: () => void
  onExportTasks: () => void
}

/**
 * Component for task generator actions and progress
 * Uses shared GeneratorActions component with task-specific customization
 * Follows architecture guide principles:
 * - Single responsibility: Task-specific action configuration
 * - Under 150 lines (now much smaller via composition)
 * - Clean props interface
 * - Reuses shared components
 */
const TaskGeneratorActions: React.FC<TaskGeneratorActionsProps> = ({
  generating,
  progress,
  queueItems,
  generationStats,
  canGenerate,
  canExport,
  onStartGeneration,
  onExportTasks,
}) => {
  return (
    <GeneratorActions
      generating={generating}
      progress={progress}
      queueItems={queueItems}
      generationStats={generationStats}
      canGenerate={canGenerate}
      canExport={canExport}
      onStartGeneration={onStartGeneration}
      onExportItems={onExportTasks}
      generateButtonText="Generate Tasks"
      generateButtonIcon={Play}
      exportButtonText="Export Tasks"
      exportButtonIcon={Download}
      progressLabel="Generation Progress"
      statsTitle="Generation Statistics"
      statsConfig={[
        { key: 'totalTasks', label: 'Total Tasks' },
        { key: 'completedTasks', label: 'Completed' },
        { key: 'totalFiles', label: 'Total Files' },
        { key: 'processedFiles', label: 'Processed' },
      ]}
      emptyStateMessage="Please select an input directory to begin task generation"
      generatingMessage="🔄 Analyzing directory structure and generating tasks..."
    />
  )
}

export default TaskGeneratorActions