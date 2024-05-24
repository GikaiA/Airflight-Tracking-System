import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import airforcelogononame from "../images/airforcelogo-noname.png";
import supabase from "../supabaseClient";

function CheckLogin() {
  let SessionData = supabase.auth.getSession();
  //console.log(`SessionData: `, SessionData)

  //let UserData = supabase.auth.getUser();
  //console.log(`UserData: `, UserData)

  if (SessionData == null) {
    return LoginNavbar()
  } else {
    return LogOutNavbar()
  }
}

function LoginNavbar() {
  const naviagate = useNavigate

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();

      const { data, error } = await supabase.auth.getSession()
      console.log(`session: `, data)

      naviagate('/')
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const CheckSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    console.log(`session: `, data)
  }

  return(
    <div className="navbar">
      <Link to="/"><img src={airforcelogononame} alt="airforce-logo" className="navbar-logo"/></Link>
      <ul className="navbar-menu">
        <li className="navbar-item"><button onClick={CheckSession}></button>CheckSession</li>
        <li className="navbar-item"><Link to='/about' className="navbar-text">About</Link></li>
        <li className="navbar-item"><Link to='/findapilot' className="navbar-text">Find a Pilot</Link></li>
        <li className="navbar-item"><Link to='/search' className="navbar-text">Search</Link></li>
        <li className="navbar-item"><Link to='/Dashboard' className="navbar-text">Dashboard</Link></li>
        <li className="navbar-item"><button className="login-button" onClick={handleSignOut}>Sign Out</button></li>
      </ul>
    </div>
  )
}

function LogOutNavbar() {

  const CheckSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    console.log(`session: `, data)
  }

  return (
    <div className="navbar">
    <Link to="/"><img src={airforcelogononame} alt="airforce-logo" className="navbar-logo"/></Link>
    <ul className="navbar-menu">
      <li className="navbar-item"><button onClick={CheckSession}></button>CheckSession</li>
      <li className="navbar-item"><Link to='/about' className="navbar-text">About</Link></li>
      <li className="navbar-item"><button className="login-button"><Link to="/login" className="login-text">Log In</Link></button></li>
    </ul>
  </div>
  )
}

function Navbar({ data }) {
  const naviagate = useNavigate

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();

      const { data, error } = await supabase.auth.getSession()
      console.log(`session: `, data)

      naviagate('/')
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const CheckUser = async () => {
    const { data, error } = await supabase.auth.getUser()
    console.log(`session: `, data)
  }

  return (
    <div className="navbar">
      <Link to="/"><img src={airforcelogononame} alt="airforce-logo" className="navbar-logo"/></Link>
      <ul className="navbar-menu">
        <li className="navbar-item"><button onClick={CheckUser}></button>CheckSession</li>

        <li className="navbar-item"><Link to='/about' className="navbar-text">About</Link></li>
        <li className="navbar-item"><Link to='/findapilot' className="navbar-text">Find a Pilot</Link></li>
        <li className="navbar-item"><Link to='/search' className="navbar-text">Search</Link></li>
        <li className="navbar-item"><Link to='/Dashboard' className="navbar-text">Dashboard</Link></li>
        <li className="navbar-item"><button className="login-button" onClick={handleSignOut}>Sign Out</button></li>

        <li className="navbar-item">
          {data ? (
            <button className="login-button" onClick={handleSignOut}>Sign Out</button>
          ) : (
            <button className="login-button"><Link to="/login" className="login-text">Log In</Link></button>
          )}
        </li>
      </ul>
    </div>
  );
}

export default CheckLogin;
