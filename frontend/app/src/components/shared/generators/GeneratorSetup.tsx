import React from 'react'
import { Settings, FolderTree, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { FileTree, type TreeNode } from '@/components/ui/FileTree'
import PathInput from '@/components/ui/PathInput'
import { Button } from '@/components/ui/Button'

interface GeneratorSetupProps {
  selectedPath: string
  outputPath: string
  treeData: TreeNode[]
  selectedNode: TreeNode | null
  hasSelectedDirectory: boolean
  onSelectDirectory: () => void
  onSelectOutputDirectory: () => void
  onSelectNode: (node: TreeNode | null) => void
  onClearPaths?: () => void
  // Customization props
  primaryStepTitle?: string
  outputStepTitle?: string
  outputDescription?: string
  previewDescription?: string
  generationType?: string // 'task' | 'scaffold' | etc
}

/**
 * Shared component for generator directory setup
 * Used by both Task and Scaffold generators
 * Follows architecture guide principles:
 * - Single responsibility: Directory selection and preview
 * - Under 150 lines
 * - Clean props interface with customization options
 * - Reusable across different generator types
 * - Feature card pattern compliance
 */
const GeneratorSetup: React.FC<GeneratorSetupProps> = ({
  selectedPath,
  outputPath,
  treeData,
  selectedNode,
  hasSelectedDirectory,
  onSelectDirectory,
  onSelectOutputDirectory,
  onSelectNode,
  onClearPaths,
  primaryStepTitle = "Step 1: Select Input Directory",
  outputStepTitle = "Step 2: Output Directory (Optional)",
  outputDescription = "If not specified, files will be exported to a default location",
  previewDescription = "Preview of the directory structure that will be analyzed",
  generationType = "generation",
}) => {
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
      aria-labelledby="setup-title"
      role="region"
    >
      {/* Feature Card Header */}
      <div className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b">
        <div className="flex items-center gap-3">
          <div className="page-icon transition-transform duration-300 motion-safe:group-hover:scale-110" role="img" aria-hidden="true">
            <Settings className="w-6 h-6 text-accent motion-safe:group-hover:text-accent-hover transition-colors" />
          </div>
          <h2 id="setup-title" className="text-xl font-semibold text-text">
            Project Setup
          </h2>
        </div>
      </div>
      
      {/* Feature Card Content */}
      <div className="p-6 space-y-6">
        {/* Input Directory */}
        <PathInput
          label={primaryStepTitle}
          value={selectedPath}
          onBrowse={onSelectDirectory}
          placeholder="Click Browse to select a directory"
          variant="input"
        />

        {/* Output Directory */}
        <PathInput
          label={outputStepTitle}
          value={outputPath}
          onBrowse={onSelectOutputDirectory}
          placeholder="Click Browse to select output directory"
          description={outputDescription}
          variant="output"
        />

        {/* Clear All Button - Only show when both paths are set */}
        {selectedPath && outputPath && onClearPaths && (
          <div className="flex justify-end pt-2">
            <Button
              onClick={onClearPaths}
              variant="ghost"
              size="sm"
              className="text-text-muted hover:text-text"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>
        )}

        {/* Directory Preview */}
        {hasSelectedDirectory && treeData.length > 0 && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="page-icon">
                <FolderTree className="w-5 h-5 text-accent" />
              </div>
              <h4 className="text-lg font-semibold text-text">Directory Preview</h4>
            </div>
            
            <div className="app-border rounded-lg overflow-hidden bg-surface">
              {/* Preview Header */}
              <div className="bg-gradient-to-r from-surface-hover to-surface px-4 py-3 app-border-b">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text">
                    Project Structure
                  </p>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    <span>Ready for {generationType}</span>
                  </div>
                </div>
              </div>
              
              {/* File Tree Container */}
              <div className="h-64 overflow-auto bg-background/50">
                <FileTree
                  data={treeData}
                  selectedNode={selectedNode}
                  onSelectNode={onSelectNode}
                  maxDepth={3}
                />
              </div>
              
              {/* Preview Footer */}
              <div className="bg-surface-hover px-4 py-3 app-border-t">
                <p className="text-sm text-text-muted flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-accent"></div>
                  {previewDescription} for {generationType}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.article>
  )
}

export default GeneratorSetup