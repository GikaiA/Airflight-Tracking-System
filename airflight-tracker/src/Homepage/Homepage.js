import React from "react";
import "./Homepage.css";
import airforcebg from "../videos/airforce-bg.mp4";
import airforcelogo from "../images/airforcelogo.png";

function Homepage() {
  return (
    <div className="homepage">
      <video autoPlay muted controls={false} loop playsInline={true}>
        <source src={airforcebg} type="video/mp4"></source>
      </video>
      <div className="logo-section">
        <img
          src={airforcelogo}
          alt="airforce-mainlogo"
          className="airforce-logo"
        ></img>
      </div>
    </div>
  );
}

export default Homepage;
