# Settings System Documentation

A comprehensive guide to the settings system in Task Writer, explaining how user preferences are stored, applied, and affect the entire application.

## Table of Contents

- [Overview](#overview)
- [Settings Options](#settings-options)
- [Architecture](#architecture)
- [Theme System](#theme-system)
- [Font and Icon Scaling](#font-and-icon-scaling)
- [Border System](#border-system)
- [Implementation Details](#implementation-details)
- [Component Integration](#component-integration)
- [Developer Guide](#developer-guide)

## Overview

The Task Writer settings system provides comprehensive customization of the application's appearance, layout, and functionality. The system is built with a platform-agnostic architecture that works seamlessly in both Electron and browser environments.

### Key Features

- **Theme Support**: Light/dark mode with system preference detection
- **Accessibility**: High contrast mode and scalable fonts/icons
- **Layout Customization**: Sidebar position, visibility controls
- **Border Styling**: Configurable border thickness
- **Persistent Storage**: Automatic save/load across sessions
- **Platform Agnostic**: Works in Electron and browser environments

## Settings Options

### Available Settings

```typescript
interface AppSettings {
  theme: 'dark' | 'light'                              // Mode dimension (light/dark)
  colorScheme: 'regular' | 'ocean-blue' | 'forest-green' | 'royal-purple' | 'sunset-orange' | 'cyberpunk' | 'office' | 'terminal' | 'midnight-blue' | 'crimson-red' | 'warm-sepia' | 'rose-gold' // NEW: Color scheme dimension
  sidebarPosition: 'left' | 'right'                   // Sidebar placement
  showStatusBar: boolean                               // Status bar visibility
  fontSize: 'small' | 'medium' | 'large'              // Text size scaling
  iconSize: 'small' | 'medium' | 'large'              // Icon size scaling
  highContrast: boolean                                // Accessibility mode
  borderThickness: 'none' | 'thin' | 'medium' | 'thick' // Border styling
  sidebarExpanded: boolean                             // Panel expansion state
  activeSidebarTab: string                             // Current active tab
  sidebarItemVisibility: Record<string, boolean>       // Custom sidebar visibility
  pinnedSidebarItems: string[]                         // User-pinned items
}
```

### Default Values

```typescript
const defaultSettings: AppSettings = {
  theme: 'dark',
  colorScheme: 'regular',      // NEW: Default to regular gray scheme
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
```

## Dual-Dimension Theming

### Color Scheme Dimension (NEW)

The application now supports a **Color Scheme** setting that works independently from the light/dark theme setting:

**Available Color Schemes:**
- **regular**: Default gray-based professional theme
- **ocean-blue**: Calming blues and teals
- **forest-green**: Natural greens and earth tones
- **royal-purple**: Elegant purples for creative work
- **sunset-orange**: Warm energetic oranges
- **cyberpunk**: High-tech neon aesthetic with special effects
- **office**: Conservative corporate blues
- **terminal**: Classic green-on-black terminal style
- **midnight-blue**: Sophisticated dark blues
- **crimson-red**: Bold high-energy reds
- **warm-sepia**: Comfortable brown/beige tones
- **rose-gold**: Modern pink and gold aesthetics

**Independence**: The color scheme setting is completely independent from the light/dark/high-contrast mode settings. This creates a matrix of possibilities:

- **Ocean Blue + Light**: Light blue backgrounds with dark blue text
- **Ocean Blue + Dark**: Dark blue backgrounds with light blue text  
- **Ocean Blue + High Contrast Light**: Maximum contrast light blue theme
- **Ocean Blue + High Contrast Dark**: Maximum contrast dark blue theme

## Architecture

### Storage Layer

The settings system uses a platform-agnostic service pattern:

**Electron Environment**:
- Uses Electron's native storage APIs through IPC
- Stored in application data directory
- Handles by main process with secure communication

**Browser Environment**:
- Uses localStorage with key `'app-settings'`
- Includes error handling for storage quota issues
- Graceful fallback for privacy modes

### State Management

**Hook**: `useSettings()`

```typescript
const {
  settings,                          // Current settings object
  updateSetting,                     // Update any setting: (key, value) => void
  setSidebarItemVisibility,          // Set specific sidebar item visibility
  toggleSidebarItemVisibility,       // Toggle sidebar item visibility
  isSidebarItemVisible,             // Check if sidebar item is visible
  toggleSidebarItemPin,             // Toggle sidebar item pin status
  isLoaded                          // Boolean indicating settings are loaded
} = useSettings()
```

**Auto-save Behavior**:
- Settings are automatically loaded on app initialization
- Any setting change triggers immediate save
- Settings are merged with defaults to handle missing keys
- Graceful fallback if loading/saving fails

## Theme System

### CSS Variables

The theme system uses CSS custom properties that are overridden based on the selected theme:

#### Light Theme (`:root`)
```css
:root {
  --background: #ffffff;
  --surface: #f5f5f5;
  --surface-hover: rgba(0, 0, 0, 0.05);
  --text: #121212;
  --text-muted: #6e6e6e;
  --accent: #121212;
  --accent-hover: #2a2a2a;
  --border: #e5e5e5;
  --border-thin: rgba(229, 229, 229, 0.2);
  --input-bg: #ffffff;
  --text-background: #ffffff;
  
  /* Status Colors */
  --status-success: #10b981;
  --status-warning: #f59e0b;
  --status-error: #ef4444;
  --status-info: #3b82f6;
}
```

#### Dark Theme (`.dark`)
```css
.dark {
  --background: #121212;
  --surface: #1e1e1e;
  --surface-hover: rgba(255, 255, 255, 0.05);
  --text: #ffffff;
  --text-muted: #9e9e9e;
  --accent: #ffffff;
  --accent-hover: #e0e0e0;
  --border: #2a2a2a;
  --border-thin: rgba(42, 42, 42, 0.3);
  --input-bg: #2a2a2a;
  --text-background: #121212;
}
```

#### High Contrast Mode (`.high-contrast`)

**Dark High Contrast**:
```css
.high-contrast {
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --accent: #ffff00 !important;        /* Yellow accent */
  --accent-hover: #ffff66 !important;
  --border: #ffffff !important;
  --border-thin: #ffffff !important;
}
```

**Light High Contrast**:
```css
.high-contrast:not(.dark) {
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --accent: #0000ff !important;        /* Blue accent */
  --accent-hover: #0066ff !important;
  --border: #000000 !important;
  --border-thin: #000000 !important;
}
```

### Theme Application

Themes are applied through CSS classes added to the root element in `Layout.tsx`:

```typescript
const cssClasses = useMemo(() => {
  const classes = ['h-screen', 'flex', 'flex-col', 'bg-background', 'text-text']
  
  if (settings.theme === 'dark') classes.push('dark')
  if (settings.highContrast) classes.push('high-contrast')
  
  classes.push(`font-${settings.fontSize}`)
  classes.push(`icon-${settings.iconSize}`)
  classes.push(`border-${settings.borderThickness}`)
  
  return classes.join(' ')
}, [settings])
```

## Font and Icon Scaling

### Font Scaling System

Font scaling is implemented through CSS custom properties and scale factors:

```css
.font-small { --font-scale-factor: 0.85; }
.font-medium { --font-scale-factor: 1; }
.font-large { --font-scale-factor: 1.15; }

/* Applied to all text elements */
.font-small, .font-medium, .font-large {
  font-size: calc(1rem * var(--font-scale-factor, 1));
}
```

### Icon Scaling System

Icons are scaled using both CSS and programmatic approaches:

**CSS Scaling**:
```css
.icon-small { --icon-scale-factor: 0.85; }
.icon-medium { --icon-scale-factor: 1; }
.icon-large { --icon-scale-factor: 1.15; }

.icon-small svg, .icon-medium svg, .icon-large svg {
  width: calc(1rem * var(--icon-scale-factor, 1)) !important;
  height: calc(1rem * var(--icon-scale-factor, 1)) !important;
}
```

**Context-Specific Icon Sizing**:
```typescript
// iconUtils.tsx
export const getIconSizeForContext = (
  context: 'sidebar' | 'tab' | 'page',
  iconSize: 'small' | 'medium' | 'large',
) => {
  const sizeMap = {
    sidebar: { small: 14, medium: 16, large: 18 },
    tab: { small: 10, medium: 12, large: 14 },
    page: { small: 18, medium: 20, large: 22 },
  }
  return sizeMap[context][iconSize]
}
```

**Usage Example**:
```typescript
const iconSize = getIconSizeForContext('sidebar', settings.iconSize)
<Icon size={iconSize} />
```

## Border System

### Border Thickness Classes

The border system uses custom CSS classes that respond to the global border thickness setting:

```css
.border-none .app-border { border-width: 0; }
.border-thin .app-border { border: 1px solid var(--border-thin); }
.border-medium .app-border { border-width: 1px; }
.border-thick .app-border { border-width: 2px; }

/* High contrast mode increases border thickness */
.high-contrast.border-medium .app-border { border-width: 2px; }
.high-contrast.border-thick .app-border { border-width: 3px; }
```

### Custom Border Classes

- `.app-border` - Standard border using theme colors
- `.app-border-t/r/b/l` - Directional borders
- `.app-border-accent` - Accent-colored borders
- `.app-border-transparent` - Transparent borders for spacing

### Usage in Components

```typescript
<div className="app-border rounded-md">
  Content with themed border
</div>
```

## Implementation Details

### Settings Flow

1. **Storage Layer**: Platform-specific persistence (Electron store/localStorage)
2. **Service Layer**: Abstracted platform operations
3. **State Layer**: React hook with auto-save and merge logic
4. **Application Layer**: CSS class generation and prop passing
5. **Rendering Layer**: CSS variables and component-specific styling

### Platform Services

**Electron Service** (`electronService.ts`):
```typescript
export const electronService: PlatformService = {
  async loadSettings(): Promise<AppSettings | null> {
    return window.electronAPI?.getAppSettings() || null
  },
  
  async saveSettings(settings: AppSettings): Promise<void> {
    await window.electronAPI?.setAppSettings(settings)
  }
}
```

**Browser Service** (`browserService.ts`):
```typescript
export const browserService: PlatformService = {
  async loadSettings(): Promise<AppSettings | null> {
    const stored = localStorage.getItem('app-settings')
    return stored ? JSON.parse(stored) : null
  },
  
  async saveSettings(settings: AppSettings): Promise<void> {
    localStorage.setItem('app-settings', JSON.stringify(settings))
  }
}
```

## Component Integration

### Layout Component

The main `Layout.tsx` component applies settings through CSS classes:

```typescript
// CSS class generation - UPDATED for dual-dimension theming
const cssClasses = useMemo(() => {
  const classes = ['h-screen', 'flex', 'flex-col', 'bg-background', 'text-text']
  
  // Color scheme dimension (MUST come first for CSS specificity)
  classes.push(`color-${settings.colorScheme}`)
  
  // Mode dimension
  if (settings.theme === 'dark') classes.push('dark')
  if (settings.highContrast) classes.push('high-contrast')
  
  // Scaling settings
  classes.push(`font-${settings.fontSize}`)
  classes.push(`icon-${settings.iconSize}`)
  classes.push(`border-${settings.borderThickness}`)
  
  return classes.join(' ')
}, [settings.colorScheme, settings.theme, settings.highContrast, settings.fontSize, settings.iconSize, settings.borderThickness])

// Conditional rendering
{settings.showStatusBar && <StatusBar />}
```

### Components That Consume Settings

- **Layout.tsx** - Main application layout and CSS class generation
- **TitleBar.tsx** - Theme and sidebar position controls
- **SidePanel.tsx** - Border direction based on sidebar position
- **Sidebar.tsx** - Expansion state and visibility management
- **SettingsPage.tsx** - Settings modification interface

### Sidebar Management

The sidebar system includes advanced visibility management:

```typescript
// Check visibility
const isVisible = isSidebarItemVisible(itemId)

// Toggle visibility
toggleSidebarItemVisibility(itemId)

// Set specific visibility
setSidebarItemVisibility(itemId, true)

// Toggle pin status
toggleSidebarItemPin(itemId)
```

## Developer Guide

### Adding New Settings

1. **Update the AppSettings interface**:
```typescript
interface AppSettings {
  // existing settings...
  newSetting: 'option1' | 'option2'
}
```

2. **Add default value**:
```typescript
const defaultSettings: AppSettings = {
  // existing defaults...
  newSetting: 'option1'
}
```

3. **Add CSS classes if needed**:
```css
.new-setting-option1 { /* styles */ }
.new-setting-option2 { /* styles */ }
```

4. **Update Layout.tsx if CSS classes are needed**:
```typescript
classes.push(`new-setting-${settings.newSetting}`)
```

5. **Add UI controls in SettingsPage.tsx**:
```typescript
<SettingField
  label="New Setting"
  value={settings.newSetting}
  onChange={(value) => updateSetting('newSetting', value)}
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]}
/>
```

### Best Practices

#### Theme Integration
- **Always use CSS variables**: `bg-accent`, `text-text`, etc.
- **Never use hardcoded colors**: Avoid `bg-blue-600`, `text-white`
- **Test in all themes**: Light, dark, and high contrast modes

#### Icon Implementation
```typescript
// ✅ Correct - Uses settings-aware sizing
const iconSize = getIconSizeForContext('page', settings.iconSize)
<Icon size={iconSize} />

// ❌ Incorrect - Hardcoded size
<Icon size={16} />
```

#### Border Usage
```typescript
// ✅ Correct - Uses themed borders
<div className="app-border rounded-md">

// ❌ Incorrect - Hardcoded border
<div className="border border-gray-300">
```

### Testing Settings

1. **Test all theme combinations**:
   - Light theme
   - Dark theme
   - Light + high contrast
   - Dark + high contrast

2. **Test scaling**:
   - Small/medium/large fonts
   - Small/medium/large icons
   - All border thickness options

3. **Test persistence**:
   - Settings survive app restart
   - Default merging works correctly
   - Storage failure handling

### Troubleshooting

**Settings not persisting**:
- Check browser localStorage or Electron storage permissions
- Verify platform service is correctly detected
- Check for storage quota issues

**Theme not applying**:
- Ensure CSS classes are correctly generated in Layout.tsx
- Verify CSS variables are defined in variables.css
- Check for component-specific style overrides

**Icons not scaling**:
- Use `getIconSizeForContext()` utility
- Ensure icon components accept size props
- Check CSS icon scaling classes are applied

**Settings UI not updating**:
- Verify `useSettings()` hook is used correctly
- Check that `updateSetting()` is called with correct parameters
- Ensure settings state is properly synchronized

This settings system provides a robust foundation for user customization while maintaining consistency across the application and supporting both browser and Electron environments.