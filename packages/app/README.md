# Nytrix Web App

The Nytrix web client is a SolidJS app in this package. Install dependencies from the repository root, then run app scripts from `packages/app`.

## Development

```bash
bun install
bun dev
```

The app uses the local Nytrix service at `http://localhost:4096` by default. Start it from the repository root with `bun dev serve --port 4096`.

## Build

```bash
bun run build
```

The production assets are written to `dist/`.

## Browser checks

The Playwright suites use isolated Nytrix API fixtures. Install Chromium and run them from this package:

```bash
bunx playwright install chromium
bun run test:e2e:local
```

To use a running app instead of starting one, set `PLAYWRIGHT_BASE_URL`. For a production build, also set `PLAYWRIGHT_BUILD=1`:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4444 bun run test:e2e
PLAYWRIGHT_BUILD=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:4444 bun run test:e2e
```

## Server configuration

`VITE_NYTRIX_SERVER_MODE` controls the initial server:

| Mode | Initial server |
| --- | --- |
| `none` | No initial server. |
| `origin` (default) | The current page's origin. |

During Vite development, `VITE_NYTRIX_SERVER_HOST` and `VITE_NYTRIX_SERVER_PORT` select the local API address; the defaults are `localhost` and `4096`. Both modes restore user-added servers from storage. The desktop app discovers or starts its local service during native initialization.

To connect through an HTTPS reverse proxy, run `nytrix pair --url https://nytrix.example.com` with the public address for that deployment. The proxy must route `/api` to the Nytrix service and preserve that path. Pairing links are single-use and require HTTPS outside localhost.

## Deployment

Deployment workflows are disabled until a Nytrix-owned domain, cloud resources, and credentials are configured. See the repository's [deployment setup](../../DEPLOYMENT.md) before enabling them. No public Nytrix domain is assumed by this package.
