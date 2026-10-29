export * as ConfigMigration from "./migrate.js"

import path from "path"
import { Effect } from "effect"
import { FSUtil } from "@nytrix/util/fs-util"

const files = [
  ["opencode.json", "nytrix.json"],
  ["opencode.jsonc", "nytrix.jsonc"],
] as const
const marker = "Nytrix config migration v1\n"
const complete = ".nytrix-migration-complete"

export const directory = Effect.fn("ConfigMigration.directory")(function* (directory: string, project = false) {
  const fs = yield* FSUtil.Service
  const entries: ReadonlyArray<readonly [string, string]> = project ? [...files, [".opencode", ".nytrix"]] : files
  const staging = path.join(directory, ".nytrix-migration")
  const receipt = path.join(directory, complete)
  if (yield* fs.exists(receipt)) return
  if (!(yield* fs.exists(staging))) {
    // A new config source opts this ancestor out of the entire legacy group.
    if ((yield* Effect.filter(entries, ([, name]) => fs.exists(path.join(directory, name)))).length) {
      if ((yield* Effect.filter(entries, ([name]) => fs.exists(path.join(directory, name)))).length)
        yield* fs.writeFileString(receipt, marker)
      return
    }
    const sources = yield* Effect.filter(entries, ([name]) => fs.exists(path.join(directory, name)))
    if (!sources.length) return
    const temporary = yield* fs.makeTempDirectory({ directory, prefix: ".nytrix-migration-" })
    yield* Effect.gen(function* () {
      yield* Effect.forEach(sources, ([source, destination]) =>
        fs.copy(path.join(directory, source), path.join(temporary, destination), { preserveTimestamps: true }),
      )
      const config = path.join(temporary, ".nytrix")
      if (yield* fs.isDir(config)) {
        yield* Effect.forEach(files, ([source, destination]) =>
          Effect.gen(function* () {
            if (!(yield* fs.exists(path.join(config, source)))) return
            if (yield* fs.exists(path.join(config, destination))) return
            yield* fs.rename(path.join(config, source), path.join(config, destination))
          }),
        )
      }
      yield* fs.writeFileString(path.join(temporary, "ready"), marker)
      if (yield* fs.exists(staging)) return
      yield* fs.rename(temporary, staging)
    }).pipe(Effect.ensuring(fs.remove(temporary, { recursive: true, force: true }).pipe(Effect.ignore)))
  }

  if ((yield* fs.readFileStringSafe(path.join(staging, "ready"))) !== marker)
    return yield* Effect.fail(
      new FSUtil.FileSystemError({
        method: "config.migrate",
        cause: new Error(`Reserved migration directory already exists: ${staging}`),
      }),
    )

  // If a Nytrix source appeared while an interrupted copy was staged, the new
  // source wins for the whole group. Keep moved files and the legacy sources;
  // discard only the uncommitted remainder so it cannot fill future gaps.
  if ((yield* Effect.filter(entries, ([, name]) => fs.exists(path.join(directory, name)))).length) {
    yield* fs.remove(staging, { recursive: true, force: true })
    yield* fs.writeFileString(receipt, marker)
    return
  }

  // A completed stage survives interruption between target renames. Resume only
  // its missing targets; any destination created meanwhile remains authoritative.
  yield* Effect.forEach(entries, ([, name]) =>
    Effect.gen(function* () {
      if (!(yield* fs.exists(path.join(staging, name)))) return
      if (yield* fs.exists(path.join(directory, name))) return
      yield* fs.rename(path.join(staging, name), path.join(directory, name))
    }),
  )
  yield* fs.remove(staging, { recursive: true, force: true })
  yield* fs.writeFileString(receipt, marker)
})
