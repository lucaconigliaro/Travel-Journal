import React from 'react';

export default function PostDetails({ post }) {
  if (!post) return (
    <div className="text-center mt-5">
      <p>Seleziona un post per vedere i dettagli</p>
    </div>
  );

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{post.title}</h5>
        <p className="card-text">{post.description}</p>
        {post.media.length > 0 && post.media.map((m, i) => (
          <img key={i} src={m.url} alt="" className="img-fluid mb-2" />
        ))}
        <p><strong>Luogo:</strong> {post.location_name}</p>
        <p><strong>Stato d’animo:</strong> {post.mood}</p>
        <p><strong>Riflessione positiva:</strong> {post.positive_reflection}</p>
        <p><strong>Riflessione negativa:</strong> {post.negative_reflection}</p>
        <p><strong>Impegno fisico:</strong> {post.physical_effort}</p>
        <p><strong>Effort economico:</strong> {post.economic_effort}</p>
        <p><strong>Spesa:</strong> {post.spent} €</p>
        <p><strong>Tags:</strong> {post.tags.join(', ')}</p>
        <p><small className="text-muted">{new Date(post.created_at).toLocaleString()}</small></p>
      </div>
    </div>
  );
}