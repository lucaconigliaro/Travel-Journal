import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialMode = location.state?.mode === "signup" ? false : true;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedRemember = localStorage.getItem("rememberMe") === "true";
    if (storedEmail && storedRemember) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim() || (!isLoginMode && !fullName.trim())) {
      setError("Compila tutti i campi obbligatori");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result;
      if (isLoginMode) result = await login(email, password);
      else result = await signup(email, password, fullName);

      if (!result.success) throw new Error(result.error);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Errore durante l'autenticazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center px-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card bg-dark text-white border-secondary">
              <div className="card-header text-center">
                <h3>{isLoginMode ? "Accedi" : "Registrati"}</h3>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger mb-3">{error}</div>}

                {!isLoginMode && (
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
                )}

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control bg-dark text-white border-secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="mb-3 position-relative">
                  <label className="form-label">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control bg-dark text-white border-secondary"
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

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="form-check-input"
                    id="rememberMe"
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Rimani connesso
                  </label>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleAuth}
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