# Task 4 report — Desktop identity and state migration

## Changes

- Renamed the desktop app identity across Electron metadata, display names, bundle IDs, URL scheme, installer names, Linux resources, storage keys, internal IPC names, environment variables, and bundled CLI paths to Nytrix.
- Replaced the OpenCode generic updater endpoints with electron-builder's supported GitHub provider targeting `ledexsoft/Nytrix`; dev and beta are prereleases, prod is a release. Updated the hand-written `app-update.yml` for the GitHub provider fields.
- Before Electron sets `userData`, the app copies the channel-matched legacy profile only when the Nytrix profile does not exist. The OpenCode source remains untouched. In the copied profile, `opencode.settings` and `opencode.*.dat` become Nytrix filenames; when both copies exist, the Nytrix copy wins and the stale OpenCode copy is removed. Isolated/test roots bypass the migration.
- Updated storage discovery/import to use Nytrix namespaces and updated the desktop Windows installer fixture and packaging assertions.
- Updated desktop package homepage and Linux metainfo links to the known Nytrix GitHub repository. Replaced the profiler helper’s machine-specific trace-mapping path with a direct dev dependency.

## Validation

- `bun run typecheck` from `packages/desktop` passed: 2,920 files across 2 projects.
- A Bun metadata check verified all three channel app IDs, product names, `nytrix` protocol, GitHub owner/repository and release type.
- No tests were added or run.
- Full packaging was not run; it requires generated icons and the target CLI payload.

## Remaining OpenCode references

- Prior app IDs and `opencode.*` storage filenames remain only as migration inputs in `configure.ts`.
- `OPENCODE_*` is filtered from the startup benchmark environment so a developer's legacy shell variables cannot leak into the isolated child process.
- `@brendonovich/vite-plugin-opencode` and its `data-opencode-*`/virtual-module API are third-party integration identifiers.
- The OpenCode issue and screenshot URLs in Linux metainfo preserve accurate upstream provenance and legal/history context.
