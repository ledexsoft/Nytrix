import { createEffect, For, on, onCleanup } from "solid-js"
import { createStore } from "solid-js/store"
import { prefersReducedMotion } from "@nytrix/ui/motion"

const target = ["n", "y", "t", "r", "i", "x"] as const

const choices = ["n", "y", "t", "r", "i", "x"] as const

export function AnimatedWordmark(props: { active: boolean }) {
  const [state, setState] = createStore({ letters: [...target] })
  const timers = new Set<ReturnType<typeof setTimeout>>()

  createEffect(
    on(
      () => props.active,
      (active) => {
        timers.forEach(clearTimeout)
        timers.clear()

        if (!active || prefersReducedMotion()) {
          setState("letters", [...target])

          return
        }

        const starts = target.map(() => choices[Math.floor(Math.random() * choices.length)])
        const settles = target.map(() => 6 + Math.floor(Math.random() * 8))
        const last = Math.max(...settles)
        setState("letters", starts)

        Array.from({ length: last }, (_, index) => index + 1).forEach((tick) => {
          const timer = setTimeout(() => {
            setState(
              "letters",
              target.map((letter, index) =>
                tick >= settles[index] ? letter : choices[Math.floor(Math.random() * choices.length)],
              ),
            )
            timers.delete(timer)
          }, tick * 75)

          timers.add(timer)
        })
      },
    ),
  )

  onCleanup(() => timers.forEach(clearTimeout))

  return (
    <svg class="settings-about-wordmark" viewBox="0 0 200 42" aria-hidden="true">
      <For each={state.letters}>
        {(letter, index) => (
          <>
            <text class="settings-about-letter-shadow" x={index() * 31} y="33">
              {letter}
            </text>
            <text x={index() * 31} y="30">
              {letter}
            </text>
          </>
        )}
      </For>
    </svg>
  )
}
