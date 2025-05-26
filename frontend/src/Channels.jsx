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

export default function Channels({ onChannelClick, onCreateClick, view }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(null);

  const token = localStorage.getItem('access_token');
  const userId = parseInt(localStorage.getItem('user_id'));
  const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API}/channels/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setChannels(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [joining, view]);

  const handleJoin = async (channelId) => {
    setJoining(channelId);
    try {
      const res = await fetch(`${API}/channels/${channelId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to join');
      setJoining(null);
    } catch (err) {
      alert(err.message);
      setJoining(null);
    }
  };

  let filteredChannels = channels;
  if (view === 'your') {
    filteredChannels = channels.filter(ch => ch.joined);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="channels-container">
      <div className="channels-header">
        <h1 className="channels-title">{view === 'your' ? 'Your Channels' : 'All Channels'}</h1>
        <button className="create-channel-button" onClick={onCreateClick}>Create Channel</button>
      </div>
      <div className="channels-grid">
        {filteredChannels.map(ch => (
          <div key={ch.id} className="channel-card">
            <div className="channel-header">
              <h2 className="channel-name">{ch.name}</h2>
              {ch.bio && <p className="channel-bio">{ch.bio}</p>}
            </div>
            <div className="channel-meta">
              <div className="channel-actions">
                {ch.joined ? (
                  <span className="channel-owner">
                    {ch.owner_id === userId ? 'Your Channel' : 'Joined'}
                  </span>
                ) : (
                  <button
                    className="create-channel-button"
                    style={{ padding: '0.4rem 1rem', fontSize: '0.95rem', borderRadius: 8 }}
                    disabled={joining === ch.id}
                    onClick={() => handleJoin(ch.id)}
                  >
                    {joining === ch.id ? 'Joining...' : 'Join'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
