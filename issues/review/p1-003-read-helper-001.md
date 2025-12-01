@user: Create a core issue reader utility that can parse issue markdown files and extract the conversation history. This utility should:

1. Parse issue files with the `@user:` and `@claude:` format
2. Extract each message as a separate entry
3. Return structured data with message metadata (index, author, content)
4. Handle edge cases (empty messages, malformed files, etc.)

This will be the foundation for the issue summarization tool.
---

@claude: I have successfully created the core issue reader utility at `/Users/afong/repos/bueller/src/issue-reader.ts`.

Here is a summary of the work I have done:
- Created a new TypeScript module `issue-reader.ts` with comprehensive parsing functionality
- Implemented `readIssue()` function to read and parse issue files from disk
- Implemented `parseIssueContent()` function to parse issue markdown content and extract conversation history
- Added support for parsing `@user:` and `@claude:` message format with proper section splitting (using `---` separator)
- Created structured `IssueMessage` interface with index, author, and content fields
- Created `ParsedIssue` interface to hold both parsed messages and raw content
- Implemented edge case handling for empty sections and malformed content (gracefully skips invalid sections)
- Added utility functions: `getLatestMessage()`, `getMessagesByAuthor()`, and `formatMessage()`
- All code passes `pnpm run lint:fix` and `pnpm run typecheck` validation
- Followed project code style guidelines (ESLint, Prettier, TypeScript best practices)
