import type { APIEvent } from "@solidjs/start"
import type { DownloadPlatform } from "../types"

const prodAssetNames: Record<string, string> = {
  "darwin-aarch64-dmg": "nytrix-desktop-mac-arm64.dmg",
  "darwin-x64-dmg": "nytrix-desktop-mac-x64.dmg",
  "windows-aarch64-nsis": "nytrix-desktop-win-arm64.exe",
  "windows-x64-nsis": "nytrix-desktop-win-x64.exe",
  "linux-x64-deb": "nytrix-desktop-linux-x64.deb",
  "linux-x64-appimage": "nytrix-desktop-linux-x64.AppImage",
  "linux-x64-rpm": "nytrix-desktop-linux-x64.rpm",
} satisfies Record<DownloadPlatform, string>

const betaAssetNames: Record<string, string> = {
  "darwin-aarch64-dmg": "nytrix-desktop-mac-arm64.dmg",
  "darwin-x64-dmg": "nytrix-desktop-mac-x64.dmg",
  "windows-aarch64-nsis": "nytrix-desktop-win-arm64.exe",
  "windows-x64-nsis": "nytrix-desktop-win-x64.exe",
  "linux-x64-deb": "nytrix-desktop-linux-x64.deb",
  "linux-x64-appimage": "nytrix-desktop-linux-x64.AppImage",
  "linux-x64-rpm": "nytrix-desktop-linux-x64.rpm",
} satisfies Record<DownloadPlatform, string>

export async function GET({ params: { platform, channel } }: APIEvent) {
  if (channel !== "stable" && channel !== "beta") return new Response(null, { status: 404 })
  const assetName = channel === "stable" ? prodAssetNames[platform] : betaAssetNames[platform]
  if (!assetName) return new Response(null, { status: 404 })

  const response = await fetch("https://api.github.com/repos/ledexsoft/Nytrix/releases?per_page=100", {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "Nytrix-Console" },
  })
  if (!response.ok) return new Response(null, { status: response.status })
  const releases = await response.json()
  if (!Array.isArray(releases)) return new Response(null, { status: 502 })
  const release = releases.find((item) =>
    channel === "stable"
      ? item?.draft !== true && item?.prerelease !== true && item?.tag_name?.startsWith("v")
      : item?.draft !== true && item?.prerelease === true && item?.tag_name?.includes("-beta-"),
  )
  const location = getAssetUrl(release, assetName)
  if (!location) return new Response(null, { status: 502 })
  return Response.redirect(location, 302)
}

function getAssetUrl(input: unknown, assetName: string) {
  if (!isRecord(input) || !Array.isArray(input.assets)) return
  const asset = input.assets.find((item) => isRecord(item) && item.name === assetName)
  if (!isRecord(asset) || typeof asset.browser_download_url !== "string") return
  return asset.browser_download_url
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input)
}
