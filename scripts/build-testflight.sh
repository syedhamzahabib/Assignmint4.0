#!/bin/bash

# AssignMint TestFlight Build Script
# This script automates the build process for TestFlight submission

set -e  # Exit on any error

echo "🚀 Starting AssignMint TestFlight Build Process..."
echo "=================================================="

# Configuration
PROJECT_NAME="Assignmint"
WORKSPACE="${PROJECT_NAME}.xcworkspace"
SCHEME="${PROJECT_NAME}"
CONFIGURATION="Release"
ARCHIVE_PATH="../build/${PROJECT_NAME}.xcarchive"
EXPORT_PATH="../build/${PROJECT_NAME}-IPA"
EXPORT_OPTIONS="ExportOptions.plist"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the iOS directory
if [ ! -f "$WORKSPACE" ]; then
    print_error "This script must be run from the ios/ directory"
    print_error "Current directory: $(pwd)"
    exit 1
fi

# Check prerequisites
print_status "Checking prerequisites..."

# Check Xcode
if ! command -v xcodebuild &> /dev/null; then
    print_error "xcodebuild not found. Please install Xcode."
    exit 1
fi

# Check CocoaPods
if ! command -v pod &> /dev/null; then
    print_error "CocoaPods not found. Please install CocoaPods."
    exit 1
fi

# Check if ExportOptions.plist exists
if [ ! -f "$EXPORT_OPTIONS" ]; then
    print_error "ExportOptions.plist not found. Please create it first."
    exit 1
fi

print_success "Prerequisites check passed"

# Create build directory
print_status "Creating build directory..."
mkdir -p ../build
print_success "Build directory created"

# Clean previous builds
print_status "Cleaning previous builds..."
xcodebuild clean \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -quiet

print_success "Clean completed"

# Install/Update CocoaPods
print_status "Installing/Updating CocoaPods dependencies..."
pod install --repo-update
print_success "CocoaPods dependencies updated"

# Build archive
print_status "Building archive..."
print_status "This may take several minutes..."

xcodebuild archive \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -destination "generic/platform=iOS" \
    -archivePath "$ARCHIVE_PATH" \
    -quiet

if [ $? -eq 0 ]; then
    print_success "Archive built successfully at: $ARCHIVE_PATH"
else
    print_error "Archive build failed"
    exit 1
fi

# Export IPA
print_status "Exporting IPA..."
print_status "This may take several minutes..."

xcodebuild -exportArchive \
    -archivePath "$ARCHIVE_PATH" \
    -exportPath "$EXPORT_PATH" \
    -exportOptionsPlist "$EXPORT_OPTIONS" \
    -quiet

if [ $? -eq 0 ]; then
    print_success "IPA exported successfully at: $EXPORT_PATH"
else
    print_error "IPA export failed"
    exit 1
fi

# Find the IPA file
IPA_FILE=$(find "$EXPORT_PATH" -name "*.ipa" | head -1)

if [ -n "$IPA_FILE" ]; then
    print_success "IPA file found: $IPA_FILE"
    
    # Get file size
    FILE_SIZE=$(du -h "$IPA_FILE" | cut -f1)
    print_status "IPA file size: $FILE_SIZE"
    
    # Get file info
    print_status "IPA file details:"
    ls -la "$IPA_FILE"
else
    print_error "IPA file not found in export directory"
    exit 1
fi

# Summary
echo ""
echo "🎉 TestFlight Build Process Completed Successfully!"
echo "=================================================="
echo "📱 Archive: $ARCHIVE_PATH"
echo "📦 IPA: $IPA_FILE"
echo "📊 Size: $FILE_SIZE"
echo ""
echo "📋 Next Steps:"
echo "1. Open Xcode → Window → Organizer"
echo "2. Select your archive: $ARCHIVE_PATH"
echo "3. Click 'Distribute App'"
echo "4. Choose 'App Store Connect'"
echo "5. Follow the distribution wizard"
echo ""
echo "🔗 For detailed instructions, see: README.md#build-for-testflight"
echo ""

print_success "Build process completed successfully!"
