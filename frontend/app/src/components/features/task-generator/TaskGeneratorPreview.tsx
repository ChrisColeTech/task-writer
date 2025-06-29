import React from 'react'
import { X, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FilePreview } from '@/components/ui/FilePreview'
import type { GeneratedTask } from '@/services/TaskGeneratorService'

interface TaskGeneratorPreviewProps {
  previewTask: GeneratedTask | null
  onClosePreview: () => void
  onExportTask: (task: GeneratedTask) => void
}

/**
 * Component for previewing generated task content
 * Follows architecture guide principles:
 * - Single responsibility: Task content preview
 * - Under 150 lines
 * - Clean props interface
 * - No business logic
 */
const TaskGeneratorPreview: React.FC<TaskGeneratorPreviewProps> = ({
  previewTask,
  onClosePreview,
  onExportTask,
}) => {
  if (!previewTask) {
    return null
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-surface app-border-l shadow-lg z-30 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 app-border-b">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text truncate" title={previewTask.name}>
            {previewTask.name}
          </h3>
          <p className="text-sm text-text-muted mt-1">Task Preview</p>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            onClick={() => onExportTask(previewTask)}
            variant="secondary"
            size="sm"
            title="Export this task"
          >
            <Download className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onClosePreview}
            variant="secondary"
            size="sm"
            title="Close preview"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Task Metadata */}
      <div className="p-4 app-border-b bg-background">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Directory:</span>
            <span className="text-text font-mono text-xs">{previewTask.directory}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Files:</span>
            <span className="text-text">{previewTask.fileCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Size:</span>
            <span className="text-text">{(previewTask.size / 1024).toFixed(1)} KB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Created:</span>
            <span className="text-text">{previewTask.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      {/* Content Preview */}
      <div className="flex-1 overflow-hidden">
        <FilePreview
          file={{
            name: `${previewTask.name}.md`,
            path: `${previewTask.name}.md`,
            content: previewTask.content,
            language: 'markdown',
            size: previewTask.content.length,
            lastModified: new Date()
          }}
          className="h-full"
        />
      </div>
      
      {/* Footer Actions */}
      <div className="p-4 app-border-t bg-background">
        <Button
          onClick={() => onExportTask(previewTask)}
          variant="primary"
          size="md"
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Task
        </Button>
      </div>
    </div>
  )
}

export default TaskGeneratorPreview