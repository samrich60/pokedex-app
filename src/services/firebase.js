// src/services/firebase.js
// ============================================================
// INSTRUÇÕES DE CONFIGURAÇÃO:
// 1. Acesse https://console.firebase.google.com/
// 2. Crie um novo projeto (ex: "pokedex-app")
// 3. Adicione um app Web ao projeto
// 4. Copie as credenciais geradas e substitua os valores abaixo
// 5. No Firestore, crie o banco em modo "test" para desenvolvimento
// ============================================================

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqbWsye0eMJYr2Asooj4jaSgu259W9vNo",
  authDomain: "pokedex-app-3752c.firebaseapp.com",
  projectId: "pokedex-app-3752c",
  storageBucket: "pokedex-app-3752c.firebasestorage.app",
  messagingSenderId: "234493386889",
  appId: "1:234493386889:web:c5fe8b314e9da517c32658",
  measurementId: "G-2TCT6QK96B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);