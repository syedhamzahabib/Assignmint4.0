#!/bin/bash

# Patch RCT-Folly Time.h to fix clockid_t typedef redefinition error on Apple platforms
# This script should be run after pod install

echo "Patching RCT-Folly Time.h header..."

# Find the Time.h file in Pods
TIME_H_FILE="ios/Pods/RCT-Folly/folly/portability/Time.h"
HEADERS_PRIVATE_FILE="ios/Pods/Headers/Private/RCT-Folly/folly/portability/Time.h"

if [ -f "$TIME_H_FILE" ]; then
    echo "Found Time.h file: $TIME_H_FILE"
    
    # Replace the problematic guard with a safer one
    sed -i '' 's/#if !defined(clockid_t) && !defined(__clockid_t_defined) && !defined(_CLOCKID_T)/#if !defined(__clockid_t_defined) \&\& !defined(_CLOCKID_T) \&\& !defined(__APPLE__)/g' "$TIME_H_FILE"
    
    echo "Patched $TIME_H_FILE"
else
    echo "Warning: Time.h file not found at $TIME_H_FILE"
fi

if [ -f "$HEADERS_PRIVATE_FILE" ]; then
    echo "Found Headers/Private Time.h file: $HEADERS_PRIVATE_FILE"
    
    # Replace the problematic guard with a safer one
    sed -i '' 's/#if !defined(clockid_t) && !defined(__clockid_t_defined) && !defined(_CLOCKID_T)/#if !defined(__clockid_t_defined) \&\& !defined(_CLOCKID_T) \&\& !defined(__APPLE__)/g' "$HEADERS_PRIVATE_FILE"
    
    echo "Patched $HEADERS_PRIVATE_FILE"
else
    echo "Warning: Headers/Private Time.h file not found at $HEADERS_PRIVATE_FILE"
fi

echo "RCT-Folly header patched successfully"
