export const available = true

export async function resolveBinary() {
  return process.env.NYTRIX_PTY_BIN || "nytrix-pty"
}
