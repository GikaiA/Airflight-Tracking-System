import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import supabase from "../supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-section">
      <div className="login-sub-section">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <label className="login-label">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="login-field"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <label className="login-label">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="login-field"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
}

export default Login;