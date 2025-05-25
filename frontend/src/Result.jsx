// src/Result.jsx
import React, { useState } from 'react';
import './Result.css';
import PostDetail from './PostDetail';

function Result({ searchQuery, searchType, results = [], onBack }) {
  const [selectedPost, setSelectedPost] = useState(null);

  if (!searchQuery) {
    return (
      <div className="result-container">
        <div className="empty-state">
          <h2>Enter a search query to find posts and channels</h2>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="result-container">
        <div className="empty-state">
          <h2>No results found for "{searchQuery}"</h2>
          <p>Try different keywords or search terms</p>
        </div>
      </div>
    );
  }

  // If a post is selected, show the post detail panel
  if (selectedPost) {
    return (
      <PostDetail 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />
    );
  }

  // Otherwise show the search results
  return (
    <div className="result-container">
      <div className="result-header">
        <h2>Search Results for "{searchQuery}"</h2>
      </div>

      <div className="result-list">
        {searchType === 'file' ? (
          results.map((post) => (
            <div
              key={post.id}
              className="result-item clickable"
              onClick={() => setSelectedPost(post)}
            >
              <div className="result-content">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {post.files && post.files.length > 0 && (
                  <div className="result-files">
                    {post.files.map((file) => (
                      <a
                        key={file.id}
                        href={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/files/${file.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="file-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path d="M14 2v6h6" />
                          <path d="M16 13H8" />
                          <path d="M16 17H8" />
                          <path d="M10 9H8" />
                        </svg>
                        {file.filename.split('/').pop()}
                      </a>
                    ))}
                  </div>
                )}
                <div className="result-meta">
                  <span className="result-date">
                    Posted on {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          results.map((channel) => (
            <div key={channel.id} className="result-item">
              <div className="result-content">
                <h3>{channel.name}</h3>
                <p>{channel.bio}</p>
                <div className="result-meta">
                  <span className="result-date">
                    Created on {new Date(channel.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Result;
