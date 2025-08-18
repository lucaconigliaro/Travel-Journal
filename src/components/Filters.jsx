import React from 'react';

export default function Filters({
  searchText, setSearchText,
  moodFilter, setMoodFilter,
  tagsFilter, setTagsFilter,
  sortBy, setSortBy,
  sortOrder, setSortOrder
}) {
  return (
    <div className="mb-3 p-2 border rounded bg-light d-flex flex-wrap gap-2 align-items-center">
      <input
        type="text"
        placeholder="Cerca titolo/descrizione"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        className="form-control form-control-sm"
        style={{ minWidth: '120px' }}
      />
      <input
        type="text"
        placeholder="Stato d'animo"
        value={moodFilter}
        onChange={e => setMoodFilter(e.target.value)}
        className="form-control form-control-sm"
        style={{ minWidth: '100px' }}
      />
      <input
        type="text"
        placeholder="Tags (separati ,)"
        value={tagsFilter}
        onChange={e => setTagsFilter(e.target.value)}
        className="form-control form-control-sm"
        style={{ minWidth: '120px' }}
      />
      <select
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
        className="form-select form-select-sm"
        style={{ minWidth: '100px' }}
      >
        <option value="created_at">Data</option>
        <option value="spent">Spesa</option>
      </select>
      <select
        value={sortOrder}
        onChange={e => setSortOrder(e.target.value)}
        className="form-select form-select-sm"
        style={{ minWidth: '100px' }}
      >
        <option value="desc">Decrescente</option>
        <option value="asc">Crescente</option>
      </select>
    </div>
  );
}