# Task 6 report — Documentation, repository automation, and deployment metadata

## Summary

- Updated the root README translations, contribution and security guidance, repository agent instructions, and the repository-owned developer setup from `.opencode` to `.nytrix`.
- Renamed VS Code command IDs and current command strings, updated its release artifact and repository links, and revised Salesforce Console account guidance while preserving local Salesforce org aliases.
- Repointed current repository links, changelog retrieval, Console desktop downloads, and desktop release notes to `https://github.com/ledexsoft/Nytrix` and GitHub Releases.
- Separated desktop update channels: Electron Builder and its client use `dev`, `beta`, and `latest`; dev and beta GitHub releases are prereleases and stable releases alone become the latest release. The release publisher creates channel-specific updater metadata from the final signed assets.
- Removed the release path that published to OpenCode R2/update endpoints and upstream Homebrew/AUR/WinGet repositories. CLI/desktop build assets now attach to GitHub Releases. Docker publishes to `ghcr.io/ledexsoft/nytrix`.
- Renamed owned SST/Cloudflare deployment identifiers and removed inherited OpenCode DNS records, Cloudflare account IDs, and update-service routes. Deployment workflows require `NYTRIX_DEPLOYMENTS_ENABLED=true`; [DEPLOYMENT.md](../../../DEPLOYMENT.md) documents the external resources and credentials a maintainer must provision.
- Retired the hosted update Worker workflow. Its source is explicitly documented as optional self-hosted legacy code, with its API/admin routes and provisioning requirements recorded; its configuration no longer includes upstream routes, database IDs, pipeline IDs, or hard-coded repository identity.

## Validation

- `bash -n .github/release/*.sh` — passed.
- Ruby/Psych YAML parsing of modified release/deployment workflows, composite actions, and Wrangler configs — passed.
- `git diff --check` — passed.
- Typechecks passed for `packages/console/app`, `packages/gui-plugins`, `packages/desktop`, `services/changelog`, and `services/update`.
- No tests were added or run, per instruction.
- No live cloud deployment was attempted. Cloudflare/AWS/PlanetScale/Sentry/Stripe/signing credentials, GitHub environment configuration, R2 buckets, domains, and the optional update Worker D1 database must be provisioned by the repository owner before enabling deployments.

### Follow-up correction

The release publisher now writes separate `${channel}-linux.yml` and `${channel}-linux-arm64.yml` feeds from `nytrix-desktop-linux-x64.AppImage` and `nytrix-desktop-linux-arm64.AppImage`. `bash -n` and `git diff --check` pass for this correction; no tests were run.

## Preserved identity and follow-up

- The upstream OpenCode background service commands in `AGENTS.md` and `CONTRIBUTING.md` remain because the live TUI workflow explicitly connects to that installed service.
- Provider/model IDs, historical OpenCode issue and PR links, legal provenance, upstream AWS CLI profile names, and actual third-party `opencode-pty` package/binary identifiers remain external or historical references.
- Task 7 owns the final whole-repository exception inventory and lockfile/client-generation audit.
