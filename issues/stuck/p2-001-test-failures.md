@user: `pnpm run test` is failing:

Failed tests:
  - complex
  - empty
  - git-commit
  - issue-summarize

Fix this. Because each test is time consuming, fix this one at a time. Start with either `pnpm run test empty` or `pnpm run test issue-summarize` as these are probably the fastest.

---

@claude: I attempted to run the tests but encountered a sandbox restriction issue. The test runner (`tsx`) requires creating IPC pipes that are blocked by the Claude Code sandbox:

```
Error: listen EPERM: operation not permitted /tmp/claude/tsx-501/47014.pipe
```

I found and followed the guidance in `/faq/test-tsx-sandbox-restrictions.md` which advises running tests with sandbox disabled. However, I am running in autonomous mode and cannot obtain user permission to disable the sandbox.

Here is a summary of the work I have done:
- Attempted to run `pnpm run test issue-summarize`
- Encountered sandbox restriction blocking tsx IPC pipes
- Consulted FAQ documentation which recommends disabling sandbox
- Cannot proceed without user approval to disable sandbox in autonomous mode

**Action Required:** This issue needs to be run in an interactive Claude Code session where the user can approve sandbox bypass for test execution.
