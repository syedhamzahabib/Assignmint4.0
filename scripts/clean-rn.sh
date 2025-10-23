#!/usr/bin/env bash
set -e
lsof -iTCP:8081 -sTCP:LISTEN -nP | awk 'NR>1{print $2}' | xargs -r kill -9
pkill -f "node .*metro" 2>/dev/null || true
watchman watch-del-all 2>/dev/null || true
xcrun simctl shutdown all 2>/dev/null || true
find "$TMPDIR" -maxdepth 1 -name 'metro-*'  -exec rm -rf {} +
find "$TMPDIR" -maxdepth 1 -name 'haste-*'  -exec rm -rf {} +
find "$TMPDIR" -maxdepth 1 -name 'react-*'  -exec rm -rf {} +
echo "Done. Start Metro with: npx react-native start --reset-cache --max-workers=2"
