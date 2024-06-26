import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginService } from "../services/authService";
import { AuthContext } from "../Context/AuthContext";
import airforcebg from "../images/airforcebackground.jpg";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.trim() === "") {
      setUsernameError("Enter a valid username.");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }
    try {
      const data = await loginService(username, password);
      login(data.userId);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (newUsername.trim() === "") {
      setUsernameError("Enter a valid username.");
    } else {
      setUsernameError("");
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      setPasswordError("");
    }
  };

  return (
    <div className="login-section">
      <div className="login-split-section">
        <img src={airforcebg} className="airforce-bg" alt="airforce-bg" />
        <div className="login-sub-section">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            <label className="login-label">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="login-field"
              value={username}
              onChange={handleUsernameChange}
            />
            {usernameError && (
              <div className="error-message">
                {usernameError}
              </div>
            )}
            <label className="login-label">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="login-field"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <div className="error-message">
                {passwordError}
              </div>
            )}
            <button type="submit" className="login-form-button">
              Log In
            </button>
            {error && (
              <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
            )}
            <p className="forget-login-sentence">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
