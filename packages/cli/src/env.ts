import { Config } from "effect"

// Every environment variable the CLI reads, in one place. Consumers yield
// these instead of touching process.env so the full surface stays visible,
// typed, and redacted where secret.

// The Nytrix server password: sent by clients connecting to an explicit
// --server, and adopted by a manually run or standalone server.
export const password = Config.Redacted("NYTRIX_PASSWORD").pipe(Config.withDefault(undefined))
export const serverUsername = Config.String("NYTRIX_SERVER_USERNAME").pipe(Config.withDefault("nytrix"))

export function session() {
  return Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] =>
        entry[1] !== undefined && entry[0] !== "NYTRIX_PASSWORD" && entry[0] !== "NYTRIX_SERVER_USERNAME",
    ),
  )
}

export * as Env from "./env"
