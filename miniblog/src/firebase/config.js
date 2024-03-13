// Import das funções de inicializzação
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do app Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJR4uGE7bPa4_Ac4L2QuUghHRP8nvqSl4",
  authDomain: "miniblog-naimaf.firebaseapp.com",
  projectId: "miniblog-naimaf",
  storageBucket: "miniblog-naimaf.appspot.com",
  messagingSenderId: "11900671761",
  appId: "1:11900671761:web:3def3564c63d4193191eb0",
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
