import React from 'react'
import { FileText, Eye, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { GeneratedTask } from '@/services/TaskGeneratorService'

interface TaskGeneratorResultsProps {
  generatedTasks: GeneratedTask[]
  hasGeneratedTasks: boolean
  onPreviewTask: (task: GeneratedTask) => void
  onExportSingleTask: (task: GeneratedTask) => void
}

/**
 * Component for displaying generated task results
 * Follows architecture guide principles:
 * - Single responsibility: Task results display and actions
 * - Under 150 lines
 * - Clean props interface
 * - No business logic
 */
const TaskGeneratorResults: React.FC<TaskGeneratorResultsProps> = ({
  generatedTasks,
  hasGeneratedTasks,
  onPreviewTask,
  onExportSingleTask,
}) => {
  if (!hasGeneratedTasks) {
    return (
      <div className="text-center py-12">
        <div className="page-icon mx-auto mb-4 opacity-50">
          <FileText className="w-12 h-12 text-text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">No Tasks Generated</h3>
        <p className="text-text-muted">
          Select a directory and click "Generate Tasks" to create task files
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Generated Tasks</h3>
        <span className="text-sm text-text-muted">
          {generatedTasks.length} task{generatedTasks.length !== 1 ? 's' : ''} created
        </span>
      </div>

      <div className="grid gap-4">
        {generatedTasks.map((task) => (
          <div
            key={task.id}
            className="p-4 app-border rounded-md bg-surface hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-accent flex-shrink-0" />
                  <h4 className="font-semibold text-text truncate" title={task.name}>
                    {task.name}
                  </h4>
                </div>
                
                <div className="space-y-1 text-sm text-text-muted">
                  <div className="flex items-center gap-4">
                    <span>Directory: {task.directory}</span>
                    <span>Files: {task.fileCount}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Size: {(task.size / 1024).toFixed(1)} KB</span>
                    <span>Created: {task.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  onClick={() => onPreviewTask(task)}
                  variant="secondary"
                  size="sm"
                  title="Preview task content"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={() => onExportSingleTask(task)}
                  variant="secondary"
                  size="sm"
                  title="Export this task"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {task.content && (
              <div className="mt-3 p-3 bg-background rounded text-sm">
                <div className="text-text-muted mb-1">Content preview:</div>
                <div className="text-text font-mono text-xs max-h-20 overflow-hidden">
                  {task.content.substring(0, 200)}
                  {task.content.length > 200 && '...'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskGeneratorResults