#!/usr/bin/env bash
EXP_TAG="$(echo "$TRAVIS_COMMIT_MESSAGE" | grep '\[expo build\]')"

if [[ -z "$EXP_TAG" ]]; then
  exit 0
fi

if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
  echo "[expo build] isn't valid in pull requests."
  exit 1
fi

echo "Compiling app (Android)..."

yarn --silent exp login \
  --non-interactive \
  --username "$EXP_USERNAME" \
  --password "$EXP_PASSWORD"

yarn exp build:android

IN_PROGRESS=true
while [[ -n "$IN_PROGRESS" ]]; do
  sleep 20
  BUILD_STATUS="$(yarn --silent exp build:status)"
  IN_PROGRESS="$(echo "$BUILD_STATUS" | grep 'Build in progress')"

  if [[ -n "$IN_PROGRESS" ]]; then
    echo "Still compiling..."
  fi
done

yarn --silent exp build:status
