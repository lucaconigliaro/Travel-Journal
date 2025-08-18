import React from 'react';

export default function PostsList({ posts, selectedPost, setSelectedPost }) {
  return (
    <div className="d-flex flex-column gap-2">
      {posts.map(post => (
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
  );
}