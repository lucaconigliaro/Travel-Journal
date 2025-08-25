import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/logo.png";
import { Home, Plus, Settings, LogOut, Menu, X, User } from "lucide-react";

export default function Sidebar({ onToggle }) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
      setAvatarMenuOpen(false);
    }
  }, [location, isMobile]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && isOpen && !e.target.closest('.sidebar-container')) {
        setIsOpen(false);
        setAvatarMenuOpen(false);
      }
      if (avatarMenuOpen && !e.target.closest('.avatar-container')) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen, avatarMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setAvatarMenuOpen(false);
    setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setAvatarMenuOpen(false);
    if (onToggle) onToggle(!isOpen);
  };

  const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Aggiungi Post", icon: Plus, path: "/add" },
    { name: "Impostazioni", icon: Settings, path: "/settings" },
  ];

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />}

      {/* Sidebar */}
      <div
        className={`sidebar-container fixed top-0 left-0 h-full bg-white/95 backdrop-blur-md border-r border-gray-200/50 shadow-xl flex flex-col z-50 transition-all duration-300 ${isMobile
            ? `w-72 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
            : isOpen ? "w-64" : "w-16"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link to="/" className="flex items-center space-x-3 overflow-hidden">
            <img
              src={Logo}
              alt="Logo"
              className={`h-8 w-8 flex-shrink-0 transition-all duration-300 ${!isOpen && !isMobile ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
            />
            <span className={`font-bold text-lg text-gray-900 transition-all duration-300 whitespace-nowrap ${!isOpen && !isMobile ? "opacity-0 scale-0 w-0" : "opacity-100 scale-100"
              }`}>
              Travel Journal
            </span>
          </Link>

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {user ? (
            menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive(item.path)
                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={`font-medium transition-all duration-300 whitespace-nowrap ${!isOpen && !isMobile ? "opacity-0 scale-0 w-0" : "opacity-100 scale-100"
                  }`}>
                  {item.name}
                </span>
              </Link>
            ))
          ) : (
            <Link to="/login" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200">
              <User className="w-5 h-5 flex-shrink-0" />
              <span className={`font-medium transition-all duration-300 whitespace-nowrap ${!isOpen && !isMobile ? "opacity-0 scale-0 w-0" : "opacity-100 scale-100"
                }`}>
                Login
              </span>
            </Link>
          )}
        </nav>

        {/* User Profile */}
        {user && (
          <div className="border-t border-gray-100 p-3">
            <div className="relative avatar-container">
              <button
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 ${!isOpen && !isMobile ? "justify-center" : ""
                  }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {user.user_metadata?.full_name?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>

                <div className={`flex-1 text-left transition-all duration-300 ${!isOpen && !isMobile ? "opacity-0 scale-0 w-0" : "opacity-100 scale-100"
                  }`}>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.user_metadata?.full_name || "Utente"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </button>

              {avatarMenuOpen && (
                <div className={`absolute bottom-full mb-2 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-60 ${!isOpen && !isMobile ? "left-full ml-2 w-40" : "left-0 right-0"
                  }`}>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}