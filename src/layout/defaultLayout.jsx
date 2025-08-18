import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function DefaultLayout() {
  return (
    <>
      <Navbar />
      <main className="container my-4">
        <Outlet />
      </main>
    </>
  );
}