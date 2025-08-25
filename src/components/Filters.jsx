import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from "lucide-react";

// Debounce hook
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function Filters({ posts, onFilter }) {
  const [searchText, setSearchText] = useState("");
  const [moodFilter, setMoodFilter] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const debouncedSearch = useDebounce(searchText);
  const debouncedMood = useDebounce(moodFilter);
  const debouncedTags = useDebounce(tagsFilter);
  const debouncedLocation = useDebounce(locationFilter);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredPosts = useMemo(() => {
    const search = debouncedSearch.trim().toLowerCase();
    const mood = debouncedMood.trim().toLowerCase();
    const tags = debouncedTags.trim().toLowerCase();
    const location = debouncedLocation.trim().toLowerCase();

    let filtered = [...posts];

    filtered = filtered
      .filter(
        (post) =>
          post.title?.toLowerCase().includes(search) ||
          post.description?.toLowerCase().includes(search)
      )
      .filter((post) => !mood || post.mood?.toLowerCase().includes(mood))
      .filter((post) => {
        if (!tags) return true;
        const tagsArr = tags.split(",").map((t) => t.trim());
        return post.tags?.some((tag) =>
          tagsArr.some((t) => tag.toLowerCase().includes(t))
        );
      })
      .filter(
        (post) =>
          !location || post.location_name?.toLowerCase().includes(location)
      )
      .sort((a, b) => {
        if (sortBy === "spent") {
          return sortOrder === "asc"
            ? (a.spent || 0) - (b.spent || 0)
            : (b.spent || 0) - (a.spent || 0);
        } else {
          return sortOrder === "asc"
            ? new Date(a.created_at) - new Date(b.created_at)
            : new Date(b.created_at) - new Date(a.created_at);
        }
      });

    return filtered;
  }, [
    posts,
    debouncedSearch,
    debouncedMood,
    debouncedTags,
    debouncedLocation,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    onFilter(filteredPosts);
  }, [filteredPosts, onFilter]);

  const handleChange = useCallback(
    (setter) => (e) => setter(e.target.value),
    []
  );

  const clearAllFilters = () => {
    setSearchText("");
    setMoodFilter("");
    setTagsFilter("");
    setLocationFilter("");
    setSortBy("created_at");
    setSortOrder("desc");
  };

  const hasActiveFilters = searchText || moodFilter || tagsFilter || locationFilter || sortBy !== "created_at" || sortOrder !== "desc";

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
      {/* Header con Search sempre visibile */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca nei tuoi ricordi..."
              value={searchText}
              onChange={handleChange(setSearchText)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200/50 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${showFilters || hasActiveFilters
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-gray-50/50 border-gray-200/50 text-gray-600 hover:bg-gray-100"
              }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {!isMobile && <span className="text-sm font-medium">Filtri</span>}
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-2 h-2"></span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
            />
          </button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
              title="Cancella filtri"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters - Collapsible */}
      <div className={`overflow-hidden transition-all duration-300 ease-out ${showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}>
        <div className="px-4 pb-4 border-t border-gray-100/50">
          <div className="pt-4 space-y-4">
            {/* Filtri di contenuto */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Stato d'animo
                </label>
                <input
                  type="text"
                  placeholder="es. Felice, Rilassato..."
                  value={moodFilter}
                  onChange={handleChange(setMoodFilter)}
                  className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200/50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Tag
                </label>
                <input
                  type="text"
                  placeholder="es. Natura, Cibo..."
                  value={tagsFilter}
                  onChange={handleChange(setTagsFilter)}
                  className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200/50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Luogo
                </label>
                <input
                  type="text"
                  placeholder="es. Roma, Italia..."
                  value={locationFilter}
                  onChange={handleChange(setLocationFilter)}
                  className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200/50 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
                />
              </div>
            </div>

            {/* Ordinamento */}
            <div className="border-t border-gray-100/50 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Ordina per
                  </label>
                  <select
                    value={sortBy}
                    onChange={handleChange(setSortBy)}
                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
                  >
                    <option value="created_at">Data di creazione</option>
                    <option value="spent">Budget speso</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Direzione
                  </label>
                  <select
                    value={sortOrder}
                    onChange={handleChange(setSortOrder)}
                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200"
                  >
                    <option value="desc">Dal più recente</option>
                    <option value="asc">Dal più vecchio</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Statistiche risultati */}
            <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50/30 rounded-lg px-3 py-2">
              <span>
                {filteredPosts.length === posts.length
                  ? `Tutti i ${posts.length} ricordi`
                  : `${filteredPosts.length} di ${posts.length} ricordi`
                }
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Cancella filtri
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}