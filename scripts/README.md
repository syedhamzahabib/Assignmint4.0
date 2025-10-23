# AssignMint Scripts

Utility scripts for development and deployment.

## Available Scripts

### 🚀 push-to-github.sh
**For: Project Owner (Hamza)**

Safely push the project to GitHub, excluding large files.

```bash
./scripts/push-to-github.sh
```

Features:
- Automatically excludes large files (Pods, boost, build folders)
- Creates a new branch for safety
- Interactive prompts for branch name and commit message
- Shows what will be committed before pushing
- Verifies .gitignore is correct

### 🔄 restore-after-clone.sh
**For: New Developer (Friend)**

Restore all dependencies after cloning from GitHub.

```bash
./scripts/restore-after-clone.sh
```

Features:
- Checks Node.js version
- Installs npm dependencies
- Installs iOS Pods (macOS only)
- Verifies Android SDK setup
- Checks for required configuration files
- Provides next steps

## Quick Start

### Pushing Updates to GitHub

```bash
# Make your changes
# ...

# Run the push script
./scripts/push-to-github.sh

# Follow the prompts:
# 1. Enter branch name (e.g., dev/android-onboarding)
# 2. Review files to be committed
# 3. Confirm push
# 4. Enter commit message
```

### Setting Up After Clone

```bash
# Clone the repository
git clone <repo-url>
cd Assignmint3

# Run the restore script
./scripts/restore-after-clone.sh

# Follow the instructions:
# 1. Wait for npm install
# 2. Wait for pod install (if macOS)
# 3. Download google-services.json
# 4. Read DEVELOPER_ONBOARDING_GUIDE.md
```

## Troubleshooting

### Permission Denied

If you get "Permission denied" when running scripts:

```bash
chmod +x scripts/*.sh
```

### Script Not Found

Make sure you're in the project root:

```bash
cd /Users/hamza/Assignmint3
./scripts/push-to-github.sh
```

### Pods Not Restoring

If `pod install` fails:

```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

## Other Useful Scripts

### Build Scripts (in package.json)

```bash
# Run on Android
npm run android

# Run on iOS
npm run ios

# Start Metro bundler
npm start

# Clean and rebuild
npm run clean:rn
```

### Firebase Scripts

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Start emulators
npm run emu:start
```

## Documentation

For more detailed information, see:
- `GITHUB_PUSH_GUIDE.md` - Comprehensive push and restore guide
- `DEVELOPER_ONBOARDING_GUIDE.md` - Full developer onboarding
- `README.md` - Project overview

## Notes

- These scripts are designed for macOS/Linux
- Windows users may need to adapt the scripts or use Git Bash
- Always read the prompts carefully before confirming actions
- The push script will NOT push to `main` directly - it creates a branch

## Support

If you encounter issues:
1. Check the error message
2. Read the relevant documentation
3. Try the manual steps in `GITHUB_PUSH_GUIDE.md`
4. Contact the team lead

