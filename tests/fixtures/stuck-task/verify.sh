#!/bin/bash
set -e

# Check that the issue was moved to stuck
if [ ! -f "issues/stuck/p1-001-impossible.md" ]; then
  echo "FAIL: Issue not moved to stuck directory"
  exit 1
fi

# Check that the issue is not in open
if [ -f "issues/open/p1-001-impossible.md" ]; then
  echo "FAIL: Issue still in open directory"
  exit 1
fi

# Check that there's a @claude response explaining why it's stuck
if ! grep -q "@claude:" "issues/stuck/p1-001-impossible.md"; then
  echo "FAIL: Issue does not have a @claude response"
  exit 1
fi

if ! grep -qi "stuck\|cannot\|unable\|impossible" "issues/stuck/p1-001-impossible.md"; then
  echo "FAIL: @claude response does not explain why it's stuck"
  exit 1
fi

echo "PASS: Task correctly marked as stuck"
exit 0
