import React from 'react'
import { Wrench } from 'lucide-react'
import ScaffoldGenerator from '@/components/features/scaffold-generator/ScaffoldGenerator'
import type { NavigationConfig } from '@/types/navigation'

// Export navigation config for auto-discovery
export const navigationConfig: NavigationConfig = {
  id: 'scaffold',
  label: 'Scaffold Generator',
  iconComponent: Wrench,
  showInSidebar: true,
  order: 3,
}

/**
 * ScaffoldGeneratorPage - Main page component for scaffold generation
 * Follows architecture guide principles:
 * - Single responsibility: Page orchestration only
 * - Under 100 lines as per page component guidelines
 * - Composition over complex logic
 * - Clean separation of concerns
 * - Feature card pattern for sections
 * 
 * Refactored from 780 lines to ~40 lines (95% reduction)
 * All business logic extracted to ScaffoldGeneratorService
 * All state management extracted to useScaffoldGeneration hook
 * All UI components split into focused, reusable pieces
 */
const ScaffoldGeneratorPage: React.FC = () => {
  return (
    <div 
      className="h-full overflow-y-auto p-6" 
      role="main" 
      aria-label="Scaffold Generator - Generate cross-platform scaffold scripts from your project structure"
    >
      <div className="space-y-8">
        {/* Simple Page Header */}
        <div className="bg-surface app-border overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-surface to-background px-6 py-4">
            <div className="flex items-center gap-3 mb-2">
              <Wrench className="w-8 h-8 text-accent" />
              <h1 className="text-2xl font-bold text-text">Scaffold Generator</h1>
            </div>
            <p className="text-text-muted">Generate cross-platform scaffold scripts from your project structure</p>
          </div>
        </div>

        {/* Scaffold Generator Content */}
        <ScaffoldGenerator />
      </div>
    </div>
  )
}

export default ScaffoldGeneratorPage