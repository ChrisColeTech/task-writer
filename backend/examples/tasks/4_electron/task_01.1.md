# Task 3.2: Electron Preload Typing & Unified Build Scripts

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

## Commands (PowerShell)

Verification for this task primarily involves successful TypeScript compilation of the frontend.

**From the `frontend/app/` directory (after creating/updating `.d.ts` file):**

```powershell
# Verify frontend compiles with the new typings
npm run build
```

**From the PROJECT ROOT directory (e.g., your-project-root):**

```powershell
# Example of a script that would include building the typed frontend
# (Actual script name and commands from your project docs / Task 3.3)
# npm run build:frontend
# npm run build:all
```

## Detailed Steps and Explanations

### 1. **Crucial:**

Before proceeding, thoroughly inspect the `electron/` directory. If a `Docs/` subfolder exists,

**you must read relevant files for your task onlywithin it VERBATIM.**

These documents may contain critical style guides, architectural requirements, specific data models, or setup instructions that supersede or augment the general steps below.

To use the API exposed by `electron/preload.js` (e.g., `window.electronAPI`) in your React TypeScript code with type safety, you must declare its shape. **This declaration MUST precisely match the API exposed in `electron/preload.js` (see Task 3.1), which in turn must follow specifications in `electron/Docs/COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md`.**

**Action:**

1.  Inside your React application's `src` directory (e.g., `frontend/app/src/`), create a new file named `electron-api.d.ts` (or `electron.d.ts` as preferred, ensure consistency).
    _(The `COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md` suggests creating `electron/preload.d.ts` and copying it. For Vite/React, placing it directly in `frontend/app/src/` is often simpler for TypeScript to pick up automatically via `tsconfig.json`'s `include` path.)_
2.  Add the following content to this `.d.ts` file, **customizing the `IElectronAPI` interface VERBATIM** to match the functions exposed in your `electron/preload.js` (which should be based on `COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md`):

    ```typescript
    // frontend/app/src/electron-api.d.ts

    // Define the shape of the API exposed by your preload script.
    // This MUST match what you exposed via contextBridge in electron/preload.js.
    export interface IElectronAPI {
      // Window controls (from COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md)
      minimizeWindow: () => Promise<void> // Assuming invoke, which returns Promise
      maximizeWindow: () => Promise<void>
      closeWindow: () => Promise<void>
      isWindowMaximized: () => Promise<boolean> // Ensure handler is in main.js

      // API process control (from COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md)
      startApiProcess: () => Promise<boolean>
      stopApiProcess: () => Promise<boolean>
      restartApiProcess: () => Promise<boolean>
      getApiStatus: () => Promise<{ isRunning: boolean; pid: number | null }> // Ensure handler is in main.js

      // Window state listeners (example from COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md)
      // Adjust the 'state' type based on what main.js actually sends.
      onWindowStateChange: (callback: (state: { isMaximized: boolean }) => void) => () => void // Returns a cleanup function

      // Add any other methods exposed in your specific preload.js
    }

    // Extend the global Window interface
    declare global {
      interface Window {
        electronAPI?: IElectronAPI // Optional: only available in Electron environment
      }
    }

    export {} // Ensures this is treated as a module if no other exports exist.
    ```

### 2. Include Definitions in React Build (Verify `tsconfig.json`)

Ensure your React project's TypeScript configuration (`frontend/app/tsconfig.json`) includes the new declaration file. If the `.d.ts` file is in the `src` directory, the default `include` settings usually cover it.

**Action (Verify/Modify `frontend/app/tsconfig.json`):**

```jsonc
// frontend/app/tsconfig.json
{
  "compilerOptions": {
    // ... (your existing compiler options for Vite/React/TS) ...
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler", // Or "node" depending on setup
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
    // ... (other strictness/linting options) ...
  },
  // "include": ["src"] is typical and should pick up .d.ts files in src.
  // If you named it electron-preload.d.ts and put it in src, "src" is enough.
  // If you put it elsewhere or named it differently, ensure it's covered.
  "include": ["src", "src/electron-api.d.ts"], // Or just "src" if it's in there
  "references": [{ "path": "./tsconfig.node.json" }] // Common in Vite setups
}
```

**Note on `COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md`'s `preload.d.ts` copy step:** While the guide mentions copying `electron/preload.d.ts` to `frontend-angular/src/electron-preload.d.ts`, for a React/Vite project, directly creating the type definition file (e.g., `electron-api.d.ts`) within the React app's `src` folder is a common and effective approach. Ensure your `tsconfig.json`'s `include` path correctly discovers this file.

### 3. Using the Typed API in React Components

With the types defined, you can now use `window.electronAPI` in your React components with TypeScript autocompletion and type checking.

**Example Usage (Illustrative):**

```tsx
// Example: frontend/app/src/components/MyElectronComponent.tsx
import React, { useEffect, useState } from 'react'

const MyElectronComponent: React.FC = () => {
  const [isApiRunning, setIsApiRunning] = useState<boolean | null>(null)

  useEffect(() => {
    const checkApi = async () => {
      if (window.electronAPI?.getApiStatus) {
        // Check if function exists
        try {
          const status = await window.electronAPI.getApiStatus()
          setIsApiRunning(status.isRunning)
        } catch (error) {
          console.error('Error calling getApiStatus:', error)
          setIsApiRunning(false)
        }
      } else {
        console.warn('Electron API (getApiStatus) not available.')
      }
    }
    checkApi()
  }, [])

  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow()
  }

  return (
    <div>
      <p>Electron API Integration Example</p>
      <button onClick={handleMinimize}>Minimize Window</button>
      {isApiRunning !== null && (
        <p>Backend API Status: {isApiRunning ? 'Running' : 'Not Running'}</p>
      )}
    </div>
  )
}
export default MyElectronComponent
```

### 4. Define/Verify Build Scripts in Root `package.json` (Focus on Frontend Build)

While Task 3.3 covers the full suite of build scripts, this task ensures that the scripts responsible for building the frontend (e.g., `build:web` or `build:frontend`) correctly compile the TypeScript code, including the new Electron API typings. The `package.json` example from Task 3.1 already includes these.

**Action (Review relevant parts of root `package.json` from Task 3.1, ensuring alignment with project docs):**

```jsonc
// In root package.json (relevant script example)
{
  // ...
  "scripts": {
    // ... (other scripts like start:frontend, start:backend, start:electron) ...
    "build:web": "cd frontend/app && npm run build", // Builds the React/Vite frontend
    "build:backend": "cd backend && dotnet publish -c Release -o ./publish", // Or platform-specific
    "build:electron": "npm run build:web && npm run build:backend && electron-builder",
    "build": "npm run build:electron" // Main alias
    // ...
  }
  // ...
}
```

The key is that `npm run build` within `frontend/app/` (triggered by `build:web`) must succeed without TypeScript errors related to `window.electronAPI`.

### 5. Completion Criteria

Task 3.2 is complete when:

- The TypeScript definition file (e.g., `electron-api.d.ts`) for `window.electronAPI` is correctly created in the React app's `src` directory, with an interface that **VERBATIM matches the API exposed in `electron/preload.js` (as per project documentation)**.
- The React application's `tsconfig.json` is configured to include these type definitions.
- The React frontend application (`npm run build` within the frontend project, or `npm run build:web` from root) compiles successfully without TypeScript errors related to `window.electronAPI`.

**Verification:**

- Perform a build of your React frontend application (e.g., `cd frontend/app && npm run build`). The build should complete without any TypeScript errors, especially in components that might use `window.electronAPI`.
- If you have integrated calls to `window.electronAPI` in your components, ensure they use the correct function names and expected parameter/return types as defined in your `electron-api.d.ts`.
