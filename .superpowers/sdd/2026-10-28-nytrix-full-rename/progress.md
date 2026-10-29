# SDD ledger — plan: docs/superpowers/plans/2026-10-28-nytrix-full-rename.md

## Setup

- Workspace: `/Users/artvier/.codex/worktrees/nytrix-rename/Nytrix`, branch `nytrix-rename`.
- Source folder: `/Volumes/DatosAPFS/Proyectos de Ledexsoft/Nytrix`, branch `dev`.
- BASE: `b7992598be933c031bc67321e73c1824d216e48c`.
- Spec: `docs/superpowers/specs/2026-10-28-nytrix-brand-design.md`.
- User authorized the complete first-party rename and one-time global/project-local data migration. No OpenCode CLI alias or environment-variable alias will be retained.
- Per developer instruction, do not add or run tests unless the user asks. Use static audits, package resolution, lint/typecheck, and builds from the plan where applicable.
- Ruling: use task-scoped implementer and reviewer agents as the user accepted the recommended subagent-driven method via “hazlo”. Keep edits in this worktree and integrate the resulting branch into the requested source folder after review.
- Ruling: classify upstream legal notices, accurate historical provenance, and required third-party provider/protocol/dependency identities as exceptions; these are not Nytrix product surfaces.
- Ruling: corrected the plan's global-path owner from a nonexistent `packages/core/src/global.ts` to the observed `packages/util/src/global.ts` and global roots definitions under `packages/util/src/**` before implementation; source inspection establishes this as the actual path owner.
- Ruling: moved the generated client scope refresh into Task 1 because current generated client sources import `@opencode/schema`; they must be regenerated, not hand-edited, for the package typecheck to be meaningful. Task 7 still performs a final regeneration after later API identity changes.
- Ruling: for a project ancestor, any existing `nytrix.json(c)` or `.nytrix/` source makes Nytrix authoritative and suppresses migration of the entire legacy config group there; if no Nytrix source exists, stage-copy the legacy group, preserve the source, and allow retry to finish missing targets. Global XDG destinations migrate independently only when their corresponding Nytrix destination is absent.
- Ruling: active system/MDM config paths move to Nytrix names, but automatic copying of admin-managed files is out of scope because the app may not have permission; keep old files intact and document the new administrator-managed locations.
- Ruling: migrate only durable global user data/config and `state/kv.json` preferences. Rebuild caches/temp state; exclude `service*.json`, lock files, and `state/pty` process metadata to prevent Nytrix from attaching to upstream OpenCode processes.
- Ruling: defer the entire durable global copy when a legacy service registration resolves to a live OpenCode process, with an actionable stop-and-restart message; never stop the upstream process automatically. This avoids inconsistent SQLite/WAL copies and preserves source data.
- Ruling: keep MCP `_meta` key `ai.opencode/sessionID` and the external provider ID suffix `opencode` unchanged; rename only the first-party plugin namespace to `nytrix.provider.opencode`.
- Ruling: migrate `~/.opencode` to `~/.nytrix` as a durable config root, excluding the installed `bin` directory and renaming root config filenames; migrate XDG roots independently so creating `.nytrix` does not suppress them.
- Ruling: write a one-time receipt after a legacy config/data group has been considered, so deleting a Nytrix copy later cannot resurrect its untouched OpenCode source.

## Pre-flight conflict scan

| Tasks | Shared file/interface | Finding and ruling |
|---|---|---|
| 1 ↔ 2 | `@opencode/*` workspace interface consumed by core | Task 1 owns workspace package declarations/imports; Task 2 consumes them. Sequential ordering is valid. |
| 1 ↔ 3 | Root `package.json`; CLI workspace manifest | Task 1 owns package `name` and `@nytrix/*` dependency scope; Task 3 owns root CLI scripts and `bin` entries. No overlapping field ownership. |
| 1 ↔ 4 | `packages/desktop/package.json` | Task 1 owns workspace package scope; Task 4 owns desktop product metadata. Distinct fields. |
| 1 ↔ 7 | `bun.lock` | Task 1 regenerates after workspace rename; Task 7 regenerates after all manifest updates. Intentional second regeneration. |
| 2 ↔ 3 | CLI environment IDs vs command/launcher names | Task 2 owns `packages/cli/src/env.ts` and config path semantics; Task 3 owns command, launcher, build, updater, and distribution identity. |
| 2 ↔ 4 | Global/project config paths vs desktop state paths | Task 2 owns core config discovery and project config; Task 4 owns desktop app IDs, desktop storage, and bundled CLI integration. |
| 2 ↔ 5 | Config examples vs product copy | Task 2 owns config filename examples in the root config guide; Task 5 owns app/web product copy and site content. |
| 2 ↔ 6 | Root docs vs repository documentation | Task 2 owns root configuration guide names; Task 6 owns all other root docs and `.opencode` developer tooling. |
| 3 ↔ 4 | CLI executable interface bundled by desktop | Task 3 produces `nytrix`; Task 4 updates desktop integration to consume that executable. Sequential dependency is valid. |
| 3 ↔ 6 | Installer/Nix/package metadata vs CI/deployment | Task 3 owns CLI distribution files and Nix packages; Task 6 excludes install scripts/Nix and owns CI and deployment configuration. |
| 4 ↔ 5 | Desktop UI vs shared app/web UI | Task 4 owns `packages/desktop/**`; Task 5 owns `packages/app/**`, `packages/ui/**`, `packages/web/**`, console, and website. |
| 5 ↔ 6 | Website copy vs repository automation | Task 5 owns `services/www/**`; Task 6 excludes it and owns other services and infrastructure. |
| 5 ↔ 7 | Product surfaces vs generated SDK outputs | Task 5 owns visible UI/asset copy; Task 7 owns generated clients and final audit. |
| 6 ↔ 7 | Docs/infra edits vs exception inventory | Task 6 updates current sources; Task 7 classifies final remaining occurrences after all edits. |
| 1 | Workspace manifests and references | Self-consistent: names/imports change together, lockfile regenerates afterward, typecheck verifies resolution. |
| 2 | Config/data migration | Self-consistent: new global/project names, old paths read only for migration, Nytrix wins conflicts, sources remain intact. |
| 3 | CLI command/distribution | Self-consistent: package bin, launcher, scripts, and packaging converge on `nytrix`; no old alias. |
| 4 | Desktop identity | Self-consistent: display/bundle/storage identities and bundled CLI move together with one-time state copy. |
| 5 | App/web/brand | Self-consistent: owned current copy and text-bearing assets change while provider and provenance names remain external. |
| 6 | Docs/automation/deployment | Self-consistent: current instructions and repository config change; history/legal attribution remains accurate. |
| 7 | Generated output/audit | Self-consistent: generators run after source renames, lockfile is refreshed, working tree and filenames receive a final audit. |

## Task progress

- Task 1: complete (commit `1796ddd476` from base `b7992598be933c031bc67321e73c1824d216e48c`, review clean). Reviewer `/root/review_task1` approved spec compliance and quality.
- Task 2: complete (commit `a638d03b3e` plus review fix `6e162e9b92`; global and project migrations preserve old sources, Nytrix wins conflicts, receipts prevent legacy data from reappearing after later deletion; `packages/util` and `packages/core` typechecks passed). Fresh reviewer approved after confirming staged retry and external GitLab variable preservation.
- Task 3: complete (commits `f003bd8af1`, `34c6783eef`, `7208790915`, `d3aa942aef`; typechecks passed for protocol, client, server, CLI, plugin, GUI plugins, TUI, SDK, app, desktop, and simulation; client build and both generators passed; host CLI build produced `dist/cli-darwin-arm64/bin/nytrix`). Fresh reviewer approved through `d3aa942aef`; full multi-target build remains unverified after optional cross-platform downloads stalled.
- Task 4: complete (desktop typecheck passed; all three channel packaging identities and GitHub updater metadata verified; no tests run per instruction).
- Task 5: complete (commit `c0fe3c45b5`; app/TUI/GUI/Console typechecks passed; app, Console app, stats app, packages/web, and services/www builds passed; no tests run per instruction).
- Task 6: complete (committed; root/docs, VS Code, Salesforce, `.nytrix` tooling, release automation, updater, and deployment identity updated; static YAML/shell checks and relevant typechecks passed; no tests run).
- Task 7: complete in this worktree; final client generation and lockfile refresh completed, root `bun run check` passed, source-marked SDK docs are synchronized, current theme/tool/plugin identity was updated, and remaining OpenCode occurrences are classified in `docs/superpowers/specs/nytrix-rename-exceptions.md`. No test commands were run per user instruction.

## Cross-task source notes

- Core config filenames and project directory discovery are owned by `packages/core/src/config/discovery.ts`; `packages/core/src/config.ts` also selects the default filename when writing config.
- Global XDG paths are rooted by `packages/util/src/global.ts` and `packages/util/src/global-roots.ts`; workerd has a separate path implementation in `packages/util/src/global-roots.workerd.ts`.
- Desktop Electron state uses `app.getPath("userData")` in `packages/desktop/src/main/storage/store.ts`, with identity set in `packages/desktop/src/main/constants.ts` and main app setup.
