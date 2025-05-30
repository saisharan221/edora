import React, { useEffect, useState } from 'react';
import './App.css';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function ModeratorPanel() {
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [flaggedWords, setFlaggedWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('access_token');

  const fetchFlaggedPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/posts/flagged`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch flagged posts');
      setFlaggedPosts(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlaggedWords = async () => {
    setError('');
    try {
      const res = await fetch(`${API}/flagged-words/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch flagged words');
      setFlaggedWords(await res.json());
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchFlaggedPosts();
    fetchFlaggedWords();
    // eslint-disable-next-line
  }, []);

  const handleApprove = async (postId) => {
    setError('');
    try {
      const res = await fetch(`${API}/posts/${postId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to approve post');
      fetchFlaggedPosts();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeletePost = async (postId) => {
    setError('');
    try {
      const res = await fetch(`${API}/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete post');
      fetchFlaggedPosts();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API}/flagged-words/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ word: newWord }),
      });
      if (!res.ok) throw new Error('Failed to add word');
      setNewWord('');
      fetchFlaggedWords();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeleteWord = async (word) => {
    setError('');
    try {
      const res = await fetch(`${API}/flagged-words/${encodeURIComponent(word)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete word');
      fetchFlaggedWords();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="moderator-panel" style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <h2>Moderator Panel</h2>
      {error && <div className="error-container">{error}</div>}
      <div className="panel-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Flagged Posts */}
        <div className="panel">
          <h3>Flagged Posts</h3>
          {loading ? (
            <div>Loading...</div>
          ) : flaggedPosts.length === 0 ? (
            <div className="empty-state">No flagged posts</div>
          ) : (
            <ul className="item-list">
              {flaggedPosts.map((post) => (
                <li key={post.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div><b>Title:</b> {post.title}</div>
                  <div><b>Reason:</b> {post.flag_reason}</div>
                  <div><b>Content:</b> {post.content}</div>
                  <div style={{ marginTop: 8 }}>
                    <button className="dashboard-button" onClick={() => handleApprove(post.id)} style={{ marginRight: 8 }}>Approve</button>
                    <button className="dashboard-button secondary" onClick={() => handleDeletePost(post.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Flagged Words */}
        <div className="panel">
          <h3>Flagged Words</h3>
          <form onSubmit={handleAddWord} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              type="text"
              value={newWord}
              onChange={e => setNewWord(e.target.value)}
              placeholder="Add new word..."
              className="input"
              required
            />
            <button className="dashboard-button" type="submit">Add</button>
          </form>
          {flaggedWords.length === 0 ? (
            <div className="empty-state">No flagged words</div>
          ) : (
            <ul className="item-list">
              {flaggedWords.map((fw) => (
                <li key={fw.id} className="list-item" style={{ justifyContent: 'space-between' }}>
                  <span>{fw.word}</span>
                  <button className="dashboard-button secondary" onClick={() => handleDeleteWord(fw.word)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModeratorPanel; 