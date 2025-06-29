# (Do not use terminal to populate files) Write the code for Comparison Service

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

(Do not use terminal to populate files) Write the code for the `IComparisonService` interface and its implementation, `ComparisonService`, which handle the business logic for managing comparison records between LLM models.

## Source File

- `3_backend/task_02.1.4_Populate_Services_Files.md`

## Content

---

### 1. (Do not use terminal to populate files) Write the code for `IComparisonService.cs`

**`Services/IComparisonService.cs`:**

```csharp
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Services.Dtos;

namespace backend.Services
{
    public interface IComparisonService
    {
        Task<IEnumerable<ComparisonRecordDto>> GetAllAsync();
        Task<ComparisonRecordDto?> GetByIdAsync(int id); // Stays nullable for controller logic
        Task<ComparisonRecordDto> AddAsync(CreateComparisonRecordDto recordDto);
        Task UpdateAsync(int id, UpdateComparisonRecordDto recordDto);
        Task DeleteAsync(int id);
    }
}
```

### 2. (Do not use terminal to populate files) Write the code for `ComparisonService.cs`

**`Services/ComparisonService.cs`:**

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using backend.Data.Models;
using backend.Data.Repositories;
using backend.Services.Dtos;

namespace backend.Services
{
    public class ComparisonService : IComparisonService
    {
        private readonly IComparisonRepository _repository;
        private readonly ILlmModelRepository _modelRepository;
        private readonly IMapper _mapper;

        public ComparisonService(
            IComparisonRepository repository,
            ILlmModelRepository modelRepository,
            IMapper mapper
        )
        {
            _repository = repository;
            _modelRepository = modelRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ComparisonRecordDto>> GetAllAsync()
        {
            var records = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ComparisonRecordDto>>(records);
        }

        public async Task<ComparisonRecordDto?> GetByIdAsync(int id)
        {
            try
            {
                // _repository.GetByIdAsync now throws InvalidOperationException if not found.
                var record = await _repository.GetByIdAsync(id);
                return _mapper.Map<ComparisonRecordDto>(record);
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
            {
                // Handle "not found" from repository by returning null, as per interface.
                return null;
            }
        }

        public async Task<ComparisonRecordDto> AddAsync(CreateComparisonRecordDto recordDto)
        {
            try
            {
                // Validate Model1Id exists by attempting to retrieve it.
                // _modelRepository.GetByIdAsync will throw InvalidOperationException if not found.
                await _modelRepository.GetByIdAsync(recordDto.Model1Id);
            }
            catch (InvalidOperationException) // Catches the specific exception from GetByIdAsync
            {
                throw new ArgumentException(
                    $"LLM Model with ID {recordDto.Model1Id} not found.",
                    nameof(recordDto.Model1Id)
                );
            }

            try
            {
                // Validate Model2Id exists
                await _modelRepository.GetByIdAsync(recordDto.Model2Id);
            }
            catch (InvalidOperationException)
            {
                throw new ArgumentException(
                    $"LLM Model with ID {recordDto.Model2Id} not found.",
                    nameof(recordDto.Model2Id)
                );
            }

            var record = _mapper.Map<ComparisonRecord>(recordDto);
            var createdRecord = await _repository.AddAsync(record);
            return _mapper.Map<ComparisonRecordDto>(createdRecord);
        }

        public async Task UpdateAsync(int id, UpdateComparisonRecordDto recordDto)
        {
            // Get existing record. If not found, repository's GetByIdAsync will throw.
            // Let this propagate or catch here if specific service handling is needed.
            // For now, assume controller handles NotFound if this throws.
            var existingRecord = await _repository.GetByIdAsync(id);

            // Validate and update Model1Id if provided and different
            if (recordDto.Model1Id.HasValue && recordDto.Model1Id.Value != existingRecord.Model1Id)
            {
                try
                {
                    await _modelRepository.GetByIdAsync(recordDto.Model1Id.Value);
                    existingRecord.Model1Id = recordDto.Model1Id.Value;
                }
                catch (InvalidOperationException)
                {
                    throw new ArgumentException(
                        $"LLM Model with ID {recordDto.Model1Id.Value} not found.",
                        nameof(recordDto.Model1Id)
                    );
                }
            }

            // Similar validation for Model2Id
            if (recordDto.Model2Id.HasValue && recordDto.Model2Id.Value != existingRecord.Model2Id)
            {
                try
                {
                    await _modelRepository.GetByIdAsync(recordDto.Model2Id.Value);
                    existingRecord.Model2Id = recordDto.Model2Id.Value;
                }
                catch (InvalidOperationException)
                {
                    throw new ArgumentException(
                        $"LLM Model with ID {recordDto.Model2Id.Value} not found.",
                        nameof(recordDto.Model2Id)
                    );
                }
            }

            _mapper.Map(recordDto, existingRecord); // Map other properties
            await _repository.UpdateAsync(existingRecord);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
```
