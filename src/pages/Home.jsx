import React, { useState, useEffect } from "react";
import { usePostsContext } from "../context/PostsContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Plus, MapPin, Calendar, Sparkles, ArrowRight, Globe } from "lucide-react";
import Filters from "../components/Filters";
import PostsList from "../components/PostsList";
import MapView from "../components/MapView";

export default function Home() {
  const { posts, fetchPosts } = usePostsContext();
  const { user } = useAuth();

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [viewMode, setViewMode] = useState("cards");

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

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe className="w-5 h-5 text-blue-600 animate-pulse" />
        </div>
      </div>
    </div>
  );

  // Guest landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Section */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/50 text-blue-600 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Benvenuto su Travel Journal
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                I tuoi viaggi,<br />i tuoi ricordi
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Racconta le tue avventure, conserva i momenti speciali e rivivi le emozioni dei tuoi viaggi.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/login"
                  state={{ mode: "signup" }}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Inizia il tuo viaggio
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link
                  to="/login"
                  state={{ mode: "login" }}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  Ho già un account
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {[
                {
                  icon: Plus,
                  title: "Racconta",
                  description: "Crea post dettagliati sui tuoi viaggi con foto, descrizioni e ricordi."
                },
                {
                  icon: MapPin,
                  title: "Esplora",
                  description: "Visualizza tutti i luoghi visitati su una mappa interattiva."
                },
                {
                  icon: Calendar,
                  title: "Ricorda",
                  description: "Organizza e filtra i tuoi viaggi per data, luogo o stato d'animo."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:border-blue-200/50 transition-all duration-300 hover:shadow-lg">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadingPosts) {
    return <LoadingSpinner />;
  }

  const noPostsAtAll = posts.length === 0;
  const noPostsFiltered = posts.length > 0 && filteredPosts.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Ciao, {user.user_metadata?.full_name || user.full_name || "Viaggiatore"}! 👋
              </h1>
              <p className="text-lg text-gray-600">
                {posts.length > 0
                  ? `Hai raccontato ${posts.length} ${posts.length === 1 ? 'viaggio' : 'viaggi'}. Continua a esplorare il mondo!`
                  : "È il momento di iniziare la tua prima avventura!"
                }
              </p>
            </div>

            <Link
              to="/add"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 w-fit"
            >
              <Plus className="w-5 h-5" />
              Nuovo viaggio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Filtri */}
        {posts.length > 0 && (
          <div className="mb-8">
            <Filters posts={posts} onFilter={setFilteredPosts} />
          </div>
        )}

        {/* Empty States */}
        {noPostsAtAll ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50 shadow-lg max-w-2xl">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Globe className="w-10 h-10 text-blue-600" />
              </div>

              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Il mondo ti aspetta! ✈️
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Ogni grande avventura inizia con un primo passo. Racconta il tuo primo viaggio e inizia a costruire il tuo diario personale di esperienze indimenticabili.
              </p>

              <Link
                to="/add"
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
              >
                <Plus className="w-6 h-6" />
                Scrivi il tuo primo viaggio
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        ) : noPostsFiltered ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg max-w-md">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <MapPin className="w-8 h-8 text-amber-600" />
              </div>

              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Nessun risultato trovato 🔍
              </h3>

              <p className="text-gray-600 mb-6">
                Prova a modificare i filtri di ricerca o esplora tutti i tuoi viaggi.
              </p>

              <button
                onClick={() => setFilteredPosts(posts)}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Mostra tutti i viaggi
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* View Mode Toggle - Mobile */}
            <div className="lg:hidden flex bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50 w-fit mx-auto">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === "cards"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Lista
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === "map"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Mappa
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Posts List */}
              <div className={`transition-all duration-300 ${viewMode === "cards" || !window.matchMedia("(max-width: 1023px)").matches
                  ? "lg:w-2/3"
                  : "hidden lg:block lg:w-2/3"
                }`}>
                <PostsList posts={filteredPosts} />
              </div>

              {/* Map */}
              <div className={`transition-all duration-300 ${viewMode === "map" || !window.matchMedia("(max-width: 1023px)").matches
                  ? "lg:w-1/3"
                  : "hidden lg:block lg:w-1/3"
                }`}>
                <div className="sticky top-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-8 h-8 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        Le tue destinazioni
                      </h4>
                    </div>

                    <div className="h-80 lg:h-96 rounded-xl overflow-hidden">
                      <MapView posts={filteredPosts} />
                    </div>

                    <p className="text-xs text-gray-500 mt-3 text-center">
                      {filteredPosts.length} {filteredPosts.length === 1 ? 'luogo visitato' : 'luoghi visitati'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}