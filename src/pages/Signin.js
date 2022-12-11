import React from 'react';
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai";
import {Link, useNavigate} from "react-router-dom"; 
import OAuth from '../components/OAuth';
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {toast} from "react-toastify";


function Signin() {
const[formData, setFormData]=React.useState({
  name: "",
  email: "",
  password:""
});

const {email, password}=formData;

const navigate=useNavigate();


function onChange(e) {
  setFormData(prevState => {
    return {...prevState, [e.target.id]: e.target.value}
  })
}

const [showPassword, setShowPassword]=React.useState(true);


async function onSubmit(e) {
  e.preventDefault();
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredential.user) {
      navigate("/");
    }
  } catch (error) {
    toast.error("Bad user credentials");
  }
}


  return (
    <section className="signin-container">
    <h1 className="header"> Sign in</h1>
    <div className="sigin-wrapper">

      <div className="signin-image">
        <img src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8a2V5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"></img>
      </div>
    
    <div className="signin-form">
      <form action="" onSubmit={onSubmit}>
        <input type="email" id="email" value={email} placeholder="Your email" onChange={onChange}></input>
        <div className="input-password">
        <input type={showPassword ? "password" : "text"} id="password" value={password} placeholder="Your password" onChange={onChange}></input>
        <AiFillEye className={`icon eye-fill ${!showPassword && "hidden"}`} onClick={() => setShowPassword(prevState => !prevState)}></AiFillEye>
        <AiFillEyeInvisible className={`icon eye-invisible ${showPassword && "hidden"}`} onClick={() => setShowPassword(prevState => !prevState)}></AiFillEyeInvisible>
        </div>

        <div className="signin-obs">
          <p>Dont't have an account? <Link to="/sign-up" className="register-link">Register.</Link></p>
          <p><Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link></p>
        </div>

        <button type="submit" className="signin-btn btn">SIGN IN</button>


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

export default Signin;
