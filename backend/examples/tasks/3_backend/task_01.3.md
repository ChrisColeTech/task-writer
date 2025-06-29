# (Do not use terminal to populate files) Write the code for AutoMapper Mapping Profile

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

(Do not use terminal to populate files) Write the code for the `MappingProfile` class, which defines the object-to-object mapping configurations used by AutoMapper to convert between data models and DTOs.

## Source File

- `3_backend/task_02.1.4_Populate_Services_Files.md`

## Content

---

### 1. (Do not use terminal to populate files) Write the code for `MappingProfile.cs`

**`Services/MappingProfile.cs`:**

```csharp
using System;
using AutoMapper;
using backend.Data.Models;
using backend.Services.Dtos;

namespace backend.Services
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // LlmModel mappings
            CreateMap<LlmModel, LlmModelDto>();
            CreateMap<CreateLlmModelDto, LlmModel>();
            CreateMap<UpdateLlmModelDto, LlmModel>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // ComparisonRecord mappings
            CreateMap<ComparisonRecord, ComparisonRecordDto>()
                .ForMember(dest => dest.Model1Name, opt => opt.MapFrom(src => src.Model1.Name))
                .ForMember(dest => dest.Model2Name, opt => opt.MapFrom(src => src.Model2.Name));

            CreateMap<CreateComparisonRecordDto, ComparisonRecord>()
                .ForMember(
                    dest => dest.ComparisonDate,
                    opt => opt.MapFrom(src => src.ComparisonDate ?? DateTime.UtcNow)
                );

            CreateMap<UpdateComparisonRecordDto, ComparisonRecord>()
                .ForMember(dest => dest.Model1Id, opt => opt.Ignore()) // Handled in service
                .ForMember(dest => dest.Model2Id, opt => opt.Ignore()) // Handled in service
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
```

### 1. (Do not use terminal to populate files) Write the code for `LogHub.cs`

**`Hubs/LogHub.cs`:**

```csharp
using backend.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace backend.Hubs
{
    public class LogHub : Hub
    {
        private readonly ILogger<LogHub> _logger;
        private readonly ILogService _logService;

        public LogHub(ILogger<LogHub> logger, ILogService logService)
        {
            _logger = logger;
            _logService = logService;
        }

        public override async Task OnConnectedAsync()
        {
            _logger.LogInformation($"Client connected: {Context.ConnectionId}");
            await Clients.Caller.SendAsync("Connected", Context.ConnectionId);

            // Send latest logs to newly connected client
            await RequestLatestLogs(50);

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _logger.LogInformation($"Client disconnected: {Context.ConnectionId}");
            await base.OnDisconnectedAsync(exception);
        }

        public async Task RequestLatestLogs(int count = 100)
        {
            try
            {
                var logs = await _logService.GetLatestLogsAsync(count);

                foreach (var log in logs.OrderBy(l => l.Timestamp))
                {
                    await Clients.Caller.SendAsync("ReceiveLog", log);
                }

                _logger.LogInformation($"Sent {logs.Count} logs to client {Context.ConnectionId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending latest logs to client");
                await Clients.Caller.SendAsync("Error", "Failed to retrieve logs");
            }
        }
    }
}
```

### 1. (Do not use terminal to populate files) Write the code for `SignalRSink.cs`

**`Sinks/SignalRSink.cs`:**

```csharp
using backend.Hubs;
using Microsoft.AspNetCore.SignalR;
using Serilog.Core;
using Serilog.Events;

namespace backend.Sinks
{
    public class SignalRSink : ILogEventSink
    {
        private readonly IHubContext<LogHub> _hubContext;
        private readonly IFormatProvider? _formatProvider;

        public SignalRSink(IHubContext<LogHub> hubContext, IFormatProvider? formatProvider = null)
        {
            _hubContext = hubContext;
            _formatProvider = formatProvider;
        }

        public void Emit(LogEvent logEvent)
        {
            // Skip verbose logs
            if (logEvent.Level < LogEventLevel.Debug)
            {
                return;
            }

            var message = logEvent.RenderMessage(_formatProvider);
            var logData = new
            {
                timestamp = logEvent.Timestamp.ToUniversalTime(),
                level = logEvent.Level.ToString(),
                message = message,
                exception = logEvent.Exception?.ToString(),
                properties = logEvent.Properties.ToDictionary(p => p.Key, p => p.Value.ToString()),
            };

            // Send to all connected clients asynchronously
            Task.Run(async () =>
            {
                try
                {
                    await _hubContext.Clients.All.SendAsync("ReceiveLog", logData);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending log via SignalR: {ex.Message}");
                }
            });
        }
    }
}
```
