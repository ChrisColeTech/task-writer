import React from 'react'
import { Settings } from 'lucide-react'
import {
  SettingsSection,
  RadioGroup,
  FormField,
  TextInput,
  CheckboxGroup,
  KeyValueList,
  TagList,
} from '@/components/shared/forms'
import { Select, type SelectOption } from '@/components/ui/select'
import type { ScaffoldSettings } from '@/services/ScaffoldGeneratorService'

interface ScaffoldGeneratorSettingsProps {
  settings: ScaffoldSettings
  supportedFormats: ScaffoldSettings['outputFormat'][]
  onUpdateSettings: (settings: Partial<ScaffoldSettings>) => void
  onResetSettings: () => void
  onAddTemplateVariable: (key: string, value: string) => void
  onRemoveTemplateVariable: (key: string) => void
  onAddFileType: (fileType: string) => void
  onRemoveFileType: (fileType: string) => void
}

/**
 * Component for scaffold generator settings configuration
 * Uses shared form components for consistent UI
 * Follows architecture guide principles:
 * - Single responsibility: Scaffold-specific settings configuration
 * - Under 150 lines (now much smaller via composition)
 * - Clean props interface
 * - Reuses shared form components
 */
const ScaffoldGeneratorSettings: React.FC<ScaffoldGeneratorSettingsProps> = ({
  settings,
  supportedFormats,
  onUpdateSettings,
  onResetSettings,
  onAddTemplateVariable,
  onRemoveTemplateVariable,
  onAddFileType,
  onRemoveFileType,
}) => {

  const formatOptions: SelectOption[] = supportedFormats.map((format) => ({
    value: format,
    label: format.charAt(0).toUpperCase() + format.slice(1),
  }))

  return (
    <SettingsSection
      icon={Settings}
      title="Scaffold Settings"
      onReset={onResetSettings}
    >
      {/* Target Platform */}
      <RadioGroup
        title="Target Platform"
        name="targetOS"
        value={settings.targetOS}
        onChange={(value) => onUpdateSettings({ targetOS: value as ScaffoldSettings['targetOS'] })}
        options={[
          { value: 'windows', label: 'Windows' },
          { value: 'macos', label: 'macOS' },
          { value: 'linux', label: 'Linux' },
          { value: 'cross-platform', label: 'Cross Platform' },
        ]}
        layout="grid"
        gridCols={2}
      />

      {/* Script Format */}
      <FormField label="Script Format">
        <Select
          value={settings.outputFormat}
          onValueChange={(value) => onUpdateSettings({ outputFormat: value as ScaffoldSettings['outputFormat'] })}
          options={formatOptions}
          placeholder="Select format"
        />
      </FormField>

      {/* Script Name */}
      <FormField label="Script Name">
        <TextInput
          value={settings.scriptName}
          onChange={(value) => onUpdateSettings({ scriptName: value })}
          placeholder="scaffold"
        />
      </FormField>

      {/* Generation Options */}
      <CheckboxGroup
        title="Generation Options"
        options={[
          {
            id: 'includeContent',
            label: 'Include file contents in scaffold',
            checked: settings.includeContent,
            onChange: (checked) => onUpdateSettings({ includeContent: checked }),
          },
          {
            id: 'createDirectoriesOnly',
            label: 'Create directories only (no files)',
            checked: settings.createDirectoriesOnly,
            onChange: (checked) => onUpdateSettings({ createDirectoriesOnly: checked }),
          },
          {
            id: 'addComments',
            label: 'Add explanatory comments',
            checked: settings.addComments,
            onChange: (checked) => onUpdateSettings({ addComments: checked }),
          },
        ]}
      />

      {/* Template Variables */}
      <KeyValueList
        title="Template Variables"
        items={settings.templateVariables}
        onAddItem={onAddTemplateVariable}
        onRemoveItem={onRemoveTemplateVariable}
        keyPlaceholder="Variable name"
        valuePlaceholder="Variable value"
      />

      {/* Supported File Types */}
      <TagList
        title="Supported File Types"
        tags={settings.supportedFileTypes}
        onAddTag={onAddFileType}
        onRemoveTag={onRemoveFileType}
        placeholder=".tsx"
      />
    </SettingsSection>
  )
}

export default ScaffoldGeneratorSettings