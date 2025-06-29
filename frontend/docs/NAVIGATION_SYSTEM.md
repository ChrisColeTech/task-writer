# Navigation System Architecture

A comprehensive guide to understanding the navigation system in Task Writer, covering tabs, pages, routing, and all the hooks and services that make navigation work.

## Table of Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
- [Navigation Configuration](#navigation-configuration)
- [Tab System](#tab-system)
- [Page System](#page-system)
- [Hooks and State Management](#hooks-and-state-management)
- [Services Architecture](#services-architecture)
- [Route Discovery](#route-discovery)
- [Navigation Flow](#navigation-flow)
- [Keyboard Navigation](#keyboard-navigation)
- [Integration Patterns](#integration-patterns)

## Overview

The Task Writer navigation system is built around a **tab-based architecture** with **auto-discovery** of pages and navigation items. Unlike traditional web routing, it uses a desktop application paradigm where multiple pages can be open simultaneously in tabs.

### Key Design Principles

- **Tab-Centric Navigation**: Multiple pages open simultaneously like IDE tabs
- **Auto-Discovery**: Pages register themselves automatically via exports
- **State Persistence**: Navigation state survives application restarts
- **Keyboard-First**: Full keyboard navigation support
- **Service-Driven**: Navigation logic is centralized in services
- **Type-Safe**: Complete TypeScript coverage for navigation types

### Navigation Architecture

```
┌─────────────────────────────────────────────────────┐
│                Navigation Stack                     │
├─────────────────────────────────────────────────────┤
│ Auto-Discovery → Configuration → Tabs → Services   │
│      ↓               ↓           ↓        ↓        │
│   Page Exports → NavigationConfig → Tab State → App│
│                                                     │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│ │   useTabs   │ │  useSearch  │ │ useSettings │   │
│ │    Hook     │ │    Hook     │ │    Hook     │   │
│ └─────────────┘ └─────────────┘ └─────────────┘   │
│                       ↓                            │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│ │ AppService  │ │TabService   │ │SearchService│   │
│ │             │ │             │ │             │   │
│ └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Core Concepts

### Navigation Item vs Tab vs Page

The system distinguishes between three related but distinct concepts:

#### **1. Navigation Item**
A discoverable navigation target that can appear in the sidebar:
```tsx
interface NavigationItem {
  id: string                    // Unique identifier
  label: string                 // Display name
  iconComponent: React.ComponentType  // Icon component
  showInSidebar: boolean        // Visibility in sidebar
  order: number                 // Display order
  keyboardShortcut?: string     // Keyboard shortcut
  category?: string             // Grouping category
}
```

#### **2. Tab**
An open instance of a page with navigation state:
```tsx
interface Tab {
  id: string                    // Matches navigation item ID
  label: string                 // Display name (can differ from nav item)
  active: boolean              // Currently active tab
  closable: boolean            // Can be closed by user
  dirty?: boolean              // Has unsaved changes
  icon?: React.ComponentType   // Dynamic icon
  metadata?: Record<string, any> // Tab-specific data
}
```

#### **3. Page**
The actual React component that renders content:
```tsx
interface PageComponent {
  component: React.ComponentType    // Page component
  navigationConfig: NavigationConfig // Associated nav config
  panelComponent?: React.ComponentType // Optional side panel
}
```

### Navigation Flow

1. **Discovery**: Pages export navigation configuration
2. **Registration**: Configuration is collected and registered
3. **Rendering**: Navigation items appear in sidebar
4. **Activation**: User clicks item or uses keyboard shortcut
5. **Tab Creation**: New tab is created if needed
6. **Page Rendering**: Page component is rendered in tab content
7. **State Persistence**: Tab state is saved for session restore

## Navigation Configuration

### Page Navigation Export

Every navigable page exports a navigation configuration:

```tsx
// Example: TaskGeneratorPage.tsx
import { FileText } from 'lucide-react'
import type { NavigationConfig } from '@/types/navigation'

const TaskGeneratorPage = () => {
  // Page component implementation
  return <div>Task Generator Content</div>
}

export default TaskGeneratorPage

// Navigation configuration export
export const navigationConfig: NavigationConfig = {
  id: 'tasks',                           // Unique ID
  label: 'Task Generator',               // Display name
  iconComponent: FileText,               // Lucide icon
  showInSidebar: true,                   // Show in sidebar
  closable: true,                        // Can close tab
  order: 1,                             // Display order
  keyboardShortcut: 'Ctrl+T',           // Keyboard shortcut
  category: 'tools',                    // Grouping category
  description: 'Generate task files from project directories'
}
```

### Navigation Configuration Interface

```tsx
interface NavigationConfig {
  id: string                            // Unique identifier
  label: string                         // Display name in UI
  iconComponent: React.ComponentType    // Icon component (typically Lucide)
  showInSidebar: boolean               // Whether to show in sidebar nav
  closable: boolean                    // Whether tab can be closed
  order: number                        // Display order in sidebar
  keyboardShortcut?: string            // Optional keyboard shortcut
  category?: 'tools' | 'pages' | 'system' // Navigation category
  description?: string                 // Tooltip/description text
  requiresProject?: boolean            // Requires project to be loaded
  beta?: boolean                       // Beta feature flag
}
```

### Special Navigation Cases

#### **Welcome Page**
```tsx
export const navigationConfig: NavigationConfig = {
  id: 'welcome',
  label: 'Welcome',
  iconComponent: Home,
  showInSidebar: false,        // Not shown in sidebar
  closable: true,              // Can be closed
  order: 0,                    // Highest priority
}
```

#### **Settings Page**
```tsx
export const navigationConfig: NavigationConfig = {
  id: 'settings',
  label: 'Settings',
  iconComponent: Settings,
  showInSidebar: false,        // Accessed via other means
  closable: true,
  order: 999,                  // Lowest priority
  category: 'system'
}
```

## Tab System

### useTabs Hook (`/frontend/app/src/hooks/useTabs.ts`)

The `useTabs` hook is the central state manager for the tab system:

```tsx
interface UseTabsReturn {
  // State
  tabs: Tab[]                           // All open tabs
  activeTabId: string | null            // Currently active tab ID
  
  // Actions
  addTab: (config: Partial<Tab>) => void      // Add new tab
  removeTab: (tabId: string) => void          // Remove tab
  activateTab: (tabId: string) => void        // Switch to tab
  reorderTabs: (newTabs: Tab[]) => void       // Reorder tabs
  updateTabMetadata: (tabId: string, metadata: Record<string, any>) => void
  
  // Utilities
  getTab: (tabId: string) => Tab | undefined
  hasTab: (tabId: string) => boolean
  getActiveTab: () => Tab | undefined
}
```

#### **Core Implementation**

```tsx
const useTabs = (): UseTabsReturn => {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)

  // Load initial state from persistence
  useEffect(() => {
    const loadInitialTabs = async () => {
      try {
        const savedTabs = await tabService.loadTabs()
        if (savedTabs.length > 0) {
          setTabs(savedTabs)
          setActiveTabId(savedTabs.find(t => t.active)?.id || savedTabs[0].id)
        }
      } catch (error) {
        console.error('Failed to load tabs:', error)
      }
    }
    loadInitialTabs()
  }, [])

  // Save state when tabs change
  useEffect(() => {
    tabService.saveTabs(tabs)
  }, [tabs])

  const addTab = useCallback((config: Partial<Tab>) => {
    const navConfig = getNavigationConfig(config.id)
    if (!navConfig) return

    const newTab: Tab = {
      id: config.id!,
      label: config.label || navConfig.label,
      active: false,
      closable: config.closable ?? navConfig.closable,
      icon: navConfig.iconComponent,
      ...config
    }

    setTabs(prevTabs => {
      // Don't add if already exists
      if (prevTabs.find(tab => tab.id === newTab.id)) {
        return prevTabs.map(tab => ({
          ...tab,
          active: tab.id === newTab.id
        }))
      }

      // Add new tab and activate it
      return [...prevTabs.map(tab => ({ ...tab, active: false })), newTab]
    })

    setActiveTabId(newTab.id)
  }, [])

  const removeTab = useCallback((tabId: string) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabId)
      
      // If removed tab was active, activate adjacent tab
      if (activeTabId === tabId && newTabs.length > 0) {
        const removedIndex = prevTabs.findIndex(tab => tab.id === tabId)
        const nextIndex = removedIndex > 0 ? removedIndex - 1 : 0
        const nextTab = newTabs[nextIndex]
        
        if (nextTab) {
          setActiveTabId(nextTab.id)
          return newTabs.map(tab => ({
            ...tab,
            active: tab.id === nextTab.id
          }))
        }
      }
      
      // No tabs left
      if (newTabs.length === 0) {
        setActiveTabId(null)
      }
      
      return newTabs
    })
  }, [activeTabId])

  const activateTab = useCallback((tabId: string) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => ({
        ...tab,
        active: tab.id === tabId
      }))
    )
    setActiveTabId(tabId)
  }, [])

  const reorderTabs = useCallback((newTabs: Tab[]) => {
    setTabs(newTabs)
  }, [])

  return {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    activateTab,
    reorderTabs,
    getTab: (id: string) => tabs.find(tab => tab.id === id),
    hasTab: (id: string) => tabs.some(tab => tab.id === id),
    getActiveTab: () => tabs.find(tab => tab.active)
  }
}
```

### Tab State Persistence

Tabs are persisted across application sessions using the platform service:

```tsx
// TabService implementation
class TabService {
  private readonly STORAGE_KEY = 'application-tabs'

  async saveTabs(tabs: Tab[]): Promise<void> {
    try {
      // Serialize tabs (removing non-serializable functions like icons)
      const serializedTabs = tabs.map(tab => ({
        id: tab.id,
        label: tab.label,
        active: tab.active,
        closable: tab.closable,
        dirty: tab.dirty,
        metadata: tab.metadata
      }))

      await platformService.saveToStorage(this.STORAGE_KEY, serializedTabs)
    } catch (error) {
      console.error('Failed to save tabs:', error)
    }
  }

  async loadTabs(): Promise<Tab[]> {
    try {
      const serializedTabs = await platformService.loadFromStorage(this.STORAGE_KEY)
      if (!serializedTabs) return []

      // Restore tabs with icons from navigation config
      return serializedTabs.map(tab => ({
        ...tab,
        icon: getNavigationConfig(tab.id)?.iconComponent
      }))
    } catch (error) {
      console.error('Failed to load tabs:', error)
      return []
    }
  }
}
```

## Panel System

### Panel Architecture

Panels are contextual UI components that appear alongside pages to provide additional tools, settings, or information. The panel system is tightly integrated with the navigation system, where panels are automatically associated with their corresponding pages.

#### **Panel Discovery and Registration**

Panels are discovered alongside their page components:

```tsx
// Example: TaskGeneratorPage.tsx with associated panel
import TaskGeneratorPanel from './TaskGeneratorPanel'

const TaskGeneratorPage = () => {
  return <div>Task Generator Content</div>
}

export default TaskGeneratorPage

// Panel component export
export const panelComponent = TaskGeneratorPanel

// Navigation configuration
export const navigationConfig: NavigationConfig = {
  id: 'tasks',
  label: 'Task Generator',
  iconComponent: FileText,
  showInSidebar: true,
  closable: true,
  order: 1
}
```

#### **Panel Component Structure**

```tsx
// TaskGeneratorPanel.tsx
const TaskGeneratorPanel = () => {
  const { updateTabMetadata, getActiveTab } = useTabs()
  const activeTab = getActiveTab()
  
  // Panel-specific state management
  const [panelState, setPanelState] = useState(() => 
    activeTab?.metadata?.panelState || defaultPanelState
  )
  
  // Sync panel state with tab metadata
  useEffect(() => {
    if (activeTab) {
      updateTabMetadata(activeTab.id, {
        ...activeTab.metadata,
        panelState
      })
    }
  }, [panelState, activeTab])
  
  return (
    <div className="panel-content">
      <div className="panel-section">
        <h3 className="panel-section-title">Generator Settings</h3>
        <div className="panel-controls">
          {/* Panel-specific controls */}
        </div>
      </div>
      
      <div className="panel-section">
        <h3 className="panel-section-title">Output Options</h3>
        <div className="panel-controls">
          {/* More controls */}
        </div>
      </div>
    </div>
  )
}

export default TaskGeneratorPanel
```

#### **Panel Types and Patterns**

**1. Settings Panels**
```tsx
// SettingsPanel.tsx - Global application settings
const SettingsPanel = () => {
  const { settings, updateSetting } = useSettings()
  
  return (
    <div className="settings-panel">
      <SettingSection title="Appearance">
        <ThemeSelector value={settings.theme} onChange={(theme) => updateSetting('theme', theme)} />
        <FontSizeSelector value={settings.fontSize} onChange={(size) => updateSetting('fontSize', size)} />
      </SettingSection>
      
      <SettingSection title="Layout">
        <SidebarPositionSelector />
        <StatusBarToggle />
      </SettingSection>
    </div>
  )
}
```

**2. Tool Panels**
```tsx
// ScaffoldPanel.tsx - Tool-specific options
const ScaffoldPanel = () => {
  const [scaffoldOptions, setScaffoldOptions] = useState(defaultOptions)
  
  return (
    <div className="tool-panel">
      <PanelSection title="Script Type">
        <ScriptTypeSelector 
          value={scaffoldOptions.scriptType}
          onChange={(type) => setScaffoldOptions(prev => ({ ...prev, scriptType: type }))}
        />
      </PanelSection>
      
      <PanelSection title="Content Options">
        <ContentOptionsForm 
          options={scaffoldOptions.contentOptions}
          onChange={(options) => setScaffoldOptions(prev => ({ ...prev, contentOptions: options }))}
        />
      </PanelSection>
    </div>
  )
}
```

**3. Information Panels**
```tsx
// ProjectPanel.tsx - Read-only information display
const ProjectPanel = () => {
  const projectInfo = useProjectInfo()
  
  return (
    <div className="info-panel">
      <InfoSection title="Project Details">
        <InfoItem label="Name" value={projectInfo.name} />
        <InfoItem label="Path" value={projectInfo.path} />
        <InfoItem label="Files" value={projectInfo.fileCount} />
      </InfoSection>
      
      <InfoSection title="Statistics">
        <StatItem label="Lines of Code" value={projectInfo.stats.loc} />
        <StatItem label="Last Modified" value={projectInfo.stats.lastModified} />
      </InfoSection>
    </div>
  )
}
```

### Panel Visibility and State Management

#### **Panel Visibility Logic**

```tsx
// SidePanel.tsx - Main panel container
const SidePanel = ({ activeTab, isVisible, sidebarPosition }) => {
  // Get panel component for active tab
  const PanelComponent = useMemo(() => {
    if (!activeTab) return null
    return getPanelComponent(activeTab)
  }, [activeTab])
  
  // Don't render if no panel or not visible
  if (!isVisible || !PanelComponent) {
    return null
  }
  
  return (
    <aside className={`side-panel side-panel-${sidebarPosition === 'left' ? 'right' : 'left'}`}>
      <div className="panel-header">
        <h2 className="panel-title">
          {getPanelTitle(activeTab)}
        </h2>
        <div className="panel-controls">
          <PanelCollapseButton />
          <PanelSettingsButton />
        </div>
      </div>
      
      <div className="panel-content">
        <ErrorBoundary fallback={<PanelErrorFallback />}>
          <PanelComponent />
        </ErrorBoundary>
      </div>
    </aside>
  )
}
```

#### **Panel State Synchronization**

```tsx
// Layout.tsx - Panel visibility management
const Layout = () => {
  const { settings, updateSetting } = useSettings()
  const { activeTabId } = useTabs()
  
  // Check if current tab has an associated panel
  const currentTabHasPanel = useMemo(() => 
    activeTabId ? getPanelComponent(activeTabId) !== null : false,
    [activeTabId]
  )
  
  // Auto-show panel when navigating to tab with panel
  useEffect(() => {
    if (currentTabHasPanel && !settings.sidebarExpanded) {
      updateSetting('sidebarExpanded', true)
    }
  }, [currentTabHasPanel, settings.sidebarExpanded])
  
  // Auto-hide panel when no active tab has panel
  useEffect(() => {
    if (!currentTabHasPanel && settings.sidebarExpanded) {
      updateSetting('sidebarExpanded', false)
    }
  }, [currentTabHasPanel, settings.sidebarExpanded])
  
  return (
    <div className="layout">
      {/* Other layout components */}
      <SidePanel 
        activeTab={activeTabId}
        isVisible={settings.sidebarExpanded && currentTabHasPanel}
        sidebarPosition={settings.sidebarPosition}
      />
    </div>
  )
}
```

### Panel-Page Communication

#### **Shared State Between Page and Panel**

```tsx
// Custom hook for page-panel communication
const usePagePanelState = <T>(initialState: T, tabId: string) => {
  const { updateTabMetadata, getTab } = useTabs()
  const tab = getTab(tabId)
  
  // Get state from tab metadata
  const [state, setState] = useState<T>(() => 
    tab?.metadata?.sharedState || initialState
  )
  
  // Update tab metadata when state changes
  useEffect(() => {
    if (tab) {
      updateTabMetadata(tabId, {
        ...tab.metadata,
        sharedState: state
      })
    }
  }, [state, tab, tabId, updateTabMetadata])
  
  return [state, setState] as const
}

// Usage in page component
const TaskGeneratorPage = () => {
  const { activeTabId } = useTabs()
  const [sharedState, setSharedState] = usePagePanelState(
    { selectedFiles: [], generatorOptions: {} },
    activeTabId!
  )
  
  return (
    <div>
      <FileSelector 
        selectedFiles={sharedState.selectedFiles}
        onSelectionChange={(files) => setSharedState(prev => ({ ...prev, selectedFiles: files }))}
      />
    </div>
  )
}

// Usage in panel component
const TaskGeneratorPanel = () => {
  const { activeTabId } = useTabs()
  const [sharedState, setSharedState] = usePagePanelState(
    { selectedFiles: [], generatorOptions: {} },
    activeTabId!
  )
  
  return (
    <div>
      <GeneratorOptions 
        options={sharedState.generatorOptions}
        onChange={(options) => setSharedState(prev => ({ ...prev, generatorOptions: options }))}
      />
      <FileCount count={sharedState.selectedFiles.length} />
    </div>
  )
}
```

#### **Event-Based Communication**

```tsx
// Custom event system for page-panel communication
const usePagePanelEvents = (tabId: string) => {
  const emit = useCallback((event: string, data: any) => {
    const customEvent = new CustomEvent(`panel-${tabId}-${event}`, { detail: data })
    document.dispatchEvent(customEvent)
  }, [tabId])
  
  const on = useCallback((event: string, handler: (data: any) => void) => {
    const eventName = `panel-${tabId}-${event}`
    const wrappedHandler = (e: CustomEvent) => handler(e.detail)
    
    document.addEventListener(eventName, wrappedHandler)
    return () => document.removeEventListener(eventName, wrappedHandler)
  }, [tabId])
  
  return { emit, on }
}

// Usage in page
const TaskGeneratorPage = () => {
  const { activeTabId } = useTabs()
  const { emit } = usePagePanelEvents(activeTabId!)
  
  const handleGenerate = () => {
    emit('generation-started', { timestamp: Date.now() })
    // Generation logic
    emit('generation-completed', { success: true, fileCount: 5 })
  }
  
  return <div>Page content</div>
}

// Usage in panel
const TaskGeneratorPanel = () => {
  const { activeTabId } = useTabs()
  const { on } = usePagePanelEvents(activeTabId!)
  const [generationStatus, setGenerationStatus] = useState('idle')
  
  useEffect(() => {
    const unsubscribeStart = on('generation-started', () => {
      setGenerationStatus('generating')
    })
    
    const unsubscribeComplete = on('generation-completed', (data) => {
      setGenerationStatus('completed')
      console.log(`Generated ${data.fileCount} files`)
    })
    
    return () => {
      unsubscribeStart()
      unsubscribeComplete()
    }
  }, [on])
  
  return (
    <div>
      <StatusIndicator status={generationStatus} />
    </div>
  )
}
```

### Panel Configuration and Discovery

#### **Panel Registration System**

```tsx
// panelRegistry.ts - Central panel registration
interface PanelRegistration {
  id: string
  component: React.ComponentType
  title: string
  defaultVisible: boolean
  requiresActiveTab: boolean
  category: 'tool' | 'settings' | 'info'
}

const panelRegistry = new Map<string, PanelRegistration>()

// Auto-discovery from page modules
const discoverPanels = () => {
  const pageModules = import.meta.glob('/src/pages/**/*.tsx', { eager: true })
  
  Object.entries(pageModules).forEach(([path, module]) => {
    const moduleAny = module as any
    
    if (moduleAny.panelComponent && moduleAny.navigationConfig) {
      const config = moduleAny.navigationConfig
      panelRegistry.set(config.id, {
        id: config.id,
        component: moduleAny.panelComponent,
        title: `${config.label} Settings`,
        defaultVisible: true,
        requiresActiveTab: true,
        category: 'tool'
      })
    }
  })
  
  // Register global panels
  registerGlobalPanels()
}

const registerGlobalPanels = () => {
  // Settings panel - always available
  panelRegistry.set('settings', {
    id: 'settings',
    component: SettingsPanel,
    title: 'Settings',
    defaultVisible: true,
    requiresActiveTab: false,
    category: 'settings'
  })
  
  // Project info panel - available when project loaded
  panelRegistry.set('project-info', {
    id: 'project-info',
    component: ProjectInfoPanel,
    title: 'Project Information',
    defaultVisible: false,
    requiresActiveTab: false,
    category: 'info'
  })
}

// Panel resolution functions
export const getPanelComponent = (tabId: string): React.ComponentType | null => {
  const registration = panelRegistry.get(tabId)
  return registration?.component || null
}

export const getPanelTitle = (tabId: string): string => {
  const registration = panelRegistry.get(tabId)
  return registration?.title || 'Panel'
}

export const getAllPanels = (): PanelRegistration[] => {
  return Array.from(panelRegistry.values())
}
```

## Page System

### Page Registration and Discovery

Pages are auto-discovered through dynamic imports and exports:

#### **1. Page Discovery Process**

```tsx
// navigationConfig.ts - Auto-discovery implementation
const pageModules = import.meta.glob('/src/pages/**/*.tsx', { eager: true })

const navigationConfigs: NavigationConfig[] = []
const pageComponents: Record<string, React.ComponentType> = {}
const panelComponents: Record<string, React.ComponentType> = {}

Object.entries(pageModules).forEach(([path, module]) => {
  const moduleAny = module as any
  
  // Extract navigation config
  if (moduleAny.navigationConfig) {
    navigationConfigs.push(moduleAny.navigationConfig)
  }
  
  // Extract page component
  if (moduleAny.default) {
    const pageId = extractPageId(path)
    pageComponents[pageId] = moduleAny.default
  }
  
  // Extract panel component if exists
  if (moduleAny.panelComponent) {
    const pageId = extractPageId(path)
    panelComponents[pageId] = moduleAny.panelComponent
  }
})

// Utility functions for component resolution
export const getPageComponent = (pageId: string): React.ComponentType | null => {
  return pageComponents[pageId] || null
}

export const getPanelComponent = (pageId: string): React.ComponentType | null => {
  return panelComponents[pageId] || null
}

export const getNavigationConfig = (pageId: string): NavigationConfig | null => {
  return navigationConfigs.find(config => config.id === pageId) || null
}
```

#### **2. Page Rendering Logic**

```tsx
// Layout.tsx - Page rendering
const renderMainContent = () => {
  // Show welcome page if no tabs are open
  if (tabs.length === 0) {
    return <WelcomePage />
  }

  // Find active tab
  const activeTab = tabs.find(tab => tab.active)
  if (!activeTab) {
    return <WelcomePage />
  }

  // Get page component for active tab
  const PageComponent = getPageComponent(activeTab.id)
  if (!PageComponent) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-text mb-2">
            Page Not Found
          </h2>
          <p className="text-text-muted">
            The page "{activeTab.label}" could not be loaded.
          </p>
        </div>
      </div>
    )
  }

  // Render page with error boundary
  return (
    <ErrorBoundary
      fallback={<PageErrorFallback tabId={activeTab.id} />}
      onError={(error) => console.error(`Error in page ${activeTab.id}:`, error)}
    >
      <PageComponent />
    </ErrorBoundary>
  )
}
```

### Page Lifecycle

#### **1. Page Mounting**
```tsx
// When a tab is activated, the page component mounts
useEffect(() => {
  // Page initialization logic
  console.log(`Page ${pageId} mounted`)
  
  // Setup page-specific services
  initializePageServices()
  
  // Cleanup function
  return () => {
    console.log(`Page ${pageId} unmounting`)
    cleanupPageServices()
  }
}, [])
```

#### **2. Page State Management**
```tsx
// Pages can have their own state that persists in tab metadata
const TaskGeneratorPage = () => {
  const { updateTabMetadata, getActiveTab } = useTabs()
  const activeTab = getActiveTab()
  
  // Get persisted state from tab metadata
  const [pageState, setPageState] = useState(() => 
    activeTab?.metadata?.pageState || defaultState
  )
  
  // Persist state changes to tab metadata
  useEffect(() => {
    if (activeTab) {
      updateTabMetadata(activeTab.id, { 
        ...activeTab.metadata, 
        pageState 
      })
    }
  }, [pageState, activeTab, updateTabMetadata])
  
  return <div>Page content with persistent state</div>
}
```

## Hooks and State Management

### 1. useTabs Hook

Central tab management (detailed above in Tab System section).

### 2. useSearch Hook (`/frontend/app/src/hooks/useSearch.ts`)

Manages global search functionality across navigation:

```tsx
interface UseSearchReturn {
  // State
  isOpen: boolean                       // Search modal visibility
  query: string                         // Current search query
  results: SearchResult[]               // Search results
  isSearching: boolean                  // Loading state
  
  // Actions
  openSearch: () => void                // Open search modal
  closeSearch: () => void               // Close search modal
  setQuery: (query: string) => void     // Update search query
  performSearch: (query: string) => Promise<void> // Execute search
  navigateToResult: (result: SearchResult) => void // Navigate to result
}

const useSearch = (): UseSearchReturn => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  const { addTab, activateTab } = useTabs()
  const searchService = getSearchService()

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      // Search navigation items
      const navResults = await searchService.searchNavigation(searchQuery)
      
      // Search page content (if implemented)
      const contentResults = await searchService.searchContent(searchQuery)
      
      // Search commands/actions
      const commandResults = await searchService.searchCommands(searchQuery)
      
      setResults([...navResults, ...contentResults, ...commandResults])
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [searchService])

  const navigateToResult = useCallback((result: SearchResult) => {
    switch (result.type) {
      case 'navigation':
        // Open page in new tab
        addTab({ id: result.id, label: result.title })
        break
        
      case 'command':
        // Execute command
        result.action?.()
        break
        
      case 'content':
        // Navigate to page with search highlight
        addTab({ 
          id: result.pageId, 
          metadata: { searchQuery: query, highlightId: result.id } 
        })
        break
    }
    
    closeSearch()
  }, [addTab, query])

  // Keyboard shortcut handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        openSearch()
      }
      
      if (event.key === 'Escape' && isOpen) {
        closeSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return {
    isOpen,
    query,
    results,
    isSearching,
    openSearch: () => setIsOpen(true),
    closeSearch: () => {
      setIsOpen(false)
      setQuery('')
      setResults([])
    },
    setQuery,
    performSearch,
    navigateToResult
  }
}
```

### 3. useKeyboardShortcuts Hook

Manages global keyboard navigation:

```tsx
const useKeyboardShortcuts = () => {
  const { addTab, activateTab, removeTab, tabs, activeTabId } = useTabs()
  const { openSearch } = useSearch()
  const { updateSetting } = useSettings()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey
      
      // Global shortcuts
      if (isCtrlOrCmd) {
        switch (event.key) {
          case 'k':
            event.preventDefault()
            openSearch()
            break
            
          case 't':
            event.preventDefault()
            addTab({ id: 'tasks' })
            break
            
          case 'w':
            if (activeTabId) {
              event.preventDefault()
              removeTab(activeTabId)
            }
            break
            
          case 'Tab':
            event.preventDefault()
            // Cycle through tabs
            const currentIndex = tabs.findIndex(tab => tab.id === activeTabId)
            const nextIndex = (currentIndex + 1) % tabs.length
            if (tabs[nextIndex]) {
              activateTab(tabs[nextIndex].id)
            }
            break
        }
      }
      
      // Number key shortcuts (Ctrl+1, Ctrl+2, etc.)
      if (isCtrlOrCmd && event.key >= '1' && event.key <= '9') {
        event.preventDefault()
        const tabIndex = parseInt(event.key) - 1
        if (tabs[tabIndex]) {
          activateTab(tabs[tabIndex].id)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [tabs, activeTabId, addTab, activateTab, removeTab, openSearch])
}
```

## Services Architecture

### 1. AppService (`/frontend/app/src/services/appService.ts`)

Central coordination service for navigation actions:

```tsx
interface AppService {
  // Tab operations
  openTab(tabId: string): boolean
  handleTabClick(tabId: string): void
  handleTabClose(tabId: string): void
  
  // Navigation operations
  changeSidebarItem(itemId: string): void
  openSettings(): void
  
  // Search operations
  performGlobalSearch(query: string): Promise<SearchResult[]>
  
  // Page operations
  refreshCurrentPage(): void
  closeCurrentTab(): void
}

class AppServiceImpl implements AppService {
  constructor(
    private tabService: TabService,
    private searchService: SearchService,
    private settingsService: SettingsService
  ) {}

  openTab(tabId: string): boolean {
    try {
      const navConfig = getNavigationConfig(tabId)
      if (!navConfig) {
        console.warn(`No navigation config found for tab: ${tabId}`)
        return false
      }

      // Check if tab already exists
      if (this.tabService.hasTab(tabId)) {
        this.tabService.activateTab(tabId)
        return true
      }

      // Create new tab
      this.tabService.addTab({
        id: tabId,
        label: navConfig.label,
        closable: navConfig.closable,
        active: true
      })

      return true
    } catch (error) {
      console.error(`Failed to open tab ${tabId}:`, error)
      return false
    }
  }

  handleTabClick(tabId: string): void {
    this.tabService.activateTab(tabId)
  }

  handleTabClose(tabId: string): void {
    this.tabService.removeTab(tabId)
  }

  changeSidebarItem(itemId: string): void {
    // Update sidebar selection
    this.settingsService.updateSetting('activeSidebarTab', itemId)
    
    // Open corresponding tab if navigation item
    const navConfig = getNavigationConfig(itemId)
    if (navConfig && navConfig.showInSidebar) {
      this.openTab(itemId)
    }
  }

  openSettings(): void {
    this.openTab('settings')
    // Auto-expand settings panel
    this.settingsService.updateSetting('sidebarExpanded', true)
  }
}
```

### 2. TabService

Lower-level tab state management:

```tsx
class TabService {
  private tabs: Tab[] = []
  private activeTabId: string | null = null
  private listeners: Set<(tabs: Tab[]) => void> = new Set()

  addTab(config: Partial<Tab>): void {
    const navConfig = getNavigationConfig(config.id!)
    if (!navConfig) return

    const newTab: Tab = {
      id: config.id!,
      label: config.label || navConfig.label,
      active: true,
      closable: config.closable ?? navConfig.closable,
      icon: navConfig.iconComponent,
      ...config
    }

    // Deactivate other tabs
    this.tabs = this.tabs.map(tab => ({ ...tab, active: false }))
    
    // Add new tab
    this.tabs.push(newTab)
    this.activeTabId = newTab.id
    
    this.notifyListeners()
    this.persistTabs()
  }

  removeTab(tabId: string): void {
    const tabIndex = this.tabs.findIndex(tab => tab.id === tabId)
    if (tabIndex === -1) return

    this.tabs.splice(tabIndex, 1)

    // Handle active tab removal
    if (this.activeTabId === tabId) {
      if (this.tabs.length > 0) {
        // Activate adjacent tab
        const nextIndex = Math.min(tabIndex, this.tabs.length - 1)
        this.activeTabId = this.tabs[nextIndex].id
        this.tabs[nextIndex].active = true
      } else {
        this.activeTabId = null
      }
    }

    this.notifyListeners()
    this.persistTabs()
  }

  activateTab(tabId: string): void {
    this.tabs = this.tabs.map(tab => ({
      ...tab,
      active: tab.id === tabId
    }))
    this.activeTabId = tabId
    
    this.notifyListeners()
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.tabs]))
  }

  subscribe(listener: (tabs: Tab[]) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}
```

### 3. SearchService

Handles search across navigation and content:

```tsx
class SearchService {
  async searchNavigation(query: string): Promise<NavigationSearchResult[]> {
    const configs = getAllNavigationConfigs()
    
    return configs
      .filter(config => 
        config.label.toLowerCase().includes(query.toLowerCase()) ||
        config.description?.toLowerCase().includes(query.toLowerCase())
      )
      .map(config => ({
        type: 'navigation',
        id: config.id,
        title: config.label,
        description: config.description,
        icon: config.iconComponent,
        score: calculateRelevanceScore(query, config.label)
      }))
      .sort((a, b) => b.score - a.score)
  }

  async searchCommands(query: string): Promise<CommandSearchResult[]> {
    const commands = [
      {
        id: 'open-settings',
        title: 'Open Settings',
        description: 'Open application settings',
        keywords: ['settings', 'preferences', 'config'],
        action: () => getAppService()?.openSettings()
      },
      {
        id: 'toggle-theme',
        title: 'Toggle Theme',
        description: 'Switch between light and dark theme',
        keywords: ['theme', 'dark', 'light'],
        action: () => getAppService()?.toggleTheme()
      }
    ]

    return commands
      .filter(command =>
        command.title.toLowerCase().includes(query.toLowerCase()) ||
        command.keywords.some(keyword => 
          keyword.toLowerCase().includes(query.toLowerCase())
        )
      )
      .map(command => ({
        type: 'command',
        id: command.id,
        title: command.title,
        description: command.description,
        action: command.action,
        score: calculateCommandScore(query, command)
      }))
  }

  async searchContent(query: string): Promise<ContentSearchResult[]> {
    // Future implementation for searching within page content
    // Could index page text content for full-text search
    return []
  }
}
```

## Route Discovery

### Auto-Discovery Mechanism

The navigation system automatically discovers pages and their configurations:

#### **1. File System Scanning**

```tsx
// Vite glob import for auto-discovery
const pageModules = import.meta.glob([
  '/src/pages/**/*.tsx',
  '/src/pages/**/*.ts'
], { eager: true })

const discovered = {
  navigationConfigs: [] as NavigationConfig[],
  pageComponents: {} as Record<string, React.ComponentType>,
  panelComponents: {} as Record<string, React.ComponentType>
}

Object.entries(pageModules).forEach(([filePath, module]) => {
  const moduleAny = module as any
  
  // Extract page ID from file path
  const pageId = extractPageIdFromPath(filePath)
  
  // Register navigation config
  if (moduleAny.navigationConfig) {
    discovered.navigationConfigs.push({
      ...moduleAny.navigationConfig,
      _filePath: filePath // Debug info
    })
  }
  
  // Register page component
  if (moduleAny.default) {
    discovered.pageComponents[pageId] = moduleAny.default
  }
  
  // Register optional panel component
  if (moduleAny.panelComponent) {
    discovered.panelComponents[pageId] = moduleAny.panelComponent
  }
})
```

#### **2. Configuration Validation**

```tsx
const validateNavigationConfig = (config: NavigationConfig): boolean => {
  const errors: string[] = []
  
  if (!config.id || typeof config.id !== 'string') {
    errors.push('Navigation config must have a valid string ID')
  }
  
  if (!config.label || typeof config.label !== 'string') {
    errors.push('Navigation config must have a valid string label')
  }
  
  if (!config.iconComponent || typeof config.iconComponent !== 'function') {
    errors.push('Navigation config must have a valid React component as iconComponent')
  }
  
  if (typeof config.showInSidebar !== 'boolean') {
    errors.push('Navigation config must specify showInSidebar as boolean')
  }
  
  if (typeof config.order !== 'number') {
    errors.push('Navigation config must have a numeric order')
  }
  
  if (errors.length > 0) {
    console.error(`Invalid navigation config for ${config.id}:`, errors)
    return false
  }
  
  return true
}

// Filter and validate discovered configs
discovered.navigationConfigs = discovered.navigationConfigs
  .filter(validateNavigationConfig)
  .sort((a, b) => a.order - b.order)
```

#### **3. Runtime Registration**

```tsx
// Register all discovered navigation items
const registerNavigationSystem = () => {
  // Create navigation registry
  const registry = new Map<string, NavigationItem>()
  
  discovered.navigationConfigs.forEach(config => {
    registry.set(config.id, {
      ...config,
      component: discovered.pageComponents[config.id],
      panelComponent: discovered.panelComponents[config.id]
    })
  })
  
  // Make registry globally available
  setGlobalNavigationRegistry(registry)
  
  // Initialize services with registry
  const appService = new AppServiceImpl(
    new TabService(),
    new SearchService(registry),
    getSettingsService()
  )
  
  setGlobalAppService(appService)
}
```

## Navigation Flow

### Complete Navigation Sequence

#### **1. User Initiates Navigation**

Multiple entry points can trigger navigation:

```tsx
// A. Sidebar item click
const handleSidebarItemClick = (itemId: string) => {
  const appService = getAppService()
  appService?.changeSidebarItem(itemId)
}

// B. Keyboard shortcut
const handleKeyboardShortcut = (shortcut: string) => {
  const config = findNavigationConfigByShortcut(shortcut)
  if (config) {
    const appService = getAppService()
    appService?.openTab(config.id)
  }
}

// C. Search result selection
const handleSearchResultSelect = (result: SearchResult) => {
  if (result.type === 'navigation') {
    const appService = getAppService()
    appService?.openTab(result.id)
  }
}

// D. Direct API call
const openTaskGenerator = () => {
  const appService = getAppService()
  appService?.openTab('tasks')
}
```

#### **2. AppService Processes Request**

```tsx
openTab(tabId: string): boolean {
  // Validate navigation target
  const navConfig = getNavigationConfig(tabId)
  if (!navConfig) {
    console.warn(`Unknown navigation target: ${tabId}`)
    return false
  }
  
  // Check if tab already exists
  if (this.tabService.hasTab(tabId)) {
    this.tabService.activateTab(tabId)
    this.updateSidebarState(tabId)
    return true
  }
  
  // Create new tab
  const success = this.tabService.addTab({
    id: tabId,
    label: navConfig.label,
    closable: navConfig.closable
  })
  
  if (success) {
    this.updateSidebarState(tabId)
    this.handlePostNavigationEffects(tabId)
  }
  
  return success
}
```

#### **3. Tab System Updates**

```tsx
// TabService.addTab implementation
addTab(config: Partial<Tab>): boolean {
  try {
    // Create tab object
    const newTab = this.createTab(config)
    
    // Update tab list
    this.deactivateAllTabs()
    this.tabs.push(newTab)
    this.activeTabId = newTab.id
    
    // Persist state
    this.saveTabsToStorage()
    
    // Notify listeners
    this.notifyTabsChanged()
    
    return true
  } catch (error) {
    console.error('Failed to add tab:', error)
    return false
  }
}
```

#### **4. UI Components React**

```tsx
// Layout component receives tab updates
const Layout = () => {
  const { tabs, activeTabId } = useTabs()
  
  // Update sidebar active state
  useEffect(() => {
    if (activeTabId && activeTabId !== activeTab) {
      updateSetting('activeSidebarTab', activeTabId)
    }
  }, [activeTabId])
  
  // Update panel visibility
  useEffect(() => {
    const shouldShowPanel = activeTabId && getPanelComponent(activeTabId)
    if (shouldShowPanel && !isExpanded) {
      updateSetting('sidebarExpanded', true)
    }
  }, [activeTabId])
  
  // Render active page
  const renderMainContent = () => {
    if (!activeTabId) return <WelcomePage />
    
    const PageComponent = getPageComponent(activeTabId)
    return PageComponent ? <PageComponent /> : <PageNotFound />
  }
  
  return (
    <div className={layoutClasses}>
      <TitleBar tabs={tabs} activeTabId={activeTabId} />
      <div className="layout-main">
        <Sidebar activeItem={activeTab} />
        <main>{renderMainContent()}</main>
        <SidePanel activeTab={activeTab} />
      </div>
    </div>
  )
}
```

#### **5. Page Component Mounts**

```tsx
const TaskGeneratorPage = () => {
  // Page-specific initialization
  useEffect(() => {
    console.log('Task Generator page mounted')
    
    // Initialize page services
    const taskService = getTaskService()
    taskService.initialize()
    
    // Setup page-specific keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      taskService.cleanup()
    }
  }, [])
  
  return <div>Task Generator Content</div>
}
```

## Keyboard Navigation

### Global Shortcuts

The application supports comprehensive keyboard navigation:

```tsx
const GLOBAL_SHORTCUTS = {
  // Search
  'Ctrl+K': () => openSearch(),
  'Cmd+K': () => openSearch(),
  
  // Tab operations
  'Ctrl+T': () => openTab('tasks'),
  'Ctrl+W': () => closeCurrentTab(),
  'Ctrl+Tab': () => nextTab(),
  'Ctrl+Shift+Tab': () => previousTab(),
  
  // Navigation
  'Ctrl+1': () => activateTabByIndex(0),
  'Ctrl+2': () => activateTabByIndex(1),
  'Ctrl+3': () => activateTabByIndex(2),
  // ... up to Ctrl+9
  
  // Application
  'Ctrl+,': () => openSettings(),
  'F11': () => toggleFullscreen(),
  'Ctrl+R': () => refreshCurrentPage(),
  
  // Sidebar
  'Ctrl+B': () => toggleSidebar(),
  'Ctrl+Shift+E': () => openExplorer(),
  
  // Panel
  'Ctrl+J': () => togglePanel(),
}
```

### Context-Specific Shortcuts

Pages can define their own keyboard shortcuts:

```tsx
const TaskGeneratorPage = () => {
  useKeyboardShortcuts({
    'Ctrl+S': handleSave,
    'Ctrl+G': handleGenerate,
    'Ctrl+E': handleExport,
    'Escape': handleCancel
  })
  
  return <div>Page content</div>
}
```

### Accessibility Navigation

Full keyboard accessibility support:

```tsx
const NavigationItem = ({ item, isActive, onClick }) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        onClick(item.id)
        break
        
      case 'ArrowDown':
        e.preventDefault()
        focusNextItem()
        break
        
      case 'ArrowUp':
        e.preventDefault()
        focusPreviousItem()
        break
    }
  }
  
  return (
    <button
      className={`nav-item ${isActive ? 'active' : ''}`}
      onClick={() => onClick(item.id)}
      onKeyDown={handleKeyDown}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
      tabIndex={isActive ? 0 : -1}
    >
      <item.iconComponent aria-hidden="true" />
      <span>{item.label}</span>
    </button>
  )
}
```

## Integration Patterns

### State Synchronization Pattern

Multiple components need to stay in sync with navigation state:

```tsx
// Pattern: State synchronization between tab system and sidebar
const Layout = () => {
  const { tabs, activeTabId } = useTabs()
  const { settings, updateSetting } = useSettings()
  
  // Sync: Tab → Sidebar
  useEffect(() => {
    if (activeTabId && activeTabId !== settings.activeSidebarTab) {
      updateSetting('activeSidebarTab', activeTabId)
    }
  }, [activeTabId])
  
  // Sync: Tab closure → Panel visibility
  useEffect(() => {
    const hasActiveTabWithPanel = activeTabId && getPanelComponent(activeTabId)
    if (!hasActiveTabWithPanel && settings.sidebarExpanded) {
      updateSetting('sidebarExpanded', false)
    }
  }, [activeTabId])
}
```

### Service Integration Pattern

Services coordinate complex navigation scenarios:

```tsx
// Pattern: Multi-service coordination
class AppServiceImpl {
  async openTabWithData(tabId: string, data: any): Promise<boolean> {
    try {
      // 1. Validate navigation
      const navConfig = getNavigationConfig(tabId)
      if (!navConfig) return false
      
      // 2. Prepare data for page
      const processedData = await this.dataService.processForPage(tabId, data)
      
      // 3. Create tab with metadata
      const success = this.tabService.addTab({
        id: tabId,
        metadata: { initialData: processedData }
      })
      
      if (success) {
        // 4. Update sidebar state
        this.settingsService.updateSetting('activeSidebarTab', tabId)
        
        // 5. Show panel if needed
        if (getPanelComponent(tabId)) {
          this.settingsService.updateSetting('sidebarExpanded', true)
        }
        
        // 6. Track analytics
        this.analyticsService.trackNavigation(tabId, 'open-with-data')
      }
      
      return success
    } catch (error) {
      console.error('Failed to open tab with data:', error)
      return false
    }
  }
}
```

### Error Handling Pattern

Robust error handling throughout the navigation system:

```tsx
// Pattern: Navigation error boundaries
const NavigationErrorBoundary = ({ children, fallback, onError }) => {
  const handleError = useCallback((error: Error, errorInfo: ErrorInfo) => {
    console.error('Navigation error:', error, errorInfo)
    
    // Track error
    getAnalyticsService()?.trackError('navigation', error)
    
    // Attempt recovery
    const recovery = getNavigationRecoveryService()
    recovery.attemptRecovery(error)
    
    // Notify callback
    onError?.(error, errorInfo)
  }, [onError])
  
  return (
    <ErrorBoundary onError={handleError} fallback={fallback}>
      {children}
    </ErrorBoundary>
  )
}

// Usage in Layout
<NavigationErrorBoundary
  fallback={<NavigationErrorFallback />}
  onError={(error) => {
    // Show user-friendly error message
    toast.error('Navigation Error', 'Failed to load page. Please try again.')
  }}
>
  <PageContent />
</NavigationErrorBoundary>
```

This comprehensive navigation system provides a flexible, robust foundation for the Task Writer application's tab-based interface, combining the familiarity of desktop application navigation with the power of modern web technologies.