import React from 'react';
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai";
import {Link, Navigate} from "react-router-dom"; 
import OAuth from '../components/OAuth';
import { getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { db } from "../Firebase";
import { doc, serverTimestamp, setDoc, collection, addDoc } from "firebase/firestore";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";


function Signup() {

  const[formData, setFormData]=React.useState({
    name: "",
    email: "",
    password:""
  });
  
  const {name, email, password}=formData;
  
  function onChange(e) {
    setFormData(prevState => {
      return {...prevState, [e.target.id]: e.target.value}
    })
  }
  
  const [showPassword, setShowPassword]=React.useState(true);

  const navigate = useNavigate();



  async function onSubmit(e) {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const user = userCredential.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      //await setDoc(doc(db, "users", user.uid), formDataCopy);

  //register in Firestore Database
    const docRef = await addDoc(collection(db, "users"), formDataCopy);
    console.log("Document written with ID: ", docRef.id);
    
    //then navigate to the Home page
    toast.success("Sign up was successful");
    
    navigate("/");
      
    } catch (error) {
      toast.error("Something went wrong with the registration.");
    }
  }

  return (
    <section className="signin-container">
      <h1 className="header"> Sign up</h1>
    <div className="sigin-wrapper">

      <div className="signin-image">
        <img src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8a2V5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"></img>
      </div>
    
    <div className="signin-form">
      <form action="" onSubmit={onSubmit}>
      <input type="text" id="name" value={name} placeholder="Full name" onChange={onChange}></input>
        <input type="email" id="email" value={email} placeholder="Your email" onChange={onChange}></input>
        <div className="input-password">
        <input type={showPassword ? "password" : "text"} id="password" value={password} placeholder="Your password" onChange={onChange}></input>
        <AiFillEye className={`icon eye-fill ${!showPassword && "hidden"}`} onClick={() => setShowPassword(prevState => !prevState)}></AiFillEye>
        <AiFillEyeInvisible className={`icon eye-invisible ${showPassword && "hidden"}`} onClick={() => setShowPassword(prevState => !prevState)}></AiFillEyeInvisible>
        </div>

        <div className="signin-obs">
          <p>Have an account? <Link to="/sign-in" className="register-link">Sign in.</Link></p>
          <p><Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link></p>
        </div>

        <button type="submit" className="signin-btn btn">SIGN UP</button>


      <div className="signin-or">
      <div className="before"></div>
        <p className="or"><b>OR</b></p>
        <div className="after"></div>
      </div>

      <OAuth></OAuth>
        
        


      </form>
    </div>
    </div>
    </section>
  );
}

export default Signup;
