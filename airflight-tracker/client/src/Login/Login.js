import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginService } from "../services/authService";
import { AuthContext } from "../Context/AuthContext";
import airforcebg from '../images/airforcewallpaper.jpg';
import "./Login.css";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameOrEmailError, setUsernameOrEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset error states
    setUsernameOrEmailError("");
    setPasswordError("");
    setError("");

    // Validation
    if (!isValidUsernameOrEmail(usernameOrEmail)) {
      setUsernameOrEmailError("Enter a valid username or email.");
      return;
    }
    if (isEmail(usernameOrEmail) && !usernameOrEmail.endsWith("@us.af.mil")) {
      setUsernameOrEmailError("Use an email ending with @us.af.mil.");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: usernameOrEmail, password })
      });
      const data = await response.json();

      if (response.ok) {
        if (data.twoFactorEnabled) {
          navigate("/verify-otp", { state: { username: usernameOrEmail } });
        } else {
          login(data.userId);
          navigate("/dashboard");
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  const isValidUsernameOrEmail = (input) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return usernameRegex.test(input) || emailRegex.test(input);
  };

  const isEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleUsernameOrEmailChange = (e) => {
    const newInput = e.target.value;
    setUsernameOrEmail(newInput);
    if (!isValidUsernameOrEmail(newInput)) {
      setUsernameOrEmailError("Enter a valid username or email.");
    } else if (isEmail(newInput) && !newInput.endsWith("@us.af.mil")) {
      setUsernameOrEmailError("Use an email ending with @us.af.mil.");
    } else {
      setUsernameOrEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length >= 6) {
      setPasswordError("");
    }
  };

  return (
    <div className="login-section">
      <div className="split left">
        <img src={airforcebg} alt="airforce-login-bg" className="airforce-login-pic" />
      </div>
      <div className="split right">
        <div className="login-form-section">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            <label className="login-label">Username or Email</label>
            <input
              type="text"
              placeholder="Username or Email"
              className="login-field"
              value={usernameOrEmail}
              onChange={handleUsernameOrEmailChange}
            />
            {usernameOrEmailError && (
              <div className="error-message">{usernameOrEmailError}</div>
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
              <div className="error-message">{passwordError}</div>
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
