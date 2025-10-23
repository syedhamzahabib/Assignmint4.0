#!/bin/bash

# AssignMint Safe Push to GitHub Script
# This script safely pushes the project while excluding large files

set -e  # Exit on error

echo "🚀 AssignMint - Safe Push to GitHub"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in AssignMint root directory${NC}"
    echo "Please run this script from the project root"
    exit 1
fi

echo -e "${GREEN}✓ Confirmed in project root${NC}"
echo ""

# Step 2: Update .gitignore (already done, but let's make sure)
echo "📝 Step 1: Checking .gitignore..."
if grep -q "ios/Pods/" .gitignore; then
    echo -e "${GREEN}✓ ios/Pods/ is in .gitignore${NC}"
else
    echo -e "${YELLOW}⚠ Adding ios/Pods/ to .gitignore${NC}"
    echo "ios/Pods/" >> .gitignore
fi

if grep -q "boost_.*\.tar\.bz2" .gitignore; then
    echo -e "${GREEN}✓ Boost files are in .gitignore${NC}"
else
    echo -e "${YELLOW}⚠ Adding boost files to .gitignore${NC}"
    echo "boost_*.tar.bz2" >> .gitignore
fi
echo ""

# Step 3: Remove large files from Git tracking (if they exist)
echo "🗑️  Step 2: Removing large files from Git tracking..."

# Remove ios/Pods if tracked
if git ls-files --error-unmatch ios/Pods/ > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Removing ios/Pods/ from Git tracking...${NC}"
    git rm -r --cached ios/Pods/ || true
    echo -e "${GREEN}✓ ios/Pods/ removed from tracking${NC}"
else
    echo -e "${GREEN}✓ ios/Pods/ not tracked (good!)${NC}"
fi

# Remove boost files if tracked
if git ls-files | grep -q "boost.*\.tar\.bz2"; then
    echo -e "${YELLOW}⚠ Removing boost files from Git tracking...${NC}"
    git rm --cached boost_*.tar.bz2 2>/dev/null || true
    echo -e "${GREEN}✓ Boost files removed from tracking${NC}"
else
    echo -e "${GREEN}✓ Boost files not tracked (good!)${NC}"
fi

# Remove any large build files if tracked
if git ls-files | grep -q "android/app/build/"; then
    echo -e "${YELLOW}⚠ Removing Android build files from Git tracking...${NC}"
    git rm -r --cached android/app/build/ 2>/dev/null || true
    echo -e "${GREEN}✓ Android build files removed from tracking${NC}"
else
    echo -e "${GREEN}✓ Android build files not tracked (good!)${NC}"
fi
echo ""

# Step 4: Check for any remaining large files
echo "🔍 Step 3: Checking for large files (>50MB)..."
LARGE_FILES=$(find . -type f -size +50M \
    -not -path "./node_modules/*" \
    -not -path "./ios/Pods/*" \
    -not -path "./ios/build/*" \
    -not -path "./android/build/*" \
    -not -path "./.git/*" 2>/dev/null || true)

if [ -z "$LARGE_FILES" ]; then
    echo -e "${GREEN}✓ No large files found${NC}"
else
    echo -e "${YELLOW}⚠ Found large files:${NC}"
    echo "$LARGE_FILES"
    echo ""
    echo -e "${YELLOW}These files should be added to .gitignore or removed${NC}"
fi
echo ""

# Step 5: Get branch name from user or use default
echo "🌿 Step 4: Git branch setup..."
read -p "Enter branch name (or press Enter for 'dev/android-onboarding'): " BRANCH_NAME
BRANCH_NAME=${BRANCH_NAME:-dev/android-onboarding}

# Check if branch exists
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    echo -e "${YELLOW}⚠ Branch '$BRANCH_NAME' already exists${NC}"
    read -p "Switch to it? (y/n): " SWITCH_BRANCH
    if [ "$SWITCH_BRANCH" = "y" ]; then
        git checkout $BRANCH_NAME
    fi
else
    echo "Creating and switching to branch: $BRANCH_NAME"
    git checkout -b $BRANCH_NAME
fi
echo ""

# Step 6: Show what will be committed
echo "📦 Step 5: Files to be committed..."
git status --short
echo ""

# Step 7: Confirm before committing
read -p "Proceed with commit and push? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo -e "${RED}❌ Cancelled by user${NC}"
    exit 0
fi
echo ""

# Step 8: Stage all changes
echo "➕ Step 6: Staging changes..."
git add .
echo -e "${GREEN}✓ Changes staged${NC}"
echo ""

# Step 9: Commit with message
echo "💾 Step 7: Creating commit..."
read -p "Enter commit message (or press Enter for default): " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-"Add complete onboarding documentation and Android setup

- Add DEVELOPER_ONBOARDING_GUIDE.md with comprehensive instructions
- Update .gitignore to exclude large files (Pods, boost, build folders)
- Include all necessary config files for Android developer
- Ready for collaborator to clone and set up Android environment"}

git commit -m "$COMMIT_MSG"
echo -e "${GREEN}✓ Commit created${NC}"
echo ""

# Step 10: Push to remote
echo "🚀 Step 8: Pushing to GitHub..."
echo "Pushing branch: $BRANCH_NAME"

# Push with upstream tracking
git push -u origin $BRANCH_NAME

echo ""
echo -e "${GREEN}✅ SUCCESS! Project pushed to GitHub${NC}"
echo ""
echo "📋 Next Steps:"
echo "1. Go to GitHub and create a Pull Request from '$BRANCH_NAME' to 'main'"
echo "2. Share the repository with your friend"
echo "3. Your friend should follow DEVELOPER_ONBOARDING_GUIDE.md"
echo ""
echo "🔄 To restore Pods locally (if needed):"
echo "   cd ios && pod install && cd .."
echo ""
echo "✨ Done!"

