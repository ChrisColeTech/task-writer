### Rules

1.) **CONCISENESS CLAUSE** When replying use as few words as needed to explain, plan or analyze. Long winded replies waste time and tokens. No long explanations. Stick to the main points an keep it breif. Do not perform extra work or validation.

2.) **WORKSPACE DIRECTIVE** Before you write any code or run any terminal commands, Verify you are in the workspace. Do not create files or folders outside of the workspace. No other files are permitted to be created other than what is in the task files. Create files only where specified: frontend, backend, electron, (or root if main package.json).

3.) **COMMAND FORMATTING** Always use && to chain commands in terminal! Use tools properly when needed, especially: **read file, write to file, execute command, read multiple files, list files, new task and complete task.**

4.) **READ THE TASK FILE AND THEN SUMMARIZE** Summarize and list the steps in the task file in chat after you read it (**HIGH LEVEL SUMMARY ONLY - NO CODE, NO COMMANDS**). Then follow the steps **VERBATIM** in the **EXACT** order they appear in the task file. Read rules **VERBATIM**, and follow them explicitly. For efficiency, do not explain code or make overly verbose comments. Only spend a maximum of 10 seconds thinking.

5.) **IMPORTANT** you should stop to resolve build errors, missing files or missing imports.

6.) **FULL PATHS ONLY** Always confirm you are in the correct working directory first! When running terminal commands always use full paths for folders (e.g. cd C:/Projects/foo) to avoid errors.

7.) **READ FIRST DIRECTIVE** Read folders and files first before you write! File content is changed by the linter after you save. So before writing to a file you must read it first to get its latest content!

8.) Complete all work in the task file. Do not create or modify anything outside of these files.

9.) **TOOL USAGE CLAUSE** Always use the appropriate tools provided by the system for file operations. Specifically:

Use read_file to read files instead of command line utilities like type
Use write_to_file or insert_content to modify files
Use execute_command for running terminal commands Failing to use these tools properly may result in incomplete or incorrect task execution.

10.) **FINAL CHECKLIST** Always verify location before executing terminal commands. Use Full Paths: Always use full paths for directories when executing terminal commands. Resolve Terminal errors and syntax errors, ignore missing imports and do not create "placeholder" files unless instructed to do so. Do not create files or folders outside the workspace. **Only create files specified.**

# Layout Components

Create or update the files below.

## Main Layout Structure

### Layout Component

**Location:** `frontend/app/src/components/layout/Layout.tsx`

#### Purpose

Main container for application UI, arranging core elements like TitleBar and Sidebar.

#### Key Features

- Core UI structure
- Dynamic theming and styling
- Tab management
- Settings integration
- Service orchestration

#### Implementation

```typescript
import React, { useEffect } from 'react'
import TitleBar from '@/components/layout/TitleBar'
import StatusBar from '@/components/layout/StatusBar'
import Sidebar from '@/components/layout/Sidebar'
import SidePanel from '@/components/layout/SidePanel'
import { useTabs } from '@/hooks/useTabs'
import { useSettings } from '@/hooks/useSettings'
import { getTabIcon, getPanelComponent, getPageComponent } from '@/config/navigationConfig'
import { initializeAppService, getAppService } from '@/services/appService'
import WelcomePage from '@/pages/WelcomePage'
import SettingsPage from '@/pages/settings/SettingsPage'
import type { Tab } from '@/types/tab'

const Layout = (): React.ReactElement => {
  const {
    settings,
    updateSetting,
    // Removed setSidebarItemVisibility as it's no longer passed directly to SettingsPage
    toggleSidebarItemVisibility,
    isSidebarItemVisible,
    toggleSidebarItemPin,
  } = useSettings()
  const activeTab = settings.activeSidebarTab
  const isExpanded = settings.sidebarExpanded
  const {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    setActiveTab: setActiveTabInHook,
    reorderTabs,
  } = useTabs()

  // Check if current active tab has a panel
  const currentTabHasPanel = activeTab ? !!getPanelComponent(activeTab) : false

  // Initialize app service
  useEffect(() => {
    initializeAppService({
      onTabAdd: addTab,
      onTabRemove: removeTab,
      onTabActivate: setActiveTabInHook,
      onSidebarChange: (tabId: string) => updateSetting('activeSidebarTab', tabId),
    })
  }, [addTab, removeTab, setActiveTabInHook, updateSetting])

  // Auto-collapse panel when switching to a tab that doesn't have a panel
  useEffect(() => {
    if (!currentTabHasPanel && isExpanded) {
      updateSetting('sidebarExpanded', false)
    }
  }, [activeTab, currentTabHasPanel, isExpanded, updateSetting])

  // Add icons to tabs since they can't be serialized to localStorage
  const tabsWithIcons: Tab[] = tabs.map((tab) => ({
    ...tab,
    icon: getTabIcon(tab.id),
    closable: tab.closable,
  }))

  // Event handlers - delegate to app service
  const handleTabChange = (tabId: string) => {
    const appService = getAppService()
    appService?.changeSidebarItem(tabId)
  }

  const handleTabClick = (tabId: string) => {
    const appService = getAppService()
    appService?.handleTabClick(tabId)
  }

  const handleTabClose = (tabId: string) => {
    const appService = getAppService()
    appService?.handleTabClose(tabId, activeTabId)
  }

  const handleTabReorder = (newTabs: Tab[]) => {
    reorderTabs(newTabs)
  }

  const handleSettingsClick = () => {
    const appService = getAppService()
    appService?.openSettings()
  }

  const renderMainContent = () => {
    // Get all open tabs to render them persistently
    const allTabIds = tabs.map((t) => t.id)

    return (
      <div className="h-full">
        {/* Render all open tab contents, but only show the active one */}
        {allTabIds.map((tabId) => {
          const isActive = tabId === activeTabId

          let PageComponent: React.ComponentType<object> | undefined
          let pageContent: React.ReactNode = null

          // Special case for settings (needs props)
          if (tabId === 'settings') {
            pageContent = (
              <SettingsPage
                settings={settings}
                onSettingChange={updateSetting}
                toggleSidebarItemVisibility={(id: string) => toggleSidebarItemVisibility(id)}
                isSidebarItemVisible={(id: string) => isSidebarItemVisible(id, true)}
              />
            )
          } else {
            // Auto-discover page component
            PageComponent = getPageComponent(tabId) || undefined
            if (PageComponent) {
              pageContent = <PageComponent />
            }
          }

          if (!pageContent) {
            return null
          }

          return (
            <div
              key={tabId}
              style={{
                display: isActive ? 'block' : 'none',
                height: '100%',
              }}
            >
              {pageContent}
            </div>
          )
        })}

        {/* Show welcome page if no tabs are open */}
        {allTabIds.length === 0 && <WelcomePage />}
      </div>
    )
  }

  const sidebarElements =
    settings.sidebarPosition === 'left' ? (
      <>
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isExpanded={isExpanded}
          onToggleExpanded={() => updateSetting('sidebarExpanded', !isExpanded)}
          position={settings.sidebarPosition}
          onSettingsClick={handleSettingsClick}
          activeTabId={activeTabId}
          showToggleButton={currentTabHasPanel}
          isSidebarItemVisible={isSidebarItemVisible}
          pinnedItems={settings.pinnedSidebarItems}
          onToggleVisibility={toggleSidebarItemVisibility}
          onTogglePin={toggleSidebarItemPin}
        />
        <SidePanel
          activeTab={activeTab}
          isVisible={isExpanded}
          theme={settings.theme}
          sidebarPosition={settings.sidebarPosition}
        />
      </>
    ) : (
      <>
        <SidePanel
          activeTab={activeTab}
          isVisible={isExpanded}
          theme={settings.theme}
          sidebarPosition={settings.sidebarPosition}
        />
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isExpanded={isExpanded}
          onToggleExpanded={() => updateSetting('sidebarExpanded', !isExpanded)}
          position={settings.sidebarPosition}
          onSettingsClick={handleSettingsClick}
          activeTabId={activeTabId}
          showToggleButton={currentTabHasPanel}
          isSidebarItemVisible={isSidebarItemVisible}
          pinnedItems={settings.pinnedSidebarItems}
          onToggleVisibility={toggleSidebarItemVisibility}
          onTogglePin={toggleSidebarItemPin}
        />
      </>
    )

  // Generate CSS classes based on settings
  const getCssClasses = () => {
    const classes = ['h-screen', 'flex', 'flex-col', 'bg-background', 'text-text']

    // Theme class
    if (settings.theme === 'dark') {
      classes.push('dark')
    }

    // High contrast class
    if (settings.highContrast) {
      classes.push('high-contrast')
    }

    // Font size class
    classes.push(`font-${settings.fontSize}`)

    // Icon size class
    classes.push(`icon-${settings.iconSize}`)

    // Border thickness class
    classes.push(`border-${settings.borderThickness}`)

    const classString = classes.join(' ')
    console.log('Applied CSS classes:', classString, 'from settings:', settings)
    return classString
  }

  return (
    <div className={getCssClasses()}>
      <TitleBar
        sidebarPosition={settings.sidebarPosition}
        onToggleSidebarPosition={() =>
          updateSetting('sidebarPosition', settings.sidebarPosition === 'left' ? 'right' : 'left')
        }
        theme={settings.theme}
        onToggleTheme={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')}
        tabs={tabsWithIcons}
        onTabClick={handleTabClick}
        onTabClose={handleTabClose}
        onTabReorder={handleTabReorder}
        activeTabId={activeTabId}
      />

      <div className="flex-1 flex min-h-0">
        {settings.sidebarPosition === 'left' && sidebarElements}

        <main className="flex-1 bg-background overflow-hidden">{renderMainContent()}</main>

        {settings.sidebarPosition === 'right' && sidebarElements}
      </div>

      {settings.showStatusBar && <StatusBar />}
    </div>
  )
}

export default Layout
```

## Then call attempt completion
