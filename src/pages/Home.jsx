import React, { useState, useEffect } from 'react';
import { usePostsContext } from '../context/PostsContext';

export default function Home() {
  const { posts, fetchPosts } = usePostsContext();
  const [selectedPost, setSelectedPost] = useState(null);

  // Filtri
  const [searchText, setSearchText] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');

  // Ordinamento
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts
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
      if (sortBy === 'spent') {
        return sortOrder === 'asc' ? (a.spent || 0) - (b.spent || 0) : (b.spent || 0) - (a.spent || 0);
      } else if (sortBy === 'created_at') {
        return sortOrder === 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });

  return (
    <div className="container my-5">
      {/* Intestazione */}
      <header className="mb-4 text-center">
        <h1 className="display-4">Travel Journal</h1>
        <p className="lead">Racconta i tuoi viaggi e scopri le tappe degli altri!</p>
      </header>

      <div className="row">
        {/* Colonna lista e filtri */}
        <div className="col-md-7">
          {/* Sezione filtri compatta */}
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

          {/* Lista post */}
          <div className="d-flex flex-column gap-2">
            {filteredPosts.map(post => (
              <div
                key={post.id}
                className={`card p-2 ${selectedPost?.id === post.id ? 'border-primary' : ''}`}
                onClick={() => setSelectedPost(post)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  {post.media[0]?.url && (
                    <img
                      src={post.media[0].url}
                      alt=""
                      className="img-thumbnail me-2"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <h6 className="mb-0">{post.title}</h6>
                    <small className="text-muted">{post.description?.substring(0, 40)}...</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonna dettagli */}
        <div className="col-md-5">
          {selectedPost ? (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{selectedPost.title}</h5>
                <p className="card-text">{selectedPost.description}</p>
                {selectedPost.media.length > 0 && selectedPost.media.map((m, i) => (
                  <img key={i} src={m.url} alt="" className="img-fluid mb-2" />
                ))}
                <p><strong>Luogo:</strong> {selectedPost.location_name}</p>
                <p><strong>Stato d’animo:</strong> {selectedPost.mood}</p>
                <p><strong>Riflessione positiva:</strong> {selectedPost.positive_reflection}</p>
                <p><strong>Riflessione negativa:</strong> {selectedPost.negative_reflection}</p>
                <p><strong>Impegno fisico:</strong> {selectedPost.physical_effort}</p>
                <p><strong>Effort economico:</strong> {selectedPost.economic_effort}</p>
                <p><strong>Spesa:</strong> {selectedPost.spent} €</p>
                <p><strong>Tags:</strong> {selectedPost.tags.join(', ')}</p>
                <p><small className="text-muted">{new Date(selectedPost.created_at).toLocaleString()}</small></p>
              </div>
            </div>
          ) : (
            <div className="text-center mt-5">
              <p>Seleziona un post per vedere i dettagli</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}