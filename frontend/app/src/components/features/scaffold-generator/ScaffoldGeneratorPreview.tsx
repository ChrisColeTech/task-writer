import React from 'react'
import { X, Download, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FilePreview } from '@/components/ui/FilePreview'
import type { GeneratedScaffold } from '@/services/ScaffoldGeneratorService'

interface ScaffoldGeneratorPreviewProps {
  previewScaffold: GeneratedScaffold | null
  onClosePreview: () => void
  onExportScaffold: (scaffold: GeneratedScaffold) => void
}

/**
 * Component for previewing generated scaffold content
 * Follows architecture guide principles:
 * - Single responsibility: Scaffold content preview
 * - Under 150 lines
 * - Clean props interface
 * - No business logic
 */
const ScaffoldGeneratorPreview: React.FC<ScaffoldGeneratorPreviewProps> = ({
  previewScaffold,
  onClosePreview,
  onExportScaffold,
}) => {
  if (!previewScaffold) {
    return null
  }

  // Determine the language for syntax highlighting based on format
  const getLanguage = (format: string): string => {
    switch (format) {
      case 'bash':
      case 'zsh':
      case 'fish':
        return 'bash'
      case 'powershell':
        return 'powershell'
      case 'batch':
        return 'batch'
      case 'python':
        return 'python'
      case 'nodejs':
        return 'javascript'
      case 'ruby':
        return 'ruby'
      case 'perl':
        return 'perl'
      default:
        return 'bash'
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-surface app-border-l shadow-lg z-30 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 app-border-b">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-text truncate" title={previewScaffold.name}>
              {previewScaffold.name}
            </h3>
            <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded font-mono">
              {previewScaffold.format}
            </span>
          </div>
          <p className="text-sm text-text-muted">Scaffold Preview</p>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            onClick={() => onExportScaffold(previewScaffold)}
            variant="secondary"
            size="sm"
            title="Export this scaffold"
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
      
      {/* Scaffold Metadata */}
      <div className="p-4 app-border-b bg-background">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Target OS:</span>
            <span className="text-text">{previewScaffold.os}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Format:</span>
            <span className="text-text font-mono">{previewScaffold.format}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Files:</span>
            <span className="text-text">{previewScaffold.fileCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Directories:</span>
            <span className="text-text">{previewScaffold.directoryCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Size:</span>
            <span className="text-text">{(previewScaffold.size / 1024).toFixed(1)} KB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Created:</span>
            <span className="text-text">{previewScaffold.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      {/* Content Preview */}
      <div className="flex-1 overflow-hidden">
        <FilePreview
          file={{
            name: `${previewScaffold.name}.${previewScaffold.format === 'powershell' ? 'ps1' : previewScaffold.format === 'batch' ? 'bat' : 'sh'}`,
            path: `${previewScaffold.name}.${previewScaffold.format === 'powershell' ? 'ps1' : previewScaffold.format === 'batch' ? 'bat' : 'sh'}`,
            content: previewScaffold.content,
            language: getLanguage(previewScaffold.format),
            size: previewScaffold.content.length,
            lastModified: new Date()
          }}
          className="h-full"
        />
      </div>
      
      {/* Footer Actions */}
      <div className="p-4 app-border-t bg-background">
        <Button
          onClick={() => onExportScaffold(previewScaffold)}
          variant="primary"
          size="md"
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Scaffold
        </Button>
      </div>
    </div>
  )
}

export default ScaffoldGeneratorPreview