@user: Set up a way to implement end-to-end tests. We want a scenario of fixtures / test cases that are basically just different issue directory setups with pre-made markdown files. And in each of these directories, we have a verification script of some kind. To test, we build our bueller script, copy it + test case into some other location (not git-tracked), and then run it.

---

@claude: I have implemented a comprehensive end-to-end testing framework for Bueller.

Here is a summary of the work I have done:
- Created `tests/` directory with a complete testing infrastructure
- Implemented `tests/run-test.sh` - a bash-based test runner that:
  - Builds the project
  - Creates temporary test directories in `/tmp/bueller-tests` (not git-tracked)
  - Copies built scripts and node_modules to temp location
  - Runs bueller against each test fixture
  - Executes verification scripts to check outcomes
  - Reports pass/fail with color-coded output
  - Preserves test artifacts on failure for debugging
- Created four example test fixtures in `tests/fixtures/`:
  - `simple-task` - Tests basic task completion (create a file and COMPLETE)
  - `multi-iteration` - Tests CONTINUE behavior across multiple iterations
  - `decompose-task` - Tests DECOMPOSE into child issues
  - `stuck-task` - Tests STUCK handling for impossible tasks
- Each fixture includes:
  - `setup/` directory with pre-configured `open/`, `review/`, and `stuck/` subdirectories
  - Pre-made issue markdown files
  - `verify.sh` script that checks expected outcomes
- Added `npm test` script to package.json for easy test execution
- Created comprehensive documentation:
  - `tests/README.md` with detailed testing instructions
  - Updated main README.md with testing section
  - Included examples of how to create new test cases

The framework is ready to use. Run `npm test` to execute all tests, or `./tests/run-test.sh <test-name>` for a specific test.

---

@user: Let's try making the test runner + verification scripts TypeScript rather than Bash. Also, let's create our temp directory in this repo because it needs access to the Claude SDK node module.

---

@claude: I have converted the test framework from Bash to TypeScript.

Here is a summary of the work I have done:
- Created `src/test-runner.ts` - A TypeScript-based test runner that:
  - Builds the project using `npm run build`
  - Creates temporary test directories in `.test-tmp/` (git-ignored, inside the repo for node_modules access)
  - Copies built scripts and node_modules to each temp test directory
  - Runs bueller with 60-second timeout and max 10 iterations
  - Executes TypeScript verification scripts using `tsx`
  - Reports pass/fail with color-coded output
  - Preserves test artifacts on failure for debugging
- Created `tests/verify-utils.ts` - A shared utility module providing:
  - `assertFileExists()` / `assertFileNotExists()` - File existence checks
  - `assertFileContains()` / `assertFileMatches()` - Content verification
  - `countInFile()`, `assertCount()`, `assertCountAtLeast()` - Count helpers
  - `pass()` - Success message and exit
  - Custom `VerificationError` for clear failure messages
- Converted all 4 verification scripts from Bash to TypeScript:
  - `tests/fixtures/simple-task/verify.ts`
  - `tests/fixtures/multi-iteration/verify.ts`
  - `tests/fixtures/decompose-task/verify.ts`
  - `tests/fixtures/stuck-task/verify.ts`
- Updated `package.json` test script to use `tsx src/test-runner.ts`
- Updated `tsconfig.json` to include `tests/**/*` in compilation
- Updated `.gitignore` to exclude `.test-tmp/` directory
- Updated `tests/README.md` with comprehensive TypeScript documentation

The test framework is now fully TypeScript-based. Run `npm test` to execute all tests, or `npm test <test-name>` for a specific test.
