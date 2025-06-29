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

# (Do not use terminal to populate files) Write the code for Frontend

Create or update the files below.

## Content:

### AppControls Component

**Location:** `frontend\app\src\components\titlebar\AppControls.tsx`

**Purpose:** Provides buttons in the TitleBar for controlling sidebar position and theme.

**Key Features:**

- Sidebar position toggle with dynamic icon
- Theme toggle with dynamic icon
- Visual separator

**Props/API:**

- `sidebarPosition: 'left' | 'right'`: Current sidebar position
- `onToggleSidebarPosition: () => void`: Sidebar toggle callback
- `theme: 'dark' | 'light'`: Current theme
- `onToggleTheme: () => void`: Theme toggle callback

**Code Sample:**

```typescript
import React from 'react'
import { VscLayoutSidebarLeft, VscLayoutSidebarRight } from 'react-icons/vsc'
import { Sun, Moon } from 'lucide-react'
import type { AppSettings } from '../../hooks/useSettings'

interface AppControlsProps {
  sidebarPosition: AppSettings['sidebarPosition']
  onToggleSidebarPosition: () => void
  theme: AppSettings['theme']
  onToggleTheme: () => void
  className?: string
}

const AppControls = ({
  sidebarPosition,
  onToggleSidebarPosition,
  theme,
  onToggleTheme,
  className,
}: AppControlsProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
  }

  return (
    <div
      className={`flex items-center ${className || ''}`}
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleSidebarPosition}
        onKeyDown={(e) => handleKeyDown(e, onToggleSidebarPosition)}
        className="w-12 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover focus:bg-surface-hover focus:text-text focus:outline-none transition-colors cursor-default"
        title={`Move sidebar to ${sidebarPosition === 'left' ? 'right' : 'left'}`}
        aria-label={`Move sidebar to ${sidebarPosition === 'left' ? 'right' : 'left'}`}
      >
        <div className="tab-icon [&_svg]:stroke-1">
          {sidebarPosition === 'left' ? (
            <VscLayoutSidebarRight size={14} />
          ) : (
            <VscLayoutSidebarLeft size={14} />
          )}
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={onToggleTheme}
        onKeyDown={(e) => handleKeyDown(e, onToggleTheme)}
        className="w-12 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover focus:bg-surface-hover focus:text-text focus:outline-none transition-colors cursor-default"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        <div className="tab-icon [&_svg]:stroke-1">
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </div>
      </div>

      <div className="w-px h-4 bg-border" aria-hidden="true"></div>
    </div>
  )
}

export default AppControls
```

### TabBar Component

**Location:** `frontend\app\src\components\titlebar\TabBar.tsx`

**Purpose:** Displays a list of open tabs with drag-and-drop reordering.

**Key Features:**

- Tab display with active highlighting
- Tab interaction (click, close)
- Drag-and-drop reordering

**Props/API:**

- `tabs: Tab[]`: Array of tab objects
- `activeTabId?: string | null`: Currently active tab ID
- `onTabClick: (tabId: string) => void`: Tab click handler
- `onTabClose: (tabId: string) => void`: Tab close handler
- `onTabReorder?: (reorderedTabs: Tab[]) => void`: Reorder callback

**Code Sample:**

```typescript
import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Tab } from '../../types/tab'

export type { Tab }

interface TabBarProps {
  tabs: Tab[]
  onTabClick: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onTabReorder?: (reorderedTabs: Tab[]) => void
  className?: string
  activeTabId?: string | null
}

interface SortableTabProps {
  tab: Tab
  isActive: boolean
  isDragging?: boolean
  onTabClick: (tabId: string) => void
  onTabClose: (e: React.MouseEvent, tabId: string) => void
  attributes: any
  listeners: any
  refProp: (node: HTMLElement | null) => void
  style: React.CSSProperties
}

const SortableTabItem: React.FC<SortableTabProps> = ({
  tab,
  isActive,
  isDragging,
  onTabClick,
  onTabClose,
  attributes,
  listeners,
  refProp,
  style,
}) => {
  return (
    <div
      ref={refProp}
      {...attributes}
      {...listeners}
      style={style}
      className={`
          flex items-center justify-between gap-2 px-3 h-7 min-w-0 max-w-48 app-border-t-2 group relative select-none
          focus:outline-none
          ${
            isActive
              ? 'bg-background text-text app-border-l app-border-r app-border-t-accent font-semibold z-10 active-tab-break'
              : ' text-text-muted hover:bg-surface-hover hover:text-text app-border-t-transparent font-normal'
          }
          ${isDragging ? 'opacity-50 shadow-lg' : ''}
        `.trim()}
      onClick={() => onTabClick(tab.id)}
      onAuxClick={(e) => e.button === 1 && onTabClose(e, tab.id)}
      title={tab.title}
      aria-selected={isActive}
      role="tab"
      tabIndex={isActive ? 0 : -1}
    >
      {tab.icon && (
        <div
          className={`tab-icon flex-shrink-0 w-4 h-4 [&_svg]:stroke-${isActive ? '[1.5]' : '1'}`}
        >
          {tab.icon}
        </div>
      )}
      <span className="truncate text-sm flex-grow min-w-0">{tab.title}</span>
      <button
        type="button"
        onClick={(e) => onTabClose(e, tab.id)}
        className={`
            p-0.5 rounded-sm text-text-muted hover:text-text hover:bg-surface-active focus:outline-none focus:bg-surface-active
            ${
              isActive
                ? 'opacity-75 group-hover:opacity-100'
                : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
            } shrink-0 ml-1
          `.trim()}
        aria-label={`Close tab ${tab.title}`}
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </div>
  )
}

const TabBar = ({
  tabs,
  onTabClick,
  onTabClose,
  onTabReorder,
  className,
  activeTabId,
}: TabBarProps) => {
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (_event: KeyboardEvent): { x: number; y: number } => {
        return { x: 0, y: 0 }
      },
    }),
  )

  const checkScrollArrows = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }, [])

  useEffect(() => {
    checkScrollArrows()
    const currentScrollRef = scrollRef.current
    currentScrollRef?.addEventListener('scroll', checkScrollArrows)
    window.addEventListener('resize', checkScrollArrows)
    return () => {
      currentScrollRef?.removeEventListener('scroll', checkScrollArrows)
      window.removeEventListener('resize', checkScrollArrows)
    }
  }, [tabs, checkScrollArrows])

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingTabId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggingTabId(null)
    const { active, over } = event
    if (over && active.id !== over.id && onTabReorder) {
      const oldIndex = tabs.findIndex((tab) => tab.id === active.id)
      const newIndex = tabs.findIndex((tab) => tab.id === over.id)
      onTabReorder(arrayMove(tabs, oldIndex, newIndex))
    }
  }

  const handleTabCloseInternal = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    onTabClose(tabId)
  }

  const draggingTab = tabs.find((tab) => tab.id === draggingTabId)

  return (
    <div
      className={`flex-1 flex items-end pt-1 relative overflow-hidden min-w-0 ${className || ''}`}
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      {showLeftArrow && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-full px-1 bg-gradient-to-r from-surface via-surface to-transparent flex items-center justify-center text-text-muted hover:text-text"
          aria-label="Scroll tabs left"
        >
          <div className="[&_svg]:stroke-1">
            <ChevronLeft size={16} />
          </div>
        </button>
      )}
      <div
        ref={scrollRef}
        className={`
            flex items-end overflow-x-auto scrollbar-none w-full
            ${showLeftArrow ? 'pl-6' : ''}
            ${showRightArrow ? 'pr-6' : ''}
          `.trim()}
        onScroll={checkScrollArrows}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setDraggingTabId(null)}
        >
          <SortableContext
            items={tabs.map((tab) => tab.id)}
            strategy={horizontalListSortingStrategy}
          >
            {tabs.map((tab) => (
              <SortableTabWrapper
                key={tab.id}
                tab={tab}
                isActive={tab.id === activeTabId}
                onTabClick={onTabClick}
                onTabClose={handleTabCloseInternal}
                isDraggable={!!onTabReorder}
              />
            ))}
          </SortableContext>
          {onTabReorder && (
            <DragOverlay dropAnimation={null}>
              {draggingTabId && draggingTab ? (
                <SortableTabItem
                  tab={draggingTab}
                  isActive={draggingTab.id === activeTabId}
                  isDragging
                  onTabClick={() => {}}
                  onTabClose={() => {}}
                  attributes={{}}
                  listeners={{}}
                  refProp={() => {}}
                  style={{}}
                />
              ) : null}
            </DragOverlay>
          )}
        </DndContext>
      </div>
      {showRightArrow && (
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-full px-1 bg-gradient-to-l from-surface via-surface to-transparent flex items-center justify-center text-text-muted hover:text-text"
          aria-label="Scroll tabs right"
        >
          <div className="[&_svg]:stroke-1">
            <ChevronRight size={16} />
          </div>
        </button>
      )}
    </div>
  )
}

const SortableTabWrapper: React.FC<
  Omit<SortableTabProps, 'attributes' | 'listeners' | 'refProp' | 'style' | 'isDragging'> & {
    isDraggable: boolean
  }
> = ({ tab, isActive, onTabClick, onTabClose, isDraggable }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tab.id,
    disabled: !isDraggable,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : undefined,
  }

  return (
    <SortableTabItem
      tab={tab}
      isActive={isActive}
      isDragging={isDragging}
      onTabClick={onTabClick}
      onTabClose={onTabClose}
      attributes={attributes}
      listeners={listeners}
      refProp={setNodeRef}
      style={style}
    />
  )
}

export default TabBar
```

### WindowControls Component

**Location:** `frontend\app\src\components\titlebar\WindowControls.tsx`

**Purpose:** Renders standard window manipulation buttons.

**Key Features:**

- Minimize, maximize/restore, close buttons
- Platform interaction via usePlatform hook

**Props/API:**

- `className?: string`: Additional CSS classes

**Code Sample:**

```typescript
import React, { useState, useEffect } from 'react'
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeRestore,
  VscChromeClose,
} from 'react-icons/vsc'
import { usePlatform } from '../../hooks/usePlatform'

interface WindowControlsProps {
  className?: string
}

const WindowControls = ({ className }: WindowControlsProps) => {
  const platformService = usePlatform()
  const [isMaximized, setIsMaximized] = useState(false)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
  }

  useEffect(() => {
    if (platformService.isElectron()) {
      const unsubscribe = platformService.onWindowStateChange(({ isMaximized: maximized }) => {
        setIsMaximized(maximized)
      })

      // Get initial state
      platformService
        .isMaximized()
        .then((maximized) => setIsMaximized(maximized))
        .catch((error) => {
          console.error('WindowControls: Failed to get initial window state:', error)
        })

      return unsubscribe
    } else {
      setIsMaximized(false)
      return () => {}
    }
  }, [platformService])

  const handleMinimize = () => {
    if (platformService.isElectron()) {
      platformService.minimizeWindow()
    } else {
      console.log('Minimize requested (browser environment)')
    }
  }

  const handleMaximizeToggle = async () => {
    if (platformService.isElectron()) {
      await platformService.maximizeWindow()
      // State is updated via onWindowStateChange listener
    } else {
      console.log('Maximize/Restore requested (browser environment)')
      setIsMaximized(!isMaximized)
    }
  }

  const handleClose = () => {
    if (platformService.isElectron()) {
      platformService.closeWindow()
    } else {
      console.log('Close requested (browser environment)')
      platformService.closeWindow()
    }
  }

  const maximizeLabel = isMaximized ? 'Restore' : 'Maximize'
  const MaximizeIcon = isMaximized ? VscChromeRestore : VscChromeMaximize

  return (
    <div
      className={`flex items-center ${className || ''}`}
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleMinimize}
        onKeyDown={(e) => handleKeyDown(e, handleMinimize)}
        className="w-12 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover focus:bg-surface-hover focus:text-text focus:outline-none transition-colors cursor-default"
        aria-label="Minimize"
        title="Minimize"
      >
        <div className="tab-icon [&_svg]:stroke-1">
          <VscChromeMinimize size={12} />
        </div>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={handleMaximizeToggle}
        onKeyDown={(e) => handleKeyDown(e, handleMaximizeToggle)}
        className="w-12 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover focus:bg-surface-hover focus:text-text focus:outline-none transition-colors cursor-default"
        aria-label={maximizeLabel}
        title={maximizeLabel}
      >
        <div className="tab-icon [&_svg]:stroke-1">
          <MaximizeIcon size={12} />
        </div>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClose}
        onKeyDown={(e) => handleKeyDown(e, handleClose)}
        className="w-12 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-status-error focus:bg-status-error focus:text-text focus:outline-none transition-colors cursor-default"
        aria-label="Close"
        title="Close"
      >
        <div className="tab-icon [&_svg]:stroke-1">
          <VscChromeClose size={12} />
        </div>
      </div>
    </div>
  )
}

export default WindowControls
```

## Then call attempt completion
