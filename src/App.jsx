import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddPost from "./pages/AddPost";
import DetailPost from "./pages/DetailPost";
import { PostsProvider } from "./context/PostsContext";
import { AuthProvider } from "./context/AuthContext"; // 👈 provider auth
import DefaultLayout from "./layout/DefaultLayout";
import Login from "./pages/Login";

export default function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DefaultLayout />}>
              <Route index element={<Home />} />
              <Route path="add" element={<AddPost />} />
              <Route path="post/:id" element={<DetailPost />} />
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PostsProvider>
    </AuthProvider>
  );
}