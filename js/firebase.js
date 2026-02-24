import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAjwFzt5h5lbjjOzhG0TtFHfbstsna98NI",
  authDomain: "blog-68913.firebaseapp.com",
  projectId: "blog-68913",
  storageBucket: "blog-68913.firebasestorage.app",
  messagingSenderId: "735969933987",
  appId: "1:735969933987:web:a10854bb9f67c8fbd51d16",
  measurementId: "G-98QJJPP1Q0"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
