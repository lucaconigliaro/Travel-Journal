// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Recupera la sessione iniziale
    async function getSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Session error:", err.message);
      } finally {
        setLoading(false);
      }
    }

    getSession();

    // 2. Ascolta i cambiamenti dello stato auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signup = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password
        // Rimosso emailRedirectTo per evitare email di conferma
      });
      
      if (error) {
        // Gestisci rate limiting
        if (error.message.includes('For security purposes')) {
          return { 
            success: false, 
            data: null, 
            error: "Troppi tentativi di registrazione. Riprova tra qualche minuto." 
          };
        }
        throw error;
      }
      
      console.log("Signup success:", data);
      
      // Se l'utente è confermato automaticamente (email confirmation disabilitata)
      if (data.user && !data.user.email_confirmed_at) {
        console.log("Account creato, ma richiede conferma email");
      }
      
      return { success: true, data, error: null };
    } catch (err) {
      console.error("Signup error:", err.message);
      return { success: false, data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      if (error) throw error;
      
      console.log("Login success:", data);
      return { success: true, data, error: null };
    } catch (err) {
      console.error("Login error:", err.message);
      return { success: false, data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Logout success");
      return { success: true, error: null };
    } catch (err) {
      console.error("Logout error:", err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
      console.log("Google auth initiated:", data);
      return { success: true, data, error: null };
    } catch (err) {
      console.error("Google auth error:", err.message);
      return { success: false, data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, signup, login, logout, signInWithGoogle };
}