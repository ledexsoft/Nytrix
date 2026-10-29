import type { NytrixEvent } from "@nytrix/client"
import { useClient } from "./client"

type EventMetadata = {
  directory: string | undefined
}
type OpenCodeEventMap = { [Type in NytrixEvent["type"]]: Extract<NytrixEvent, { type: Type }> }

export function useEvent() {
  const client = useClient()

  function subscribe(handler: (event: NytrixEvent, metadata: EventMetadata) => void) {
    return client.event.listen(({ details }) => {
      if (details.type === "server.connected") return
      handler(details, { directory: details.location?.directory })
    })
  }

  function on<T extends NytrixEvent["type"]>(
    type: T,
    handler: (event: OpenCodeEventMap[T], metadata: EventMetadata) => void,
  ) {
    return client.event.on(type, (event) => {
      handler(event, { directory: event.location?.directory })
    })
  }

  return {
    subscribe,
    on,
  }
}
