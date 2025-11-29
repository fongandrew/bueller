#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
FIXTURES_DIR="$SCRIPT_DIR/fixtures"
TEMP_BASE="/tmp/bueller-tests"

# Parse arguments
SPECIFIC_TEST=""
if [ $# -gt 0 ]; then
  SPECIFIC_TEST="$1"
fi

# Build the project
echo "Building bueller..."
cd "$PROJECT_ROOT"
npm run build

if [ ! -f "$PROJECT_ROOT/dist/bueller.js" ]; then
  echo -e "${RED}FAIL: Build did not produce dist/bueller.js${NC}"
  exit 1
fi

echo -e "${GREEN}Build successful${NC}\n"

# Clean up old test runs
rm -rf "$TEMP_BASE"
mkdir -p "$TEMP_BASE"

# Track results
TOTAL=0
PASSED=0
FAILED=0
declare -a FAILED_TESTS

# Function to run a single test
run_test() {
  local test_name="$1"
  local test_dir="$FIXTURES_DIR/$test_name"

  if [ ! -d "$test_dir" ]; then
    echo -e "${RED}ERROR: Test directory not found: $test_dir${NC}"
    return 1
  fi

  if [ ! -f "$test_dir/verify.sh" ]; then
    echo -e "${RED}ERROR: verify.sh not found in $test_dir${NC}"
    return 1
  fi

  echo -e "${YELLOW}Running test: $test_name${NC}"

  # Create temp directory for this test
  local test_temp="$TEMP_BASE/$test_name"
  mkdir -p "$test_temp"

  # Copy the built script
  cp "$PROJECT_ROOT/dist/bueller.js" "$test_temp/"
  cp -r "$PROJECT_ROOT/node_modules" "$test_temp/"

  # Copy the test fixture
  if [ -d "$test_dir/setup" ]; then
    cp -r "$test_dir/setup" "$test_temp/issues"
  else
    echo -e "${RED}ERROR: setup directory not found in $test_dir${NC}"
    return 1
  fi

  # Run bueller in the test directory
  cd "$test_temp"

  # Set a timeout and capture output
  local output_file="$test_temp/bueller.output.txt"
  local exit_code=0

  # Run with a timeout of 60 seconds and max 10 iterations
  timeout 60s node bueller.js --issues-dir ./issues --max-iterations 10 > "$output_file" 2>&1 || exit_code=$?

  if [ $exit_code -eq 124 ]; then
    echo -e "${RED}TIMEOUT: Test took longer than 60 seconds${NC}"
    TOTAL=$((TOTAL + 1))
    FAILED=$((FAILED + 1))
    FAILED_TESTS+=("$test_name (timeout)")
    return 1
  fi

  # Run verification script
  cd "$test_temp"
  if bash "$test_dir/verify.sh"; then
    echo -e "${GREEN}PASS: $test_name${NC}\n"
    TOTAL=$((TOTAL + 1))
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}FAIL: $test_name${NC}"
    echo "Output saved to: $output_file"
    echo ""
    TOTAL=$((TOTAL + 1))
    FAILED=$((FAILED + 1))
    FAILED_TESTS+=("$test_name")
    return 1
  fi
}

# Run tests
if [ -n "$SPECIFIC_TEST" ]; then
  # Run specific test
  run_test "$SPECIFIC_TEST"
else
  # Run all tests
  echo "Discovering tests in $FIXTURES_DIR..."

  if [ ! -d "$FIXTURES_DIR" ]; then
    echo -e "${RED}ERROR: Fixtures directory not found: $FIXTURES_DIR${NC}"
    exit 1
  fi

  test_count=0
  for test_dir in "$FIXTURES_DIR"/*; do
    if [ -d "$test_dir" ]; then
      test_name=$(basename "$test_dir")
      run_test "$test_name"
      test_count=$((test_count + 1))
    fi
  done

  if [ $test_count -eq 0 ]; then
    echo -e "${YELLOW}WARNING: No test fixtures found in $FIXTURES_DIR${NC}"
    echo "Create test fixtures to get started. See tests/README.md for details."
    exit 0
  fi
fi

# Print summary
echo "================================"
echo "Test Results"
echo "================================"
echo "Total:  $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"

if [ $FAILED -gt 0 ]; then
  echo ""
  echo "Failed tests:"
  for test in "${FAILED_TESTS[@]}"; do
    echo "  - $test"
  done
  echo ""
  echo "Test artifacts preserved in: $TEMP_BASE"
  exit 1
else
  echo ""
  echo -e "${GREEN}All tests passed!${NC}"
  exit 0
fi
