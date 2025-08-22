import React, { useState, useEffect } from 'react';
import { usePostsContext } from '../context/PostsContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Filters from '../components/Filters';
import PostsList from '../components/PostsList';

export default function Home() {
  const { posts, fetchPosts } = usePostsContext();
  const { user } = useAuth();

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Carica i post dell'utente appena il componente monta
  useEffect(() => {
    if (user) {
      console.log("User in Home:", user);
      setLoadingPosts(true);
      fetchPosts(user.id)
        .catch(err => console.error("Errore fetchPosts:", err))
        .finally(() => setLoadingPosts(false));
    } else {
      setLoadingPosts(false);
    }
  }, [user]);

  // Aggiorna i post filtrati quando posts cambiano
  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  // 🔒 Non loggato
  if (!user) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center bg-dark text-white px-3">
        <h1 className="display-4 mb-3">Benvenuto su Travel Journal 🌍</h1>
        <p className="lead mb-4">
          Racconta i tuoi viaggi e conserva i tuoi ricordi. Inizia oggi stesso!
        </p>
        <div className="d-flex gap-3">
          <Link to="/login" state={{ mode: "login" }} className="btn btn-primary btn-lg">
            Accedi
          </Link>
          <Link to="/login" state={{ mode: "signup" }} className="btn btn-outline-light btn-lg">
            Registrati
          </Link>
        </div>
      </div>
    );
  }

  // Loading dei post
  if (loadingPosts) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    );
  }

  // Render post o messaggio "nessun post"
  return (
    <div className="container my-5">
      {/* Hero */}
      <section className="text-center mb-5">
        <h1 className="display-4 mb-3 text-white">
          Ciao, {user.full_name || user.user_metadata?.full_name || "Viaggiatore"}! ✈️
        </h1>
        <p className="lead mb-3 text-white">
          Benvenuto nel tuo diario di viaggio. Qui puoi raccontare le tue tappe, organizzare nuovi itinerari e rivivere i tuoi ricordi.
        </p>
      </section>

      {/* Filtri */}
      {posts.length > 0 && <Filters posts={posts} onFilter={setFilteredPosts} />}

      {/* Lista dei post */}
      {filteredPosts.length > 0 ? (
        <PostsList posts={filteredPosts} />
      ) : (
        <div className="text-center mt-5">
          <h2 className="text-white mb-3">Ancora nessun viaggio raccontato 😔</h2>
          <p className="text-white mb-4">
            Non preoccuparti! Ogni grande avventura inizia con un primo passo.
            Premi il pulsante qui sotto per scrivere il tuo primo post e iniziare a costruire il tuo diario di viaggio.
          </p>
          <Link to="/add" className="btn btn-primary btn-lg">
            Scrivi il tuo primo viaggio ✈️
          </Link>
        </div>
      )}
    </div>
  );
}