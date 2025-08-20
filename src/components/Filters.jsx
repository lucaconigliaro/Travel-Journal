import React, { useState, useEffect } from 'react';

export default function Filters({ posts, onFilter }) {
  const [searchText, setSearchText] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    let filtered = [...posts];

    filtered = filtered
      .filter(post =>
        post.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (post.description && post.description.toLowerCase().includes(searchText.toLowerCase()))
      )
      .filter(post => !moodFilter || post.mood === moodFilter)
      .filter(post => {
        if (!tagsFilter) return true;
        const tagsArr = tagsFilter.split(',').map(t => t.trim().toLowerCase());
        return post.tags?.some(tag => tagsArr.includes(tag.toLowerCase()));
      })
      .sort((a, b) => {
        if (sortBy === 'spent') return sortOrder === 'asc' ? (a.spent || 0) - (b.spent || 0) : (b.spent || 0) - (a.spent || 0);
        else return sortOrder === 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at);
      });

    onFilter(filtered);
  }, [searchText, moodFilter, tagsFilter, sortBy, sortOrder, posts]);

  const inputClass = "form-control form-control-sm bg-dark text-white border-secondary";
  const selectClass = "form-select form-select-sm bg-dark text-white border-secondary";

  return (
    <div className="mb-3 p-3 d-flex flex-wrap gap-2 align-items-center bg-dark rounded" style={{ position: 'relative' }}>
      <style>
        {`
          .bg-dark input::placeholder,
          .bg-dark select::placeholder {
            color: white;
            opacity: 0.7;
          }
          .bg-dark input:hover,
          .bg-dark select:hover {
            border-color: #9F83E4;
          }
          .bg-dark input:focus,
          .bg-dark select:focus {
            border-color: #9F83E4;
            box-shadow: 0 0 5px #9F83E4;
          }
        `}
      </style>

      <input
        type="text"
        placeholder="🔍 Cerca..."
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        className={inputClass}
        style={{ maxWidth: '120px' }}
      />
      <input
        type="text"
        placeholder="😊 Stato..."
        value={moodFilter}
        onChange={e => setMoodFilter(e.target.value)}
        className={inputClass}
        style={{ maxWidth: '120px' }}
      />
      <input
        type="text"
        placeholder="🏷️ Tags..."
        value={tagsFilter}
        onChange={e => setTagsFilter(e.target.value)}
        className={inputClass}
        style={{ maxWidth: '150px' }}
      />
      <select
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
        className={selectClass}
        style={{ maxWidth: '120px' }}
      >
        <option value="created_at">Data</option>
        <option value="spent">Spesa</option>
      </select>
      <select
        value={sortOrder}
        onChange={e => setSortOrder(e.target.value)}
        className={selectClass}
        style={{ maxWidth: '120px' }}
      >
        <option value="desc">Decrescente</option>
        <option value="asc">Crescente</option>
      </select>
    </div>
  );
}