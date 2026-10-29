import { Option, Schema } from "effect"

declare const NYTRIX_VERSION: string
declare const NYTRIX_CHANNEL: string
declare const NYTRIX_ARTIFACT: string
declare const NYTRIX_RELEASE_HIGHLIGHTS: string

const version = typeof NYTRIX_VERSION === "string" ? NYTRIX_VERSION : "local"
const channel = typeof NYTRIX_CHANNEL === "string" ? NYTRIX_CHANNEL : "local"
const artifact = typeof NYTRIX_ARTIFACT === "string" ? NYTRIX_ARTIFACT : "cli"
// Stable release builds embed the release notes' Highlights; every other build has none.
const highlights =
  typeof NYTRIX_RELEASE_HIGHLIGHTS === "string"
    ? Option.getOrElse(
        Schema.decodeUnknownOption(
          Schema.fromJsonString(Schema.Array(Schema.Struct({ title: Schema.String, body: Schema.String }))),
        )(NYTRIX_RELEASE_HIGHLIGHTS),
        () => [],
      )
    : []

export {
  version as NYTRIX_VERSION,
  channel as NYTRIX_CHANNEL,
  artifact as NYTRIX_ARTIFACT,
  highlights as NYTRIX_HIGHLIGHTS,
}
export const NYTRIX_LOCAL = channel === "local"
