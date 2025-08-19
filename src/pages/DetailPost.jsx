import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePostsContext } from '../context/PostsContext';
import PostDetails from '../components/PostDetails';

export default function DetailPost() {
    const { id } = useParams();
    const { posts, fetchPosts } = usePostsContext();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const found = posts.find(p => p.id.toString() === id);
        if (found) setPost(found);
        else fetchPosts();
    }, [id, posts]);

    if (!post) return <p className="text-center my-5">Caricamento...</p>;

    return (
        <div className="container my-4">
            <h2>Dettagli Post</h2>
            <PostDetails post={post} />
        </div>
    );
}