import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Heart, DollarSign, Zap, Star, Tag } from "lucide-react";

function PostDetails({ post }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!post) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg text-center">
        <p className="text-gray-600">Seleziona un post per vedere i dettagli</p>
      </div>
    );
  }

  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % (post.media?.length || 1)),
    [post.media]
  );

  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + (post.media?.length || 1)) % (post.media?.length || 1)),
    [post.media]
  );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
      {/* Media Gallery */}
      {post.media?.length > 0 && (
        <div className="relative">
          <div className="aspect-video md:aspect-[16/10] overflow-hidden">
            {post.media.map((m, i) => (
              <div key={i} className={`w-full h-full ${i === activeIndex ? "block" : "hidden"}`}>
                {m.type === "image" ? (
                  <img
                    src={m.url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    className="w-full h-full object-cover"
                    controls
                  >
                    <source src={m.url} type="video/mp4" />
                  </video>
                )}
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          {post.media.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={next}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 shadow-lg"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {post.media.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${i === activeIndex ? "bg-white w-6" : "bg-white/60"
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Description */}
        {post.description && (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">{post.description}</p>
          </div>
        )}

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {post.location_name && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="bg-green-100 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Luogo</p>
                <p className="text-green-700">{post.location_name}</p>
              </div>
            </div>
          )}

          {post.mood && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">Stato d'animo</p>
                <p className="text-purple-700">{post.mood}</p>
              </div>
            </div>
          )}

          {post.spent && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Budget speso</p>
                <p className="text-yellow-700 font-semibold">{post.spent} €</p>
              </div>
            </div>
          )}

          {post.created_at && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Data del viaggio</p>
                <p className="text-blue-700">
                  {new Date(post.created_at).toLocaleDateString("it-IT", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Effort Ratings */}
        {(post.physical_effort || post.economic_effort) && (
          <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200/50">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              Valutazione esperienza
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.physical_effort && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Sforzo fisico</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(post.physical_effort)}</div>
                    <span className="text-sm text-gray-600">({post.physical_effort}/5)</span>
                  </div>
                </div>
              )}

              {post.economic_effort && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Sforzo economico</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(post.economic_effort)}</div>
                    <span className="text-sm text-gray-600">({post.economic_effort}/5)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reflections */}
        {(post.positive_reflection || post.negative_reflection) && (
          <div className="space-y-4">
            {post.positive_reflection && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h4 className="font-semibold text-green-800 mb-3">Aspetti positivi</h4>
                <p className="text-green-700 leading-relaxed">{post.positive_reflection}</p>
              </div>
            )}

            {post.negative_reflection && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
                <h4 className="font-semibold text-red-800 mb-3">Aspetti da migliorare</h4>
                <p className="text-red-700 leading-relaxed">{post.negative_reflection}</p>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-200/50">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-500" />
              Tag del viaggio
            </h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Coordinates */}
        {(post.latitude || post.longitude) && (
          <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Coordinate:</span> {post.latitude || "—"}, {post.longitude || "—"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(PostDetails);