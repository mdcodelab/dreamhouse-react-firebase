import React from 'react';
import {Link} from "react-router-dom";
import {useLocation, useNavigate} from "react-router-dom";
import {getAuth, onAuthStateChanged} from "firebase/auth";


export default function Header() {

const location=useLocation();
//console.log(location.pathname);

function pathMatchRoute(route) {
if(route === location.pathname) {
    return true;
}
}

//make "sign in"/"profile" dynamic based on authentication
const[pageState, setPageState]=React.useState("Sign in");
const auth=getAuth();
React.useEffect(() => {
  onAuthStateChanged(auth, (user) => {
    if(user) {
      setPageState("Profile")
    } else {
      setPageState("Sign in")
    }
  })
}, [auth])


const navigate=useNavigate();

let styleHome = {
  color: pathMatchRoute("/") ? "black" : " #696969",
  borderBottom: pathMatchRoute("/") ? "solid red 2px" : "none",
}

let styleOffers = {
  color: pathMatchRoute("/offers") ? "black" : " #696969",
  borderBottom: pathMatchRoute("/offers") ? "solid red 2px" : "none",
}

let styleSignin = {
  color: pathMatchRoute("/") ? "black" : " #696969",
  borderBottom: (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) ? "solid red 2px" : "none",
}



  return (
      <div className="header-container">
      <header>
        <div className="logo-img-wrapper">
          <img src={require("../assets/img/dream-house-logo.png")}
            alt="logo" className="image-logo" onClick={() => navigate("/")}
          />
        </div>

        <div className="nav-wrapper">
          <ul>
            <li style={styleHome} onClick={() => navigate("/")}>Home</li>

            <li style={styleOffers} onClick={() => navigate("/offers")}>Offers</li>

            <li style={styleSignin} onClick={() => navigate("/profile")}>{pageState}</li>
          </ul>
        </div>
      </header>
    </div>

  );
}
