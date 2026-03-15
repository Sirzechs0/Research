// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0KuFigt75UqNmQ8Ze-gm_Qe8XC1VtfBA",
  authDomain: "pcshs-sms.firebaseapp.com",
  projectId: "pcshs-sms",
  storageBucket: "pcshs-sms.firebasestorage.app",
  messagingSenderId: "23508357934",
  appId: "1:23508357934:web:7d11fe6b9327a2e74760bf",
  measurementId: "G-LXR4QKXDME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);