#!/bin/bash

# Fix RCT-Folly clockid_t redefinition issue
FOLLY_HEADER="/Users/hamza/Assignmint3/ios/Pods/Headers/Private/RCT-Folly/folly/portability/Time.h"

if [ -f "$FOLLY_HEADER" ]; then
    echo "Patching RCT-Folly Time.h header..."
    
    # Create backup
    cp "$FOLLY_HEADER" "$FOLLY_HEADER.backup"
    
    # Apply the fix
    sed -i '' 's/typedef uint8_t clockid_t;/#ifndef clockid_t\
typedef uint8_t clockid_t;\
#endif/' "$FOLLY_HEADER"
    
    echo "RCT-Folly header patched successfully"
else
    echo "RCT-Folly header not found at $FOLLY_HEADER"
fi
