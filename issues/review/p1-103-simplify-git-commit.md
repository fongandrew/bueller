@user Simplify so we can either `--git` or `--git-commit` to enable git commit behavior for task completion.

---

@claude: I have simplified the git commit flag options to support both `--git` and `--git-commit`.

Here is a summary of the work I have done:
- Updated the `parseArgs()` function in `src/bueller.ts` to accept both `--git` and `--git-commit` flags
- Both flags now enable the same git auto-commit behavior
- Verified with `pnpm run lint:fix` - passed
- Verified with `pnpm run typecheck` - passed
