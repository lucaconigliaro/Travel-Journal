import React, { useState, useCallback } from 'react';

function PostDetails({ post }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!post)
    return <p className="text-center mt-5 text-white">Seleziona un post per vedere i dettagli</p>;

  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % (post.media?.length || 1)),
    [post.media]
  );

  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + (post.media?.length || 1)) % (post.media?.length || 1)),
    [post.media]
  );

  return (
    <div className="card bg-dark text-white border-secondary mx-auto" style={{ maxWidth: '420px' }}>
      <div className="card-body">
        {post.title && <h5 className="card-title mb-2">{post.title}</h5>}
        {post.description && <p className="card-text mb-3">{post.description}</p>}

        {/* Media quadrato ma compatto */}
        {post.media?.length > 0 && (
          <div className="position-relative mb-3">
            {post.media.map((m, i) => (
              <div key={i} style={{ display: i === activeIndex ? 'block' : 'none' }}>
                {m.type === 'image' ? (
                  <img
                    src={m.url}
                    alt=""
                    className="d-block rounded mx-auto"
                    style={{
                      width: '100%',
                      maxWidth: '350px',
                      aspectRatio: '1 / 1',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <video
                    className="d-block rounded mx-auto"
                    controls
                    style={{
                      width: '100%',
                      maxWidth: '350px',
                      aspectRatio: '1 / 1',
                      objectFit: 'cover',
                    }}
                  >
                    <source src={m.url} type="video/mp4" />
                  </video>
                )}
              </div>
            ))}

            {post.media.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="btn btn-sm btn-outline-light position-absolute top-50 start-0 translate-middle-y"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="btn btn-sm btn-outline-light position-absolute top-50 end-0 translate-middle-y"
                >
                  ›
                </button>
              </>
            )}
          </div>
        )}

        {/* Info */}
        <div className="row g-2 mb-2 small">
          {post.location_name && (
            <p className="col-12">
              <strong>Luogo:</strong> {post.location_name}
            </p>
          )}
          {(post.latitude || post.longitude) && (
            <p className="col-12">
              <strong>Coordinate:</strong> {post.latitude || '—'}, {post.longitude || '—'}
            </p>
          )}
          {post.mood && (
            <p className="col-12">
              <strong>Mood:</strong> {post.mood}
            </p>
          )}
          {post.positive_reflection && (
            <p className="col-12">
              <strong>Riflessione +:</strong> {post.positive_reflection}
            </p>
          )}
          {post.negative_reflection && (
            <p className="col-12">
              <strong>Riflessione –:</strong> {post.negative_reflection}
            </p>
          )}
          {post.physical_effort && (
            <p className="col-6">
              <strong>Sforzo fisico:</strong> {post.physical_effort}/5
            </p>
          )}
          {post.economic_effort && (
            <p className="col-6">
              <strong>Sforzo economico:</strong> {post.economic_effort}/5
            </p>
          )}
          {post.spent && (
            <p className="col-12">
              <strong>Spesa:</strong> {post.spent} €
            </p>
          )}
          {post.tags?.length > 0 && (
            <p className="col-12">
              <strong>Tags:</strong> {post.tags.join(', ')}
            </p>
          )}
          {post.created_at && (
            <p className="col-12">
              <small className="text-muted">
                {new Date(post.created_at).toLocaleString()}
              </small>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(PostDetails);