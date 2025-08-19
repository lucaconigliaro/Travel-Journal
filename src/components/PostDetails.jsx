import React, { useState } from 'react';

export default function PostDetails({ post }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!post) return <p className="text-center mt-5">Seleziona un post per vedere i dettagli</p>;

  const next = () => setActiveIndex((activeIndex + 1) % (post.media?.length || 1));
  const prev = () => setActiveIndex((activeIndex - 1 + (post.media?.length || 1)) % (post.media?.length || 1));

  return (
    <div className="card">
      <div className="card-body">
        {post.title && <h5 className="card-title">{post.title}</h5>}
        {post.description && <p className="card-text">{post.description}</p>}

        {post.media?.length > 0 && (
          <div className="position-relative mb-3">
            <div>
              {post.media.map((m, i) => (
                <div key={i} style={{ display: i === activeIndex ? 'block' : 'none' }}>
                  {m.type === 'image' ? (
                    <img src={m.url} alt="" className="d-block w-100" style={{ maxHeight: '400px', objectFit: 'cover' }} />
                  ) : (
                    <video className="d-block w-100" controls style={{ maxHeight: '400px' }}>
                      <source src={m.url} type="video/mp4" />
                    </video>
                  )}
                </div>
              ))}
            </div>
            {post.media.length > 1 && (
              <>
                <button onClick={prev} className="btn btn-sm btn-outline-primary position-absolute top-50 start-0 translate-middle-y">‹</button>
                <button onClick={next} className="btn btn-sm btn-outline-primary position-absolute top-50 end-0 translate-middle-y">›</button>
              </>
            )}
          </div>
        )}

        {post.location_name && <p><strong>Luogo:</strong> {post.location_name}</p>}
        {post.mood && <p><strong>Stato d’animo:</strong> {post.mood}</p>}
        {post.positive_reflection && <p><strong>Riflessione positiva:</strong> {post.positive_reflection}</p>}
        {post.negative_reflection && <p><strong>Riflessione negativa:</strong> {post.negative_reflection}</p>}
        {post.physical_effort && <p><strong>Impegno fisico:</strong> {post.physical_effort}</p>}
        {post.economic_effort && <p><strong>Effort economico:</strong> {post.economic_effort}</p>}
        {post.spent && <p><strong>Spesa:</strong> {post.spent} €</p>}
        {post.tags?.length > 0 && <p><strong>Tags:</strong> {post.tags.join(', ')}</p>}
        {post.created_at && <p><small className="text-muted">{new Date(post.created_at).toLocaleString()}</small></p>}
      </div>
    </div>
  );
}