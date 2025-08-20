import React, { useEffect, useState, useCallback } from 'react';
import { usePostsContext } from '../context/PostsContext';
import Filters from '../components/Filters';
import PostsList from '../components/PostsList';

export default function Home() {
  const { posts, fetchPosts } = usePostsContext();
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Fetch iniziale dei post
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Aggiorna i post filtrati quando cambiano i post
  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  // Callback stabile per i filtri
  const handleFilter = useCallback((filtered) => {
    setFilteredPosts(filtered);
  }, []);

  return (
    <div className="bg-dark min-vh-100 text-white py-5">
      <div className="container">
        <header className="mb-4 text-center">
          <h1 className="display-4">Travel Journal</h1>
          <p className="lead text-white-50">
            Racconta i tuoi viaggi e scopri le tappe degli altri!
          </p>
        </header>

        <Filters posts={posts} onFilter={handleFilter} />

        <PostsList posts={filteredPosts} />
      </div>
    </div>
  );
}