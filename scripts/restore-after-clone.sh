#!/bin/bash

# AssignMint - Restore Project After Clone
# This script restores all dependencies after cloning from GitHub

set -e  # Exit on error

echo "🔄 AssignMint - Project Setup After Clone"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in AssignMint root directory${NC}"
    echo "Please run this script from the project root"
    exit 1
fi

echo -e "${GREEN}✓ Confirmed in project root${NC}"
echo ""

# Step 2: Check Node.js version
echo "📦 Step 1: Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"

# Extract major version number
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')

if [ "$NODE_MAJOR" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ required. You have: $NODE_VERSION${NC}"
    echo "Please install Node.js 18 or higher"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version is compatible${NC}"
echo ""

# Step 3: Install npm dependencies
echo "📦 Step 2: Installing npm dependencies..."
echo "This may take a few minutes..."
npm install

echo -e "${GREEN}✓ npm dependencies installed${NC}"
echo ""

# Step 4: iOS Pods (only if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Step 3: Installing iOS Pods (CocoaPods)..."
    
    # Check if CocoaPods is installed
    if ! command -v pod &> /dev/null; then
        echo -e "${YELLOW}⚠ CocoaPods not found. Installing...${NC}"
        sudo gem install cocoapods
    fi
    
    echo "Installing iOS dependencies..."
    cd ios
    pod install
    cd ..
    
    echo -e "${GREEN}✓ iOS Pods installed${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠ Not on macOS, skipping iOS Pods installation${NC}"
    echo -e "${BLUE}ℹ️  iOS setup will be handled by the team lead${NC}"
    echo ""
fi

# Step 5: Check Android setup
echo "🤖 Step 4: Checking Android setup..."

if [ -d "$HOME/Android/Sdk" ] || [ -d "$HOME/Library/Android/sdk" ]; then
    echo -e "${GREEN}✓ Android SDK found${NC}"
else
    echo -e "${YELLOW}⚠ Android SDK not found${NC}"
    echo "Please install Android Studio and Android SDK"
fi
echo ""

# Step 6: Check for required files
echo "📄 Step 5: Checking required configuration files..."

# Check for google-services.json
if [ -f "android/app/google-services.json" ]; then
    echo -e "${GREEN}✓ google-services.json found${NC}"
else
    echo -e "${YELLOW}⚠ google-services.json NOT found${NC}"
    echo "  You need to download this from Firebase Console"
    echo "  Place it at: android/app/google-services.json"
fi

# Check for Podfile.lock (should exist)
if [ -f "ios/Podfile.lock" ]; then
    echo -e "${GREEN}✓ Podfile.lock found${NC}"
else
    echo -e "${RED}❌ Podfile.lock NOT found${NC}"
fi

# Check for package-lock.json
if [ -f "package-lock.json" ]; then
    echo -e "${GREEN}✓ package-lock.json found${NC}"
else
    echo -e "${YELLOW}⚠ package-lock.json NOT found${NC}"
fi

echo ""

# Step 7: Summary and next steps
echo "✅ Setup Complete!"
echo ""
echo -e "${BLUE}📋 Next Steps (Android Developer):${NC}"
echo ""
echo "1. Download google-services.json from Firebase Console"
echo "   - Go to: https://console.firebase.google.com/project/assignimt"
echo "   - Settings → Your apps → Android app"
echo "   - Download google-services.json"
echo "   - Place it at: android/app/google-services.json"
echo ""
echo "2. Read the onboarding guide:"
echo "   - Open: DEVELOPER_ONBOARDING_GUIDE.md"
echo ""
echo "3. Test the Android app:"
echo "   - Connect Android device or start emulator"
echo "   - Run: npx react-native run-android"
echo ""
echo -e "${GREEN}🎉 You're ready to start developing!${NC}"
echo ""

# Optional: Offer to run Android
read -p "Would you like to start the Android app now? (y/n): " START_ANDROID

if [ "$START_ANDROID" = "y" ]; then
    echo ""
    echo "🚀 Starting Android app..."
    echo ""
    npx react-native run-android
fi

