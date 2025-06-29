# Task 3.3: Full Stack Build & Development Workflow Configuration

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

10.) **FINAL CHECKLIST** Always verify location before executing terminal commands. Use Full Paths: Always use full paths for directories when executing terminal commands. Resolve Terminal errors and syntax errors, ignore missing imports and do not create "placeholder" files unless instructed to do so. Do not create files or folders outside the workspace. **Only create files specified.** 

**IMPORTANT:** All npm script definitions and executions will be from the **project root directory**.

## Commands (PowerShell)

**From the PROJECT ROOT directory (e.g., your-project-root):**

```powershell
# STEP 2: Install Development Dependencies (as per project docs)
# Example: npm install -D concurrently cross-env wait-on electron-builder electron electron-reload

# STEP 5: Dev Workflow Verification (use actual main dev script from your package.json)
# Example: npm run dev

# STEP 6: Production Build Verification (use actual main build script from your package.json)
# Example: npm run build
# Or platform-specific: npm run build:win
```

## Detailed Steps and Explanations

### 1. **Crucial:**

Before proceeding, thoroughly inspect the `electron/` directory. If a `Docs/` subfolder exists,

**you must read relevant files for your task onlywithin it VERBATIM.**

These documents may contain critical style guides, architectural requirements, specific data models, or setup instructions that supersede or augment the general steps below.

Ensure your PowerShell terminal is in the project's root directory. **Consult `electron/Docs/COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md` and `BUILD_PROCESS.md` (and any other overall project docs) for specific instructions on build/dev workflows, script names, and commands before proceeding.**

### 2. Install Development Dependencies (for Script Orchestration - As Per Project Docs)

Install tools like `concurrently`, `cross-env`, and `wait-on` if they are part of your project's documented toolset for managing multiple processes. `electron`, `electron-builder`, and `electron-reload` should have been installed in Task 3.1.

**Action:**
From your **project root**, verify/install necessary tools based on project documentation:

```powershell
# These are commonly used and listed in the example package.json from docs.
# Ensure versions match project requirements if specified.
npm install -D concurrently cross-env wait-on
```

### 3. Define npm Scripts in Root `package.json` (VERBATIM from Docs, Adapted for React)

Enhance the `scripts` section of your root `package.json`. **The script names, commands, paths, and their sequencing MUST be implemented according to your project's specific documentation (e.g., `COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md`, `BUILD_PROCESS.md`).** The example below is adapted for a React/Vite frontend based on those documents.

**Action (Modify root `package.json`):**

```jsonc
// In root package.json - ADAPT VERBATIM FROM YOUR PROJECT'S DOCUMENTATION
{
  "name": "insightllm-studio", // From project docs
  "version": "1.0.0", // From project docs
  "description": "InsightLLM Studio Application", // From project docs
  "main": "electron/main.js", // From project docs
  "scripts": {
    // --- Individual Component Scripts ---
    "start:backend": "cd backend && dotnet watch run", // Recommended for dev
    "start:frontend": "cd frontend/app && npm run dev", // Vite dev command
    "start:electron": "wait-on http://localhost:5173 && cross-env NODE_ENV=development electron .", // Vite default port 5173

    // --- Combined Development Workflow (from COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md) ---
    "start": "concurrently --kill-others \"npm:start:backend\" \"npm:start:frontend\" \"npm:start:electron\"",
    "dev": "npm run start",

    // --- Individual Build Scripts ---
    "build:web": "cd frontend/app && npm run build", // Vite production build

    // Backend Publish Scripts (from COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md)
    "build:backend": "cd backend && dotnet publish -c Release -o ./publish", // General publish
    "build:backend:win": "cd backend && dotnet publish -c Release -r win-x64 -o ./publish",
    "build:backend:mac": "cd backend && dotnet publish -c Release -r osx-x64 -o ./publish",
    "build:backend:linux": "cd backend && dotnet publish -c Release -r linux-x64 -o ./publish",

    // --- Electron Packaging & Combined Production Builds (from COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md) ---
    "electron:package": "electron-builder", // Renamed from "build:electron" in some docs for clarity

    "build": "npm run build:web && npm run build:backend && npm run electron:package", // Default full build

    "build:win": "npm run build:web && npm run build:backend:win && electron-builder --win",
    "build:mac": "npm run build:web && npm run build:backend:mac && electron-builder --mac",
    "build:linux": "npm run build:web && npm run build:backend:linux && electron-builder --linux",

    "test": "cd frontend/app && npm test" // Adapted for React
  },
  "devDependencies": {
    // Ensure these match versions from project docs if specified, or use appropriate latest versions
    "electron": "^latest",
    "electron-builder": "^latest",
    "electron-reload": "^latest",
    "concurrently": "^latest",
    "cross-env": "^latest",
    "wait-on": "^latest"
  }
  // The "build" section for electron-builder should be as defined in Task 3.1,
  // based on COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md.
}
```

**Key Considerations (Follow Project Docs for all these):**

- **Frontend Port:** The `start:electron` script uses `wait-on http://localhost:5173` assuming Vite's default port. Adjust if your React dev server uses a different port.
- **Backend Publish Output:** The `build:backend` scripts publish to `backend/publish/`. This path must align with the `extraResources` configuration in your `electron-builder` setup (Task 3.1).
- **Platform-Specific RIDs:** Ensure the Runtime Identifiers (RIDs) in `build:backend:*` scripts are correct for your target platforms.

### 4. Configure Desktop Packaging (`electron-builder` - Verify from Task 3.1)

This was detailed in Task 3.1, based on `COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md`. **Review and verify that the `build` section in your root `package.json` (or your separate `electron-builder.json/.yml` file) is correctly configured VERBATIM as per your project documentation.** This includes `appId`, `productName`, `directories`, `files`, `extraResources` (pointing to the correct React frontend build output, e.g., `frontend/app/dist/`, and the .NET backend publish output), and platform-specific settings.

### 5. Dev Workflow Verification (as per Project Docs)

Test your main development script (e.g., `npm run start` or `npm run dev`).

**Action:**
From the **project root**, run the documented main development script.
**Expected Outcome (must align with project documentation, e.g., `BUILD_PROCESS.md` and `COMPREHENSIVE_ELECTRON_INTEGRATION_GUIDE.md`):**

- The .NET backend API starts (ideally with `dotnet watch run` for hot reload) and listens on its configured port (e.g., `http://localhost:5001`).
- The React (Vite) frontend development server starts and is accessible (e.g., `http://localhost:5173`).
- After the Vite server is ready (due to `wait-on`), the Electron application window launches.
- Electron loads the React app from the Vite dev server.
- Hot reloading works for the React frontend. If `electron-reload` is configured and active for main/preload, changes there should also reload Electron.
- The React app can communicate with the .NET backend API.
- Stopping the main `concurrently` script (Ctrl+C) should terminate all child processes.

### 6. Production Build and Packaging Verification (as per Project Docs)

Test your main production build and packaging script (e.g., `npm run build`, or a platform-specific one like `npm run build:win`).

**Action:**
From the **project root**, run the documented main build and packaging script for at least one platform.
**Expected Outcome (must align with project documentation):**

- The .NET backend is published to its designated output folder (e.g., `backend/publish/`).
- The React frontend application is built for production into its `dist` folder (e.g., `frontend/app/dist/`).
- `electron-builder` successfully packages the application, bundling the Electron shell, your `main.js`/`preload.js`, and the `extraResources` (frontend build and backend publish output).
- Installers/packaged apps are created in the `dist_electron/` directory (or as configured).
- The build process completes without errors.
- **Test the Packaged Application:** Install and run.
  - It should launch correctly.
  - The `main.js` should start the bundled .NET backend from `resources/backend/publish/`.
  - Electron should load the bundled React frontend from `resources/frontend/`.
  - The application should be fully functional.
  - Closing the Electron application should terminate the bundled .NET backend process.

### Completion

Task 3.3 is complete when:

- NPM scripts in the root `package.json` are implemented **VERBATIM as specified in project documentation** for development, building (frontend and backend), and Electron packaging for all target platforms.
- The documented development workflow (`npm run start` or `dev`) successfully starts all components, and they integrate correctly with hot-reloading where applicable.
- The documented production build workflow (e.g., `npm run build` or `npm run build:win`) successfully builds all components and `electron-builder` packages a working desktop installer/application.
- The packaged desktop application installs and runs according to project specifications, including managing the bundled backend process.
  This ensures a build and development configuration compliant with your project's defined standards.
