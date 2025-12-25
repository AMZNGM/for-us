# Firebase setup notes

Create the following environment variables (Next.js `.env.local`):

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

How to deploy rules (requires Firebase CLI):

```bash
firebase login
firebase init firestore
# place firestore.rules as your rules file or update firebase.json accordingly
firebase deploy --only firestore:rules
```

Notes:

- The `src/lib/firebaseClient.js` file exports auth/db/storage helpers for client usage.
- The Firestore collection name used is `posts` and documents follow the schema described in project notes.
