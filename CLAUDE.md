# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bueller Wheel (npm package: `bueller-wheel`) is a headless Claude Code issue processor that runs Claude Code in a loop to process issues from a directory queue. It's a wrapper around the `@anthropic-ai/claude-agent-sdk` that automates task execution based on markdown issue files.

## Directory Structure

- `issues/` - Issue queue directory (configurable via `--issues-dir`)
  - `open/` - Issues to be processed
  - `review/` - Completed issues
  - `stuck/` - Issues requiring human intervention
  - `prompt.md` - Custom prompt template (optional, defaults to built-in template)
- `faq/` - Frequently asked questions and troubleshooting guides (configurable via `--faq-dir`)
  - Contains markdown files with solutions to common problems
  - Referenced by the agent when encountering issues.
- `tests/` - Test suite
  - `specs/` - Test specifications with issues and verification scripts
  - `test-runner.ts` - Test harness
- `src/` - Source code
  - `index.ts` - Main entry point

## Code Style

- ESLint with TypeScript support
- Prettier for formatting
- Import sorting enforced (simple-import-sort plugin)
- Consistent type imports preferred (`type` keyword)
- Unused imports automatically removed
- Comma-dangle: always-multiline
- No circular dependencies allowed
