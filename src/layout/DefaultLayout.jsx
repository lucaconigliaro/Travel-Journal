import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DefaultLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/30 text-gray-900 flex">
      <Sidebar onToggle={setSidebarOpen} />

      <main
        className={`flex-1 transition-all duration-300 ${isMobile
          ? "ml-0 p-4 pt-16"
          : sidebarOpen ? "ml-64 p-6" : "ml-16 p-6"
          }`}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}