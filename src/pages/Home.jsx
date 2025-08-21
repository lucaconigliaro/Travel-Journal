import React, { useState, useEffect } from 'react';
import { usePostsContext } from '../context/PostsContext';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import Filters from '../components/Filters';
import PostsList from '../components/PostsList';

export default function Home() {
  const { posts, fetchPosts } = usePostsContext();
  const { user } = useAuth();
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    if (user) {
      fetchPosts(user.id);
    }
  }, [user]);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  // Se non loggato
  if (!user) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center bg-dark text-white px-3">
        <h1 className="display-4 mb-3">Benvenuto su Travel Journal 🌍</h1>
        <p className="lead mb-4">
          Racconta i tuoi viaggi e conserva i tuoi ricordi. Inizia oggi stesso!
        </p>
        <div className="d-flex gap-3">
          <Link
            to="/login"
            state={{ mode: "login" }}
            className="btn btn-primary btn-lg"
          >
            Accedi
          </Link>
          <Link
            to="/login"
            state={{ mode: "signup" }}
            className="btn btn-outline-light btn-lg"
          >
            Registrati
          </Link>
        </div>
      </div>
    );
  }

  // Se loggato
  return (
    <div className="container my-5">
      {/* Hero */}
      <section className="text-center mb-5">
        <h1 className="display-4 mb-3">Ciao, {user.email}! ✈️</h1>
        <p className="lead text-muted mb-3">
          Benvenuto nel tuo diario di viaggio. Qui puoi raccontare le tue tappe, organizzare nuovi itinerari e rivivere i tuoi ricordi.
        </p>
        <Link
          to="/add"
          className="btn btn-primary btn-lg"
        >
          Scrivi un nuovo viaggio
        </Link>
      </section>

      {/* Filtri */}
      <Filters posts={posts} onFilter={setFilteredPosts} />

      {/* Lista dei post */}
      {filteredPosts.length > 0 ? (
        <PostsList posts={filteredPosts} />
      ) : (
        <p className="text-center text-muted mt-5">
          Non hai ancora post. Inizia subito a scrivere il tuo primo viaggio!
        </p>
      )}
    </div>
  );
}