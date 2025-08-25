import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";

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
    <div className="flex flex-col rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white text-gray-900"
      onClick={goToPost}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Visualizza post: ${post.title}`}
    >
      {/* Immagine */}
      <div className="relative h-64 sm:h-72 md:h-80 lg:h-64">
        {post.media?.[0]?.url ? (
          <img
            src={post.media[0].url}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            <ImageIcon className="text-gray-400 w-8 h-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      </div>

      {/* Body */}
      <div className="flex flex-col p-4 gap-1 flex-1 bg-white text-black">
        <h6 className="text-sm font-semibold line-clamp-2">{post.title}</h6>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Date */}
        <small className="text-gray-500 text-xs mt-auto">
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