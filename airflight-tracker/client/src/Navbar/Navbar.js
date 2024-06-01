import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import airforcelogononame from "../images/airforcelogo-noname.png";

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/">
        <img
          src={airforcelogononame}
          alt="airforce-logo"
          className="navbar-logo"
        />
      </Link>
      <ul className="navbar-menu">
        <li className="navbar-item">
          <Link to="/about" className="navbar-text">
            About
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/findapilot" className="navbar-text">
            Find a Pilot
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/search" className="navbar-text">
            Search
          </Link>
        </li>
        <li className="navbar-item">
          <button className="login-button">
            <Link to="/login" className="login-text">
              Log In
            </Link>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
