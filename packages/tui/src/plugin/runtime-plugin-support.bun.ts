import { ensurePluginRuntime, provides } from "@nytrix/plugin/runtime"
import { Plugin, PluginContextProvider, usePlugin } from "@nytrix/plugin/tui"
import { ensureRuntimePluginSupport } from "@opentui/solid/runtime-plugin-support/configure"

ensurePluginRuntime()
ensureRuntimePluginSupport({
  additional: {
    "@nytrix/plugin/tui": { Plugin, PluginContextProvider, usePlugin },
  },
  preserve: provides,
})
