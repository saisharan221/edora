// src/Channels.jsx
import React, { useEffect, useState } from 'react';
import './Channels.css';

// Icons (you can replace these with your preferred icon library)
const ChannelIcon = () => (
  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PostIcon = () => (
  <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const LoadingIcon = () => (
  <svg className="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

const EmptyIcon = () => (
  <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function Channels({ onChannelClick, onCreateClick }) {
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('access_token');
  const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Fetch all channels
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Fetch all channels
    fetch(`${API}/channels/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Fetched channels:', data);
        setChannels(data);
      })
      .catch(err => {
        console.error('Error fetching channels:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChannelClick = (channel) => {
    if (onChannelClick) {
      onChannelClick(channel.id);
    }
  };

  const handleCreateClick = () => {
    if (onCreateClick) {
      onCreateClick();
    }
  };

  if (loading) {
    return (
      <div className="channels-container">
        <div className="loading-container">
          <LoadingIcon />
          <p>Loading channels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="channels-container">
        <div className="error-container">
          <ErrorIcon />
          <p className="error-message">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="channels-container">
      <div className="channels-header">
        <h1 className="channels-title">All Channels</h1>
        <button 
          className="create-channel-button"
          onClick={handleCreateClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create Channel
        </button>
      </div>

      {channels.length === 0 ? (
        <div className="empty-state">
          <EmptyIcon />
          <p className="empty-message">No channels yet. Create one to get started!</p>
          <button 
            className="create-channel-button"
            onClick={handleCreateClick}
          >
            Create Your First Channel
          </button>
        </div>
      ) : (
        <div className="channels-grid">
          {channels.map(ch => (
            <div
              key={ch.id}
              className="channel-card"
              onClick={() => handleChannelClick(ch)}
            >
              <div className="channel-header">
                <h2 className="channel-name">{ch.name}</h2>
                {ch.bio && <p className="channel-bio">{ch.bio}</p>}
              </div>
              <div className="channel-meta">
                <div className="channel-stats">
                  <div className="stat-item">
                    <ChannelIcon />
                    <span>Channel</span>
                  </div>
                  <div className="stat-item">
                    <PostIcon />
                    <span>View Posts</span>
                  </div>
                </div>
                <div className="channel-actions">
                  <span className="channel-owner">
                    {ch.owner_id === parseInt(localStorage.getItem('user_id')) ? 'Your Channel' : 'Public Channel'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
