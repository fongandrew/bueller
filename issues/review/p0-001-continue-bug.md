@user: The --continue flag should only apply for the first agent run. So for the first iteration, we continue from the last session and pass a prompt of just "continue" or whatever the prompt was. But for the second iteration, it's always brand new context.

---

@claude: I have fixed the --continue flag behavior so it only applies to the first agent run.

Here is a summary of the work I have done:
- Modified the main loop in `src/index.ts` to check if it's the first iteration (iteration === 1)
- Changed the `runAgent` call to only pass `continueMode: true` when both `config.continueMode` is true AND it's the first iteration
- For subsequent iterations, `continueMode` will always be false, ensuring brand new context
- Verified the fix passes linting with `pnpm run lint:fix`
- Verified the fix passes type checking with `pnpm run typecheck`
