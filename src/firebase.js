// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

const addWhisky = async (whisky) => {
    try {
        await addDoc(collection(db, "whiskies"), whisky);
    } catch (error) {
        console.error("Error adding whisky: ", error);
    }
};

const fetchDistilleries = async (region = undefined) => {
    let distilleryQuery = collection(db, 'distilleries');
    if (region) {
        distilleryQuery = query(distilleryQuery, where('region', '==', region));
    }
    const snapshot = await getDocs(distilleryQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export { app, db, storage, addWhisky, fetchDistilleries };