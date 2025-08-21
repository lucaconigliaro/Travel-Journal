import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function DefaultLayout() {
  return (
    <>
      <Navbar />
      <main className="bg-dark min-vh-100 py-4 text-white">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  );
}