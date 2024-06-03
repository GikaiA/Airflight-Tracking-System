import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService"; // Adjusted import path
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      navigate("/dashboard");
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="login-section">
      <div className="login-sub-section">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <label className="login-label" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            className="login-field"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <label className="login-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="login-field"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="login-form-button">Log In</button>
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
