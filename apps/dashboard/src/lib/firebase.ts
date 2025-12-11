import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCorVC_e3NhKaSOaJB-JKnQAkYYjBc6qFg",
  authDomain: "astrygo-cloud.firebaseapp.com",
  projectId: "astrygo-cloud",
  storageBucket: "astrygo-cloud.firebasestorage.app",
  messagingSenderId: "817734434563",
  appId: "1:817734434563:web:484a96f01acea7e41ff336"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
