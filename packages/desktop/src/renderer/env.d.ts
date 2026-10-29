import type { ElectronNative } from "../preload/types"

declare global {
  interface ImportMetaEnv {
    readonly NYTRIX_TEST_ONBOARDING: boolean
  }

  interface Window {
    electron: ElectronNative
    __NYTRIX__?: {
      deepLinks?: string[]
    }
  }
}
