import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usePostsContext } from '../context/PostsContext';
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center mt-10 text-gray-400">
        <p>Post non trovato 😕</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-6 px-4">
      <h2 className="text-2xl font-semibold mb-4 text-white">Dettagli del viaggio</h2>
      <PostDetails post={post} />
    </div>
  );
}