import { randomUUID } from "node:crypto"
import { cpSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "node:fs"
import { enableCompileCache } from "node:module"
import { homedir, tmpdir } from "node:os"
import path from "node:path"
import { app } from "electron"
import { debugBuild, memoryLogInterval } from "@nytrix/gui-plugins/debug/options"
import { APP_ID, APP_NAME, CHANNEL } from "../constants"
import { remoteDebuggingPort } from "../diagnostics/options"

const testOnboarding = process.env.NYTRIX_TEST_ONBOARDING === "1"

const jsCallStackFeature = "DocumentPolicyIncludeJSCallStacksInCrashReports"

// Runs synchronously from the entry module, before Chromium is ready: command-line switches only
// take effect before ready, the single-instance lock is scoped to userData, and the early window
// needs userData to find the persisted window list and state.
export function configureApplication() {
  try {
    process.chdir(homedir())
  } catch {}

  process.env.NYTRIX_DISABLE_EMBEDDED_WEB_UI = "true"

  app.setName(APP_NAME)
  app.setAppUserModelId(APP_ID)
  app.commandLine.appendSwitch("proxy-bypass-list", "<-loopback>")
  const features = app.commandLine.getSwitchValue("enable-features")
  app.commandLine.appendSwitch("enable-features", features ? `${jsCallStackFeature},${features}` : jsCallStackFeature)

  // Chromium animates each mouse-wheel notch on Linux; native Linux apps scroll by the full delta immediately.
  if (process.platform === "linux") app.commandLine.appendSwitch("disable-smooth-scrolling")

  const build = { packaged: app.isPackaged, channel: CHANNEL }
  const debugPort = remoteDebuggingPort(build, process.env.NYTRIX_DESKTOP_REMOTE_DEBUGGING_PORT)

  if (debugPort) app.commandLine.appendSwitch("remote-debugging-port", debugPort)

  if (app.commandLine.hasSwitch("remote-debugging-port"))
    app.commandLine.appendSwitch("remote-debugging-address", "127.0.0.1")

  // Precise heap sizes need a launch switch. The debug bar's toggle starts the log without one.
  if (debugBuild(build) && memoryLogInterval(process.env.NYTRIX_DESKTOP_MEMORY_LOG) !== undefined)
    app.commandLine.appendSwitch("enable-precise-memory-info")

  const testRoot = createTestRoot()
  const userData = testRoot ? path.join(testRoot, "desktop") : migrateUserData(app.getPath("appData"))
  app.setPath("userData", userData)

  if (testRoot) {
    app.setPath("sessionData", path.join(testRoot, "session"))

    if (testOnboarding) app.setPath("documents", path.join(testRoot, "documents"))
  }

  // V8 bytecode for the main bundle survives between launches, like the renderer's code cache.
  enableCompileCache(path.join(app.getPath("userData"), "compile-cache"))
}

export function acquireApplicationLock() {
  if (app.requestSingleInstanceLock()) return true
  app.quit()

  return false
}

function createTestRoot() {
  const root = testOnboarding
    ? path.join(tmpdir(), `nytrix-onboarding-${randomUUID()}`)
    : process.env.NYTRIX_DESKTOP_TEST_ROOT

  if (!root) return undefined

  if (testOnboarding) rmSync(root, { recursive: true, force: true })

  for (const dir of ["data", "config", "cache", "state", "desktop", "session", "documents"])
    mkdirSync(path.join(root, dir), { recursive: true })

  if (testOnboarding) process.env.NYTRIX_DB = ":memory:"

  process.env.XDG_DATA_HOME = path.join(root, "data")
  process.env.XDG_CONFIG_HOME = path.join(root, "config")
  process.env.XDG_CACHE_HOME = path.join(root, "cache")
  process.env.XDG_STATE_HOME = path.join(root, "state")

  return root
}


function migrateUserData(appData: string) {
  const previousID = {
    dev: "ai.opencode.desktop.dev",
    beta: "ai.opencode.desktop.beta",
    prod: "ai.opencode.desktop",
  }[CHANNEL === "local" ? "dev" : CHANNEL]
  const source = path.join(appData, previousID)
  const destination = path.join(appData, APP_ID)

  if (source === destination || existsSync(destination) || !existsSync(source)) return destination

  cpSync(source, destination, { recursive: true, errorOnExist: true, force: false })

  for (const name of readdirSync(destination)) {
    if (name === "opencode.settings" || /^opencode\..+\.dat$/.test(name)) {
      const migrated = name.replace(/^opencode(?=\.)/, "nytrix")
      const oldFile = path.join(destination, name)
      const newFile = path.join(destination, migrated)

      if (existsSync(newFile)) rmSync(oldFile)
      else renameSync(oldFile, newFile)
    }
  }

  return destination
}
