import React from 'react'
import { Zap, Download } from 'lucide-react'
import { GeneratorActions, type QueueItem } from '@/components/shared/generators'
import type { ScaffoldGenerationStats, ScaffoldGenerationProgress } from '@/services/ScaffoldGeneratorService'

interface ScaffoldGeneratorActionsProps {
  generating: boolean
  progress: ScaffoldGenerationProgress
  queueItems: QueueItem[]
  generationStats: ScaffoldGenerationStats
  canGenerate: boolean
  canExport: boolean
  onStartGeneration: () => void
  onExportScaffolds: () => void
}

/**
 * Component for scaffold generator actions and progress
 * Uses shared GeneratorActions component with scaffold-specific customization
 * Follows architecture guide principles:
 * - Single responsibility: Scaffold-specific action configuration
 * - Under 150 lines (now much smaller via composition)
 * - Clean props interface
 * - Reuses shared components
 */
const ScaffoldGeneratorActions: React.FC<ScaffoldGeneratorActionsProps> = ({
  generating,
  progress,
  queueItems,
  generationStats,
  canGenerate,
  canExport,
  onStartGeneration,
  onExportScaffolds,
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
      onExportItems={onExportScaffolds}
      generateButtonText="Generate Scaffolds"
      generateButtonIcon={Zap}
      exportButtonText="Export Scaffolds"
      exportButtonIcon={Download}
      progressLabel="Generation Progress"
      statsTitle="Generation Statistics"
      statsConfig={[
        { key: 'totalScripts', label: 'Total Scripts' },
        { key: 'completedScripts', label: 'Completed' },
        { key: 'totalFiles', label: 'Total Files' },
        { key: 'totalDirectories', label: 'Directories' },
      ]}
      emptyStateMessage="Please select an input directory to begin scaffold generation"
      generatingMessage="⚡ Analyzing directory structure and generating scaffold scripts..."
    />
  )
}

export default ScaffoldGeneratorActions