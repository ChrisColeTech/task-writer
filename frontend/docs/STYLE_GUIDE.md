# Task Writer Style Guide
## Gold Standard for All Pages and Components

This guide establishes the **gold standard** that all pages and components in Task Writer must follow. The `WelcomePage.tsx` serves as the reference implementation.

## 🎨 Theme System (MANDATORY)

### ✅ **Use ONLY Theme Variables (ALL Color Schemes)**
```tsx
// ✅ CORRECT - Uses theme variables (works with ALL color schemes)
className="bg-accent hover:bg-accent-hover text-text-background app-border-accent"

// ✅ CORRECT - Enhanced effects (automatically applied for cyberpunk themes)
className="bg-accent cyberpunk-glow neon-text transition-all duration-300"

// ❌ WRONG - Hardcoded colors break theming across ALL color schemes
className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"

// ❌ WRONG - Color-specific classes break other schemes
className="bg-blue-accent text-blue-900"  // Only works for blue schemes
```

### **Required Theme Variables**
```css
/* Backgrounds */
--background     /* Main page background */
--surface        /* Card/panel backgrounds */
--surface-hover  /* Hover states for surfaces */

/* Text Colors */
--text           /* Primary text */
--text-muted     /* Secondary/helper text */
--text-background /* Text on accent backgrounds */

/* Accent Colors */
--accent         /* Primary actions, focus states */
--accent-hover   /* Hover state for accent */

/* Borders */
--border         /* Standard borders */

/* Enhanced Effects (for special themes like cyberpunk) */
--accent-glow    /* Multi-layer glow effects */
--text-glow      /* Text shadow glow */
--neon-border    /* Neon border effects */
--shadow         /* Enhanced shadow effects */
```

### **CSS Classes to Use**
```tsx
// Backgrounds
"bg-background"     // Page backgrounds
"bg-surface"        // Cards, panels
"bg-accent"         // Primary buttons, active states

// Text
"text-text"         // Primary text
"text-text-muted"   // Secondary text  
"text-text-background" // Text on accent backgrounds

// Borders
"app-border"        // Standard borders (respects border thickness setting)
"app-border-accent" // Accent colored borders
```

### **Auto-Scaling System**
**DO NOT** manually set font sizes or icon sizes. The system automatically scales based on user settings:

```tsx
// ✅ CORRECT - Auto-scales with user settings
<h1 className="text-4xl font-bold text-text">Title</h1>
<Icon className="w-6 h-6 text-accent" />

// ❌ WRONG - Fixed sizes ignore user preferences  
<h1 style={{fontSize: '36px'}}>Title</h1>
<Icon size={24} />
```

## ♿ Accessibility (WCAG 2.1 AA Compliance)

### **Semantic HTML Structure**
```tsx
// ✅ CORRECT - Semantic structure
<main role="main" aria-label="Page description">
  <header>
    <h1 id="page-title">Page Title</h1>
  </header>
  <section aria-labelledby="features-heading">
    <h2 id="features-heading" className="sr-only">Features</h2>
    <article aria-labelledby="feature-1-title">
      <h3 id="feature-1-title">Feature Name</h3>
    </article>
  </section>
</main>

// ❌ WRONG - Generic divs without meaning
<div>
  <div>Page Title</div>
  <div>
    <div>Feature Name</div>
  </div>
</div>
```

### **ARIA Labels and Descriptions**
```tsx
// ✅ CORRECT - Comprehensive ARIA support
<button
  aria-label="Task Generator - Create comprehensive documentation from your project files"
  aria-describedby="task-generator-description"
  type="button"
>
  Get Started with Task Generator
</button>
<div id="task-generator-description" className="sr-only">
  Analyze project directories and create detailed documentation files
</div>

// ❌ WRONG - No context for screen readers
<button onClick={handleClick}>Get Started</button>
```

### **Focus Management**
```tsx
// ✅ CORRECT - Visible focus indicators
className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"

// ✅ CORRECT - Focus-within for containers
className="focus-within:ring-2 focus-within:ring-accent"

// ❌ WRONG - No focus indicators
className="outline-none"
```

### **Screen Reader Announcements**
```tsx
// ✅ CORRECT - Live region for dynamic updates
const [announcement, setAnnouncement] = useState('')

<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {announcement}
</div>

// Update announcements for user actions
setAnnouncement(`Opening ${tabName}`)
```

### **Keyboard Navigation**
```tsx
// ✅ CORRECT - Keyboard event handling
const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
  if (event.key === 'Escape') {
    setFocusedCardIndex(null)
  }
  if (event.key === 'Enter' || event.key === ' ') {
    handleAction()
  }
}, [])

<div onKeyDown={handleKeyDown} tabIndex={-1}>
```

## 🎭 Animation System

### **Reduced Motion Support (MANDATORY)**
```tsx
import { useReducedMotion } from 'framer-motion'

const prefersReducedMotion = useReducedMotion()

// ✅ CORRECT - Respects user preference
className={`transition-transform ${prefersReducedMotion ? '' : 'motion-safe:hover:scale-110'}`}

// ✅ CORRECT - Motion-safe classes
className="motion-safe:animate-pulse motion-reduce:animate-none"

// ❌ WRONG - Forces animation regardless of preference
className="animate-pulse hover:scale-110"
```

### **Animation Variants**
```tsx
// ✅ CORRECT - Conditional animation variants
const createAnimationVariants = (reducedMotion: boolean) => ({
  initial: reducedMotion ? {} : { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: reducedMotion ? { duration: 0 } : { duration: 0.4 }
})

// ✅ CORRECT - Staggered animations
const containerVariants = (reducedMotion: boolean) => ({
  hidden: { opacity: reducedMotion ? 1 : 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: reducedMotion ? 0 : 0.2,
      delayChildren: reducedMotion ? 0 : 0.1
    }
  }
})
```

## 🎨 Modern Design Principles

### **Compact, Sleek & Clean Design Standards**

#### **Visual Hierarchy**
```tsx
// ✅ CORRECT - Clear hierarchy with proper spacing
<div className="space-y-6">        // Section spacing
  <div className="space-y-4">      // Content group spacing  
    <div className="space-y-2">    // Related element spacing
      <h3>Title</h3>
      <p>Description</p>
    </div>
  </div>
</div>

// ❌ WRONG - Inconsistent or excessive spacing
<div className="space-y-12">       // Too much spacing
  <div className="mb-2">           // Inconsistent spacing patterns
    <h3 className="mb-8">Title</h3> // Excessive margins
  </div>
</div>
```

#### **Modern Card Design**
```tsx
// ✅ CORRECT - Clean, modern card with subtle depth
<div className="bg-surface app-border overflow-hidden transition-all duration-300 group focus-within:ring-2 focus-within:ring-accent motion-safe:hover:shadow-theme motion-safe:hover:scale-[1.02]">
  <div className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b">
    <div className="flex items-center gap-3">
      <div className="page-icon transition-transform duration-300 motion-safe:group-hover:scale-110">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <h3 className="text-xl font-semibold text-text">Title</h3>
    </div>
  </div>
  <div className="p-6 space-y-6">
    {/* Content */}
  </div>
</div>

// ❌ WRONG - Outdated design patterns
<div className="border-2 border-gray-500 shadow-lg rounded-none bg-white p-8 m-4">
  <div className="text-center">
    <h3 className="text-2xl mb-4 underline">Title</h3>
  </div>
</div>
```

#### **Minimalist Content Layout**
```tsx
// ✅ CORRECT - Clean, focused content presentation
<div className="max-w-4xl mx-auto">                    // Constrained width
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"> // Responsive grid
    <div className="bg-surface app-border overflow-hidden">       // Clean containers
      <div className="p-6">                            // Consistent padding
        <h3 className="text-lg font-semibold text-text mb-3">    // Minimal margins
          Feature Title
        </h3>
        <p className="text-text-muted leading-relaxed">          // Readable typography
          Concise, clear description without unnecessary words.
        </p>
      </div>
    </div>
  </div>
</div>

// ❌ WRONG - Cluttered, unfocused layout
<div style={{width: '100%'}}>
  <div className="grid grid-cols-3 gap-12">
    <div className="border-4 border-dashed bg-gradient-to-br from-blue-100 via-purple-200 to-pink-300 p-12 m-8 rounded-3xl shadow-2xl">
      <div className="text-center space-y-8">
        <h3 className="text-3xl font-bold underline decoration-wavy decoration-pink-500 mb-6">
          🎉 Amazing Feature Title! 🚀
        </h3>
        <p className="text-lg leading-loose font-medium">
          This is an incredibly detailed and unnecessarily verbose description that goes on and on about features...
        </p>
      </div>
    </div>
  </div>
</div>
```

#### **Icon and Typography Harmony**
```tsx
// ✅ CORRECT - Consistent icon treatment and typography scale
<div className="flex items-center gap-3">
  <div className="page-icon">                         // Standard icon container
    <Icon className="w-6 h-6 text-accent" />         // Consistent sizing
  </div>
  <div>
    <h3 className="text-lg font-semibold text-text">  // Clear hierarchy
      Primary Text
    </h3>
    <p className="text-sm text-text-muted">           // Supporting text
      Secondary information
    </p>
  </div>
</div>

// ❌ WRONG - Inconsistent sizing and poor alignment
<div className="flex">
  <Icon size={42} color="#ff6b6b" className="mr-8" />
  <div>
    <h3 className="text-3xl font-black text-purple-600 mb-6">
      HUGE TITLE
    </h3>
    <p className="text-xs text-gray-400 font-thin">
      tiny description
    </p>
  </div>
</div>
```

#### **Modern Button Design**
```tsx
// ✅ CORRECT - Sleek, accessible buttons with subtle effects
<button className="flex items-center justify-center gap-2 px-4 py-3 bg-accent hover:bg-accent-hover focus:bg-accent-hover app-border-accent rounded-md transition-all duration-300 text-text-background focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 motion-safe:hover:shadow-theme motion-safe:hover:-translate-y-0.5">
  <Icon className="w-4 h-4" />
  <span>Action Text</span>
</button>

// ❌ WRONG - Outdated button styling
<button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transform rotate-1 hover:rotate-0 hover:scale-110 border-4 border-yellow-400 transition-all duration-500">
  🎯 CLICK ME NOW! 🎯
</button>
```

#### **Whitespace Management**
```tsx
// ✅ CORRECT - Strategic use of whitespace for clarity
<div className="space-y-8">                          // Major sections
  <section className="space-y-6">                    // Section content
    <div className="space-y-4">                      // Content groups
      <h2 className="text-2xl font-bold text-text">  // No extra margins
        Section Title
      </h2>
      <div className="space-y-2">                    // Related items
        <p className="text-text-muted">Item 1</p>
        <p className="text-text-muted">Item 2</p>
      </div>
    </div>
  </section>
</div>

// ❌ WRONG - Excessive or inconsistent spacing
<div className="mb-20">
  <section className="py-16 px-12 my-24">
    <div className="space-y-16">
      <h2 className="text-2xl font-bold text-text mb-12 mt-8">
        Section Title
      </h2>
      <div className="space-y-8 mt-16">
        <p className="text-text-muted mb-6">Item 1</p>
        <p className="text-text-muted mb-6">Item 2</p>
      </div>
    </div>
  </section>
</div>
```

#### **Content-First Approach**
```tsx
// ✅ CORRECT - Content drives the design
<article className="bg-surface app-border overflow-hidden">
  <div className="p-6">
    <h3 className="text-lg font-semibold text-text mb-3">
      Clear, Descriptive Title
    </h3>
    <p className="text-text-muted leading-relaxed mb-4">
      Focused description that explains exactly what this does.
    </p>
    <button className="bg-accent hover:bg-accent-hover text-text-background px-4 py-2 rounded-md transition-colors">
      Primary Action
    </button>
  </div>
</article>

// ❌ WRONG - Design-heavy, content-light
<article className="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-2xl rounded-3xl border-8 border-white transform rotate-2 hover:rotate-0 transition-all duration-700 overflow-hidden">
  <div className="bg-black bg-opacity-20 backdrop-blur-lg p-12">
    <div className="text-center space-y-8">
      <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center">
        <Icon className="w-12 h-12 text-purple-600" />
      </div>
      <h3 className="text-3xl font-black text-white drop-shadow-lg">
        🌟 WOW! 🌟
      </h3>
      <p className="text-white font-semibold text-lg opacity-90">
        Amazing!
      </p>
      <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 border-4 border-black">
        🚀 DO IT NOW 🚀
      </button>
    </div>
  </div>
</article>
```

### **Layout Density Guidelines**

#### **Compact Page Layout**
```tsx
// ✅ CORRECT - Efficiently uses screen space
<div className="h-full overflow-y-auto flex items-center justify-center">
  <div className="w-full max-w-6xl p-6">
    <div className="space-y-6">                      // Reduced spacing
      <header className="mb-6">                      // Compact header
        <div className="bg-surface app-border overflow-hidden">
          <div className="bg-gradient-to-r from-surface to-background px-6 py-8"> // Reduced padding
            <div className="flex items-center justify-center mb-4"> // Reduced margin
              <h1 className="text-3xl font-bold text-text"> // Smaller title
                App Title
              </h1>
            </div>
            <p className="text-base text-text-muted">   // Single line description
              Concise app description
            </p>
          </div>
        </div>
      </header>
      
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4"> // Tighter grid
        {/* Compact cards */}
      </section>
    </div>
  </div>
</div>

// ❌ WRONG - Wasteful use of space
<div className="h-full p-12">
  <div className="space-y-16">
    <header className="mb-20">
      <div className="bg-surface app-border overflow-hidden">
        <div className="bg-gradient-to-r from-surface to-background px-12 py-20">
          <div className="flex items-center justify-center mb-16">
            <h1 className="text-6xl font-bold text-text">
              App Title
            </h1>
          </div>
          <p className="text-2xl text-text-muted max-w-4xl mx-auto leading-loose mb-12">
            Very long and detailed description that takes up too much space...
          </p>
        </div>
      </div>
    </header>
    
    <section className="grid grid-cols-1 gap-12">
      {/* Oversized cards */}
    </section>
  </div>
</div>
```

#### **Information Density Best Practices**
- **Headers**: Use `py-8` instead of `py-12` for page headers
- **Cards**: Use `p-6` for card content, `py-4` for card headers
- **Grids**: Use `gap-4` for primary grids, `gap-6` for larger screens
- **Text**: Prefer `text-base` over `text-lg` for descriptions
- **Spacing**: Use `space-y-6` for major sections, `space-y-4` for content groups
- **Margins**: Use `mb-4` instead of `mb-6` for content separation

### **Visual Weight Distribution**
```tsx
// ✅ CORRECT - Balanced visual hierarchy
<div className="bg-surface app-border overflow-hidden">
  <div className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b">
    <div className="flex items-center gap-3">
      <Icon className="w-6 h-6 text-accent" />        // Appropriate icon size
      <h3 className="text-lg font-semibold text-text"> // Balanced title size
        Feature Name
      </h3>
    </div>
  </div>
  <div className="p-6">
    <p className="text-text-muted leading-relaxed mb-4"> // Normal weight text
      Clear, concise description.
    </p>
    <button className="px-4 py-2 bg-accent text-text-background rounded-md"> // Proportional button
      Action
    </button>
  </div>
</div>

// ❌ WRONG - Unbalanced visual weight
<div className="bg-surface app-border overflow-hidden shadow-2xl">
  <div className="bg-gradient-to-r from-surface to-background px-8 py-8 app-border-b border-4">
    <div className="flex items-center gap-6">
      <Icon className="w-16 h-16 text-accent" />      // Oversized icon
      <h3 className="text-4xl font-black text-text">  // Too heavy title
        FEATURE NAME
      </h3>
    </div>
  </div>
  <div className="p-12">
    <p className="text-2xl font-bold text-text-muted leading-loose mb-8">
      VERY IMPORTANT DESCRIPTION IN ALL CAPS!!!
    </p>
    <button className="px-12 py-6 bg-accent text-text-background rounded-2xl text-2xl font-bold">
      GIANT ACTION BUTTON
    </button>
  </div>
</div>
```

## 🔧 Component Structure

### **Error Handling Pattern**
```tsx
const handleAction = useCallback(async (id: string, name: string) => {
  try {
    if (!service) {
      const errorMessage = 'Service not available. Please refresh the page.'
      toast.error('Application Error', errorMessage)
      setAnnouncement(`Error: ${errorMessage}`)
      return
    }
    
    const success = await service.performAction(id)
    if (!success) {
      const errorMessage = `Could not perform action on ${name}. Please try again.`
      toast.error('Action Failed', errorMessage)
      setAnnouncement(`Error: ${errorMessage}`)
    } else {
      setAnnouncement(`Action completed for ${name}`)
    }
  } catch (error) {
    console.error('Error performing action:', error)
    const errorMessage = `Failed to perform action due to an unexpected error.`
    toast.error('Unexpected Error', errorMessage)
    setAnnouncement(`Error: ${errorMessage}`)
  }
}, [service, toast])
```

### **State Management Pattern**
```tsx
// ✅ CORRECT - Proper hook usage with cleanup
const [announcement, setAnnouncement] = useState('')

useEffect(() => {
  if (announcement) {
    const timer = setTimeout(() => setAnnouncement(''), 3000)
    return () => clearTimeout(timer)
  }
}, [announcement])

// ✅ CORRECT - Memoized callbacks
const handleAction = useCallback((param: string) => {
  // Action logic
}, [dependency])
```

### **TypeScript Standards**
```tsx
// ✅ CORRECT - Proper interfaces
interface FeatureData {
  id: string
  title: string
  description: string
  longDescription: string
  action: () => void
  ariaLabel: string
  steps: string[]
}

// ✅ CORRECT - Generic event types
const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
  // Handler logic
}, [])

// ❌ WRONG - Any types
const handleAction = (event: any) => { }
```

## 📱 Responsive Design

### **Mobile-First Approach**
```tsx
// ✅ CORRECT - Mobile-first responsive classes
className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"

// ✅ CORRECT - Responsive text sizes
className="text-base lg:text-lg"

// ✅ CORRECT - Responsive spacing
className="p-4 lg:p-6"
```

### **Container Patterns**
```tsx
// ✅ CORRECT - Standard page container
<div className="h-full overflow-y-auto p-6" role="main" aria-label="Page description">
  <div className="space-y-8">
    {/* Page content */}
  </div>
</div>

// ✅ CORRECT - Card/section pattern
<section>
  <div className="bg-surface app-border overflow-hidden">
    <div className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b">
      <h2 className="text-lg font-semibold text-text">Section Title</h2>
    </div>
    <div className="p-6">
      {/* Section content */}
    </div>
  </div>
</section>
```

## 🎯 Button Standards

### **Primary Action Buttons**
```tsx
// ✅ CORRECT - Primary button with full accessibility
<button
  onClick={handleAction}
  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base bg-accent hover:bg-accent-hover focus:bg-accent-hover app-border-accent rounded-md transition-all duration-300 text-text-background focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background motion-safe:hover:shadow-theme motion-safe:hover:-translate-y-0.5"
  aria-label="Descriptive action label"
  type="button"
>
  <Icon className="w-4 h-4" aria-hidden="true" />
  <span>Button Text</span>
</button>
```

### **Secondary Action Buttons**
```tsx
// ✅ CORRECT - Secondary button pattern
<button
  onClick={handleAction}
  className="flex items-center gap-2 px-3 py-2 text-sm bg-surface hover:bg-surface-hover app-border rounded-md transition-colors text-text-muted hover:text-text focus:outline-none focus:ring-2 focus:ring-accent"
  aria-label="Secondary action description"
  type="button"
>
  <Icon className="w-4 h-4" />
  Action Text
</button>
```

## 📋 Content Standards

### **Page Header Pattern**
```tsx
// ✅ CORRECT - Standard page header
<motion.header
  {...createAnimationVariants(prefersReducedMotion)}
  className="text-center"
>
  <div className="bg-surface app-border overflow-hidden mb-8 motion-reduce:transform-none hover:shadow-theme transition-shadow duration-300">
    <div className="bg-gradient-to-r from-surface to-background px-8 py-12">
      <div className="flex items-center justify-center mb-6">
        <div className="page-icon mr-4" role="img" aria-label="Page icon description">
          <Icon className="text-accent w-12 h-12" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-text" id="page-title">
            Page Title
          </h1>
          <p className="text-lg text-text-muted mt-2" id="page-subtitle">
            Page Subtitle
          </p>
        </div>
      </div>
      <p className="text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
        Page description that explains the purpose and functionality.
      </p>
    </div>
  </div>
</motion.header>
```

### **Feature Card Pattern**
```tsx
// ✅ CORRECT - Accessible feature card
<motion.article
  variants={cardVariants(prefersReducedMotion)}
  className="bg-surface app-border overflow-hidden transition-all duration-300 group focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-background motion-safe:hover:shadow-theme motion-safe:hover:scale-[1.02]"
  aria-labelledby="feature-id-title"
  role="region"
>
  <div className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b">
    <div className="flex items-center gap-3">
      <div className="page-icon transition-transform duration-300 motion-safe:group-hover:scale-110" role="img" aria-hidden="true">
        <Icon className="w-6 h-6 text-accent motion-safe:group-hover:text-accent-hover transition-colors" />
      </div>
      <h3 id="feature-id-title" className="text-xl font-semibold text-text">
        Feature Title
      </h3>
    </div>
  </div>
  <div className="p-6 space-y-6">
    {/* Feature content */}
  </div>
</motion.article>
```

## 🧪 Testing Standards

### **Accessibility Testing Checklist**
- [ ] Screen reader navigation works smoothly
- [ ] All interactive elements have focus indicators
- [ ] Color contrast meets WCAG AA standards (4.5:1 for normal text)
- [ ] Page works without JavaScript
- [ ] Keyboard navigation covers all functionality
- [ ] Animations respect `prefers-reduced-motion`

### **Theme Testing Checklist (ENHANCED)**
- [ ] **All Color Schemes**: Regular, Ocean Blue, Forest Green, Royal Purple, Sunset Orange, Cyberpunk, Office, Terminal, Midnight Blue, Crimson Red, Warm Sepia, Rose Gold
- [ ] **All Modes for Each Scheme**: Light, Dark, High Contrast Light, High Contrast Dark
- [ ] **Color Scheme Independence**: Changing color scheme preserves current mode (light/dark/high-contrast)
- [ ] **Mode Independence**: Changing light/dark/high-contrast preserves current color scheme
- [ ] **Special Effects**: Cyberpunk theme displays enhanced glows and effects properly
- [ ] **Accessibility**: High contrast mode works correctly with all color schemes
- [ ] **Font scaling works** (small/medium/large) across all schemes
- [ ] **Icon scaling works** (small/medium/large) across all schemes  
- [ ] **Border thickness changes** are visible across all schemes
- [ ] **Performance**: Theme switching is instant without re-renders

### **Responsive Testing Checklist**
- [ ] Mobile (320px+) layout works
- [ ] Tablet (768px+) layout works
- [ ] Desktop (1024px+) layout works
- [ ] Touch targets are 44px minimum
- [ ] Text remains readable at all sizes

## 🚨 Common Mistakes to Avoid

### **Theme System Violations**
```tsx
// ❌ NEVER do this
className="bg-blue-600 text-white border-gray-300"
style={{backgroundColor: '#3b82f6'}}

// ❌ NEVER bypass the scaling system
<Icon size={24} />
className="text-lg" // when you need specific sizing
```

### **Accessibility Violations**
```tsx
// ❌ NEVER do this
<div onClick={handleClick}>Clickable div</div> // Not keyboard accessible
<img src="icon.png" />                        // Missing alt text
className="outline-none"                      // Removes focus indicators
```

### **Animation Violations**
```tsx
// ❌ NEVER force animations
className="animate-bounce"     // Ignores user preference
transition={{duration: 1}}     // No reduced motion check
```

## 🔔 Notification System

### **Toast Positioning**
```tsx
// ✅ CORRECT - Respects status bar when visible
<ToastContainer 
  toasts={toasts} 
  onDismiss={dismissToast}
  position="bottom-right"
  bottomOffset={settings.showStatusBar ? "bottom-10" : "bottom-4"}
/>

// ❌ WRONG - Fixed positioning that may cover status bar
<ToastContainer position="bottom-right" />
```

### **Toast Content Standards**
```tsx
// ✅ CORRECT - Clear, actionable messages
toast.success('Action completed', 'Your files have been processed successfully')
toast.error('Action failed', 'Could not process files. Please try again.')

// ❌ WRONG - Vague or technical messages
toast.success('Success')
toast.error('Error in handleSubmit function')
```

## 📚 Resources

- **Reference Implementation**: `src/pages/WelcomePage.tsx`
- **Theme Variables**: `src/styles/variables.css`
- **Settings Integration**: `src/styles/settings.css`  
- **Border System**: `src/styles/borders.css`
- **Toast System**: `src/components/ui/Toast.tsx`
- **WCAG Guidelines**: [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- **Motion Guidelines**: [Respecting Users' Motion Preferences](https://web.dev/prefers-reduced-motion/)

---

**This style guide is mandatory for all new pages and components. Existing components should be updated to match these standards.**