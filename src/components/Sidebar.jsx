import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/logo.png";
import { Home, Plus, Settings, LogOut, Menu } from "lucide-react";

export default function Sidebar({ onToggle }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false); // desktop toggle
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setAvatarMenuOpen(false);
  };

  const toggleSidebar = () => {
    setOpen(!open);
    if (onToggle) onToggle(!open);
  };

  const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Aggiungi Post", icon: Plus, path: "/add" },
    { name: "Impostazioni", icon: Settings, path: "/settings" },
  ];

  return (
    <div
      className="fixed top-0 left-0 h-screen bg-white/70 backdrop-blur-sm border-r border-gray-200 shadow-lg flex flex-col transition-all duration-300 ease-in-out z-50"
      style={{ width: open ? "16rem" : "4rem" }}
    >
      {/* Logo + toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 overflow-hidden">
        <Link to="/" className="flex items-center space-x-2">
          <div
            className={`flex items-center space-x-2 transition-all duration-300 origin-left ${
              open ? "opacity-100 scale-100" : "opacity-0 scale-0 w-0 overflow-hidden"
            }`}
          >
            <img src={Logo} alt="Travel Journal" className="h-10 w-auto" />
            <span className="font-semibold text-gray-900 whitespace-nowrap">
              Travel Journal
            </span>
          </div>
        </Link>

        {/* Toggle solo desktop */}
        <button
          onClick={toggleSidebar}
          className="hidden sm:block p-1 rounded hover:bg-gray-100 transition"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Menu principale */}
      <nav className="flex-1 flex flex-col p-2 space-y-1">
        {user ? (
          <>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 hover:text-gray-900 transition duration-300"
              >
                <item.icon className="w-5 h-5" />
                <span
                  className={`overflow-hidden transition-all duration-300 origin-left whitespace-nowrap ${
                    open ? "opacity-100 scale-100 max-w-xs" : "opacity-0 scale-0 max-w-0"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}

            {/* Avatar + Dropdown */}
            <div className="relative mt-auto p-2">
              <button
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center focus:outline-none hover:ring-2 hover:ring-gray-300 transition duration-200"
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-700 font-medium">
                    {user.user_metadata?.full_name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </button>

              {avatarMenuOpen && (
                <div className="absolute bottom-12 left-0 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 hover:text-red-700 transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 hover:text-gray-900 transition duration-300"
          >
            <Home className="w-5 h-5" />
            <span
              className={`overflow-hidden transition-all duration-300 origin-left whitespace-nowrap ${
                open ? "opacity-100 scale-100 max-w-xs" : "opacity-0 scale-0 max-w-0"
              }`}
            >
              Login
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}