import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          {isLoginMode ? "Accedi" : "Registrati"}
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 text-center">{error}</div>
        )}

        {!isLoginMode && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-medium">Nome completo</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              placeholder="Il tuo nome"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="esempio@email.com"
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-1 font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="********"
          />
          <button
            type="button"
            className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            disabled={loading}
          />
          <label htmlFor="rememberMe" className="ml-2 block text-gray-700 text-sm">
            Rimani connesso
          </label>
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {loading ? (isLoginMode ? "Accesso..." : "Registrazione...") : (isLoginMode ? "Accedi" : "Registrati")}
        </button>

        <button
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setError("");
          }}
          disabled={loading}
          className="mt-4 w-full text-indigo-600 hover:text-indigo-800 font-medium transition"
        >
          {isLoginMode ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
        </button>
      </div>
    </div>
  );
}