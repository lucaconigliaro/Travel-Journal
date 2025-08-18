import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePostsContext } from '../context/PostsContext.jsx';

export default function Home() {
  const { posts, loading, fetchPosts } = usePostsContext();
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-5">Caricamento...</p>;

  return (
    <div className="container mt-4">
      <Link to="/add" className="btn btn-primary mb-3">Aggiungi Nuovo Post</Link>

      <div className="row">
        {/* Colonna dei post */}
        <div className="col-md-6">
          {posts.map(post => (
            <div 
              key={post.id} 
              className="card mb-3" 
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedPost(post)}
            >
              {post.media?.[0]?.url && (
                <img src={post.media[0].url} className="card-img-top" alt={post.title} />
              )}
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pannello dei dettagli */}
        <div className="col-md-6">
          {selectedPost ? (
            <div className="card sticky-top" style={{ top: '20px' }}>
              {selectedPost.media?.map((m, i) => (
                <img key={i} src={m.url} alt={selectedPost.title} className="img-fluid mb-2" />
              ))}
              <div className="card-body">
                <h5 className="card-title">{selectedPost.title}</h5>
                <p><strong>Descrizione:</strong> {selectedPost.description}</p>
                <p><strong>Luogo:</strong> {selectedPost.location_name}</p>
                <p><strong>Lat:</strong> {selectedPost.latitude}, <strong>Lon:</strong> {selectedPost.longitude}</p>
                <p><strong>Stato d’animo:</strong> {selectedPost.mood}</p>
                <p><strong>Riflessione positiva:</strong> {selectedPost.positive_reflection}</p>
                <p><strong>Riflessione negativa:</strong> {selectedPost.negative_reflection}</p>
                <p><strong>Impegno fisico:</strong> {selectedPost.physical_effort}</p>
                <p><strong>Effort economico:</strong> {selectedPost.economic_effort}</p>
                <p><strong>Spesa:</strong> €{selectedPost.spent}</p>
                <p><strong>Tags:</strong> {selectedPost.tags?.join(', ')}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted">Clicca su un post per vedere i dettagli</p>
          )}
        </div>
      </div>
    </div>
  );
}