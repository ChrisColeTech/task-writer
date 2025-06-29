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

# Welcome Page Implementation

Create or update the files below.

## Welcome Page Implementation

**Location:**`frontend/app/src/pages/WelcomePage.tsx`

```tsx
import { Home } from 'lucide-react'
import type { NavigationConfig } from '@/types/navigation'

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background text-text">
      <Home size={64} className="text-primary mb-4" />
      <h1 className="text-4xl font-bold mb-2">Welcome to LLM App</h1>
      <p className="text-lg text-text-muted">
        Start by opening a new tab or exploring the sidebar.
      </p>
    </div>
  )
}

export default WelcomePage

// Export the navigation config for auto-discovery
export const navigationConfig: NavigationConfig = {
  id: 'welcome',
  label: 'Welcome',
  iconComponent: Home,
  showInSidebar: false,
  closable: true,
  order: 0,
}
```

### Common Components

**Location:** `frontend/app/src/components/common/PageHeader.tsx`

### Purpose

Displays a consistent header for pages, including icon, title, and optional description.

### Key Features

- Displays page title from `navigationConfig`
- Shows page-specific icon
- Optional description
- Can render child elements
- Styled with gradient background

### Props

- `pageId: string` (required): Page identifier
- `title?: string`: Optional title override
- `description?: string`: Optional description
- `children?: React.ReactNode`: Additional content

### Implementation

```typescript
import { getPageIcon, getNavigationItem } from '../../config/navigationConfig'

interface PageHeaderProps {
  pageId: string
  title?: string
  description?: string
  children?: React.ReactNode
}

const PageHeader = ({ pageId, title, description, children }: PageHeaderProps) => {
  const navigationItem = getNavigationItem(pageId)
  const displayTitle = title || navigationItem?.label || pageId

  return (
    <div className="bg-surface app-border overflow-hidden">
      <div
        className={`bg-gradient-to-r from-surface to-background px-6 py-4${
          children ? ' app-border-b' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="page-icon">{getPageIcon(pageId)}</div>
          <h2 className="text-lg font-semibold">{displayTitle}</h2>
        </div>
        {description && <p className="text-sm text-text-muted mt-1">{description}</p>}
      </div>

      {children && <div className="p-6">{children}</div>}
    </div>
  )
}

export default PageHeader
```

## Then call attempt completion
