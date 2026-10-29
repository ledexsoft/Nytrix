# Nytrix rename exceptions

This inventory records intentional OpenCode identifiers after the Nytrix identity rename. They identify compatibility inputs, upstream OpenCode services, third-party packages, or accurate source history rather than Nytrix's current product identity.

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
- `packages/app/src/runtime/persistence/storage.ts`, `packages/app/src/runtime/plugin/stores.ts`, `packages/ui/src/theme/context.tsx`, the motion tuner, the PWA route cache, and the theme preload read legacy `opencode.*` storage keys so existing browser and desktop settings migrate to Nytrix keys. The browser IndexedDB database `opencode-drafts` remains as a compatibility container for existing draft attachments. Existing skill frontmatter using `opencode/autoinvoke` is still read; new skills use `nytrix/autoinvoke`.
- Old `opencode` theme names and theme fixture data remain only as V1 migration inputs. Current built-in defaults use Nytrix-branded themes.

## Third-party dependencies and tools

- `bun.lock`, workspace manifests, and integration code retain externally published names such as `@opencode-ai/pty`, `@brendonovich/vite-plugin-opencode`, `opencode-drive`, and `opencode-gitlab-auth`. Renaming these would select a different or nonexistent package. The Nytrix process-daemon source and its own npm package are renamed; the CLI still consumes the external `@opencode-ai/pty` distribution until a Nytrix binary package is published.
- `.github/workflows/bot-docs-locale.yml` is disabled (`if: false`); its current environment variable names are Nytrix names. It remains inactive until the corresponding credentials and deployment ownership are configured.

## Legal and historical source record

- `LICENSE`, `CHANGELOG.md`, localized `README*.md`, plan/spec/report files under `docs/superpowers/**` and `.superpowers/**`, and historical source comments preserve accurate OpenCode attribution, upstream change history, and review evidence. These files are not current Nytrix command/configuration instructions.
- `patches/**`, changelog tooling, and test fixtures may mention upstream repository paths, issue numbers, package names, or recorded provider payloads to explain the source patch or reproduce upstream behavior.
- Provider-specific API environment variables such as `OPENCODE_API_KEY`, along with `x-opencode-*` provider request headers, remain because the external OpenCode provider and its services require those exact names.
- The `opencode.gitconfig`, `opencode-pack.lock`, and cached `opencode` Git metadata names are retained for existing repository snapshots and include paths. They are internal on-disk compatibility identifiers, not user-facing Nytrix branding.
- Desktop migration reads old `ai.opencode.desktop*` data directories and `opencode.*.dat` filenames, then copies the data into Nytrix's current application directory and filenames.

## External setup required

- The source tree does not provide a Nytrix website domain, published config/theme schema URL, Console/Zen credentials, release secrets, or a configured enterprise contact. Website canonical URL is read from `NYTRIX_SITE_URL`; the generated config schema omits `$id` until a real public endpoint is provisioned. The docs link to the fork's GitHub discussions for contact rather than inventing a domain or email address.
- `packages/web/config.mjs` keeps the OpenCode Console authentication host only for the external OpenCode provider integration. The GitHub workflow for locale generation remains disabled until its credentials and ownership are deliberately configured.

- The root `dev:live` scripts call the separately installed `opencode service` and use its authentication password to connect the Nytrix development TUI to the user's elected upstream server, as required by this repository's live TUI workflow.
