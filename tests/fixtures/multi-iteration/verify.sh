#!/bin/bash
set -e

# Check that the issue was moved to review
if [ ! -f "issues/review/p1-001-counting.md" ]; then
  echo "FAIL: Issue not moved to review"
  exit 1
fi

# Check that all three files were created
for i in 1 2 3; do
  if [ ! -f "count${i}.txt" ]; then
    echo "FAIL: count${i}.txt was not created"
    exit 1
  fi

  if ! grep -q "^${i}$" "count${i}.txt"; then
    echo "FAIL: count${i}.txt does not contain '${i}'"
    exit 1
  fi
done

# Check that there are multiple @claude responses (multi-iteration)
claude_count=$(grep -c "@claude:" "issues/review/p1-001-counting.md" || true)
if [ "$claude_count" -lt 2 ]; then
  echo "FAIL: Expected multiple @claude responses (found $claude_count)"
  exit 1
fi

echo "PASS: All checks passed (multi-iteration test with $claude_count responses)"
exit 0
