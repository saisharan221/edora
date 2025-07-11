import React, { useEffect, useState } from 'react';
import './ChannelView.css';

export default function ChannelView({ channelId, onPostClick, onBack, userRole, currentUser }) {
  const [channel, setChannel] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const token = localStorage.getItem('access_token');
  const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    if (channelId) {
      fetchChannelData();
      fetchChannelPosts();
    }
  }, [channelId]);

  useEffect(() => {
    if (channel) {
      setEditName(channel.name || "");
      setEditBio(channel.bio || "");
      setEditTags(channel.tags || "");
    }
  }, [channel]);

  const fetchChannelData = async () => {
    try {
      const response = await fetch(`${API}/channels/${channelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch channel');
      
      const data = await response.json();
      setChannel(data);
    } catch (err) {
      console.error('Error fetching channel:', err);
      setError(err.message);
    }
  };

  const fetchChannelPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/channels/${channelId}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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

  const handleLeave = async () => {
    setLeaving(true);
    try {
      const res = await fetch(`${API}/channels/${channelId}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to leave channel');
      onBack(); // Go back to channels list
    } catch (err) {
      alert(err.message);
    } finally {
      setLeaving(false);
    }
  };

  const canEdit = channel && (userRole === 'admin' || userRole === 'moderator' || (currentUser && channel.owner_id === currentUser.id));

  const handleEdit = () => {
    setEditing(true);
    setEditError("");
    setEditSuccess("");
  };

  const handleEditCancel = () => {
    setEditing(false);
    setEditError("");
    setEditSuccess("");
    setEditName(channel.name || "");
    setEditBio(channel.bio || "");
    setEditTags(channel.tags || "");
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");
    try {
      const res = await fetch(`${API}/channels/${channelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, bio: editBio, tags: editTags }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setEditError(body.detail || 'Failed to update channel');
      } else {
        setEditSuccess('Channel updated!');
        setEditing(false);
        fetchChannelData();
      }
    } catch (err) {
      setEditError('Failed to update channel');
    }
  };

  if (loading) {
    return (
      <div className="channel-view-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading channel posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="channel-view-container">
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
    <div className="channel-view-container">
      <div className="channel-header">
        <button onClick={onBack} className="back-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Channels
        </button>

        {channel && (
          <>
            <div className="channel-info">
              {editing ? (
                <form onSubmit={handleEditSave} style={{ marginBottom: 16, width: '100%' }}>
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
                  <input
                    className="create-channel-input outline"
                    style={{ marginBottom: 8, width: '100%' }}
                    value={editTags}
                    onChange={e => setEditTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                  />
                  {editError && <div className="create-channel-error">{editError}</div>}
                  {editSuccess && <div className="create-channel-success">{editSuccess}</div>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit" className="create-channel-btn" style={{ flex: 1 }}>Save</button>
                    <button type="button" className="create-channel-btn" style={{ flex: 1, background: '#eee', color: '#333' }} onClick={handleEditCancel}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="channel-title">{channel.name}</h1>
                  {channel.bio && <p className="channel-bio">{channel.bio}</p>}
                  <div className="channel-meta">
                    <span className="post-count">{posts.length} posts</span>
                    <span className="created-date">
                      Created {formatDate(channel.created_at)}
                    </span>
                  </div>
                  {canEdit && (
                    <button className="create-channel-btn" style={{ marginTop: 12 }} onClick={handleEdit}>
                      Edit Channel
                    </button>
                  )}
                </>
              )}
            </div>
            <button className="leave-channel-button" onClick={handleLeave} disabled={leaving}>
              {leaving ? 'Leaving...' : 'Leave Channel'}
            </button>
          </>
        )}
      </div>

      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
            <h3>No posts yet</h3>
            <p>This channel doesn't have any posts yet. Be the first to share something!</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <div
                key={post.id}
                className="post-card"
                onClick={() => onPostClick(post.id)}
              >
                <div className="post-header">
                  <h3 className="post-title">{post.title}</h3>
                  <span className="post-date">{formatDate(post.created_at)}</span>
                </div>
                
                <div className="post-content">
                  <p className="post-excerpt">
                    {post.content.length > 150 
                      ? post.content.substring(0, 150) + '...' 
                      : post.content
                    }
                  </p>
                </div>

                {post.files && post.files.length > 0 && (
                  <div className="post-attachments">
                    <svg className="attachment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                    <span>{post.files.length} attachment{post.files.length !== 1 ? 's' : ''}</span>
                  </div>
                )}

                <div className="post-footer">
                  <div className="post-author">
                    <div className="author-avatar"></div>
                    <span>
                      {post.author_username 
                        ? `@${post.author_username}` 
                        : post.author_email?.split('@')[0] || `User #${post.author_id}`
                      }
                    </span>
                  </div>
                  
                  <div className="post-actions">
                    <button className="action-button">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 9V5a3 3 0 0 0-6 0v4" />
                        <rect x="2" y="9" width="20" height="12" rx="2" ry="2" />
                        <circle cx="12" cy="15" r="1" />
                      </svg>
                    </button>
                    <span className="read-more">Click to read more</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 