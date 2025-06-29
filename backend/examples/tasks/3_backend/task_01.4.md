# (Do not use terminal to populate files) Write the code for Backend Configuration Files

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

## Objective

(Do not use terminal to populate files) Write the code for the C# files within the `backend/Configuration` directory with their required initial content.

## Source File

- `3_backend/task_02.1.1_Populate_Configuration_Files.md`

## Content

---

### 0. (Do not use terminal to populate files) Write the code for `GlobalExceptionMiddleware.cs`

**`Middleware/GlobalExceptionMiddleware.cs`:**

```csharp
using Microsoft.AspNetCore.Diagnostics;
using Serilog;

namespace backend.Middleware;

// /// <summary>
// /// Global exception handling middleware that catches unhandled exceptions
// /// </summary>
public static class GlobalExceptionMiddleware
{
    /// <summary>
    /// Configures global exception handling middleware.
    /// </summary>
    /// <param name="app">The web application.</param>
    public static void UseGlobalExceptionHandling(this WebApplication app)
    {
        app.UseExceptionHandler(appError =>
        {
            appError.Run(async context =>
            {
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/json";

                var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                if (contextFeature != null)
                {
                    // Log the exception using Serilog
                    Log.Error(
                        contextFeature.Error,
                        "Unhandled exception caught by global error handler."
                    );

                    await context.Response.WriteAsJsonAsync(
                        new
                        {
                            StatusCode = context.Response.StatusCode,
                            Message = contextFeature.Error.Message,
                        }
                    );
                }
            });
        });
    }
}
```

### 1. (Do not use terminal to populate files) Write the code for `LoggingConfiguration.cs`

**`Configuration/LoggingConfiguration.cs`:**

```csharp
using Serilog;

namespace backend.Configuration
{
    /// <summary>
    /// Configuration helper for Serilog logging setup.
    /// </summary>
    public static class LoggingConfiguration
    {
        /// <summary>
        /// Configures Serilog with console and file sinks, and sets up request logging.
        /// </summary>
        /// <param name="builder">The web application builder.</param>
        public static void ConfigureLogging(this WebApplicationBuilder builder)
        {
            // Configure Serilog
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Verbose()
                .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.Console(
                    outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}"
                )
                .WriteTo.File(
                    path: "Logs/log-.txt",
                    rollingInterval: RollingInterval.Day,
                    outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}"
                )
                .CreateLogger();

            builder.Host.UseSerilog();
        }

        /// <summary>
        /// Configures Serilog request logging middleware with enriched context.
        /// </summary>
        /// <param name="app">The web application.</param>
        public static void UseRequestLogging(this WebApplication app)
        {
            app.UseSerilogRequestLogging(options =>
            {
                options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
                {
                    diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
                    diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"]);
                };
            });
        }
    }
}
```

### 2. (Do not use terminal to populate files) Write the code for `DatabaseConfiguration.cs`

**`Configuration/DatabaseConfiguration.cs`:**

```csharp
using System;
using System.IO;
using backend.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace backend.Configuration
{
    /// <summary>
    /// Configuration helper for database setup and path management.
    /// </summary>
    public static class DatabaseConfiguration
    {
        /// <summary>
        /// Configures the database context with SQLite and appropriate database path.
        /// </summary>
        /// <param name="services">The service collection to configure.</param>
        /// <param name="environment">The web host environment.</param>
        public static void ConfigureDatabase(
            this IServiceCollection services,
            IWebHostEnvironment environment
        )
        {
            string dbPath = GetDatabasePath(environment);
            Log.Information("[DB_SETUP] Using database path: {DbPath}", dbPath);

            services.AddDbContext<ApplicationDbContext>(opts =>
                opts.UseSqlite($"Data Source={dbPath}")
            );
        }

        /// <summary>
        /// Determines the appropriate database path based on the current environment.
        /// </summary>
        /// <param name="environment">The web host environment.</param>
        /// <returns>The full path to the database file.</returns>
        public static string GetDatabasePath(IWebHostEnvironment environment)
        {
            string dbDirectory;
            string dbFileName = "app.db";

            if (environment.IsDevelopment())
            {
                // Development: /backend/Instance/app.db
                dbDirectory = Path.Combine(environment.ContentRootPath, "Instance");
            }
            else // Production or packaged Electron app
            {
                // Always use a user-writable location for the database
                // This ensures Entity Framework can create and migrate the database
                var appDataPath = Environment.GetFolderPath(
                    Environment.SpecialFolder.LocalApplicationData
                );
                var appName = "InsightLLM Studio"; // Use consistent app name

                // Create a proper application data folder structure
                dbDirectory = Path.Combine(appDataPath, appName, "Database");

                Log.Information(
                    "[DB_SETUP] Using application data directory: {DbDirectory}",
                    dbDirectory
                );
            }

            // Ensure directory exists with proper permissions
            EnsureDirectoryExists(dbDirectory);

            string dbPath = Path.Combine(dbDirectory, dbFileName);
            Log.Information("[DB_SETUP] Database path: {DbPath}", dbPath);

            return dbPath;
        }

        /// <summary>
        /// Ensures the database directory exists and creates it if necessary.
        /// </summary>
        /// <param name="dbDirectory">The database directory path.</param>
        /// <exception cref="Exception">Thrown when directory creation fails.</exception>
        private static void EnsureDirectoryExists(string dbDirectory)
        {
            try
            {
                if (!Directory.Exists(dbDirectory))
                {
                    Directory.CreateDirectory(dbDirectory);
                    Log.Information(
                        "[DB_SETUP] Created database directory: {DbDirectory}",
                        dbDirectory
                    );
                }
            }
            catch (Exception ex)
            {
                Log.Error(
                    ex,
                    "[DB_SETUP] Failed to create database directory: {DbDirectory}",
                    dbDirectory
                );
                throw;
            }
        }
    }
}
```

### 3. (Do not use terminal to populate files) Write the code for `SwaggerConfiguration.cs`

**`Configuration/SwaggerConfiguration.cs`:**

```csharp
using System.Reflection;
using Microsoft.OpenApi.Models;

namespace backend.Configuration
{
    /// <summary>
    /// Configuration helper for Swagger/OpenAPI documentation setup.
    /// </summary>
    public static class SwaggerConfiguration
    {
        /// <summary>
        /// Configures Swagger generation with API documentation.
        /// </summary>
        /// <param name="services">The service collection to configure.</param>
        public static void ConfigureSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc(
                    "v1",
                    new OpenApiInfo
                    {
                        Title = "LLM Comparison API",
                        Version = "v1",
                        Description = "API for comparing Large Language Models.",
                        Contact = new OpenApiContact
                        {
                            Name = "API Support",
                            Email = "support@example.com",
                        },
                    }
                );

                // Include XML comments in Swagger documentation
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                if (File.Exists(xmlPath))
                {
                    c.IncludeXmlComments(xmlPath);
                }
            });
        }

        /// <summary>
        /// Configures Swagger UI middleware with custom settings.
        /// </summary>
        /// <param name="app">The web application.</param>
        public static void UseSwaggerDocumentation(this WebApplication app)
        {
            // Swagger UI for all environments
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "LLM Comparison API v1");
                c.RoutePrefix = "swagger";
            });

            // Redirect root to Swagger
            app.MapGet("/", () => Results.Redirect("/swagger"));
        }
    }
}
```

### 4. (Do not use terminal to populate files) Write the code for `ServiceRegistration.cs`

**`Configuration/ServiceRegistration.cs`:**

```csharp
using backend.Data.Repositories;
using backend.Services;

namespace backend.Configuration
{
    /// <summary>
    /// Configuration helper for dependency injection service registration.
    /// </summary>
    public static class ServiceRegistration
    {
        /// <summary>
        /// Registers all application services and repositories for dependency injection.
        /// </summary>
        /// <param name="services">The service collection to configure.</param>
        public static void RegisterApplicationServices(this IServiceCollection services)
        {
            // Register repositories (Data layer)
            services.AddScoped<ILlmModelRepository, LlmModelRepository>();
            services.AddScoped<IComparisonRepository, ComparisonRepository>();

            // Register services (Business layer)
            services.AddScoped<ILlmModelService, LlmModelService>();
            services.AddScoped<IComparisonService, ComparisonService>();

            // Configure AutoMapper
            services.AddAutoMapper(typeof(MappingProfile));
        }
    }
}
```

### 5. (Do not use terminal to populate files) Write the code for `CorsConfiguration.cs`

**`Configuration/CorsConfiguration.cs`:**

```csharp
using Microsoft.AspNetCore.Builder;

// using Microsoft.AspNetCore.Cors.Infrastructure; // Not strictly needed for this version
// using Microsoft.Extensions.DependencyInjection; // Not strictly needed for this version

namespace backend.Configuration
{
    /// <summary>
    /// Configuration helper for CORS (Cross-Origin Resource Sharing) setup.
    /// </summary>
    public static class CorsConfiguration
    {
        // private const string CorsPolicyName = "ApiCorsPolicy"; // Not used in doc version

        /// <summary>
        /// Configures CORS policy to allow requests from frontend applications.
        /// </summary>
        // <param name="services">The service collection to configure.</param> // Changed to app
        /// <param name="app">The web application.</param>
        public static void ConfigureCors(this WebApplication app) // Changed from IServiceCollection to WebApplication
        {
            app.UseCors(policy => // Directly use app.UseCors
                policy
                    .WithOrigins("http://localhost:4200", "http://127.0.0.1:4200") // Updated ports from 5173 to 4200
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials() // Required for SignalR
            );

            // The UseCors extension method on WebApplication is now part of ConfigureCors directly.
            // /// <summary>
            // /// Configures CORS middleware to apply the defined policy.
            // /// </summary>
            // /// <param name="app">The web application.</param>
            // public static void UseCors(this WebApplication app)
            // {
            //     app.UseCors(CorsPolicyName);
            // }
        }
    }
}
```

### 6. (Do not use terminal to populate files) Write the code for `ApiInsightsConfiguration.cs`

**`Configuration/ApiInsightsConfiguration.cs`:**

```csharp
using backend.Hubs;
using backend.Services;
using backend.Sinks;
using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace backend.Configuration
{
    /// <summary>
    /// Configuration helper for API Insights feature setup.
    /// </summary>
    public static class ApiInsightsConfiguration
    {
        /// <summary>
        /// Registers API Insights services for dependency injection.
        /// </summary>
        /// <param name="services">The service collection to configure.</param>
        public static void RegisterApiInsightsServices(this IServiceCollection services)
        {
            // Register API Insights services
            services.AddScoped<IApiDocumentationService, ReflectionApiDocumentationService>();
            services.AddScoped<ILogService, LogService>();

            // Register SignalR
            services.AddSignalR();
        }

        /// <summary>
        /// Configures SignalR hubs and real-time logging.
        /// </summary>
        /// <param name="app">The web application.</param>
        public static void UseApiInsights(this WebApplication app)
        {
            // Map SignalR hub
            app.MapHub<LogHub>("/hubs/logs");
        }

        /// <summary>
        /// Reconfigures Serilog to include SignalR sink for real-time log streaming.
        /// </summary>
        /// <param name="app">The web application.</param>
        public static void ConfigureRealtimeLogging(this WebApplication app)
        {
            try
            {
                // Get the SignalR hub context
                var hubContext = app.Services.GetRequiredService<IHubContext<LogHub>>();

                // Reconfigure Serilog to include SignalR sink
                Log.Logger = new LoggerConfiguration()
                    .MinimumLevel.Verbose()
                    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Information)
                    .Enrich.FromLogContext()
                    .WriteTo.Console(
                        outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}"
                    )
                    .WriteTo.File(
                        path: "Logs/log-.txt",
                        rollingInterval: RollingInterval.Day,
                        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}"
                    )
                    .WriteTo.Sink(new SignalRSink(hubContext))
                    .CreateLogger();

                Log.Information("[API_INSIGHTS] Real-time logging configured with SignalR sink");
            }
            catch (Exception ex)
            {
                Log.Error(ex, "[API_INSIGHTS] Failed to configure real-time logging");
            }
        }
    }
}
```
