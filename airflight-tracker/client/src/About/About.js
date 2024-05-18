import React from "react";
import "./About.css";
import airforcelogo from "../images/airforcelogo.png";

function About() {
  return (
    <div className="about">
      <div className="logo-section">
        <img
          src={airforcelogo}
          alt="airforce-logo"
          className="about-airforce-logo"
        ></img>
      </div>
      <div className="about-paragraph">
        
      </div>
    </div>
  );
}

export default About;
