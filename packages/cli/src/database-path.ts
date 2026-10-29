import path from "node:path"
import { NYTRIX_CHANNEL } from "./version"

export function databasePath(data: string) {
  const filename =
    process.env.NYTRIX_DB ??
    (["latest", "dev", "beta", "next", "prod"].includes(NYTRIX_CHANNEL) ||
    process.env.NYTRIX_DISABLE_CHANNEL_DB === "1" ||
    process.env.NYTRIX_DISABLE_CHANNEL_DB === "true"
      ? "nytrix.db"
      : `nytrix-${NYTRIX_CHANNEL.replace(/[^a-zA-Z0-9._-]/g, "-")}.db`)
  return filename === ":memory:" ? filename : path.resolve(data, filename)
}
