// src/hooks/usePosts.js
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./useAuth";

export function usePosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (userId) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(Array.isArray(data) ? data : []);
      return { success: true, data, error: null };
    } catch (err) {
      console.error("Errore fetchPosts:", err);
      setPosts([]);
      return { success: false, data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (postData) => {
    if (!user) {
      console.error("User not logged in");
      return { success: false, error: "User not logged in" };
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .insert([{ ...postData, user_id: user.id }])
        .select() // 👈 Importante: restituisce i dati inseriti
        .single();

      if (error) throw error;
      
      // Aggiorna lo state locale
      setPosts((prev) => [data, ...prev]);
      return { success: true, data, error: null };
    } catch (err) {
      console.error("Errore addPost:", err);
      return { success: false, data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Carica i posts quando l'utente cambia
  useEffect(() => {
    if (user?.id) {
      fetchPosts(user.id);
    } else {
      setPosts([]);
    }
  }, [user?.id]);

  return { 
    posts, 
    loading, 
    addPost, 
    fetchPosts,
    user // Espongo anche l'utente per comodità
  };
}