import React, { useEffect, useState, useRef } from "react";
import { getSocket } from "../socket/socket";
import axios from "axios";
import { Send, MessageCircle, Users, MoreVertical, Smile, Paperclip, Phone, Video } from "lucide-react";

const Chat = ({ username, room }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Always initialize as array
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("joinRoom", room);

    axios
      .get(`${apiUrl}/api/v1/chat/messages/${room}`, { withCredentials: true })
      .then((res) => {
        // Accept both array and object with .messages
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        } else if (Array.isArray(res.data.messages)) {
          setMessages(res.data.messages);
        } else {
          setMessages([]);
        }
      })
      .catch((err) => {
        setMessages([]); // fallback to empty array on error
        console.error("Failed to load old messages", err);
      });

    socket.on("roomMessages", (msgs) => setMessages(Array.isArray(msgs) ? msgs : []));
    socket.on("chatMessage", (msg) => setMessages((prev) => Array.isArray(prev) ? [...prev, msg] : [msg]));

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

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name) => {
    return (name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)) || 'U';
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-4 lg:px-6 py-3 lg:py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 tracking-tight">#{room}</h2>
              <p className="text-xs lg:text-sm text-gray-500 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <span className="hidden sm:inline">Connected as</span>
                <span className="sm:hidden">Online</span>
                <span className="font-medium ml-1 hidden sm:inline">{username}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 lg:space-x-2">
            <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600" />
            </button>
            <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <Video className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <MoreVertical className="h-4 w-4 lg:h-5 lg:w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {Array.isArray(messages) && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 lg:mb-6 shadow-inner">
              <MessageCircle className="h-10 w-10 lg:h-12 lg:w-12 text-indigo-400" />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-700 mb-2 text-center">Welcome to #{room}</h3>
            <p className="text-gray-500 text-center max-w-md text-sm lg:text-base px-4">
              This is the beginning of your conversation in this room. Send a message to get started!
            </p>
          </div>
        ) : (
          <>
            {Array.isArray(messages) && messages.map((msg, idx) => {
              const isOwnMessage = msg.sender === username;
              const showAvatar = idx === 0 || messages[idx - 1].sender !== msg.sender;
              return (
                <div
                  key={idx}
                  className={`flex items-end space-x-3 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                    <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shadow-md ${
                      isOwnMessage 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                        : 'bg-gradient-to-br from-gray-500 to-gray-600'
                    }`}>
                      {getInitials(msg.sender)}
                    </div>
                  </div>
                  {/* Message Bubble */}
                  <div className={`flex flex-col max-w-[280px] sm:max-w-xs lg:max-w-md ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    {showAvatar && !isOwnMessage && (
                      <span className="text-xs font-medium text-gray-600 mb-1 px-1 hidden sm:block">{msg.sender}</span>
                    )}
                    <div className={`group relative px-3 lg:px-4 py-2.5 lg:py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                      isOwnMessage
                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md border border-gray-200 hover:border-gray-300'
                    }`}>
                      <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                      {/* Message timestamp */}
                      <div className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-indigo-100' : 'text-gray-400'
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                        {formatTime(msg.timestamp || Date.now())}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 lg:px-6 py-2">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm">Someone is typing...</span>
          </div>
        </div>
      )}
      {/* Enhanced Message Input */}
      <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200/50 px-4 lg:px-6 py-3 lg:py-4 shadow-lg">
        <div className="flex items-end space-x-2 lg:space-x-4">
          {/* Attachment Button */}
          <button className="hidden sm:block p-2.5 lg:p-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200 transform hover:scale-105">
            <Paperclip className="h-4 w-4 lg:h-5 lg:w-5" />
          </button>
          {/* Message Input Container */}
          <div className="flex-1 relative">
            <div className="flex items-end bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-200">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your message..."
                rows="1"
                className="flex-1 px-3 lg:px-4 py-2.5 lg:py-3 bg-transparent border-none resize-none focus:outline-none placeholder-gray-500 max-h-32 scrollbar-thin scrollbar-thumb-gray-300 text-sm lg:text-base"
                style={{ minHeight: '40px' }}
              />
              {/* Emoji Button */}
              <button className="hidden sm:block p-2 text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                <Smile className="h-4 w-4 lg:h-5 lg:w-5" />
              </button>
            </div>
          </div>
          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="p-2.5 lg:p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-full hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <Send className="h-4 w-4 lg:h-5 lg:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
