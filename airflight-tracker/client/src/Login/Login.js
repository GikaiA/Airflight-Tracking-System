import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);  // Store userId for later use
      navigate("/dashboard");  // Redirect to dashboard after successful login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-section">
      <div className="login-sub-section">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <label className="login-label">Username</label>
          <input
            type="text"
            placeholder="Username"
            className="login-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="login-label">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="login-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-form-button">
            Log In
          </button>
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          <p className="forget-login-sentence">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
