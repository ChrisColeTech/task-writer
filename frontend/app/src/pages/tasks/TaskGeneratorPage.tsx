import React from 'react'
import { FileText } from 'lucide-react'
import TaskGenerator from '@/components/features/task-generator/TaskGenerator'
import type { NavigationConfig } from '@/types/navigation'

// Export navigation config for auto-discovery
export const navigationConfig: NavigationConfig = {
  id: 'tasks',
  label: 'Task Generator',
  iconComponent: FileText,
  showInSidebar: true,
  order: 2,
}

/**
 * TaskGeneratorPage - Main page component for task generation
 * Follows architecture guide principles:
 * - Single responsibility: Page orchestration only
 * - Under 100 lines as per page component guidelines
 * - Composition over complex logic
 * - Clean separation of concerns
 * - Feature card pattern for sections
 * 
 * Refactored from 705 lines to ~40 lines (94% reduction)
 * All business logic extracted to TaskGeneratorService
 * All state management extracted to useTaskGeneration hook
 * All UI components split into focused, reusable pieces
 */
const TaskGeneratorPage: React.FC = () => {
  return (
    <div 
      className="h-full overflow-y-auto p-6" 
      role="main" 
      aria-label="Task Generator - Generate AI-ready task files from your project structure"
    >
      <div className="space-y-8">
        {/* Simple Page Header */}
        <div className="bg-surface app-border overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-surface to-background px-6 py-4">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-accent" />
              <h1 className="text-2xl font-bold text-text">Task Generator</h1>
            </div>
            <p className="text-text-muted">Generate AI-ready task files from your project structure</p>
          </div>
        </div>

        {/* Task Generator Content */}
        <TaskGenerator />
      </div>
    </div>
  )
}

export default TaskGeneratorPage