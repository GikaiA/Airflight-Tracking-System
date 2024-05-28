import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="background-wrapper">
      <div className="register-section">
        <form className="register-form" onSubmit={handleSignup}>
          <h2>Create a free account now</h2>
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email} 
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className="input-field"
            value={username} 
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="register-button">Register</button>
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          <p>
            Already have an account?<Link to="/login" className="login-link"> Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
