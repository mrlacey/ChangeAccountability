# ChangeAccountability

ChangeAccountability is currently a minimal repository containing only basic documentation. This repository does not yet have any build system, dependencies, source code, or tests to run.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Current Repository State

**IMPORTANT**: This repository is currently minimal and contains only:
- README.md with basic project title
- No package.json, build files, or dependency management
- No source code or application to build/run
- No test framework or test files
- No CI/CD pipelines or automation
- No development dependencies or tooling setup

## Working Effectively

Since this repository currently has no build system or code:

- **DO NOT** attempt to run `npm install`, `npm build`, `npm test`, or similar package manager commands - they will fail as no package.json exists
- **DO NOT** look for build scripts, Makefile, or other build configuration - none exist currently
- **DO NOT** attempt to run or start any applications - there are none
- **DO NOT** look for test files or try to run tests - no testing framework is configured

### Repository Exploration
- View repository contents: `ls -la` (currently shows only README.md and .git/)
- Check git status: `git status`
- View README: `cat README.md`

### When Adding New Content
If you are adding new functionality to this repository:

1. **Choose appropriate technology stack** based on the project requirements
2. **Initialize package management** (e.g., `npm init` for Node.js, `pip init` for Python, etc.)
3. **Set up build system** appropriate for the chosen technology
4. **Configure testing framework** suitable for the project type
5. **Update these instructions** to reflect the new build, test, and run processes

## Validation

Since there is currently no code to validate:
- **DO NOT** attempt to build or run anything
- **DO NOT** run linting or formatting tools
- Ensure any new files you create follow appropriate naming conventions
- Verify git operations work correctly: `git status`, `git add .`, `git commit`

## Repository Structure

Current repository structure:
```
/
├── .git/                    # Git repository metadata
├── .github/                 # GitHub configuration
│   └── copilot-instructions.md  # This file
└── README.md               # Basic project documentation
```

## Common Tasks

### Adding New Features
When this repository evolves to include actual functionality:

1. **First, identify the technology stack** being used
2. **Update these instructions** with specific build, test, and run commands
3. **Add appropriate .gitignore** for the technology stack
4. **Set up CI/CD pipelines** in .github/workflows/
5. **Document dependencies and setup process**

### Git Operations
- Check repository status: `git status`
- View recent commits: `git log --oneline -10`
- Check for uncommitted changes: `git diff`

## Expected Timing
- Repository exploration: < 1 minute
- Git operations: < 30 seconds each
- File creation/editing: < 1 minute per file

**NEVER CANCEL** any operations in this minimal repository as they complete quickly.

## Future Development Notes

When this repository gains actual functionality, update these instructions to include:
- Exact commands for dependency installation with specific versions
- Complete build process with timing expectations and timeout values
- Test execution commands with expected duration
- Application startup and validation procedures
- Specific user scenarios to test after making changes
- Linting and formatting commands that must pass CI
- Manual validation steps for different types of changes

Remember to validate ALL commands before adding them to these instructions.