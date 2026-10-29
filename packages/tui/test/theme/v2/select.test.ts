import { expect, test } from "bun:test"
import { selectTheme, selectThemeMode, supportsThemeMode, themeModes } from "@nytrix/theme/tui"
import { getNytrixTheme } from "../../../src/theme"

test("selects complete light and dark themes independently", () => {
  const light = selectTheme(getNytrixTheme(), "light")
  const dark = selectTheme(getNytrixTheme(), "dark")
  expect(selectTheme(getNytrixTheme())).toEqual(light)
  expect(light.hue).toEqual(getNytrixTheme().light.hue)
  expect(dark.text).toEqual(getNytrixTheme().base.text)
  expect(dark.hue).toEqual(getNytrixTheme().dark.hue)
  expect(selectThemeMode(getNytrixTheme(), "dark")).toEqual({ theme: dark, mode: "dark" })
})

test("selects the available mode when the requested mode is missing", () => {
  const lightOnly = { base: getNytrixTheme().base, light: getNytrixTheme().light } as const
  const darkOnly = { base: getNytrixTheme().base, dark: getNytrixTheme().dark } as const

  expect(themeModes(lightOnly)).toEqual(["light"])
  expect(themeModes(darkOnly)).toEqual(["dark"])
  expect(supportsThemeMode(lightOnly, "light")).toBeTrue()
  expect(supportsThemeMode(lightOnly, "dark")).toBeFalse()
  expect(selectThemeMode(lightOnly, "dark")).toEqual({ theme: selectTheme(getNytrixTheme(), "light"), mode: "light" })
  expect(selectThemeMode(darkOnly, "light")).toEqual({ theme: selectTheme(getNytrixTheme(), "dark"), mode: "dark" })
})
