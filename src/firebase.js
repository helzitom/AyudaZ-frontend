import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBFm5LS4COo44ozF_AYzdU3WzG77K1v130",
    authDomain: "ayuda-z-c22bb.firebaseapp.com",
    projectId: "ayuda-z-c22bb",
    storageBucket: "ayuda-z-c22bb.firebasestorage.app",
    messagingSenderId: "400356346915",
    appId: "1:400356346915:web:1686e193926ecba6c67596",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();