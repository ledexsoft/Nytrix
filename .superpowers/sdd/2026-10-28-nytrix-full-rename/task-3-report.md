# Task 3 report — CLI, client, protocol, and distribution rename

## Changes

- Renamed CLI launchers and published commands to `nytrix` and `nytrix2`; updated CLI package metadata, Docker packaging, install script, updater paths, Nix packaging, and user-facing CLI strings.
- Renamed first-party client defaults, Protocol/Server API identities and headers, generated client exports, Node build constants, and product service identifiers to Nytrix.
- Regenerated client sources with `bun run generate` from `packages/client` and regenerated `packages/protocol/openapi.json` with `bun run generate` from `packages/protocol`.
- Updated first-party imports of the public client/event APIs across app, plugin, TUI, SDK, and Server fixtures so the renamed API remains consumable. This expands beyond the original Task 3 ownership list to keep workspace consumers type-correct.
- Updated root and package repository metadata to `https://github.com/ledexsoft/Nytrix`. Removed a guessed `nytrix.ai` CORS allowlist entry; callers can configure additional origins explicitly.
- Kept the required live TUI service discovery commands `opencode service status` and `opencode service get password` in root development scripts, with Nytrix environment variable names. Kept the configured AWS SSO profile name `opencode`.
- Added `NYTRIX_SERVER_USERNAME`, defaulting to `nytrix`, for explicit server connections. The live TUI scripts set it to `opencode` so the upstream service accepts the fetched password without weakening Server authentication.

## Remaining upstream identities

- `@opencode-ai/pty`, its `opencode-pty` binary names, and its server service label identify the external PTY dependency.
- OpenCode Console/Go URLs, provider IDs, and explanatory text identify the external model and account service.
- `ai.opencode/sessionID` is the external MCP metadata key. The `opencode` model provider ID and upstream PR reference in `script/release.ts` are retained for interoperability and provenance.
- Root `dev:live` and `dev:vite:live` intentionally invoke the installed upstream `opencode` service CLI per repository instructions. The `sso` script retains the existing user-configured AWS SSO session name.

## Verification

- Passed typechecks: `packages/protocol`, `packages/client`, `packages/server`, `packages/cli`, `packages/plugin`, `packages/tui`, `packages/sdk`, and `packages/app`.
- Passed client build: `bun run build` from `packages/client`.
- Passed client generation and Protocol OpenAPI generation.
- CLI build was started but did not complete: the build script entered `bun add` dependency resolution and emitted no further output for three minutes, so it was interrupted. No tests were added or run.
