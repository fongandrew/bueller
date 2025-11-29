#!/bin/bash
set -e

# Check that the issue was moved to review
if [ ! -f "issues/review/p1-001-hello.md" ]; then
  echo "FAIL: Issue not moved to review"
  exit 1
fi

# Check that the issue is not in open anymore
if [ -f "issues/open/p1-001-hello.md" ]; then
  echo "FAIL: Issue still in open directory"
  exit 1
fi

# Check that hello.txt was created
if [ ! -f "hello.txt" ]; then
  echo "FAIL: hello.txt was not created"
  exit 1
fi

# Check that hello.txt has the correct content
if ! grep -q "Hello, World!" hello.txt; then
  echo "FAIL: hello.txt does not contain 'Hello, World!'"
  exit 1
fi

# Check that the issue file has a @claude response
if ! grep -q "@claude:" "issues/review/p1-001-hello.md"; then
  echo "FAIL: Issue does not have a @claude response"
  exit 1
fi

echo "PASS: All checks passed"
exit 0
