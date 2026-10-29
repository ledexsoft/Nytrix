import path from "path"
import fs from "fs"
import os from "os"
import { Context, Effect, Layer, Option, Schema } from "effect"
// XDG on runtimes with a home directory; one tmp-rooted directory on workerd.
// The variants resolve through the `workerd` bundle condition, like the
// native-module stubs, so no runtime sniffing happens here.
import { roots } from "#global-roots"
import { Flock } from "./flock.js"
import { makeGlobalNode } from "./effect/app-node.js"

const app = "nytrix"
const { data, cache, config, state, tmp } = roots(app)
const legacy = roots("opencode")
const decodeRegistration = Schema.decodeUnknownOption(
  Schema.fromJsonString(Schema.Struct({ pid: Schema.Int.check(Schema.isGreaterThan(0)), url: Schema.String })),
)

const paths = {
  get home() {
    return process.env.NYTRIX_TEST_HOME ?? os.homedir()
  },
  data,
  bin: path.join(cache, "bin"),
  log: path.join(data, "log"),
  repos: path.join(data, "repos"),
  cache,
  config,
  state,
  tmp,
}

export const Path = paths

Flock.setGlobal({ state })

export class Service extends Context.Service<Service, Interface>()("@nytrix/Global") {}

export interface Interface {
  readonly home: string
  readonly data: string
  readonly cache: string
  readonly config: string
  readonly state: string
  readonly tmp: string
  readonly bin: string
  readonly log: string
  readonly repos: string
}

export function make(input: Partial<Interface> = {}): Interface {
  // The acquired service canonicalizes default tmp; use it instead of Path.tmp for path comparisons.
  return {
    home: Path.home,
    data: Path.data,
    cache: Path.cache,
    config: Path.config,
    state: Path.state,
    tmp: input.tmp ?? Path.tmp,
    bin: Path.bin,
    log: Path.log,
    repos: Path.repos,
    ...input,
  }
}

const acquire = (input: Partial<Interface>) =>
  Effect.gen(function* () {
    const service = Service.of(make(input))
    yield* Effect.promise(() => migrateGlobal(service))
    yield* Effect.promise(() =>
      Promise.all(
        [service.data, service.config, service.state, service.log, service.bin, service.repos, service.tmp].map(
          (directory) => fs.promises.mkdir(directory, { recursive: true }),
        ),
      ),
    )
    const canonicalTmp = yield* Effect.promise(() => fs.promises.realpath(service.tmp))
    return Service.of({ ...service, tmp: input.tmp ?? canonicalTmp })
  })

const layer = Layer.effect(
  Service,
  Effect.suspend(() => acquire({ config: process.env.NYTRIX_CONFIG_DIR ?? Path.config })),
)

export const node = makeGlobalNode({ service: Service, layer: layer, deps: [] })

export const layerWith = (input: Partial<Interface>) => Layer.effect(Service, acquire(input))

async function present(file: string) {
  return fs.promises.lstat(file).then(
    () => true,
    (error: unknown) => {
      if (code(error) === "ENOENT") return false
      throw error
    },
  )
}

function code(error: unknown) {
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string") return error.code
}

async function migrateGlobal(service: Interface) {
  const entries = [
    ...(service.data === Path.data ? [{ source: legacy.data, destination: service.data }] : []),
    ...(service.config === Path.config ? [{ source: legacy.config, destination: service.config, config: true }] : []),
    ...(service.state === Path.state
      ? [{ source: path.join(legacy.state, "kv.json"), destination: path.join(service.state, "kv.json") }]
      : []),
    {
      source: path.join(service.home, ".opencode"),
      destination: path.join(service.home, ".nytrix"),
      config: true,
      excludeBin: true,
    },
  ]
  const pending = (
    await Promise.all(
      entries.map(async (entry) => {
        const receipt = `${entry.destination}.nytrix-migration-complete`
        if (await present(receipt)) return undefined
        const destination = await present(entry.destination)
        const source = await present(entry.source)
        if (destination) {
          if (source) await fs.promises.writeFile(receipt, "Nytrix global migration v1\n", { flag: "wx" }).catch(ignoreExists)
          return undefined
        }
        if (!source) return undefined
        return { ...entry, receipt }
      }),
    )
  ).filter((entry) => entry !== undefined)
  if (!pending.length) return
  await legacyStopped()
  await Promise.all(
    pending.map(async (entry) => {
      await migrate(entry.source, entry.destination, entry)
      if (await present(entry.destination))
        await fs.promises.writeFile(entry.receipt, "Nytrix global migration v1\n", { flag: "wx" }).catch(ignoreExists)
    }),
  )
}

function ignoreExists(error: unknown) {
  if (code(error) === "EEXIST") return
  throw error
}

async function legacyStopped() {
  const files = await fs.promises.readdir(legacy.state).catch((error: unknown) => {
    if (code(error) === "ENOENT") return []
    throw error
  })
  for (const file of files.filter((file) => /^service(?:-.*)?\.json$/.test(file))) {
    const text = await fs.promises.readFile(path.join(legacy.state, file), "utf8").catch((error: unknown) => {
      if (code(error) === "ENOENT") return undefined
      throw error
    })
    const registration = decodeRegistration(text)
    if (Option.isNone(registration)) continue
    const running = await Promise.resolve()
      .then(() => process.kill(registration.value.pid, 0))
      .then(
        () => true,
        (error: unknown) => {
          if (code(error) === "ESRCH") return false
          if (code(error) === "EPERM") return true
          throw error
        },
      )
    if (running)
      throw new Error(
        "Stop the OpenCode background service with `opencode service stop`, then restart Nytrix to migrate your data safely.",
      )
  }
}

async function migrate(source: string, destination: string, options: { config?: boolean; excludeBin?: boolean } = {}) {
  if ((await present(destination)) || !(await present(source))) return
  await fs.promises.mkdir(path.dirname(destination), { recursive: true })
  const staging = await fs.promises.mkdtemp(path.join(path.dirname(destination), ".nytrix-migration-"))
  await fs.promises
    .cp(source, path.join(staging, "data"), {
      recursive: true,
      preserveTimestamps: true,
      filter: (file) => !options.excludeBin || file !== path.join(source, "bin"),
    })
    .then(async () => {
      if (options.config) {
        for (const [previous, current] of [
          ["opencode.json", "nytrix.json"],
          ["opencode.jsonc", "nytrix.jsonc"],
        ]) {
          if (!(await present(path.join(staging, "data", previous)))) continue
          if (await present(path.join(staging, "data", current))) continue
          await fs.promises.rename(path.join(staging, "data", previous), path.join(staging, "data", current))
        }
      }
      if (await present(destination)) return
      await fs.promises.rename(path.join(staging, "data"), destination)
    })
    .finally(() => fs.promises.rm(staging, { recursive: true, force: true }))
}

export * as Global from "./global.js"
