# Nytrix full product rename

## Intent

Turn this OpenCode-derived repository into the Nytrix product. Nytrix is the name users see, type, configure, install, and encounter in project-owned code and documentation.

## Why

This repository is the starting point for an independent Nytrix product. A display-only rename would leave users invoking and configuring it as OpenCode, and would keep package and release identities coupled to the upstream project.

## Goals

- Replace first-party product naming throughout tracked source, manifests, generated outputs, docs, website copy, build scripts, release/install assets, and brand assets.
- Rename first-party package scopes and imports from `@opencode/*` to `@nytrix/*`, including the lockfile and generated SDK/client outputs.
- Use `nytrix` for the primary CLI command, scripts, bundled executable names, desktop product identity, and release artifacts.
- Replace first-party `OPENCODE_*` settings and product-specific `.opencode` directories/config filenames with Nytrix names.
- Preserve existing global and project-local user data by copying it to the new Nytrix names when needed; never remove the old data during migration.
- Point first-party project links and repository metadata at `https://github.com/ledexsoft/Nytrix` where a URL is needed and known.
- Audit the repository after the rename and account for every remaining OpenCode/opencode match.

## Non-goals

- Rewrite Git history or claim authorship of upstream work.
- Change third-party product, provider, protocol, dependency, or organization names when they are required to interoperate with those systems.
- Alter the upstream MIT copyright/license notice or other legally required attribution.
- Design a new logo or visual identity. Existing brand-neutral icon artwork may remain; first-party wordmarks and text-bearing assets must say Nytrix.
- Register a domain or publish releases.

## Approaches

1. **Complete first-party product migration (selected):** systematically rename first-party identifiers by domain, regenerate derived files, migrate local data, then audit all remaining occurrences. This gives Nytrix an independent product identity while protecting user data and legally/technically required external names.
2. **Blind global replacement:** replace every matching byte string in every file, including third-party identifiers, legal notices, binary media, and provider integrations. This risks corrupting assets, breaking integrations, and making false ownership claims.
3. **Display-only rename:** update visible labels and leave CLI/package/config identities as OpenCode. This does not meet the requested complete rename.

The first approach was selected. The word “all” means all first-party Nytrix product identity. External names, upstream legal provenance, and the old path used only as a one-time migration input remain explicit exceptions.

## Constraints and implementation calls

- The current repository contains 9,076 Git-tracked files; a search finds product-name references across thousands of files. Changes must be inventory-driven, not one unreviewed global substitution.
- Remove the old CLI command and old environment-variable names from Nytrix's public surface; document the breaking rename. Do not preserve an `opencode` command alias.
- Use `NYTRIX_*`, `.nytrix`, `@nytrix/*`, and Nytrix desktop/package identifiers for first-party replacements, following the existing naming shape where possible.
- Convert existing global and project-local OpenCode config/data locations to Nytrix names on first use. Keep each source intact and make migration safe to retry; after migration, use only Nytrix names.
- If both old and Nytrix locations exist, treat Nytrix data as authoritative and do not overwrite either location.
- Update generated files through their generators rather than editing derived SDK/API output by hand.
- Keep historical commit contents untouched. Historical changelog entries may retain accurate upstream attribution; current product documentation must use Nytrix.
- Keep protocol/provider names such as an OpenCode model provider when they identify a separate external integration rather than this product.
- Preserve the upstream MIT license notice. Add Nytrix attribution only where legally accurate; do not replace the original copyright holder.
- Use the known fork URL for repository links. Do not invent a Nytrix website domain.

## Areas to cover

- Root and workspace package names, import paths, dependency declarations, and lockfile.
- CLI binaries, command output, development scripts, standalone launchers, update/install logic, shell completion, and packaged artifact names.
- Environment/config constants, defaults, app IDs, paths, filenames, storage keys, cache/state locations, and any required one-time data migration.
- Desktop and web product labels, metadata, release channels, app icons/wordmarks, SEO metadata, docs, and installation examples.
- Build, CI, release, infrastructure, container, Nix, and deployment configuration.
- Generated API/SDK/client surfaces and project-owned fixtures that encode product identifiers.

## Acceptance

- First-party Nytrix surfaces consistently use Nytrix identities, including packages, executable, environment/config, persistent storage, desktop identity, and release/install metadata.
- Existing global and per-project `.opencode` data/configuration is preserved and copied before Nytrix uses its new locations; migration does not delete the source and can be retried safely.
- Workspace dependency resolution and generated client/build outputs use the new first-party package identity.
- No old product identity remains in current first-party docs or user-facing surfaces. Every remaining tracked match is classified as legal attribution, historical provenance, or a required external integration.
- The repository's checks relevant to the renamed packages and launch flows pass.

## Left to the builder

- Build a tracked-file occurrence inventory and group changes by ownership and generator.
- Determine the exact global storage locations and migration order for each supported platform from the current code before changing them; also migrate repository-local `opencode.json(c)` and `.opencode/` config to Nytrix names.
- Regenerate the lockfile and generated outputs after package/API renames.
- Run focused checks after each area and a final occurrence audit, reporting the unavoidable legal and third-party matches.
