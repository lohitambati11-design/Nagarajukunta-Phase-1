
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getFirestore,
    doc,
    setDoc,
    collection,
    getDocs,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD_ovKPx9TC3K0wlNyGV7ede7seloMNUB8",
    authDomain: "nagarajukunta-phase-1.firebaseapp.com",
    projectId: "nagarajukunta-phase-1",
    storageBucket: "nagarajukunta-phase-1.firebasestorage.app",
    messagingSenderId: "682554114053",
    appId: "1:682554114053:web:054c6fcb638a442fe05c6c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export {
    doc,
    setDoc,
    collection,
    getDocs,
    onSnapshot,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
};
