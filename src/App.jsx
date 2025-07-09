// App.js
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import { connectSocket, disconnectSocket } from "./socket/socket";
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState("general");

  // 🔄 Check login status on initial load (via cookie)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/users/profile");
        setUser(res.data.user);
      } catch (err) {
        console.log("User not logged in");
      }
    };
    fetchUser();
  }, []);

  // 🔌 Manage socket connection
  useEffect(() => {
    if (user) {
      connectSocket().connect();
    } else {
      disconnectSocket();
    }
  }, [user]);

  const handleLogout = () => {
    disconnectSocket();
    setUser(null);
    // Optional: clear backend cookies by hitting /logout route if you have one
  };

  return (
    <div style={{ padding: "2rem" }}>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <>
          <h2>Welcome, {user.username}</h2>
          <button onClick={handleLogout} style={{ marginBottom: "1rem" }}>
            Logout
          </button>
          <div>
            <label>Room: </label>
            <select value={room} onChange={(e) => setRoom(e.target.value)}>
              <option value="general">General</option>
              <option value="dev">Dev</option>
              <option value="random">Random</option>
            </select>
          </div>
          <Chat username={user.username} room={room} />
        </>
      )}
    </div>
  );
}

export default App;
