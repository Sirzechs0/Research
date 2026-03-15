import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyA0KuFigt75UqNmQ8Ze-gm_Qe8XC1VtfBA",
  authDomain: "pcshs-sms.firebaseapp.com",
  projectId: "pcshs-sms",
  storageBucket: "pcshs-sms.firebasestorage.app",
  messagingSenderId: "23508357934",
  appId: "1:23508357934:web:7d11fe6b9327a2e74760bf",
  measurementId: "G-LXR4QKXDME"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, onAuthStateChanged, signOut };