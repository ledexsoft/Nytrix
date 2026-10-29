# Nytrix

Use this guide for questions about Nytrix, its CLI, TUI, desktop and web apps, configuration, providers, plugins, tools, server, client API, or development.

Use the checked-out source and its current documentation as the source of truth. Start with the relevant package under `packages/` and the corresponding page under `packages/web/src/content/docs/`. Do not assume that upstream OpenCode documentation describes Nytrix accurately.

## Configuration and migration

Nytrix uses `nytrix.json` or `nytrix.jsonc` and `.nytrix/` for project configuration. Global configuration uses Nytrix-specific directories and `NYTRIX_*` environment variables. Existing OpenCode configuration may be copied to Nytrix locations during migration; keep the original intact and treat it as migration input.

The configuration schema is generated from `packages/schema/script/config-schema.ts`. A public Nytrix schema URL is not configured. Do not copy the upstream OpenCode schema URL into Nytrix configuration examples.

## External integrations

OpenCode Zen, OpenCode Go, OpenCode Console, provider IDs such as `opencode`, and the MCP metadata key `ai.opencode/sessionID` identify external services or interoperability contracts. Keep those names when discussing those integrations. They are not Nytrix's product identity.
