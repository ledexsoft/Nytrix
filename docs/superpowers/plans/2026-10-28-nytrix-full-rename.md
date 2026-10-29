# Nytrix Full Product Rename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace OpenCode's first-party product identity throughout the repository with Nytrix while preserving data, legal attribution, and required third-party integration names.

**Architecture:** Apply the rename by ownership domain: workspace/package identity, core configuration and migration, CLI distribution, desktop/web brand, then docs/infrastructure. Regenerate derived artifacts from their source generators and finish with a tracked-file audit that classifies every remaining match.

**Tech Stack:** Bun workspaces, TypeScript, Solid, Electron, Astro, Nix, GitHub Actions, generated SDK/client artifacts.

**Spec:** `docs/superpowers/specs/2026-10-28-nytrix-brand-design.md`

## Global Constraints

- Replace first-party product names with Nytrix throughout project-owned source, manifests, generated outputs, docs, build/release/install assets, and brand assets.
- Use `nytrix`, `NYTRIX_*`, `.nytrix`, and `@nytrix/*` for first-party names.
- Do not retain an `opencode` CLI command alias or old first-party environment-variable names.
- Preserve global and repository-local user data during migration; keep old data in place and make migrations safe to retry.
- If old and Nytrix paths both exist, Nytrix paths are authoritative and neither copy is overwritten or deleted.
- Do not rewrite Git history, upstream license notices, historical source attribution, or required third-party provider/protocol/dependency names.
- Use `https://github.com/ledexsoft/Nytrix` for first-party repository links. Do not invent a product domain.
- Do not hand-edit generated SDK/client output; use its generator.
- Tests are not part of this plan unless the user asks for them. Use source audits, package resolution, lint/typecheck, and build checks to verify each task.

## Review Focus

- Existing global data under OpenCode paths: the migration copies it to Nytrix paths without deleting or overwriting either copy.
- Existing project-local `opencode.json(c)` and `.opencode/`: first use converts them to Nytrix names; subsequent discovery uses Nytrix names.
- Projects containing both old and new config: Nytrix config remains authoritative and the old config remains untouched.
- Third-party OpenCode model provider and external protocol names: these stay unchanged and are not mistaken for Nytrix's own identity.
- Generated package/client references: regenerate them after namespace and API identity edits so workspace and published outputs agree.

---

### Task 1: Workspace and first-party package namespace

**Files:**
- Modify: root `package.json`
- Modify: `packages/*/package.json`, `packages/plugins/*/package.json`, `packages/console/*/package.json`, `packages/stats/*/package.json`, `services/*/package.json`
- Modify: first-party SDK manifest metadata under `sdks/*/package.json`
- Modify: first-party package declarations, dependency declarations, TypeScript imports, and source declarations containing `@opencode/*`
- Modify: `bun.lock`

**Interfaces:**
- Produces workspace package names and imports under `@nytrix/*`, consumed by every later task.

- [x] **Step 1: Inventory all first-party `@opencode/*` package declarations and imports**

Run: `rg -n --hidden --glob '!.git/**' --glob '!bun.lock' '@opencode/' .`

Expected: a reviewable list of workspace declarations, dependency edges, imports, generated references, and external-package exceptions.

- [x] **Step 2: Rename first-party workspace package names and imports to `@nytrix/*`**

Preserve package semantics and subpath exports. Keep external scopes and provider SDK names unchanged.

- [x] **Step 3: Regenerate the Bun lockfile**

Run: `bun install --lockfile-only`

Expected: lockfile workspace references resolve to the renamed packages with no unrelated dependency-version changes.

- [x] **Step 4: Install the locked workspace dependencies**

Run: `bun install --frozen-lockfile`

Expected: dependencies install without changing the lockfile.

- [x] **Step 5: Regenerate client imports from the renamed package scope**

Run: `bun run --cwd packages/client generate`

Expected: generated client imports use `@nytrix/*`; no generated output is hand-edited.

- [x] **Step 6: Verify workspace resolution and types**

Run: `bun run typecheck`

Expected: workspace package resolution and TypeScript checks complete without missing old-scope imports.

### Task 2: Core configuration identities and data migration

**Files:**
- Modify: `packages/core/src/config/discovery.ts`, `packages/core/src/config.ts`
- Modify: `packages/core/src/plugin/plan.ts`, `packages/core/src/skill/discovery.ts`
- Modify: `packages/core/test/**` and `packages/util/test/**` existing fixtures/assertions for config paths and environment names (update only; do not add or run tests)
- Modify: core global/project config consumers found by the occurrence inventory
- Modify: `packages/util/src/global.ts`, `packages/util/src/global-roots.ts`, and `packages/util/src/global-roots.workerd.ts` for global product paths
- Modify: `packages/cli/src/env.ts` for CLI environment identifiers only
- Modify: config discovery naming and config-file examples in the root configuration guide; Task 6 owns all other root documentation

**Interfaces:**
- Consumes: renamed workspace packages from Task 1.
- Produces: Nytrix global/project config discovery and one-time migration behavior used by CLI, app, and desktop.

- [x] **Step 1: Inventory global and project-local config/data paths**

Run: `rg -n --hidden --glob '!.git/**' '(\.opencode|opencode\.json|OPENCODE_)' packages/core packages/util packages/app packages/desktop packages/cli`

Expected: every path classified as first-party identity, external provider/protocol, or historical input for migration.

- [x] **Step 2: Add first-use migration for core global data paths**

Use `.nytrix` and Nytrix filenames for new data. Before copying, inspect legacy service registrations; if a registered OpenCode process is live, defer migration with a clear message to stop it and restart Nytrix. Do not stop that process. Once it is stopped, copy durable user data/config and `state/kv.json` preferences only when the matching Nytrix destination is absent; keep the old source intact and make migration safe to retry. Migrate the durable home config root `~/.opencode` to `~/.nytrix` as one unit, excluding its installed `bin` directory and renaming root config filenames. Regenerate caches and temporary files instead of copying them. Exclude runtime registrations (`service*.json`), lock files, and `state/pty` metadata so Nytrix cannot attach to an OpenCode process. When both durable destinations exist, prefer Nytrix.

- [x] **Step 3: Convert project-local configuration names on discovery**

Convert `opencode.json`, `opencode.jsonc`, and `.opencode/` project config to the corresponding Nytrix names on first use. If any Nytrix source (`nytrix.json(c)` or `.nytrix/`) already exists for an ancestor, skip all legacy migration for that ancestor and use Nytrix sources. If no Nytrix source exists, stage-copy the legacy config group, preserve the original, and make retry finish any missing targets without overwriting.

- [x] **Step 4: Rename first-party constants and public configuration identifiers**

Replace first-party `OPENCODE_*` names with corresponding `NYTRIX_*` names and update defaults, schemas, and current examples. Use `/Library/Application Support/nytrix`, `%ProgramData%\nytrix`, `/etc/nytrix`, and `ai.nytrix.managed.plist` for current system/MDM configuration. Do not add old-name aliases or automatically copy administrator-managed system/MDM files; document the new managed locations and leave old files intact for administrators to update.

- [x] **Step 5: Verify migration precedence and references**

Run: `rg -n --hidden --glob '!.git/**' '(\.opencode|opencode\.json|OPENCODE_)' packages/core packages/util packages/app packages/desktop packages/cli`

Expected: remaining matches are limited to explicit migration source names, legal/history, or external integration identifiers; current discovery and new writes use Nytrix names. `packages/util` and `packages/core` typechecks passed; no tests were run.

### Task 3: CLI command, launchers, and distribution

**Files:**
- Modify: `packages/cli/package.json`, `packages/cli/bin/opencode.cjs`, `packages/cli/bin/opencode2.cjs`
- Modify: `packages/cli/src/**`, `packages/cli/script/**`
- Modify: first-party service/client defaults and public protocol identifiers in `packages/client/src/**`, `packages/protocol/**`, and `packages/server/src/**`; regenerate client outputs from source
- Modify: root `package.json` development scripts and `script/pack.ts`, `script/release.ts`, install scripts
- Modify: Docker/Nix/winget/Homebrew/package metadata owned by this repository

**Interfaces:**
- Consumes: Tasks 1 and 2.
- Produces: primary executable `nytrix` and Nytrix-named launch/install/update artifacts.

- [x] **Step 1: Inventory CLI-visible names and artifact paths**

Run: `rg -n -i --hidden --glob '!.git/**' '(opencode|OPENCODE_)' packages/cli script install nix package.json`

Expected: command names, diagnostics, completion, updater URLs, build names, and artifact names are classified.

- [x] **Step 2: Rename CLI binaries and user-facing output**

Publish `nytrix` as the primary executable. Remove the old product command names and update help, errors, examples, and generated completion output.

- [x] **Step 3: Rename packaging, update, and installer identity**

Update package metadata, launcher names, archive names, Docker/Nix/install scripts, updater product text, first-party `NYTRIX_*` runtime variables, and first-party API namespace headers/identifiers to Nytrix. Regenerate generated client outputs after protocol/server identity changes. Keep the OpenCode provider ID/credential integration and external protocol names required for interoperability unchanged. Use the known GitHub fork URL where repository URLs are required.

- [x] **Step 4: Verify CLI build and command surface**

All affected package typechecks and client generation passed. The full multi-platform CLI build spent several minutes resolving/downloading optional binaries for every OS target, so a host-only build was used: `bun run script/build.ts --single --skip-install` produced `packages/cli/dist/cli-darwin-arm64/bin/nytrix`.

Run: `bun run --cwd packages/cli build` (or the host-only build above when optional cross-platform dependency resolution stalls).

Expected: build succeeds and emitted executable/artifacts use Nytrix names; `opencode` is not exposed as an alias.

### Task 4: Desktop application and persistent identity

**Files:**
- Modify: `packages/desktop/package.json` product metadata (Task 1 owns its workspace package scope), `packages/desktop/electron-builder.config.ts`
- Modify: `packages/desktop/src/main/constants.ts`, `packages/desktop/src/main/storage/store.ts`, `packages/desktop/src/main/service/desktop-cli.ts`
- Modify: remaining desktop main/renderer source and platform packaging metadata found by inventory

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces: Nytrix desktop display name, app/bundle identifiers, storage paths, and bundled CLI integration.

- [x] **Step 1: Inventory desktop IDs, filenames, launch paths, and branding**

Run: `rg -n -i --hidden --glob '!.git/**' '(opencode|OPENCODE_)' packages/desktop`

Expected: app IDs, bundle/product names, data stores, update channel identifiers, and renderer strings are classified.

- [x] **Step 2: Rename desktop product and bundle identity**

Use Nytrix display names and identifiers across macOS, Windows, and Linux packaging. Update bundled CLI paths and service metadata consistently.

- [x] **Step 3: Migrate desktop state and preferences**

Before opening Nytrix storage, copy existing OpenCode settings/state into Nytrix storage if the destination does not exist. Keep old storage intact; if both exist, Nytrix wins.

- [x] **Step 4: Verify desktop packaging metadata and references**

Run: `rg -n -i --hidden --glob '!.git/**' '(opencode|OPENCODE_)' packages/desktop`

Expected: remaining occurrences are classified as migration input, upstream legal/history, or third-party integration; all active desktop identifiers use Nytrix.

### Task 5: App, web, website, and brand assets

**Files:**
- Modify: `packages/app/src/**`, `packages/app/public/**`, `packages/ui/**`, `packages/web/**`
- Modify: `packages/console/app/src/**`, `packages/console/app/public/**`, `services/www/src/**`
- Rename/update first-party SVG/raster wordmarks and screenshots with embedded product text; preserve brand-neutral marks.
- Modify: locale files under `packages/app/src/runtime/i18n/**`

**Interfaces:**
- Consumes: Tasks 1–4.
- Produces: user-visible Nytrix naming across desktop/web UI, docs site, console, email assets, and SEO metadata.

- [x] **Step 1: Inventory user-facing product copy and text-bearing assets**

Run: `rg -n -i --hidden --glob '!.git/**' '(OpenCode|opencode\.ai|opencode)' packages/app packages/ui packages/web packages/console/app services/www`

Expected: product labels are distinguished from provider names and source attribution; assets containing rendered text are identified for regeneration or replacement.

- [x] **Step 2: Rename current user-facing text and repository links**

Update product names, settings labels, translated current product copy, help text, metadata, and links to the Nytrix GitHub repository. Do not invent a website domain.

- [x] **Step 3: Update first-party wordmarks and text-bearing images**

Replace embedded OpenCode text with Nytrix text in owned wordmarks and current product artwork. Keep generic icon shapes and legally attributed upstream material unchanged.

- [x] **Step 4: Verify user-facing occurrences and asset inventory**

Run: `rg -n -i --hidden --glob '!.git/**' '(OpenCode|opencode\.ai|opencode)' packages/app packages/ui packages/web packages/console/app services/www`

Expected: no current Nytrix product copy uses OpenCode; remaining matches are external provider names or credited source history.

### Task 6: Docs, repository automation, and deployment metadata

**Files:**
- Modify: `README*.md`, `CONTRIBUTING.md`, `SECURITY.md`, current docs and `.opencode/**` project tooling
- Modify: `sdks/vscode/**` command IDs, command titles, source strings, and current usage documentation; Task 1 owns the manifest's package/display metadata
- Modify: root `package.json` repository URL metadata
- Modify: `.github/**`, `infra/**`, `services/**` excluding `services/www/**`, `salesforce/**`, `flake.nix`, `sst.config.ts`
- Modify: `.opencode/**` project tooling paths; Task 3 owns install scripts and Nix/package distribution files.
- Rename project-owned `.opencode` tooling paths to `.nytrix` where they are part of this repository's development setup.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: Nytrix developer onboarding, repository automation, deployment, and project configuration.

- [x] **Step 1: Inventory tracked text and filenames with OpenCode identity**

Run: `git grep -n -I -i -e opencode -e 'open code' HEAD -- ':!LICENSE'`

Expected: a list of docs, workflows, scripts, infrastructure identifiers, and exceptions for legal/history/external integrations.

- [x] **Step 2: Update current docs and project-owned tooling**

Use Nytrix in current onboarding, command snippets, release notes authored for Nytrix, repository config, service names, and current CI/deployment identifiers. Keep accurate historical upstream references.

- [x] **Step 3: Update filenames and internal links**

Rename first-party files/directories whose names encode the product; update all references and ensure docs links resolve.

- [x] **Step 4: Verify repo links and tooling paths**

Run: `rg -n -i --hidden --glob '!.git/**' '(opencode|OpenCode)' .github infra script nix services README.md CONTRIBUTING.md SECURITY.md`

Expected: active repository-owned configuration uses Nytrix, with only legal, historical, and third-party names remaining.

### Task 7: Generated clients, lockfile, and final identity audit

**Files:**
- Modify: generated SDK/client/API artifacts through their generators
- Modify: final tracked first-party files discovered by the occurrence inventory
- Create: `docs/superpowers/specs/nytrix-rename-exceptions.md` listing remaining tracked matches and rationale

**Interfaces:**
- Consumes: completed Tasks 1–6.
- Produces: consistent generated outputs and an auditable final occurrence classification.

- [x] **Step 1: Regenerate client/API artifacts from source**

Run: `bun run generate` from `packages/client`.

Expected: generated client package names and first-party product identifiers match Nytrix source definitions.

- [x] **Step 2: Regenerate lockfile after all manifest changes**

Run: `bun install --lockfile-only`

Expected: all first-party workspace references resolve under `@nytrix/*`.

- [x] **Step 3: Run full static project checks**

Run: `bun run check`

Expected: lint and typecheck complete successfully.

- [x] **Step 4: Audit the working tree for every text match, filename, and binary asset**

Run: `rg -n -I -i --hidden --glob '!.git/**' --glob '!node_modules/**' '(opencode|open code)' .` and `git ls-files --cached --others --exclude-standard | rg -i opencode`.

Expected: every remaining text match and filename appears in the exception inventory with a legal, historical, or external-interoperability reason; embedded current first-party wordmarks say Nytrix.

- [x] **Step 5: Inspect final diff and workspace state**

Run: `git status --short` and `git diff --stat`.

Expected: all intended rename/migration changes are present and generated or unrelated files are not accidentally included.
