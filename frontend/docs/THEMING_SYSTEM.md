# Task Writer - Advanced Theming System Documentation

## Overview

The Task Writer application features a comprehensive dual-dimension theming system built on CSS custom properties (variables) that supports multiple color schemes, visual modes, accessibility features, and user preferences. This advanced system provides consistent theming across all components while maintaining flexibility and performance.

### Two-Dimensional Theme System

The theming system operates on **two independent dimensions**:

1. **Color Scheme Dimension**: Choose your preferred color palette (Regular, Ocean Blue, Forest Green, Royal Purple, Cyberpunk, etc.)
2. **Mode Dimension**: Choose your preferred contrast/brightness (Light, Dark, High Contrast)

This creates a matrix where each color scheme has **4 variants**:
- **Light Mode**: Standard light backgrounds with dark text
- **Dark Mode**: Dark backgrounds with light text  
- **High Contrast Light**: Maximum contrast on light backgrounds for accessibility
- **High Contrast Dark**: Maximum contrast on dark backgrounds for accessibility

**Example**: "Ocean Blue + Dark Mode" = Dark blue backgrounds with light blue text and bright blue accents.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Color Scheme System](#color-scheme-system)
3. [Theme Structure](#theme-structure)
4. [CSS Variables System](#css-variables-system)
5. [Theme Modes and Variants](#theme-modes-and-variants)
6. [User Settings Integration](#user-settings-integration)
7. [Component Implementation](#component-implementation)
8. [Special Effects System](#special-effects-system)
9. [Border System](#border-system)
10. [Typography Scaling](#typography-scaling)
11. [Icon Scaling](#icon-scaling)
12. [Best Practices](#best-practices)
13. [Accessibility Features](#accessibility-features)
14. [Maintenance Guide](#maintenance-guide)

## Architecture Overview

The theming system is built with a layered approach:

```
┌─────────────────────────────────────────┐
│              User Settings              │
│ Color Scheme + Mode + Font/Icon Sizes  │
├─────────────────────────────────────────┤
│            Layout Component             │
│    Dual-Dimension CSS Class Generation │
├─────────────────────────────────────────┤
│          Color Scheme Layer            │
│     Base Color Palette Definition      │
├─────────────────────────────────────────┤
│            Mode Layer                  │
│   Light/Dark/High Contrast Overrides   │
├─────────────────────────────────────────┤
│          Special Effects Layer          │
│     Glows, Shadows, Animations        │
├─────────────────────────────────────────┤
│             CSS Variables              │
│  Combined Values + Scaling Factors     │
├─────────────────────────────────────────┤
│           Component Styling            │
│      Theme Variable Usage in JSX       │
├─────────────────────────────────────────┤
│            Tailwind CSS               │
│       Utility Classes + Custom CSS     │
└─────────────────────────────────────────┘
```

### Key Design Principles

- **Performance**: CSS variables for instant theme switching without JavaScript
- **Dual-Dimension Independence**: Color schemes and modes are completely independent
- **Accessibility**: High contrast mode and scaling support with WCAG AA compliance
- **Maintainability**: Single source of truth for all theme values
- **Flexibility**: Easy to extend with new color schemes and enhanced effects
- **Consistency**: Unified approach across all components
- **Progressive Enhancement**: Special effects gracefully degrade
- **User Choice**: Maximum customization while maintaining usability

## Color Scheme System

### Available Color Schemes

The system supports multiple carefully designed color schemes, each with 4 variants (light, dark, high contrast light, high contrast dark):

#### Core Color Schemes
- **Regular**: Professional gray-based theme (default)
- **Ocean Blue**: Calming blues and teals for focused work
- **Forest Green**: Natural greens and earth tones, easy on eyes
- **Royal Purple**: Elegant purples for creative work
- **Sunset Orange**: Warm oranges for energetic workflows

#### Specialized Themes
- **Office Professional**: Conservative corporate blues and grays
- **Cyberpunk Neon**: High-tech aesthetic with intense glows and effects
- **Dark Terminal**: Classic green-on-black terminal aesthetic
- **Midnight Blue**: Sophisticated dark blues for late-night work
- **Crimson Red**: Bold reds for high-energy environments
- **Warm Sepia**: Brown/beige tones for comfortable reading
- **Rose Gold**: Modern pink and gold aesthetics

### CSS Class Structure

Color schemes are applied through CSS classes following this pattern:

```css
/* Base color scheme class */
.color-{scheme-name} { }

/* Dark mode variant */
.color-{scheme-name}.dark { }

/* High contrast variants */
.color-{scheme-name}.high-contrast:not(.dark) { }  /* Light high contrast */
.color-{scheme-name}.high-contrast.dark { }       /* Dark high contrast */
```

**Example for Ocean Blue:**
```css
.color-ocean-blue { /* Light ocean blue */ }
.color-ocean-blue.dark { /* Dark ocean blue */ }
.color-ocean-blue.high-contrast:not(.dark) { /* Light high contrast ocean blue */ }
.color-ocean-blue.high-contrast.dark { /* Dark high contrast ocean blue */ }
```

### CSS Specificity Order

The system uses CSS specificity to ensure proper theme layering:

1. **Base Color Scheme** (lowest priority): `.color-ocean-blue`
2. **Dark Mode Override** (medium priority): `.color-ocean-blue.dark`
3. **High Contrast Override** (highest priority): `.color-ocean-blue.high-contrast.dark`

This allows each layer to override only the necessary properties while inheriting everything else.

## Theme Structure

### File Organization

```
src/styles/
├── variables.css    # Core theme definitions (base colors, spacing)
├── themes.css       # NEW: Color scheme definitions and special effects
├── settings.css     # User preference scaling (font, icon)
├── borders.css      # Border system and thickness variants
├── base.css         # Base styles and Tailwind integration
└── components.css   # Component-specific styling
```

### Theme Hierarchy

1. **Base Variables** (`:root`) - Core system defaults and utilities
2. **Color Scheme Layer** (`.color-{scheme}`) - Base color palette for each scheme
3. **Dark Mode Layer** (`.color-{scheme}.dark`) - Dark variants of color schemes
4. **High Contrast Layer** (`.color-{scheme}.high-contrast`) - Maximum contrast variants
5. **Special Effects Layer** - Enhanced glows, shadows, and animations for specific schemes

## CSS Variables System

### Core Color Variables

The CSS variable system uses a layered approach where base utilities are defined in `variables.css` and color schemes override them in `themes.css`.

**Base System Variables** (`/frontend/app/src/styles/variables.css`):

```css
:root {
  /* Utility Variables (never overridden) */
  --radius: 0.5rem;              /* Border radius */
  --font-family: 'Inter', sans-serif; /* Font family */
  
  /* Default Regular Scheme (fallback values) */
  --background: #ffffff;
  --surface: #f5f5f5;
  --surface-hover: rgba(0, 0, 0, 0.05);
  --text: #121212;
  --text-muted: #6e6e6e;
  --text-background: #ffffff;
  --accent: #121212;
  --accent-hover: #2a2a2a;
  --border: #e5e5e5;
  --border-thin: rgba(229, 229, 229, 0.2);
  --input-bg: #ffffff;
  --scrollbar: #d1d5db;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  /* Status colors (consistent across schemes) */
  --status-success: #10b981;
  --status-warning: #f59e0b;
  --status-error: #ef4444;
  --status-info: #3b82f6;
  
  /* Enhanced Effect Variables (for special themes) */
  --accent-glow: none;           /* Glow effects for cyberpunk themes */
  --text-glow: none;             /* Text glow effects */
  --neon-border: none;           /* Neon border effects */
}
```

**Color Scheme Overrides** (`/frontend/app/src/styles/themes.css`):

```css
/* Each color scheme overrides only the colors it needs to change */
.color-ocean-blue {
  --background: #ffffff;
  --surface: #f0f9ff;
  --text: #0c4a6e;
  --accent: #0284c7;
  /* ... specific ocean blue palette */
}

.color-cyberpunk {
  --background: #f8fafc;
  --surface: #0a0a0a;
  --text: #00ff00;
  --accent: #ff00ff;
  /* Enhanced effects for cyberpunk */
  --accent-glow: 0 0 10px currentColor, 0 0 20px currentColor;
  --text-glow: 0 0 5px currentColor;
  --shadow: 0 0 20px rgba(255, 0, 255, 0.4);
}
```

### Status Colors

```css
:root {
  /* Status Indicators */
  --status-success: #10b981;
  --status-success-bg: rgba(16, 185, 129, 0.1);
  --status-warning: #f59e0b;
  --status-warning-bg: rgba(245, 158, 11, 0.1);
  --status-error: #ef4444;
  --status-error-bg: rgba(239, 68, 68, 0.1);
  --status-info: #3b82f6;
  --status-info-bg: rgba(59, 130, 246, 0.1);

  /* Logging Colors */
  --log-error: #ef4444;
  --log-warning: #f59e0b;
  --log-information: #3b82f6;
  --log-debug: #6b7280;
}
```

### Tailwind Integration

The theme variables are integrated with Tailwind CSS through custom utilities:

```css
/* Tailwind-compatible classes using CSS variables */
.bg-background { background-color: var(--background); }
.bg-surface { background-color: var(--surface); }
.bg-surface-hover { background-color: var(--surface-hover); }
.text-text { color: var(--text); }
.text-text-muted { color: var(--text-muted); }
.bg-accent { background-color: var(--accent); }
.text-accent { color: var(--accent); }
```

## Special Effects System

### Enhanced Visual Effects

Certain color schemes (like Cyberpunk) include enhanced visual effects that create immersive experiences while remaining optional and performance-conscious.

**Effect Variables:**
```css
:root {
  /* Glow Effects */
  --accent-glow: none;           /* Multi-layer glow for accents */
  --text-glow: none;             /* Text shadow glow */
  --neon-border: none;           /* Neon border effects */
  --data-stream: none;           /* Animated background effects */
  
  /* Animation Variables */
  --scan-duration: 2s;          /* Scanning line speed */
  --glow-intensity: 1;          /* Glow effect multiplier */
  --effect-opacity: 0.8;        /* Effect layer opacity */
}
```

**Cyberpunk Enhanced Effects:**
```css
.color-cyberpunk,
.color-cyberpunk.dark {
  /* Intense multi-layer glows */
  --accent-glow: 
    0 0 10px currentColor,
    0 0 20px currentColor,
    0 0 30px currentColor;
    
  --text-glow: 
    0 0 5px currentColor,
    0 0 10px currentColor;
    
  --neon-border: 
    0 0 5px currentColor,
    0 0 10px currentColor,
    inset 0 0 5px currentColor;
    
  /* Enhanced shadows */
  --shadow: 
    0 0 20px rgba(255, 0, 255, 0.4),
    0 0 40px rgba(0, 255, 255, 0.2),
    0 0 60px rgba(0, 255, 0, 0.1);
}
```

**Special Effect Classes:**
```css
/* Cyberpunk glow effects */
.cyberpunk-glow {
  box-shadow: var(--accent-glow);
  border: 2px solid var(--accent);
}

.neon-text {
  text-shadow: var(--text-glow);
  color: var(--accent);
}

.cyberpunk-button {
  background: transparent;
  border: 2px solid var(--accent);
  box-shadow: var(--neon-border);
  transition: all 0.3s ease;
}

.cyberpunk-button:hover {
  box-shadow: 
    var(--neon-border),
    0 0 20px var(--accent);
  transform: translateY(-2px);
}

/* Scanning line animation */
.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(0, 255, 0, 0.03) 2px,
    rgba(0, 255, 0, 0.03) 4px
  );
  pointer-events: none;
}
```

## Theme Modes and Variants

### Light Themes (Default)

```css
:root {
  --background: #ffffff;
  --surface: #f5f5f5;
  --text: #121212;
  --text-muted: #6e6e6e;
  --accent: #121212;
  --border: #e5e5e5;
  /* ... */
}
```

### Dark Theme

```css
.dark {
  --background: #121212;
  --surface: #1e1e1e;
  --text: #ffffff;
  --text-muted: #9e9e9e;
  --accent: #ffffff;
  --border: #2a2a2a;
  /* ... */
}
```

### High Contrast Mode

```css
.high-contrast {
  --background: #000000 !important;
  --surface: #1a1a1a !important;
  --text: #ffffff !important;
  --text-muted: #ffffff !important;
  --accent: #ffff00 !important;  /* Bright yellow for visibility */
  --border: #ffffff !important;
  /* ... */
}

.high-contrast:not(.dark) {
  --background: #ffffff !important;
  --surface: #f0f0f0 !important;
  --text: #000000 !important;
  --text-muted: #000000 !important;
  --accent: #0000ff !important;  /* Bright blue for visibility */
  --border: #000000 !important;
  /* ... */
}
```

## User Settings Integration

### Settings Hook

**Location**: `/frontend/app/src/hooks/useSettings.ts`

```typescript
export interface AppSettings {
  theme: 'light' | 'dark'                    // Mode dimension
  colorScheme: 'regular' | 'ocean-blue' | 'forest-green' | 'royal-purple' | 'sunset-orange' | 'cyberpunk' | 'office' | 'terminal' | 'midnight-blue' | 'crimson-red' | 'warm-sepia' | 'rose-gold'  // NEW: Color scheme dimension
  highContrast: boolean                      // Accessibility mode
  fontSize: 'small' | 'medium' | 'large'
  iconSize: 'small' | 'medium' | 'large'
  borderThickness: 'none' | 'thin' | 'medium' | 'thick'
  sidebarPosition: 'left' | 'right'
  showStatusBar: boolean
  // ... other settings
}
```

### Layout CSS Class Generation

**Location**: `/frontend/app/src/components/layout/Layout.tsx`

```typescript
const cssClasses = useMemo(() => {
  const classes = ['h-screen', 'flex', 'flex-col', 'bg-background', 'text-text']

  // CRITICAL ORDER: Color scheme must come first for proper CSS specificity
  classes.push(`color-${settings.colorScheme}`)

  // Dark mode class (overrides color scheme where needed)
  if (settings.theme === 'dark') {
    classes.push('dark')
  }

  // High contrast class (highest specificity)
  if (settings.highContrast) {
    classes.push('high-contrast')
  }

  // Scaling classes
  classes.push(`font-${settings.fontSize}`)
  classes.push(`icon-${settings.iconSize}`)
  classes.push(`border-${settings.borderThickness}`)

  return classes.join(' ')
}, [settings.colorScheme, settings.theme, settings.highContrast, settings.fontSize, settings.iconSize, settings.borderThickness])

// Example result: "h-screen flex flex-col bg-background text-text color-cyberpunk dark high-contrast font-medium icon-large border-medium"

return <div className={cssClasses}>{/* App content */}</div>
```

### Runtime Theme Switching

When a user changes theme settings:

1. **Settings hook updates** state and localStorage/Electron store
2. **Layout component** regenerates CSS classes with proper specificity order
3. **CSS variables** activate instantly (no re-render needed)
4. **All components** automatically use new color scheme and mode
5. **Special effects** (like cyberpunk glows) activate automatically for enhanced themes

**Independence**: Color scheme and mode changes are completely independent:
- Changing from "Ocean Blue" to "Cyberpunk" keeps current light/dark/high-contrast mode
- Toggling dark mode keeps current color scheme but switches to its dark variant
- High contrast mode works with any color scheme + mode combination

## Component Implementation

### Correct Theme Usage

```typescript
// ✅ CORRECT - Uses theme variables
const Button = () => (
  <button className="bg-accent hover:bg-accent-hover text-text-background px-4 py-2 rounded-md transition-colors">
    Click me
  </button>
)

// ✅ CORRECT - Uses app border system
const Card = () => (
  <div className="bg-surface app-border overflow-hidden">
    <div className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b">
      <h3 className="text-lg font-semibold text-text">Card Title</h3>
    </div>
    <div className="p-6">
      <p className="text-text-muted">Card content</p>
    </div>
  </div>
)
```

### Incorrect Theme Usage

```typescript
// ❌ WRONG - Hardcoded colors break theming
const BadButton = () => (
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
    Click me
  </button>
)

// ❌ WRONG - Hardcoded Tailwind borders
const BadCard = () => (
  <div className="bg-white border border-gray-200">
    <div className="border-b border-gray-200 px-6 py-4">
      <h3 className="text-gray-900">Card Title</h3>
    </div>
  </div>
)
```

### Theme Variable Reference

| Variable | Usage | Light Value | Dark Value |
|----------|-------|-------------|------------|
| `--background` | Main app background | `#ffffff` | `#121212` |
| `--surface` | Cards, panels | `#f5f5f5` | `#1e1e1e` |
| `--surface-hover` | Hover states | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.05)` |
| `--text` | Primary text | `#121212` | `#ffffff` |
| `--text-muted` | Secondary text | `#6e6e6e` | `#9e9e9e` |
| `--text-background` | Text on colored backgrounds | `#ffffff` | `#121212` |
| `--accent` | Primary accent color | `#121212` | `#ffffff` |
| `--accent-hover` | Accent hover state | `#2a2a2a` | `#e0e0e0` |
| `--border` | Standard borders | `#e5e5e5` | `#2a2a2a` |
| `--border-thin` | Subtle borders | `rgba(229,229,229,0.2)` | `rgba(42,42,42,0.3)` |

## Border System

### App Border Classes

**Location**: `/frontend/app/src/styles/borders.css`

Custom border system that respects user border thickness preferences:

```css
/* Base border classes */
.app-border { border: 1px solid var(--border); }
.app-border-t { border-top: 1px solid var(--border); }
.app-border-r { border-right: 1px solid var(--border); }
.app-border-b { border-bottom: 1px solid var(--border); }
.app-border-l { border-left: 1px solid var(--border); }

/* Special variants */
.app-border-accent { border: 1px solid var(--accent); }
.app-border-transparent { border: 1px solid transparent; }
```

### Border Thickness Variants

Controlled by user settings (`border-none`, `border-thin`, `border-medium`, `border-thick`):

```css
.border-none .app-border { border-width: 0; }
.border-thin .app-border { border: 1px solid var(--border-thin); }
.border-medium .app-border { border-width: 1px; }
.border-thick .app-border { border-width: 2px; }

/* High contrast mode increases thickness */
.high-contrast.border-medium .app-border { border-width: 2px; }
.high-contrast.border-thick .app-border { border-width: 3px; }
```

### Usage in Components

```typescript
// ✅ CORRECT - Responsive to user border preferences
const Card = () => (
  <div className="bg-surface app-border overflow-hidden">
    <div className="px-6 py-4 app-border-b">Header</div>
    <div className="p-6">Content</div>
  </div>
)

// ❌ WRONG - Fixed border that ignores user preferences
const BadCard = () => (
  <div className="bg-white border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200">Header</div>
    <div className="p-6">Content</div>
  </div>
)
```

## Typography Scaling

### Font Scale System

**Location**: `/frontend/app/src/styles/settings.css`

```css
.font-small { --font-scale-factor: 0.85; }
.font-medium { --font-scale-factor: 1; }
.font-large { --font-scale-factor: 1.15; }

/* Apply scaling to all text sizes */
.font-small .text-sm { font-size: calc(0.875rem * var(--font-scale-factor, 1)); }
.font-medium .text-base { font-size: calc(1rem * var(--font-scale-factor, 1)); }
.font-large .text-lg { font-size: calc(1.125rem * var(--font-scale-factor, 1)); }
/* ... continues for all text sizes */
```

### Automatic Text Scaling

When user changes font size setting:

1. **Layout component** adds `font-{size}` class to root
2. **CSS variables** update `--font-scale-factor`
3. **All text elements** automatically scale using `calc()`
4. **Proportional scaling** maintains visual hierarchy

### Supported Text Sizes

| Class | Base Size | Small (0.85x) | Medium (1x) | Large (1.15x) |
|-------|-----------|---------------|-------------|---------------|
| `.text-sm` | 0.875rem | 0.744rem | 0.875rem | 1.006rem |
| `.text-base` | 1rem | 0.85rem | 1rem | 1.15rem |
| `.text-lg` | 1.125rem | 0.956rem | 1.125rem | 1.294rem |
| `.text-xl` | 1.25rem | 1.063rem | 1.25rem | 1.438rem |
| `.text-2xl` | 1.5rem | 1.275rem | 1.5rem | 1.725rem |
| `.text-3xl` | 1.875rem | 1.594rem | 1.875rem | 2.156rem |

## Icon Scaling

### Icon Scale System

```css
.icon-small { --icon-scale-factor: 0.85; }
.icon-medium { --icon-scale-factor: 1; }
.icon-large { --icon-scale-factor: 1.15; }

/* Apply scaling to all SVG icons */
.icon-small svg { width: calc(1rem * var(--icon-scale-factor, 1)) !important; }

/* Specific size overrides */
.icon-small .w-4 { width: calc(1rem * var(--icon-scale-factor, 1)) !important; }
.icon-medium .w-5 { width: calc(1.25rem * var(--icon-scale-factor, 1)) !important; }
.icon-large .w-6 { width: calc(1.5rem * var(--icon-scale-factor, 1)) !important; }
```

### Icon Containers

Special containers ensure consistent icon scaling:

```typescript
// ✅ CORRECT - Uses icon containers for consistent scaling
const IconButton = () => (
  <button className="flex items-center gap-2">
    <div className="page-icon">
      <Settings className="w-5 h-5 text-accent" />
    </div>
    <span>Settings</span>
  </button>
)

// Different icon containers for different contexts
<div className="tab-icon">    {/* Tab bar icons */}
<div className="sidebar-icon"> {/* Sidebar navigation icons */}
<div className="page-icon">   {/* Page content icons */}
```

### Icon Utility Classes

| Container | Purpose | Scaling Behavior |
|-----------|---------|------------------|
| `.tab-icon` | Tab bar icons | Scales with icon size setting |
| `.sidebar-icon` | Sidebar navigation | Scales with icon size setting |
| `.page-icon` | General page icons | Scales with icon size setting |
| (none) | Fixed size icons | Uses hardcoded Tailwind classes |

## Best Practices

### Theme Variable Usage

```typescript
// ✅ CORRECT - Always use theme variables
className="bg-surface text-text app-border"
className="hover:bg-surface-hover focus:bg-surface-hover"
className="text-text-muted placeholder-text-muted"

// ❌ WRONG - Never use hardcoded colors
className="bg-white text-black border-gray-200"
className="hover:bg-gray-100 focus:bg-gray-100"
className="text-gray-600 placeholder-gray-400"
```

### Border Usage

```typescript
// ✅ CORRECT - Use app border system
className="app-border app-border-b app-border-accent"

// ❌ WRONG - Don't use Tailwind borders directly
className="border border-b border-blue-500"
```

### Responsive Design

```typescript
// ✅ CORRECT - Responsive with theme support
className="p-4 lg:p-6 bg-surface app-border"
className="text-sm lg:text-base text-text"

// ✅ CORRECT - Responsive grid with theme colors
className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
```

### Animation Support

```typescript
// ✅ CORRECT - Respects reduced motion preferences
className="transition-all duration-300 motion-safe:hover:scale-110"
className="motion-safe:animate-pulse motion-reduce:animate-none"

// ❌ WRONG - Forces animations regardless of user preference
className="animate-pulse hover:scale-110"
```

### Component Patterns

```typescript
// ✅ CORRECT - Standard card pattern
const Card = () => (
  <div className="bg-surface app-border overflow-hidden">
    <div className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b">
      <div className="flex items-center gap-3">
        <div className="page-icon">
          <Icon className="w-6 h-6 text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-text">Title</h3>
      </div>
    </div>
    <div className="p-6">
      <p className="text-text-muted">Content</p>
    </div>
  </div>
)

// ✅ CORRECT - Standard button pattern
const Button = () => (
  <button className="px-4 py-2 bg-accent hover:bg-accent-hover text-text-background app-border-accent rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent">
    Button Text
  </button>
)
```

## Accessibility Features

### High Contrast Support

```css
.high-contrast {
  /* Maximum contrast colors */
  --accent: #ffff00 !important;     /* Bright yellow on dark */
  --border: #ffffff !important;     /* Full opacity borders */
  --text-muted: #ffffff !important; /* No muted text */
}

.high-contrast:not(.dark) {
  /* High contrast light mode */
  --accent: #0000ff !important;     /* Bright blue on light */
  --border: #000000 !important;     /* Black borders */
  --text-muted: #000000 !important; /* Black text only */
}
```

### Focus Indicators

```typescript
// ✅ CORRECT - Accessible focus indicators
className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"

// ✅ CORRECT - Focus-within for containers
className="focus-within:ring-2 focus-within:ring-accent"
```

### Screen Reader Support

```typescript
// ✅ CORRECT - Screen reader only content
<div className="sr-only">Screen reader description</div>

// ✅ CORRECT - ARIA labels for icons
<div className="page-icon" role="img" aria-label="Settings icon">
  <Settings className="w-5 h-5 text-accent" aria-hidden="true" />
</div>
```

### Color Contrast Compliance

The theme system ensures WCAG AA compliance:

- **Normal text**: 4.5:1 contrast ratio
- **Large text**: 3:1 contrast ratio
- **High contrast mode**: Maximum contrast ratios

## Maintenance Guide

### Adding New Theme Variables

1. **Define in all theme modes**:
```css
:root {
  --new-variable: #value-light;
}

.dark {
  --new-variable: #value-dark;
}

.high-contrast {
  --new-variable: #value-high-contrast !important;
}
```

2. **Create Tailwind utility**:
```css
.bg-new-variable { background-color: var(--new-variable); }
.text-new-variable { color: var(--new-variable); }
```

3. **Update TypeScript interfaces** if needed:
```typescript
// Add to theme-related interfaces
interface ThemeColors {
  newVariable: string
  // ... existing properties
}
```

### Updating Existing Variables

1. **Test in all theme modes** (light, dark, high contrast)
2. **Verify accessibility compliance** (contrast ratios)
3. **Check responsive behavior** across breakpoints
4. **Test with all user settings** (font size, icon size, borders)

### Adding New Scaling Systems

Follow the pattern established by font and icon scaling:

```css
.new-scale-small { --new-scale-factor: 0.85; }
.new-scale-medium { --new-scale-factor: 1; }
.new-scale-large { --new-scale-factor: 1.15; }

.new-scale-small .new-element,
.new-scale-medium .new-element,
.new-scale-large .new-element {
  property: calc(base-value * var(--new-scale-factor, 1));
}
```

### Performance Considerations

- **CSS variables are performant** - no JavaScript needed for theme changes
- **Avoid inline styles** - use CSS classes for theme support
- **Minimize theme variable usage** in hot paths (animations)
- **Use CSS containment** for complex components:

```css
.complex-component {
  contain: style layout;
}
```

### Debugging Theme Issues

1. **Check CSS class application** in Layout component
2. **Verify CSS variable inheritance** in browser dev tools
3. **Test theme switching** with React dev tools
4. **Validate accessibility** with screen readers and contrast checkers

### Common Pitfalls

1. **Using hardcoded colors** instead of theme variables
2. **Forgetting high contrast mode** support
3. **Not testing all theme combinations** (dark + high contrast)
4. **Breaking border thickness** with fixed Tailwind classes
5. **Ignoring reduced motion** preferences in animations

---

This theming system provides a robust foundation for consistent, accessible, and maintainable styling across the entire Task Writer application. The CSS variable approach ensures excellent performance while the comprehensive scaling systems provide excellent accessibility support.