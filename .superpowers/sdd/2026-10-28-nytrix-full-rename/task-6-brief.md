# Task 6 brief — Documentation, repository automation, and deployment metadata

**Base:** Task 5 completed at `c0fe3c45b5`; Task 5 follow-up for `services/www` is `bf5dba96ec`. Continue from current HEAD.

## Objective

Replace current first-party OpenCode identity in developer onboarding, repository documentation, VS Code integration, GitHub workflows, release infrastructure, and services with Nytrix. Preserve upstream provenance, third-party provider identities, and legacy migration inputs.

## Owned surfaces

- Root `README*.md`, `CONTRIBUTING.md`, `SECURITY.md`, root docs and developer workflows.
- `.github/**`, `infra/**`, `salesforce/**`, `services/**` excluding `services/www/**`, `sst.config.ts`, `flake.nix`, and `sdks/vscode/**` current identifiers.
- Repository-owned `.opencode/**` project tooling moves to `.nytrix/**`; update paths and first-party identifiers in its contents.
- Leftover documentation/performance material under `packages/app/**` was explicitly excluded from Task 5 by the implementer and should be handled where appropriate here.
- Targeted pending product download/updater source: `packages/console/app/src/routes/download/[channel]/[platform].ts` and `packages/gui-plugins/src/updater/whats-new.tsx`.

## Required changes

- Rename current brand/copy, current examples, first-party environment names, CLI commands, GitHub links, service IDs, and repository guards to Nytrix.
- Release source assets use Nytrix names and target `ledexsoft/Nytrix`; release-channel selection must keep `dev`, `beta`, and stable `latest` separate. A release for one channel must never become `latest` accidentally or serve the wrong updater channel.
- Replace OpenCode-owned update-service calls with the Nytrix GitHub Releases/Changelog source where possible. Do not invent a Nytrix domain, API, OAuth client, or cloud account. Disable/unlink a service flow when its infrastructure is not owned/provisioned, or derive URLs from the request origin if self-hosted behavior is intended.
- Change repository package/workflow metadata to `https://github.com/ledexsoft/Nytrix`.
- Keep `.opencode` migration examples and old paths only where documenting migration; Task 2 owns their runtime behavior.
- Preserve valid external OpenCode provider/model identities, OpenCode Console/Go/Zen integrations, AWS profile names, external credentials, legal attribution, and accurate upstream history.
- Do not add or run tests. Run relevant static checks, shell syntax, workflow/config validation, typecheck, or builds when useful.

## Explicit exclusions

Do not modify Task 3's packaging/Nix/in-install source unless a workflow-only integration requires a path change; do not edit `services/www/**`, Task 2 global/project config implementation, or Task 5's already committed app/web copy/assets. Do not stage any pre-existing unrelated changes in `bun.lock`, Task 3 report, or the app performance files without classifying ownership.

## Verification

- Audit `README*.md`, `.github`, `.opencode`/`.nytrix`, services, infra, VS Code, and owned docs for remaining `OpenCode`, `opencode`, and `OPENCODE_*` matches.
- Validate no workflow publishes to upstream domains or registries, guards are scoped to the Nytrix repository, and beta/dev GitHub releases remain prereleases while stable release is marked latest.
- Verify all internal path/file renames resolve.
- Write `task-6-report.md`, update plan/ledger, and commit only Task 6 files conventionally.
