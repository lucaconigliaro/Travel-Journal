import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./PostCard.css";

function PostCard({ post }) {
  const navigate = useNavigate();

  const goToPost = useCallback(() => {
    navigate(`/post/${post.id}`);
  }, [navigate, post.id]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goToPost();
      }
    },
    [goToPost]
  );

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

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-2">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="badge post-card-tag">
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="badge post-card-tag">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Date */}
        <small className="post-card-date">
          {new Date(post.created_at).toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </small>
      </div>
    </div>
  );
}

export default React.memo(PostCard);