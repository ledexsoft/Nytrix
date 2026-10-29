# Nytrix changelog Worker

The Worker renders the repository's `CHANGELOG.md` at `/changelog`. It fetches the current file from the `dev` branch on GitHub and caches the response at the Cloudflare edge.

The repository does not include a provisioned Cloudflare account or public domain. Configure `CLOUDFLARE_API_TOKEN` in the GitHub deployment environment. Deployments use the generated `workers.dev` URL until a Nytrix-owned domain and route are provisioned.

The Worker exposes `GET /changelog`, redirects `/changelog/` to `/changelog`, and redirects `/changelog/<version>` to that release's heading. The root path redirects to `/changelog`.

Enable repository deployment workflows by setting `NYTRIX_DEPLOYMENTS_ENABLED=true` after configuring credentials and resources.
