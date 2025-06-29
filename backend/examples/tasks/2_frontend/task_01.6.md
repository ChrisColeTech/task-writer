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

# (Do not use terminal to populate files) Write the code for Frontend - Menu Components

## Content:

Create or update the files below.

### DropdownMenu Component

**Location:** `frontend\app\src\components\menu\DropdownMenu.tsx`

**Purpose:** Renders a dropdown menu with top-level items and submenus.

**Key Features:**

- Top-level menu structure
- Submenu handling on hover
- Hardcoded menu items (File, Edit, View, Help)
- Uses MenuItem and Submenu components

**Props/API:**

- `onClose: () => void`: Callback to close the menu

**Internal State:**

- `activeSubmenu: string | null`: Currently active submenu ID
- `timeoutRef: React.MutableRefObject<number | null>`: Timeout ref for delayed actions

**Code Sample:**

```typescript
import { useState, useRef, useEffect } from 'react'
import MenuItem, { type MenuItemType } from './MenuItem'
import Submenu from './Submenu'

interface DropdownMenuProps {
  onClose: () => void
}

const DropdownMenu = ({ onClose }: DropdownMenuProps) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const handleMouseEnter = (itemId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setActiveSubmenu(itemId)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setActiveSubmenu(null)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleMenuItemClick = (item: MenuItemType) => {
    if (item.type === 'separator' || item.hasSubmenu) return
    onClose()
  }

  const menuItems = [
    {
      id: 'file',
      label: 'File',
      hasSubmenu: true,
      submenuItems: [
        { id: 'new', label: 'New File', shortcut: 'Ctrl+N' },
        { id: 'open', label: 'Open File...', shortcut: 'Ctrl+O' },
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S' },
        { id: 'save-as', label: 'Save As...', shortcut: 'Ctrl+Shift+S' },
        { type: 'separator' as const },
        { id: 'recent', label: 'Open Recent', hasSubmenu: true }, // This submenu would need further definition or handling
        { type: 'separator' as const },
        { id: 'exit', label: 'Exit', shortcut: 'Alt+F4' },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      hasSubmenu: true,
      submenuItems: [
        { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z' },
        { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y' },
        { type: 'separator' as const },
        { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X' },
        { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
        { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V' },
        { type: 'separator' as const },
        { id: 'find', label: 'Find', shortcut: 'Ctrl+F' },
        { id: 'replace', label: 'Replace', shortcut: 'Ctrl+H' },
      ],
    },
    {
      id: 'view',
      label: 'View',
      hasSubmenu: true,
      submenuItems: [
        {
          id: 'command-palette',
          label: 'Command Palette...',
          shortcut: 'Ctrl+Shift+P',
        },
        { type: 'separator' as const },
        { id: 'explorer', label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
        { id: 'search', label: 'Search', shortcut: 'Ctrl+Shift+F' },
        { id: 'extensions', label: 'Extensions', shortcut: 'Ctrl+Shift+X' },
        { type: 'separator' as const },
        { id: 'terminal', label: 'Terminal', shortcut: 'Ctrl+`' },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      hasSubmenu: true,
      submenuItems: [
        { id: '', label: 'Documentation' },
        {
          id: 'shortcuts',
          label: 'Keyboard Shortcuts',
          shortcut: 'Ctrl+K Ctrl+S',
        },
        { type: 'separator' as const },
        { id: 'about', label: 'About AI Editor' },
      ],
    },
  ]

  return (
    <div className="absolute top-full left-0 z-20 bg-surface app-border shadow-theme py-1 min-w-48">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => item.hasSubmenu && handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <MenuItem
            item={item}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            onClick={handleMenuItemClick}
          />
          {activeSubmenu === item.id && item.submenuItems && (
            <Submenu items={item.submenuItems} onClose={onClose} />
          )}
        </div>
      ))}
    </div>
  )
}

export default DropdownMenu
```

### MenuButton Component

**Location:** `frontend\app\src\components\menu\MenuButton.tsx`

**Purpose:** Triggers the dropdown menu display.

**Key Features:**

- Toggles visibility on click
- Uses Menu icon from lucide-react
- Manages isOpen state

**Props/API:**

- `className?: string`: Additional CSS classes

**Internal State:**

- `isOpen: boolean`: Determines if dropdown is visible

**Code Sample:**

```typescript
import { useState } from 'react'
import { Menu } from 'lucide-react'
import DropdownMenu from './DropdownMenu'

const MenuButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
        title="Application menu"
      >
        <div className="tab-icon [&_svg]:stroke-1">
          <Menu size={12} />
        </div>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <DropdownMenu onClose={() => setIsOpen(false)} />
        </>
      )}
    </div>
  )
}

export default MenuButton
```

### MenuItem Component

**Location:** `frontend\app\src\components\menu\MenuItem.tsx`

**Purpose:** Renders individual menu items.

**Key Features:**

- Displays label and optional shortcut
- Shows submenu indicator if hasSubmenu
- Handles click events

**Props/API:**

- `item: MenuItemType`: Item details
- `onMouseEnter: () => void`: Hover enter handler
- `onMouseLeave: () => void`: Hover leave handler
- `onClick: (item: MenuItemType) => void`: Click handler

**Code Sample:**

```typescript
import React from 'react'
import { ChevronRight } from 'lucide-react'

export type RegularMenuItem = {
  id: string
  label: string
  hasSubmenu?: boolean
  shortcut?: string
  disabled?: boolean
  icon?: React.ReactNode
  action?: () => void
  type?: undefined
  submenuItems?: MenuItemType[]
}

export type SeparatorMenuItem = {
  type: 'separator'
  id?: string
  label?: never
  hasSubmenu?: never
  shortcut?: never
  disabled?: never
  icon?: never
  action?: never
  submenuItems?: never
}

export type MenuItemType = RegularMenuItem | SeparatorMenuItem

interface MenuItemProps {
  item: MenuItemType
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick: (item: MenuItemType) => void // Pass the item back on click
  className?: string
}

const MenuItem = ({ item, onMouseEnter, onMouseLeave, onClick, className }: MenuItemProps) => {
  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    if (item.type === 'separator' || item.disabled) return

    if (item.type !== 'separator' && item.action) {
      item.action()
    }
    onClick(item)
  }

  if (item.type === 'separator') {
    return <div className="my-1 h-px bg-border mx-2" key={item.id || Math.random()} />
  }

  // For regular menu items
  return (
    <div
      role="menuitem"
      tabIndex={item.disabled ? -1 : 0} // Disable tabbing if item is disabled
      className={`flex items-center justify-between px-3 py-1.5 text-base text-text ${
        item.disabled
          ? 'text-text-disabled cursor-not-allowed'
          : 'hover:bg-surface-hover hover:text-accent cursor-pointer focus:bg-surface-hover focus:text-accent focus:outline-none'
      } ${className || ''}`.trim()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e)
        }
      }}
      aria-disabled={item.disabled}
      aria-haspopup={item.hasSubmenu}
    >
      <div className="flex items-center gap-2">
        {item.icon && (
          <span className="menu-item-icon w-4 h-4 flex items-center justify-center [&_svg]:stroke-1">
            {item.icon}
          </span>
        )}
        <span>{item.label}</span>
      </div>
      <div className="flex items-center space-x-2">
        {item.shortcut && <span className="text-sm text-text-muted">{item.shortcut}</span>}
        {item.hasSubmenu && (
          <div className="submenu-indicator [&_svg]:stroke-1">
            <ChevronRight size={14} className="text-text-muted" />
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuItem
```

### Submenu Component

**Location:** `frontend\app\src\components\menu\Submenu.tsx`

**Purpose:** Renders submenu panels.

**Key Features:**

- Displays list of submenu items
- Supports separators
- Handles click events

**Props/API:**

- `items: MenuItemType[]`: Array of menu items
- `onClose: (item?: MenuItemType) => void`: Close handler
- `className?: string`: Additional CSS classes

**Internal State:**

- `activeNestedSubmenu: string | null`: Currently active nested submenu ID
- `nestedTimeoutRef: React.MutableRefObject<number | null>`: Timeout ref for delayed actions

**Code Sample:**

```typescript
import { useState, useRef } from 'react'
import MenuItem, { type MenuItemType } from './MenuItem'

interface SubmenuProps {
  items: MenuItemType[]
  onClose: (item?: MenuItemType) => void
  className?: string
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
}

const Submenu = ({ items, onClose, className, onMouseEnter, onMouseLeave }: SubmenuProps) => {
  const [activeNestedSubmenu, setActiveNestedSubmenu] = useState<string | null>(null)
  const nestedTimeoutRef = useRef<number | null>(null)

  const handleItemMouseEnter = (item: MenuItemType) => {
    if (item.type !== 'separator' && item.hasSubmenu) {
      if (nestedTimeoutRef.current) {
        clearTimeout(nestedTimeoutRef.current)
      }
      setActiveNestedSubmenu(item.id)
    } else {
      if (nestedTimeoutRef.current) clearTimeout(nestedTimeoutRef.current)
      setActiveNestedSubmenu(null)
    }
  }

  const handleItemMouseLeave = (item: MenuItemType) => {
    if (item.type !== 'separator' && item.hasSubmenu) {
      nestedTimeoutRef.current = window.setTimeout(() => {
        setActiveNestedSubmenu(null)
      }, 200)
    }
  }

  const handleSubmenuMouseEnter = () => {
    if (nestedTimeoutRef.current) {
      clearTimeout(nestedTimeoutRef.current)
    }
  }

  const handleItemClick = (item: MenuItemType) => {
    if (item.type === 'separator' || item.disabled) return

    if (!item.hasSubmenu) {
      onClose(item)
    }
  }

  return (
    <div
      role="menu"
      className={`absolute top-0 left-full -ml-px bg-surface border border-border shadow-lg min-w-48 z-30 ${
        className || ''
      }`.trim()}
      onMouseEnter={(e) => {
        onMouseEnter?.(e)
        handleSubmenuMouseEnter()
      }}
      onMouseLeave={onMouseLeave}
    >
      {items.map((item) => (
        <div
          key={item.type === 'separator' ? `sep-${item.id || Math.random()}` : item.id}
          className="relative"
          onMouseEnter={() => handleItemMouseEnter(item)}
          onMouseLeave={() => handleItemMouseLeave(item)}
        >
          <MenuItem item={item} onClick={() => handleItemClick(item)} />
          {item.type !== 'separator' &&
            item.hasSubmenu &&
            activeNestedSubmenu === item.id &&
            item.submenuItems && (
              <Submenu
                items={item.submenuItems}
                onClose={.onClose}
                onMouseEnter={handleSubmenuMouseEnter}
              />
            )}
        </div>
      ))}
    </div>
  )
}

export default Submenu
```

## Then call attempt completion
