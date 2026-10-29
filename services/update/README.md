# Legacy update Worker

Nytrix desktop updates, CLI upgrade releases, Console downloads, and desktop release notes use GitHub Releases from `ledexsoft/Nytrix`. This Worker is retained as a self-hosted legacy service and is not part of the release workflow.

Do not deploy it against the former OpenCode Cloudflare account or domains. To self-host it, provision a Cloudflare account, zone, D1 database, and Workers Access policy owned by your deployment. Configure the D1 ID and routes in `wrangler.jsonc`, and set `NYTRIX_UPDATE_AUDIENCE`, `NYTRIX_GITHUB_REPOSITORY`, `NYTRIX_GITHUB_REPOSITORY_ID`, and `NYTRIX_GITHUB_OWNER_ID` for the release workflow you own. The repository does not provide those resources or credentials.

When self-hosted, the Worker supports `GET /api/<channel>` to list channel artifacts; `GET /api/<channel>/<name>` and `GET /api/<channel>/<name>/<distribution>` to query releases; and `GET /api/<channel>/<name>/<distribution>/<filename>` for an artifact or desktop update manifest. Admin pages and mutations live under `/admin`, `/admin/activate`, `/admin/minimum`, and `/admin/rollout`; protect those paths with your own Cloudflare Access application. To mount the service below a path prefix, configure that route and keep the Worker request path prefixed with `/update`.
