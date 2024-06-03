import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const data = await register(formData);
      localStorage.setItem('userId', data.userId);
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
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className="register-button">Register</button>
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          <p>
            Already have an account? <Link to="/login" className="login-link">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
