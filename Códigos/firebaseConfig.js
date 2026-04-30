  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAsLOPyqX7aBsmXhCI4NGk8_kwUs2nyYg",
  authDomain: "projeto-igreja-223ed.firebaseapp.com",
  projectId: "projeto-igreja-223ed",
  storageBucket: "projeto-igreja-223ed.firebasestorage.app",
  messagingSenderId: "78164227599",
  appId: "1:78164227599:web:4035ec78acb14ad738957a",
  measurementId: "G-SCZTED96HG"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Auth (Apenas UMA vez)
export const auth = getAuth(app);
auth.languageCode = 'pt-br'; // <--- Força o idioma para português

// Inicializa o Banco de Dados
export const db = getFirestore(app);