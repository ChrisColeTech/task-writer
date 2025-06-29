import React from 'react'
import TaskGeneratorSetup from './TaskGeneratorSetup'
import TaskGeneratorSettings from './TaskGeneratorSettings'
import TaskGeneratorActions from './TaskGeneratorActions'
import TaskGeneratorResults from './TaskGeneratorResults'
import TaskGeneratorPreview from './TaskGeneratorPreview'
import { useTaskGeneration } from '@/hooks/useTaskGeneration'
import { useTaskGeneratorLimitations } from '@/hooks/useBrowserLimitations'

/**
 * Main TaskGenerator component - orchestrates the task generation feature
 * Follows architecture guide principles:
 * - Single responsibility: Task generation feature orchestration
 * - Under 150 lines
 * - Composition over complex logic
 * - Clean separation of concerns via custom hooks
 */
const TaskGenerator: React.FC = () => {
  const taskGeneration = useTaskGeneration()
  // Initialize browser limitations (shows warnings automatically)
  useTaskGeneratorLimitations()

  return (
    <div className="space-y-8">
      {/* Setup Section */}
      <TaskGeneratorSetup
        selectedPath={taskGeneration.selectedPath}
        outputPath={taskGeneration.outputPath}
        treeData={taskGeneration.treeData}
        selectedNode={taskGeneration.selectedNode}
        hasSelectedDirectory={taskGeneration.hasSelectedDirectory}
        onSelectDirectory={taskGeneration.selectDirectory}
        onSelectOutputDirectory={taskGeneration.selectOutputDirectory}
        onSelectNode={taskGeneration.selectTreeNode}
      />

      {/* Settings Section */}
      <TaskGeneratorSettings
        settings={taskGeneration.settings}
        onUpdateSettings={taskGeneration.updateSettings}
        onResetSettings={taskGeneration.resetSettings}
      />

      {/* Actions Section */}
      <TaskGeneratorActions
        generating={taskGeneration.generating}
        progress={taskGeneration.progress}
        queueItems={taskGeneration.queueItems}
        generationStats={taskGeneration.generationStats}
        canGenerate={taskGeneration.canGenerate}
        canExport={taskGeneration.canExport}
        onStartGeneration={taskGeneration.startGeneration}
        onExportTasks={taskGeneration.exportTasks}
      />

      {/* Results Section */}
      <TaskGeneratorResults
        generatedTasks={taskGeneration.generatedTasks}
        hasGeneratedTasks={taskGeneration.hasGeneratedTasks}
        onPreviewTask={taskGeneration.setTaskPreview}
        onExportSingleTask={taskGeneration.exportSingleTask}
      />

      {/* Preview Sidebar */}
      <TaskGeneratorPreview
        previewTask={taskGeneration.previewTask}
        onClosePreview={() => taskGeneration.setTaskPreview(null)}
        onExportTask={taskGeneration.exportSingleTask}
      />
    </div>
  )
}

export default TaskGenerator