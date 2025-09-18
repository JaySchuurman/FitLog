// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "BNqQs_evNJm_fUmLvY3eIOXl5dtJwgKjIkGVweVSNrlV7ztUa4c3hiOto1s8NO21eRmhz9uWaTdi5WQEtCERx-o",
  authDomain: "projectlj3mbo.firebaseapp.com",
  projectId: "projectlj3mbo",
  storageBucket: "projectlj3mbo.appspot.com",
  messagingSenderId: "756572762342",
  appId: "1:756572762342:web:YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services to use in your app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
