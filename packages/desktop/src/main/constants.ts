import { app } from "electron"

type Channel = "local" | "dev" | "beta" | "prod"

const raw = import.meta.env.NYTRIX_CHANNEL

export const CHANNEL: Channel = raw === "local" || raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"

export const VERSION = app.isPackaged ? app.getVersion() : (process.env.NYTRIX_VERSION ?? app.getVersion())

const appNames: Record<string, string> = {
  dev: "Nytrix Dev",
  beta: "Nytrix Beta",
  prod: "Nytrix",
}

const appIDs: Record<string, string> = {
  dev: "ai.nytrix.desktop.dev",
  beta: "ai.nytrix.desktop.beta",
  prod: "ai.nytrix.desktop",
}

// Local renderer/server mode keeps the dev application identity.
export const APP_NAME = app.isPackaged ? appNames[CHANNEL] : "Nytrix Dev"

export const APP_ID = app.isPackaged ? appIDs[CHANNEL] : "ai.nytrix.desktop.dev"
