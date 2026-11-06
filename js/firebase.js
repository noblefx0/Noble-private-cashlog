import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
        
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, EmailAuthProvider, linkWithCredential } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
        
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
        
const firebaseConfig = { apiKey: "AIzaSyA0PfsjFQCxx17sPQdsAK69quONGpJHUvE", authDomain: "noble-private-cash-log.firebaseapp.com", databaseURL: "https://noble-private-cash-log-default-rtdb.europe-west1.firebasedatabase.app", projectId: "noble-private-cash-log", storageBucket: "noble-private-cash-log.firebasestorage.app", messagingSenderId: "532091769228", appId: "1:532091769228:web:812a82176516069d3386a9" };
const appFirebase = initializeApp(firebaseConfig), auth = getAuth(appFirebase), db = initializeFirestore(appFirebase, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) }), provider = new GoogleAuthProvider();
export { auth, db, provider };
