import React, { useState, useEffect } from 'react';
import { usePostsContext } from '../context/PostsContext';
import Filters from '../components/Filters';
import PostsList from '../components/PostsList';

export default function Home() {
  const { posts, fetchPosts } = usePostsContext();
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  return (
    <div className="bg-dark min-vh-100 text-white py-5">
      <div className="container">
        <header className="mb-4 text-center">
          <h1 className="display-4 text-white">Travel Journal</h1>
          <p className="lead text-white-50">Racconta i tuoi viaggi e scopri le tappe degli altri!</p>
        </header>

        <div className="mb-4">
          <Filters posts={posts} onFilter={setFilteredPosts} className="text-white" />
        </div>

        <PostsList posts={filteredPosts} />
      </div>
    </div>
  );
}