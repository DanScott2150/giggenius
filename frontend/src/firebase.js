// Firebase integration
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

// Firebase setup & init
const firebaseConfig = {
    apiKey: import.meta.env.VITE_apiKey,
    authDomain: import.meta.env.VITE_authDomain,
    databaseURL: import.meta.env.VITE_databaseURL,
    projectId: import.meta.env.VITE_projectId,
    storageBucket: import.meta.env.VITE_storageBucket,
    messagingSenderId: import.meta.env.VITE_messagingSenderId,
    appId: import.meta.env.VITE_appId
};


export const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);
export const userRef = ref( database, 'users');
