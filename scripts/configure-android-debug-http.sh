#!/usr/bin/env sh
set -eu

if [ ! -d android/app/src ]; then
  echo "Android project not found. Run: npx cap add android"
  exit 1
fi

mkdir -p android/app/src/debug
cat > android/app/src/debug/AndroidManifest.xml <<'MANIFEST'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:usesCleartextTraffic="true" />
</manifest>
MANIFEST

echo "Debug-only HTTP access enabled. Release manifest was not changed."
