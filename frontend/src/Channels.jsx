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

export default function Channels({ onChannelClick, onCreateClick, view, userRole }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

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

  const handleLeave = async (channelId) => {
    try {
      const res = await fetch(`${API}/channels/${channelId}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to leave channel');
      setChannels(channels.map(ch => ch.id === channelId ? { ...ch, joined: false } : ch));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (channelId) => {
    if (!window.confirm('Are you sure you want to delete this channel?')) return;
    try {
      const res = await fetch(`${API}/channels/${channelId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete channel');
      setChannels(channels.filter(ch => ch.id !== channelId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditClick = (ch) => {
    setEditingId(ch.id);
    setEditName(ch.name);
    setEditBio(ch.bio || "");
    setEditError("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditBio("");
    setEditError("");
  };

  const handleEditSave = async (ch) => {
    setEditLoading(true);
    setEditError("");
    try {
      const res = await fetch(`${API}/channels/${ch.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, bio: editBio }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setEditError(body.detail || 'Failed to update channel');
      } else {
        // Update local state
        setChannels(channels.map(c => c.id === ch.id ? { ...c, name: editName, bio: editBio } : c));
        setEditingId(null);
      }
    } catch (err) {
      setEditError('Failed to update channel');
    } finally {
      setEditLoading(false);
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
          <div
            key={ch.id}
            className="channel-card"
            style={{ cursor: 'pointer', opacity: 1, position: 'relative' }}
            onClick={() => {
              if (!editingId) onChannelClick && onChannelClick(ch.id);
            }}
          >
            <div className="channel-header">
              {editingId === ch.id ? (
                <form onSubmit={e => { e.preventDefault(); handleEditSave(ch); }} style={{ width: '100%' }}>
                  <input
                    className="create-channel-input outline"
                    style={{ marginBottom: 8, width: '100%' }}
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Channel Name"
                    required
                  />
                  <textarea
                    className="create-channel-textarea outline"
                    style={{ marginBottom: 8, width: '100%' }}
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    placeholder="Channel Description"
                  />
                  {editError && <div className="create-channel-error">{editError}</div>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit" className="create-channel-btn" style={{ flex: 1 }} disabled={editLoading}>Save</button>
                    <button type="button" className="create-channel-btn" style={{ flex: 1, background: '#eee', color: '#333' }} onClick={handleEditCancel} disabled={editLoading}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="channel-name">{ch.name}</h2>
                  {ch.bio && <p className="channel-bio">{ch.bio}</p>}
                </>
              )}
            </div>
            <div className="channel-meta">
              <div className="channel-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                {!ch.joined ? (
                  <button
                    className="create-channel-button"
                    style={{ flex: 1, padding: '0.4rem 1rem', fontSize: '0.95rem', borderRadius: 18 }}
                    disabled={joining === ch.id}
                    onClick={e => { e.stopPropagation(); handleJoin(ch.id); }}
                  >
                    {joining === ch.id ? 'Joining...' : 'Join'}
                  </button>
                ) : (
                  <button
                    className="create-channel-button"
                    style={{ flex: 1, padding: '0.4rem 1rem', fontSize: '0.95rem', borderRadius: 18, background: '#e0e7ff', color: '#222', fontWeight: 600 }}
                    onClick={e => { e.stopPropagation(); handleLeave(ch.id); }}
                  >
                    Leave
                  </button>
                )}
                {(userRole === 'moderator' || userRole === 'admin' || ch.owner_id === userId) && (
                  editingId === ch.id ? null : null
                )}
                {(userRole === 'moderator' || userRole === 'admin' || ch.owner_id === userId) && (
                  <button
                    className="delete-channel-button gradient-red"
                    style={{ flex: 1, padding: '0.4rem 1rem', fontSize: '0.95rem', borderRadius: 18, color: 'white', border: 'none', fontWeight: 600, boxShadow: '0 2px 8px rgba(255,0,0,0.08)' }}
                    onClick={e => { e.stopPropagation(); handleDelete(ch.id); }}
                  >
                    Delete
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
