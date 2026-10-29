# Nytrix rename exceptions

This inventory records remaining OpenCode identifiers after Task 7's source, generated-output, filename, and hidden-file audit. These names identify compatibility inputs, upstream OpenCode services, third-party packages, or source history rather than Nytrix's own user-facing identity.

## Upstream provider and service integrations

- `packages/ai/src/providers/opencode.ts`, `packages/ai/src/providers/opencode/decisions.ts`, and `packages/core/src/plugin/provider/opencode.ts` retain the external OpenCode provider, its OAuth/device flow, and its model service. Provider IDs such as `opencode`, `opencode-go`, and model IDs such as `opencode/gpt-5.6-sol` must match that service.
- `packages/app/src/providers/opencode-logo.tsx`, `packages/ui/src/assets/icons/provider/opencode.svg`, `packages/ui/src/assets/icons/provider/opencode-go.svg`, and `packages/console/app/src/routes/oauth/opencode/client.json.ts` identify the external provider and its OAuth registration.
- `packages/web/src/content/docs/**` provider, model, MCP, GitHub, GitLab, and ecosystem pages retain upstream references where they document OpenCode Zen/Go/Console, provider IDs, community integrations, GitHub repositories/actions, or the interoperable `/.well-known/opencode` endpoint. `services/www/src/docs/content/console/**` documents OpenCode Console and OpenCode Go as separate upstream products.
- `packages/console/app/.opencode/agent/css.md` and `packages/console/app/src/asset/lander/opencode-comparison-{min.mp4,poster.png}` belong to the upstream Console service integration/comparison material, not Nytrix's own CLI or website identity.
- OpenCode-specific request metadata sent to provider services remains where those services expect it: `packages/core/src/plugin/provider/{openai,cerebras,xai,openrouter,kilo,nvidia,zenmux,llmgateway}.ts`, `packages/core/src/plugin/websearch/{tavily,tinyfish}.ts`, and `packages/core/src/mcp/oauth.ts`. No Nytrix canonical domain or provider registration is provisioned to replace those values.

## Compatibility and migration inputs

- `packages/core/src/config/migrate.ts`, `packages/util/src/**`, and migration-focused tests retain old `opencode.json(c)`, `.opencode`, and `~/.opencode` paths so existing user data can be discovered and migrated without deleting the source.
- `services/www/src/docs/content/migrate-v1.mdx` and legacy configuration examples identify OpenCode's previous config/data format as migration input.
- The external MCP metadata key `ai.opencode/sessionID`, OpenCode ACP/protocol extensions, and the `/.well-known/opencode` discovery path remain stable interoperability identifiers.
- `packages/tui/src/theme/assets/opencode.json` is the legacy theme fixture used by V1 theme migration coverage. Current built-in defaults now use `nytrix` and the experimental design uses `nytrix2` in `packages/tui/src/theme/assets/v2/`.
- A saved `theme: "opencode"` setting resolves to the new `nytrix` appearance when no user-defined theme named `opencode` exists. The compatibility name is not exposed in the theme picker and the user's config file is not rewritten.

## Third-party dependencies and tools

- `bun.lock`, workspace manifests, and integration code retain externally published names such as `@opencode-ai/pty`, `@brendonovich/vite-plugin-opencode`, `opencode-drive`, and `opencode-gitlab-auth`. Renaming these would select a different or nonexistent package.
- `packages/process-daemon/**` retains `opencode-pty` as the external native daemon/package identity; its published binary and registration protocol are not owned by this fork.
- `.github/workflows/bot-docs-locale.yml` is disabled (`if: false`) and still refers to upstream `OPENCODE_API_KEY` / `OPENCODE_CONFIG_CONTENT` secrets for its dormant locale-generation setup. No matching Nytrix secrets or active deployment credentials are configured in this checkout.

## Legal and historical source record

- `LICENSE`, `CHANGELOG.md`, localized `README*.md`, plan/spec/report files under `docs/superpowers/**` and `.superpowers/**`, and historical source comments preserve accurate OpenCode attribution, upstream change history, and review evidence. These files are not current Nytrix command/configuration instructions.
- `patches/**`, changelog tooling, and test fixtures may mention upstream repository paths, issue numbers, package names, or recorded provider payloads to explain the source patch or reproduce upstream behavior.
- `AGENTS.md` retains `opencode service status` / `opencode service get password` in its live TUI workflow because it explicitly connects the development build to the separately installed upstream OpenCode server.

## External setup required

- The source tree does not provide a Nytrix website domain, published config/theme schema URL, Console/Zen credentials, release secrets, or a configured enterprise contact. Website canonical URL is read from `NYTRIX_SITE_URL`; the generated config schema omits `$id` until a real public endpoint is provisioned. The docs link to the fork's GitHub discussions for contact rather than inventing a domain or email address.
- `packages/web/config.mjs` keeps the OpenCode Console authentication host only for the external OpenCode provider integration. The GitHub workflow for locale generation remains disabled until its credentials and ownership are deliberately configured.
