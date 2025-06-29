import React from 'react'
import { GeneratorSetup, type TreeNode } from '@/components/shared/generators'

interface TaskGeneratorSetupProps {
  selectedPath: string
  outputPath: string
  treeData: TreeNode[]
  selectedNode: TreeNode | null
  hasSelectedDirectory: boolean
  onSelectDirectory: () => void
  onSelectOutputDirectory: () => void
  onSelectNode: (node: TreeNode | null) => void
}

/**
 * Component for task generator directory setup
 * Uses shared GeneratorSetup component with task-specific customization
 * Follows architecture guide principles:
 * - Single responsibility: Task-specific setup configuration
 * - Under 150 lines (now much smaller via composition)
 * - Clean props interface
 * - Reuses shared components
 */
const TaskGeneratorSetup: React.FC<TaskGeneratorSetupProps> = (props) => {
  return (
    <GeneratorSetup
      {...props}
      outputDescription="If not specified, tasks will be exported to a default location"
      previewDescription="Preview of the directory structure that will be analyzed"
      generationType="task generation"
    />
  )
}

export default TaskGeneratorSetup