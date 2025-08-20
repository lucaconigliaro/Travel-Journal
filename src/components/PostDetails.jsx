import React, { useState, useCallback } from 'react';

function PostDetails({ post }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!post) return <p className="text-center mt-5 text-white">Seleziona un post per vedere i dettagli</p>;

  const next = useCallback(() => setActiveIndex((i) => (i + 1) % (post.media?.length || 1)), [post.media]);
  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + (post.media?.length || 1)) % (post.media?.length || 1)), [post.media]);

  return (
    <div className="card bg-dark text-white border-secondary">
      <div className="card-body">
        {post.title && <h4 className="card-title mb-3">{post.title}</h4>}
        {post.description && <p className="card-text mb-4">{post.description}</p>}

        {post.media?.length > 0 && (
          <div className="position-relative mb-4">
            {post.media.map((m, i) => (
              <div key={i} style={{ display: i === activeIndex ? 'block' : 'none' }}>
                {m.type === 'image' ? (
                  <img src={m.url} alt="" className="d-block w-100 rounded" style={{ maxHeight: '400px', objectFit: 'cover' }} />
                ) : (
                  <video className="d-block w-100 rounded" controls style={{ maxHeight: '400px' }}>
                    <source src={m.url} type="video/mp4" />
                  </video>
                )}
              </div>
            ))}

            {post.media.length > 1 && (
              <>
                <button onClick={prev} className="btn btn-sm btn-outline-light position-absolute top-50 start-0 translate-middle-y">‹</button>
                <button onClick={next} className="btn btn-sm btn-outline-light position-absolute top-50 end-0 translate-middle-y">›</button>
              </>
            )}
          </div>
        )}

        <div className="row g-3 mb-3">
          {post.location_name && <p className="col-12"><strong>Luogo:</strong> {post.location_name}</p>}
          {post.mood && <p className="col-12"><strong>Stato d’animo:</strong> {post.mood}</p>}
          {post.positive_reflection && <p className="col-md-6"><strong>Riflessione positiva:</strong> {post.positive_reflection}</p>}
          {post.negative_reflection && <p className="col-md-6"><strong>Riflessione negativa:</strong> {post.negative_reflection}</p>}
          {post.physical_effort && <p className="col-md-4"><strong>Impegno fisico:</strong> {post.physical_effort}/5</p>}
          {post.economic_effort && <p className="col-md-4"><strong>Impegno economico:</strong> {post.economic_effort}/5</p>}
          {post.spent && <p className="col-md-4"><strong>Spesa:</strong> {post.spent} €</p>}
          {post.tags?.length > 0 && <p className="col-12"><strong>Tags:</strong> {post.tags.join(', ')}</p>}
          {post.created_at && <p className="col-12"><small className="text-muted">{new Date(post.created_at).toLocaleString()}</small></p>}
        </div>
      </div>
    </div>
  );
}

export default React.memo(PostDetails);