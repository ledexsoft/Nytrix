import type { NytrixEvent } from "@nytrix/client"
import type { SelectedEvent, SubscribeOptions } from "@nytrix/client/promise/api"

type EventType = Exclude<NytrixEvent["type"], "server.connected">

export interface EventDomain {
  readonly subscribe: <Type extends EventType = EventType>(
    options?: SubscribeOptions<Type>,
  ) => AsyncIterable<SelectedEvent<NytrixEvent, Type>>
}
