# Firebase Security Rules

## Firestore Rules

Apply these rules in the Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, create, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
  }
}
```

## Realtime Database Rules

Apply these rules in the Firebase Console > Realtime Database > Rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

## Storage Rules

Apply these rules in the Firebase Console > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{uid}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## Important Notes

1. **Apply these rules in the Firebase Console** - they cannot be applied programmatically
2. **Test thoroughly** - these rules are restrictive and only allow users to access their own data
3. **Update project configuration** - replace placeholder values in `src/lib/firebase.ts` with your actual Firebase project config
4. **Monitor usage** - check Firebase Console logs to ensure rules are working as expected
