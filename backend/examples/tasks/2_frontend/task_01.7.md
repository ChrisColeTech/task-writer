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

# (Do not use terminal to populate files) Write the code for Frontend - Sidebar Components

## Content:

Create or update the files below.

## Location `frontend\app\src\components\ui\Select.tsx`

```typescript
import React, { useEffect, useState } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className,
}) => {
  const selectedOption = options.find((option) => option.value === value)
  const [themeClasses, setThemeClasses] = useState('')

  // Simple theme detection - just read classes, don't modify anything
  useEffect(() => {
    const getThemeClasses = () => {
      const appContainer = document.querySelector('[class*="dark"], [class*="font-"]')
      if (appContainer) {
        const classes = Array.from(appContainer.classList)
        const relevantClasses = classes.filter(
          (cls) =>
            cls === 'dark' ||
            cls === 'high-contrast' ||
            cls.startsWith('font-') ||
            cls.startsWith('icon-'),
        )
        setThemeClasses(relevantClasses.join(' '))
      }
    }

    getThemeClasses()
    // Simple interval check instead of MutationObserver to avoid complexity
    const interval = setInterval(getThemeClasses, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <Listbox value={value} onChange={onValueChange} disabled={disabled}>
      <ListboxButton
        className={cn(
          'relative block w-full  py-1.5 pr-8 pl-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
        }}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ChevronDown
          className="pointer-events-none absolute top-2.5 right-2.5 h-4 w-4"
          style={{ color: 'var(--text-muted)' }}
          aria-hidden="true"
        />
      </ListboxButton>

      <ListboxOptions
        anchor="bottom"
        transition
        className={cn(
          'w-[var(--button-width)]  p-1 shadow-lg focus:outline-none',
          'transition duration-100 ease-in data-closed:opacity-0 data-closed:scale-95',
          themeClasses,
        )}
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          border: '1px solid var(--border)',
        }}
      >
        {options.map((option) => (
          <ListboxOption key={option.value} value={option.value}>
            {({ selected, focus }) => (
              <div
                className="relative cursor-default select-none py-2 pl-10 pr-4"
                style={{
                  backgroundColor: focus
                    ? 'var(--surface-hover)'
                    : selected
                    ? 'rgba(var(--accent-rgb), 0.1)'
                    : 'transparent',
                  color: selected ? 'var(--accent)' : 'var(--text)',
                }}
              >
                <span className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}>
                  {option.label}
                </span>
                {selected && (
                  <span
                    className="absolute inset-y-0 left-0 flex items-center pl-3"
                    style={{ color: 'var(--accent)' }}
                  >
                    <Check className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
              </div>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
```

## Location `frontend\app\src\components\ui\Switch.tsx`

```typescript
import React from 'react'
import { Switch as HeadlessSwitch } from '@headlessui/react'
import { cn } from '@/lib/utils'

interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
  className?: string
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  id,
  className,
  ...props
}) => {
  return (
    <HeadlessSwitch
      checked={checked}
      onChange={onCheckedChange}
      disabled={disabled}
      id={id}
      className={cn(
        'group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full app-border-2 app-border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-[var(--accent)]' : 'bg-[var(--surface-hover)]',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out bg-[var(--background)]',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </HeadlessSwitch>
  )
}
```

### CollapseButton Component

**Location:** `frontend\app\src\components\sidebar\CollapseButton.tsx`

**Purpose:** Toggles the visibility of an associated SidePanel in a Sidebar.

**Key Features:**

- Toggle functionality
- Dynamic icon based on expansion state and position
- Tooltip for accessibility

**Props/API:**

- `isExpanded: boolean`: Current expanded state
- `position: 'left' | 'right'`: Sidebar position
- `onToggle: () => void`: Toggle callback

**Code Sample:**

```typescript
import { ChevronsLeft, ChevronsRight } from 'lucide-react'

interface CollapseButtonProps {
  isExpanded: boolean
  position: 'left' | 'right'
  onToggle: () => void
}

const CollapseButton = ({ isExpanded, position, onToggle }: CollapseButtonProps) => {
  const getIcon = () => {
    if (isExpanded) {
      return position === 'left' ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />
    } else {
      return position === 'left' ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />
    }
  }

  return (
    <div
      onClick={onToggle}
      className="h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
      title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
    >
      <div className="sidebar-icon [&_svg]:stroke-1">{getIcon()}</div>
    </div>
  )
}

export default CollapseButton
```

### NavItem Component

**Location:** `frontend\app\src\components\sidebar\NavItem.tsx`

**Purpose:** Represents a single clickable navigation item in the Sidebar.

**Key Features:**

- Icon display
- Active state indication
- Tooltip and hover effects

**Props/API:**

- `id: string`: Unique identifier
- `label: string`: Text label for tooltip
- `icon: React.ReactNode`: Icon component
- `isActive: boolean`: Active state
- `position: 'left' | 'right'`: Sidebar position
- `onClick: (id: string) => void`: Click handler

**Code Sample:**

```typescript
import React from 'react'

interface NavItemProps {
  id: string
  label: string
  icon: React.ReactNode
  isActive: boolean
  position: 'left' | 'right'
  onClick: () => void
  isVisible?: boolean
  isPinned?: boolean
  onToggleVisibility?: (itemId: string, defaultVisible: boolean) => void
  onTogglePin?: (itemId: string) => void
}

const NavItem = ({ label, icon, isActive, position, onClick }: NavItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        h-12 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-colors relative cursor-pointer
        ${isActive ? 'text-text bg-surface-hover font-semibold' : 'font-normal'}
      `}
      title={label}
    >
      {isActive && (
        <div
          className={`absolute top-0 bottom-0 w-0.5 bg-accent ${
            position === 'left' ? 'left-0' : 'right-0'
          }`}
        />
      )}
      <div className={`sidebar-icon ${isActive ? 'stroke-1' : '[&_svg]:stroke-1'}`}>{icon}</div>
    </div>
  )
}

export default NavItem
```

### NavigationItems Component

**Location:** `frontend\app\src\components\sidebar\NavigationItems.tsx`

**Purpose:** Renders a list of navigation entries in the Sidebar.

**Key Features:**

- Dynamic item loading and filtering
- Visibility and sorting logic
- Uses NavItem for rendering

**Props/API:**

- `activeTab: string`: Currently active tab ID
- `position: 'left' | 'right'`: Sidebar position
- `onTabChange: (tabId: string) => void`: Tab change handler
- `isSidebarItemVisible?: (itemId: string, defaultVisible: boolean) => boolean`: Visibility filter
- `pinnedItems?: string[]`: Array of pinned item IDs

**Code Sample:**

```typescript
import { getAllNavigationItems, getSidebarIcon } from '../../config/navigationConfig'
import NavItem from './NavItem'

interface NavigationItemsProps {
  activeTab: string
  position: 'left' | 'right'
  onTabChange: (tabId: string) => void
  isSidebarItemVisible?: (itemId: string, defaultVisible: boolean) => boolean
  pinnedItems?: string[]
  onToggleVisibility?: (itemId: string, defaultVisible: boolean) => void
  onTogglePin?: (itemId: string) => void
}

const NavigationItems = ({
  activeTab,
  position,
  onTabChange,
  isSidebarItemVisible = () => true,
  pinnedItems = [],
  onToggleVisibility,
  onTogglePin,
}: NavigationItemsProps) => {
  const allNavItems = getAllNavigationItems()

  // Filter items based on visibility (respecting defaultVisible, showInSidebar, and settings override)
  const visibleNavItems = allNavItems.filter((item) => {
    const defaultVisibility = item.defaultVisible ?? item.showInSidebar
    return isSidebarItemVisible(item.id, defaultVisibility)
  })

  // Sort items: pinned items first, then regular items by order
  const sortedNavItems = [...visibleNavItems].sort((a, b) => {
    const aIsPinned = pinnedItems.includes(a.id)
    const bIsPinned = pinnedItems.includes(b.id)

    if (aIsPinned && !bIsPinned) return -1
    if (!aIsPinned && bIsPinned) return 1

    return (a.order || 999) - (b.order || 999)
  })

  const navItems = sortedNavItems

  return (
    <>
      {navItems.map((item) => (
        <NavItem
          key={item.id}
          id={item.id}
          label={item.label}
          icon={getSidebarIcon(item.id)}
          isActive={activeTab === item.id}
          position={position}
          onClick={() => onTabChange(item.id)}
          isVisible={isSidebarItemVisible(item.id, item.defaultVisible ?? item.showInSidebar)}
          isPinned={pinnedItems.includes(item.id)}
          onToggleVisibility={onToggleVisibility}
          onTogglePin={onTogglePin}
        />
      ))}
    </>
  )
}

export default NavigationItems
```

### SettingsButton Component

**Location:** `frontend\app\src\components\sidebar\SettingsButton.tsx`

**Purpose:** Triggers the display of the application's settings interface.

**Key Features:**

- Settings access
- Icon display with active state indication

**Props/API:**

- `onClick: () => void`: Click handler
- `isActive?: boolean`: Active state
- `position?: 'left' | 'right'`: Sidebar position

**Code Sample:**

```typescript
import { Settings as SettingsIcon } from 'lucide-react'

interface SettingsButtonProps {
  onClick: () => void
  isActive: boolean
  position: 'left' | 'right'
}

const SettingsButton = ({ onClick, isActive, position }: SettingsButtonProps) => {
  const handleClick = () => {
    onClick()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      console.log('SettingsButton: key down detected:', e.key)
      onClick()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`h-12 w-12 flex items-center justify-center text-text-muted transition-colors relative cursor-pointer hover:text-text hover:bg-surface-hover focus:outline-none focus:bg-surface-hover focus:text-text ${
        isActive ? 'text-text bg-surface-hover font-semibold' : 'font-normal'
      }`.trim()}
      title="Settings"
      aria-label="Settings"
      aria-current={isActive ? 'page' : undefined}
    >
      {isActive && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-6 w-0.5 bg-accent ${
            position === 'left' ? 'left-0.5' : 'right-0.5'
          }`.trim()}
          aria-hidden="true"
        />
      )}
      <div className="tab-icon [&_svg]:stroke-1">
        <SettingsIcon size={16} />
      </div>
    </div>
  )
}

export default SettingsButton
```

## Then call attempt completion
