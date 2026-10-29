# Shared helpers for the release scripts. Sourced, never executed.
#
# These scripts run in sign and publish jobs that hold secrets. They must never execute repository code
# or artifact contents: artifacts are data, and every value that names a destination comes from the
# environment the workflow sets (NYTRIX_VERSION, NYTRIX_CHANNEL, NYTRIX_DRY_RUN, ...).

set -euo pipefail

# shellcheck disable=SC2034 # used by the scripts that source this file
release_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

die() {
  echo "::error::$*" >&2
  exit 1
}

dry_run() {
  [ "${NYTRIX_DRY_RUN:-false}" = true ]
}

sha256() {
  if command -v sha256sum > /dev/null; then sha256sum "$@"; else shasum -a 256 "$@"; fi
}

# Windows runners pass D:\a\_temp style paths; Git Bash tools want /d/a/_temp.
posix() {
  if command -v cygpath > /dev/null; then cygpath -u "$1"; else printf '%s' "$1"; fi
}

size() {
  wc -c < "$1" | tr -d ' '
}
