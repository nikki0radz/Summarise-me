#!/usr/bin/env bash
set -euo pipefail
signing_dir="${RUNNER_TEMP}/summarise-signing"
mkdir -p "$signing_dir"
chmod 700 "$signing_dir"
if [[ ! -f "$signing_dir/debug.keystore" ]]; then
  artifact_id=$(gh api "repos/${GITHUB_REPOSITORY}/actions/artifacts?per_page=100" --jq '[.artifacts[] | select(.name == "android-signing-key-v2" and .expired == false)] | sort_by(.created_at) | last | .id // empty')
  if [[ -n "$artifact_id" ]]; then
    gh api "repos/${GITHUB_REPOSITORY}/actions/artifacts/${artifact_id}/zip" > "$RUNNER_TEMP/signing-backup.zip"
    unzip -q "$RUNNER_TEMP/signing-backup.zip" -d "$signing_dir"
    rm "$RUNNER_TEMP/signing-backup.zip"
  elif [[ "$GITHUB_RUN_NUMBER" == "15" ]]; then
    keytool -genkeypair -keystore "$signing_dir/debug.keystore" -storepass android -keypass android -alias AndroidDebugKey -dname 'CN=Summarise Me Android Preview' -keyalg RSA -keysize 3072 -validity 10000
  else
    echo 'Signing key unavailable. Restore the signing backup; refusing to create an incompatible replacement.' >&2
    exit 1
  fi
fi
chmod 600 "$signing_dir/debug.keystore"
keytool -list -keystore "$signing_dir/debug.keystore" -storepass android -alias AndroidDebugKey >/dev/null
echo "SUMMARISE_SIGNING_STORE=$signing_dir/debug.keystore" >> "$GITHUB_ENV"
