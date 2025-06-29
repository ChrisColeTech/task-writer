import React from 'react'
import { Settings } from 'lucide-react'
import {
  SettingsSection,
  CheckboxGroup,
  RadioGroup,
  FormField,
  NumberInput,
} from '@/components/shared/forms'
import type { TaskSettings } from '@/services/TaskGeneratorService'

interface TaskGeneratorSettingsProps {
  settings: TaskSettings
  onUpdateSettings: (settings: Partial<TaskSettings>) => void
  onResetSettings: () => void
}

/**
 * Component for task generator settings configuration
 * Uses shared form components for consistent UI
 * Follows architecture guide principles:
 * - Single responsibility: Task-specific settings configuration
 * - Under 150 lines (now much smaller via composition)
 * - Clean props interface
 * - Reuses shared form components
 */
const TaskGeneratorSettings: React.FC<TaskGeneratorSettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  return (
    <SettingsSection
      icon={Settings}
      title="Generation Settings"
      onReset={onResetSettings}
    >
      {/* Content Options */}
      <CheckboxGroup
        title="Content Options"
        options={[
          {
            id: 'includeFileContents',
            label: 'Include file contents in tasks',
            checked: settings.includeFileContents,
            onChange: (checked) => onUpdateSettings({ includeFileContents: checked }),
          },
          {
            id: 'includeFolderStructure',
            label: 'Include folder structure',
            checked: settings.includeFolderStructure,
            onChange: (checked) => onUpdateSettings({ includeFolderStructure: checked }),
          },
          {
            id: 'includeImplementationSteps',
            label: 'Include implementation steps',
            checked: settings.includeImplementationSteps,
            onChange: (checked) => onUpdateSettings({ includeImplementationSteps: checked }),
          },
        ]}
      />

      {/* Organization Options */}
      <CheckboxGroup
        title="Organization"
        options={[
          {
            id: 'groupByDirectory',
            label: 'Group files by directory',
            checked: settings.groupByDirectory,
            onChange: (checked) => onUpdateSettings({ groupByDirectory: checked }),
          },
        ]}
      />

      {/* Output Format */}
      <RadioGroup
        title="Output Format"
        name="outputFormat"
        value={settings.outputFormat}
        onChange={(value) => onUpdateSettings({ outputFormat: value as TaskSettings['outputFormat'] })}
        options={[
          { value: 'markdown', label: 'Markdown' },
          { value: 'text', label: 'Text' },
          { value: 'html', label: 'HTML' },
        ]}
        layout="horizontal"
      />

      {/* File Limits */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-text">File Limits</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Max file size (MB)">
            <NumberInput
              value={settings.maxFileSize}
              onChange={(value) => onUpdateSettings({ maxFileSize: value })}
              min={1}
              max={100}
            />
          </FormField>
          
          <FormField label="Files per task">
            <NumberInput
              value={settings.filesPerTask}
              onChange={(value) => onUpdateSettings({ filesPerTask: value })}
              min={1}
              max={50}
            />
          </FormField>
        </div>
      </div>

      {/* Custom Instructions */}
      <FormField 
        label="Custom Instructions"
        description="These instructions will be included in all generated tasks"
      >
        <textarea
          value={settings.customInstructions}
          onChange={(e) => onUpdateSettings({ customInstructions: e.target.value })}
          placeholder="Add any custom instructions for task generation..."
          rows={4}
          className="w-full px-3 py-2 app-border rounded-md bg-surface text-text placeholder-text-muted focus:ring-2 focus:ring-accent focus:outline-none resize-vertical"
        />
      </FormField>
    </SettingsSection>
  )
}

export default TaskGeneratorSettings