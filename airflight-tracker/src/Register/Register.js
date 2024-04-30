import React, {useState} from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import supabase from '../supabaseClient'

const Register = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('')
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
        email: email,
        username:username,
        password: password,
    });

    if (error) {
        setError(error.message);
    } else {
        navigate('/database');
    }
};


  return (
    <div className="background-wrapper">
      <div className="register-section">
        <form className="register-form" onSubmit={handleSignup}>
          <h2>Create a free account now</h2>
          <input
            type="text"
            placeholder="Email"
            className="input-field"
            value={email} 
            onChange={e => setEmail(e.target.value)}
          ></input>
            <input
            type="text"
            placeholder="Username"
            className="input-field"
            value={username} 
            onChange={e => setUsername(e.target.value)}
          ></input>
          <input
            type="text"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={e => setPassword(e.target.value)}
          ></input>
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