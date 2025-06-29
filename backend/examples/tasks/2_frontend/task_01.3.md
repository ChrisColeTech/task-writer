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

## Content:

Create or update the files below.

### Navigation Configuration

**Location:** `frontend\app\src\config\navigationConfig.tsx`

**Purpose:** Dynamically builds the application's navigation structure by auto-discovering page and panel components.

**Key Features:**

- Auto-discovery of modules using Vite's import.meta.glob
- Convention-based configuration for pages and panels
- Centralized navigationItems array with helper functions

**Props/API:**

- `navigationConfig` object structure:
  - `id`: Unique identifier (required)
  - `label`: Display name (required)
  - `iconComponent`: Icon component (optional)
  - `order`: Sort order (optional)
  - `showInSidebar`: Visibility in sidebar (optional)
  - `defaultVisible`: Default visibility state (optional)

**Code Sample:**

```typescript
import * as React from 'react'
import type { NavigationItem, NavigationConfig } from '@/types/navigation'
import { createIconElement } from '@/utils/iconUtils'

const pageModules = import.meta.glob('../pages/**/[A-Z]*Page.tsx', {
  eager: true,
})

const panelModules = import.meta.glob('../pages/**/[A-Z]*Panel.tsx', {
  eager: true,
})

export const navigationItems: NavigationItem[] = Object.entries(pageModules)
  .map(([pagePath, pageModule]) => {
    const folderMatch = pagePath.match(/\/pages\/([^/]+)\//)
    let folderName = folderMatch?.[1]

    if (!folderName) {
      const fileMatch = pagePath.match(/\/pages\/([^/]+)\.tsx$/)
      folderName = fileMatch?.[1]?.replace('Page', '').toLowerCase()
    }

    const typedPageModule = pageModule as {
      navigationConfig?: NavigationConfig
      default?: React.ComponentType<unknown>
    }

    if (!typedPageModule?.navigationConfig || !folderName || !typedPageModule?.default) {
      return null
    }

    const panelPath = Object.keys(panelModules).find(
      (path) => path.includes(`/pages/${folderName}/`) && path.includes('Panel.tsx'),
    )

    const panelModule = panelPath
      ? (panelModules[panelPath] as { default?: React.ComponentType<unknown> })
      : null

    return {
      ...typedPageModule.navigationConfig,
      page: typedPageModule.default,
      panel: panelModule?.default || undefined,
    } as NavigationItem
  })
  .filter((item): item is NavigationItem => item !== null)
  .sort((a, b) => (a.order || 999) - (b.order || 999))

export const getNavigationItem = (id: string): NavigationItem | undefined => {
  return navigationItems.find((item) => item.id === id)
}

export const getAllNavigationItems = (): NavigationItem[] => {
  return navigationItems
}

export const getSidebarItems = (): NavigationItem[] => {
  return navigationItems.filter((item) => item.showInSidebar)
}

export const getPageComponent = (id: string): React.ComponentType<unknown> | undefined => {
  const item = getNavigationItem(id)
  return item?.page
}

export const getPanelComponent = (id: string): React.ComponentType<unknown> | undefined => {
  const item = getNavigationItem(id)
  return item?.panel
}

export const getIcon = (id: string, size: number): React.ReactElement | null => {
  const item = getNavigationItem(id)
  if (item?.iconComponent) {
    return createIconElement(item.iconComponent, size)
  }
  const panelItem = panelModules[
    `../pages/${id.replace('-panel', '')}/${
      id.charAt(0).toUpperCase() + id.slice(1).replace('-panel', '')
    }Panel.tsx`
  ] as { navigationConfig?: NavigationConfig }
  if (panelItem?.navigationConfig?.iconComponent) {
    return createIconElement(panelItem.navigationConfig.iconComponent, size)
  }
  return null
}

export const getTabIcon = (id: string): React.ReactElement | null => {
  return getIcon(id, 12)
}

export const getSidebarIcon = (id: string): React.ReactElement | null => {
  return getIcon(id, 16)
}

export const getPageIcon = (id: string): React.ReactElement | null => {
  return getIcon(id, 20)
}

export const getTabTitle = (id: string): string => {
  const item = getNavigationItem(id)
  return item?.label || id
}
```

---

# Service Documentation: NavigationService

**Location**: `frontend\app\src\services\navigationService.tsx`

### Verbatim Code Sample (Core Structure):

```typescript
import { getNavigationItem, getTabIcon, getTabTitle } from '../config/navigationConfig'
import type { Tab } from '../types/tab'

export class NavigationService {
  private onTabAdd?: (tab: Tab) => void
  private onTabRemove?: (tabId: string) => void
  private onTabActivate?: (tabId: string) => void
  private onSidebarChange?: (tabId: string) => void

  constructor(callbacks?: {
    onTabAdd?: (tab: Tab) => void
    onTabRemove?: (tabId: string) => void
    onTabActivate?: (tabId: string) => void
    onSidebarChange?: (tabId: string) => void
  }) {
    this.onTabAdd = callbacks?.onTabAdd
    this.onTabRemove = callbacks?.onTabRemove
    this.onTabActivate = callbacks?.onTabActivate
    this.onSidebarChange = callbacks?.onSidebarChange
  }

  openTab(itemId: string, activateTab: boolean = true): boolean {
    const navigationItem = getNavigationItem(itemId)
    if (!navigationItem) return false

    // Ensure isActive is set when creating the tab
    const tab: Tab = {
      id: itemId,
      title: getTabTitle(itemId),
      icon: getTabIcon(itemId),
      closable: navigationItem.closable !== undefined ? navigationItem.closable : true,
      isActive: activateTab,
    }
    this.onTabAdd?.(tab)
    if (activateTab) this.onTabActivate?.(itemId)
    return true
  }

  closeTab(tabId: string): void {
    this.onTabRemove?.(tabId)
  }

  activateTab(tabId: string): void {
    this.onTabActivate?.(tabId)
  }

  changeSidebarItem(itemId: string): boolean {
    const navigationItem = getNavigationItem(itemId)
    if (!navigationItem) return false
    this.onSidebarChange?.(itemId)
    return true
  }

  openSettings(): void {
    this.changeSidebarItem('settings')
    this.openTab('settings', true)
  }

  validateItemExists(itemId: string): boolean {
    const navigationItem = getNavigationItem(itemId)
    return navigationItem !== undefined
  }
}

let navigationServiceInstance: NavigationService | null = null
export const getNavigationService = (): NavigationService | null => navigationServiceInstance
export const initializeNavigationService = (callbacks: {
  onTabAdd?: (tab: Tab) => void
  onTabRemove?: (tabId: string) => void
  onTabActivate?: (tabId: string) => void
  onSidebarChange?: (tabId: string) => void
}): NavigationService => {
  navigationServiceInstance = new NavigationService(callbacks)
  return navigationServiceInstance
}
```

---

# Service Documentation: TabService

**Location**: `frontend\app\src\services\tabService.tsx`

### `Tab` Interface (Local Definition):

```typescript
import * as React from 'react'
import type { Tab } from '../types/tab' // Import Tab from types folder

export interface Tab {
  id: string
  title: string
  icon?: React.ReactNode // Keeping as optional for consistency with useTabs
}
```

### `TabCallbacks` Interface:

```typescript
export interface TabCallbacks {
  onTabAdd: (tab: Tab) => void
  onTabRemove: (tabId: string) => void
  onTabActivate: (tabId: string) => void
}
```

### Verbatim Code Sample (Core Structure):

```typescript
import type { Tab } from '@/types/tab'

export interface TabCallbacks {
  onTabAdd: (tab: Tab) => void
  onTabRemove: (tabId: string) => void
  onTabActivate: (tabId: string) => void
}

export class TabService {
  private callbacks: TabCallbacks

  constructor(callbacks: TabCallbacks) {
    this.callbacks = callbacks
  }

  addTab(tab: Tab): void {
    this.callbacks.onTabAdd(tab)
  }

  removeTab(tabId: string): void {
    this.callbacks.onTabRemove(tabId)
  }

  activateTab(tabId: string): void {
    this.callbacks.onTabActivate(tabId)
  }

  handleTabClick = (tabId: string): void => {
    this.activateTab(tabId)
  }

  handleTabClose = (tabId: string, _activeTabId: string | null, _fallbackTabId: string): void => {
    this.removeTab(tabId)
  }
}

let tabServiceInstance: TabService | null = null
export const getTabService = (): TabService | null => tabServiceInstance
export const initializeTabService = (callbacks: TabCallbacks): TabService => {
  tabServiceInstance = new TabService(callbacks)
  return tabServiceInstance
}
```

# Service Documentation: AppService

**Location**: `frontend\app\src\services\appService.tsx`

### `AppServiceCallbacks` Interface:

```typescript
import type { TabCallbacks } from './tabService'

export interface AppServiceCallbacks extends TabCallbacks {
  onSidebarChange: (tabId: string) => void
}
```

### Verbatim Code Sample (Core Structure):

```typescript
import { initializeNavigationService, NavigationService } from './navigationService'
import { initializeTabService, TabService, type TabCallbacks } from './tabService'
import { getNavigationItem } from '../config/navigationConfig' // Import getNavigationItem

export interface AppServiceCallbacks extends TabCallbacks {
  onSidebarChange: (tabId: string) => void
}

export class AppService {
  private navigationService: NavigationService
  private tabService: TabService
  private sidebarActiveTab: string = ''

  constructor(callbacks: AppServiceCallbacks) {
    this.tabService = initializeTabService({
      onTabAdd: callbacks.onTabAdd,
      onTabRemove: callbacks.onTabRemove,
      onTabActivate: callbacks.onTabActivate,
    })
    this.navigationService = initializeNavigationService({
      onTabAdd: (tab) => this.tabService.addTab(tab),
      onTabRemove: (tabId) => this.tabService.removeTab(tabId),
      onTabActivate: (tabId) => this.tabService.activateTab(tabId),
      onSidebarChange: (tabId) => {
        this.sidebarActiveTab = tabId
        callbacks.onSidebarChange(tabId)
      },
    })
  }

  openTab(itemId: string, activateTab: boolean = true): boolean {
    return this.navigationService.openTab(itemId, activateTab)
  }

  changeSidebarItem(itemId: string): boolean {
    const changed = this.navigationService.changeSidebarItem(itemId)
    if (changed) {
      this.navigationService.openTab(itemId, true) // Open corresponding tab
    }
    return changed
  }

  openSettings(): void {
    this.navigationService.openSettings()
  }

  handleTabClick(tabId: string): void {
    this.tabService.activateTab(tabId)
    // Synchronize sidebar active item with clicked tab
    const navigationItem = getNavigationItem(tabId)
    if (navigationItem) {
      this.navigationService.changeSidebarItem(tabId)
    }
  }

  handleTabClose(tabId: string, _activeTabId: string | null): void {
    // The TabService's removeTab will trigger useTabs' onTabRemove,
    // which handles activating the next tab.
    this.tabService.removeTab(tabId)
    // No need to explicitly change sidebar item here, as useTabs will handle active tab change,
    // and AppService's handleTabClick (if a new tab becomes active) or other mechanisms
    // will synchronize the sidebar.
  }

  getSidebarActiveTab(): string {
    return this.sidebarActiveTab
  }
}

let appServiceInstance: AppService | null = null
export const getAppService = (): AppService | null => appServiceInstance
export const initializeAppService = (callbacks: AppServiceCallbacks): AppService => {
  if (appServiceInstance) {
    console.warn('AppService already initialized. Returning existing instance.')
    return appServiceInstance
  }
  appServiceInstance = new AppService(callbacks)
  return appServiceInstance
}
```

---

## Then call attempt completion
