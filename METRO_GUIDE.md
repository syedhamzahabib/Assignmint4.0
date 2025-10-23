# Metro Bundler Guide

This guide ensures Metro bundler runs cleanly without port conflicts and prevents VS Code from auto-starting Metro.

## Quick Start

1. **Start Metro (Terminal only):**
   ```bash
   ./start-assignmint.sh
   ```

2. **Run on iPhone (Second terminal):**
   ```bash
   npx react-native run-ios --device "Syed Hamza's iPhone"
   ```

## Important Rules

- ✅ **Always** run Metro using `./start-assignmint.sh` from the Mac terminal
- ✅ **Never** let VS Code or Cursor auto-start Metro
- ✅ Use a **second terminal** for `npx react-native run-ios`
- ❌ Don't run Metro from VS Code integrated terminal
- ❌ Don't run multiple Metro instances

## What the Script Does

The `start-assignmint.sh` script:
1. Kills any stale node processes
2. Kills any processes using port 8081
3. Starts Metro with `--reset-cache` for a clean state

## VS Code Configuration

The `.vscode/settings.json` file prevents VS Code from auto-starting Metro by adding `--no-packager` to run arguments.

## Troubleshooting

If you see "Could not connect to development server":
1. Stop all Metro processes: `./start-assignmint.sh`
2. Wait for Metro to fully start
3. Run the iOS command in a separate terminal

## Verification

After setup:
- Metro should show "Metro waiting on exp://192.168.x.x:8081"
- iPhone app should reload without connection errors
- Only one Metro process should be running on port 8081
