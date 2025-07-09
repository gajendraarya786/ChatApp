import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/users/login",
        { username, password },
        { withCredentials: true } // ✅ send cookies
      );

      // Automatically get user info from response
      const user = res.data?.data?.user;
      if (user) {
        onLogin(user); // Pass full user info
      } else {
        alert("Invalid login response");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={loginUser}>Login</button>
    </div>
  );
};

export default Login;
