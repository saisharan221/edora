import React, { useEffect, useState } from 'react';
import './SavedPosts.css';

export default function SavedPosts({ onPostClick, onBack }) {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('access_token');
  const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/saved-posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch saved posts');
      
      const data = await response.json();
      setSavedPosts(data);
    } catch (err) {
      console.error('Error fetching saved posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (postId, event) => {
    event.stopPropagation(); // Prevent post click when unsaving
    
    try {
      const response = await fetch(`${API}/saved-posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        setSavedPosts(prev => prev.filter(post => post.id !== postId));
      }
    } catch (err) {
      console.error('Error unsaving post:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="saved-posts-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading saved posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-posts-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={onBack} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-posts-container">
      <div className="saved-posts-header">
        <button onClick={onBack} className="back-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1>Saved Posts</h1>
      </div>

      <div className="saved-posts-content">
        {savedPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3>No saved posts yet</h3>
            <p>Posts you save will appear here for easy access later.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {savedPosts.map((post) => (
              <div 
                key={post.id} 
                className="post-card"
                onClick={() => onPostClick(post.id)}
              >
                <div className="post-card-header">
                  <h3 className="post-title">{post.title}</h3>
                  <button 
                    className="unsave-button"
                    onClick={(e) => handleUnsave(post.id, e)}
                    title="Remove from saved"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </div>
                
                <div className="post-content">
                  <p>{truncateContent(post.content)}</p>
                </div>
                
                <div className="post-meta">
                  <div className="author-info">
                    <span className="author-name">User #{post.author_id}</span>
                    <span className="post-date">{formatDate(post.created_at)}</span>
                  </div>
                  
                  {post.files && post.files.length > 0 && (
                    <div className="file-indicator">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      <span>{post.files.length} file{post.files.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 