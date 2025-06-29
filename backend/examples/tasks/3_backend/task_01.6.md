# (Do not use terminal to populate files) Write the code for LLM Model Service

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

(Do not use terminal to populate files) Write the code for the `ILlmModelService` interface and its implementation, `LlmModelService`, which are responsible for the business logic related to LLM models.

## Source File

- `3_backend/task_02.1.4_Populate_Services_Files.md`

## Content

---

### 1. (Do not use terminal to populate files) Write the code for `ILlmModelService.cs`

**`Services/ILlmModelService.cs`:**

```csharp
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Services.Dtos;

namespace backend.Services
{
    public interface ILlmModelService
    {
        Task<IEnumerable<LlmModelDto>> GetAllAsync();
        Task<LlmModelDto> GetByIdAsync(int id); // Changed to non-nullable
        Task<LlmModelDto> AddAsync(CreateLlmModelDto modelDto);
        Task UpdateAsync(int id, UpdateLlmModelDto modelDto);
        Task DeleteAsync(int id);
    }
}
```

### 2. (Do not use terminal to populate files) Write the code for `LlmModelService.cs`

**`Services/LlmModelService.cs`:**

```csharp
using System; // Added for InvalidOperationException
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using backend.Data.Models;
using backend.Data.Repositories;
using backend.Services.Dtos;

namespace backend.Services
{
    public class LlmModelService : ILlmModelService
    {
        private readonly ILlmModelRepository _repository;
        private readonly IMapper _mapper;

        public LlmModelService(ILlmModelRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<LlmModelDto>> GetAllAsync()
        {
            var models = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<LlmModelDto>>(models);
        }

        public async Task<LlmModelDto> GetByIdAsync(int id) // Changed to non-nullable
        {
            // Repository GetByIdAsync now throws if not found.
            // The controller will catch this and return NotFound.
            var model = await _repository.GetByIdAsync(id);
            return _mapper.Map<LlmModelDto>(model);
        }

        public async Task<LlmModelDto> AddAsync(CreateLlmModelDto modelDto)
        {
            var model = _mapper.Map<LlmModel>(modelDto);
            var createdModel = await _repository.AddAsync(model);
            return _mapper.Map<LlmModelDto>(createdModel);
        }

        public async Task UpdateAsync(int id, UpdateLlmModelDto modelDto)
        {
            // Repository GetByIdAsync throws if not found, which will propagate
            // and be handled by the controller (e.g., as a 404 or 500 if not caught specifically).
            // Or, we can catch it here if specific service-level error handling is needed.
            // For now, let it propagate as per simpler doc version.
            var existingModel = await _repository.GetByIdAsync(id);
            // if (existingModel != null) // This check is redundant if GetByIdAsync throws
            // {
            _mapper.Map(modelDto, existingModel);
            await _repository.UpdateAsync(existingModel);
            // }
        }

        public async Task DeleteAsync(int id)
        {
            // Repository DeleteAsync handles non-existent ID gracefully (does nothing).
            await _repository.DeleteAsync(id);
        }
    }
}
```
