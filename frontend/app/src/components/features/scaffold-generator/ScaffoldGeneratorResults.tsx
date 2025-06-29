import React from 'react'
import { Terminal, Eye, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { GeneratedScaffold } from '@/services/ScaffoldGeneratorService'

interface ScaffoldGeneratorResultsProps {
  generatedScaffolds: GeneratedScaffold[]
  hasGeneratedScaffolds: boolean
  onPreviewScaffold: (scaffold: GeneratedScaffold) => void
  onExportSingleScaffold: (scaffold: GeneratedScaffold) => void
}

/**
 * Component for displaying generated scaffold results
 * Follows architecture guide principles:
 * - Single responsibility: Scaffold results display and actions
 * - Under 150 lines
 * - Clean props interface
 * - No business logic
 */
const ScaffoldGeneratorResults: React.FC<ScaffoldGeneratorResultsProps> = ({
  generatedScaffolds,
  hasGeneratedScaffolds,
  onPreviewScaffold,
  onExportSingleScaffold,
}) => {
  if (!hasGeneratedScaffolds) {
    return (
      <div className="text-center py-12">
        <div className="page-icon mx-auto mb-4 opacity-50">
          <Terminal className="w-12 h-12 text-text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">No Scaffolds Generated</h3>
        <p className="text-text-muted">
          Select a directory and click "Generate Scaffolds" to create scaffold scripts
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Generated Scaffolds</h3>
        <span className="text-sm text-text-muted">
          {generatedScaffolds.length} scaffold{generatedScaffolds.length !== 1 ? 's' : ''} created
        </span>
      </div>

      <div className="grid gap-4">
        {generatedScaffolds.map((scaffold) => (
          <div
            key={scaffold.id}
            className="p-4 app-border rounded-md bg-surface hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-4 h-4 text-accent flex-shrink-0" />
                  <h4 className="font-semibold text-text truncate" title={scaffold.name}>
                    {scaffold.name}
                  </h4>
                  <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded font-mono">
                    {scaffold.format}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-text-muted">
                  <div className="flex items-center gap-4">
                    <span>OS: {scaffold.os}</span>
                    <span>Files: {scaffold.fileCount}</span>
                    <span>Dirs: {scaffold.directoryCount}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Size: {(scaffold.size / 1024).toFixed(1)} KB</span>
                    <span>Created: {scaffold.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  onClick={() => onPreviewScaffold(scaffold)}
                  variant="secondary"
                  size="sm"
                  title="Preview scaffold content"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={() => onExportSingleScaffold(scaffold)}
                  variant="secondary"
                  size="sm"
                  title="Export this scaffold"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {scaffold.content && (
              <div className="mt-3 p-3 bg-background rounded text-sm">
                <div className="text-text-muted mb-1">Script preview:</div>
                <div className="text-text font-mono text-xs max-h-20 overflow-hidden">
                  {scaffold.content.substring(0, 200)}
                  {scaffold.content.length > 200 && '...'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScaffoldGeneratorResults