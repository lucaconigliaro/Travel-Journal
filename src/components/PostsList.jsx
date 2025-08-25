import React from "react";
import PostCard from "./PostCard";
import { Archive } from "lucide-react";

function PostsList({ posts = [] }) {
  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-10 text-gray-400">
          <Archive className="mx-auto w-12 h-12 opacity-50" />
          <h5 className="mt-3 font-light text-lg text-gray-700">Nessun post disponibile</h5>
          <p className="mt-1 opacity-75 text-gray-500">
            I contenuti verranno visualizzati qui una volta caricati
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(PostsList);