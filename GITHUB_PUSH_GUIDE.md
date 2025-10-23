# GitHub Push & Restore Guide

This guide explains how to safely push AssignMint to GitHub and restore it after cloning.

---

## 🚀 For You (Hamza) - Pushing to GitHub

### Quick Start (Automated)

Simply run the automated script:

```bash
./scripts/push-to-github.sh
```

The script will:
1. ✅ Check and update .gitignore
2. ✅ Remove large files from Git tracking (Pods, boost files)
3. ✅ Check for any remaining large files
4. ✅ Create/switch to a branch
5. ✅ Stage and commit all changes
6. ✅ Push to GitHub

### What Gets Excluded (Automatically)

These files are in `.gitignore` and won't be pushed:
- `ios/Pods/` - iOS dependencies (200-500 MB)
- `ios/build/` - iOS build artifacts
- `android/build/` - Android build artifacts
- `boost_*.tar.bz2` - Large boost library files
- `node_modules/` - npm packages
- `.env` files - Environment variables
- `google-services.json` - Firebase config (sensitive)

### What Gets Included (Important!)

These files WILL be pushed (your friend needs them):
- ✅ All `.md` documentation files
- ✅ `ios/Podfile` and `ios/Podfile.lock` - To restore Pods
- ✅ `package.json` and `package-lock.json` - To restore npm packages
- ✅ All source code (`src/`, `components/`, etc.)
- ✅ Configuration files
- ✅ Native project files (but not build artifacts)

---

## 📥 For Your Friend - After Cloning

### Quick Start (Automated)

After cloning the repo, run:

```bash
./scripts/restore-after-clone.sh
```

The script will:
1. ✅ Check Node.js version
2. ✅ Install npm dependencies
3. ✅ Install iOS Pods (macOS only)
4. ✅ Check Android SDK setup
5. ✅ Verify required files
6. ✅ Provide next steps

### Manual Steps (If Script Doesn't Work)

```bash
# 1. Clone the repository
git clone <repository-url>
cd Assignmint3

# 2. Install JavaScript dependencies
npm install

# 3. (macOS only) Restore iOS Pods
cd ios
pod install
cd ..

# 4. Download google-services.json
# Get this from Firebase Console and place at:
# android/app/google-services.json

# 5. Run on Android
npx react-native run-android
```

---

## 🔄 How It Works

### The Problem
Some files are too large for GitHub:
- `ios/Pods/` folder (200-500 MB)
- `boost_*.tar.bz2` files (100+ MB each)
- Build artifacts

### The Solution
1. **Exclude** large files using `.gitignore`
2. **Keep** the "recipe" files (`Podfile.lock`, `package.json`)
3. **Regenerate** large files after cloning using the recipes

### Why It's Safe
- `Podfile.lock` contains exact versions of iOS dependencies
- `package-lock.json` contains exact versions of npm packages
- Running `pod install` recreates `ios/Pods/` identically
- Running `npm install` recreates `node_modules/` identically

---

## 🛠️ Manual Process (Advanced)

If you prefer to do it manually instead of using the script:

### Step 1: Update .gitignore

Already done! But if you need to verify:

```bash
cat .gitignore | grep -E "Pods|boost|build"
```

Should show:
```
ios/Pods/
ios/build/
android/build/
boost_*.tar.bz2
```

### Step 2: Remove Large Files from Git Tracking

```bash
# Remove Pods if tracked
git rm -r --cached ios/Pods/ 2>/dev/null || echo "Pods not tracked"

# Remove boost files if tracked
git rm --cached boost_*.tar.bz2 2>/dev/null || echo "No boost files tracked"

# Remove build files if tracked
git rm -r --cached android/build/ 2>/dev/null || echo "Build not tracked"
```

### Step 3: Check for Large Files

```bash
find . -type f -size +50M \
  -not -path "./node_modules/*" \
  -not -path "./ios/Pods/*" \
  -not -path "./.git/*"
```

Should return empty (no large files).

### Step 4: Create Branch and Commit

```bash
# Create new branch
git checkout -b dev/android-onboarding

# Stage all changes
git add .

# Commit
git commit -m "Add onboarding documentation and Android setup"

# Push
git push -u origin dev/android-onboarding
```

---

## 🔍 Troubleshooting

### "Files too large to push"

**Problem**: Git rejects push due to large files

**Solution**:
```bash
# Find what's being tracked
git ls-files | xargs ls -lh | sort -k5 -hr | head -20

# Remove large files from tracking
git rm --cached <large-file>

# Commit the removal
git commit -m "Remove large files from tracking"
```

### "Pods folder is missing after clone"

**Problem**: No `ios/Pods/` folder after cloning

**Solution**: This is normal! Restore it:
```bash
cd ios
pod install
cd ..
```

### "Can't install Pods"

**Problem**: `pod install` fails

**Solutions**:
```bash
# Update CocoaPods
sudo gem install cocoapods

# Clean and retry
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

### "Android build fails after clone"

**Problem**: Android won't build

**Solutions**:
```bash
# 1. Ensure google-services.json is present
ls -la android/app/google-services.json

# 2. Clean Android build
cd android
./gradlew clean
cd ..

# 3. Reinstall and rebuild
rm -rf node_modules
npm install
npx react-native run-android
```

---

## 📋 Checklist Before Pushing

Before running `./scripts/push-to-github.sh`, verify:

- [ ] All documentation is up to date
- [ ] No sensitive data in code (API keys, passwords)
- [ ] `.gitignore` includes large files
- [ ] Code works on Android (tested)
- [ ] Commit message is clear and descriptive

## 📋 Checklist After Cloning

After running `./scripts/restore-after-clone.sh`, verify:

- [ ] `node_modules/` folder exists (npm install worked)
- [ ] `ios/Pods/` folder exists (pod install worked) - macOS only
- [ ] `google-services.json` is in `android/app/`
- [ ] Android app builds and runs
- [ ] Read `DEVELOPER_ONBOARDING_GUIDE.md`

---

## 🎯 Quick Reference

### Push to GitHub (Hamza)
```bash
./scripts/push-to-github.sh
```

### Setup After Clone (Friend)
```bash
./scripts/restore-after-clone.sh
```

### Restore Pods Manually
```bash
cd ios && pod install && cd ..
```

### Restore npm Packages Manually
```bash
npm install
```

### Check What's Being Tracked
```bash
git ls-files | grep -E "Pods|boost|build"
# Should return nothing
```

---

## 📞 Need Help?

If the scripts don't work:

1. **Check the error message** - Usually tells you what's wrong
2. **Try manual steps** - See "Manual Process" section above
3. **Ask team lead** - Hamza can help with iOS/Git issues
4. **Check Git status** - `git status` shows what's happening

---

## ✨ Success Indicators

### After Pushing (Hamza)
- ✅ Push completes without errors
- ✅ Branch appears on GitHub
- ✅ Repository size is reasonable (<100 MB)
- ✅ All `.md` files are visible on GitHub
- ✅ Can create Pull Request

### After Cloning (Friend)
- ✅ Clone completes successfully
- ✅ Can run `npm install` without errors
- ✅ Can run `npx react-native run-android`
- ✅ App builds and launches on Android device
- ✅ Can see all documentation files

---

## 🔐 Security Notes

**Never push these to GitHub:**
- `google-services.json` (Firebase config)
- `GoogleService-Info.plist` (Firebase config)
- `.env` files (API keys)
- `*.keystore` files (signing keys)
- Any passwords or tokens

**Safe to push:**
- Documentation (`.md` files)
- Source code
- Configuration templates
- Lock files (`Podfile.lock`, `package-lock.json`)

---

## 📚 Additional Resources

- [Git Large File Storage](https://git-lfs.github.com/) - Alternative for large files
- [CocoaPods Guide](https://guides.cocoapods.org/) - iOS dependency management
- [.gitignore Best Practices](https://github.com/github/gitignore) - Common ignore patterns

---

**Last Updated**: $(date)
**Version**: 1.0
**For**: AssignMint React Native Project

