# Nytrix file service

This optional Cloudflare Worker serves public files from stage-specific R2 buckets. The repository does not include a provisioned Cloudflare account, zone, or bucket.

Its public route is `GET /files/*` (with `HEAD` and CORS `OPTIONS` support); the Worker strips `/files/` and reads the remainder as the R2 object key. No upload, listing, or directory route is exposed.

Before deploying, create the `nytrix-dev-files` and `nytrix-production-files` buckets in your Cloudflare account. Configure `CLOUDFLARE_API_TOKEN` with Workers and R2 permissions in the GitHub environments used for deployment. The Worker is exposed through its generated `workers.dev` URL until you add a domain and route provisioned for your deployment.

Store objects without a `files/` prefix. Uploads require authenticated R2 access.

Set HTTP metadata when uploading:

- `Content-Type`: the actual media type, such as `video/mp4`, `image/png`, or `application/gzip`.
- `Content-Disposition`: use `attachment; filename="..."` when a file should download rather than display inline.
- `Cache-Control`: defaults to `public, max-age=3600` (one hour). Use `public, max-age=31536000, immutable` for versioned or content-addressed files.

To enable repository deployment workflows, set the repository variable `NYTRIX_DEPLOYMENTS_ENABLED` to `true` after configuring the Cloudflare credentials and resources.
