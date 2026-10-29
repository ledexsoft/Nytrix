import type { NytrixEvent } from "@nytrix/client/promise"
import { createClientConnection, createPtyClient, type ClientConnectionStatus } from "@nytrix/client/solid"
import { createGlobalEmitter } from "@solid-primitives/event-bus"
import { type Accessor, createEffect, on, onCleanup } from "solid-js"
import { createApiForServer, type ServerApi } from "@/runtime/server/api"
import { createMediaCache, type MediaCache } from "@/runtime/server/media"
import { setMediaBlobLoader } from "@/runtime/persistence/drafts"
import { usePlatform } from "@/runtime/platform/platform"
import { ServerConnection } from "./registry"
import { createRefCountMap } from "@/runtime/server/refcount"
import { createRequestQueue } from "@/runtime/server/request-queue"
import { ServerScope } from "@/runtime/server/scope"
import { useServer } from "./current"

type NytrixEventMap = { [Type in NytrixEvent["type"]]: Extract<NytrixEvent, { type: Type }> }

export type NytrixEventStream = {
  on<Type extends NytrixEvent["type"]>(type: Type, handler: (event: NytrixEventMap[Type]) => void): VoidFunction
  listen(handler: (event: NytrixEvent) => void): VoidFunction
}

type NytrixEventSource = NytrixEventStream & {
  location(directory: string): NytrixEventStream
}

export function createNytrixEventSource() {
  const emitter = createGlobalEmitter<NytrixEventMap>()

  function stream(directory?: string): NytrixEventStream {
    return {
      on(type, handler) {
        return emitter.on(type, (event) => {
          if (directory !== undefined && event.location?.directory !== directory) return
          handler(event)
        })
      },
      listen(handler) {
        return emitter.listen((event) => {
          if (directory !== undefined && event.details.location?.directory !== directory) return
          handler(event.details)
        })
      },
    }
  }

  const event: NytrixEventSource = {
    ...stream(),
    location: (directory) => stream(directory),
  }

  onCleanup(() => emitter.clear())

  return {
    event,
    publish(event: NytrixEvent) {
      emitter.emit(event.type, event)
    },
  }
}

export type ServerConnectionStatus = ClientConnectionStatus

type ServerSDKBase = {
  server: ServerConnection.Any
  scope: ServerScope
  url: string
  /** The connection the API currently uses, which a managed server's reconnect may replace. */
  http: ServerConnection.HttpBase
  api: ServerApi
  media: MediaCache
  pty: ReturnType<typeof createPtyClient>
  connection: {
    status: Accessor<ServerConnectionStatus>
    attempt: Accessor<number>
    error: Accessor<string | undefined>
  }
  event: NytrixEventSource
}

function createServerSdkContextBase(server: ServerConnection.Any, scope: ServerScope): ServerSDKBase {
  const platform = usePlatform()
  const transport = createServerTransport({ http: server.http, fetch: platform.fetch })
  const media = createMediaCache(() => transport.api)
  const serverKey = ServerConnection.key(server)
  setMediaBlobLoader(serverKey, (uri) => media.load(uri))
  onCleanup(() => {
    setMediaBlobLoader(serverKey, undefined)
    media.dispose()
  })

  if (server.type === "plugin") {
    createEffect(
      on(
        () => `${server.http.url}\0${server.http.password ?? ""}`,
        () => transport.update(server.http),
        { defer: true },
      ),
    )
  }

  const events = createNytrixEventSource()
  const reconnect = server.type === "plugin" || server.type === "sidecar" ? server.reconnect : undefined

  const connection = createClientConnection(transport.api, {
    reconnect: reconnect ? async (signal) => transport.update(await reconnect(signal)) : undefined,
    flushInterval: 16,
    pageLifecycle: true,
    onEvent(event) {
      events.publish(event)
    },
    log: {
      info(message, data) {
        if (message !== "event stream disconnected") return
        console.info("[global-sdk] event stream disconnected", { url: transport.url, managed: !!reconnect, ...data })
      },
    },
  })

  return {
    server,
    scope,
    get url() {
      return transport.url
    },
    get http() {
      return transport.http
    },
    get api() {
      return transport.api
    },
    media,
    get pty() {
      return transport.pty
    },
    connection,
    event: events.event,
  }
}

/** A server's HTTP and PTY clients, rebuilt when its endpoint changes. */
export interface ServerTransport {
  /** Rebuilds the clients for a new endpoint and returns the new API client. */
  update(http: ServerConnection.HttpBase): ServerApi
  /** The current base URL. */
  readonly url: string
  /** The current endpoint. */
  readonly http: ServerConnection.HttpBase
  /** The current API client. */
  readonly api: ServerApi
  /** The current PTY client. */
  readonly pty: ReturnType<typeof createPtyClient>
}

export function createServerTransport(input: {
  http: ServerConnection.HttpBase
  fetch?: typeof globalThis.fetch
}): ServerTransport {
  const queue = createRequestQueue({ fetch: input.fetch ?? globalThis.fetch })

  const build = (http: ServerConnection.HttpBase) => {
    const api = createApiForServer({ server: http, fetch: queue.fetch })

    return { http, api, pty: createPtyClient(api, { url: http.url }) }
  }

  const state = { current: build(input.http) }

  return {
    update(http: ServerConnection.HttpBase) {
      state.current = build(http)

      return state.current.api
    },
    get url() {
      return state.current.http.url
    },
    get http() {
      return state.current.http
    },
    get api() {
      return state.current.api
    },
    get pty() {
      return state.current.pty
    },
  }
}

export type ServerSDK = ServerSDKBase & {
  ensureDirSdkContext: (directory: string) => ReturnType<typeof createDirSdkContext>
}

export function createServerSdkContext(server: ServerConnection.Any, scope: ServerScope): ServerSDK {
  const sdk = createServerSdkContextBase(server, scope)

  return Object.assign(sdk, {
    ensureDirSdkContext: createRefCountMap((dir) => createDirSdkContext(dir, sdk)),
  })
}

export const useServerSDK = () => {
  const server = useServer()

  return server.ctx.sdk
}

export type LocationContext = {
  directory: string
  event: NytrixEventStream
}

function createDirSdkContext(directory: string, serverSDK: ServerSDKBase): LocationContext {
  return {
    directory,
    event: serverSDK.event.location(directory),
  }
}
