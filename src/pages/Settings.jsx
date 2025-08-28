import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { Eye, EyeOff, User2, Lock, LogOut } from "lucide-react";

export default function Settings() {
  const { user, setUser, logout } = useAuth();

  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const messageRef = useRef(null);

  useEffect(() => {
    if (user) setFullName(user.full_name || user.user_metadata?.full_name || "");
  }, [user]);

  useEffect(() => {
    if (success || error) {
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const updateProfile = useCallback(async () => {
    if (!user) {
      setError("Utente non autenticato");
      return;
    }
    if (!fullName.trim()) return setError("Il nome non può essere vuoto");

    setLoading(true);
    setError("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (updateError) throw updateError;

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ id: user.id, full_name: fullName, updated_at: new Date().toISOString() });
      if (profileError) throw profileError;

      setSuccess("Profilo aggiornato con successo!");
      setShowSuccessModal(true);
      setUser?.((prev) => ({ ...prev, full_name: fullName }));
    } catch (err) {
      console.error(err);
      setError(err.message || "Errore durante l'aggiornamento del profilo");
    } finally {
      setLoading(false);
    }
  }, [fullName, user, setUser]);

  const updatePassword = useCallback(async () => {
    if (!user?.email) {
      setError("Utente non autenticato");
      return;
    }
    if (!currentPassword || !newPassword || !confirmPassword)
      return setError("Compila tutti i campi della password");
    if (newPassword !== confirmPassword) return setError("Le nuove password non coincidono");
    if (newPassword.length < 6) return setError("La nuova password deve essere di almeno 6 caratteri");

    setLoading(true);
    setError("");
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (loginError) throw new Error("Password attuale non corretta");

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      setSuccess("Password cambiata con successo!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Errore durante il cambio password");
    } finally {
      setLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword, user]);

  const handleLogout = useCallback(async () => {
    if (!user) return;
    const result = await logout();
    if (result.success) window.location.href = "/";
  }, [logout, user]);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center w-full max-w-md">
          <p className="text-gray-700 mb-4">Devi fare login per accedere alle impostazioni.</p>
        </div>
      </div>
    );

  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition";

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Impostazioni Account</h1>

        {error && (
          <div ref={messageRef} className="text-red-700 bg-red-100 p-3 rounded-2xl shadow">
            {error}
          </div>
        )}
        {success && (
          <div ref={messageRef} className="text-green-700 bg-green-100 p-3 rounded-2xl shadow">
            {success}
          </div>
        )}

        {/* Profilo */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border-t-4 border-indigo-400">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <User2 size={20} /> Profilo
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-600 mb-1">Nome completo</label>
              <input
                type="text"
                className={inputClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                placeholder="Il tuo nome"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                className={inputClass + " bg-gray-100 cursor-not-allowed"}
                value={user.email}
                disabled
              />
            </div>
            <button
              className="mt-3 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-xl shadow-md hover:scale-105 transform transition"
              onClick={updateProfile}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salva Nome"}
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border-t-4 border-yellow-400">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Lock size={20} /> Cambia Password
          </h2>
          <div className="space-y-3 relative">
            {[
              { label: "Password attuale", value: currentPassword, setter: setCurrentPassword },
              { label: "Nuova password", value: newPassword, setter: setNewPassword },
              { label: "Conferma nuova password", value: confirmPassword, setter: setConfirmPassword },
            ].map((field, idx) => (
              <div key={idx} className="relative">
                <label className="block text-gray-600 mb-1">{field.label}</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  className={inputClass + " pr-10"}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  disabled={loading}
                  placeholder={field.label}
                />
              </div>
            ))}

            <button
              type="button"
              className="absolute right-2 top-9 text-gray-500"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            <button
              className="mt-4 w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 px-4 py-2 rounded-xl shadow-md hover:scale-105 transform transition"
              onClick={updatePassword}
              disabled={loading}
            >
              {loading ? "Cambiando..." : "Cambia Password"}
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3 border-t-4 border-red-400">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <LogOut size={20} /> Logout
          </h2>
          <p className="text-gray-600">Esci dal tuo account su questo dispositivo.</p>
          <button
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transform transition"
            onClick={handleLogout}
            disabled={loading}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-md z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center space-y-4 border-t-4 border-green-400">
            <h3 className="text-green-700 text-2xl font-bold">✅ Successo!</h3>
            <p className="text-gray-700">{success}</p>
            <button
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-xl shadow-md hover:scale-105 transform transition"
              onClick={() => setShowSuccessModal(false)}
            >
              Perfetto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}