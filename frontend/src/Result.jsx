// src/Result.jsx
import React, { useState } from 'react';
import './Result.css';

function Result({ searchQuery, searchType, results = [] }) {
  const [hoveredComments, setHoveredComments] = useState(null);
  const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  if (!searchQuery) {
    return (
      <section className="result-container">
        <h2>Search Results</h2>
        <p>Enter a search query to find posts or channels.</p>
      </section>
    );
  }

  if (results.length === 0) {
    return (
      <section className="result-container">
        <h2>Search Results</h2>
        <p>No results found for "{searchQuery}".</p>
      </section>
    );
  }

  return (
    <section className="result-container">
      <h2>Search Results for "{searchQuery}"</h2>
      <div className="result-list">
        {searchType === 'file' ? (
          // Display post results
          results.map((post) => (
            <div key={post.id} className="result-item">
              <div className="result-title">
                <span>{post.title}</span>
                {post.files && post.files.length > 0 && (
                  <span className="result-tag files">{post.files.length} file(s)</span>
                )}
              </div>
              
              <div className="result-preview">
                <span>{post.content}</span>
              </div>

              {post.files && post.files.length > 0 && (
                <div className="post-files">
                  {post.files.map((file) => (
                    <a
                      key={file.id}
                      href={`${API}/files/${file.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          ))
        ) : (
          // Display channel results
          results.map((channel) => (
            <div key={channel.id} className="result-item">
              <div className="result-title">
                <span>{channel.name}</span>
                <span className="result-tag channel">Channel</span>
              </div>
              
              <div className="result-preview">
                <span>{channel.bio || 'No description available'}</span>
              </div>

              <div className="result-meta">
                <span className="result-date">
                  Created on {new Date(channel.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Result;
