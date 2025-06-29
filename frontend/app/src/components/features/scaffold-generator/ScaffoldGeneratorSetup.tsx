import React from 'react'
import { GeneratorSetup, type TreeNode } from '@/components/shared/generators'

interface ScaffoldGeneratorSetupProps {
  selectedPath: string
  outputPath: string
  treeData: TreeNode[]
  selectedNode: TreeNode | null
  hasSelectedDirectory: boolean
  onSelectDirectory: () => void
  onSelectOutputDirectory: () => void
  onSelectNode: (node: TreeNode | null) => void
  onClearPaths?: () => void
}

/**
 * Component for scaffold generator directory setup
 * Uses shared GeneratorSetup component with scaffold-specific customization
 * Follows architecture guide principles:
 * - Single responsibility: Scaffold-specific setup configuration
 * - Under 150 lines (now much smaller via composition)
 * - Clean props interface
 * - Reuses shared components
 */
const ScaffoldGeneratorSetup: React.FC<ScaffoldGeneratorSetupProps> = (props) => {
  return (
    <GeneratorSetup
      {...props}
      outputDescription="If not specified, scaffolds will be exported to a default location"
      previewDescription="Preview of the directory structure that will be analyzed"
      generationType="scaffold generation"
    />
  )
}

export default ScaffoldGeneratorSetup