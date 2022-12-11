import React from 'react';
import {getAuth, signInWithCustomToken, updateProfile} from "firebase/auth";
import { Navigate, useNavigate} from 'react-router-dom';
import { doc, updateDoc, collection, getDocs, query, where, orderBy, QueryDocumentSnapshot} from 'firebase/firestore';
import { db } from '../Firebase';
import {toast} from "react-toastify";
import {FcHome} from "react-icons/fc"
import {Link} from "react-router-dom";
import ListingItem from "../components/ListingItem";

function Profile() {
  const auth=getAuth();

  const[formData, setFormData]=React.useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const {name, email}=formData;

  const navigate=useNavigate();

  const[listings, setListings]=React.useState(null);
  const[loading, setLoading]=React.useState(false);

function onLogout() {
auth.signOut();
navigate("/")
}

//modify name in the input fields
const [changeDetail, setChangeDetail]=React.useState(true);


function onChange (e) {
setFormData((prevState) => {
 return {...prevState, [e.target.id]: e.target.value}
})
}

let styleInput={
  backgroundColor: changeDetail ? "pink" : "white"
}

async function onSubmit() {
  try {
    if (auth.currentUser.displayName !== name) {
      //update display name in firebase auth
      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      // update name in the firestore

      const docRef = doc(db, "users", auth.currentUser.uid);
      console.log(docRef);   //create the refference
      await updateDoc(docRef, {
        name: name,
      });
    }
    toast.success("Profile details updated.");
  } catch (error) {
    toast.error("Could not update the profile details.");
  }
}

//get lists from Firebase
React.useEffect(() => {
  async function fetchUserListings() {
    const listingRef = collection(db, "listings");
    const q = query(
      listingRef,
      where("userRef", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );
    const querySnap = await getDocs(q);
    let listings = [];
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    setListings(listings);
    setLoading(false);
  }
  fetchUserListings();
}, [auth.currentUser.uid]);

  return (
  <>
    <section className="profile-container">
    <h1 className="header">My Profile</h1>
      <div className="profile-wrapper">

      <form className="profile-form">
        <input type="text" id="name" value={name} disabled={!changeDetail} onChange={onChange}
        style={styleInput}></input>
        <input type="email" id="email" value={email} disabled={!changeDetail} onChange={onChange}
        style={styleInput}></input>
        <div className="profile-obs">
          <p>Do you want to change your name? <span onClick={() => {
            changeDetail && onSubmit();
            setChangeDetail(prevState => !prevState);
          }}>
          {changeDetail ? "Apply change" : "Edit"}</span></p>
          <p onClick={onLogout} className="signout-para">Sign out.</p>
        </div>
      </form>

      <button type="submit" className="btn profile-btn"><Link to="/create-listing" 
      className="link"><FcHome className="icon profile-icon" /> Sell or rent your home</Link></button>
      </div>
    </section>


    <div className="listings-container">
      {!loading && (
          <>
            <h2 className="header-listing">My Listing</h2>
            <ul className="">
            {listings.map((listing) => (
              <ListingItem key={listing.id} id={listing.id} listing={listing.data}></ListingItem>
            ))}
            </ul>
          </>
      )}
    </div>
</> 
    
  );
}

export default Profile;



