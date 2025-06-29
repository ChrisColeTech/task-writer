import { FrameworkDetectionService } from '../../services/FrameworkDetectionService';
import path from 'path';
import fs from 'fs';
import { createMockDirectoryStructure, cleanupMockDirectory } from '../setup';

describe('Multi-Language Framework Detection', () => {
  let service: FrameworkDetectionService;
  let testDir: string;

  beforeEach(() => {
    service = new FrameworkDetectionService();
    testDir = createMockDirectoryStructure();
  });

  afterEach(() => {
    cleanupMockDirectory(testDir);
  });

  describe('Python Framework Detection', () => {
    it('should detect Django project from requirements.txt and manage.py', async () => {
      const projectPath = path.join(testDir, 'django-project');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'requirements.txt'), 'Django==4.2.0\npsycopg2==2.9.5');
      fs.writeFileSync(path.join(projectPath, 'manage.py'), '#!/usr/bin/env python\nimport django');
      fs.writeFileSync(path.join(projectPath, 'settings.py'), 'INSTALLED_APPS = []');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'django')).toBe(true);
      expect(result.frameworks.find(f => f.name === 'django')?.confidence).toBeGreaterThan(0.9);
    });

    it('should detect Flask project from requirements.txt and app.py', async () => {
      const projectPath = path.join(testDir, 'flask-project');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'requirements.txt'), 'Flask==2.3.0\nFlask-SQLAlchemy==3.0.0');
      fs.writeFileSync(path.join(projectPath, 'app.py'), 'from flask import Flask\napp = Flask(__name__)');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'flask')).toBe(true);
    });

    it('should detect FastAPI project from pyproject.toml', async () => {
      const projectPath = path.join(testDir, 'fastapi-project');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'pyproject.toml'), `
[tool.poetry.dependencies]
python = "^3.8"
fastapi = "^0.100.0"
uvicorn = "^0.23.0"
      `);
      fs.writeFileSync(path.join(projectPath, 'main.py'), 'from fastapi import FastAPI\napp = FastAPI()');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'fastapi')).toBe(true);
    });

    it('should detect Jupyter project from notebook files', async () => {
      const projectPath = path.join(testDir, 'jupyter-project');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'requirements.txt'), 'jupyter==1.0.0\nnumpy==1.24.0\npandas==2.0.0');
      fs.writeFileSync(path.join(projectPath, 'analysis.ipynb'), '{"cells": [], "metadata": {}}');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'jupyter')).toBe(true);
    });
  });

  describe('Rust Framework Detection', () => {
    it('should detect Actix-web project from Cargo.toml', async () => {
      const projectPath = path.join(testDir, 'actix-project');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'Cargo.toml'), `
[package]
name = "actix-web-app"
version = "0.1.0"

[dependencies]
actix-web = "4.0"
tokio = { version = "1.0", features = ["full"] }
      `);
      fs.writeFileSync(path.join(projectPath, 'src', 'main.rs'), 'use actix_web::{web, App, HttpServer};');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'actix-web')).toBe(true);
    });

    it('should detect Tauri project from Cargo.toml and tauri.conf.json', async () => {
      const projectPath = path.join(testDir, 'tauri-project');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'src-tauri'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'src-tauri', 'Cargo.toml'), `
[package]
name = "tauri-app"
version = "0.1.0"

[dependencies]
tauri = { version = "1.0", features = ["api-all"] }
      `);
      fs.writeFileSync(path.join(projectPath, 'tauri.conf.json'), '{"package": {"productName": "Tauri App"}}');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'tauri')).toBe(true);
    });

    it('should detect Bevy game engine project', async () => {
      const projectPath = path.join(testDir, 'bevy-project');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'Cargo.toml'), `
[package]
name = "bevy-game"
version = "0.1.0"

[dependencies]
bevy = "0.11"
      `);
      fs.writeFileSync(path.join(projectPath, 'src', 'main.rs'), 'use bevy::prelude::*;');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'bevy')).toBe(true);
    });
  });

  describe('.NET Framework Detection', () => {
    it('should detect ASP.NET Core project from .csproj', async () => {
      const projectPath = path.join(testDir, 'aspnet-project');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'WebApp.csproj'), `
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.App" />
  </ItemGroup>
</Project>
      `);
      fs.writeFileSync(path.join(projectPath, 'Program.cs'), 'var builder = WebApplication.CreateBuilder(args);');
      fs.writeFileSync(path.join(projectPath, 'appsettings.json'), '{"Logging": {}}');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'aspnet-core')).toBe(true);
    });

    it('should detect Blazor WASM project', async () => {
      const projectPath = path.join(testDir, 'blazor-project');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'wwwroot'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'BlazorApp.csproj'), `
<Project Sdk="Microsoft.NET.Sdk.BlazorWebAssembly">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Components.WebAssembly" Version="8.0.0" />
  </ItemGroup>
</Project>
      `);
      fs.writeFileSync(path.join(projectPath, 'App.razor'), '@using Microsoft.AspNetCore.Components.Routing');
      fs.writeFileSync(path.join(projectPath, 'wwwroot', 'index.html'), '<div id="app">Loading...</div>');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'blazor-wasm')).toBe(true);
    });

    it('should detect MAUI project', async () => {
      const projectPath = path.join(testDir, 'maui-project');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'Platforms'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'MauiApp.csproj'), `
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFrameworks>net8.0-android;net8.0-ios</TargetFrameworks>
    <UseMaui>true</UseMaui>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Maui.Controls" Version="8.0.0" />
  </ItemGroup>
</Project>
      `);
      fs.writeFileSync(path.join(projectPath, 'MauiProgram.cs'), 'public static class MauiProgram');
      fs.writeFileSync(path.join(projectPath, 'MainPage.xaml'), '<ContentPage>');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'maui')).toBe(true);
    });
  });

  describe('Go Framework Detection', () => {
    it('should detect Gin project from go.mod', async () => {
      const projectPath = path.join(testDir, 'gin-project');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'go.mod'), `
module gin-app

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
)
      `);
      fs.writeFileSync(path.join(projectPath, 'main.go'), `
package main

import "github.com/gin-gonic/gin"

func main() {
    r := gin.Default()
    r.Run()
}
      `);

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'gin')).toBe(true);
    });

    it('should detect Echo project', async () => {
      const projectPath = path.join(testDir, 'echo-project');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'go.mod'), `
module echo-app

go 1.21

require (
    github.com/labstack/echo/v4 v4.11.1
)
      `);
      fs.writeFileSync(path.join(projectPath, 'main.go'), 'import "github.com/labstack/echo/v4"');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'echo')).toBe(true);
    });

    it('should detect Cobra CLI project', async () => {
      const projectPath = path.join(testDir, 'cobra-project');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'cmd'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'go.mod'), `
module cli-tool

go 1.21

require (
    github.com/spf13/cobra v1.7.0
)
      `);
      fs.writeFileSync(path.join(projectPath, 'cmd', 'root.go'), 'import "github.com/spf13/cobra"');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'cobra')).toBe(true);
    });
  });

  describe('Java Framework Detection', () => {
    it('should detect Spring Boot project from pom.xml', async () => {
      const projectPath = path.join(testDir, 'spring-project');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'src', 'main', 'java'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'pom.xml'), `
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
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
      fs.writeFileSync(path.join(projectPath, 'application.properties'), 'server.port=8080');
      fs.writeFileSync(path.join(projectPath, 'src', 'main', 'java', 'Application.java'), '@SpringBootApplication');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'spring-boot')).toBe(true);
    });

    it('should detect Gradle project from build.gradle', async () => {
      const projectPath = path.join(testDir, 'gradle-project');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'build.gradle'), `
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.1.0'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
}
      `);
      fs.writeFileSync(path.join(projectPath, 'gradlew'), '#!/bin/bash');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'gradle')).toBe(true);
    });

    it('should detect Android project from AndroidManifest.xml', async () => {
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
      fs.writeFileSync(path.join(projectPath, 'app', 'src', 'main', 'AndroidManifest.xml'), `
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:label="@string/app_name">
        <activity android:name=".MainActivity">
        </activity>
    </application>
</manifest>
      `);

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'android')).toBe(true);
    });

    it('should detect Quarkus project', async () => {
      const projectPath = path.join(testDir, 'quarkus-project');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'src', 'main', 'java'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'pom.xml'), `
<project>
    <dependencies>
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-resteasy</artifactId>
        </dependency>
    </dependencies>
</project>
      `);
      fs.writeFileSync(path.join(projectPath, 'application.properties'), 'quarkus.http.port=8080');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'quarkus')).toBe(true);
    });
  });

  describe('Project Type Classification', () => {
    it('should correctly classify backend projects', async () => {
      const projectPath = path.join(testDir, 'backend-test');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'requirements.txt'), 'Django==4.2.0');
      fs.writeFileSync(path.join(projectPath, 'manage.py'), '#!/usr/bin/env python');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.projectType).toBe('backend');
    });

    it('should correctly classify mobile projects', async () => {
      const projectPath = path.join(testDir, 'mobile-test');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'app', 'src', 'main'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'app', 'src', 'main', 'AndroidManifest.xml'), '<manifest></manifest>');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.projectType).toBe('mobile');
    });

    it('should correctly classify desktop projects', async () => {
      const projectPath = path.join(testDir, 'desktop-test');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'src-tauri'), { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'tauri.conf.json'), '{}');
      fs.writeFileSync(path.join(projectPath, 'src-tauri', 'Cargo.toml'), '[dependencies]\ntauri = "1.0"');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.projectType).toBe('desktop');
    });

    it('should correctly classify data-science projects', async () => {
      const projectPath = path.join(testDir, 'datascience-test');
      fs.mkdirSync(projectPath, { recursive: true });
      
      fs.writeFileSync(path.join(projectPath, 'requirements.txt'), 'jupyter==1.0.0\nnumpy==1.24.0\npandas==2.0.0');
      fs.writeFileSync(path.join(projectPath, 'analysis.ipynb'), '{}');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.projectType).toBe('data-science');
    });
  });

  describe('Multi-language project detection', () => {
    it('should detect multiple languages in monorepo', async () => {
      const projectPath = path.join(testDir, 'monorepo');
      fs.mkdirSync(projectPath, { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'frontend'), { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'backend'), { recursive: true });
      fs.mkdirSync(path.join(projectPath, 'mobile'), { recursive: true });
      
      // Frontend (React)
      fs.writeFileSync(path.join(projectPath, 'frontend', 'package.json'), JSON.stringify({
        dependencies: { react: '^18.0.0' }
      }));
      
      // Backend (Python Django)
      fs.writeFileSync(path.join(projectPath, 'backend', 'requirements.txt'), 'Django==4.2.0');
      fs.writeFileSync(path.join(projectPath, 'backend', 'manage.py'), '#!/usr/bin/env python');
      
      // Mobile (Rust Tauri)
      fs.writeFileSync(path.join(projectPath, 'mobile', 'Cargo.toml'), '[dependencies]\ntauri = "1.0"');

      const result = await service.detectFrameworks(projectPath);
      
      expect(result.frameworks.some(f => f.name === 'react')).toBe(true);
      expect(result.frameworks.some(f => f.name === 'django')).toBe(true);
      expect(result.frameworks.some(f => f.name === 'tauri')).toBe(true);
      expect(result.projectType).toBe('fullstack');
    });
  });
});