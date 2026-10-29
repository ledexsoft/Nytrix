# Deployment setup

Repository deployment workflows are disabled until the repository variable `NYTRIX_DEPLOYMENTS_ENABLED` is set to `true`. Configure it only after the resources and credentials below belong to your Nytrix deployment.

## SST application

The SST app requires these environment variables and resources:

- `NYTRIX_DOMAIN`: base domain provisioned for Nytrix.
- `NYTRIX_CLOUDFLARE_ZONE_ID`: Cloudflare zone containing the base domain. The share Worker uses `share.<base-domain>` in production and `share.<stage>.<base-domain>` in other SST stages; provision these hostnames in that zone.
- `CLOUDFLARE_API_TOKEN`: token scoped to the Nytrix zone and Workers resources.
- `AWS_DEPLOY_ROLE_ARN`: IAM role in the AWS account that owns deployment resources.
- `PLANETSCALE_SERVICE_TOKEN_NAME` and `PLANETSCALE_SERVICE_TOKEN`: PlanetScale credentials for the Nytrix database.
- `NYTRIX_STATS_DATABASE_NAME` and `NYTRIX_PLANETSCALE_ORGANIZATION`: provisioned PlanetScale stats database and organization.
- `STRIPE_SECRET_KEY_DEV` and `STRIPE_SECRET_KEY_PROD`: Stripe keys for the corresponding stages.
- `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `WEB_SENTRY_PROJECT`, and `WEB_SENTRY_DSN`: Sentry project settings.
- SST secrets used by the API and Console, including GitHub App, email, hCaptcha, Salesforce, and enterprise spam-scoring credentials.

Local SST deployments use the `nytrix-production` or `nytrix-dev` AWS CLI profile, selected by stage. Set `NYTRIX_AWS_PROFILE` to use another configured profile.

## Cloudflare service Workers

The changelog and files workflows use the `CLOUDFLARE_API_TOKEN` secret in their GitHub environment. The file Worker also requires R2 buckets named `nytrix-dev-files` and `nytrix-production-files`. Worker routes are not bound to any public domain; configure a Nytrix-owned domain and route in Cloudflare after provisioning it.

The former hosted update Worker is no longer deployed by this repository. Nytrix releases and desktop updates use GitHub Releases. Its source remains under `services/update` for optional self-hosting and requires a separately provisioned D1 database and access policy.

## GitHub release signing

The release workflow publishes dev and beta prereleases plus a stable `latest` release. Configure these in the GitHub `release` environment before enabling releases:

- `RELEASE_TAG_KEY` for pushing stable version tags.
- `APPLE_SIGNING_CERTIFICATE`, `APPLE_NOTARY_KEY`, `APPLE_NOTARY_KEY_ID`, and `APPLE_NOTARY_ISSUER_ID` for macOS signing and notarization.
- `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_TRUSTED_SIGNING_ENDPOINT`, `AZURE_TRUSTED_SIGNING_ACCOUNT_NAME`, and `AZURE_TRUSTED_SIGNING_CERTIFICATE_PROFILE` for Windows signing.
- An npm trusted publisher relationship for this repository and workflow before publishing `@nytrix/*` packages.

GitHub Releases are the desktop updater and download source. No Nytrix-owned public domain is assumed by the release workflow.
