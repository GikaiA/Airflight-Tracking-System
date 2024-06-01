import React from "react";
import "./About.css";
import airforcelogo from "../images/airforcelogo.png";

function About() {
  return (
    <div className="about">
      <div className="about-logo-section">
        <img
          src={airforcelogo}
          alt="airforce-logo"
          className="about-airforce-logo"
        />
      </div>
      <div className="about-paragraph">
        <p>
          Airflight Tracker aims to address the challenge of efficiently
          tracking the qualifications and training progress of aircrew members
          while optimizing mission assignments and training opportunities. This
          system will match aircrew members with missions or training sorties
          based on their experience and skill set, factoring in criteria such as
          total flight hours, specialized certifications, and overall
          experience. By leveraging algorithms to automate this process,
          Airflight Tracker ensures that aircrew members are optimally assigned
          tasks, maximizing mission success rates and resource utilization.
        </p>
      </div>
    </div>
  );
}

export default About;
