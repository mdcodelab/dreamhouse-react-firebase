import React from 'react';
import {FcGoogle} from "react-icons/fc";
import {GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, signInWithRedirect} from "firebase/auth";
import {db} from "../Firebase";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {toast} from 'react-toastify';
import {useNavigate} from "react-router-dom";


 function OAuth() {

  const navigate=useNavigate();

  async function onGoogleClick () {
    try {
      const auth=getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // check for the user

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  }



  return (
    <button type="button" className="btn oath-btn" onClick={onGoogleClick}>
      <FcGoogle className="icon oath-icon"/> Continue with Googe</button>

  );
}

export default OAuth;
