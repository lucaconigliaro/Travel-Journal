import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AddPost from './pages/AddPost.jsx';
import { PostsProvider } from './context/PostsContext.jsx';

export default function App() {
  return (
    <PostsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddPost />} />
        </Routes>
      </BrowserRouter>
    </PostsProvider>
  );
}