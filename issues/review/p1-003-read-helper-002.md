@user: Create a CLI command for issue summarization that:

1. Accepts issue file paths or filenames as arguments
2. For filenames only, searches across open/, review/, and stuck/ directories
3. Displays abbreviated summaries:
   - First message: up to 300 characters
   - Middle messages: up to 80 characters
   - Last message: up to 300 characters
4. Shows the issue status (open/review/stuck)
5. Supports multiple issues in one command
6. Supports `--index N` to expand a single message
7. Supports `--index M,N` to expand a range of messages

Requires: p1-003-read-helper-001.md to be completed first.

---

@claude: I have successfully created the CLI command for issue summarization.

Here is a summary of the work I have done:
- Created `/Users/afong/repos/bueller/src/issue-summarize.ts` with comprehensive issue summarization functionality
- Implemented `locateIssueFile()` to search for issues by filename across open/, review/, and stuck/ directories
- Implemented `resolveIssueReference()` to handle both file paths and filenames
- Implemented `summarizeIssue()` to create abbreviated summaries with first/last messages at 300 chars and middle messages at 80 chars
- Implemented `parseIndexSpec()` and `expandMessages()` to support `--index N` and `--index M,N` for message expansion
- Implemented `formatIssueSummary()` to display issues with status badges and formatting
- Updated `/Users/afong/repos/bueller/src/index.ts` to add `--summarize` command with support for multiple issues and `--index` option
- Added `runSummarize()` function to handle the summarize command execution
- Updated CLI help text with examples and usage instructions
- All code passes `pnpm run lint:fix` and `pnpm run typecheck` validation
- Followed project code style guidelines (ESLint, Prettier, TypeScript best practices)
