const baseDomain = process.env.NYTRIX_DOMAIN
if (!baseDomain) throw new Error("NYTRIX_DOMAIN must name a domain provisioned for this Nytrix deployment")

export const domain = (() => {
  if ($app.stage === "production") return baseDomain
  if ($app.stage === "dev") return `dev.${baseDomain}`
  return `${$app.stage}.dev.${baseDomain}`
})()

export const shortDomain = (() => {
  if ($app.stage === "production") return `share.${baseDomain}`
  return `share.${$app.stage}.${baseDomain}`
})()

export const zoneID = process.env.NYTRIX_CLOUDFLARE_ZONE_ID
if (!zoneID) throw new Error("NYTRIX_CLOUDFLARE_ZONE_ID must identify the Nytrix Cloudflare zone")
export const awsStage = $app.stage === "production" ? "production" : "dev"
export const deployAws = $app.stage === awsStage

new cloudflare.RegionalHostname("RegionalHostname", {
  hostname: domain,
  regionKey: "us",
  zoneId: zoneID,
})
