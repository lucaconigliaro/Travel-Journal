import React, { useState, useEffect } from "react";
import { usePostsContext } from "../context/PostsContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Filters from "../components/Filters";
import PostsList from "../components/PostsList";
import MapView from "../components/MapView";

export default function Home() {
  const { posts, fetchPosts } = usePostsContext();
  const { user } = useAuth();

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    if (user) {
      setLoadingPosts(true);
      fetchPosts(user.id)
        .catch((err) => console.error("Errore fetchPosts:", err))
        .finally(() => setLoadingPosts(false));
    } else {
      setLoadingPosts(false);
    }
  }, [user]);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl md:text-5xl mb-3 font-bold text-gray-900">
          Benvenuto su Travel Journal 🌍
        </h1>
        <p className="text-lg md:text-xl mb-6 text-gray-700">
          Racconta i tuoi viaggi e conserva i tuoi ricordi. Inizia oggi stesso!
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            to="/login"
            state={{ mode: "login" }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
          >
            Accedi
          </Link>
          <Link
            to="/login"
            state={{ mode: "signup" }}
            className="border border-gray-900 hover:bg-gray-900 hover:text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
          >
            Registrati
          </Link>
        </div>
      </div>
    );
  }

  if (loadingPosts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-t-4 border-b-4 border-gray-900 w-12 h-12 rounded-full animate-spin"></div>
      </div>
    );
  }

  const noPostsAtAll = posts.length === 0;
  const noPostsFiltered = posts.length > 0 && filteredPosts.length === 0;

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Hero */}
      <section className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
          Ciao, {user.full_name || user.user_metadata?.full_name || "Viaggiatore"}! ✈️
        </h1>
        <p className="text-lg md:text-xl text-gray-700">
          Benvenuto nel tuo diario di viaggio. Qui puoi raccontare le tue tappe, organizzare nuovi itinerari e rivivere i tuoi ricordi.
        </p>
      </section>

      {/* Filtri centrati */}
      {posts.length > 0 && (
        <div className="flex justify-center mb-6">
          <Filters posts={posts} onFilter={setFilteredPosts} />
        </div>
      )}

      {/* Contenuto principale */}
      {noPostsAtAll || noPostsFiltered ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            {noPostsAtAll ? "Ancora nessun viaggio raccontato 😔" : "Nessun post trovato 😕"}
          </h2>
          <p className="mb-4 text-gray-700 max-w-md">
            {noPostsAtAll
              ? "Non preoccuparti! Ogni grande avventura inizia con un primo passo. Premi il pulsante qui sotto per scrivere il tuo primo post e iniziare a costruire il tuo diario di viaggio."
              : "Prova a cercare con altre parole chiave o rimuovi alcuni filtri."}
          </p>
          {noPostsAtAll && (
            <Link
              to="/add"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Scrivi il tuo primo viaggio ✈️
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Colonna sinistra - Cards */}
          <div className="lg:w-2/3">
            <PostsList posts={filteredPosts} />
          </div>

          {/* Colonna destra - Mappa */}
          <div className="lg:w-1/3">
            <div className="bg-white text-gray-900 p-4 rounded-xl shadow-md">
              <h4 className="mb-3 text-center font-semibold">
                Qui trovi i posti che hai visitato 🗺️
              </h4>
              <MapView posts={filteredPosts} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}