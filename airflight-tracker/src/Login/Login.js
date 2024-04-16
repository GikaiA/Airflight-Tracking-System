import React from 'react';
import './Login.css';
import airforcewallpaper from '../images/airforcewallpaper.jpg'

const handleLogin = async (e) => {}

function Login() {
  return (
    <div className='loginpage'>
      
      <div id = 'loginWrapper'>
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input type='text' id='UserNameField'/>
          <label>Password</label>
          <input type='password' id='PasswordField'/>
        </form>
      </div>
    </div>
  )
}

export default Login
