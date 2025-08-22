import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

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

  // Carica dati utente
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || user.user_metadata?.full_name || "");
    }
  }, [user]);

  // Timer per messaggi
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
    if (!fullName.trim()) {
      setError("Il nome non può essere vuoto");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      if (updateError) throw updateError;

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      });
      if (profileError) throw profileError;

      setSuccess("Profilo aggiornato con successo!");
      setShowSuccessModal(true);

      // Aggiorna il context così il nome in navbar si aggiorna subito
      if (setUser) setUser(prev => ({ ...prev, full_name: fullName }));

    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message || "Errore durante l'aggiornamento del profilo");
    } finally {
      setLoading(false);
    }
  }, [fullName, user.id, setUser]);

  const updatePassword = useCallback(async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Compila tutti i campi della password");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Le nuove password non coincidono");
      return;
    }
    if (newPassword.length < 6) {
      setError("La nuova password deve essere di almeno 6 caratteri");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });
      if (loginError) throw new Error("Password attuale non corretta");

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (updateError) throw updateError;

      setSuccess("Password cambiata con successo!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Update password error:", err);
      setError(err.message || "Errore durante il cambio password");
    } finally {
      setLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword, user.email]);

  const handleLogout = useCallback(async () => {
    const result = await logout();
    if (result.success) {
      window.location.href = "/login";
    }
  }, [logout]);

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          Devi fare login per accedere alle impostazioni.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="text-white mb-4">Impostazioni Account</h1>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Profilo */}
          <div className="card bg-dark text-white border-secondary mb-4">
            <div className="card-header">
              <h3 className="mb-0">Profilo</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Nome completo</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  placeholder="Il tuo nome"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control bg-dark text-white border-secondary"
                  value={user.email}
                  disabled
                  title="L'email non può essere modificata"
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={updateProfile}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salva Nome"}
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="card bg-dark text-white border-secondary mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Cambia Password</h3>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setShowPasswords(!showPasswords)}
                type="button"
              >
                {showPasswords ? "Nascondi" : "Mostra"} Password
              </button>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Password attuale</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  className="form-control bg-dark text-white border-secondary"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Inserisci la password attuale"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nuova password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  className="form-control bg-dark text-white border-secondary"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Inserisci la nuova password"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Conferma nuova password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  className="form-control bg-dark text-white border-secondary"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Conferma la nuova password"
                />
              </div>
              <button
                className="btn btn-warning"
                onClick={updatePassword}
                disabled={loading}
              >
                {loading ? "Cambiando..." : "Cambia Password"}
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="card bg-dark text-white border-danger">
            <div className="card-header">
              <h3 className="mb-0 text-danger">Zona Pericolosa</h3>
            </div>
            <div className="card-body">
              <p>Esci dal tuo account su questo dispositivo.</p>
              <button
                className="btn btn-danger"
                onClick={handleLogout}
                disabled={loading}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showSuccessModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-success">
              <div className="modal-header border-success">
                <h4 className="modal-title text-success">✅ Successo!</h4>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowSuccessModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center py-4">
                <div className="mb-3"><span style={{ fontSize: '4rem' }}>🎉</span></div>
                <p className="lead">{success}</p>
                <p className="text-muted">Le modifiche sono state applicate al tuo account.</p>
              </div>
              <div className="modal-footer border-success">
                <button
                  className="btn btn-success"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Perfetto! 👍
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}