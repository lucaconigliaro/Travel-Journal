import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PostDetails({ post }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!post)
    return <p className="text-center mt-5 text-gray-700">Seleziona un post per vedere i dettagli</p>;

  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % (post.media?.length || 1)),
    [post.media]
  );

  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + (post.media?.length || 1)) % (post.media?.length || 1)),
    [post.media]
  );

  return (
    <div className="mx-auto max-w-md bg-white text-black rounded-xl overflow-hidden shadow-md p-4">
      {/* Titolo e descrizione */}
      {post.title && <h5 className="text-lg font-semibold mb-2">{post.title}</h5>}
      {post.description && <p className="mb-3 text-gray-600">{post.description}</p>}

      {/* Media */}
      {post.media?.length > 0 && (
        <div className="relative mb-4">
          {post.media.map((m, i) => (
            <div key={i} className={i === activeIndex ? "block" : "hidden"}>
              {m.type === "image" ? (
                <img
                  src={m.url}
                  alt=""
                  className="w-full max-w-[350px] aspect-square object-cover rounded mx-auto"
                />
              ) : (
                <video
                  className="w-full max-w-[350px] aspect-square object-cover rounded mx-auto"
                  controls
                >
                  <source src={m.url} type="video/mp4" />
                </video>
              )}
            </div>
          ))}

          {post.media.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 p-1 rounded-full hover:bg-white/90"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={next}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 p-1 rounded-full hover:bg-white/90"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Info dettagli */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
        {post.location_name && (
          <p>
            <strong>Luogo:</strong> {post.location_name}
          </p>
        )}
        {(post.latitude || post.longitude) && (
          <p>
            <strong>Coordinate:</strong> {post.latitude || "—"}, {post.longitude || "—"}
          </p>
        )}
        {post.mood && (
          <p>
            <strong>Mood:</strong> {post.mood}
          </p>
        )}
        {post.positive_reflection && (
          <p className="sm:col-span-2">
            <strong>Riflessione +:</strong> {post.positive_reflection}
          </p>
        )}
        {post.negative_reflection && (
          <p className="sm:col-span-2">
            <strong>Riflessione –:</strong> {post.negative_reflection}
          </p>
        )}
        {post.physical_effort && (
          <p>
            <strong>Sforzo fisico:</strong> {post.physical_effort}/5
          </p>
        )}
        {post.economic_effort && (
          <p>
            <strong>Sforzo economico:</strong> {post.economic_effort}/5
          </p>
        )}
        {post.spent && (
          <p className="sm:col-span-2">
            <strong>Spesa:</strong> {post.spent} €
          </p>
        )}
        {post.tags?.length > 0 && (
          <p className="sm:col-span-2">
            <strong>Tags:</strong> {post.tags.join(", ")}
          </p>
        )}
        {post.created_at && (
          <p className="sm:col-span-2 text-gray-500 text-xs">
            {new Date(post.created_at).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

export default React.memo(PostDetails);