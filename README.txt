CASHLOG - UPDATED PROJECT

Open this folder in VS Code and run index.html with Live Server, or deploy the folder contents to the root of your GitHub Pages repository.

DESIGN AND LOADING UPDATES
- Keeps the black main background and uses the same charcoal/ash card colour throughout the app.
- Removes the full-screen wallet animation when switching between already-loaded tabs.
- Keeps the full-screen wallet + CASHLOG animation for the initial app opening.
- Uses the same wallet + CASHLOG animation on a translucent dark overlay when cloud records are loading, or when saving/deleting income, money removed, and internal transfers.
- Does not add spinners, progress bars, or separate loading text.
- Buttons remain protected against duplicate submissions while a save is in progress, but no longer fade to grey.
- Login and authentication layout/functionality are otherwise unchanged.

IMPORTANT
Keep index.html, css/, js/, and assets/ together in the same published folder. Do not rename Firebase collections or replace your Firebase configuration. Existing account records continue using the same Firebase paths as the previous V5 build.

This project has been syntax-checked, but still needs to be tested in your own browser with your Firebase project. Keep a backup of the currently working version until you finish testing.
