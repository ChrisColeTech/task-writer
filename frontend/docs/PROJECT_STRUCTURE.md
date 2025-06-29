# Task Writer - Complete Project Structure

This document provides a comprehensive view of the Task Writer project's directory structure and file organization.

## Root Directory

```
task-writer/
├── 📄 package.json                    # Root package configuration and scripts
├── 📄 package-lock.json               # Dependency lock file
├── 📄 README.md                       # Main project documentation
├── 📄 ARCHITECTURE_GUIDE.md           # Architecture principles and patterns
├── 📄 APPLICATION_LAYOUT.md           # Layout system documentation
├── 📄 REFACTORING_SUMMARY.md          # Refactoring project summary
├── 📄 STYLE_GUIDE.md                  # Code style guidelines
├── 📄 THEMING_SYSTEM.md               # Theme system documentation
├── 📄 SETTINGS.md                     # Settings system documentation
├── 📄 COLOR_SCHEME_IMPLEMENTATION.md  # Color scheme implementation
├── 📄 ELECTRON_INTEGRATION.md         # Electron integration guide
├── 📄 NAVIGATION_SYSTEM.md            # Navigation system documentation
├── 📄 NOTIFICATIONS_SYSTEM.md         # Notifications system guide
├── 📄 SEARCH_SYSTEM_INTEGRATION.md    # Search system documentation
├── 📁 electron/                       # Electron main process
└── 📁 frontend/                       # React frontend application
```

## Electron Backend

```
electron/
├── 📄 main.cjs                        # Main Electron process entry point
├── 📄 preload.cjs                     # Secure IPC bridge between main and renderer
└── 📁 services/                       # Backend business logic services
    ├── 📄 DirectoryScanner.cjs        # File system scanning and traversal
    ├── 📄 TaskGenerator.cjs           # Task file generation logic
    └── 📄 ScaffoldGenerator.cjs       # Scaffold script generation logic
```

## Frontend Application

```
frontend/app/
├── 📄 package.json                    # Frontend dependencies and scripts
├── 📄 README.md                       # Frontend-specific documentation
├── 📄 index.html                      # HTML entry point
├── 📄 vite.config.ts                  # Vite build configuration
├── 📄 tailwind.config.js              # Tailwind CSS configuration
├── 📄 postcss.config.js               # PostCSS configuration
├── 📄 eslint.config.js                # ESLint configuration
├── 📄 tsconfig.json                   # TypeScript configuration
├── 📄 tsconfig.app.json               # App-specific TypeScript config
├── 📄 tsconfig.node.json              # Node-specific TypeScript config
├── 📁 public/                         # Static assets
│   └── 📄 vite.svg                    # Vite logo
└── 📁 src/                            # Source code
```

## Source Code Structure

```
src/
├── 📄 main.tsx                        # React application entry point
├── 📄 App.tsx                         # Root App component
├── 📄 App.css                         # App-level styles
├── 📄 index.css                       # Global styles
├── 📄 vite-env.d.ts                   # Vite environment types
├── 📁 assets/                         # Static assets
│   └── 📄 react.svg                   # React logo
├── 📁 components/                     # React components
├── 📁 pages/                          # Page components
├── 📁 hooks/                          # Custom React hooks
├── 📁 services/                       # Frontend services
├── 📁 utils/                          # Utility functions
├── 📁 lib/                            # Library functions
├── 📁 types/                          # TypeScript type definitions
├── 📁 config/                         # Configuration files
├── 📁 data/                           # Static data files
└── 📁 styles/                         # CSS stylesheets
```

## Components Architecture

```
components/
├── 📁 ui/                             # Base UI components
│   ├── 📄 Button.tsx                  # Reusable button component
│   ├── 📄 Card.tsx                    # Card container component
│   ├── 📄 DragDropList.tsx            # Drag and drop list component
│   ├── 📄 FilePreview.tsx             # File content preview component
│   ├── 📄 FileTree.tsx                # File tree display component
│   ├── 📄 ProgressBar.tsx             # Progress indicator component
│   ├── 📄 QueueList.tsx               # Queue management component
│   ├── 📄 Toast.tsx                   # Toast notification component
│   ├── 📄 select.tsx                  # Select dropdown component
│   └── 📄 switch.tsx                  # Toggle switch component
├── 📁 shared/                         # Shared component systems
│   ├── 📁 generators/                 # Shared generator components
│   │   ├── 📄 GeneratorSetup.tsx      # Common setup interface
│   │   ├── 📄 GeneratorActions.tsx    # Common actions and progress
│   │   └── 📄 index.ts                # Barrel exports
│   └── 📁 forms/                      # Shared form components
│       ├── 📄 SettingsSection.tsx     # Settings section header
│       ├── 📄 FormField.tsx           # Generic form field
│       ├── 📄 CheckboxGroup.tsx       # Checkbox group component
│       ├── 📄 RadioGroup.tsx          # Radio button group
│       ├── 📄 NumberInput.tsx         # Number input field
│       ├── 📄 TextInput.tsx           # Text input field
│       ├── 📄 TagList.tsx             # Tag list management
│       ├── 📄 KeyValueList.tsx        # Key-value pair list
│       └── 📄 index.ts                # Barrel exports
├── 📁 features/                       # Feature-specific components
│   ├── 📁 task-generator/             # Task generator feature
│   │   ├── 📄 TaskGenerator.tsx       # Main task generator component
│   │   ├── 📄 TaskGeneratorSetup.tsx  # Setup configuration
│   │   ├── 📄 TaskGeneratorSettings.tsx # Settings panel
│   │   ├── 📄 TaskGeneratorActions.tsx # Action buttons
│   │   ├── 📄 TaskGeneratorPreview.tsx # Output preview
│   │   └── 📄 TaskGeneratorResults.tsx # Results display
│   ├── 📁 scaffold-generator/         # Scaffold generator feature
│   │   ├── 📄 ScaffoldGenerator.tsx   # Main scaffold generator
│   │   ├── 📄 ScaffoldGeneratorSetup.tsx # Setup configuration
│   │   ├── 📄 ScaffoldGeneratorSettings.tsx # Settings panel
│   │   ├── 📄 ScaffoldGeneratorActions.tsx # Action buttons
│   │   ├── 📄 ScaffoldGeneratorPreview.tsx # Output preview
│   │   └── 📄 ScaffoldGeneratorResults.tsx # Results display
│   ├── 📁 settings/                   # Settings feature
│   │   ├── 📄 Settings.tsx            # Main settings component
│   │   ├── 📄 AppearanceSettings.tsx  # Appearance configuration
│   │   └── 📄 SidebarManagement.tsx   # Sidebar management
│   ├── 📁 spotlight-search/           # Search feature
│   │   ├── 📄 SearchInput.tsx         # Search input field
│   │   ├── 📄 SearchResults.tsx       # Search results display
│   │   └── 📄 SearchEmptyState.tsx    # Empty state component
│   ├── 📁 tabbar/                     # Tab bar feature
│   │   ├── 📄 TabBarScrollable.tsx    # Scrollable tab container
│   │   ├── 📄 TabItem.tsx             # Individual tab component
│   │   └── 📄 TabBarControls.tsx      # Tab controls
│   ├── 📁 filetree/                   # File tree feature
│   │   ├── 📄 TreeNodeComponent.tsx   # Individual tree node
│   │   ├── 📄 FileTreeEmptyState.tsx  # Empty state display
│   │   └── 📄 index.ts                # Barrel exports
│   └── 📁 welcome/                    # Welcome page feature
│       ├── 📄 WelcomeHeader.tsx       # Welcome page header
│       ├── 📄 WelcomeFeatureCard.tsx  # Feature showcase card
│       └── 📄 index.ts                # Barrel exports
├── 📁 layout/                         # Layout orchestration
│   ├── 📄 Layout.tsx                  # Main layout orchestrator
│   ├── 📄 LayoutMainContent.tsx       # Main content area
│   ├── 📄 LayoutSidebar.tsx           # Sidebar layout
│   ├── 📄 SidePanel.tsx               # Side panel component
│   ├── 📄 Sidebar.tsx                 # Navigation sidebar
│   ├── 📄 StatusBar.tsx               # Bottom status bar
│   └── 📄 TitleBar.tsx                # Top title bar
├── 📁 titlebar/                       # Title bar components
│   ├── 📄 AppControls.tsx             # Application controls
│   ├── 📄 TabBar.tsx                  # Tab bar component
│   └── 📄 WindowControls.tsx          # Window controls
├── 📁 sidebar/                        # Sidebar components
│   ├── 📄 CollapseButton.tsx          # Sidebar collapse button
│   ├── 📄 NavItem.tsx                 # Navigation item
│   ├── 📄 NavigationItems.tsx         # Navigation items list
│   └── 📄 SettingsButton.tsx          # Settings access button
├── 📁 menu/                           # Menu components
│   ├── 📄 DropdownMenu.tsx            # Dropdown menu container
│   ├── 📄 MenuButton.tsx              # Menu trigger button
│   ├── 📄 MenuItem.tsx                # Individual menu item
│   └── 📄 Submenu.tsx                 # Submenu component
├── 📁 search/                         # Search components
│   └── 📄 SpotlightSearch.tsx         # Main spotlight search
└── 📁 common/                         # Common components
    └── 📄 PageHeader.tsx               # Page header component
```

## Pages

```
pages/
├── 📄 WelcomePage.tsx                 # Welcome page (90 lines, was 247)
├── 📁 tasks/                          # Task generator pages
│   └── 📄 TaskGeneratorPage.tsx       # Task generator page (43 lines, was 705)
├── 📁 scaffold/                       # Scaffold generator pages
│   └── 📄 ScaffoldGeneratorPage.tsx   # Scaffold generator page (43 lines, was 780)
└── 📁 settings/                       # Settings pages
    ├── 📄 SettingsPage.tsx            # Settings page (73 lines, was 347)
    └── 📄 SettingsPanel.tsx           # Settings side panel
```

## Custom Hooks

```
hooks/
├── 📄 useLayoutState.ts               # Layout state management
├── 📄 useLayoutServices.ts            # Layout service initialization
├── 📄 useLayoutKeyboard.ts            # Layout keyboard shortcuts
├── 📄 useLayoutEffects.ts             # Layout side effects
├── 📄 useFileTreeState.ts             # File tree state management
├── 📄 useWelcomeAnimations.ts         # Welcome page animations
├── 📄 useWelcomeState.ts              # Welcome page state
├── 📄 useTabBarDragDrop.ts            # Tab bar drag & drop
├── 📄 useTabBarScroll.ts              # Tab bar scrolling
├── 📄 useSpotlightKeyboard.ts         # Spotlight keyboard navigation
├── 📄 useSpotlightSearch.ts           # Spotlight search logic
├── 📄 useSidebarManagement.ts         # Sidebar management
├── 📄 useTaskGeneration.ts            # Task generation logic
├── 📄 useScaffoldGeneration.ts        # Scaffold generation logic
├── 📄 useSettings.ts                  # Settings management
├── 📄 useTabs.ts                      # Tab management
├── 📄 useToast.ts                     # Toast notifications
├── 📄 usePlatform.ts                  # Platform detection
└── 📄 useKeyboardShortcuts.ts         # Global keyboard shortcuts
```

## Services

```
services/
├── 📄 appService.ts                   # Application orchestration
├── 📄 TaskGeneratorService.ts         # Task generation business logic
├── 📄 ScaffoldGeneratorService.ts     # Scaffold generation business logic
├── 📄 platformService.ts              # Platform abstraction
├── 📄 electronService.ts              # Electron-specific services
├── 📄 browserService.ts               # Browser-specific services
├── 📄 navigationService.ts            # Navigation management
├── 📄 searchService.ts                # Search functionality
└── 📄 tabService.ts                   # Tab management service
```

## Utilities

```
utils/
├── 📄 utils.ts                        # General utility functions
├── 📄 fileTreeUtils.ts                # File tree operations
└── 📄 iconUtils.tsx                   # Icon utility functions
```

## Library Functions

```
lib/
└── 📄 utils.ts                        # Core utility functions (cn, etc.)
```

## Type Definitions

```
types/
├── 📄 electron-api.d.ts               # Electron API type definitions
├── 📄 navigation.ts                   # Navigation type definitions
└── 📄 tab.ts                          # Tab type definitions
```

## Configuration

```
config/
├── 📄 navigationConfig.tsx            # Navigation configuration
└── 📄 welcomeFeatures.ts              # Welcome page features config
```

## Data

```
data/
└── 📄 searchData.ts                   # Search data definitions
```

## Stylesheets

```
styles/
├── 📄 base.css                        # Base styles
├── 📄 variables.css                   # CSS custom properties
├── 📄 themes.css                      # Color scheme theme definitions
├── 📄 components.css                  # Component-specific styles
├── 📄 settings.css                    # Settings page styles
└── 📄 borders.css                     # Border utilities
```

## Key Architecture Features

### Component Organization
- **UI Components**: Reusable base components in `/ui`
- **Shared Components**: Cross-feature components in `/shared`
- **Feature Components**: Domain-specific components in `/features`
- **Layout Components**: Layout orchestration in `/layout`
- **Page Components**: Route-level orchestrators in `/pages`

### State Management
- **Custom Hooks**: Focused state management hooks in `/hooks`
- **Services**: Business logic separation in `/services`
- **Clean Architecture**: Clear separation of concerns

### Code Quality
- **Single Responsibility**: All components under 150 lines
- **Type Safety**: Comprehensive TypeScript coverage
- **DRY Principles**: Extensive code reuse through shared components
- **Modern Patterns**: React composition and custom hooks

### Refactoring Results
- **18 Components Refactored**: 72% overall code reduction
- **20+ Shared Components**: Eliminates duplicate code
- **Service Layer**: Clean business logic separation
- **Production Ready**: Maintainable, scalable architecture

This structure represents the complete refactoring of the Task Writer codebase following modern React architecture principles and best practices.