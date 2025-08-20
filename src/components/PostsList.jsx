import React from "react";
import PostCard from "./PostCard";

function PostsList({ posts = [] }) {
  if (posts.length === 0) {
    return (
      <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center py-5 text-light">
          <i className="bi bi-collection" style={{ fontSize: "3rem", opacity: 0.5 }}></i>
          <h5 className="fw-light mt-3">Nessun post disponibile</h5>
          <p className="opacity-75">I contenuti verranno visualizzati qui una volta caricati</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark min-vh-100">
      <div className="container py-5">
        <div className="row g-4">
          {posts.map((post) => (
            <div key={post.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(PostsList);