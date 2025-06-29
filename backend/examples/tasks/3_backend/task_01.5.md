# (Do not use terminal to populate files) Write the code for Backend Data Access and Model Files

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

(Do not use terminal to populate files) Write the code for the C# files within the `backend/Data` directory and its subdirectories (`Models`, `Repositories`) with their required initial content.

## Source File

- `3_backend/task_02.1.3_Populate_Data_Files.md`

## Content

---

### 1. (Do not use terminal to populate files) Write the code for `ApplicationDbContext.cs`

**`Data/ApplicationDbContext.cs`:**

```csharp
using backend.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        // Constructor receives options configured in Program.cs
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        // DbSet properties represent tables in the database
        public DbSet<LlmModel> LlmModels { get; set; }
        public DbSet<ComparisonRecord> ComparisonRecords { get; set; }

        // Configure entity mappings beyond what Data Annotations can do
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Example of Fluent API configuration (if needed):
            // modelBuilder.Entity<ComparisonRecord>()
            //     .HasOne(c => c.Model1)
            //     .WithMany()
            //     .HasForeignKey(c => c.Model1Id)
            //     .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
```

### 2. (Do not use terminal to populate files) Write the code for `DataSeeder.cs`

**`Data/DataSeeder.cs`:**

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using backend.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace backend.Data
{
    public static class DataSeeder
    {
        public static void SeedData(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var logger = scope.ServiceProvider.GetRequiredService<
                    ILogger<ApplicationDbContext>
                >();

                try
                {
                    // Check if database exists and can be connected to
                    if (context.Database.CanConnect())
                    {
                        logger.LogInformation("Database exists and can connect");

                        // Check if there are pending migrations
                        var pendingMigrations = context.Database.GetPendingMigrations();
                        if (pendingMigrations.Any())
                        {
                            logger.LogInformation(
                                "Applying {Count} pending migrations",
                                pendingMigrations.Count()
                            );
                            context.Database.Migrate();
                        }
                        else
                        {
                            logger.LogInformation("No pending migrations");
                        }
                    }
                    else
                    {
                        logger.LogInformation(
                            "Database does not exist, creating and applying migrations"
                        );
                        context.Database.Migrate(); // This will create the database and apply all migrations
                    }

                    // Seed data if needed
                    if (!context.LlmModels.Any()) // Check if LlmModels table is empty
                    {
                        logger.LogInformation("Seeding LLM models data");
                        var llmModels = GetPredefinedLlmModels(); // Private method to get predefined models
                        context.LlmModels.AddRange(llmModels);
                        context.SaveChanges();
                        logger.LogInformation("Seeded {Count} LLM models", llmModels.Count);
                    }
                    else
                    {
                        logger.LogInformation("LLM models data already exists, skipping seed");
                    }
                    // Could add seeding for ComparisonRecords here if needed
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error during database initialization and seeding");
                    throw;
                }
            }
        }

        // Method to get predefined LLM models for seeding
        private static List<LlmModel> GetPredefinedLlmModels()
        {
            return new List<LlmModel>
            {
                new LlmModel
                {
                    Name = "GPT-4",
                    Developer = "OpenAI",
                    ReleaseDate = new DateTime(2023, 3, 14),
                    Description =
                        "A large multimodal model that can solve difficult problems with greater accuracy than previous models.",
                    Version = "1.0",
                    License = "Commercial",
                    Modality = "Text, Vision",
                    ParameterCount = 1800000000000, // 1.8 trillion (estimated)
                    TrainingDatasetSize = "Undisclosed",
                    Architecture = "Transformer",
                    UseCases = "Complex reasoning, code generation, creative content",
                    Strengths = "Strong reasoning, general knowledge, multimodal capabilities",
                    Weaknesses = "Hallucinations, limited knowledge cutoff",
                    ProjectUrl = "https://openai.com/gpt-4",
                    PaperUrl = "https://arxiv.org/abs/2303.08774",
                    IsOpenSource = false,
                },
                new LlmModel
                {
                    Name = "Claude 3 Opus",
                    Developer = "Anthropic",
                    ReleaseDate = new DateTime(2024, 3, 4),
                    Description =
                        "Most powerful model from Anthropic, designed to be helpful, harmless, and honest",
                    Version = "3.0",
                    License = "Commercial",
                    Modality = "Text, Vision",
                    ParameterCount = 1000000000000, // 1 trillion (estimated)
                    TrainingDatasetSize = "Undisclosed",
                    Architecture = "Transformer",
                    UseCases =
                        "Advanced reasoning, accurate content generation, research assistance",
                    Strengths = "Accuracy, safety, adherence to values",
                    Weaknesses = "Limited tool use",
                    ProjectUrl = "https://www.anthropic.com/claude",
                    PaperUrl = "https://www.anthropic.com/research",
                    IsOpenSource = false,
                },
                // Additional seed models...
            };
        }
    }
}
```

### 4. (Do not use terminal to populate files) Write the code for Repository Interfaces

**`Data/Repositories/ILlmModelRepository.cs`:**

```csharp
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Data.Models;

namespace backend.Data.Repositories
{
    public interface ILlmModelRepository
    {
        Task<IEnumerable<LlmModel>> GetAllAsync();
        Task<LlmModel> GetByIdAsync(int id); // Corrected to non-nullable
        Task<LlmModel> AddAsync(LlmModel model);
        Task UpdateAsync(LlmModel model);
        Task DeleteAsync(int id);
    }
}
```

**`Data/Repositories/IComparisonRepository.cs`:**

```csharp
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Data.Models;

namespace backend.Data.Repositories
{
    public interface IComparisonRepository
    {
        Task<IEnumerable<ComparisonRecord>> GetAllAsync();
        Task<ComparisonRecord> GetByIdAsync(int id); // Corrected to non-nullable
        Task<ComparisonRecord> AddAsync(ComparisonRecord record);
        Task UpdateAsync(ComparisonRecord record);
        Task DeleteAsync(int id);
    }
}
```

### 5. (Do not use terminal to populate files) Write the code for Repository Implementations

**`Data/Repositories/LlmModelRepository.cs`:**

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repositories
{
    public class LlmModelRepository : ILlmModelRepository
    {
        private readonly ApplicationDbContext _context;

        public LlmModelRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LlmModel>> GetAllAsync()
        {
            return await _context.LlmModels.ToListAsync();
        }

        public async Task<LlmModel> GetByIdAsync(int id) // Corrected to non-nullable and throws
        {
            return await _context.LlmModels.FindAsync(id)
                ?? throw new InvalidOperationException($"LlmModel with id {id} not found");
        }

        public async Task<LlmModel> AddAsync(LlmModel model)
        {
            // Set audit timestamps
            model.CreatedAt = DateTime.UtcNow;
            model.UpdatedAt = DateTime.UtcNow;

            // Add to context
            _context.LlmModels.Add(model);

            // Save changes to generate ID
            await _context.SaveChangesAsync();

            // Return the model with generated ID
            return model;
        }

        public async Task UpdateAsync(LlmModel model)
        {
            var existingModel = await _context.LlmModels.FindAsync(model.Id);

            if (existingModel != null)
            {
                // Update all scalar properties
                _context.Entry(existingModel).CurrentValues.SetValues(model);

                // Update the timestamp
                existingModel.UpdatedAt = DateTime.UtcNow;

                // Save changes
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var model = await _context.LlmModels.FindAsync(id);

            if (model != null)
            {
                _context.LlmModels.Remove(model);
                await _context.SaveChangesAsync();
            }
        }
    }
}
```

**`Data/Repositories/ComparisonRepository.cs`:**

```csharp
using System;
using System.Collections.Generic;
using System.Linq; // Added for FirstOrDefaultAsync
using System.Threading.Tasks;
using backend.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repositories
{
    public class ComparisonRepository : IComparisonRepository
    {
        private readonly ApplicationDbContext _context;

        public ComparisonRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ComparisonRecord>> GetAllAsync()
        {
            return await _context
                .ComparisonRecords.Include(c => c.Model1) // Eager load first model
                .Include(c => c.Model2) // Eager load second model
                .ToListAsync();
        }

        public async Task<ComparisonRecord> GetByIdAsync(int id) // Corrected to non-nullable and throws
        {
            return await _context
                    .ComparisonRecords.Include(c => c.Model1)
                    .Include(c => c.Model2)
                    .FirstOrDefaultAsync(c => c.Id == id)
                ?? throw new InvalidOperationException($"ComparisonRecord with id {id} not found");
        }

        public async Task<ComparisonRecord> AddAsync(ComparisonRecord record)
        {
            // Set audit timestamps
            record.CreatedAt = DateTime.UtcNow;
            record.UpdatedAt = DateTime.UtcNow;

            // Add to context
            _context.ComparisonRecords.Add(record);

            // Save changes to generate ID
            await _context.SaveChangesAsync();

            // Reload with navigations to get model names
            return await GetByIdAsync(record.Id); // GetByIdAsync now returns non-nullable or throws
        }

        public async Task UpdateAsync(ComparisonRecord record)
        {
            var existingRecord = await _context.ComparisonRecords.FindAsync(record.Id);

            if (existingRecord != null)
            {
                // Update all scalar properties
                _context.Entry(existingRecord).CurrentValues.SetValues(record);

                // Update timestamp
                existingRecord.UpdatedAt = DateTime.UtcNow;

                // Save changes
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var record = await _context.ComparisonRecords.FindAsync(id);

            if (record != null)
            {
                _context.ComparisonRecords.Remove(record);
                await _context.SaveChangesAsync();
            }
        }
    }
}
```
