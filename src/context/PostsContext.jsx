import React, { createContext, useContext } from 'react';
import { usePosts } from '../hooks/usePosts.js'; // assicurati estensione .js

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const postsHook = usePosts(); // qui dentro l’hook

  return (
    <PostsContext.Provider value={postsHook}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePostsContext = () => useContext(PostsContext);