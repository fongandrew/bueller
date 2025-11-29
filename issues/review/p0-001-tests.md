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
