# (Do not use terminal to populate files) Write the code for API Management Controller

### Rules

1.) **CONCISENESS CLAUSE** When replying use as few words as needed to explain, plan or analyze. Long winded replies waste time and tokens. No long explanations. Stick to the main points an keep it breif. Do not perform extra work or validation.

2.) **WORKSPACE DIRECTIVE** Before you write any code or run any terminal commands, Verify you are in the workspace. Do not create files or folders outside of the workspace. No other files are permitted to be created other than what is in the task files. Create files only where specified: frontend, backend, electron, (or root if main package.json).

3.) **COMMAND FORMATTING** Always use && to chain commands in terminal! Use tools properly when needed, especially: **read file, write to file, execute command, read multiple files, list files, new task and complete task.**

4.) **READ THE TASK FILE AND THEN SUMMARIZE** Summarize and list the steps in the task file in chat after you read it (**HIGH LEVEL SUMMARY ONLY - NO CODE, NO COMMANDS**). Then follow the steps **VERBATIM** in the **EXACT** order they appear in the task file. Read rules **VERBATIM**, and follow them explicitly. For efficiency, do not explain code or make overly verbose comments. Only spend a maximum of 10 seconds thinking.

5.) **IMPORTANT** you should stop to resolve build errors, missing files or missing imports.

6.) **FULL PATHS ONLY** Always confirm you are in the correct working directory first! When running terminal commands always use full paths for folders (e.g. cd C:/Projects/foo) to avoid errors.

7.) **READ FIRST DIRECTIVE** Read folders and files first before you write! File content is changed by the linter after you save. So before writing to a file you must read it first to get its latest content!

8.) Complete all work in the task file. Do not create or modify anything outside of these files.

9.) **TOOL USAGE CLAUSE** Always use the appropriate tools provided by the system for file operations. Specifically:

Use read_file to read files instead of command line utilities like type
Use write_to_file or insert_content to modify files
Use execute_command for running terminal commands Failing to use these tools properly may result in incomplete or incorrect task execution.

10.) **FINAL CHECKLIST** Always verify location before executing terminal commands. Use Full Paths: Always use full paths for directories when executing terminal commands. Resolve Terminal errors and syntax errors, ignore missing imports and do not create "placeholder" files unless instructed to do so. Do not create files or folders outside the workspace. **Only create files specified.**

## Objective

(Do not use terminal to populate files) Write the code for the `ApiManagementController`, which provides endpoints for monitoring and managing the API, including status checks, metrics, documentation retrieval, and log management.

## Source File

- `3_backend/task_02.1.8_Populate_Controllers_Files.md`

## Content

---

### 1. (Do not use terminal to populate files) Write the code for `ApiManagementController.cs`

**`Controllers/ApiManagementController.cs`:**

```csharp
using System; // For DateTime, ArgumentException, InvalidOperationException
using System.Collections.Generic; // For List
using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices; // For RuntimeInformation
using System.Threading.Tasks; // For Task
using backend.Models; // For LogEntry and ApiDocumentation
using backend.Services;
using Microsoft.AspNetCore.Hosting; // For IWebHostEnvironment
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration; // For IConfiguration
using Microsoft.Extensions.Logging; // For ILogger
using Serilog; // For static Log.Verbose

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApiManagementController : ControllerBase
    {
        private readonly ILogger<ApiManagementController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;
        private readonly IApiDocumentationService _apiDocumentationService;
        private readonly ILogService _logService;

        private static readonly DateTime _appStartTime = DateTime.UtcNow;

        public ApiManagementController(
            ILogger<ApiManagementController> logger,
            IConfiguration configuration,
            IWebHostEnvironment environment,
            IApiDocumentationService apiDocumentationService,
            ILogService logService
        )
        {
            _logger = logger;
            _configuration = configuration;
            _environment = environment;
            _apiDocumentationService = apiDocumentationService;
            _logService = logService;
        }

        /// <summary>
        /// Gets the current API status, including uptime, environment, and basic process info.
        /// </summary>
        /// <returns>An object containing API status information.</returns>
        [HttpGet("status")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        public IActionResult GetApiStatus()
        {
            var process = Process.GetCurrentProcess();
            var uptime = DateTime.UtcNow - _appStartTime;

            string? aspnetcoreUrls = null;
            try
            {
                aspnetcoreUrls =
                    _configuration["ASPNETCORE_URLS"]
                    ?? _configuration.GetSection("Kestrel:Endpoints:Http:Url").Value;
                if (string.IsNullOrEmpty(aspnetcoreUrls) && _environment.IsDevelopment())
                {
                    aspnetcoreUrls = "http://localhost:5001"; // Common dev default
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not determine ASPNETCORE_URLS from configuration.");
            }

            return Ok(
                new
                {
                    IsRunning = true,
                    ProcessId = process.Id,
                    Port = aspnetcoreUrls ?? "Not configured",
                    StartTime = _appStartTime,
                    MemoryUsageMB = process.WorkingSet64 / (1024 * 1024),
                    Environment = _environment.EnvironmentName,
                    Uptime = uptime.ToString(@"dd\.hh\:mm\:ss"),
                    Framework = RuntimeInformation.FrameworkDescription,
                    OS = RuntimeInformation.OSDescription,
                }
            );
        }

        /// <summary>
        /// Gets API usage metrics and statistics. (Placeholder)
        /// </summary>
        /// <returns>An object containing API metrics.</returns>
        [HttpGet("metrics")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        public IActionResult GetMetrics()
        {
            // Placeholder for actual metrics. In a real app, this would integrate with
            // a metrics collection system (e.g., Prometheus, Application Insights).
            var metrics = new
            {
                Timestamp = DateTime.UtcNow,
                TotalRequests = 12345, // Example data
                ErrorRate = 0.01, // Example data
                ActiveConnections = 50, // Example data
                EndpointHits = new Dictionary<string, int>
                {
                    { "/api/LlmModels", 1000 },
                    { "/api/ComparisonRecords", 500 },
                    { "/api/ApiManagement/status", 100 },
                },
            };
            return Ok(metrics);
        }

        /// <summary>
        /// Gets dynamically generated API documentation based on reflection.
        /// </summary>
        /// <returns>A comprehensive object representing the API's endpoints and their details.</returns>
        [HttpGet("documentation")]
        [ProducesResponseType(typeof(backend.Models.ApiDocumentation), StatusCodes.Status200OK)]
        public IActionResult GetApiDocumentation()
        {
            var documentation = _apiDocumentationService.GetApiDocumentation();
            return Ok(documentation);
        }

        /// <summary>
        /// Retrieves the latest log entries with optional filtering.
        /// </summary>
        /// <param name="count">The maximum number of log entries to retrieve (default: 100).</param>
        /// <param name="level">Optional: Filter logs by level (e.g., "Information", "Warning", "Error").</param>
        /// <param name="since">Optional: Retrieve logs since a specific UTC timestamp.</param>
        /// <returns>A list of log entries.</returns>
        [HttpGet("logs")]
        [ProducesResponseType(typeof(List<LogEntry>), StatusCodes.Status200OK)]
        public async Task<ActionResult<List<LogEntry>>> GetLogs(
            [FromQuery] int count = 100,
            [FromQuery] string? level = null,
            [FromQuery] DateTime? since = null
        )
        {
            var logs = await _logService.GetLatestLogsAsync(count, level, since);
            return Ok(logs);
        }

        /// <summary>
        /// Generates a test log entry at a specified level.
        /// </summary>
        /// <param name="level">The log level (e.g., "Information", "Warning", "Error", "Debug", "Verbose").</param>
        /// <param name="message">Optional: The log message. If not provided, a default message will be used.</param>
        /// <returns>A confirmation message.</returns>
        [HttpPost("test-log")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GenerateTestLog(
            [FromQuery] string level,
            [FromQuery] string? message = null // Made message optional with default handling
        )
        {
            var logMessage =
                message ?? $"This is a test log message at {level.ToUpperInvariant()} level.";

            switch (level.ToLowerInvariant())
            {
                case "information":
                    _logger.LogInformation(logMessage);
                    break;
                case "warning":
                    _logger.LogWarning(logMessage);
                    break;
                case "error":
                    _logger.LogError(logMessage);
                    break;
                case "debug":
                    _logger.LogDebug(logMessage);
                    break;
                case "verbose": // Serilog's static logger for Verbose if _logger isn't configured for it
                    Log.Verbose(logMessage);
                    break;
                case "trace": // Added trace as a common level
                    _logger.LogTrace(logMessage);
                    break;
                case "critical": // Added critical as a common level
                    _logger.LogCritical(logMessage);
                    break;
                default:
                    return BadRequest(
                        $"Invalid log level specified: '{level}'. Valid levels are: Information, Warning, Error, Debug, Verbose, Trace, Critical."
                    );
            }

            return Ok($"Test log generated at level: {level.ToUpperInvariant()}");
        }
    }
}
```
