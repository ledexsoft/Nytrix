interface ImportMetaEnv {
  readonly NYTRIX_CHANNEL: string
  readonly NYTRIX_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
