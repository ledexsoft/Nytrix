import { createReactiveTimelineProjection } from "@nytrix/session-ui/timeline/projection"

export { reuseTimelineRows } from "@nytrix/session-ui/timeline/projection"

export function createTimelineProjection(input: Parameters<typeof createReactiveTimelineProjection>[0]) {
  return createReactiveTimelineProjection(input)
}
