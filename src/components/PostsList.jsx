import React from 'react';
import PostCard from './PostCard';

export default function PostsFeed({ posts }) {
  return (
    <div className="d-flex flex-column gap-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}