import React from "react";
import "./Database.css";
import carlton from "../images/carlton.gif";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="database">
      <p className="database-sentence"> YOU MADE IT TO THE DATABASE</p>
      <img src={carlton} alt="carlton-gif" className="carlton"></img>
      <Link to="/">
        <button className="logout-button">Log Out </button>
      </Link>
    </div>
  );
}

export default Dashboard;
