import { ScaffoldGenerationService } from '../../services/ScaffoldGenerationService';
import { FrameworkDetectionService } from '../../services/FrameworkDetectionService';
import { TemplateManagementService } from '../../services/TemplateManagementService';
import { CommandTranslationService } from '../../services/CommandTranslationService';
import path from 'path';
import fs from 'fs';
import { createMockDirectoryStructure, cleanupMockDirectory } from '../setup';

describe('Multi-Language Scaffold Generation', () => {
  let service: ScaffoldGenerationService;
  let testDir: string;

  beforeEach(() => {
    const frameworkService = new FrameworkDetectionService();
    const templateService = new TemplateManagementService();
    const commandService = new CommandTranslationService();
    service = new ScaffoldGenerationService(frameworkService, templateService, commandService);
    testDir = createMockDirectoryStructure();
  });

  afterEach(() => {
    cleanupMockDirectory(testDir);
  });

  describe('Python Project Scaffolding', () => {
    it('should generate Django project scaffold scripts', async () => {
      const projectPath = path.join(testDir, 'django-project');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'requirements.txt'), 'Django==4.2.0');
      fs.writeFileSync(path.join(projectPath, 'manage.py'), '#!/usr/bin/env python');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'MyDjangoApp',
        includeContent: false,
        platforms: ['windows', 'linux', 'macos']
      });

      expect(result.scripts).toHaveProperty('powershell');
      expect(result.scripts).toHaveProperty('bash');
      expect(result.scripts).toHaveProperty('python');
      
      expect(result.scripts.bash).toContain('pip install django');
      expect(result.scripts.bash).toContain('django-admin startproject');
      expect(result.scripts.powershell).toContain('pip install django');
    });

    it('should generate FastAPI project scaffold scripts', async () => {
      const projectPath = path.join(testDir, 'fastapi-project');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'requirements.txt'), 'fastapi==0.100.0\nuvicorn==0.23.0');
      fs.writeFileSync(path.join(projectPath, 'main.py'), 'from fastapi import FastAPI');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'MyFastAPIApp',
        includeContent: false,
        platforms: ['linux']
      });

      expect(result.scripts.bash).toContain('pip install fastapi uvicorn');
      expect(result.scripts.bash).toContain('uvicorn main:app --reload');
    });
  });

  describe('Rust Project Scaffolding', () => {
    it('should generate Actix-web project scaffold scripts', async () => {
      const projectPath = path.join(testDir, 'actix-project');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'Cargo.toml'), `
[package]
name = "actix-app"
version = "0.1.0"

[dependencies]
actix-web = "4.0"
      `);
      fs.writeFileSync(path.join(projectPath, 'src', 'main.rs'), 'use actix_web::*;');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'MyActixApp',
        includeContent: false,
        platforms: ['linux', 'windows']
      });

      expect(result.scripts.bash).toContain('cargo init');
      expect(result.scripts.bash).toContain('cargo add actix-web');
      expect(result.scripts.bash).toContain('cargo run');
      expect(result.scripts.powershell).toContain('cargo init');
    });

    it('should generate Tauri desktop app scaffold scripts', async () => {
      const projectPath = path.join(testDir, 'tauri-project');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'src-tauri'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'tauri.conf.json'), '{"package": {"productName": "Tauri App"}}');
      fs.writeFileSync(path.join(projectPath, 'src-tauri', 'Cargo.toml'), '[dependencies]\ntauri = "1.0"');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'MyTauriApp',
        includeContent: false,
        platforms: ['windows', 'macos']
      });

      expect(result.scripts.powershell).toContain('cargo create-tauri-app');
      expect(result.scripts.powershell).toContain('cargo tauri dev');
      expect(result.scripts.zsh).toContain('cargo create-tauri-app');
    });
  });

  describe('Go Project Scaffolding', () => {
    it('should generate Gin web server scaffold scripts', async () => {
      const projectPath = path.join(testDir, 'gin-project');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'go.mod'), `
module gin-app

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
)
      `);
      fs.writeFileSync(path.join(projectPath, 'main.go'), 'package main\nimport "github.com/gin-gonic/gin"');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'MyGinApp',
        includeContent: false,
        platforms: ['linux', 'macos']
      });

      expect(result.scripts.bash).toContain('go mod init');
      expect(result.scripts.bash).toContain('go get github.com/gin-gonic/gin');
      expect(result.scripts.bash).toContain('go run .');
      expect(result.scripts.zsh).toContain('go mod init');
    });

    it('should generate Cobra CLI tool scaffold scripts', async () => {
      const projectPath = path.join(testDir, 'cobra-cli');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'cmd'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'go.mod'), 'module cli-tool\n\nrequire github.com/spf13/cobra v1.7.0');
      fs.writeFileSync(path.join(projectPath, 'cmd', 'root.go'), 'package cmd');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'MyCLI',
        includeContent: false,
        platforms: ['linux']
      });

      expect(result.scripts.bash).toContain('go mod init');
      expect(result.scripts.bash).toContain('go get github.com/spf13/cobra');
      expect(result.scripts.bash).toContain('cobra init');
    });
  });

  describe('.NET Project Scaffolding', () => {
    it('should generate ASP.NET Core scaffold scripts', async () => {
      const projectPath = path.join(testDir, 'aspnet-project');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'WebApp.csproj'), `
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
</Project>
      `);
      fs.writeFileSync(path.join(projectPath, 'Program.cs'), 'var builder = WebApplication.CreateBuilder(args);');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'MyWebApp',
        includeContent: false,
        platforms: ['windows', 'linux']
      });

      expect(result.scripts.powershell).toContain('dotnet new webapi');
      expect(result.scripts.powershell).toContain('dotnet run');
      expect(result.scripts.bash).toContain('dotnet new webapi');
    });

    it('should generate Blazor WASM scaffold scripts', async () => {
      const projectPath = path.join(testDir, 'blazor-project');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'wwwroot'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'BlazorApp.csproj'), `
<Project Sdk="Microsoft.NET.Sdk.BlazorWebAssembly">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
</Project>
      `);
      fs.writeFileSync(path.join(projectPath, 'App.razor'), '@using Microsoft.AspNetCore.Components.Routing');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'MyBlazorApp',
        includeContent: false,
        platforms: ['windows']
      });

      expect(result.scripts.powershell).toContain('dotnet new blazorwasm');
      expect(result.scripts.powershell).toContain('dotnet run');
    });
  });

  describe('Java Project Scaffolding', () => {
    it('should generate Spring Boot scaffold scripts', async () => {
      const projectPath = path.join(testDir, 'spring-project');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'src', 'main', 'java'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'pom.xml'), `
<project>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
    </parent>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
</project>
      `);
      fs.writeFileSync(path.join(projectPath, 'src', 'main', 'java', 'Application.java'), '@SpringBootApplication\npublic class Application {}');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'MySpringApp',
        includeContent: false,
        platforms: ['linux', 'windows']
      });

      expect(result.scripts.bash).toContain('curl https://start.spring.io/starter.zip');
      expect(result.scripts.bash).toContain('mvn spring-boot:run');
      expect(result.scripts.powershell).toContain('mvn spring-boot:run');
    });

    it('should generate Android project scaffold scripts', async () => {
      const projectPath = path.join(testDir, 'android-project');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'app', 'src', 'main'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'build.gradle'), `
android {
    compileSdk 34
}
dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
}
      `);
      fs.writeFileSync(path.join(projectPath, 'app', 'src', 'main', 'AndroidManifest.xml'), '<manifest></manifest>');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'MyAndroidApp',
        includeContent: false,
        platforms: ['linux', 'windows', 'macos']
      });

      expect(result.scripts.bash).toContain('gradle assembleDebug');
      expect(result.scripts.powershell).toContain('gradle assembleDebug');
      expect(result.scripts.zsh).toContain('gradle assembleDebug');
    });
  });

  describe('Cross-platform command translation', () => {
    it('should translate Python commands correctly across platforms', async () => {
      const projectPath = path.join(testDir, 'python-cross-platform');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'requirements.txt'), 'flask==2.3.0');
      fs.writeFileSync(path.join(projectPath, 'app.py'), 'from flask import Flask');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'CrossPlatformApp',
        includeContent: false,
        platforms: ['windows', 'linux']
      });

      // Windows should use different path separators and commands
      expect(result.scripts.powershell).toContain('pip install');
      expect(result.scripts.batch).toContain('pip install');
      
      // Linux should use forward slashes and bash syntax
      expect(result.scripts.bash).toContain('pip install');
      expect(result.scripts.bash).toContain('python app.py');
    });

    it('should handle environment variable syntax differences', async () => {
      const projectPath = path.join(testDir, 'env-vars-test');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'go.mod'), 'module test-app\n\ngo 1.21');
      fs.writeFileSync(path.join(projectPath, 'main.go'), 'package main');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'EnvVarsApp',
        includeContent: false,
        platforms: ['windows', 'linux']
      });

      // PowerShell uses $env:VAR syntax
      if (result.scripts.powershell.includes('$')) {
        expect(result.scripts.powershell).toContain('$env:');
      }
      
      // Bash uses $VAR syntax
      if (result.scripts.bash.includes('$')) {
        expect(result.scripts.bash).not.toContain('$env:');
      }
    });
  });

  describe('Multi-language monorepo scaffolding', () => {
    it('should generate scripts for complex monorepo with multiple languages', async () => {
      const projectPath = path.join(testDir, 'monorepo-complex');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'frontend'), { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'backend'), { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'mobile'), { recursive: true });
      
      // Frontend (React)
      fs.writeFileSync(path.join(projectPath, 'frontend', 'package.json'), JSON.stringify({
        name: 'frontend',
        dependencies: { react: '^18.0.0' }
      }));
      
      // Backend (Go Gin)
      fs.writeFileSync(path.join(projectPath, 'backend', 'go.mod'), 'module backend\n\nrequire github.com/gin-gonic/gin v1.9.1');
      fs.writeFileSync(path.join(projectPath, 'backend', 'main.go'), 'package main');
      
      // Mobile (Rust Tauri)
      fs.writeFileSync(path.join(projectPath, 'mobile', 'Cargo.toml'), '[dependencies]\ntauri = "1.0"');
      fs.writeFileSync(path.join(projectPath, 'tauri.conf.json'), '{}');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'FullStackMonorepo',
        includeContent: false,
        platforms: ['linux']
      });

      expect(result.scripts.bash).toContain('npm install'); // React
      expect(result.scripts.bash).toContain('go mod init'); // Go
      expect(result.scripts.bash).toContain('cargo'); // Rust
    });
  });

  describe('Script format generation', () => {
    it('should generate all 12+ script formats for multi-language project', async () => {
      const projectPath = path.join(testDir, 'all-formats');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify({
        dependencies: { react: '^18.0.0' }
      }));
      fs.writeFileSync(path.join(projectPath, 'requirements.txt'), 'django==4.2.0');
      fs.writeFileSync(path.join(projectPath, 'go.mod'), 'module app\n\ngo 1.21');

      const result = await service.generateScaffold(projectPath, {
        projectName: 'AllFormatsApp',
        includeContent: false,
        platforms: ['windows', 'linux', 'macos']
      });

      // Verify all major script formats are generated
      expect(result.scripts).toHaveProperty('bash');
      expect(result.scripts).toHaveProperty('zsh');
      expect(result.scripts).toHaveProperty('powershell');
      expect(result.scripts).toHaveProperty('batch');
      expect(result.scripts).toHaveProperty('python');
      expect(result.scripts).toHaveProperty('node');
      
      // Each script should contain setup for all detected languages
      Object.values(result.scripts).forEach(script => {
        expect(typeof script).toBe('string');
        expect(script.length).toBeGreaterThan(0);
      });
    });
  });
});