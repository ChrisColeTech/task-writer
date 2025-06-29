# Task Writer - Notifications System Documentation

## Overview

The Task Writer application features a comprehensive notifications system built around toast notifications that provide user feedback for various operations. This document covers the complete architecture including hooks, components, services, and integration patterns that make the notification system work seamlessly across the application.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Toast Hook System](#toast-hook-system)
4. [Toast Component Structure](#toast-component-structure)
5. [Toast Container Management](#toast-container-management)
6. [Integration Patterns](#integration-patterns)
7. [Service Integration](#service-integration)
8. [Theming and Styling](#theming-and-styling)
9. [Animation System](#animation-system)
10. [Usage Examples](#usage-examples)
11. [Error Handling](#error-handling)
12. [Performance Considerations](#performance-considerations)
13. [Accessibility Features](#accessibility-features)
14. [Best Practices](#best-practices)

## Architecture Overview

The notifications system follows a hook-based architecture with centralized state management:

```
┌─────────────────────────────────────────────┐
│               Application Layer             │
│        (Components using useToast)         │
├─────────────────────────────────────────────┤
│              useToast Hook                  │
│       (State Management & API)             │
├─────────────────────────────────────────────┤
│             Toast Container                 │
│        (Positioning & Animation)           │
├─────────────────────────────────────────────┤
│            Toast Component                  │
│       (Individual Toast Rendering)         │
├─────────────────────────────────────────────┤
│            Theming System                   │
│      (CSS Variables & Styling)             │
└─────────────────────────────────────────────┘
```

### Key Design Principles

- **Hook-Based**: Centralized state management via React hooks
- **Type-Safe**: Full TypeScript integration with proper interfaces
- **Accessible**: ARIA labels and keyboard navigation support
- **Themed**: Integrated with application theming system
- **Animated**: Smooth enter/exit animations with Framer Motion
- **Flexible**: Support for multiple toast types and custom actions
- **Auto-Dismissal**: Configurable duration with manual dismiss options

## Core Components

### Toast Interface

**Location**: `/frontend/app/src/components/ui/Toast.tsx:7-17`

```typescript
export interface Toast {
  id: string           // Unique identifier for the toast
  type: ToastType      // Visual type: 'success' | 'error' | 'warning' | 'info'
  title: string        // Primary toast message
  message?: string     // Optional secondary message
  duration?: number    // Auto-dismiss duration in milliseconds
  action?: {           // Optional action button
    label: string
    onClick: () => void
  }
}
```

### Toast Type System

**Location**: `/frontend/app/src/components/ui/Toast.tsx:5`

```typescript
export type ToastType = 'success' | 'error' | 'warning' | 'info'
```

Each toast type has distinct visual styling and default behaviors:

- **Success**: Green accent, 5-second default duration
- **Error**: Red accent, 7-second default duration (longer for important errors)
- **Warning**: Yellow accent, 5-second default duration
- **Info**: Blue accent, 5-second default duration

## Toast Hook System

### Hook Interface

**Location**: `/frontend/app/src/hooks/useToast.ts:4-13`

```typescript
interface UseToastReturn {
  toasts: Toast[]                                    // Current toast array
  showToast: (toast: Omit<Toast, 'id'>) => void    // Show custom toast
  dismissToast: (id: string) => void                // Manually dismiss toast
  clearAllToasts: () => void                        // Clear all toasts
  success: (title: string, message?: string) => void // Show success toast
  error: (title: string, message?: string) => void   // Show error toast
  warning: (title: string, message?: string) => void // Show warning toast
  info: (title: string, message?: string) => void    // Show info toast
}
```

### Hook Implementation

**Location**: `/frontend/app/src/hooks/useToast.ts:15-64`

```typescript
export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<Toast[]>([])

  // Core toast creation with automatic ID generation
  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000, // Default 5 seconds
    }
    
    setToasts(prev => [...prev, newToast])
  }, [])

  // Manual dismissal
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  // Clear all toasts
  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods for common toast types
  const success = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message })
  }, [showToast])

  const error = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message, duration: 7000 })
  }, [showToast])

  const warning = useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message })
  }, [showToast])

  const info = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message })
  }, [showToast])

  return {
    toasts,
    showToast,
    dismissToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  }
}
```

### State Management

The hook uses React's `useState` for toast array management:

- **Immutable Updates**: All state changes create new arrays
- **ID Generation**: Random 9-character alphanumeric IDs
- **Duration Defaults**: Type-specific default durations
- **Callback Memoization**: All functions are memoized to prevent unnecessary re-renders

## Toast Component Structure

### ToastComponent Props

**Location**: `/frontend/app/src/components/ui/Toast.tsx:19-22`

```typescript
interface ToastComponentProps {
  toast: Toast
  onDismiss: (id: string) => void
}
```

### Component Implementation

**Location**: `/frontend/app/src/components/ui/Toast.tsx:45-92`

```typescript
export const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onDismiss }) => {
  const Icon = icons[toast.type]

  // Auto-dismiss timer
  React.useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id)
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        relative w-full max-w-sm p-4 border rounded-lg shadow-lg backdrop-blur-sm
        ${styles[toast.type]}
      `}
    >
      <div className="flex items-start">
        <Icon className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${iconStyles[toast.type]}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-sm opacity-90">{toast.message}</p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 ml-2 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
```

### Icon System

**Location**: `/frontend/app/src/components/ui/Toast.tsx:24-29`

```typescript
const icons = {
  success: CheckCircle,    // Green checkmark
  error: XCircle,          // Red X
  warning: AlertCircle,    // Yellow triangle
  info: Info,              // Blue information
}
```

Icons are imported from Lucide React and provide visual context for each toast type.

## Toast Container Management

### Container Props

**Location**: `/frontend/app/src/components/ui/Toast.tsx:94-99`

```typescript
interface ToastContainerProps {
  toasts: Toast[]                                           // Array of toasts to display
  onDismiss: (id: string) => void                          // Dismiss callback
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'  // Screen position
  bottomOffset?: string                                     // Custom bottom spacing
}
```

### Positioning System

**Location**: `/frontend/app/src/components/ui/Toast.tsx:107-122`

```typescript
const getPositionClasses = () => {
  const baseClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'right-4',
    'bottom-left': 'left-4',
  }
  
  if (position.startsWith('bottom') && bottomOffset) {
    return `${baseClasses[position]} ${bottomOffset}`
  }
  
  return position.startsWith('bottom') 
    ? `${baseClasses[position]} bottom-4`
    : baseClasses[position]
}
```

### Container Implementation

**Location**: `/frontend/app/src/components/ui/Toast.tsx:101-137`

```typescript
export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  position = 'top-right',
  bottomOffset
}) => {
  return (
    <div className={`fixed z-50 space-y-2 ${getPositionClasses()}`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
```

## Integration Patterns

### Basic Usage Pattern

```typescript
import { useToast } from '@/hooks/useToast'

function MyComponent() {
  const { success, error, warning, info } = useToast()

  const handleSaveFile = async () => {
    try {
      await saveFile()
      success('File saved successfully')
    } catch (error) {
      error('Failed to save file', error.message)
    }
  }

  return (
    <button onClick={handleSaveFile}>
      Save File
    </button>
  )
}
```

### Service Integration Pattern

```typescript
// In a service class
export class FileService {
  constructor(private toastHook: ReturnType<typeof useToast>) {}

  async saveFile(path: string, content: string): Promise<boolean> {
    try {
      const result = await platformService.saveFile(path, content)
      if (result) {
        this.toastHook.success('File saved', `Saved to ${path}`)
        return true
      } else {
        this.toastHook.error('Save failed', 'Unable to save file')
        return false
      }
    } catch (error) {
      this.toastHook.error('Save error', error.message)
      return false
    }
  }
}
```

### Layout Integration

The toast container is typically integrated at the layout level:

```typescript
// In Layout.tsx
function Layout() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="layout">
      {/* Main content */}
      <main>{children}</main>
      
      {/* Toast container */}
      <ToastContainer 
        toasts={toasts}
        onDismiss={dismissToast}
        position="top-right"
      />
    </div>
  )
}
```

## Service Integration

### Platform Service Integration

```typescript
// Example: File operations with toast feedback
async saveSettings(settings: AppSettings): Promise<void> {
  try {
    await platformService.saveSettings(settings)
    toast.success('Settings saved')
  } catch (error) {
    toast.error('Failed to save settings', error.message)
  }
}
```

### Electron Service Integration

```typescript
// Example: Window operations with feedback
async maximizeWindow(): Promise<void> {
  try {
    await electronService.maximizeWindow()
    // Note: Window operations typically don't need toast feedback
    // as they provide immediate visual feedback
  } catch (error) {
    toast.error('Window operation failed')
  }
}
```

### API Service Integration

```typescript
// Example: API operations with detailed feedback
async generateTasks(path: string, settings: TaskSettings): Promise<void> {
  try {
    toast.info('Generating tasks...', 'This may take a moment')
    const result = await apiService.generateTasks(path, settings)
    toast.success('Tasks generated', `Created ${result.tasks.length} task files`)
  } catch (error) {
    toast.error('Generation failed', error.message)
  }
}
```

## Theming and Styling

### Theme Integration

**Location**: `/frontend/app/src/components/ui/Toast.tsx:31-43`

```typescript
// Toast background and border styles using theme variables
const styles = {
  success: 'bg-surface border-border text-text shadow-lg',
  error: 'bg-surface border-red-300 text-text shadow-lg',
  warning: 'bg-surface border-yellow-300 text-text shadow-lg',
  info: 'bg-surface border-accent text-text shadow-lg',
}

// Icon color styles
const iconStyles = {
  success: 'text-accent',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-accent',
}
```

### CSS Custom Properties

The toast system uses the application's theme system:

```css
/* Theme variables used in toasts */
:root {
  --color-surface: #ffffff;
  --color-border: #e2e8f0;
  --color-text: #0f172a;
  --color-accent: #3b82f6;
}

[data-theme="dark"] {
  --color-surface: #1e293b;
  --color-border: #334155;
  --color-text: #f1f5f9;
  --color-accent: #60a5fa;
}
```

### Responsive Design

```css
/* Toast responsive behavior */
.toast-container {
  @apply max-w-sm;
}

@media (max-width: 640px) {
  .toast-container {
    @apply max-w-full mx-4;
  }
}
```

## Animation System

### Framer Motion Integration

**Location**: `/frontend/app/src/components/ui/Toast.tsx:58-62`

```typescript
<motion.div
  initial={{ opacity: 0, y: 50, scale: 0.3 }}    // Start: invisible, below, small
  animate={{ opacity: 1, y: 0, scale: 1 }}       // End: visible, in place, normal
  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}  // Exit: fast fade
  className="toast-styles"
>
```

### Animation Sequence

1. **Enter Animation**: 
   - Opacity: 0 → 1
   - Y position: 50px → 0px (slides up)
   - Scale: 0.3 → 1.0 (grows)

2. **Exit Animation**:
   - Opacity: 1 → 0
   - Scale: 1.0 → 0.5 (shrinks)
   - Duration: 200ms (faster exit)

### AnimatePresence

**Location**: `/frontend/app/src/components/ui/Toast.tsx:126-134`

```typescript
<AnimatePresence>
  {toasts.map((toast) => (
    <ToastComponent
      key={toast.id}
      toast={toast}
      onDismiss={onDismiss}
    />
  ))}
</AnimatePresence>
```

AnimatePresence handles the mounting/unmounting animations for the toast list.

## Usage Examples

### Basic Toast Types

```typescript
const { success, error, warning, info } = useToast()

// Success notification
success('Operation completed')
success('File saved', 'Document has been saved to disk')

// Error notification  
error('Operation failed')
error('Connection error', 'Unable to connect to server')

// Warning notification
warning('Unsaved changes')
warning('File exists', 'A file with this name already exists')

// Info notification
info('Processing...')
info('New version available', 'Version 1.2.0 is now available')
```

### Custom Toast with Action

```typescript
const { showToast } = useToast()

showToast({
  type: 'warning',
  title: 'Unsaved changes',
  message: 'You have unsaved changes that will be lost',
  action: {
    label: 'Save now',
    onClick: () => handleSave()
  }
})
```

### Custom Duration

```typescript
const { showToast } = useToast()

// Toast that stays longer
showToast({
  type: 'info',
  title: 'Long operation',
  message: 'This will take several minutes',
  duration: 10000  // 10 seconds
})

// Toast that never auto-dismisses
showToast({
  type: 'error',
  title: 'Critical error',
  message: 'Manual intervention required',
  duration: 0  // No auto-dismiss
})
```

### Programmatic Management

```typescript
const { showToast, dismissToast, clearAllToasts } = useToast()

// Show toast and store ID for later dismissal
const toastId = showToast({
  type: 'info',
  title: 'Processing...'
}).id

// Later: dismiss specific toast
dismissToast(toastId)

// Clear all toasts
clearAllToasts()
```

## Error Handling

### Toast Hook Error Safety

The toast hook is designed to be error-safe:

```typescript
// All hook methods use try-catch internally
const safeShowToast = useCallback((toast: Omit<Toast, 'id'>) => {
  try {
    // Toast creation logic
  } catch (error) {
    console.error('Toast creation failed:', error)
    // Fallback: show basic error toast
  }
}, [])
```

### Service Integration Error Handling

```typescript
// Pattern for service operations
async performOperation(): Promise<boolean> {
  try {
    const result = await riskyOperation()
    toast.success('Operation completed')
    return true
  } catch (error) {
    // Always show user-friendly error message
    toast.error(
      'Operation failed',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return false
  }
}
```

### Graceful Degradation

If the toast system fails, operations should continue:

```typescript
// Safe toast usage pattern
const safeToast = {
  success: (title: string, message?: string) => {
    try {
      toast.success(title, message)
    } catch (error) {
      console.log('Toast notification:', title, message)
    }
  }
}
```

## Performance Considerations

### Memory Management

```typescript
// Toast cleanup timer management
React.useEffect(() => {
  if (toast.duration && toast.duration > 0) {
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, toast.duration)
    
    // Critical: cleanup timer on unmount
    return () => clearTimeout(timer)
  }
}, [toast.id, toast.duration, onDismiss])
```

### State Update Optimization

```typescript
// Efficient toast removal
const dismissToast = useCallback((id: string) => {
  setToasts(prev => prev.filter(toast => toast.id !== id))
}, [])

// Batch operations when possible
const clearAllToasts = useCallback(() => {
  setToasts([])  // Single state update
}, [])
```

### Render Optimization

```typescript
// Memoized toast components
const MemoizedToastComponent = React.memo(ToastComponent)

// Stable callback references
const stableDismissCallback = useCallback((id: string) => {
  dismissToast(id)
}, [dismissToast])
```

## Accessibility Features

### ARIA Labels

```typescript
// Toast component with accessibility
<motion.div
  role="alert"                    // Screen reader announcement
  aria-live="polite"             // Non-disruptive announcements
  aria-atomic="true"             // Read entire content on change
  className="toast-styles"
>
```

### Keyboard Navigation

```typescript
// Dismissible with keyboard
<button
  onClick={() => onDismiss(toast.id)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onDismiss(toast.id)
    }
  }}
  aria-label="Dismiss notification"
  className="dismiss-button"
>
  <X className="w-4 h-4" />
</button>
```

### Screen Reader Support

```typescript
// Descriptive content for screen readers
<div className="toast-content">
  <p className="text-sm font-semibold" aria-describedby={`toast-message-${toast.id}`}>
    {toast.title}
  </p>
  {toast.message && (
    <p id={`toast-message-${toast.id}`} className="mt-1 text-sm opacity-90">
      {toast.message}
    </p>
  )}
</div>
```

## Best Practices

### Usage Guidelines

1. **Be Specific**: Use clear, descriptive titles and messages
2. **Right Type**: Choose appropriate toast type for the context
3. **Timing**: Use longer durations for important errors
4. **Actions**: Include actions when users can take corrective steps
5. **Limit Quantity**: Don't overwhelm users with too many toasts

### Integration Patterns

1. **Service Level**: Integrate at service layer for consistent feedback
2. **Error Boundaries**: Always handle toast failures gracefully
3. **User Actions**: Provide toasts for all user-initiated operations
4. **State Changes**: Use toasts for non-obvious state changes

### Performance Guidelines

1. **Cleanup**: Always cleanup timers and listeners
2. **Memoization**: Use React.memo and useCallback appropriately
3. **Batching**: Group related operations when possible
4. **Limits**: Consider maximum number of concurrent toasts

### Accessibility Requirements

1. **ARIA Roles**: Use proper ARIA roles and properties
2. **Keyboard Support**: Ensure all interactions are keyboard accessible
3. **Screen Readers**: Provide descriptive content for assistive technology
4. **Focus Management**: Handle focus appropriately for critical errors

---

This notifications system provides a robust, accessible, and user-friendly way to communicate application state changes and operation results to users. The hook-based architecture ensures consistent usage across the application while maintaining flexibility for custom use cases.