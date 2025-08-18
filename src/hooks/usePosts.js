import { useState } from 'react';
import { supabase } from '../supabaseClient';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Errore fetchPosts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (post) => {
    try {
      const { data, error } = await supabase.from('posts').insert([post]);
      if (error) throw error;
      if (Array.isArray(data) && data.length > 0) {
        setPosts(prev => [data[0], ...prev]);
      }
    } catch (err) {
      console.error('Errore addPost:', err);
    }
  };

  return { posts, loading, fetchPosts, addPost };
};