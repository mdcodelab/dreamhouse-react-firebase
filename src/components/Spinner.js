import React from 'react';
import spinner from "../assets/svg/spinner.svg"

function Spinner() {
  return (
    <div className="spinner">
      <img src={spinner}></img>
    </div>
  );
}

export default Spinner;
