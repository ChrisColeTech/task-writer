# Task Writer - Search System Integration Documentation

## Overview

The Task Writer application features a macOS Spotlight-style search system that allows users to quickly find and navigate to any feature, page, or setting within the application. This document provides comprehensive details on how the search system works, its architecture, and how to maintain and extend it.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Data Layer](#data-layer)
4. [Search Algorithm](#search-algorithm)
5. [Navigation Integration](#navigation-integration)
6. [User Interface](#user-interface)
7. [Keyboard Shortcuts](#keyboard-shortcuts)
8. [Accessibility Features](#accessibility-features)
9. [Maintenance Guide](#maintenance-guide)
10. [Extension Guide](#extension-guide)

## Architecture Overview

The search system is built with a layered architecture:

```
┌─────────────────────────────────────────┐
│             User Interface              │
│  SpotlightSearch Component + Title Bar  │
├─────────────────────────────────────────┤
│            Search Logic                 │
│     Search Algorithm + Filtering        │
├─────────────────────────────────────────┤
│            Data Layer                   │
│         Search Data Repository          │
├─────────────────────────────────────────┤
│          Navigation Layer               │
│    Search Service + App Service         │
├─────────────────────────────────────────┤
│           Input Handling                │
│  Keyboard Shortcuts + Event Handling    │
└─────────────────────────────────────────┘
```

### Key Design Principles

- **Performance**: Instant search results with efficient algorithms
- **Accessibility**: Full keyboard navigation and screen reader support
- **Maintainability**: Clear separation of concerns and modular design
- **Extensibility**: Easy to add new searchable content
- **User Experience**: Spotlight-style interface familiar to users

## Core Components

### 1. SpotlightSearch Component

**Location**: `/frontend/app/src/components/search/SpotlightSearch.tsx`

The main UI component that provides the search interface.

```typescript
interface SpotlightSearchProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: string, section?: string) => void
}
```

**Key Features**:
- Center-positioned modal like macOS Spotlight
- Real-time search with instant results
- Keyboard navigation (↑/↓ arrows, Enter, Escape)
- Smooth animations with reduced motion support
- Theme-compliant styling

**State Management**:
```typescript
const [query, setQuery] = useState('')           // Current search query
const [results, setResults] = useState([])       // Filtered search results
const [selectedIndex, setSelectedIndex] = useState(0) // Currently selected result
```

### 2. Search Button Integration

**Location**: `/frontend/app/src/components/titlebar/AppControls.tsx`

Search button in the application title bar.

```typescript
<div
  role="button"
  onClick={onOpenSearch}
  className="w-12 h-8 flex items-center justify-center..."
  title="Search features and pages (Ctrl+F)"
  aria-label="Open search dialog"
>
  <Search size={14} />
</div>
```

### 3. Layout Integration

**Location**: `/frontend/app/src/components/layout/Layout.tsx`

The main layout component orchestrates the search system:

```typescript
const [isSearchOpen, setIsSearchOpen] = useState(false)

// Handlers
const handleOpenSearch = useCallback(() => setIsSearchOpen(true), [])
const handleCloseSearch = useCallback(() => setIsSearchOpen(false), [])
const handleSearchNavigate = useCallback((page: string, section?: string) => {
  const searchService = getSearchService()
  searchService.navigateToResult(page, section)
}, [])

// Keyboard shortcuts integration
useKeyboardShortcuts({
  onOpenSearch: handleOpenSearch
})
```

## Data Layer

### Search Data Repository

**Location**: `/frontend/app/src/data/searchData.ts`

Contains all searchable content mapped to actual application features.

```typescript
export interface SearchResult {
  id: string              // Unique identifier
  title: string           // Display title
  description: string     // Brief description
  category: string        // Category for organization
  page: string           // Target page for navigation
  section?: string       // Optional section within page
  keywords: string[]     // Search keywords
  priority: number       // Search ranking (lower = higher priority)
}
```

**Example Entry**:
```typescript
{
  id: 'task-generator',
  title: 'Task Generator',
  description: 'Generate detailed task files with source code for project documentation',
  category: 'Tools',
  page: 'tasks',
  keywords: ['task', 'generator', 'documentation', 'files', 'source', 'code', 'project'],
  priority: 2
}
```

### Current Data Structure

The search database contains **27 searchable items** across these categories:

- **Navigation** (1): Welcome page
- **Tools** (2): Task Generator, Scaffold Generator  
- **Actions** (1): Directory selection
- **Settings** (8): Task and scaffold configuration options
- **Organization** (2): File grouping and drag-drop
- **Export** (1): Output format options
- **Customization** (1): Custom instructions
- **Configuration** (4): OS targeting and script formats
- **Appearance** (5): Theme, font, icon, border settings
- **Accessibility** (1): High contrast mode
- **Layout** (2): Sidebar position, status bar

## Search Algorithm

**Location**: `/frontend/app/src/data/searchData.ts` - `searchResults()` function

### Scoring System

The search algorithm uses a weighted scoring system:

```typescript
export const searchResults = (query: string, limit: number = 10): SearchResult[] => {
  const normalizedQuery = query.toLowerCase().trim()
  const words = normalizedQuery.split(/\s+/)
  
  const scoredResults = searchData.map(item => {
    let score = 0
    
    // Exact title match (highest priority)
    if (item.title.toLowerCase() === normalizedQuery) score += 100
    else if (item.title.toLowerCase().includes(normalizedQuery)) score += 50
    
    // Title starts with query
    if (item.title.toLowerCase().startsWith(normalizedQuery)) score += 30
    
    // Description contains query
    if (item.description.toLowerCase().includes(normalizedQuery)) score += 20
    
    // Keyword matches
    const keywordMatches = item.keywords.filter(keyword => 
      keyword.toLowerCase().includes(normalizedQuery) ||
      words.some(word => keyword.toLowerCase().includes(word))
    )
    score += keywordMatches.length * 10
    
    // Category match
    if (item.category.toLowerCase().includes(normalizedQuery)) score += 15
    
    // Word-by-word matching
    words.forEach(word => {
      if (word.length > 2) {
        if (item.title.toLowerCase().includes(word)) score += 5
        if (item.description.toLowerCase().includes(word)) score += 3
        if (item.keywords.some(k => k.toLowerCase().includes(word))) score += 2
      }
    })
    
    // Priority bonus (lower priority number = higher bonus)
    score += (5 - item.priority) * 2
    
    return { ...item, score }
  })
  
  return scoredResults
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
```

### Search Performance

- **Real-time**: Results update as user types
- **Fuzzy matching**: Handles partial words and typos
- **Relevance ranking**: Most relevant results appear first
- **Limited results**: Returns top 6 results for quick scanning

## Navigation Integration

### Search Service

**Location**: `/frontend/app/src/services/searchService.ts`

Handles navigation from search results to actual pages.

```typescript
export class SearchService {
  /**
   * Navigate to a specific page/section based on search result
   */
  navigateToResult(page: string, section?: string): boolean {
    const appService = getAppService()
    if (!appService) return false

    const navigationItems = getAllNavigationItems()
    const navigationItem = navigationItems.find(item => item.id === page)
    
    if (navigationItem) {
      return appService.openTab(page, true)
    }

    // Handle special cases
    switch (page) {
      case 'welcome':
        // Welcome page shows when no tabs are open
        return true
      case 'settings':
        appService.openSettings()
        return true
      default:
        console.warn(`Unknown page: ${page}`)
        return false
    }
  }
}
```

### Integration with App Service

The search service integrates with the existing navigation system:

```typescript
// Uses existing app service for navigation
const appService = getAppService()
appService.openTab(page, true)  // Opens tab and makes it active
appService.openSettings()       // Special handler for settings
```

## User Interface

### Design Principles

The search UI follows macOS Spotlight design patterns:

- **Centered positioning**: Appears in center of screen
- **Compact size**: `max-w-lg` for focused interaction
- **Clean styling**: Minimal visual elements
- **Immediate results**: No "search" button needed

### Visual Hierarchy

```
┌─────────────────────────────────┐
│  🔍 Search Input                │  ← Header with gradient
├─────────────────────────────────┤
│  📁 Category Icon | Title       │  ← Result item
│     Description text            │
├─────────────────────────────────┤
│  ⚙️  Settings Icon | Settings   │  ← Selected item (highlighted)
│     Customize preferences       │
└─────────────────────────────────┘
```

### Category Icons

Each search result displays a category-specific icon:

```typescript
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Navigation': return Hash
    case 'Tools': return Zap
    case 'Features': return FileText
    case 'Configuration': return Settings
    case 'Organization': return Folder
    // ... etc
  }
}
```

### Theme Integration

The search UI uses the application's theme system:

```typescript
// Header styling
className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b"

// Result item styling
className={`
  flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer 
  transition-all duration-300 group focus-within:ring-2 focus-within:ring-accent
  ${isSelected 
    ? 'bg-accent text-text-background motion-safe:scale-[1.02]' 
    : 'hover:bg-surface-hover motion-safe:hover:scale-[1.01]'
  }
`}
```

## Keyboard Shortcuts

### Global Shortcuts

**Location**: `/frontend/app/src/hooks/useKeyboardShortcuts.ts`

Implements platform-aware keyboard shortcuts:

```typescript
export const useKeyboardShortcuts = ({ onOpenSearch }: KeyboardShortcuts) => {
  const platformService = usePlatform()

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Search shortcut: Ctrl+F (Windows/Linux) or Cmd+F (Mac)
    const isSearchShortcut = platformService.isMac() 
      ? event.metaKey && event.key === 'f'
      : event.ctrlKey && event.key === 'f'

    if (isSearchShortcut) {
      event.preventDefault() // Prevent browser's default search
      event.stopPropagation()
      onOpenSearch()
    }
  }, [onOpenSearch, platformService])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [handleKeyDown])
}
```

### Search Modal Navigation

Within the search modal:

- **↑/↓ Arrow Keys**: Navigate between results
- **Enter**: Select current result
- **Escape**: Close search modal

```typescript
const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      onClose()
      break
    case 'ArrowDown':
      event.preventDefault()
      if (results.length > 0) {
        setSelectedIndex(prev => (prev + 1) % results.length)
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (results.length > 0) {
        setSelectedIndex(prev => prev === 0 ? results.length - 1 : prev - 1)
      }
      break
    case 'Enter':
      event.preventDefault()
      if (results.length > 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex])
      }
      break
  }
}, [results, selectedIndex, onClose])
```

## Accessibility Features

### Screen Reader Support

```typescript
// Modal accessibility
<motion.div
  role="dialog"
  aria-modal="true"
  aria-label="Spotlight search"
>
  <input
    aria-label="Search application features"
    aria-describedby="search-description"
  />
  
  <div 
    role="listbox"
    aria-label="Search results"
  >
    {results.map((result, index) => (
      <div
        key={result.id}
        role="option"
        aria-selected={index === selectedIndex}
        tabIndex={-1}
      >
        {/* Result content */}
      </div>
    ))}
  </div>
</motion.div>
```

### Keyboard Navigation

- **Tab Order**: Proper tab sequence through results
- **Focus Management**: Automatic focus on search input when opened
- **Visual Focus Indicators**: Clear focus rings on all interactive elements

### Reduced Motion Support

```typescript
const prefersReducedMotion = useReducedMotion()

const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }

// Conditional animation classes
className={`transition-transform ${
  prefersReducedMotion ? '' : 'motion-safe:hover:scale-110'
}`}
```

## Maintenance Guide

### Adding New Searchable Content

1. **Identify the feature**: Determine the exact page and functionality
2. **Add to search data**: Create new entry in `searchData.ts`
3. **Test navigation**: Ensure the page/section exists and is accessible
4. **Verify keywords**: Test search terms users might use

**Example addition**:
```typescript
{
  id: 'new-feature',
  title: 'New Feature Name',
  description: 'Brief description of what this feature does',
  category: 'Appropriate Category',
  page: 'target-page-id',
  section: 'optional-section', // Only if needed
  keywords: ['keyword1', 'keyword2', 'synonym', 'alternative-term'],
  priority: 4 // 1=highest, 4=lowest priority
}
```

### Updating Existing Content

When application features change:

1. **Update descriptions**: Keep descriptions accurate and current
2. **Modify keywords**: Add new search terms users might try
3. **Check navigation**: Verify page IDs and sections still exist
4. **Test search results**: Ensure changes don't break search functionality

### Category Management

Current categories and their purpose:

- **Navigation**: Main navigation items (Welcome)
- **Tools**: Primary application features (Task Generator, Scaffold Generator)
- **Actions**: User actions (Select Directory)
- **Settings**: Configuration options
- **Organization**: File and content organization features
- **Export**: Output and export functionality
- **Configuration**: Technical configuration options
- **Appearance**: Visual customization options
- **Accessibility**: Accessibility-related features
- **Layout**: Interface layout options

## Extension Guide

### Adding New Search Categories

1. **Update category icons** in `getCategoryIcon()`:
```typescript
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'YourNewCategory': return YourIcon
    // ... existing cases
  }
}
```

2. **Add category entries** to search data with appropriate keywords

### Implementing Section Navigation

Currently, search navigates to pages. To add section navigation:

1. **Extend SearchService**:
```typescript
navigateToResult(page: string, section?: string): boolean {
  const success = appService.openTab(page, true)
  
  if (success && section) {
    // Add section scrolling logic
    setTimeout(() => {
      const element = document.getElementById(section)
      element?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }
  
  return success
}
```

2. **Add section IDs** to target pages:
```typescript
<section id="target-section">
  {/* Section content */}
</section>
```

### Advanced Search Features

To add advanced search capabilities:

1. **Search filters** by category:
```typescript
export const searchByCategory = (category: string): SearchResult[] => {
  return searchData.filter(item => item.category === category)
}
```

2. **Recent searches** functionality:
```typescript
// Store recent searches in localStorage
const recentSearches = JSON.parse(localStorage.getItem('recent-searches') || '[]')
```

3. **Search analytics**:
```typescript
// Track search usage
const trackSearch = (query: string, resultCount: number) => {
  // Analytics implementation
}
```

### Performance Optimization

For larger search datasets:

1. **Implement search indexing**:
```typescript
// Pre-compute search index
const searchIndex = new Map()
searchData.forEach(item => {
  const tokens = [item.title, item.description, ...item.keywords]
    .join(' ')
    .toLowerCase()
    .split(/\s+/)
  
  tokens.forEach(token => {
    if (!searchIndex.has(token)) searchIndex.set(token, [])
    searchIndex.get(token).push(item.id)
  })
})
```

2. **Add search debouncing**:
```typescript
const [debouncedQuery] = useDebounce(query, 150)

useEffect(() => {
  if (debouncedQuery.trim()) {
    const results = searchResults(debouncedQuery, 6)
    setResults(results)
  }
}, [debouncedQuery])
```

## Best Practices

### Search Data Quality

- **Descriptive titles**: Use clear, specific titles
- **Comprehensive keywords**: Include synonyms and alternative terms
- **Accurate descriptions**: Keep descriptions current and helpful
- **Consistent categories**: Use established categories when possible
- **Appropriate priorities**: Higher priority for more important features

### User Experience

- **Instant feedback**: Show results immediately as user types
- **Clear visual hierarchy**: Use consistent styling and spacing
- **Intuitive navigation**: Follow established patterns
- **Error handling**: Graceful handling of edge cases
- **Performance**: Keep search fast and responsive

### Code Organization

- **Separation of concerns**: Keep search logic separate from UI
- **Type safety**: Use TypeScript interfaces for all data structures
- **Modularity**: Make components and services reusable
- **Testing**: Add tests for search algorithm and navigation
- **Documentation**: Keep this document updated with changes

## Troubleshooting

### Common Issues

1. **Search not opening**: Check keyboard event listeners and platform detection
2. **Navigation failing**: Verify page IDs in navigation config
3. **Results not showing**: Check search data structure and scoring algorithm
4. **Styling issues**: Verify theme variable usage and CSS classes

### Debug Tools

Add debug logging to search functions:

```typescript
const searchResults = (query: string, limit: number = 10): SearchResult[] => {
  console.log('Search query:', query)
  const results = /* search logic */
  console.log('Search results:', results.map(r => ({ title: r.title, score: r.score })))
  return results
}
```

### Performance Monitoring

Monitor search performance:

```typescript
const startTime = performance.now()
const results = searchResults(query, 6)
const endTime = performance.now()
console.log(`Search took ${endTime - startTime} milliseconds`)
```

---

This search system provides a fast, accessible, and maintainable way for users to navigate the Task Writer application. The modular architecture makes it easy to extend and maintain as the application grows.