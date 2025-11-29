# End-to-End Tests

This directory contains end-to-end tests for the Bueller issue processor.

## Test Structure

```
tests/
├── fixtures/          # Test case definitions
│   ├── simple-task/
│   │   ├── setup/     # Initial issues directory structure
│   │   └── verify.sh  # Verification script
│   └── ...
├── run-test.sh        # Test runner script
└── README.md          # This file
```

## How Tests Work

1. Each test case is a directory under `fixtures/` containing:
   - `setup/` - A complete issues directory with pre-made markdown files
   - `verify.sh` - A script that verifies the test outcome

2. The test runner (`run-test.sh`):
   - Builds the bueller script (`npm run build`)
   - For each test case:
     - Creates a temporary directory (not git-tracked)
     - Copies the built script and test fixture into it
     - Runs bueller
     - Executes the verification script
     - Reports success/failure

3. Verification scripts should:
   - Check that issues moved to expected directories
   - Verify file contents if needed
   - Exit with code 0 for success, non-zero for failure

## Running Tests

```bash
# Run all tests
./tests/run-test.sh

# Run a specific test
./tests/run-test.sh simple-task
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

3. Create a verification script `verify.sh`:
   ```bash
   cat > tests/fixtures/my-test/verify.sh << 'EOF'
   #!/bin/bash
   set -e

   # Check that the issue was moved to review
   if [ ! -f "issues/review/p1-001-test.md" ]; then
     echo "FAIL: Issue not moved to review"
     exit 1
   fi

   echo "PASS: Issue correctly processed"
   exit 0
   EOF
   chmod +x tests/fixtures/my-test/verify.sh
   ```

## Example Test Cases

- `simple-task` - Basic task that should complete in one iteration
- `multi-iteration` - Task that requires multiple iterations
- `decompose` - Task that should be decomposed into sub-tasks
- `stuck` - Task that should fail and move to stuck
