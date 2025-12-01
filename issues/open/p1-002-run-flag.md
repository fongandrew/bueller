@user: Do not automatically kick off the agent loop if no commands are passed. Rather, require one of these forms:

- `pnpm run dev --run`: Explicitly starts the loop with defaults
- `pnpm run dev --git`: Implicitly starts the loop
- `pnpm run dev --max 50`: Starts the loop with a specified max iterations (rename the current `--max-iterations` flag to just `max` for brevity)
- `pnpm run dev --continue`: Continues the loop with default prompt
- `pnpm run dev --continue "do this"`: Continues the loop with given prompt

Update the README.

Update tests. Make sure `pnpm test` passes.

