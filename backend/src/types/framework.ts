export interface FrameworkDetectionResult {
  frameworks: FrameworkInfo[];
  projectType: ProjectType;
  architecture: ProjectArchitecture;
  buildTools: BuildToolsInfo;
  confidence: number;
  evidence: FrameworkEvidence;
}

export interface FrameworkInfo {
  name: FrameworkType;
  version: string;
  confidence: number;
  category: FrameworkCategory;
}

export interface BuildToolsInfo {
  bundler: string | null;
  transpiler: string | null;
  taskRunner: string | null;
  packageManager: string | null;
}

export interface FrameworkEvidence {
  packageJson: PackageJsonEvidence;
  configFiles: ConfigFileEvidence;
  filePatterns: FilePatternEvidence;
}

export interface PackageJsonEvidence {
  dependencies: string[];
  devDependencies: string[];
  scripts: string[];
  framework: string[];
}

export interface ConfigFileEvidence {
  found: string[];
  frameworks: string[];
}

export interface FilePatternEvidence {
  extensions: string[];
  patterns: string[];
  frameworks: string[];
}

export enum FrameworkType {
  // Frontend
  REACT = 'react',
  VUE = 'vue',
  ANGULAR = 'angular',
  SVELTE = 'svelte',
  SOLID = 'solid',
  PREACT = 'preact',
  
  // Meta Frameworks
  NEXT_JS = 'nextjs',
  NUXT = 'nuxt',
  SVELTEKIT = 'sveltekit',
  GATSBY = 'gatsby',
  REMIX = 'remix',
  
  // Backend JavaScript
  EXPRESS = 'express',
  FASTIFY = 'fastify',
  NEST_JS = 'nestjs',
  KOA = 'koa',
  HAPI = 'hapi',
  
  // Backend Python
  DJANGO = 'django',
  FLASK = 'flask',
  FASTAPI = 'fastapi',
  PYRAMID = 'pyramid',
  TORNADO = 'tornado',
  BOTTLE = 'bottle',
  STREAMLIT = 'streamlit',
  DASH = 'dash',
  
  // Backend Rust
  ACTIX_WEB = 'actix-web',
  ROCKET = 'rocket',
  AXUM = 'axum',
  WARP = 'warp',
  TIDE = 'tide',
  YEW = 'yew',
  LEPTOS = 'leptos',
  BEVY = 'bevy',
  
  // Backend .NET
  ASPNET_CORE = 'aspnet-core',
  BLAZOR_SERVER = 'blazor-server',
  BLAZOR_WASM = 'blazor-wasm',
  MAUI = 'maui',
  WPF = 'wpf',
  WINUI = 'winui',
  AVALONIA = 'avalonia',
  WINFORMS = 'winforms',
  
  // Backend Go
  GIN = 'gin',
  ECHO = 'echo',
  FIBER = 'fiber',
  BEEGO = 'beego',
  REVEL = 'revel',
  BUFFALO = 'buffalo',
  COBRA = 'cobra',
  
  // Backend Java
  SPRING_BOOT = 'spring-boot',
  SPRING_MVC = 'spring-mvc',
  QUARKUS = 'quarkus',
  MICRONAUT = 'micronaut',
  DROPWIZARD = 'dropwizard',
  JERSEY = 'jersey',
  STRUTS = 'struts',
  ANDROID = 'android',
  KOTLIN_ANDROID = 'kotlin-android',
  JAVAFX = 'javafx',
  SWING = 'swing',
  
  // Data Science
  JUPYTER = 'jupyter',
  NUMPY = 'numpy',
  PANDAS = 'pandas',
  SCIKIT_LEARN = 'scikit-learn',
  TENSORFLOW = 'tensorflow',
  PYTORCH = 'pytorch',
  
  // Mobile
  REACT_NATIVE = 'react-native',
  EXPO = 'expo',
  FLUTTER = 'flutter',
  IONIC = 'ionic',
  
  // Desktop
  ELECTRON = 'electron',
  TAURI = 'tauri',
  
  // Build Tools
  VITE = 'vite',
  WEBPACK = 'webpack',
  ROLLUP = 'rollup',
  PARCEL = 'parcel',
  MAVEN = 'maven',
  GRADLE = 'gradle',
  
  // Languages
  RUST = 'rust',
  GO = 'go',
  PYTHON = 'python',
  DOTNET = 'dotnet',
  JAVA = 'java',
  KOTLIN = 'kotlin',
  SCALA = 'scala',
  
  // Testing
  JEST = 'jest',
  VITEST = 'vitest',
  CYPRESS = 'cypress',
  PLAYWRIGHT = 'playwright',
  JUNIT = 'junit',
  TESTNG = 'testng',
  MOCKITO = 'mockito'
}

export enum FrameworkCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  WEB_FRAMEWORK = 'web-framework',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  META_FRAMEWORK = 'meta-framework',
  BUILD_TOOL = 'build-tool',
  TESTING = 'testing',
  UTILITY = 'utility'
}

export enum ProjectType {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  FULLSTACK = 'fullstack',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  LIBRARY = 'library',
  MONOREPO = 'monorepo',
  DATA_SCIENCE = 'data-science',
  CLI = 'cli',
  SERVICE = 'service',
  TESTING = 'testing',
  INFRASTRUCTURE = 'infrastructure',
  MESSAGING = 'messaging',
  GAME_ENGINE = 'game-engine',
  UNKNOWN = 'unknown'
}

export enum ProjectArchitecture {
  SPA = 'spa',
  SSR = 'ssr',
  SSG = 'ssg',
  API = 'api',
  MICROSERVICES = 'microservices',
  MONOLITH = 'monolith',
  JAM_STACK = 'jamstack',
  UNKNOWN = 'unknown'
}

export class FrameworkDetectionError extends Error {
  constructor(
    message: string,
    public readonly projectPath: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'FrameworkDetectionError';
  }
}

export interface FrameworkDetectionOptions {
  includeEvidence?: boolean;
  minConfidence?: number;
  scanDepth?: number;
}