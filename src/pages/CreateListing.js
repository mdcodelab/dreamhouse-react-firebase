import React from 'react';
import { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase";
import { useNavigate } from "react-router-dom";


function CreateListing() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
      type: "rent",
      name: "",
      bedrooms: 1,
      bathrooms: 1,
      parking: false,
      furnished: false,
      address: "",
      description: "",
      offer: false,
      regularPrice: 0,
      discountedPrice: 0,
      latitude: 0,
      longitude: 0,
      images: {},
    });
    const {
      type,
      name,
      bedrooms,
      bathrooms,
      parking,
      address,
      furnished,
      description,
      offer,
      regularPrice,
      discountedPrice,
      latitude,
      longitude,
      images,
    } = formData;
    function onChange(e) {
      let boolean = null;
      if (e.target.value === "true") {
        boolean = true;
      }
      if (e.target.value === "false") {
        boolean = false;
      }
      // Files
      if (e.target.files) {
        setFormData((prevState) => ({
          ...prevState,
          images: e.target.files,
        }));
      }
      // Text/Boolean/Number
      if (!e.target.files) {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: boolean ?? e.target.value,
        }));
      }
    }
    async function onSubmit(e) {
      e.preventDefault();
      setLoading(true);
      if (+discountedPrice >= +regularPrice) {
        setLoading(false);
        toast.error("Discounted price needs to be less than regular price");
        return;
      }
      if (images.length > 6) {
        setLoading(false);
        toast.error("maximum 6 images are allowed");
        return;
      }
      let geolocation = {};
      let location;
      if (geolocationEnabled) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
        );
        const data = await response.json();
        console.log(data);
        geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
        geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
  
        location = data.status === "ZERO_RESULTS" && undefined;
  
        if (location === undefined) {
          setLoading(false);
          toast.error("please enter a correct address");
          return;
        }
      } else {
        geolocation.lat = latitude;
        geolocation.lng = longitude;
      }
  
      async function storeImage(image) {
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
          const storageRef = ref(storage, filename);
          const uploadTask = uploadBytesResumable(storageRef, image);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              // Handle unsuccessful uploads
              reject(error);
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      }
  
      const imgUrls = await Promise.all(
        [...images].map((image) => storeImage(image))
      ).catch((error) => {
        setLoading(false);
        toast.error("Images not uploaded");
        return;
      });
  
      const formDataCopy = {
        ...formData,
        imgUrls,
        geolocation,
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
      };
      delete formDataCopy.images;
      !formDataCopy.offer && delete formDataCopy.discountedPrice;
      delete formDataCopy.latitude;
      delete formDataCopy.longitude;
      const docRef = await addDoc(collection(db, "listings"), formDataCopy);
      setLoading(false);
      toast.success("Listing created");
      navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }
  
    if (loading) {
      return <Spinner />;
    }
    
  return (
    <main className="createlist-container">
      <h1 className="header header-create-listing">Create a List</h1>

<form className="createlist-form" onSubmit={onSubmit}>

    <p className="intro">Sell / Rent</p>
    <div className="sell-rent">
        <button type="button" className={`btn ${type==="rent" ? "btn-rent" : "btn-sell"}`} 
        id='type' value="sell" onClick={onChange}>SELL</button>
        <button type="button" className={`btn ${type==="sell" ? "btn-rent" : "btn-sell"}`} 
        id='type' value='rent' onClick={onChange}>RENT</button>
    </div>
    
    <p className="intro">Name</p>
    <input type="text" id="name" value={name} placeholder="Name"
     onChange={onChange} naxLength="32" minLength="10" maxLength="32" required></input>

    <div className="beds-baths">
        <div className="beds">
            <p className="intro">Beds</p>
            <input type="number" id="beds" value={bedrooms} onChange={onChange} min="1" max="50" required></input>
        </div>
        <div className="baths">
            <p className="intro">Baths</p>
            <input type="number" id="baths" value={bathrooms} onChange={onChange} non="1" max="50" required></input>
        </div>
    </div>
    <p className="intro">Parking spot</p>
    <div className="parking-spot sell-rent">
        <button type="button" className={`btn ${!parking ? "btn-sell" : "btn-rent"}`} 
        id='parking' value={true} onClick={onChange}>YES</button>
        <button type="button" className={`btn ${parking ? "btn-sell" : "btn-rent"}`} 
        id='parking' value={false} onClick={onChange}>NO</button>
    </div>

    <p className="intro">Furnished</p>
    <div className="furnished sell-rent">
        <button type="button" className={`btn ${!furnished ? "btn-sell" : "btn-rent"}`} 
        id='furnished' value={true} onClick={onChange}>YES</button>
        <button type="button" className={`btn ${furnished ? "btn-sell" : "btn-rent"}`} 
        id='furnished' value={false} onClick={onChange}>NO</button>
    </div>

    <p className="intro">Address</p>
    <textarea type="text" id="address" value={address} placeholder="Address"
     onChange={onChange} required></textarea>
     {!geolocationEnabled && (
        <div className="geolocation">
            <div className="latitude">
                <p className="intro">Latitude</p>
                <input type="number" id="latitude" value={latitude} min="90" max="90" onChange={onChange} require></input>
            </div>

            <div className="longitude">
                <p className="intro">Longitude</p>
                <input type="number" id="longitude" value={longitude} min="180" max="180" onChange={onChange} require></input>
            </div>
        </div>
     )}

    <p className="intro">Description</p>
    <input type="text" id="description" value={description} placeholder="Description"
     onChange={onChange} naxLength="32" minLength="10" required></input>

    <p className="intro">Offer</p>
    <div className="offer sell-rent">
        <button type="button" className={`btn ${!offer ? "btn-rent" : "btn-sell"}`} 
        id='offer' value={true} onClick={onChange}>YES</button>
        <button type="button" className={`btn ${offer ? "btn-rent" : "btn-sell"}`} 
        id='offer' value={false} onClick={onChange}>NO</button>
    </div>

            <p className="intro">Regular price</p>
            <div className="regular-price">
            <input type="number" id="regularPrice" value={regularPrice} onChange={onChange} 
            min="50" max="400000000" required className="regular-price"></input>
            <div className="span">{type === "rent" && <span>$ / Month</span>} </div>
            </div>

            <p className="intro">Discounted price</p>
            <div className="discounted-price">
            <input type="number" id="discountedPrice" value={discountedPrice} onChange={onChange} 
            min="50" max="400000000" required className="discounted-price"></input>
            <div className="span">{type === "rent" && <span>$ / Month</span>} </div>
            </div>

            <div className="images">
                <p className="intro">Images</p>
                <p className="intro-sub">The first image will be the cover (max 6)</p>
                <input type="file" id="images" onChange={onChange} 
                accept=".png, .jpg, .jpeg" multiple required className="input-file"></input>
            </div>

            <button type="submit" className="btn btn-create-listing">Create Listing</button>
            
</form>

    </main>
  );
}

export default CreateListing;
