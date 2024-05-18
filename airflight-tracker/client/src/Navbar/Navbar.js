import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import airforcelogononame from "../images/airforcelogo-noname.png";
import supabase from "../supabaseClient";

function Navbar({ user }) {
  const naviagate = useNavigate

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      naviagate('/')
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={airforcelogononame} alt="airforce-logo" className="navbar-logo"/>
      </Link>
      <ul className="navbar-menu">
        {user ? (
          <>
            <li className="navbar-item">
              <Link to="/profile" className="navbar-link">Profile</Link>
            </li>
            <li className="navbar-item">
              <button className="login-button" onClick={handleSignOut}>Sign Out</button>
            </li>
          </>
        ) : (
          <li className="navbar-item">
            <Link to="/login" className="login-button">Log In</Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
