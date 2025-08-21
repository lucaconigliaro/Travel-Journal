import React, { createContext, useContext } from "react";
import { usePosts } from "../hooks/usePosts";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const postsHook = usePosts();
  return (
    <PostsContext.Provider value={postsHook}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePostsContext = () => useContext(PostsContext);