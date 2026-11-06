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
