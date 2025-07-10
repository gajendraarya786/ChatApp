import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";
import { connectSocket, disconnectSocket } from "./socket/socket";
import axios from "axios";
import { LogOut, Settings, Hash, Users, MessageSquare, Zap, ChevronDown, Menu, X } from "lucide-react";

axios.defaults.withCredentials = true;

function App() {

  const apiUrl = import.meta.env.VITE_API_URL;
  

  const [user, setUser] = useState(null);
  const [room, setRoom] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"

  // 🔄 Check login status on initial load (via cookie)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/v1/users/profile`);
        setUser(res.data.user);
      } catch (err) {
        console.log("User not logged in");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🔌 Manage socket connection
  useEffect(() => {
    if (user) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  // Close mobile sidebar when clicking outside or on overlay
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is on overlay or outside sidebar
      if (isMobileSidebarOpen && 
          (event.target.classList.contains('mobile-sidebar-overlay') || 
           (!event.target.closest('.mobile-sidebar') && !event.target.closest('.mobile-menu-button')))) {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileSidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileSidebarOpen]);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileSidebarOpen]);

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/api/v1/users/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.log("Logout error:", err);
    }
    disconnectSocket();
    setUser(null);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const switchToLogin = () => {
    setAuthMode("login");
  };

  const switchToRegister = () => {
    setAuthMode("register");
  };

  const rooms = [
    { id: "general", name: "General", icon: MessageSquare, color: "from-blue-500 to-blue-600" },
    { id: "dev", name: "Development", icon: Zap, color: "from-purple-500 to-purple-600" },
    { id: "random", name: "Random", icon: Hash, color: "from-green-500 to-green-600" }
  ];

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const handleRoomChange = (roomId) => {
    setRoom(roomId);
    setIsDropdownOpen(false);
    setIsMobileSidebarOpen(false);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const currentRoom = rooms.find(r => r.id === room);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authMode === "register") {
      return (
        <Register 
          onRegister={handleRegister} 
          switchToLogin={switchToLogin}
        />
      );
    } else {
      return (
        <Login 
          onLogin={handleLogin} 
          switchToRegister={switchToRegister}
        />
      );
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col overflow-hidden relative">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg relative z-30">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Menu button and current room */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <button 
              onClick={toggleMobileSidebar}
              className="mobile-menu-button p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 flex-shrink-0 relative z-50 flex items-center justify-center"
              type="button"
            >
              {isMobileSidebarOpen ? (
                <X className="h-5 w-5 pointer-events-none" />
              ) : (
                <Menu className="h-5 w-5 pointer-events-none" />
              )}
            </button>
            
            {/* Current room indicator */}
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className={`p-1.5 rounded-lg bg-gradient-to-r ${currentRoom?.color || 'from-gray-500 to-gray-600'} flex-shrink-0`}>
                {React.createElement(currentRoom?.icon || Hash, {
                  className: "h-4 w-4 text-white"
                })}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{currentRoom?.name || room}</p>
                <p className="text-xs text-gray-500 truncate">#{room}</p>
              </div>
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
              >
                <div className="relative">
                  <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xs">{getInitials(user.username)}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full flex items-center space-x-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">Settings</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 mobile-sidebar-overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden mobile-sidebar fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile sidebar header */}
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">{getInitials(user.username)}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-gray-800 truncate">Welcome back!</h2>
                  <p className="text-sm text-gray-600 truncate">{user.username}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile room selection */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Chat Rooms
              </h3>
              
              <div className="space-y-2">
                {rooms.map((roomOption) => {
                  const Icon = roomOption.icon;
                  const isActive = room === roomOption.id;
                  
                  return (
                    <button
                      key={roomOption.id}
                      onClick={() => handleRoomChange(roomOption.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? `bg-gradient-to-r ${roomOption.color} text-white shadow-lg transform scale-[1.02]`
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      } transition-colors duration-200`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-base font-medium truncate">{roomOption.name}</p>
                        <p className={`text-xs truncate ${
                          isActive ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          #{roomOption.id}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Room Info */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200/50">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${
                  rooms.find(r => r.id === room)?.color || 'from-gray-500 to-gray-600'
                }`}>
                  {React.createElement(rooms.find(r => r.id === room)?.icon || Hash, {
                    className: "h-4 w-4 text-white"
                  })}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">
                    {rooms.find(r => r.id === room)?.name || room}
                  </h4>
                  <p className="text-xs text-gray-600">Currently active</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Connected and ready</span>
              </div>
            </div>
          </div>

          {/* Mobile sidebar footer */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Powered by <span className="font-semibold text-indigo-600">ChatApp</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 min-h-0">
        {/* Desktop Sidebar */}
        <div className="w-80 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl flex flex-col">
          {/* User Profile Header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{getInitials(user.username)}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-800 truncate">Welcome back!</h2>
                <p className="text-sm text-gray-600 truncate">{user.username}</p>
              </div>
              <div className="flex space-x-1">
                <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200">
                  <Settings className="h-4 w-4" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Room Selection */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Chat Rooms
              </h3>
              
              <div className="space-y-2">
                {rooms.map((roomOption) => {
                  const Icon = roomOption.icon;
                  const isActive = room === roomOption.id;
                  
                  return (
                    <button
                      key={roomOption.id}
                      onClick={() => setRoom(roomOption.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? `bg-gradient-to-r ${roomOption.color} text-white shadow-lg transform scale-[1.02]`
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      } transition-colors duration-200`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-base font-medium truncate">{roomOption.name}</p>
                        <p className={`text-xs truncate ${
                          isActive ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          #{roomOption.id}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Room Info */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200/50">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${
                  rooms.find(r => r.id === room)?.color || 'from-gray-500 to-gray-600'
                }`}>
                  {React.createElement(rooms.find(r => r.id === room)?.icon || Hash, {
                    className: "h-4 w-4 text-white"
                  })}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">
                    {rooms.find(r => r.id === room)?.name || room}
                  </h4>
                  <p className="text-xs text-gray-600">Currently active</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Connected and ready</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200/50">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Powered by <span className="font-semibold text-indigo-600">ChatApp</span>
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <Chat username={user.username} room={room} />
        </div>
      </div>

      {/* Mobile Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 lg:hidden">
        <Chat username={user.username} room={room} />
      </div>
    </div>
  );
}

export default App;