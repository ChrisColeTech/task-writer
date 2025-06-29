# Application Layout Architecture

A comprehensive guide to understanding the layout system in Task Writer, covering all visual components and their interactions.

**🎉 Status: REFACTORED** - This layout system has been completely refactored in December 2024 following the architecture guide. The layout is now modular, maintainable, and follows modern React patterns.

## Table of Contents

- [Overview](#overview)
- [Layout Components](#layout-components)
- [Layout Orchestration](#layout-orchestration)
- [State Management](#state-management)
- [Responsive Design](#responsive-design)
- [Platform Integration](#platform-integration)
- [Theming and Settings](#theming-and-settings)

## Overview

The Task Writer application uses a sophisticated layout system that provides a native desktop application experience with cross-platform compatibility. The layout is orchestrated by the main `Layout` component and consists of four primary visual zones:

```
┌─────────────────────────────────────────────────────┐
│                   Title Bar                         │
├─────────────────────────────────────────────────────┤
│                   Tab Bar                          │
├──────────────┬──────────────────┬──────────────────┤
│              │                  │                  │
│   Sidebar    │   Main Content   │   Side Panel     │
│              │                  │                  │
│              │                  │                  │
├──────────────┴──────────────────┴──────────────────┤
│                 Status Bar                         │
└─────────────────────────────────────────────────────┘
```

### Key Design Principles

- **Platform Native Feel**: Mimics native desktop application behavior
- **Responsive Layout**: Adapts to different screen sizes and orientations
- **Accessibility First**: Full keyboard navigation and screen reader support
- **Theme Integration**: Complete integration with user theme preferences
- **State Persistence**: Layout preferences survive application restarts

## Layout Components

**✅ Refactored Architecture**: The layout system has been completely refactored into focused, modular components following the architecture guide.

### New Layout Architecture

The layout is now orchestrated by the main `Layout` component (`/src/components/layout/Layout.tsx`) which composes three focused sub-components:

#### **Layout Orchestration** (132 lines, was 313 lines - 57% reduction)
```tsx
// src/components/layout/Layout.tsx
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const layoutState = useLayoutState()
  const layoutServices = useLayoutServices()
  const layoutKeyboard = useLayoutKeyboard()

  return (
    <div className={layoutState.containerClasses}>
      <LayoutHeader {...headerProps} />
      <LayoutMain>
        {children}
      </LayoutMain>
      <LayoutSidebar {...sidebarProps} />
    </div>
  )
}
```

### 1. LayoutHeader (`/src/components/layout/LayoutHeader.tsx`)

**Focused Responsibility**: Title bar, window controls, and application search

#### **Structure**
```tsx
<header className="layout-header">
  <div className="drag-region">           {/* Window dragging area */}
    <TabContainer />                      {/* Tab management */}
  </div>
  <div className="controls-region">       {/* Non-draggable controls */}
    <AppControls />                       {/* App-specific controls */}
    <WindowControls />                    {/* Platform window controls */}
  </div>
</header>
```

#### **Key Features**
- **Window Dragging**: Uses `webkit-app-region: drag` for native window dragging
- **Tab Management**: Integrated tab bar with drag-and-drop reordering
- **App Controls**: Theme toggle, sidebar position, search activation
- **Window Controls**: Platform-specific minimize/maximize/close buttons
- **No-Drag Zones**: Controls are marked as `webkit-app-region: no-drag`

#### **Platform Behaviors**
```tsx
// Electron: Full window control
const isElectron = platformService.isElectron()

// macOS: Traffic light controls on left
const isMac = platformService.isMac()

// Windows/Linux: Standard controls on right
const showWindowControls = isElectron && !isMac
```

#### **State Dependencies**
- `tabs: Tab[]` - Current open tabs
- `activeTabId: string` - Currently active tab
- `sidebarPosition: 'left' | 'right'` - Sidebar placement
- `theme: 'light' | 'dark'` - Current theme

### 2. Tab Bar (Integrated within TitleBar)

The tab bar manages multiple open pages and provides tab-based navigation.

#### **Tab Component Structure**
```tsx
<div className="tab-container">
  {tabs.map(tab => (
    <div key={tab.id} className={`tab ${tab.active ? 'active' : ''}`}>
      <TabIcon icon={tab.icon} />
      <TabLabel>{tab.label}</TabLabel>
      {tab.closable && <TabCloseButton onClick={() => onClose(tab.id)} />}
    </div>
  ))}
</div>
```

#### **Tab Features**
- **Drag & Drop Reordering**: Full support for tab reordering
- **Context Menus**: Right-click for tab actions
- **Keyboard Navigation**: Arrow keys, Ctrl+Tab, Ctrl+W
- **Visual States**: Active, hover, focus, dirty (unsaved changes)
- **Icons**: Dynamic icons based on page type
- **Close Buttons**: Configurable closable tabs

#### **Tab States**
```tsx
interface Tab {
  id: string                    // Unique identifier
  label: string                 // Display name
  icon?: React.ComponentType    // Tab icon
  active: boolean              // Current active tab
  closable: boolean            // Can be closed
  dirty?: boolean              // Has unsaved changes
  pinned?: boolean             // Pinned tab (future feature)
}
```

### 2. LayoutMain (`/src/components/layout/LayoutMainContent.tsx`)

**Focused Responsibility**: Main content area and routing

#### **Structure**
```tsx
<main className="layout-main">
  <div className="content-container">
    {children} {/* Page components rendered here */}
  </div>
</main>
```

### 3. LayoutSidebar (`/src/components/layout/LayoutSidebar.tsx`)

**Focused Responsibility**: Navigation sidebar with auto-discovery

#### **Structure**
```tsx
<aside className={`layout-sidebar sidebar-${sidebarPosition}`}>
  <div className="sidebar-header">
    <Logo />
    <CollapseButton />
  </div>
  
  <nav className="sidebar-navigation">
    <div className="sidebar-section">
      <SectionHeader>Tools</SectionHeader>
      <NavigationItems items={toolItems} />
    </div>
    
    <div className="sidebar-section">
      <SectionHeader>Pages</SectionHeader>
      <NavigationItems items={pageItems} />
    </div>
  </nav>
  
  <div className="sidebar-footer">
    <SettingsButton />
    <UserProfile />
  </div>
</aside>
```

#### **Navigation Items**
Navigation items are auto-discovered from page exports:

```tsx
// Each page exports navigation config
export const navigationConfig: NavigationConfig = {
  id: 'tasks',
  label: 'Task Generator',
  iconComponent: FileText,
  showInSidebar: true,
  order: 1,
  keyboardShortcut: 'Ctrl+T'
}
```

#### **Sidebar States**
- **Expanded/Collapsed**: Full sidebar or icon-only mode
- **Position**: Left or right side of the application
- **Active Item**: Highlights current page/tool
- **Visibility Overrides**: User can hide specific items

#### **Item Visibility Logic**
```tsx
const isItemVisible = (item: NavigationItem) => {
  // Check user visibility overrides
  const userOverride = settings.sidebarItemVisibility[item.id]
  if (userOverride !== undefined) return userOverride
  
  // Check default visibility
  return item.showInSidebar ?? true
}
```

### 4. Side Panel (`/src/components/layout/SidePanel.tsx`)

The side panel provides contextual tools and settings for the current page.

#### **Structure**
```tsx
<aside className={`side-panel side-panel-${sidebarPosition === 'left' ? 'right' : 'left'}`}>
  <div className="panel-header">
    <PanelTitle>{panelTitle}</PanelTitle>
    <PanelControls />
  </div>
  
  <div className="panel-content">
    <DynamicPanelComponent />
  </div>
</aside>
```

#### **Panel Discovery**
Panels are auto-discovered and mapped to pages:

```tsx
// Panel mapping in navigationConfig.ts
const panelMapping: Record<string, React.ComponentType> = {
  'settings': SettingsPanel,
  'tasks': TasksPanel,
  'scaffold': ScaffoldPanel
}

// Dynamic panel resolution
const getPanelComponent = (tabId: string) => {
  return panelMapping[tabId] || null
}
```

#### **Panel Visibility Logic**
```tsx
const shouldShowPanel = useMemo(() => {
  return (
    isExpanded &&                           // User has panels enabled
    activeTab &&                           // There's an active tab
    getPanelComponent(activeTab) !== null  // Tab has associated panel
  )
}, [isExpanded, activeTab])
```

### 5. Status Bar (`/src/components/layout/StatusBar.tsx`)

The status bar displays application status and provides quick access to common actions.

#### **Structure**
```tsx
<footer className="status-bar">
  <div className="status-left">
    <ConnectionStatus />
    <ProjectInfo />
    <ActivityIndicator />
  </div>
  
  <div className="status-center">
    <ProgressIndicator />
    <StatusMessage />
  </div>
  
  <div className="status-right">
    <SettingsQuickAccess />
    <ThemeToggle />
    <NotificationBadge />
  </div>
</footer>
```

#### **Status Components**
- **Connection Status**: Shows Electron/browser connection state
- **Project Info**: Current project or directory information
- **Activity Indicator**: Shows background operations
- **Progress Indicator**: File processing, generation progress
- **Settings Quick Access**: Font size, theme, shortcuts
- **Notification Badge**: Unread notifications count

#### **User Preference**
The status bar can be hidden via user settings:
```tsx
{settings.showStatusBar && <StatusBar />}
```

## State Management

**✅ Refactored**: State management has been extracted into focused custom hooks following the architecture guide.

### Custom Hooks for Layout State

#### **useLayoutState** (`/src/hooks/useLayoutState.ts`)

**Responsibility**: Main layout state management and computed values

```tsx
export const useLayoutState = () => {
  const { settings } = useSettings()
  const { tabs, activeTabId } = useTabs()
  
  // Computed layout classes
  const containerClasses = useMemo(() => 
    cn(
      'layout-container',
      `theme-${settings.colorScheme}`,
      settings.darkMode && 'dark',
      settings.highContrast && 'high-contrast',
      `font-${settings.fontSize}`,
      `icon-${settings.iconSize}`
    ), [settings]
  )
  
  // Panel visibility logic
  const currentTabHasPanel = useMemo(() => 
    getPanelComponent(activeTabId) !== null, [activeTabId]
  )
  
  return {
    containerClasses,
    currentTabHasPanel,
    activeTabId,
    settings,
    // ... other computed state
  }
}
```

#### **useLayoutServices** (`/src/hooks/useLayoutServices.ts`)

**Responsibility**: Service initialization and dependency injection

```tsx
export const useLayoutServices = () => {
  const services = useMemo(() => ({
    appService: getAppService(),
    notificationService: getNotificationService(),
    settingsService: getSettingsService(),
  }), [])
  
  return services
}
```

#### **useLayoutKeyboard** (`/src/hooks/useLayoutKeyboard.ts`)

**Responsibility**: Global keyboard shortcuts and navigation

```tsx
export const useLayoutKeyboard = () => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Spotlight search shortcut
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      showSpotlightSearch()
    }
    
    // Tab navigation shortcuts
    if ((event.ctrlKey || event.metaKey) && event.key >= '1' && event.key <= '9') {
      const tabIndex = parseInt(event.key) - 1
      switchToTab(tabIndex)
    }
  }, [])
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
```

## Layout Orchestration

### Refactored Layout Component (`/src/components/layout/Layout.tsx`)

The Layout component now focuses purely on orchestration and composition:

#### **Simplified Component Structure** (132 lines, was 313 lines)
```tsx
const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Clean separation via custom hooks
  const layoutState = useLayoutState()
  const layoutServices = useLayoutServices()
  const layoutKeyboard = useLayoutKeyboard()
    }
  }, [currentTabHasPanel, isExpanded, activeTabId, updateSetting])

  return (
    <div className={layoutClasses}>
      <TitleBar {...titleBarProps} />
      
      <div className="layout-main">
        <Sidebar {...sidebarProps} />
        <MainContent>{renderMainContent()}</MainContent>
        <SidePanel {...sidePanelProps} />
      </div>
      
      {settings.showStatusBar && <StatusBar />}
      <ToastContainer {...toastProps} />
    </div>
  )
}
```

#### **CSS Class Generation**
The layout applies theme and setting classes dynamically:

```tsx
const cssClasses = useMemo(() => {
  const classes = ['h-screen', 'flex', 'flex-col', 'bg-background', 'text-text']
  
  // Theme classes
  if (settings.theme === 'dark') classes.push('dark')
  if (settings.highContrast) classes.push('high-contrast')
  
  // Scaling classes
  classes.push(`font-${settings.fontSize}`)      // Font scaling
  classes.push(`icon-${settings.iconSize}`)      // Icon scaling
  classes.push(`border-${settings.borderThickness}`) // Border scaling
  
  return classes.join(' ')
}, [settings])
```

## State Management

### Layout State Sources

#### **1. useSettings Hook**
Manages persistent user preferences:
```tsx
interface LayoutSettings {
  sidebarPosition: 'left' | 'right'    // Sidebar placement
  showStatusBar: boolean               // Status bar visibility
  sidebarExpanded: boolean             // Panel expansion state
  activeSidebarTab: string             // Current sidebar selection
  theme: 'light' | 'dark'              // Visual theme
  fontSize: 'small' | 'medium' | 'large'  // Text scaling
  iconSize: 'small' | 'medium' | 'large'  // Icon scaling
  borderThickness: 'none' | 'thin' | 'medium' | 'thick' // Border styling
}
```

#### **2. useTabs Hook**
Manages tab state and operations:
```tsx
interface TabState {
  tabs: Tab[]                    // All open tabs
  activeTabId: string | null     // Currently active tab
  addTab: (tab: Tab) => void     // Add new tab
  removeTab: (tabId: string) => void  // Remove tab
  activateTab: (tabId: string) => void // Switch to tab
  reorderTabs: (newOrder: Tab[]) => void // Reorder tabs
}
```

#### **3. useToast Hook**
Manages notification system:
```tsx
interface ToastState {
  toasts: Toast[]                // Active notifications
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  dismissToast: (id: string) => void
}
```

### State Synchronization

The layout manages complex state synchronization between different systems:

#### **Tab ↔ Sidebar Sync**
```tsx
// When tab changes, update sidebar
useEffect(() => {
  if (activeTabId && activeTabId !== activeTab) {
    updateSetting('activeSidebarTab', activeTabId)
  }
}, [activeTabId, activeTab])

// When sidebar item clicked, open corresponding tab
const handleSidebarItemClick = useCallback((itemId: string) => {
  if (!tabs.find(tab => tab.id === itemId)) {
    addTab({ id: itemId, label: getItemLabel(itemId) })
  }
  activateTab(itemId)
}, [tabs, addTab, activateTab])
```

#### **Panel ↔ Tab Sync**
```tsx
// Auto-show panel when tab has associated panel
useEffect(() => {
  if (activeTabId && getPanelComponent(activeTabId) && !isExpanded) {
    updateSetting('sidebarExpanded', true)
  }
}, [activeTabId, isExpanded])

// Auto-hide panel when no relevant tab
useEffect(() => {
  if (!currentTabHasPanel && isExpanded) {
    updateSetting('sidebarExpanded', false)
  }
}, [currentTabHasPanel, isExpanded])
```

## Responsive Design

### Layout Breakpoints

The layout adapts to different screen sizes using Tailwind CSS breakpoints:

```tsx
// Mobile: Stack layout, collapsed sidebar
className="flex flex-col lg:flex-row"

// Tablet: Sidebar overlay mode
className="lg:relative lg:translate-x-0 absolute z-50 transform -translate-x-full"

// Desktop: Full layout with panels
className="hidden lg:block" // Side panel only on large screens
```

### Responsive Behaviors

#### **Mobile (< 1024px)**
- Sidebar becomes overlay/drawer
- Side panel is hidden
- Tabs stack in dropdown menu
- Status bar shows minimal info

#### **Tablet (1024px - 1440px)**
- Sidebar is collapsible
- Side panel is optional
- Full tab bar with scrolling
- Complete status bar

#### **Desktop (> 1440px)**
- All components visible
- Side panel always available
- Wide tab bar with full labels
- Extended status bar info

## Platform Integration

### Electron Integration

When running in Electron, the layout integrates with native platform features:

#### **Window Controls**
```tsx
// Windows/Linux: Custom window controls
{platformService.isElectron() && !platformService.isMac() && (
  <WindowControls 
    onMinimize={() => window.electronAPI?.minimizeWindow()}
    onMaximize={() => window.electronAPI?.maximizeWindow()}
    onClose={() => window.electronAPI?.closeWindow()}
  />
)}

// macOS: Use native traffic lights (hidden custom controls)
```

#### **Drag Regions**
```tsx
// Title bar is draggable
style={{ WebkitAppRegion: 'drag' }}

// Controls are not draggable
style={{ WebkitAppRegion: 'no-drag' }}
```

#### **Menu Integration**
```tsx
// Electron menu shortcuts trigger layout actions
useEffect(() => {
  if (window.electronAPI) {
    window.electronAPI.onMenuAction((action) => {
      switch (action) {
        case 'toggle-sidebar':
          updateSetting('sidebarExpanded', !isExpanded)
          break
        case 'new-tab':
          addTab(createNewTab())
          break
      }
    })
  }
}, [])
```

### Browser Compatibility

In browser mode, the layout adapts gracefully:

```tsx
// No window controls in browser
const showWindowControls = platformService.isElectron()

// Limited drag functionality
const dragRegionStyle = platformService.isElectron() 
  ? { WebkitAppRegion: 'drag' } 
  : {}

// Different keyboard shortcuts
const shortcuts = platformService.isElectron()
  ? electronShortcuts
  : browserShortcuts
```

## Theming and Settings

### Theme Application

The layout applies themes through CSS custom properties:

```tsx
// Theme classes applied to root layout
const themeClasses = [
  'bg-background',        // Page background
  'text-text',           // Default text color
  settings.theme === 'dark' ? 'dark' : '',
  settings.highContrast ? 'high-contrast' : ''
]
```

### CSS Custom Properties

Themes are implemented via CSS variables that cascade throughout the layout:

```css
:root {
  --background: #ffffff;
  --surface: #f5f5f5;
  --text: #121212;
  --accent: #121212;
  --border: #e5e5e5;
}

.dark {
  --background: #121212;
  --surface: #1e1e1e;
  --text: #ffffff;
  --accent: #ffffff;
  --border: #2a2a2a;
}
```

### Dynamic Scaling

User preferences for font and icon sizes are applied via CSS classes:

```css
.font-small { --font-scale-factor: 0.85; }
.font-medium { --font-scale-factor: 1; }
.font-large { --font-scale-factor: 1.15; }

.icon-small { --icon-scale-factor: 0.85; }
.icon-medium { --icon-scale-factor: 1; }
.icon-large { --icon-scale-factor: 1.15; }
```

### Border Styling

Border thickness is controlled globally:

```css
.border-none .app-border { border-width: 0; }
.border-thin .app-border { border: 1px solid var(--border-thin); }
.border-medium .app-border { border-width: 1px; }
.border-thick .app-border { border-width: 2px; }
```

## Architecture Summary

The Task Writer layout system provides:

1. **Modular Components**: Each layout element is a focused, reusable component
2. **State Synchronization**: Complex state management keeps all parts in sync
3. **Platform Native Feel**: Integrates with both Electron and browser environments
4. **Complete Accessibility**: Full keyboard navigation and screen reader support
5. **Theme Integration**: Deep integration with user theme and scaling preferences
6. **Responsive Design**: Adapts gracefully to different screen sizes
7. **Extensible Architecture**: Easy to add new layout elements and features

The layout serves as the foundation for the entire application experience, providing a consistent, accessible, and platform-appropriate interface that users can customize to their preferences.