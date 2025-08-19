import React, { useState, useEffect } from 'react';
import { usePostsContext } from '../context/PostsContext';
import Filters from '../components/Filters';
import PostsList from '../components/PostsList';

export default function Home() {
    const { posts, fetchPosts } = usePostsContext();
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        setFilteredPosts(posts);
    }, [posts]);

    return (
        <div className="container my-5">
            <header className="mb-4 text-center">
                <h1 className="display-4">Travel Journal</h1>
                <p className="lead">Racconta i tuoi viaggi e scopri le tappe degli altri!</p>
            </header>

            <Filters posts={posts} onFilter={setFilteredPosts} />

            <PostsList posts={filteredPosts} />
        </div>
    );
}