import React from 'react';
import './Login.css';

const handleLogin = async (e) => {}

function Login() {
  return (
    <div className='loginpage'>
      
      <div id = 'loginWrapper'>
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input type='text' id='UserNameField' placeholder='User ID'/>
          <label>Password</label>
          <input type='password' id='PasswordField' placeholder='Password'/>
        </form>
      </div>
    </div>
  )
}

export default Login
