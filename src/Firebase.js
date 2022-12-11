// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAmc0579un-L-qPEerbP2WaTfacnPrNsCE",
  authDomain: "dreamhouse-717bc.firebaseapp.com",
  projectId: "dreamhouse-717bc",
  storageBucket: "dreamhouse-717bc.appspot.com",
  messagingSenderId: "103246303109",
  appId: "1:103246303109:web:05f41eeb0eb4008b753eec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);

export const db=getFirestore(app);