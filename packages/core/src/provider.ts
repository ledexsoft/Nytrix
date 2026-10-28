export * as Provider from "./provider.js"

import { Context, Effect, Layer, Option, Schema, Stream, Struct } from "effect"
import { Provider } from "@nytrix/schema/provider"
import { Model } from "@nytrix/schema/model"
import { makeLocationNode } from "@nytrix/util/effect/app-node"
import { HttpTimeout, type ProviderPackageDefinition } from "@nytrix/ai/effect"
import { isRecord } from "@nytrix/util/record"
import { Npm } from "@nytrix/util/npm"
import type { DeepMutable } from "./schema.js"
import { importModule, resolveModule } from "@nytrix/util/runtime-import"
import { Bus } from "./bus.js"
import { Integration } from "./integration.js"
import { State } from "./state.js"
import { IntegrationConnection } from "./integration/connection.js"
import { Credential } from "@nytrix/schema/credential"
import { Location } from "./location.js"
import { freeze } from "immer"
import { AISDKNative } from "./aisdk-native.js"

export const ID = Provider.ID
export type ID = typeof ID.Type

export const AISDK_PREFIX = "aisdk:"
export const isAISDK = (value: string | undefined): value is string => value?.startsWith(AISDK_PREFIX) ?? false
export const aisdk = (value: string) => (isAISDK(value) ? value : `${AISDK_PREFIX}${value}`)
export function packageName(value: string): string
export function packageName(value: undefined): undefined
export function packageName(value: string | undefined): string | undefined
export function packageName(value: string | undefined) {
  // Native provider entrypoints can persist in user configuration across the npm scope migration.
  if (value?.startsWith("@opencode-ai/ai/")) return value.replace("@opencode-ai/", "@nytrix/")
  if (value === undefined || !isAISDK(value)) return value
  return value.slice(AISDK_PREFIX.length)
}

type Json = Schema.Schema.Type<typeof Schema.Json>
const JsonRecord = Schema.Record(Schema.String, Schema.Json)
const decodeJsonRecord = Schema.decodeUnknownSync(JsonRecord)

export class LoadError extends Schema.TaggedError<LoadError>()("Provider.LoadError", {
  package: Schema.String,
  cause: Schema.Defect(),
}) {}
export type ProviderPackage = ProviderPackageDefinition

const packages = new Map<string, Promise<unknown>>()
const builtins = new Map<string, () => Promise<unknown>>([
  ["@nytrix/ai/providers/alibaba", () => import("@nytrix/ai/providers/alibaba")],
  ["@nytrix/ai/providers/alibaba/chat", () => import("@nytrix/ai/providers/alibaba/chat")],
  ["@nytrix/ai/providers/alibaba/messages", () => import("@nytrix/ai/providers/alibaba/messages")],
  ["@nytrix/ai/providers/alibaba/responses", () => import("@nytrix/ai/providers/alibaba/responses")],
  ["@nytrix/ai/providers/alibaba/images", () => import("@nytrix/ai/providers/alibaba/images")],
  ["@nytrix/ai/providers/amazon-bedrock", () => import("@nytrix/ai/providers/amazon-bedrock")],
  ["@nytrix/ai/providers/amazon-bedrock/mantle", () => import("@nytrix/ai/providers/amazon-bedrock/mantle")],
  [
    "@nytrix/ai/providers/amazon-bedrock/mantle/chat",
    () => import("@nytrix/ai/providers/amazon-bedrock/mantle/chat"),
  ],
  [
    "@nytrix/ai/providers/amazon-bedrock/mantle/messages",
    () => import("@nytrix/ai/providers/amazon-bedrock/mantle/messages"),
  ],
  [
    "@nytrix/ai/providers/amazon-bedrock/mantle/responses",
    () => import("@nytrix/ai/providers/amazon-bedrock/mantle/responses"),
  ],
  ["@nytrix/ai/providers/anthropic", () => import("@nytrix/ai/providers/anthropic")],
  ["@nytrix/ai/providers/anthropic-compatible", () => import("@nytrix/ai/providers/anthropic-compatible")],
  ["@nytrix/ai/providers/azure", () => import("@nytrix/ai/providers/azure")],
  ["@nytrix/ai/providers/azure/chat", () => import("@nytrix/ai/providers/azure/chat")],
  ["@nytrix/ai/providers/azure/responses", () => import("@nytrix/ai/providers/azure/responses")],
  ["@nytrix/ai/providers/azure/images", () => import("@nytrix/ai/providers/azure/images")],
  ["@nytrix/ai/providers/baseten", () => import("@nytrix/ai/providers/baseten")],
  ["@nytrix/ai/providers/baseten/decisions", () => import("@nytrix/ai/providers/baseten/decisions")],
  ["@nytrix/ai/providers/cerebras", () => import("@nytrix/ai/providers/cerebras")],
  ["@nytrix/ai/providers/cloudflare-ai-gateway", () => import("@nytrix/ai/providers/cloudflare-ai-gateway")],
  [
    "@nytrix/ai/providers/cloudflare-ai-gateway/decisions",
    () => import("@nytrix/ai/providers/cloudflare-ai-gateway/decisions"),
  ],
  ["@nytrix/ai/providers/cloudflare-workers-ai", () => import("@nytrix/ai/providers/cloudflare-workers-ai")],
  [
    "@nytrix/ai/providers/cloudflare-workers-ai/decisions",
    () => import("@nytrix/ai/providers/cloudflare-workers-ai/decisions"),
  ],
  [
    "@nytrix/ai/providers/cloudflare-workers-ai/images",
    () => import("@nytrix/ai/providers/cloudflare-workers-ai/images"),
  ],
  ["@nytrix/ai/providers/cohere", () => import("@nytrix/ai/providers/cohere")],
  ["@nytrix/ai/providers/cohere/chat", () => import("@nytrix/ai/providers/cohere/chat")],
  ["@nytrix/ai/providers/deepinfra", () => import("@nytrix/ai/providers/deepinfra")],
  ["@nytrix/ai/providers/deepseek", () => import("@nytrix/ai/providers/deepseek")],
  ["@nytrix/ai/providers/digitalocean", () => import("@nytrix/ai/providers/digitalocean")],
  ["@nytrix/ai/providers/digitalocean/decisions", () => import("@nytrix/ai/providers/digitalocean/decisions")],
  ["@nytrix/ai/providers/digitalocean/images", () => import("@nytrix/ai/providers/digitalocean/images")],
  ["@nytrix/ai/providers/digitalocean/responses", () => import("@nytrix/ai/providers/digitalocean/responses")],
  ["@nytrix/ai/providers/fireworks", () => import("@nytrix/ai/providers/fireworks")],
  ["@nytrix/ai/providers/google", () => import("@nytrix/ai/providers/google")],
  ["@nytrix/ai/providers/google/interactions", () => import("@nytrix/ai/providers/google/interactions")],
  ["@nytrix/ai/providers/google/images", () => import("@nytrix/ai/providers/google/images")],
  ["@nytrix/ai/providers/google-vertex", () => import("@nytrix/ai/providers/google-vertex")],
  ["@nytrix/ai/providers/google-vertex/chat", () => import("@nytrix/ai/providers/google-vertex/chat")],
  ["@nytrix/ai/providers/google-vertex/gemini", () => import("@nytrix/ai/providers/google-vertex/gemini")],
  [
    "@nytrix/ai/providers/google-vertex/interactions",
    () => import("@nytrix/ai/providers/google-vertex/interactions"),
  ],
  ["@nytrix/ai/providers/google-vertex/messages", () => import("@nytrix/ai/providers/google-vertex/messages")],
  ["@nytrix/ai/providers/google-vertex/mistral", () => import("@nytrix/ai/providers/google-vertex/mistral")],
  ["@nytrix/ai/providers/google-vertex/responses", () => import("@nytrix/ai/providers/google-vertex/responses")],
  ["@nytrix/ai/providers/google-vertex/images", () => import("@nytrix/ai/providers/google-vertex/images")],
  ["@nytrix/ai/providers/google-vertex-messages", () => import("@nytrix/ai/providers/google-vertex-messages")],
  ["@nytrix/ai/providers/groq", () => import("@nytrix/ai/providers/groq")],
  ["@nytrix/ai/providers/meta", () => import("@nytrix/ai/providers/meta")],
  ["@nytrix/ai/providers/meta/chat", () => import("@nytrix/ai/providers/meta/chat")],
  ["@nytrix/ai/providers/meta/messages", () => import("@nytrix/ai/providers/meta/messages")],
  ["@nytrix/ai/providers/meta/responses", () => import("@nytrix/ai/providers/meta/responses")],
  ["@nytrix/ai/providers/minimax", () => import("@nytrix/ai/providers/minimax")],
  ["@nytrix/ai/providers/minimax/chat", () => import("@nytrix/ai/providers/minimax/chat")],
  ["@nytrix/ai/providers/minimax/images", () => import("@nytrix/ai/providers/minimax/images")],
  ["@nytrix/ai/providers/minimax/messages", () => import("@nytrix/ai/providers/minimax/messages")],
  ["@nytrix/ai/providers/minimax/responses", () => import("@nytrix/ai/providers/minimax/responses")],
  ["@nytrix/ai/providers/mistral", () => import("@nytrix/ai/providers/mistral")],
  ["@nytrix/ai/providers/moonshot", () => import("@nytrix/ai/providers/moonshot")],
  ["@nytrix/ai/providers/moonshot/chat", () => import("@nytrix/ai/providers/moonshot/chat")],
  ["@nytrix/ai/providers/moonshot/messages", () => import("@nytrix/ai/providers/moonshot/messages")],
  ["@nytrix/ai/providers/moonshot/responses", () => import("@nytrix/ai/providers/moonshot/responses")],
  ["@nytrix/ai/providers/openai", () => import("@nytrix/ai/providers/openai")],
  ["@nytrix/ai/providers/openai/chat", () => import("@nytrix/ai/providers/openai/chat")],
  ["@nytrix/ai/providers/openai/responses", () => import("@nytrix/ai/providers/openai/responses")],
  ["@nytrix/ai/providers/openai/images", () => import("@nytrix/ai/providers/openai/images")],
  ["@nytrix/ai/providers/openai-compatible", () => import("@nytrix/ai/providers/openai-compatible")],
  [
    "@nytrix/ai/providers/openai-compatible/responses",
    () => import("@nytrix/ai/providers/openai-compatible/responses"),
  ],
  ["@nytrix/ai/providers/openai-compatible/images", () => import("@nytrix/ai/providers/openai-compatible/images")],
  [
    "@nytrix/ai/providers/openai-compatible-responses",
    () => import("@nytrix/ai/providers/openai-compatible-responses"),
  ],
  ["@nytrix/ai/providers/opencode/decisions", () => import("@nytrix/ai/providers/opencode/decisions")],
  ["@nytrix/ai/providers/openrouter", () => import("@nytrix/ai/providers/openrouter")],
  ["@nytrix/ai/providers/openrouter/decisions", () => import("@nytrix/ai/providers/openrouter/decisions")],
  ["@nytrix/ai/providers/openrouter/images", () => import("@nytrix/ai/providers/openrouter/images")],
  ["@nytrix/ai/providers/openrouter/responses", () => import("@nytrix/ai/providers/openrouter/responses")],
  ["@nytrix/ai/providers/togetherai", () => import("@nytrix/ai/providers/togetherai")],
  ["@nytrix/ai/providers/typesafe-ai/decisions", () => import("@nytrix/ai/providers/typesafe-ai/decisions")],
  ["@nytrix/ai/providers/venice", () => import("@nytrix/ai/providers/venice")],
  ["@nytrix/ai/providers/venice/responses", () => import("@nytrix/ai/providers/venice/responses")],
  ["@nytrix/ai/providers/vercel-ai-gateway", () => import("@nytrix/ai/providers/vercel-ai-gateway")],
  ["@nytrix/ai/providers/vercel-ai-gateway/chat", () => import("@nytrix/ai/providers/vercel-ai-gateway/chat")],
  [
    "@nytrix/ai/providers/vercel-ai-gateway/messages",
    () => import("@nytrix/ai/providers/vercel-ai-gateway/messages"),
  ],
  [
    "@nytrix/ai/providers/vercel-ai-gateway/responses",
    () => import("@nytrix/ai/providers/vercel-ai-gateway/responses"),
  ],
  [
    "@nytrix/ai/providers/vercel-ai-gateway/decisions",
    () => import("@nytrix/ai/providers/vercel-ai-gateway/decisions"),
  ],
  ["@nytrix/ai/providers/vercel-ai-gateway/images", () => import("@nytrix/ai/providers/vercel-ai-gateway/images")],
  ["@nytrix/ai/providers/xai", () => import("@nytrix/ai/providers/xai")],
  ["@nytrix/ai/providers/xai/images", () => import("@nytrix/ai/providers/xai/images")],
  ["@nytrix/ai/providers/zai", () => import("@nytrix/ai/providers/zai")],
  ["@nytrix/ai/providers/zai/chat", () => import("@nytrix/ai/providers/zai/chat")],
  ["@nytrix/ai/providers/zai/images", () => import("@nytrix/ai/providers/zai/images")],
  ["@nytrix/ai/providers/zai-coding-plan", () => import("@nytrix/ai/providers/zai-coding-plan")],
  ["@nytrix/ai/providers/zai-coding-plan/chat", () => import("@nytrix/ai/providers/zai-coding-plan/chat")],
  ["@nytrix/ai/providers/zai-coding-plan/messages", () => import("@nytrix/ai/providers/zai-coding-plan/messages")],
  [
    "@nytrix/ai/providers/zai-coding-plan/responses",
    () => import("@nytrix/ai/providers/zai-coding-plan/responses"),
  ],
])

/** Native `@nytrix/ai/providers/*` entrypoints bundled with Core and loadable by name from config. */
export const builtinPackages: ReadonlySet<string> = new Set(builtins.keys())

export const loadPackage = Effect.fn("Provider.loadPackage")(function* (input: string, npm?: Npm.Interface) {
  const specifier = packageName(input)
  const builtin = builtins.get(specifier)
  if (builtin) return yield* importPackage(specifier, specifier, builtin)
  const resolved = yield* Effect.sync(() => {
    if (specifier.startsWith("file://") || specifier.startsWith("@nytrix/ai/")) return specifier
    try {
      return import.meta.resolve(specifier)
    } catch {
      return undefined
    }
  })
  if (resolved) return yield* importPackage(specifier, resolved)
  if (!npm) {
    return yield* new LoadError({
      package: specifier,
      cause: new Error(`Provider package ${specifier} is not installed`),
    })
  }
  const parts = specifier.split("/")
  const root = specifier.startsWith("@") ? parts.slice(0, 2).join("/") : (parts[0] ?? specifier)
  const installed = yield* npm.add(root).pipe(Effect.mapError((cause) => new LoadError({ package: specifier, cause })))
  const entrypoint = yield* Effect.try({
    try: () => resolveModule(specifier, installed.directory),
    catch: (cause) => new LoadError({ package: specifier, cause }),
  })
  return yield* importPackage(specifier, entrypoint)
})

const settingsKeys = Struct.keys(Provider.Settings.schema.fields)
const providerOnlyKeys = settingsKeys.filter((key) => !(key in Model.Settings.schema.fields))

/** The provider options: every settings key OpenCode doesn't read itself. */
export function nativeSettings(settings: Settings) {
  return Struct.omit(settings, settingsKeys)
}

/** Settings a model inherits from its provider. */
export function modelSettings(settings: Settings | undefined) {
  return settings && Struct.omit(settings, providerOnlyKeys)
}

const decodeTimeout = Schema.decodeUnknownOption(HttpTimeout)

/** Applied to `headerTimeout` when provider settings leave it unset or invalid. */
export const DEFAULT_TIMEOUT_MS = 300_000

/**
 * Applied to `chunkTimeout` when provider settings leave it unset or invalid. Some providers, such as DeepSeek, have
 * specifically asked clients to allow at least 15 minutes, because their models can stream nothing for minutes while
 * they reason.
 */
export const DEFAULT_CHUNK_TIMEOUT_MS = 900_000

/** One timeout setting without a default; invalid values are dropped. */
export function timeout(value: unknown) {
  return Option.getOrUndefined(decodeTimeout(value))
}

/** Request timeouts from provider settings, resolved for every route. `timeout` has no default. */
export function timeouts(settings: Readonly<Record<string, unknown>>) {
  return {
    timeout: timeout(settings.timeout),
    headerTimeout: timeout(settings.headerTimeout) ?? DEFAULT_TIMEOUT_MS,
    chunkTimeout: timeout(settings.chunkTimeout) ?? DEFAULT_CHUNK_TIMEOUT_MS,
  }
}

const decodeEncoding = Schema.decodeUnknownOption(Provider.Encoding)

/** Request body encoding from provider or model settings; invalid values are dropped. */
export function encoding(settings: Readonly<Record<string, unknown>>) {
  return Option.getOrUndefined(decodeEncoding(settings.encoding))
}

export function mergeOverlay(
  base: Readonly<Record<string, unknown>> | undefined,
  overlay: Readonly<Record<string, unknown>> | undefined,
): Record<string, Json> | undefined {
  if (base === undefined) return overlay && decodeJsonRecord({ ...overlay })
  if (overlay === undefined) return decodeJsonRecord({ ...base })
  return decodeJsonRecord(mergeRecord(base, overlay))
}

function mergeRecord(
  base: Readonly<Record<string, unknown>>,
  overlay: Readonly<Record<string, unknown>>,
): Record<string, unknown> {
  return Object.fromEntries(
    new Set([...Object.keys(base), ...Object.keys(overlay)]).values().map((key): [string, unknown] => {
      const left = base[key]
      const right = overlay[key]
      if (right === undefined) return [key, left]
      if (isRecord(left) && isRecord(right)) return [key, mergeRecord(left, right)]
      return [key, right]
    }),
  )
}

export function mergeHeaders(
  base: Readonly<Record<string, string>> | undefined,
  overlay: Readonly<Record<string, string>> | undefined,
) {
  if (base === undefined) return overlay && { ...overlay }
  if (overlay === undefined) return { ...base }
  return Object.fromEntries(
    [...Object.entries(base), ...Object.entries(overlay)]
      .reduce((result, entry) => {
        result.set(entry[0].toLowerCase(), entry)
        return result
      }, new Map<string, [string, string]>())
      .values(),
  )
}

export const Request = Provider.Request
export type Request = Provider.Request

export const Compaction = Provider.Compaction
export type Compaction = Provider.Compaction

export const Cache = Provider.Cache
export type Cache = Provider.Cache

export const Transport = Provider.Transport
export type Transport = Provider.Transport

export const Settings = Provider.Settings
export type Settings = Provider.Settings

export const Info = Provider.Info
export type Info = Provider.Info

export type MutableInfo = DeepMutable<Info>

export { Event } from "@nytrix/schema/provider"

/** Provider metadata owns its drafts; model definitions remain immutable inputs. */
export type Definition = {
  readonly provider: Info
  readonly models: ReadonlyMap<Model.ID, Model.Info>
  readonly sourceConnection?: IntegrationConnection.Info
}

export interface Editor {
  readonly list: () => readonly Definition[]
  readonly get: (providerID: ID) => Definition | undefined
  readonly add: (definition: {
    readonly info: Info
    readonly models: readonly Model.Info[]
    readonly sourceConnection?: IntegrationConnection.Info
  }) => void
  readonly update: (providerID: ID, update: (provider: MutableInfo) => void) => void
  readonly remove: (providerID: ID) => void
  readonly models: {
    readonly set: (providerID: ID, models: readonly Model.Info[]) => void
    readonly update: (providerID: ID, modelID: Model.ID, update: (model: DeepMutable<Model.Info>) => void) => void
    readonly remove: (providerID: ID, modelID: Model.ID) => void
  }
}

export interface Snapshot {
  readonly records: ReadonlyMap<ID, Definition>
  readonly available: readonly Definition[]
  readonly providers: readonly Info[]
}

export interface Interface extends State.Transformable<Editor> {
  readonly get: (providerID: ID) => Effect.Effect<Info | undefined>
  readonly all: () => Effect.Effect<readonly Info[]>
  readonly available: () => Effect.Effect<readonly Info[]>
  /** Internal definition/access snapshot; raw model inventories never cross the HTTP API. */
  readonly snapshot: () => Effect.Effect<Snapshot>
}

export class Service extends Context.Service<Service, Interface>()("@nytrix/Provider") {}

// Every location references the same index for a shared immutable definition array.
const definitions = new WeakMap<readonly Model.Info[], Map<ID, ReadonlyMap<Model.ID, Model.Info>>>()
function index(providerID: ID, models: readonly Model.Info[]) {
  const indexes = definitions.get(models) ?? new Map<ID, ReadonlyMap<Model.ID, Model.Info>>()
  const cached = indexes.get(providerID)
  if (cached) return cached
  // Model shares these definitions without copying, so a foreign definition takes this provider's identity here.
  const result = freeze(
    new Map(models.map((model) => [model.id, model.providerID === providerID ? model : { ...model, providerID }])),
    true,
  )
  indexes.set(providerID, result)
  definitions.set(models, indexes)
  return result
}

const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const bus = yield* Bus.Service
    const integrations = yield* Integration.Service
    const location = yield* Location.Service
    const state = State.create<
      Map<
        ID,
        {
          provider: MutableInfo
          models: ReadonlyMap<Model.ID, Model.Info>
          sourceConnection?: IntegrationConnection.Info
        }
      >,
      Editor
    >({
      name: "provider",
      initial: () => new Map(),
      editor: (records) => {
        const maps = new WeakSet<ReadonlyMap<Model.ID, Model.Info>>()
        const models = new WeakSet<Model.Info>()
        const entry = (id: ID) => {
          const current = records.get(id)
          if (current) return current
          const added = { provider: Info.empty(id) as MutableInfo, models: new Map<Model.ID, Model.Info>() }
          records.set(id, added)
          maps.add(added.models)
          return added
        }
        const writable = (id: ID) => {
          const record = entry(id)
          if (maps.has(record.models)) return record.models as Map<Model.ID, Model.Info>
          const owned = new Map(record.models)
          record.models = owned
          maps.add(owned)
          return owned
        }
        return {
          list: () => Array.from(records.values()),
          get: (id) => records.get(id),
          add: (definition) => {
            records.set(definition.info.id, {
              provider: structuredClone(definition.info) as MutableInfo,
              models: index(definition.info.id, definition.models),
              sourceConnection: definition.sourceConnection,
            })
          },
          update: (id, update) => {
            const record = entry(id)
            update(record.provider)
            record.provider.id = id
            AISDKNative.rewrite(record.provider, {
              specifier: record.provider.package,
              providerID: id,
              canonical: record.provider.canonical,
            })
          },
          remove: (id) => {
            records.delete(id)
          },
          models: {
            set: (id, values) => {
              entry(id).models = index(id, values)
            },
            update: (providerID, modelID, update) => {
              const record = entry(providerID)
              const target = writable(providerID)
              const current = target.get(modelID)
              const model = // An earlier add/set can publish and freeze an owned model within this fold.
                (
                  current && models.has(current) && !Object.isFrozen(current)
                    ? current
                    : current
                      ? structuredClone(current)
                      : Model.Info.default(providerID, modelID)
                ) as DeepMutable<Model.Info>
              update(model)
              model.id = modelID
              model.providerID = providerID
              AISDKNative.rewrite(model, {
                specifier: model.package ?? record.provider.package,
                providerID,
                canonical: model.canonical ?? record.provider.canonical,
                modelID: model.modelID ?? modelID,
              })
              models.add(model)
              target.set(modelID, model)
            },
            remove: (providerID, modelID) => {
              if (!records.has(providerID)) return
              writable(providerID).delete(modelID)
            },
          },
        }
      },
      notify: () => notify,
    })
    // Registrations may outlive a borrowed service layer; their later disposal must
    // not query dependencies that have already closed.
    yield* Effect.addFinalizer(() => State.shutdown(state.reload()))
    let cached: { records: Snapshot["records"]; value: Snapshot } | undefined
    const snapshot = Effect.fn("Provider.snapshot")(function* () {
      while (true) {
        const revision = integrations.revision()
        const records = state.get()
        // Connection presence decides availability; resolving OAuth tokens belongs to execution.
        const connections = yield* integrations.list()
        // Either fold can disable a plugin that also contributed to the other domain.
        if (revision !== integrations.revision() || records !== state.get()) continue
        const byID = new Map(connections.map((integration) => [integration.id, integration]))
        const available = Array.from(records.values()).filter((record) => {
          if (record.provider.activation === "disabled") return false
          const integration = byID.get(record.provider.integrationID ?? Integration.ID.make(record.provider.id))
          // Never combine the previous account's discovered endpoints/models with a new connection.
          if (
            record.sourceConnection &&
            IntegrationConnection.key(record.sourceConnection) !==
              IntegrationConnection.key(integration?.connections[0])
          )
            return false
          if (record.provider.activation === "enabled") return true
          if (integration?.connections.length) return true
          return record.provider.integrationID === undefined && !integration
        })
        // A credential change that leaves the same definitions available is not a catalog change.
        if (
          cached?.records === records &&
          cached.value.available.length === available.length &&
          cached.value.available.every((record, index) => record === available[index])
        )
          return cached.value
        const value = freeze({ records, available, providers: available.map((record) => record.provider) }, true)
        cached = { records, value }
        return value
      }
    })
    let published: Snapshot | undefined
    const notify: Effect.Effect<void> = Effect.gen(function* () {
      const value = yield* snapshot()
      if (value === published) return
      published = value
      yield* bus.publish(
        Provider.Event.Updated,
        {},
        {
          location: { directory: location.directory, workspaceID: location.workspaceID },
        },
      )
    })
    yield* bus.subscribe([Integration.Event.Updated, Credential.Event.Updated, Credential.Event.Switched]).pipe(
      Stream.runForEach(() => notify),
      Effect.forkScoped({ startImmediately: true }),
    )
    return Service.of({
      transform: state.transform,
      reload: state.reload,
      get: Effect.fn("Provider.get")((id) => Effect.sync(() => freeze(state.get().get(id)?.provider, true))),
      all: Effect.fn("Provider.all")(() =>
        Effect.sync(() => Array.from(state.get().values(), (record) => freeze(record.provider, true))),
      ),
      available: Effect.fn("Provider.available")(() => snapshot().pipe(Effect.map((value) => value.providers))),
      snapshot,
    })
  }),
)

export const node = makeLocationNode({ service: Service, layer, deps: [Bus.node, Integration.node, Location.node] })

const importPackage = Effect.fn("Provider.importPackage")(function* (
  specifier: string,
  entrypoint: string,
  load = () => importModule(entrypoint),
) {
  const module = yield* Effect.tryPromise({
    try: () => {
      const existing = packages.get(entrypoint)
      if (existing) return existing
      const loaded = load()
      packages.set(entrypoint, loaded)
      return loaded
    },
    catch: (cause) => new LoadError({ package: specifier, cause }),
  })
  if (typeof module !== "object" || module === null || typeof (module as { model?: unknown }).model !== "function") {
    return yield* new LoadError({
      package: specifier,
      cause: new Error(`Provider package ${specifier} does not export model(modelID, settings)`),
    })
  }
  return module as ProviderPackageDefinition
})
