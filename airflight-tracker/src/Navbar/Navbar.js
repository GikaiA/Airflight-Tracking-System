import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import airforcelogononame from "../images/airforcelogo-noname.png";

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/">
        <img
          src={airforcelogononame}
          alt="airforce-logo"
          className="navbar-logo"
        ></img>
      </Link>
      <ul className="navbar-menu">
        <li className="navbar-item">
          <button className="login-button">
            <Link to="/">Home</Link>
          </button>
        </li>
        <li className="navbar-item">
          <button className="login-button">
            <Link to="/login">Log In</Link>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
