import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddPost from './pages/AddPost';
import { PostsProvider } from './context/PostsContext';
import DefaultLayout from './layout/defaultLayout';
import DetailPost from './pages/DetailPost';


export default function App() {
  return (
    <PostsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path="add" element={<AddPost />} />
            <Route path="post/:id" element={<DetailPost />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PostsProvider>
  );
}