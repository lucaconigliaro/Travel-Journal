import React from "react";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/post/${post.id}`);
    }
  };

  return (
    <div
      className="card bg-dark text-white border-0 h-100 overflow-hidden"
      style={{
        aspectRatio: "4 / 5",
        cursor: "pointer",
        transition: "all 0.3s ease",
        borderRadius: "0.75rem",
      }}
      onClick={() => navigate(`/post/${post.id}`)}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Visualizza post: ${post.title}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
      }}
    >
      {/* Immagine di copertina */}
      <div className="position-relative" style={{ height: "75%" }}>
        {post.media?.[0]?.url ? (
          <img
            src={post.media[0].url}
            alt={post.title}
            className="w-100 h-100"
            style={{
              objectFit: "cover",
              borderRadius: "0.75rem 0.75rem 0 0",
            }}
            loading="lazy"
          />
        ) : (
          <div
            className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary"
            style={{
              borderRadius: "0.75rem 0.75rem 0 0",
              background: "linear-gradient(135deg, #495057 0%, #343a40 100%)",
            }}
          >
            <i className="bi bi-image text-light" style={{ fontSize: "2rem" }}></i>
          </div>
        )}
        
        {/* Overlay gradiente */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)",
            borderRadius: "0.75rem 0.75rem 0 0",
          }}
        ></div>
      </div>

      {/* Area contenuto */}
      <div className="card-body p-4 d-flex flex-column justify-content-between" style={{ height: "25%" }}>
        <div>
          <h6 
            className="card-title text-white fw-semibold mb-2 lh-sm"
            style={{
              fontSize: "0.9rem",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {post.title}
          </h6>
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <small className="text-light opacity-75 fw-medium">
            {new Date(post.created_at).toLocaleDateString('it-IT', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </small>

          {post.tags?.length > 0 && (
            <span className="badge bg-light text-dark px-2 py-1 fw-normal">
              #{post.tags[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}