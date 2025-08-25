import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { Eye, EyeOff } from "lucide-react";

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

  useEffect(() => {
    if (user) setFullName(user.full_name || user.user_metadata?.full_name || "");
  }, [user]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const updateProfile = useCallback(async () => {
    if (!user) return;
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
  }, [currentPassword, newPassword, confirmPassword, user.email]);

  const handleLogout = useCallback(async () => {
    const result = await logout();
    if (result.success) window.location.href = "/";
  }, [logout]);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white shadow-md rounded-xl p-6 text-center w-full max-w-md">
          <p className="text-gray-700">Devi fare login per accedere alle impostazioni.</p>
        </div>
      </div>
    );

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Impostazioni Account</h1>

        {error && <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
        {success && <div className="text-green-700 bg-green-100 p-3 rounded-md">{success}</div>}

        {/* Profilo */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Profilo</h2>
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
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              onClick={updateProfile}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salva Nome"}
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Cambia Password</h2>
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
              className="absolute right-2 top-2.5 text-gray-500"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            <button
              className="mt-4 w-full bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
              onClick={updatePassword}
              disabled={loading}
            >
              {loading ? "Cambiando..." : "Cambia Password"}
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-800">Logout</h2>
          <p className="text-gray-600">Esci dal tuo account su questo dispositivo.</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            onClick={handleLogout}
            disabled={loading}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center space-y-4">
            <h3 className="text-green-700 text-2xl font-bold">✅ Successo!</h3>
            <p className="text-gray-700">{success}</p>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
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