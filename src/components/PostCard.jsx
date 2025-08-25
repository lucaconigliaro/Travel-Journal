import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, MapPin, Calendar, Eye } from "lucide-react";

function PostCard({ post }) {
  const navigate = useNavigate();
  const [videoPoster, setVideoPoster] = useState(null);

  const media = useMemo(() => post.media?.[0], [post.media]);

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

  // Estrazione frame dal video come poster se manca
  useEffect(() => {
    if (media?.type === "video" && !media.thumbnail) {
      const video = document.createElement("video");
      video.src = media.url;
      video.crossOrigin = "anonymous";
      video.currentTime = 1; // prende frame dopo 1s

      video.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setVideoPoster(canvas.toDataURL("image/jpeg"));
      });
    }
  }, [media]);

  return (
    <div
      className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 border border-gray-200/50 hover:border-blue-200/50"
      onClick={goToPost}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Visualizza post: ${post.title}`}
    >
      {/* Media Preview */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        {media ? (
          media.type === "video" ? (
            <video
              src={media.url}
              poster={media.thumbnail || videoPoster || ""}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              muted
              playsInline
            />
          ) : (
            <img
              src={media.url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          )
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <ImageIcon className="text-gray-400 w-12 h-12" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* View button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Eye className="w-4 h-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Visualizza</span>
          </div>
        </div>

        {/* Media count indicator */}
        {post.media?.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            +{post.media.length - 1}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {post.title}
        </h3>

        {/* Description */}
        {post.description && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {post.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(post.created_at).toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {post.location_name && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-24">{post.location_name}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs font-medium border border-blue-100"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(PostCard);