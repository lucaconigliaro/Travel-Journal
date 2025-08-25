import React from "react";
import PostCard from "./PostCard";
import { Archive, Plus } from "lucide-react";
import { Link } from "react-router-dom";

function PostsList({ posts = [] }) {
  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg text-center max-w-md">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Archive className="w-8 h-8 text-gray-400" />
          </div>

          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Nessun viaggio da mostrare
          </h3>

          <p className="text-gray-600 mb-6">
            I tuoi ricordi di viaggio appariranno qui una volta creati.
          </p>

          <Link
            to="/add"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Aggiungi il primo viaggio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          I tuoi viaggi ({posts.length})
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default React.memo(PostsList);