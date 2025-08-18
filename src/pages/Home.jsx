import React, { useState, useEffect } from 'react';
import { usePostsContext } from '../context/PostsContext';
import Filters from '../components/Filters';
import PostsList from '../components/PostsList';
import PostDetails from '../components/PostDetails';

export default function Home() {
  const { posts, fetchPosts } = usePostsContext();
  const [selectedPost, setSelectedPost] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');
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
      if (sortBy === 'spent') return sortOrder === 'asc' ? (a.spent || 0) - (b.spent || 0) : (b.spent || 0) - (a.spent || 0);
      else return sortOrder === 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at);
    });

  return (
    <div className="container my-5">
      <header className="mb-4 text-center">
        <h1 className="display-4">Travel Journal</h1>
        <p className="lead">Racconta i tuoi viaggi e scopri le tappe degli altri!</p>
      </header>

      <div className="row">
        <div className="col-md-7">
          <Filters
            searchText={searchText} setSearchText={setSearchText}
            moodFilter={moodFilter} setMoodFilter={setMoodFilter}
            tagsFilter={tagsFilter} setTagsFilter={setTagsFilter}
            sortBy={sortBy} setSortBy={setSortBy}
            sortOrder={sortOrder} setSortOrder={setSortOrder}
          />
          <PostsList
            posts={filteredPosts}
            selectedPost={selectedPost}
            setSelectedPost={setSelectedPost}
          />
        </div>

        <div className="col-md-5">
          <PostDetails post={selectedPost} />
        </div>
      </div>
    </div>
  );
}