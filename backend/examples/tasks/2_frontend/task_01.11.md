### Rules

1.) **CONCISENESS CLAUSE** When replying use as few words as needed to explain, plan or analyze. Long winded replies waste time and tokens. No long explanations. Stick to the main points an keep it breif. Do not perform extra work or validation.

2.) **WORKSPACE DIRECTIVE** Before you write any code or run any terminal commands, Verify you are in the workspace. Do not create files or folders outside of the workspace. No other files are permitted to be created other than what is in the task files. Create files only where specified: frontend, backend, electron, (or root if main package.json).

3.) **COMMAND FORMATTING** Always use && to chain commands in terminal! Use tools properly when needed, especially: **read file, write to file, execute command, read multiple files, list files, new task and complete task.**

4.) **READ THE TASK FILE AND THEN SUMMARIZE** Summarize and list the steps in the task file in chat after you read it (**HIGH LEVEL SUMMARY ONLY - NO CODE, NO COMMANDS**). Then follow the steps **VERBATIM** in the **EXACT** order they appear in the task file. Read rules **VERBATIM**, and follow them explicitly. For efficiency, do not explain code or make overly verbose comments. Only spend a maximum of 10 seconds thinking.

5.) **IMPORTANT** do not stop to resolve build errors, missing files or missing imports.

6.) **FULL PATHS ONLY** Always confirm you are in the correct working directory first! When running terminal commands always use full paths for folders (e.g. cd C:/Projects/foo) to avoid errors.

7.) **READ FIRST DIRECTIVE** Read folders and files first before you write! File content is changed by the linter after you save. So before writing to a file you must read it first to get its latest content!

8.) Complete all work in the task file. Do not create or modify anything outside of these files.

9.) **TOOL USAGE CLAUSE** Always use the appropriate tools provided by the system for file operations. Specifically:

Use read_file to read files instead of command line utilities like type
Use write_to_file or insert_content to modify files
Use execute_command for running terminal commands Failing to use these tools properly may result in incomplete or incorrect task execution.

10.) **FINAL CHECKLIST** Always verify location before executing terminal commands. Use Full Paths: Always use full paths for directories when executing terminal commands. Resolve Terminal errors and syntax errors, ignore missing imports and do not create "placeholder" files unless instructed to do so. Do not create files or folders outside the workspace. **Only create files specified.** Only fix syntax errors and do not run the build to verify until the final task and all components have been fully populated.

# Layout Components

Create or update the files below.

## Navigation Components

### Sidebar Component

**Location:** `frontend/app/src/components/layout/Sidebar.tsx`

#### Purpose

Primary navigation interface for the application.

#### Key Features

- Navigation item display
- Collapsible panel control
- Settings access
- Configurable position

#### Implementation

```typescript
import CollapseButton from '../sidebar/CollapseButton'
import NavigationItems from '../sidebar/NavigationItems'
import SettingsButton from '../sidebar/SettingsButton'

interface SidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  isExpanded: boolean
  onToggleExpanded: () => void
  position: 'left' | 'right'
  onSettingsClick: () => void
  activeTabId?: string | null
  showToggleButton?: boolean
  isSidebarItemVisible?: (itemId: string, defaultVisible: boolean) => boolean
  setSidebarItemVisibility?: (itemId: string, visible: boolean) => void
  pinnedItems?: string[]
  onToggleVisibility?: (itemId: string, defaultVisible: boolean) => void
  onTogglePin?: (itemId: string) => void
}

const Sidebar = ({
  activeTab,
  onTabChange,
  isExpanded,
  onToggleExpanded,
  position,
  onSettingsClick,
  activeTabId,
  showToggleButton = true,
  isSidebarItemVisible,
  setSidebarItemVisibility: _setSidebarItemVisibility,
  pinnedItems,
  onToggleVisibility,
  onTogglePin,
}: SidebarProps) => {
  return (
    <div
      className={`w-12 ${
        position === 'left'
          ? 'bg-gradient-to-b from-background to-surface'
          : 'bg-gradient-to-b from-surface to-background'
      } ${position === 'left' ? 'app-border-r' : 'app-border-l'} flex flex-col`}
    >
      {showToggleButton && (
        <CollapseButton isExpanded={isExpanded} position={position} onToggle={onToggleExpanded} />
      )}

      <NavigationItems
        activeTab={activeTab}
        position={position}
        onTabChange={onTabChange}
        isSidebarItemVisible={isSidebarItemVisible}
        pinnedItems={pinnedItems}
        onToggleVisibility={onToggleVisibility}
        onTogglePin={onTogglePin}
      />

      <div className="flex-1" />

      <SettingsButton
        onClick={onSettingsClick}
        isActive={activeTabId === 'settings'}
        position={position}
      />
    </div>
  )
}

export default Sidebar
```

## Contextual Panel

### SidePanel Component

**Location:** `frontend/app/src/components/layout/SidePanel.tsx`

#### Purpose

Displays contextual panel associated with the active sidebar navigation item.

#### Key Features

- Dynamic content based on active tab
- Conditional rendering
- Fixed width

#### Implementation

```typescript
import { getPanelComponent } from '@/config/navigationConfig'
import type { AppSettings } from '@/hooks/useSettings'

interface SidePanelProps {
  activeTab: string
  isVisible: boolean
  theme: AppSettings['theme']
  sidebarPosition: AppSettings['sidebarPosition']
  className?: string
}

const SidePanel = ({
  activeTab,
  isVisible,
  // theme, // theme prop is not used in the provided sample
  sidebarPosition,
  className,
}: SidePanelProps) => {
  const PanelComponent = getPanelComponent(activeTab)

  if (!isVisible || !PanelComponent) {
    return null
  }

  // Panel border should be on the side opposite to sidebar
  const borderClass = sidebarPosition === 'left' ? 'app-border-r' : 'app-border-l'

  return (
    <div
      className={`w-64 bg-surface ${borderClass} ${className || ''}`}
      aria-label={`${activeTab} details panel`}
    >
      <PanelComponent />
    </div>
  )
}

export default SidePanel
```

## Status Display

### StatusBar Component

**Location:** `frontend/app/src/components/layout/StatusBar.tsx`

#### Purpose

Displays information at the bottom of the application window.

#### Key Features

- Information display (status, version, encoding)
- Fixed position
- Simple structure

#### Implementation

```typescript
const StatusBar = () => {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-background to-surface text-text-muted h-6 px-3 text-xs app-border-t">
      <div className="flex items-center space-x-4">
        <span>Ready</span>
        <div className="w-px h-3 separator" aria-hidden="true"></div>
        <span>v1.0.0</span>
      </div>

      <div className="flex items-center space-x-4">
        <span>UTF-8</span>
      </div>
    </div>
  )
}

export default StatusBar
```

## Application Header

### TitleBar Component

**Location:** `frontend/app/src/components/layout/TitleBar.tsx`

#### Purpose

Main application header with draggable region, menu, tabs, and window controls.

#### Key Features

- Draggable region for window manipulation
- Menu access
- Tab display
- Application controls (theme, sidebar)
- Window controls

#### Implementation

```typescript
import React from 'react'
import MenuButton from '@/components/menu/MenuButton'
import AppControls from '@/components/titlebar/AppControls'
import WindowControls from '@/components/titlebar/WindowControls'
import TabBar from '@/components/titlebar/TabBar'
import { usePlatform } from '@/hooks/usePlatform'
import type { AppSettings } from '@/hooks/useSettings'
import type { Tab } from '@/types/tab'

interface TitleBarProps {
  sidebarPosition: AppSettings['sidebarPosition']
  onToggleSidebarPosition: () => void
  theme: AppSettings['theme']
  onToggleTheme: () => void
  tabs: Tab[]
  onTabClick: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onTabReorder: (newTabs: Tab[]) => void // Made required
  activeTabId?: string | null
  className?: string
}

const TitleBar = ({
  sidebarPosition,
  onToggleSidebarPosition,
  theme,
  onToggleTheme,
  tabs,
  onTabClick,
  onTabClose,
  onTabReorder,
  activeTabId,
  className,
}: TitleBarProps) => {
  const platformService = usePlatform()

  const handleDoubleClick = () => {
    if (platformService.isElectron()) {
      platformService.maximizeWindow()
    }
  }

  return (
    <header
      className={`flex items-center bg-gradient-to-r from-background to-surface text-text h-8 select-none shrink-0 app-border-b ${
        className || ''
      }`}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      onDoubleClick={handleDoubleClick}
    >
      <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <MenuButton />
      </div>

      <TabBar
        tabs={tabs}
        onTabClick={onTabClick}
        onTabClose={onTabClose}
        onTabReorder={onTabReorder}
        activeTabId={activeTabId}
      />

      {tabs.length > 0 && <div className="w-px h-4 separator mx-1" aria-hidden="true"></div>}

      <div
        className="flex items-center ml-auto"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <AppControls
          sidebarPosition={sidebarPosition}
          onToggleSidebarPosition={onToggleSidebarPosition}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
        <WindowControls />
      </div>
    </header>
  )
}

export default TitleBar
```

## Then call attempt completion
