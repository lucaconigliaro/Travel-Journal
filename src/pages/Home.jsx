import React, { useState, useEffect } from 'react';
import { usePostsContext } from '../context/PostsContext';
import { useAuth } from '../hooks/useAuth'; // 👈 importa il tuo hook
import Filters from '../components/Filters';
import PostsList from '../components/PostsList';

export default function Home() {
  const { posts, fetchPosts } = usePostsContext();
  const { user } = useAuth(); // 👈 prendi l’utente loggato
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    if (user) {
      fetchPosts(user.id); // 👈 carica SOLO i post dell’utente
    }
  }, [user]);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  if (!user) {
    return (
      <div className="container my-5 text-center">
        <h1 className="display-5">Devi essere loggato per vedere i tuoi post</h1>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <header className="mb-4 text-center">
        <h1 className="display-4">Travel Journal</h1>
        <p className="lead">Racconta i tuoi viaggi e scopri le tue tappe!</p>
      </header>

      <Filters posts={posts} onFilter={setFilteredPosts} />

      <PostsList posts={filteredPosts} />
    </div>
  );
}