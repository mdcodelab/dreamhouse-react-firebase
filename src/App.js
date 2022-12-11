import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Offers from "./pages/Offers";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from './pages/Profile';
import Header from "./components/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from './pages/CreateListing';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/offers" element={<Offers />} />


          <Route path="/create-listing" element={<PrivateRoute></PrivateRoute>}>
          <Route path="/create-listing" element={<CreateListing></CreateListing>}></Route>
          </Route>
          
         <Route path="/create-listing" element={<CreateListing></CreateListing>}></Route>

        </Routes>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        fontSize="15px"
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{fontSize: "16px", textAlign:"justify"}}
        theme="dark"/>
    </>
  
  );
}

export default App;


