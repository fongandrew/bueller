# Test Times Out

Example error: `FAIL: Test timed out after 60 seconds`

This may be happening because the `timeoutMs` passed to the `runBueller` helper in `verify-utils.ts` is too low. The `bueller.output.txt` file will appear as if the output has suddently cutoff, but that is because the helper simply kills the process at the timeout.
