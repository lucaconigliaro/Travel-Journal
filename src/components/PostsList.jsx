import React from "react";
import PostCard from "./PostCard";

export default function PostsList({ posts = [] }) {
  return (
    <div className="bg-dark min-vh-100">
      <div className="container py-5">
        <div className="row g-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="text-center py-5">
                <div 
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary bg-opacity-10 mb-4"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-collection text-light opacity-50" style={{ fontSize: "2rem" }}></i>
                </div>
                <h5 className="text-light fw-light mb-2">Nessun post disponibile</h5>
                <p className="text-light opacity-75 mb-0">
                  I contenuti verranno visualizzati qui una volta caricati
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}