CASHLOG V6 — DAILY OVERVIEW + NOTEBOOK BRANDING

WHAT CHANGED
- Homepage cards now show only cash received today, transfers received today, and their combined total.
- The daily overview resets naturally at the local calendar date boundary because it filters records by today’s date. It does not include old income, expenses, or internal transfers.
- Quick Actions remain Add Income, Move Money, and Remove Money.
- Existing bottom navigation and other screens are retained.
- Replaced the previous wallet branding with the selected C + L + notebook concept (Option 2).

CALCULATION NOTES
- Daily home totals sum income records dated today only.
- Internal transfers are not counted as income.
- Monthly report continues to calculate selected-month income, money removed, and cash/bank remaining separately.
- Cash/bank remaining in the monthly report is a net movement for the selected month, not an opening-balance ledger.
- Source-balance checks for removals and internal transfers continue to use selected-month activity through the transaction date.

PROJECT STRUCTURE
- index.html is the app entry point.
- css/style.css contains styling.
- js/app.js contains app logic.
- js/firebase.js contains Firebase initialization.
- js/screens contains the screen fragments.
- assets contains branding images.

DEPLOYMENT
Replace matching files in your existing repository while preserving this folder structure. Keep a backup of your current working project first. Deploy through GitHub Pages or run with a local web server; do not open index.html as a file:// URL.

IMPORTANT
This update does not change Firebase collection names, user IDs, or existing records. Static checks can verify syntax and local structure, but live Firebase authentication and Firestore operations must still be tested in your deployed app.


V7 DEVICE FEATURES
- Optional device PIN lock is separate from Firebase sign-in. PIN hashes use PBKDF2 and a random salt in this browser profile. It is a convenience privacy lock, not a substitute for device security or server-side authorization.
- Biometric unlock uses the browser's WebAuthn platform authenticator where available. HTTPS is required; support varies by browser/device.
- Light, dark and system appearance choices are stored on this device.
- PWA installation uses manifest.json and service-worker.js. On Android Chrome, use Install app / Add to Home screen.
- Offline support caches the app shell and enables Firestore persistent local cache. Sign in and load records online at least once first. Firestore queues supported writes offline and syncs when connectivity returns. Authentication and first-time account access still require internet.
- Test carefully on your own device before relying on offline writes. Keep backups.


VERSION 7.2 UPDATE
- Settings now opens as a dedicated full-screen view, separate from all transaction screens.
- PIN lock now fills the phone viewport and centres only the lock card; app content is hidden while locked.
- Settings displays the app version (7.2).
- Service-worker cache version bumped so browsers can fetch the updated files.
