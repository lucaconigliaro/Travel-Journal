import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div className="container">
        <Link className="navbar-brand text-white" to="/">Travel Journal</Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/add">Aggiungi Post</Link>
                </li>

                {/* Dropdown Utente */}
                <li className="nav-item dropdown">
                  <button
                    className="btn nav-link dropdown-toggle d-flex align-items-center text-white"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Avatar"
                        className="rounded-circle me-2"
                        style={{ width: "32px", height: "32px", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-secondary me-2 d-flex justify-content-center align-items-center"
                        style={{ width: "32px", height: "32px", color: "#fff" }}
                      >
                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <span>{user.user_metadata?.full_name || user.email}</span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-item" to="/settings">Impostazioni</Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={logout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}