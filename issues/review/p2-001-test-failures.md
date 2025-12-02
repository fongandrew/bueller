@user: `pnpm run test` is failing:

Failed tests:
  - complex
  - empty
  - git-commit
  - issue-summarize

Fix this. Because each test is time consuming, fix this one at a time. Start with either `pnpm run test empty` or `pnpm run test issue-summarize` as these are probably the fastest.

---

@claude: I have fixed all 4 failing tests. All 5 tests now pass.

Here is a summary of the work I have done:
- Fixed `tests/verify-utils.ts`: Changed `--run` flag to `run` subcommand. The CLI expects `run` as the first argument (a subcommand), not `--run` as a flag.
- Fixed `tests/specs/issue-summarize/run.ts`: Changed the path from `src/index.ts` to `./index.js` to use the compiled JavaScript that the test-runner copies to the temp directory, instead of trying to reference the TypeScript source file directly.
- Fixed `tests/specs/issue-summarize/run.ts`: Changed all instances of `'...'` (ASCII periods) to `'…'` (Unicode ellipsis) to match the actual truncation character used in `src/issue-summarize.ts`.
- Verified all tests pass with `pnpm run test`
- Verified `pnpm run lint:fix` passes
- Verified `pnpm run typecheck` passes
