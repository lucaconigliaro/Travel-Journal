import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./PostCard.css";

function PostCard({ post }) {
  const navigate = useNavigate();

  const goToPost = useCallback(() => {
    navigate(`/post/${post.id}`);
  }, [navigate, post.id]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToPost();
    }
  }, [goToPost]);

  return (
    <div
      className="card post-card"
      onClick={goToPost}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Visualizza post: ${post.title}`}
      onMouseEnter={(e) => e.currentTarget.classList.add("hover")}
      onMouseLeave={(e) => e.currentTarget.classList.remove("hover")}
    >
      <div className="position-relative post-card-image">
        {post.media?.[0]?.url ? (
          <img
            src={post.media[0].url}
            alt={post.title}
            className="w-100 h-100 post-card-img"
            loading="lazy"
          />
        ) : (
          <div className="post-card-placeholder">
            <i className="bi bi-image text-light post-card-icon"></i>
          </div>
        )}
        <div className="post-card-overlay"></div>
      </div>

      <div className="card-body post-card-body">
        <h6 className="card-title post-card-title">{post.title}</h6>
        <div className="d-flex align-items-center justify-content-between">
          <small className="post-card-date">
            {new Date(post.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
          </small>
          {post.tags?.length > 0 && (
            <span className="badge post-card-tag">#{post.tags[0]}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(PostCard);