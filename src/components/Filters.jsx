import React, { useState, useMemo, useCallback } from 'react';
import './Filters.css';

// Funzione debounce
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function Filters({ posts, onFilter }) {
  const [searchText, setSearchText] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

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
      // filtro titolo/descrizione
      .filter(post =>
        post.title?.toLowerCase().includes(search) ||
        post.description?.toLowerCase().includes(search)
      )
      // filtro mood parziale
      .filter(post => {
        if (!mood) return true;
        return post.mood?.toLowerCase().includes(mood);
      })
      // filtro tags parziale
      .filter(post => {
        if (!tags) return true;
        const tagsArr = tags.split(',').map(t => t.trim());
        return post.tags?.some(tag =>
          tagsArr.some(t => tag.toLowerCase().includes(t))
        );
      })
      // filtro location parziale
      .filter(post => {
        if (!location) return true;
        return post.location_name?.toLowerCase().includes(location);
      })
      // ordinamento
      .sort((a, b) => {
        if (sortBy === 'spent') {
          return sortOrder === 'asc'
            ? (a.spent || 0) - (b.spent || 0)
            : (b.spent || 0) - (a.spent || 0);
        } else {
          return sortOrder === 'asc'
            ? new Date(a.created_at) - new Date(b.created_at)
            : new Date(b.created_at) - new Date(a.created_at);
        }
      });

    return filtered;
  }, [posts, debouncedSearch, debouncedMood, debouncedTags, debouncedLocation, sortBy, sortOrder]);

  React.useEffect(() => {
    onFilter(filteredPosts);
  }, [filteredPosts, onFilter]);

  const handleChange = useCallback((setter) => e => setter(e.target.value), []);

  const inputClass = "form-control form-control-sm bg-dark text-white border-secondary";
  const selectClass = "form-select form-select-sm bg-dark text-white border-secondary";

  return (
    <div className="filters-container d-flex flex-wrap gap-2 p-2 bg-dark rounded">
      <input
        type="text"
        placeholder="🔍 Cerca..."
        value={searchText}
        onChange={handleChange(setSearchText)}
        className={inputClass}
        style={{ maxWidth: '120px' }}
      />
      <input
        type="text"
        placeholder="😊 Stato..."
        value={moodFilter}
        onChange={handleChange(setMoodFilter)}
        className={inputClass}
        style={{ maxWidth: '120px' }}
      />
      <input
        type="text"
        placeholder="🏷️ Tags..."
        value={tagsFilter}
        onChange={handleChange(setTagsFilter)}
        className={inputClass}
        style={{ maxWidth: '150px' }}
      />
      <input
        type="text"
        placeholder="📍 Luogo..."
        value={locationFilter}
        onChange={handleChange(setLocationFilter)}
        className={inputClass}
        style={{ maxWidth: '120px' }}
      />
      <select
        value={sortBy}
        onChange={handleChange(setSortBy)}
        className={selectClass}
        style={{ maxWidth: '120px' }}
      >
        <option value="created_at">Data</option>
        <option value="spent">Spesa</option>
      </select>
      <select
        value={sortOrder}
        onChange={handleChange(setSortOrder)}
        className={selectClass}
        style={{ maxWidth: '120px' }}
      >
        <option value="desc">Decrescente</option>
        <option value="asc">Crescente</option>
      </select>
    </div>
  );
}