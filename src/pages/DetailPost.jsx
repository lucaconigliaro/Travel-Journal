import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usePostsContext } from '../context/PostsContext';
import PostDetails from '../components/PostDetails';

export default function DetailPost() {
  const { id } = useParams();
  const { posts, fetchPosts } = usePostsContext();
  const [post, setPost] = useState(null);

  const loadPost = useCallback(async () => {
    const found = posts.find(p => p.id.toString() === id);
    if (found) setPost(found);
    else {
      try {
        await fetchPosts();
      } catch (err) {
        console.error("Errore fetchPosts:", err);
      }
    }
  }, [id, posts, fetchPosts]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  if (!post) return <p className="text-center my-5">Caricamento...</p>;

  return (
    <div className="container my-4">
      <h2>Dettagli Post</h2>
      <PostDetails post={post} />
    </div>
  );
}