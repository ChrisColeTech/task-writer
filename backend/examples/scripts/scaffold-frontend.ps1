# Scaffold Frontend - React/Vite Project Setup
# Implements task_01.0.md from 2_frontend folder

Write-Host "=== Frontend Project Scaffold ===" -ForegroundColor Blue
Write-Host ""

# Get current directory and ensure we're in project root
$currentDir = Get-Location
Write-Host "Current directory: $currentDir" -ForegroundColor Yellow

# Check if we're in a project root (should have package.json and frontend folder)
if (-not (Test-Path "package.json") -or -not (Test-Path "frontend")) {
    Write-Host "ERROR: Must be run from project root directory (should contain package.json and frontend folder)" -ForegroundColor Red
    Write-Host "Run scaffold-init.ps1 first if you haven't already." -ForegroundColor Red
    exit 1
}

Write-Host "Starting frontend project setup..." -ForegroundColor Green

try {
    # 1. Initial Project Setup & Dependency Installation
    Write-Host "Step 1: Setting up Vite React project..." -ForegroundColor Yellow
    Set-Location "frontend"
    npm create vite@latest app -- --template react-ts
    Set-Location "app"
    
    # 2. Create Directory Structure
    Write-Host "Step 2: Creating directory structure..." -ForegroundColor Yellow
    $directories = @(
        'src/components/common',
        'src/components/layout',
        'src/components/menu',
        'src/components/sidebar',
        'src/components/titlebar',
        'src/components/ui',
        'src/config',
        'src/hooks',
        'src/lib',
        'src/pages',
        'src/pages/settings',
        'src/services',
        'src/styles',
        'src/types',
        'src/utils'
    )
    
    foreach ($dir in $directories) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    
    # 3. Create Empty Files
    Write-Host "Step 3: Creating placeholder files..." -ForegroundColor Yellow
    $files = @(
        'src/components/common/PageHeader.tsx',
        'src/components/layout/Layout.tsx',
        'src/components/layout/Sidebar.tsx',
        'src/components/layout/SidePanel.tsx',
        'src/components/layout/StatusBar.tsx',
        'src/components/layout/TitleBar.tsx',
        'src/components/menu/MenuButton.tsx',
        'src/components/menu/DropdownMenu.tsx',
        'src/components/menu/MenuItem.tsx',
        'src/components/menu/Submenu.tsx',
        'src/components/sidebar/CollapseButton.tsx',
        'src/components/sidebar/NavigationItems.tsx',
        'src/components/sidebar/NavItem.tsx',
        'src/components/sidebar/SettingsButton.tsx',
        'src/components/titlebar/AppControls.tsx',
        'src/components/titlebar/TabBar.tsx',
        'src/components/titlebar/WindowControls.tsx',
        'src/components/ui/Select.tsx',
        'src/components/ui/Switch.tsx',
        'src/config/navigationConfig.tsx',
        'src/hooks/useSettings.tsx',
        'src/hooks/useTabs.tsx',
        'src/hooks/usePlatform.tsx',
        'src/lib/utils.tsx',
        'src/pages/WelcomePage.tsx',
        'src/pages/settings/SettingsPage.tsx',
        'src/pages/settings/SettingsPanel.tsx',
        'src/services/appService.tsx',
        'src/services/platformService.tsx',
        'src/services/electronService.tsx',
        'src/services/browserService.tsx',
        'src/services/navigationService.tsx',
        'src/services/tabService.tsx',
        'src/styles/variables.tsx',
        'src/styles/base.tsx',
        'src/styles/settings.tsx',
        'src/styles/components.tsx',
        'src/styles/borders.tsx',
        'src/types/navigation.tsx',
        'src/types/tab.tsx',
        'src/types/electron-api.d.tsx',
        'src/utils/iconUtils.tsx',
        'src/utils/utils.tsx'
    )
    
    foreach ($file in $files) {
        New-Item -ItemType File -Force -Path $file | Out-Null
    }
    
    # 4. Update package.json
    Write-Host "Step 4: Updating package.json..." -ForegroundColor Yellow
    $packageJson = @"
{
  "name": "app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "typecheck": "tsc -p tsconfig.app.json --noEmit",
    "preview": "vite preview"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@fontsource/inter": "^5.2.5",
    "@fortawesome/fontawesome-svg-core": "^6.7.2",
    "@fortawesome/free-solid-svg-icons": "^6.7.2",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@headlessui/react": "^2.2.4",
    "clsx": "^2.1.1",
    "lucide-react": "^0.511.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.6.1",
    "tailwind-merge": "^3.3.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@eslint/js": "^9.25.0",
    "@rollup/rollup-win32-x64-msvc": "^4.41.1",
    "@tailwindcss/forms": "^0.5.10",
    "@types/node": "^22.15.24",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.25.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.3",
    "ts-node": "^10.9.2",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.30.1",
    "vite": "^6.3.5"
  }
}
"@
    $packageJson | Set-Content "package.json"
    
    # 5. TypeScript Configuration
    Write-Host "Step 5: Creating TypeScript configurations..." -ForegroundColor Yellow
    
    # tsconfig.app.json
    $tsconfigApp = @"
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "typeRoots": ["./node_modules/@types", "./node_modules/@fontsource", "./src/types"],
    "types": ["node", "vite/client"],

    "moduleResolution": "node",
    "allowImportingTsExtensions": false,
    "moduleDetection": "auto",
    "noEmit": true,
    "allowUmdGlobalAccess": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.d.ts", "vite.config.ts"]
}
"@
    $tsconfigApp | Set-Content "tsconfig.app.json"
    
    # tsconfig.node.json
    $tsconfigNode = @"
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["vite.config.ts"]
}
"@
    $tsconfigNode | Set-Content "tsconfig.node.json"
    
    # 6. Vite Configuration
    Write-Host "Step 6: Creating Vite configuration..." -ForegroundColor Yellow
    $viteConfig = @"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const config = defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  base: './',
  server: {
    hmr: true,
    port: 5173,
    strictPort: true,
  },
})

export default config
"@
    $viteConfig | Set-Content "vite.config.ts"
    
    # 7. ESLint Configuration
    Write-Host "Step 7: Creating ESLint configuration..." -ForegroundColor Yellow
    $eslintConfig = @"
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist',
      'src/components/**',
      'src/hooks/**',
      'src/pages/**',
      'src/services/**',
      'src/styles/**',
      'src/types/**',
      'src/utils/**',
      'src/config/**',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
"@
    $eslintConfig | Set-Content "eslint.config.js"
    
    # 8. Minimal bootstrap code
    Write-Host "Step 8: Creating bootstrap code..." -ForegroundColor Yellow
    
    # main.tsx
    $mainTsx = @"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
"@
    $mainTsx | Set-Content "src/main.tsx"
    
    # App.tsx (overwrite existing)
    $appTsx = @"
import Layout from './components/layout/Layout'

function App() {
  return <Layout />
}

export default App
"@
    $appTsx | Set-Content "src/App.tsx"
    
    # Layout.tsx
    $layoutTsx = @"
import React from 'react'

const Layout: React.FC = () => {
  return (
    <main className="grid h-dvh w-dvw place-items-center bg-slate-900 text-slate-100">
      <h1 className="text-3xl font-semibold">Scaffold works 🚀</h1>
    </main>
  )
}

export default Layout
"@
    $layoutTsx | Set-Content "src/components/layout/Layout.tsx"
    
    # Delete App.css
    if (Test-Path "src/App.css") {
        Remove-Item "src/App.css"
    }
    
    # 8. FINAL STEP - install packages and build
    Write-Host "Step 8: Installing packages and building..." -ForegroundColor Yellow
    npm install
    npx tailwindcss init -p
    npm run build
    npm run lint
    npm run typecheck
    
    Write-Host "✓ Frontend project setup completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "ERROR: Failed to set up frontend project: $_" -ForegroundColor Red
    exit 1
} finally {
    # Return to project root
    Set-Location $currentDir
}

Write-Host ""
Write-Host "Frontend project created successfully!" -ForegroundColor Green
Write-Host "Location: frontend/app/" -ForegroundColor Cyan
Write-Host ""
