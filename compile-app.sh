#!/usr/bin/env bash
EXP_TAG="$(echo "$TRAVIS_COMMIT_MESSAGE" | grep '\[expo build\]')"

if [[ -z "$EXP_TAG" ]]; then
  exit 0
fi

if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
  echo "[expo build] isn't valid in pull requests."
  exit 1
fi

if [[ -z "$EXP_PASSWORD" ]]; then
  echo "Expo authentication not provided."
  exit 1
fi

echo "Compiling app (Android)..."

yarn --silent exp login \
  --non-interactive \
  --username psychollama \
  --password "$EXP_PASSWORD"

yarn exp build:android

IN_PROGRESS=true
while [[ -n "$IN_PROGRESS" ]]; do
  sleep 20
  BUILD_STATUS="$(yarn --silent exp build:status 2> /dev/null)"
  IN_PROGRESS="$(echo "$BUILD_STATUS" | grep 'Build in progress')"

  if [[ -n "$IN_PROGRESS" ]]; then
    echo "Still compiling..."
  fi
done

extract_apk_url="""
/APK/ {
  url_start_index = match(\$0, /http/)
  print substr(\$0, url_start_index)
}
"""

APK_URL="$(awk "$extract_apk_url" <<< "$BUILD_STATUS")"

echo "Compiled APK: $APK_URL"

curl \
  -X POST \
  -H 'Content-type: application/json' \
  --data "{\"text\":\"New Luminary APK available: $APK_URL\"}" \
  "$SLACK_MSG_URL"
