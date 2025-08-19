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
        return post.tags.some(tag => tagsArr.includes(tag.toLowerCase()));
      })
      .sort((a, b) => {
        if (sortBy === 'spent') return sortOrder === 'asc' ? (a.spent || 0) - (b.spent || 0) : (b.spent || 0) - (a.spent || 0);
        else return sortOrder === 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at);
      });

    onFilter(filtered);
  }, [searchText, moodFilter, tagsFilter, sortBy, sortOrder, posts]);

  return (
    <div className="mb-3 p-2  d-flex flex-wrap gap-2 align-items-center">
      <input
        type="text"
        placeholder="Cerca"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        className="form-control form-control-sm"
        style={{ maxWidth: '100px' }}
      />
      <input
        type="text"
        placeholder="Stato"
        value={moodFilter}
        onChange={e => setMoodFilter(e.target.value)}
        className="form-control form-control-sm"
        style={{ maxWidth: '100px' }}
      />
      <input
        type="text"
        placeholder="Tags (separati ,)"
        value={tagsFilter}
        onChange={e => setTagsFilter(e.target.value)}
        className="form-control form-control-sm"
        style={{ maxWidth: '100px' }}
      />
      <select
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
        className="form-select form-select-sm"
        style={{ maxWidth: '100px' }}
      >
        <option value="created_at">Data</option>
        <option value="spent">Spesa</option>
      </select>
      <select
        value={sortOrder}
        onChange={e => setSortOrder(e.target.value)}
        className="form-select form-select-sm"
        style={{ maxWidth: '100px' }}
      >
        <option value="desc">Decrescente</option>
        <option value="asc">Crescente</option>
      </select>
    </div>
  );
}