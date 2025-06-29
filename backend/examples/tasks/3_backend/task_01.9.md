# (Do not use terminal to populate files) Write the code for Log Service

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

(Do not use terminal to populate files) Write the code for the `ILogService` interface and its implementation, `LogService`. This service is responsible for reading and parsing log files to provide log entries to the API.

## Source File

- `3_backend/task_02.1.4_Populate_Services_Files.md`

## Content

---

### 1. (Do not use terminal to populate files) Write the code for `ILogService.cs`

**`Services/ILogService.cs`:**

```csharp
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models; // Assuming LogEntry is in backend.Models

namespace backend.Services
{
    public interface ILogService
    {
        Task<List<LogEntry>> GetLatestLogsAsync(
            int count = 100,
            string? level = null,
            DateTime? since = null
        );
    }
}
```

### 2. (Do not use terminal to populate files) Write the code for `LogService.cs`

**`Services/LogService.cs`:**

```csharp
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using backend.Models; // Assuming LogEntry is in backend.Models
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    public class LogService : ILogService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<LogService> _logger;
        private readonly string _logDirectory;

        public LogService(IWebHostEnvironment environment, ILogger<LogService> logger)
        {
            _environment = environment;
            _logger = logger;
            _logDirectory = Path.Combine(_environment.ContentRootPath, "Logs");
        }

        public async Task<List<LogEntry>> GetLatestLogsAsync(
            int count = 100,
            string? levelFilter = null,
            DateTime? since = null
        )
        {
            var logs = new List<LogEntry>();

            if (!Directory.Exists(_logDirectory))
            {
                _logger.LogWarning("Log directory not found: {LogDirectory}", _logDirectory);
                return logs;
            }

            var logFiles = Directory
                .GetFiles(_logDirectory, "log-*.txt") // Changed pattern
                .OrderByDescending(f => new FileInfo(f).LastWriteTime)
                .Take(3); // Changed to 3 files

            foreach (var logFile in logFiles)
            {
                if (logs.Count >= count)
                    break;

                try
                {
                    // Use FileShare.ReadWrite to allow reading while Serilog might be writing
                    using var fileStream = new FileStream(
                        logFile,
                        FileMode.Open,
                        FileAccess.Read,
                        FileShare.ReadWrite
                    );
                    using var reader = new StreamReader(fileStream);

                    string? line;
                    var fileLines = new List<string>();
                    while ((line = await reader.ReadLineAsync()) != null)
                    {
                        fileLines.Add(line);
                    }

                    // Process lines in reverse to get latest entries first from each file
                    for (int i = fileLines.Count - 1; i >= 0; i--)
                    {
                        if (logs.Count >= count)
                            break;

                        var entry = ParseLogLine(fileLines[i]);
                        if (entry != null)
                        {
                            if (since.HasValue && entry.Timestamp < since.Value)
                                continue; // Skip if older than 'since'
                            if (
                                !string.IsNullOrEmpty(levelFilter)
                                && !entry.Level.Equals(
                                    levelFilter,
                                    StringComparison.OrdinalIgnoreCase
                                )
                            )
                                continue; // Skip if level doesn't match

                            logs.Add(entry);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to read or parse log file: {LogFile}", logFile);
                }
            }

            return logs.OrderByDescending(e => e.Timestamp).Take(count).ToList();
        }

        private LogEntry? ParseLogLine(string line)
        {
            // Regex to capture: Timestamp, Level, Message
            // Example: 2023-10-27 10:30:00.123 +00:00 [INF] This is a log message.
            // Making timezone offset optional:
            var match = Regex.Match(
                line,
                @"^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{3})(?:\s+[\+\-]\d{2}:\d{2})?\s+\[(\w+)\]\s+(.*)$"
            );

            if (!match.Success)
            {
                // Try parsing simpler format if the first one fails (e.g. console output)
                // Example: info: Microsoft.Hosting.Lifetime[0] Application started.
                match = Regex.Match(line, @"^(\w+):\s*(.*)$"); // level: message
                if (match.Success)
                {
                    return new LogEntry
                    {
                        Timestamp = DateTime.UtcNow, // Placeholder, actual timestamp not in this format
                        Level = NormalizeLogLevel(match.Groups[1].Value),
                        Message = match.Groups[2].Value.Trim(),
                    };
                }
                _logger.LogTrace("Log line did not match expected format: {LogLine}", line);
                return null;
            }

            try
            {
                var timestampStr = match.Groups[1].Value;
                var level = NormalizeLogLevel(match.Groups[2].Value);
                var message = match.Groups[3].Value.Trim();

                // Skip verbose logs early if not desired (can be filtered later too)
                // if (level == "Verbose") return null;

                return new LogEntry
                {
                    Timestamp = DateTime.TryParse(timestampStr, out var ts)
                        ? ts
                        : DateTime.MinValue,
                    Level = level,
                    Message = message,
                    // Exception and Properties could be parsed if logs are structured (e.g., JSON)
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error parsing log line: {LogLine}", line);
                return null;
            }
        }

        private string NormalizeLogLevel(string level)
        {
            return level.ToUpperInvariant() switch
            {
                "INF" or "INFO" => "Information",
                "WRN" or "WARN" => "Warning",
                "ERR" or "ERROR" => "Error",
                "DBG" or "DEBUG" => "Debug",
                "VRB" or "VERBOSE" => "Verbose",
                "FTL" or "FATAL" => "Fatal",
                "TRC" or "TRACE" => "Trace",
                _ => level,
            };
        }
    }
}
```
