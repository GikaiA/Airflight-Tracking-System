import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

    // const handleLogin = async () => {
    //   try {
    //     const { user, error } = await supabase.auth.signIn({
    //       username,
    //       password,
    //     });
    //     if (error) {
    //       setError(error.message);
    //     } else {
    //       navigate.push("/database");
    //     }
    //   } catch (error) {
    //     console.error("Error signing in:", error.message);
    //   }
    // };

  return (
    <div className="loginpage">
      <div id="loginWrapper">
        <form>
          <label>Username</label>
          <input type="text" id="UserNameField" placeholder="User ID" value={username} onChange={(e) => setUsername(e.target.value)} />
          <label>Password</label>
          <input type="password" id="PasswordField" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {/* <button className="login-component-button" onClick={handleLogin}>Log In</button> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
