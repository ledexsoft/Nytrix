import type { ElectronAPI } from "../api-types"

const deepLinkEvent = "nytrix:deep-link"

export function startDeepLinks(api: ElectronAPI) {
  void api.consumeInitialDeepLinks().then(emitDeepLinks)
  api.onDeepLink(emitDeepLinks)
}

function emitDeepLinks(urls: string[]) {
  if (urls.length === 0) return
  window.__NYTRIX__ ??= {}
  window.__NYTRIX__.deepLinks = [...(window.__NYTRIX__.deepLinks ?? []), ...urls]
  window.dispatchEvent(new CustomEvent(deepLinkEvent, { detail: { urls } }))
}
