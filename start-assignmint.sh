#!/bin/bash

echo "🔪 Killing stale Metro processes..."
killall -9 node || true
lsof -i :8081 | awk 'NR>1 {print $2}' | xargs kill -9 || true

echo "🚀 Starting Metro with clean cache..."
npm start -- --reset-cache
