import React from 'react';
import {Link, useNagigate} from "react-router-dom"; 
import OAuth from '../components/OAuth';
import { getAuth, sendPasswordResetEmail} from "firebase/auth";
import {toast} from "react-toastify";



function ForgotPassword() {
  const[email, setEmail]=React.useState("");
  
  function onChange(e) {
    setEmail(e.target.value);
  }


  async function onSubmit(e) {
e.preventDefault();
try {
const auth = getAuth();
await sendPasswordResetEmail(auth, email);
toast.success("Email was sent");
  
} catch (error) {
  toast.error("Could not sens reset password.")
}
  }

  return (
    <section className="forgot-password-container">
      <h1 className="header"> Forgot password</h1>
    <div className="sigin-wrapper">

      <div className="signin-image">
        <img src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8a2V5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"></img>
      </div>
    
    <div className="signin-form">
      <form action="" onSubmit={onSubmit}>
        <input type="email" id="email" value={email} placeholder="Your email" onChange={onChange}></input>

        <div className="signin-obs">
          <p>Dont't have an account? <Link to="/sign-up" className="register-link">Register.</Link></p>
          <p><Link to="/sign-in" className="forgot-password-link">Sign in instead.</Link></p>
        </div>

        <button type="submit" className="signin-btn btn">SEND SESET PASSWORD</button>


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

export default ForgotPassword;
