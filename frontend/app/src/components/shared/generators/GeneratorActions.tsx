import React from 'react'
import { LucideIcon, Play } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { QueueList, type QueueItem } from '@/components/ui/QueueList'

interface GenerationProgress {
  current: number
  total: number
}

interface GenerationStats {
  [key: string]: number // Flexible stats object
}

interface GeneratorActionsProps {
  generating: boolean
  progress: GenerationProgress
  queueItems: QueueItem[]
  generationStats: GenerationStats
  canGenerate: boolean
  canExport: boolean
  onStartGeneration: () => void
  onExportItems: () => void
  // Customization props
  generateButtonText?: string
  generateButtonIcon?: LucideIcon
  exportButtonText?: string
  exportButtonIcon?: LucideIcon
  progressLabel?: string
  statsTitle?: string
  statsConfig: Array<{
    key: string
    label: string
  }>
  emptyStateMessage?: string
  generatingMessage?: string
}

/**
 * Shared component for generator actions and progress
 * Used by both Task and Scaffold generators
 * Follows architecture guide principles:
 * - Single responsibility: Generation actions and progress display
 * - Under 200 lines
 * - Clean props interface with customization options
 * - Reusable across different generator types
 * - Feature card pattern compliance
 */
const GeneratorActions: React.FC<GeneratorActionsProps> = ({
  generating,
  progress,
  queueItems,
  generationStats,
  canGenerate,
  canExport,
  onStartGeneration,
  onExportItems,
  generateButtonText = "Generate",
  generateButtonIcon,
  exportButtonText = "Export",
  exportButtonIcon,
  progressLabel = "Generation Progress",
  statsTitle = "Generation Statistics",
  statsConfig,
  emptyStateMessage = "Please select an input directory to begin generation",
  generatingMessage = "🔄 Analyzing directory structure and generating...",
}) => {
  const GenerateIcon = generateButtonIcon
  const ExportIcon = exportButtonIcon
  const hasStats = Object.values(generationStats).some(value => value > 0)
  const prefersReducedMotion = useReducedMotion()

  const cardVariants = {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
  }

  return (
    <motion.article
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="bg-surface app-border overflow-hidden transition-all duration-300 group motion-safe:hover:shadow-theme motion-safe:hover:scale-[1.02]"
      aria-labelledby="actions-title"
      role="region"
    >
      {/* Feature Card Header */}
      <div className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b">
        <div className="flex items-center gap-3">
          <div className="page-icon transition-transform duration-300 motion-safe:group-hover:scale-110" role="img" aria-hidden="true">
            <Play className="w-6 h-6 text-accent motion-safe:group-hover:text-accent-hover transition-colors" />
          </div>
          <h2 id="actions-title" className="text-xl font-semibold text-text">
            Generation & Export
          </h2>
        </div>
      </div>
      
      {/* Feature Card Content */}
      <div className="p-6 space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onStartGeneration}
          disabled={!canGenerate}
          variant="primary"
          size="md"
          className="flex-1"
        >
          {GenerateIcon && <GenerateIcon className="w-4 h-4 mr-2" />}
          {generating ? 'Generating...' : generateButtonText}
        </Button>
        
        <Button
          onClick={onExportItems}
          disabled={!canExport}
          variant="secondary"
          size="md"
          className="flex-1"
        >
          {ExportIcon && <ExportIcon className="w-4 h-4 mr-2" />}
          {exportButtonText}
        </Button>
      </div>

      {/* Progress Indicator */}
      {generating && progress.total > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text">{progressLabel}</span>
            <span className="text-sm text-text-muted">
              {progress.current} of {progress.total}
            </span>
          </div>
          <ProgressBar
            value={(progress.current / progress.total) * 100}
            max={100}
            className="w-full"
          />
        </div>
      )}

      {/* Generation Statistics */}
      {(hasStats || generating) && (
        <div className="p-4 bg-surface app-border rounded-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 text-accent">
              ✓
            </div>
            <h4 className="font-semibold text-text">{statsTitle}</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            {statsConfig.map(({ key, label }) => (
              <div key={key}>
                <span className="text-text-muted">{label}:</span>
                <span className="font-semibold text-text ml-2">
                  {generationStats[key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing Queue */}
      {queueItems.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-text">Processing Queue</h4>
          <div className="max-h-48 overflow-auto">
            <QueueList
              items={queueItems}
              onRetry={(itemId) => {
                // Retry functionality would be handled by parent component
                console.log('Retry:', itemId)
              }}
              onRemove={(itemId) => {
                // Remove functionality would be handled by parent component
                console.log('Remove:', itemId)
              }}
            />
          </div>
        </div>
      )}

        {/* Status Messages */}
        {!canGenerate && !generating && (
          <div className="p-3 bg-surface app-border rounded-md">
            <p className="text-sm text-text-muted">
              {emptyStateMessage}
            </p>
          </div>
        )}
        
        {generating && (
          <div className="p-3 bg-surface app-border rounded-md">
            <p className="text-sm text-text">
              {generatingMessage}
            </p>
          </div>
        )}
      </div>
    </motion.article>
  )
}

export default GeneratorActions