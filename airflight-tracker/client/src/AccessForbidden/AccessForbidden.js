import React from "react";
import "./AccessForbidden.css";
import { Link } from "react-router-dom";

function AccessForbidden() {
  return (
    <div className="accessforbidden">
      <div className="accessforbidden-section">
        <p className="accessforbidden-text">You do not have access to this page. Please Log In</p>
        <Link to="/login">
          <buttton className="accessforbidden-button">Log In</buttton>
        </Link>
      </div>
    </div>
  );
}

export default AccessForbidden;
