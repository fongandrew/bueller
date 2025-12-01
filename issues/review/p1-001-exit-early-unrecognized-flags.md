@user: Exit early with the help text if there are unrecognized flags. `pnpm run dev --foobar` should *not* kick off the loop.

---

@claude: I have implemented the feature to exit early with help text when unrecognized flags are provided.

Here is a summary of the work I have done:
- Added a `recognizedFlags` Set to the `parseArgs()` function containing all valid flags
- Added validation logic that iterates through all arguments and checks if any that start with `-` are unrecognized
- When an unrecognized flag is detected, the program now prints an error message in red, shows the help text, and exits with code 1
- Verified that `pnpm run lint:fix` passes (fixed ESLint preference for `for-of` loop)
- Verified that `pnpm run typecheck` passes
- Tested that `node dist/index.js --foobar` correctly exits with error and shows help
- Tested that normal flags like `--help` continue to work correctly
