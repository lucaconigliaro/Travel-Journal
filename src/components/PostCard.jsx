import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const [showFullDesc, setShowFullDesc] = useState(false);

  return (
    <div className="card shadow-sm border-0 mx-auto" style={{ width: "400px" }}>
      {/* Immagine quadrata fissa */}
      {post.media[0]?.url && (
        <img
          src={post.media[0].url}
          alt=""
          style={{
            width: "400px",
            height: "400px",
            objectFit: "cover",
            display: "block",
            margin: "0 auto",
            cursor: "pointer"
          }}
          onClick={() => navigate(`/post/${post.id}`)}
        />
      )}

      <div className="card-body">
        {/* Titolo */}
        <h6 className="card-title mb-1">{post.title}</h6>

        {/* Descrizione */}
        <p className="card-text">
          {showFullDesc || post.description.length <= 150
            ? post.description
            : post.description.substring(0, 150) + '...'}
          {post.description.length > 150 && (
            <span
              className="text-primary ms-1"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowFullDesc(prev => !prev)}
            >
              {showFullDesc ? 'meno' : 'leggi di più'}
            </span>
          )}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-2">
            {post.tags.map((tag, i) => (
              <span key={i} className="badge bg-secondary me-1">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">{new Date(post.created_at).toLocaleDateString()}</small>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate(`/post/${post.id}`)}
          >
            Dettagli
          </button>
        </div>
      </div>
    </div>
  );
}