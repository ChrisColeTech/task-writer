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

## Create or update `frontend\app\src\hooks\usePlatform.tsx`

```typescript
import type { PlatformService } from '../services/platformService'
import { getPlatformService } from '../services/platformService'

export const usePlatform = (): PlatformService => {
  return getPlatformService()
}

export const usePlatformInfo = () => {
  const platformService = getPlatformService()

  return {
    isElectron: platformService.isElectron(),
    isBrowser: platformService.isBrowser(),
    platform: platformService.getPlatform(),
  }
}
```

## Create or update `frontend\app\src\hooks\useSettings.tsx`

```typescript
import { useState, useEffect } from 'react'
import { getPlatformService } from '@/services/platformService'

export interface AppSettings {
  theme: 'dark' | 'light'
  sidebarPosition: 'left' | 'right'
  showStatusBar: boolean
  fontSize: 'small' | 'medium' | 'large'
  iconSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  borderThickness: 'none' | 'thin' | 'medium' | 'thick'
  sidebarExpanded: boolean
  activeSidebarTab: string // ID of the currently active/selected sidebar navigation item
  sidebarItemVisibility: Record<string, boolean> // Stores user overrides for sidebar item visibility
  pinnedSidebarItems: string[] // Stores IDs of sidebar items pinned by the user
  [key: string]: unknown // Allows for additional, untyped settings
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  sidebarPosition: 'left',
  showStatusBar: true,
  fontSize: 'small',
  iconSize: 'small',
  highContrast: false,
  borderThickness: 'medium',
  sidebarExpanded: true,
  activeSidebarTab: '',
  sidebarItemVisibility: {},
  pinnedSidebarItems: [],
}

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)
  const platformService = getPlatformService()

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await platformService.loadSettings()
        if (stored) {
          const mergedSettings = { ...defaultSettings, ...stored }
          setSettings(mergedSettings)
        }
      } catch (error) {
        console.error('Failed to load settings via platform service:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadSettings()
  }, [platformService])

  // Save settings whenever they change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      const saveSettings = async () => {
        try {
          await platformService.saveSettings(settings)
        } catch (error) {
          console.error('Failed to save settings via platform service:', error)
        }
      }
      saveSettings()
    }
  }, [settings, isLoaded, platformService])

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Helper functions for sidebar item visibility management
  const setSidebarItemVisibility = (itemId: string, visible: boolean) => {
    const newVisibility = { ...settings.sidebarItemVisibility }
    newVisibility[itemId] = visible
    updateSetting('sidebarItemVisibility', newVisibility)
  }

  const toggleSidebarItemVisibility = (itemId: string, defaultVisible: boolean = true) => {
    const currentlyVisible = settings.sidebarItemVisibility[itemId] ?? defaultVisible
    setSidebarItemVisibility(itemId, !currentlyVisible)
  }

  const isSidebarItemVisible = (itemId: string, defaultVisible: boolean = true) => {
    return settings.sidebarItemVisibility[itemId] ?? defaultVisible
  }

  const toggleSidebarItemPin = (itemId: string) => {
    const pinnedItems = [...settings.pinnedSidebarItems]
    const index = pinnedItems.indexOf(itemId)
    if (index > -1) {
      pinnedItems.splice(index, 1)
    } else {
      pinnedItems.push(itemId)
    }
    updateSetting('pinnedSidebarItems', pinnedItems)
  }

  return {
    settings,
    updateSetting,
    setSidebarItemVisibility,
    toggleSidebarItemVisibility,
    isSidebarItemVisible,
    toggleSidebarItemPin,
    isLoaded, // Added isLoaded to the return
  }
}
```

## Create or update `frontend\app\src\hooks\useTabs.tsx`

```typescript
import { useState, useEffect, useCallback } from 'react'
import type { Tab } from '../types/tab' // Using the Tab type from types folder

const STORAGE_KEY_PREFIX = 'app' // App-specific prefix
const TABS_STORAGE_KEY = `${STORAGE_KEY_PREFIX}-tabs`

// Helper to strip non-serializable parts (like icons) for storage
const sanitizeTabsForStorage = (tabs: Tab[]): Omit<Tab, 'icon'>[] => {
  return tabs.map(({ icon, ...rest }) => rest)
}

export const useTabs = () => {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [isTabsLoaded, setIsTabsLoaded] = useState(false)

  // Load tabs from localStorage on initial mount
  useEffect(() => {
    try {
      const storedTabsData = localStorage.getItem(TABS_STORAGE_KEY)
      if (storedTabsData) {
        const { tabs: storedSanitizedTabs, activeTabId: storedActiveTabId } = JSON.parse(
          storedTabsData,
        ) as {
          tabs: Omit<Tab, 'icon'>[]
          activeTabId: string | null
        }

        // Restore tabs without icons; icons will be added by Layout/navigationConfig
        const restoredTabs = storedSanitizedTabs.map((tab) => ({
          ...tab,
          icon: undefined, // Icons are not stored
          closable: tab.closable ?? true, // Ensure closable property is set for restored tabs
        }))

        setTabs(restoredTabs)
        setActiveTabId(storedActiveTabId)
      }
    } catch (error) {
      console.error('useTabs: Failed to load tabs from localStorage, initializing empty.', error)
      setTabs([])
      setActiveTabId(null)
    } finally {
      setIsTabsLoaded(true)
    }
  }, [])

  // Save tabs to localStorage whenever they change (and after initial load)
  useEffect(() => {
    if (isTabsLoaded) {
      try {
        if (tabs.length > 0 || activeTabId !== null) {
          const dataToStore = {
            tabs: sanitizeTabsForStorage(tabs),
            activeTabId,
          }
          localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(dataToStore))
        } else {
          localStorage.removeItem(TABS_STORAGE_KEY) // Clean up if no tabs
        }
      } catch (error) {
        console.error('useTabs: Failed to save tabs to localStorage.', error)
      }
    }
  }, [tabs, activeTabId, isTabsLoaded])

  const addTab = useCallback(
    (newTabInfo: Omit<Tab, 'isActive' | 'icon'> & { icon?: React.ReactNode }) => {
      setTabs((prevTabs) => {
        const existingTab = prevTabs.find((t) => t.id === newTabInfo.id)
        if (existingTab) {
          // If tab exists, just make it active
          setActiveTabId(existingTab.id)
          return prevTabs.map((t) => ({
            ...t,
            isActive: t.id === existingTab.id,
          }))
        }
        // Add new tab and make it active
        const fullNewTab: Tab = {
          ...newTabInfo,
          isActive: true,
          closable: newTabInfo.closable ?? true, // Ensure closable property is set
        }
        setActiveTabId(fullNewTab.id)
        return [...prevTabs.map((t) => ({ ...t, isActive: false })), fullNewTab]
      })
    },
    [],
  )

  const removeTab = useCallback(
    (tabIdToRemove: string) => {
      setTabs((prevTabs) => {
        const newTabs = prevTabs.filter((t) => t.id !== tabIdToRemove)
        if (activeTabId === tabIdToRemove) {
          // If the closed tab was active, activate the last tab in the new list, or null if no tabs
          const newActiveTabId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null
          setActiveTabId(newActiveTabId)
          return newTabs.map((t) => ({
            ...t,
            isActive: t.id === newActiveTabId,
          }))
        }
        return newTabs // Active tab didn't change
      })
    },
    [activeTabId],
  )

  const setActiveTab = useCallback((tabIdToActivate: string) => {
    setTabs((prevTabs) => prevTabs.map((t) => ({ ...t, isActive: t.id === tabIdToActivate })))
    setActiveTabId(tabIdToActivate)
  }, [])

  const reorderTabs = useCallback((newOrderedTabs: Tab[]) => {
    // Assumes newOrderedTabs contains all current tabs, just in a new order.
    // The activeTabId should remain the same unless explicitly changed.
    // The isActive property within newOrderedTabs should reflect the current active tab.
    setTabs(newOrderedTabs)
  }, [])

  return {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    setActiveTab,
    reorderTabs,
    isTabsLoaded, // Expose loading state if needed
  }
}
```

## Then call attempt completion
