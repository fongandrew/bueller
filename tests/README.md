# End-to-End Tests

This directory contains end-to-end tests for the Bueller issue processor.

## Test Structure

```
tests/
├── fixtures/          # Test case definitions
│   ├── simple-task/
│   │   ├── setup/     # Initial issues directory structure
│   │   └── verify.ts  # Verification script (TypeScript)
│   └── ...
├── verify-utils.ts    # Shared utilities for verification scripts
└── README.md          # This file
```

Test runner is located at: `src/test-runner.ts`

## How Tests Work

1. Each test case is a directory under `fixtures/` containing:
   - `setup/` - A complete issues directory with pre-made markdown files
   - `verify.ts` - A TypeScript script that verifies the test outcome

2. The test runner (`src/test-runner.ts`):
   - Builds the bueller script (`npm run build`)
   - For each test case:
     - Creates a temporary directory in `.test-tmp/` (git-ignored)
     - Copies the built script and node_modules into it
     - Copies the test fixture
     - Runs bueller with a 60-second timeout and max 10 iterations
     - Executes the verification script using `tsx`
     - Reports success/failure

3. Verification scripts should:
   - Import utilities from `../../verify-utils.js`
   - Check that issues moved to expected directories
   - Verify file contents if needed
   - Throw `VerificationError` for failures
   - Call `pass()` for success

## Running Tests

```bash
# Run all tests
npm test

# Run a specific test
npm test simple-task
```

## Creating a New Test Case

1. Create a new directory under `fixtures/`:
   ```bash
   mkdir -p tests/fixtures/my-test/setup/open
   mkdir -p tests/fixtures/my-test/setup/review
   mkdir -p tests/fixtures/my-test/setup/stuck
   ```

2. Add issue files to `setup/open/`:
   ```bash
   echo "@user: Do something" > tests/fixtures/my-test/setup/open/p1-001-test.md
   ```

3. Create a verification script `verify.ts`:
   ```typescript
   import {
     assertFileExists,
     assertFileNotExists,
     assertFileContains,
     pass,
   } from '../../verify-utils.js';

   // Check that the issue was moved to review
   assertFileExists(
     'issues/review/p1-001-test.md',
     'FAIL: Issue not moved to review'
   );

   // Check that it's not in open anymore
   assertFileNotExists(
     'issues/open/p1-001-test.md',
     'FAIL: Issue still in open directory'
   );

   pass('Issue correctly processed');
   ```

## Available Verification Utilities

The `verify-utils.ts` module provides:

- `assertFileExists(path, message?)` - Assert a file exists
- `assertFileNotExists(path, message?)` - Assert a file does not exist
- `assertFileContains(path, search, message?)` - Assert a file contains a string
- `assertFileMatches(path, pattern, message?)` - Assert a file matches a regex
- `countInFile(path, search)` - Count occurrences of a string
- `assertCount(actual, expected, message?)` - Assert a count equals expected
- `assertCountAtLeast(actual, minimum, message?)` - Assert a count is at least minimum
- `pass(message)` - Print success message and exit

All assert functions throw `VerificationError` on failure.

## Example Test Cases

- `simple-task` - Basic task that should complete in one iteration
- `multi-iteration` - Task that requires multiple iterations
- `decompose-task` - Task that should be decomposed into sub-tasks
- `stuck-task` - Task that should fail and move to stuck
