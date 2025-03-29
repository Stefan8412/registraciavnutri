import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbvOuickC37Hm30KrKuTfHGccOLw4tHGs",
  authDomain: "registrationapp-4ef54.firebaseapp.com",
  projectId: "registrationapp-4ef54",
  storageBucket: "registrationapp-4ef54.firebasestorage.app",
  messagingSenderId: "813247236026",
  appId: "1:813247236026:web:252419ae8208b4b8f67f83",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
