// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inizializza la sessione
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Get session error:", err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();

    // Listener per i cambiamenti di stato auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);

        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Signup con profilo
  const signup = async (email, password, fullName) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;

      const userId = data.user.id;

      // Inserisci/aggiorna su profiles
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      });
      if (profileError) throw profileError;

      return { success: true, data };
    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Non settare manualmente user qui, lascia che lo faccia onAuthStateChange
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      console.log("Starting logout...");

      // Prima pulisci lo stato locale
      setUser(null);

      // Poi fai il logout da Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Pulisci localStorage
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberMe");

      console.log("Logout successful");
      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      return { success: false, error: err.message };
    }
  };

  return { user, loading, signup, login, logout };
}