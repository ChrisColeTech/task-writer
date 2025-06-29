import React from 'react'
import ScaffoldGeneratorSetup from './ScaffoldGeneratorSetup'
import ScaffoldGeneratorSettings from './ScaffoldGeneratorSettings'
import ScaffoldGeneratorActions from './ScaffoldGeneratorActions'
import ScaffoldGeneratorResults from './ScaffoldGeneratorResults'
import ScaffoldGeneratorPreview from './ScaffoldGeneratorPreview'
import { useScaffoldGeneration } from '@/hooks/useScaffoldGeneration'
import { useScaffoldGeneratorLimitations } from '@/hooks/useBrowserLimitations'

/**
 * Main ScaffoldGenerator component - orchestrates the scaffold generation feature
 * Follows architecture guide principles:
 * - Single responsibility: Scaffold generation feature orchestration
 * - Under 150 lines
 * - Composition over complex logic
 * - Clean separation of concerns via custom hooks
 */
const ScaffoldGenerator: React.FC = () => {
  const scaffoldGeneration = useScaffoldGeneration()
  // Initialize browser limitations (shows warnings automatically)
  useScaffoldGeneratorLimitations()

  return (
    <div className="space-y-8">
      {/* Setup Section */}
      <ScaffoldGeneratorSetup
        selectedPath={scaffoldGeneration.selectedPath}
        outputPath={scaffoldGeneration.outputPath}
        treeData={scaffoldGeneration.treeData}
        selectedNode={scaffoldGeneration.selectedNode}
        hasSelectedDirectory={scaffoldGeneration.hasSelectedDirectory}
        onSelectDirectory={scaffoldGeneration.selectDirectory}
        onSelectOutputDirectory={scaffoldGeneration.selectOutputDirectory}
        onSelectNode={scaffoldGeneration.selectTreeNode}
        onClearPaths={scaffoldGeneration.clearPaths}
      />

      {/* Settings Section */}
      <ScaffoldGeneratorSettings
        settings={scaffoldGeneration.settings}
        supportedFormats={scaffoldGeneration.supportedFormats}
        onUpdateSettings={scaffoldGeneration.updateSettings}
        onResetSettings={scaffoldGeneration.resetSettings}
        onAddTemplateVariable={scaffoldGeneration.addTemplateVariable}
        onRemoveTemplateVariable={scaffoldGeneration.removeTemplateVariable}
        onAddFileType={scaffoldGeneration.addFileType}
        onRemoveFileType={scaffoldGeneration.removeFileType}
      />

      {/* Actions Section */}
      <ScaffoldGeneratorActions
        generating={scaffoldGeneration.generating}
        progress={scaffoldGeneration.progress}
        queueItems={scaffoldGeneration.queueItems}
        generationStats={scaffoldGeneration.generationStats}
        canGenerate={scaffoldGeneration.canGenerate}
        canExport={scaffoldGeneration.canExport}
        onStartGeneration={scaffoldGeneration.startGeneration}
        onExportScaffolds={scaffoldGeneration.exportScaffolds}
      />

      {/* Results Section */}
      <ScaffoldGeneratorResults
        generatedScaffolds={scaffoldGeneration.generatedScaffolds}
        hasGeneratedScaffolds={scaffoldGeneration.hasGeneratedScaffolds}
        onPreviewScaffold={scaffoldGeneration.setScaffoldPreview}
        onExportSingleScaffold={scaffoldGeneration.exportSingleScaffold}
      />

      {/* Preview Sidebar */}
      <ScaffoldGeneratorPreview
        previewScaffold={scaffoldGeneration.previewScaffold}
        onClosePreview={() => scaffoldGeneration.setScaffoldPreview(null)}
        onExportScaffold={scaffoldGeneration.exportSingleScaffold}
      />
    </div>
  )
}

export default ScaffoldGenerator