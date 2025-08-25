import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePostsContext } from '../context/PostsContext';
import { ArrowLeft, Globe, AlertCircle } from 'lucide-react';
import PostDetails from '../components/PostDetails';

export default function DetailPost() {
  const { id } = useParams();
  const { posts, fetchPosts } = usePostsContext();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPost = useCallback(async () => {
    setLoading(true);
    const found = posts.find(p => p.id.toString() === id);
    if (found) {
      setPost(found);
      setLoading(false);
    } else {
      try {
        await fetchPosts();
        const refreshed = posts.find(p => p.id.toString() === id);
        if (refreshed) setPost(refreshed);
      } catch (err) {
        console.error("Errore fetchPosts:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [id, posts, fetchPosts]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex justify-center items-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg text-center max-w-md">
          <div className="bg-gradient-to-br from-red-100 to-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Post non trovato</h3>
          <p className="text-gray-600 mb-6">Il viaggio che stai cercando non esiste o è stato rimosso.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alla home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Torna ai tuoi viaggi</span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {post.title}
          </h1>

          <p className="text-gray-600">
            Pubblicato il {new Date(post.created_at).toLocaleDateString("it-IT", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <PostDetails post={post} />
      </div>
    </div>
  );
}