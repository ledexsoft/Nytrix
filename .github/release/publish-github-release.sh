#!/usr/bin/env bash
# publish-github-release.sh <dir>... attaches Nytrix CLI and desktop assets to the channel's GitHub release.
. "$(dirname "$0")/lib.sh"

assets=$(mktemp -d)
for dir in "$@"; do
  find "$dir" -maxdepth 1 -type f \( -name 'nytrix-*' -o -name '*.yml' \) \
    ! -name '*.tgz' ! -name '*.app.tar' -exec cp {} "$assets/" \;
done
shopt -s nullglob
files=("$assets"/*)
((${#files[@]})) || die "No Nytrix release assets found"
write_feed() {
  local output=$1 first_file=$2 first=${2##*/} file digest date
  shift 2
  date=$(date -u +%Y-%m-%dT%H:%M:%S.000Z)
  {
    printf 'version: %s\nfiles:\n' "$NYTRIX_VERSION"
    for file in "$@"; do
      digest=$(openssl dgst -sha512 -binary "$file" | base64 | tr -d '\n')
      printf '  - url: %s\n    sha512: %s\n    size: %s\n' "${file##*/}" "$digest" "$(size "$file")"
    done
    digest=$(openssl dgst -sha512 -binary "$first_file" | base64 | tr -d '\n')
    printf 'path: %s\nsha512: %s\nreleaseDate: %s\n' "$first" "$digest" "$date"
  } > "$assets/$output"
}
if [[ "$NYTRIX_CHANNEL" == dev || "$NYTRIX_CHANNEL" == beta || "$NYTRIX_CHANNEL" == latest ]]; then
  mac=($(find "$assets" -maxdepth 1 -type f -name 'nytrix-desktop-mac-*.zip' -print | sort))
  windows=($(find "$assets" -maxdepth 1 -type f -name 'nytrix-desktop-win-*.exe' -print | sort))
  linux_x64=($(find "$assets" -maxdepth 1 -type f -name 'nytrix-desktop-linux-x64.AppImage' -print | sort))
  linux_arm64=($(find "$assets" -maxdepth 1 -type f -name 'nytrix-desktop-linux-arm64.AppImage' -print | sort))
  prefix="$NYTRIX_CHANNEL"
  ((${#mac[@]} == 0)) || write_feed "$prefix-mac.yml" "${mac[0]}" "${mac[@]}"
  ((${#windows[@]} == 0)) || write_feed "$prefix.yml" "${windows[0]}" "${windows[@]}"
  ((${#linux_x64[@]} == 0)) || write_feed "$prefix-linux.yml" "${linux_x64[0]}" "${linux_x64[@]}"
  ((${#linux_arm64[@]} == 0)) || write_feed "$prefix-linux-arm64.yml" "${linux_arm64[0]}" "${linux_arm64[@]}"
fi
files=("$assets"/*)
(cd "$assets" && sha256 -- * > SHA256SUMS && cat SHA256SUMS)
files=("$assets"/*)
printf '%s\n' "${NYTRIX_RELEASE_NOTES:-}" > "$assets.md"
if dry_run; then exit 0; fi

tag="v$NYTRIX_VERSION"
case "$NYTRIX_CHANNEL" in
  latest) release_flags=(--latest) ;;
  dev | beta) release_flags=(--prerelease --latest=false) ;;
  *) die "Unsupported GitHub release channel: $NYTRIX_CHANNEL" ;;
esac
gh release view "$tag" > /dev/null 2>&1 || {
  if [ "$NYTRIX_CHANNEL" = latest ]; then
    gh release create "$tag" --draft --verify-tag --latest=false --title "$tag" --notes-file "$assets.md"
  else
    gh release create "$tag" --draft --target "$GITHUB_SHA" "${release_flags[@]}" --title "$tag" --notes-file "$assets.md"
  fi
}
gh release upload "$tag" "${files[@]}" --clobber
gh release edit "$tag" --draft=false "${release_flags[@]}"
