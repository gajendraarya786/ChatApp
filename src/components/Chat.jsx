// components/Chat.js
import React, { useEffect, useState } from "react";
import { getSocket } from "../socket/socket";
import axios from "axios";

const Chat = ({ username, room }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    if(!socket) return;

    socket.emit("joinRoom", room);

    axios
      .get(`http://localhost:8080/api/v1/chat/messages/${room}`, { withCredentials: true })
      .then((res) => setMessages(res.data.messages))
      .catch((err) => console.error("Failed to load old messages", err));

    socket.on("roomMessages", (msgs) => setMessages(msgs));
    socket.on("chatMessage", (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.off("roomMessages");
      socket.off("chatMessage");
    };
  }, [room]);

  const sendMessage = () => {
    const socket = getSocket();
    if (message.trim()) {
      socket.emit("chatMessage", { room, sender: username, content: message });
      setMessage("");
    }
  };

  return (
    <div>
      <h3>Room: {room}</h3>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid gray", marginBottom: "1rem" }}>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.sender}</strong>: {msg.content}
          </p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
