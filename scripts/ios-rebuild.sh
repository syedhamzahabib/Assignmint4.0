#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
watchman watch-del-all || true
rm -rf ~/Library/Developer/Xcode/DerivedData/*
[ -d node_modules ] || npm install
cd ios && pod install --repo-update && cd ..
npm start -- --reset-cache &
sleep 2
npx react-native run-ios
