@user: Simplify our test specs:

`decompose-task`, `multi-iteration`, `simple-task`, and `stuck-task` should all be a single spec:
- We want to assert that one task gets decomposed into several other tasks. Let's say 3.
- Set a max iteration of 3, which means the parent task and two child tasks get resolved. But there should be one left as open.
- One of the tasks shoudl explicitly say it is impossible and should be moved to stuck.

Let's also add a test spec for the empty case (no open issues).

Verify `pnpm test` passes with our new test cases.
