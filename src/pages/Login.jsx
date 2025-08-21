import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determina il tab iniziale da state (Accedi o Registrati)
  const initialMode = location.state?.mode === "signup" ? false : true;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect automatico se già loggato
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Carica dati salvati se "Rimani connesso"
  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");
    const storedRemember = localStorage.getItem("rememberMe") === "true";

    if (storedEmail && storedPassword && storedRemember) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email e password sono obbligatorie");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = isLoginMode
        ? await login(email, password)
        : await signup(email, password);

      if (result.success) {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
        }
        navigate("/"); // redirect automatico alla home
      } else {
        setError(result.error);
      }
    } catch {
      setError("Errore durante l'autenticazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card bg-dark text-white border-secondary">
              <div className="card-header text-center">
                <h3>{isLoginMode ? "Accedi" : "Registrati"}</h3>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {error}
                  </div>
                )}

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Inserisci la tua email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Password con toggle */}
                <div className="mb-3 position-relative">
                  <label className="form-label">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Inserisci la password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    style={{ paddingRight: "40px" }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "white",
                      fontSize: "1.2rem",
                      zIndex: 10,
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>

                {/* Rimani connesso */}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    id="rememberMe"
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Rimani connesso
                  </label>
                </div>

                {/* Bottoni */}
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleEmailAuth}
                    disabled={loading}
                  >
                    {loading
                      ? isLoginMode
                        ? "Accesso..."
                        : "Registrazione..."
                      : isLoginMode
                      ? "Accedi"
                      : "Registrati"}
                  </button>

                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => {
                      setIsLoginMode(!isLoginMode);
                      setError("");
                    }}
                    disabled={loading}
                  >
                    {isLoginMode
                      ? "Non hai un account? Registrati"
                      : "Hai già un account? Accedi"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}