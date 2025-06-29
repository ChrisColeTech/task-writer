import {
  Platform,
  CommandCategory,
  CommandMapping
} from '../types/scaffoldGeneration';

export interface CommandTranslationOptions {
  includeErrorHandling?: boolean;
  verbose?: boolean;
  escapeQuotes?: boolean;
}

export interface TranslationResult {
  command: string;
  platform: Platform;
  category: CommandCategory;
  description?: string;
}

export class CommandTranslationService {
  private commandMappings: Map<string, CommandMapping>;

  constructor() {
    this.commandMappings = new Map();
    this.initializeCommandMappings();
  }

  /**
   * Translate a generic command to platform-specific syntax
   */
  translateCommand(
    genericCommand: string,
    targetPlatform: Platform,
    variables: Record<string, any> = {},
    options: CommandTranslationOptions = {}
  ): TranslationResult {
    const mapping = this.commandMappings.get(genericCommand);
    
    if (!mapping) {
      // If no mapping exists, return the original command
      return {
        command: this.processVariables(genericCommand, variables),
        platform: targetPlatform,
        category: CommandCategory.ENVIRONMENT
      };
    }

    let command = this.getPlatformCommand(mapping, targetPlatform);
    command = this.processVariables(command, variables);
    
    if (options.escapeQuotes) {
      command = this.escapeQuotes(command, targetPlatform);
    }
    
    if (options.includeErrorHandling) {
      command = this.addErrorHandling(command, targetPlatform);
    }

    return {
      command,
      platform: targetPlatform,
      category: mapping.category,
      description: mapping.description
    };
  }

  /**
   * Translate multiple commands for a platform
   */
  translateCommands(
    commands: string[],
    targetPlatform: Platform,
    variables: Record<string, any> = {},
    options: CommandTranslationOptions = {}
  ): TranslationResult[] {
    return commands.map(cmd => 
      this.translateCommand(cmd, targetPlatform, variables, options)
    );
  }

  /**
   * Get available command mappings
   */
  getAvailableCommands(): string[] {
    return Array.from(this.commandMappings.keys());
  }

  /**
   * Get command mapping details
   */
  getCommandMapping(command: string): CommandMapping | null {
    return this.commandMappings.get(command) || null;
  }

  /**
   * Check if a command is supported
   */
  isCommandSupported(command: string): boolean {
    return this.commandMappings.has(command);
  }

  /**
   * Get commands by category
   */
  getCommandsByCategory(category: CommandCategory): string[] {
    const commands: string[] = [];
    
    for (const [command, mapping] of this.commandMappings.entries()) {
      if (mapping.category === category) {
        commands.push(command);
      }
    }
    
    return commands;
  }

  private initializeCommandMappings(): void {
    // Directory operations
    this.addMapping('createDirectory', {
      generic: 'mkdir -p {{path}}',
      windows: 'if not exist "{{path}}" mkdir "{{path}}"',
      macos: 'mkdir -p "{{path}}"',
      linux: 'mkdir -p "{{path}}"',
      description: 'Create directory if it doesn\'t exist',
      category: CommandCategory.DIRECTORY
    });

    this.addMapping('removeDirectory', {
      generic: 'rm -rf {{path}}',
      windows: 'if exist "{{path}}" rmdir /s /q "{{path}}"',
      macos: 'rm -rf "{{path}}"',
      linux: 'rm -rf "{{path}}"',
      description: 'Remove directory and all contents',
      category: CommandCategory.DIRECTORY
    });

    this.addMapping('changeDirectory', {
      generic: 'cd {{path}}',
      windows: 'cd /d "{{path}}"',
      macos: 'cd "{{path}}"',
      linux: 'cd "{{path}}"',
      description: 'Change current directory',
      category: CommandCategory.DIRECTORY
    });

    this.addMapping('listDirectory', {
      generic: 'ls -la',
      windows: 'dir',
      macos: 'ls -la',
      linux: 'ls -la',
      description: 'List directory contents',
      category: CommandCategory.DIRECTORY
    });

    // File operations
    this.addMapping('copyFile', {
      generic: 'cp {{source}} {{dest}}',
      windows: 'copy "{{source}}" "{{dest}}"',
      macos: 'cp "{{source}}" "{{dest}}"',
      linux: 'cp "{{source}}" "{{dest}}"',
      description: 'Copy file from source to destination',
      category: CommandCategory.FILE
    });

    this.addMapping('moveFile', {
      generic: 'mv {{source}} {{dest}}',
      windows: 'move "{{source}}" "{{dest}}"',
      macos: 'mv "{{source}}" "{{dest}}"',
      linux: 'mv "{{source}}" "{{dest}}"',
      description: 'Move file from source to destination',
      category: CommandCategory.FILE
    });

    this.addMapping('deleteFile', {
      generic: 'rm {{file}}',
      windows: 'del "{{file}}"',
      macos: 'rm "{{file}}"',
      linux: 'rm "{{file}}"',
      description: 'Delete file',
      category: CommandCategory.FILE
    });

    this.addMapping('createFile', {
      generic: 'touch {{file}}',
      windows: 'type nul > "{{file}}"',
      macos: 'touch "{{file}}"',
      linux: 'touch "{{file}}"',
      description: 'Create empty file',
      category: CommandCategory.FILE
    });

    // Package management
    this.addMapping('installNpmPackages', {
      generic: 'npm install',
      windows: 'npm install',
      macos: 'npm install',
      linux: 'npm install',
      description: 'Install npm packages',
      category: CommandCategory.PACKAGE
    });

    this.addMapping('installGlobalNpmPackage', {
      generic: 'npm install -g {{package}}',
      windows: 'npm install -g {{package}}',
      macos: 'npm install -g {{package}}',
      linux: 'sudo npm install -g {{package}}',
      description: 'Install global npm package',
      category: CommandCategory.PACKAGE
    });

    this.addMapping('installYarnPackages', {
      generic: 'yarn install',
      windows: 'yarn install',
      macos: 'yarn install',
      linux: 'yarn install',
      description: 'Install yarn packages',
      category: CommandCategory.PACKAGE
    });

    this.addMapping('installDotnetPackages', {
      generic: 'dotnet restore',
      windows: 'dotnet restore',
      macos: 'dotnet restore',
      linux: 'dotnet restore',
      description: 'Restore .NET packages',
      category: CommandCategory.PACKAGE
    });

    // Build operations
    this.addMapping('buildProject', {
      generic: 'npm run build',
      windows: 'npm run build',
      macos: 'npm run build',
      linux: 'npm run build',
      description: 'Build the project',
      category: CommandCategory.BUILD
    });

    this.addMapping('buildDotnetProject', {
      generic: 'dotnet build',
      windows: 'dotnet build',
      macos: 'dotnet build',
      linux: 'dotnet build',
      description: 'Build .NET project',
      category: CommandCategory.BUILD
    });

    this.addMapping('cleanBuild', {
      generic: 'npm run clean',
      windows: 'npm run clean',
      macos: 'npm run clean',
      linux: 'npm run clean',
      description: 'Clean build artifacts',
      category: CommandCategory.BUILD
    });

    // Test operations
    this.addMapping('runTests', {
      generic: 'npm test',
      windows: 'npm test',
      macos: 'npm test',
      linux: 'npm test',
      description: 'Run project tests',
      category: CommandCategory.TEST
    });

    this.addMapping('runDotnetTests', {
      generic: 'dotnet test',
      windows: 'dotnet test',
      macos: 'dotnet test',
      linux: 'dotnet test',
      description: 'Run .NET tests',
      category: CommandCategory.TEST
    });

    // Server operations
    this.addMapping('startServer', {
      generic: 'npm start',
      windows: 'npm start',
      macos: 'npm start',
      linux: 'npm start',
      description: 'Start the development server',
      category: CommandCategory.SERVER
    });

    this.addMapping('startDotnetServer', {
      generic: 'dotnet run',
      windows: 'dotnet run',
      macos: 'dotnet run',
      linux: 'dotnet run',
      description: 'Start .NET application',
      category: CommandCategory.SERVER
    });

    this.addMapping('stopProcess', {
      generic: 'pkill {{process}}',
      windows: 'taskkill /f /im {{process}}.exe',
      macos: 'pkill {{process}}',
      linux: 'pkill {{process}}',
      description: 'Stop running process',
      category: CommandCategory.SERVER
    });

    // Git operations
    this.addMapping('initGit', {
      generic: 'git init',
      windows: 'git init',
      macos: 'git init',
      linux: 'git init',
      description: 'Initialize Git repository',
      category: CommandCategory.GIT
    });

    this.addMapping('gitClone', {
      generic: 'git clone {{url}}',
      windows: 'git clone {{url}}',
      macos: 'git clone {{url}}',
      linux: 'git clone {{url}}',
      description: 'Clone Git repository',
      category: CommandCategory.GIT
    });

    this.addMapping('gitCommit', {
      generic: 'git add . && git commit -m "{{message}}"',
      windows: 'git add . && git commit -m "{{message}}"',
      macos: 'git add . && git commit -m "{{message}}"',
      linux: 'git add . && git commit -m "{{message}}"',
      description: 'Add and commit changes',
      category: CommandCategory.GIT
    });

    // Docker operations
    this.addMapping('dockerBuild', {
      generic: 'docker build -t {{imageName}} .',
      windows: 'docker build -t {{imageName}} .',
      macos: 'docker build -t {{imageName}} .',
      linux: 'docker build -t {{imageName}} .',
      description: 'Build Docker image',
      category: CommandCategory.DOCKER
    });

    this.addMapping('dockerRun', {
      generic: 'docker run -p {{port}}:{{port}} {{imageName}}',
      windows: 'docker run -p {{port}}:{{port}} {{imageName}}',
      macos: 'docker run -p {{port}}:{{port}} {{imageName}}',
      linux: 'docker run -p {{port}}:{{port}} {{imageName}}',
      description: 'Run Docker container',
      category: CommandCategory.DOCKER
    });

    this.addMapping('dockerCompose', {
      generic: 'docker-compose up -d',
      windows: 'docker-compose up -d',
      macos: 'docker-compose up -d',
      linux: 'docker-compose up -d',
      description: 'Start Docker Compose services',
      category: CommandCategory.DOCKER
    });

    // Environment operations
    this.addMapping('setEnvironmentVariable', {
      generic: 'export {{name}}={{value}}',
      windows: 'set {{name}}={{value}}',
      macos: 'export {{name}}={{value}}',
      linux: 'export {{name}}={{value}}',
      description: 'Set environment variable',
      category: CommandCategory.ENVIRONMENT
    });

    this.addMapping('getEnvironmentVariable', {
      generic: 'echo ${{name}}',
      windows: 'echo %{{name}}%',
      macos: 'echo ${{name}}',
      linux: 'echo ${{name}}',
      description: 'Display environment variable',
      category: CommandCategory.ENVIRONMENT
    });

    this.addMapping('checkCommand', {
      generic: 'which {{command}}',
      windows: 'where {{command}}',
      macos: 'which {{command}}',
      linux: 'which {{command}}',
      description: 'Check if command exists',
      category: CommandCategory.ENVIRONMENT
    });
  }

  private addMapping(command: string, mapping: CommandMapping): void {
    this.commandMappings.set(command, mapping);
  }

  private getPlatformCommand(mapping: CommandMapping, platform: Platform): string {
    switch (platform) {
      case Platform.WINDOWS:
        return mapping.windows;
      case Platform.MACOS:
        return mapping.macos;
      case Platform.LINUX:
        return mapping.linux;
      case Platform.CROSS_PLATFORM:
      default:
        return mapping.generic;
    }
  }

  private processVariables(command: string, variables: Record<string, any>): string {
    let result = command;
    
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value));
    }
    
    return result;
  }

  private escapeQuotes(command: string, platform: Platform): string {
    if (platform === Platform.WINDOWS) {
      // Escape quotes for Windows batch/cmd
      return command.replace(/"/g, '""');
    } else {
      // Escape quotes for Unix shells
      return command.replace(/"/g, '\\"');
    }
  }

  private addErrorHandling(command: string, platform: Platform): string {
    switch (platform) {
      case Platform.WINDOWS:
        return `${command} || exit /b 1`;
      case Platform.MACOS:
      case Platform.LINUX:
        return `${command} || exit 1`;
      default:
        return command;
    }
  }
}