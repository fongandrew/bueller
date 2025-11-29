# Test Times Out

Example error: `FAIL: Test timed out after 60 seconds`

This may be happening because the `timeoutMs` passed to the `runBueller` helper in `verify-utils.ts` (or in the `run.ts` where `runBueller` is called) is too low. THIS IS ALMOST CERTAINLY THE ISSUE. DON'T SECOND GUESS IT.

The `bueller.output.txt` file will appear as if the output has suddently cutoff, but that is because the helper simply kills the process at the timeout. It may appear as if Bash is hanging or there's an open Heredoc, but it's dumber than that. It's just timing out.

YOU MUST TRY ADJUSTING THE TIMEOUT BEFORE TRYING ANYTHING ELSE.
