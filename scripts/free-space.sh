#!/usr/bin/env bash
set -e
echo "Before:"; df -h /
[ -d "$HOME/Library/Developer/Xcode/DerivedData" ] && rm -rf "$HOME/Library/Developer/Xcode/DerivedData"/*
[ -d "$HOME/Library/Developer/Xcode/Archives" ]    && rm -rf "$HOME/Library/Developer/Xcode/Archives"/*
[ -d "$HOME/Library/Developer/Xcode/iOS DeviceSupport" ] && rm -rf "$HOME/Library/Developer/Xcode/iOS DeviceSupport"/*
[ -d "$HOME/Library/Developer/CoreSimulator/Caches" ] && find "$HOME/Library/Developer/CoreSimulator/Caches" -type f -delete
rm -rf "$HOME/Library/Caches/CocoaPods" 2>/dev/null || true
brew cleanup -s 2>/dev/null || true
echo "After:"; df -h /
