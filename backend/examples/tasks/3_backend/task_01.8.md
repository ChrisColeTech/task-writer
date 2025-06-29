# (Do not use terminal to populate files) Write the code for API Documentation Service

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

(Do not use terminal to populate files) Write the code for the `IApiDocumentationService` interface and its reflection-based implementation, `ReflectionApiDocumentationService`. This service is responsible for dynamically generating documentation for the API's endpoints.

## Source File

- `3_backend/task_02.1.4_Populate_Services_Files.md`

## Content

---

### 1. (Do not use terminal to populate files) Write the code for `IApiDocumentationService.cs`

**`Services/IApiDocumentationService.cs`:**

```csharp
using backend.Models; // For ApiDocumentation DTO from backend.Models

namespace backend.Services
{
    public interface IApiDocumentationService
    {
        ApiDocumentation GetApiDocumentation(); // Returns ApiDocumentation from backend.Models
    }
}
```

### 2. (Do not use terminal to populate files) Write the code for `ReflectionApiDocumentationService.cs`

**`Services/ReflectionApiDocumentationService.cs`:**

```csharp
using System.Linq; // Added for Linq methods
using System.Reflection;
using backend.Models; // For ApiDocumentation, ApiEndpointGroup, ApiEndpointInfo
using backend.Services.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Logging; // Added for ILogger (optional, but good practice)

namespace backend.Services
{
    public class ReflectionApiDocumentationService : IApiDocumentationService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<ReflectionApiDocumentationService> _logger; // Optional logger

        public ReflectionApiDocumentationService(
            IWebHostEnvironment environment,
            ILogger<ReflectionApiDocumentationService> logger
        )
        {
            _environment = environment;
            _logger = logger;
        }

        public ApiDocumentation GetApiDocumentation() // Changed to return ApiDocumentation
        {
            var discoveredEndpoints = DiscoverEndpoints();
            var groupedEndpoints = discoveredEndpoints
                .GroupBy(e => e.Category ?? "General")
                .Select(g => new ApiEndpointGroup
                {
                    Name = g.Key,
                    Description = $"Endpoints related to {g.Key}", // Basic description
                    Endpoints = g.ToList(),
                })
                .ToList();

            return new ApiDocumentation
            {
                ApiVersion = "1.0.0", // Example version
                GeneratedAt = DateTime.UtcNow,
                Groups = groupedEndpoints,
                Metadata = new Dictionary<string, object>
                {
                    { "Environment", _environment.EnvironmentName },
                },
            };
        }

        private List<ApiEndpointInfo> DiscoverEndpoints()
        {
            var endpoints = new List<ApiEndpointInfo>();

            var controllerTypes = Assembly
                .GetExecutingAssembly()
                .GetTypes()
                .Where(t =>
                    t.IsSubclassOf(typeof(ControllerBase))
                    && !t.IsAbstract
                    && t.GetCustomAttribute<ApiControllerAttribute>() != null
                );

            foreach (var controllerType in controllerTypes)
            {
                var controllerName = controllerType.Name.Replace("Controller", "");
                var routePrefix = GetRoutePrefix(controllerType, controllerName);

                var methods = controllerType
                    .GetMethods(
                        BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly
                    )
                    .Where(m =>
                        m.IsPublic
                        && !m.IsSpecialName
                        && m.GetCustomAttributes<HttpMethodAttribute>().Any()
                    );

                foreach (var method in methods)
                {
                    var httpMethodAttribute = GetHttpMethodAttribute(method);
                    if (httpMethodAttribute == null)
                        continue;

                    var endpoint = new ApiEndpointInfo
                    {
                        Method = GetHttpMethod(httpMethodAttribute),
                        Path = BuildPath(routePrefix, httpMethodAttribute, controllerName, method),
                        Description = GetMethodDescription(method), // Placeholder
                        Service = controllerName,
                        Category = GetControllerCategory(controllerType),
                        RequiresAuth = HasAuthAttribute(method, controllerType),
                        ExamplePayload = GetExamplePayload(method, httpMethodAttribute),
                        ExampleResponse = GetExampleResponse(method, controllerName),
                    };

                    endpoints.Add(endpoint);
                }
            }
            return endpoints
                .OrderBy(e => e.Category)
                .ThenBy(e => e.Path)
                .ThenBy(e => e.Method)
                .ToList();
        }

        private string GetRoutePrefix(Type controllerType, string controllerName)
        {
            var routeAttribute = controllerType.GetCustomAttribute<RouteAttribute>();
            if (routeAttribute?.Template != null)
            {
                return routeAttribute.Template.Replace(
                    "[controller]",
                    controllerName.ToLowerInvariant()
                );
            }
            return $"api/{controllerName.ToLowerInvariant()}";
        }

        private HttpMethodAttribute? GetHttpMethodAttribute(MethodInfo method)
        {
            return method.GetCustomAttributes<HttpMethodAttribute>().FirstOrDefault();
        }

        private string GetHttpMethod(HttpMethodAttribute attribute)
        {
            return attribute switch
            {
                HttpGetAttribute => "GET",
                HttpPostAttribute => "POST",
                HttpPutAttribute => "PUT",
                HttpDeleteAttribute => "DELETE",
                HttpPatchAttribute => "PATCH",
                _ => attribute.HttpMethods.FirstOrDefault() ?? "UNKNOWN",
            };
        }

        private string BuildPath(
            string routePrefix,
            HttpMethodAttribute attribute,
            string controllerName,
            MethodInfo method
        )
        {
            var template = attribute.Template;
            if (string.IsNullOrEmpty(template)) // e.g. HttpGet() on a method
            {
                // Check for parameters to append, e.g. {id}
                var methodParams = method.GetParameters();
                var routeParams = methodParams
                    .Where(p =>
                        p.GetCustomAttribute<FromRouteAttribute>() != null
                        || (
                            p.GetCustomAttribute<FromBodyAttribute>() == null
                            && p.GetCustomAttribute<FromQueryAttribute>() == null
                            && p.GetCustomAttribute<FromServicesAttribute>() == null
                            && p.GetCustomAttribute<FromHeaderAttribute>() == null
                        )
                    )
                    .Select(p => $"{{{p.Name}}}");
                template = string.Join("/", routeParams);
            }

            template = template?.Replace("[controller]", controllerName.ToLowerInvariant()) ?? "";
            var fullPath = $"/{routePrefix}/{template}".Replace("//", "/").TrimEnd('/');
            if (string.IsNullOrEmpty(fullPath))
                return "/";
            return fullPath;
        }

        private string GetMethodDescription(MethodInfo method)
        {
            // Basic description, could be enhanced with XML comments or custom attributes
            return $"Handles {GetHttpMethod(GetHttpMethodAttribute(method)!)} requests for {method.Name}.";
        }

        private string GetControllerCategory(Type controllerType)
        {
            var apiExplorerSettings =
                controllerType.GetCustomAttribute<ApiExplorerSettingsAttribute>();
            return apiExplorerSettings?.GroupName ?? controllerType.Name.Replace("Controller", "");
        }

        private bool HasAuthAttribute(MethodInfo method, Type controllerType)
        {
            return method.GetCustomAttribute<AuthorizeAttribute>() != null
                || controllerType.GetCustomAttribute<AuthorizeAttribute>() != null;
        }

        private object? GetExamplePayload(MethodInfo method, HttpMethodAttribute httpAttribute)
        {
            if (httpAttribute is HttpGetAttribute || httpAttribute is HttpDeleteAttribute)
                return null;

            var bodyParameter = method
                .GetParameters()
                .FirstOrDefault(p => p.GetCustomAttribute<FromBodyAttribute>() != null);

            if (bodyParameter == null)
                return null;
            var parameterType = bodyParameter.ParameterType;

            try
            {
                if (parameterType == typeof(CreateLlmModelDto))
                    return new CreateLlmModelDto
                    {
                        Name = "GPT-4",
                        Developer = "OpenAI",
                        ReleaseDate = new DateTime(2023, 3, 14),
                        ParameterCount = 1800000000000,
                        IsOpenSource = false,
                        Description = "Example model",
                    };
                if (parameterType == typeof(UpdateLlmModelDto))
                    return new UpdateLlmModelDto
                    {
                        Name = "GPT-4-Turbo",
                        Version = "turbo-2024-04-09",
                    };
                if (parameterType == typeof(CreateComparisonRecordDto))
                    return new CreateComparisonRecordDto
                    {
                        Model1Id = 1,
                        Model2Id = 2,
                        Task = "Summarization",
                        Model1Score = 0.85,
                        Model2Score = 0.90,
                        ComparisonDate = DateTime.UtcNow.Date,
                        ComparedBy = "Admin",
                    };
                if (parameterType == typeof(UpdateComparisonRecordDto))
                    return new UpdateComparisonRecordDto
                    {
                        Notes = "Updated with new findings.",
                        Model1Score = 0.88,
                    };
                if (
                    parameterType == typeof(string)
                    && bodyParameter.Name?.ToLower().Contains("message") == true
                )
                    return "Sample log message content.";

                if (
                    parameterType.IsClass
                    && !parameterType.IsAbstract
                    && GetParameterlessConstructor(parameterType) != null
                )
                    return Activator.CreateInstance(parameterType);
            }
            catch (Exception ex)
            {
                _logger?.LogWarning(
                    ex,
                    "Failed to create example payload for type {ParameterType}",
                    parameterType.FullName
                );
            }
            return new
            { /* generic payload for other types */
                type = parameterType.Name,
            };
        }

        private object? GetExampleResponse(MethodInfo method, string controllerName)
        {
            var returnType = method.ReturnType;
            Type? actualReturnType = null;

            if (returnType.IsGenericType)
            {
                if (returnType.GetGenericTypeDefinition() == typeof(Task<>))
                    actualReturnType = returnType.GetGenericArguments()[0];
                else if (returnType.GetGenericTypeDefinition() == typeof(ActionResult<>))
                    actualReturnType = returnType.GetGenericArguments()[0];
                else
                    actualReturnType = returnType; // e.g. IEnumerable<T>
            }
            else if (returnType == typeof(Task) || returnType == typeof(void))
            {
                // For 204 No Content or similar
                if (
                    method
                        .GetCustomAttributes<ProducesResponseTypeAttribute>()
                        .Any(a => a.StatusCode == 204)
                )
                    return null;
                return new { message = "Operation successful." };
            }
            else if (returnType == typeof(IActionResult))
            {
                // Try to infer from ProducesResponseTypeAttribute
                var produces = method
                    .GetCustomAttributes<ProducesResponseTypeAttribute>()
                    .FirstOrDefault();
                if (produces?.Type != null && produces.Type != typeof(void))
                    actualReturnType = produces.Type;
                else // Fallback for generic IActionResult
                    return GetInferredResponse(method.Name, controllerName, 200);
            }
            else
            {
                actualReturnType = returnType;
            }

            if (actualReturnType == null)
                return GetInferredResponse(method.Name, controllerName, 200);

            try
            {
                if (actualReturnType == typeof(LlmModelDto))
                    return new LlmModelDto
                    {
                        Id = 1,
                        Name = "GPT-3.5",
                        Developer = "OpenAI",
                        CreatedAt = DateTime.UtcNow.AddDays(-10),
                        UpdatedAt = DateTime.UtcNow.AddDays(-1),
                        ReleaseDate = new DateTime(2022, 1, 1),
                        ParameterCount = 175000000000,
                        IsOpenSource = false,
                    };
                if (
                    actualReturnType == typeof(IEnumerable<LlmModelDto>)
                    || actualReturnType == typeof(List<LlmModelDto>)
                )
                    return new List<LlmModelDto>
                    {
                        new LlmModelDto
                        {
                            Id = 1,
                            Name = "GPT-3.5",
                            Developer = "OpenAI",
                            CreatedAt = DateTime.UtcNow.AddDays(-10),
                            UpdatedAt = DateTime.UtcNow.AddDays(-1),
                            ReleaseDate = new DateTime(2022, 1, 1),
                            ParameterCount = 175000000000,
                            IsOpenSource = false,
                        },
                    };
                if (actualReturnType == typeof(ComparisonRecordDto))
                    return new ComparisonRecordDto
                    {
                        Id = 1,
                        Model1Id = 1,
                        Model1Name = "GPT-3.5",
                        Model2Id = 2,
                        Model2Name = "Claude 2",
                        Task = "Translation",
                        Model1Score = 0.7,
                        Model2Score = 0.75,
                        CreatedAt = DateTime.UtcNow.AddHours(-5),
                        UpdatedAt = DateTime.UtcNow.AddHours(-1),
                        ComparisonDate = DateTime.UtcNow.Date,
                    };
                if (
                    actualReturnType == typeof(IEnumerable<ComparisonRecordDto>)
                    || actualReturnType == typeof(List<ComparisonRecordDto>)
                )
                    return new List<ComparisonRecordDto>
                    {
                        new ComparisonRecordDto
                        {
                            Id = 1,
                            Model1Id = 1,
                            Model1Name = "GPT-3.5",
                            Model2Id = 2,
                            Model2Name = "Claude 2",
                            Task = "Translation",
                            Model1Score = 0.7,
                            Model2Score = 0.75,
                            CreatedAt = DateTime.UtcNow.AddHours(-5),
                            UpdatedAt = DateTime.UtcNow.AddHours(-1),
                            ComparisonDate = DateTime.UtcNow.Date,
                        },
                    };

                if (
                    actualReturnType.IsClass
                    && !actualReturnType.IsAbstract
                    && GetParameterlessConstructor(actualReturnType) != null
                )
                    return Activator.CreateInstance(actualReturnType);
            }
            catch (Exception ex)
            {
                _logger?.LogWarning(
                    ex,
                    "Failed to create example response for type {ActualReturnType}",
                    actualReturnType.FullName
                );
            }
            return GetInferredResponse(method.Name, controllerName, 200, actualReturnType.Name);
        }

        private static ConstructorInfo? GetParameterlessConstructor(Type type)
        {
            return type.GetConstructor(
                BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic,
                null,
                Type.EmptyTypes,
                null
            );
        }

        private object GetInferredResponse(
            string methodName,
            string controllerName,
            int statusCode,
            string? typeName = null
        )
        {
            if (controllerName == "ApiManagement")
            {
                switch (methodName.ToLower())
                {
                    case "getapistatus":
                        return new
                        {
                            IsRunning = true,
                            Port = 5001,
                            StartTime = DateTime.UtcNow.AddHours(-1),
                            Environment = _environment.EnvironmentName,
                        };
                    case "getmetrics":
                        return new
                        {
                            Timestamp = DateTime.UtcNow,
                            Memory = new { WorkingSet = Environment.WorkingSet / (1024 * 1024) },
                        }; // MB
                    case "getapidocumentation":
                        return new { message = "ApiDocumentation object returned (see schema)" };
                    case "generatetestlog":
                        return new { message = "Test log generated successfully." };
                    case "getlogs":
                        return new { message = "List of LogEntry objects returned (see schema)" };
                }
            }

            if (
                methodName.StartsWith("Create", StringComparison.OrdinalIgnoreCase)
                || methodName.StartsWith("Add", StringComparison.OrdinalIgnoreCase)
            )
                return new
                {
                    id = new Random().Next(1, 1000),
                    message = $"{typeName ?? "Resource"} created successfully.",
                };
            if (methodName.StartsWith("Update", StringComparison.OrdinalIgnoreCase))
                return new { message = $"{typeName ?? "Resource"} updated successfully." };
            if (
                methodName.StartsWith("Delete", StringComparison.OrdinalIgnoreCase)
                || methodName.StartsWith("Remove", StringComparison.OrdinalIgnoreCase)
            )
                return new { message = $"{typeName ?? "Resource"} deleted successfully." };
            if (
                methodName.StartsWith("Get", StringComparison.OrdinalIgnoreCase)
                && (typeName != null)
            )
                return new { message = $"Returning {typeName}" };

            return new
            {
                status = statusCode,
                message = "Operation completed.",
                type = typeName ?? "object",
            };
        }
    }
}
```
