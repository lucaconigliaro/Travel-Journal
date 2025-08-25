import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DefaultLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen text-gray-900 flex">
      <Sidebar onToggle={setSidebarOpen} />

      {/* Contenuto principale */}
      <main
        className={`flex-1 p-4 transition-all duration-300`}
        style={{ marginLeft: sidebarOpen ? "16rem" : "4rem" }}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}