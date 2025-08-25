import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Home, Tag, MapPin, Smile, ArrowUpDown } from "lucide-react";

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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const debouncedSearch = useDebounce(searchText);
  const debouncedMood = useDebounce(moodFilter);
  const debouncedTags = useDebounce(tagsFilter);
  const debouncedLocation = useDebounce(locationFilter);

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

  const inputClass =
    "flex-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border border-gray-300 text-gray-800 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-200 placeholder-gray-400 w-full sm:w-auto";

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 p-1.5 bg-white rounded shadow-sm">
      {/* Ricerca */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto">
        <Home className="w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Cerca..."
          value={searchText}
          onChange={handleChange(setSearchText)}
          className={inputClass}
        />
      </div>

      {/* Pulsante dropdown mobile */}
      <button
        className="sm:hidden px-1.5 py-0.5 border border-gray-300 rounded text-xs hover:bg-gray-200 transition"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        Filtri ▲/▼
      </button>

      {/* Filtri avanzati */}
      <div
        className={`${
          showAdvanced ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row sm:items-center gap-1.5 w-full sm:w-auto`}
      >
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Smile className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Stato..."
            value={moodFilter}
            onChange={handleChange(setMoodFilter)}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Tag className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tags..."
            value={tagsFilter}
            onChange={handleChange(setTagsFilter)}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Luogo..."
            value={locationFilter}
            onChange={handleChange(setLocationFilter)}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={sortBy}
            onChange={handleChange(setSortBy)}
            className={inputClass}
          >
            <option value="created_at">Data</option>
            <option value="spent">Spesa</option>
          </select>
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 rotate-90" />
          <select
            value={sortOrder}
            onChange={handleChange(setSortOrder)}
            className={inputClass}
          >
            <option value="desc">Decrescente</option>
            <option value="asc">Crescente</option>
          </select>
        </div>
      </div>
    </div>
  );
}