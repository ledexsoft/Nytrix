# Task 5 report — App, web, docs, and brand

## Result

Updated current Nytrix identity in the desktop web app and translations, TUI, desktop-facing GUI plugins, shared web UI, Console landing/brand/download copy, and the active `services/www` documentation site. First-party text-bearing wordmarks and brand bundles now use Nytrix. Known repository links point to `https://github.com/ledexsoft/Nytrix`; no Nytrix product domain or release API host was invented.

The docs site now derives canonical, sitemap, and `llms.txt` origins from the request host, so the source no longer assigns the former OpenCode domains to Nytrix. The install route fetches the Nytrix repository installer. The docs landing page uses Nytrix CLI/package commands and links standalone downloads to the GitHub Releases page.

## Scope completed

- Replaced app and TUI current product copy, pairing instructions, Nytrix updater labels, CLI usage examples, and product-owned app/TUI runtime identifiers. Updated 63 app locale files and the current web/Console locale strings.
- Updated app and TUI help/repository links, voice copy, website metadata, share labels, current installer snippets, and Console download-page CLI instructions.
- Updated GUI plugin labels, translations, SSH/WSL remote CLI paths, updater identity and user agent, and Nytrix repository links.
- Updated 46 active docs articles with Nytrix product language, CLI examples, config filenames and paths, and current environment variable names. Updated docs site headers, brand artwork, title/metadata, installer and request-origin SEO handling.
- Replaced first-party Nytrix wordmarks/icons and regenerated Console brand previews and ZIP bundles. Retained the OpenCode comparison video/poster used by the separately branded OpenCode Zen page.
- Updated the storybook highlight copy and the generated TUI resume command to `nytrix`.

## Classified remaining OpenCode references

The residual inventory in owned surfaces is limited to these classes:

- External OpenCode provider identity and products: provider IDs/logos/credentials, OpenCode Go/Console/Zen copy, provider endpoints, and Console documentation/routes. These remain named as external services.
- Accurate legal/source attribution: trademark and copyright statements, upstream legal terms/privacy text, and source/iOS provenance comments. Legal pages were restored where partial replacement would have attributed Anomaly Innovations terms to Nytrix.
- Historical or migration input: V1 migration documentation, historical changelog/issue/PR references, test fixtures, and upstream examples preserved to describe prior OpenCode data.
- Compatibility identifiers: persisted theme names, keybindings/plugin namespaces, preference keys, MCP metadata and provider/protocol fields. These were not renamed where doing so would break stored state or an external protocol.
- Config-schema identity: active config examples still use the current `https://opencode.ai/config.json` schema ID, whose source/generator is outside Task 5. Task 7 should decide its migration together with generated schema and deployed-host availability; no replacement URL was fabricated.
- Release plumbing still requiring Task 6: the Console platform download route and GUI updater changelog fetch still point at upstream OpenCode release services. Task 6 owns release-channel/deployment metadata; Task 4's follow-up is to confirm GitHub dev/beta/prod separation there.

## Verification

- Typechecks passed: app (1,870 files), TUI (1,760 files across 2 projects), GUI plugins (1,176 files), Console app (104 files). Stats app typecheck also passed during Task 5 iteration (84 files).
- Builds passed: app, Console app, stats app, `packages/web` (Astro), and `services/www` (Astro, Pagefind, link validation, Cloudflare preparation).
- Build output contained existing warnings: Vite CSS pseudo-element/chunk notices, duplicate Starlight component overrides, Cloudflare Node compatibility notices, and Console asset-size warnings. The `packages/web` build required the bundled Bun directory on `PATH` for its schema hook.
- No tests were run, as instructed.
