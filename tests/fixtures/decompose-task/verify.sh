#!/bin/bash
set -e

# Check that the parent issue was moved to review
if [ ! -f "issues/review/p1-001-complex.md" ]; then
  echo "FAIL: Parent issue not moved to review"
  exit 1
fi

# Check that child issues were created (they might be in open or review)
child_count=0
for suffix in "-001" "-002" "-003"; do
  if [ -f "issues/open/p1-001-complex${suffix}.md" ] || [ -f "issues/review/p1-001-complex${suffix}.md" ]; then
    child_count=$((child_count + 1))
  fi
done

if [ "$child_count" -lt 3 ]; then
  echo "FAIL: Expected 3 child issues, found $child_count"
  exit 1
fi

# Check that the parent issue has a @claude response mentioning decomposition
if ! grep -qi "decompos" "issues/review/p1-001-complex.md"; then
  echo "FAIL: Parent issue does not mention decomposition"
  exit 1
fi

echo "PASS: Task successfully decomposed into $child_count child issues"
exit 0
