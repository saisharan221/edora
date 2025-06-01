import React, { useEffect, useState } from 'react';
import './ModeratorPanel.css';

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
    <div className="moderator-panel">
      <h2>Moderator Panel</h2>
      {error && <div className="error-container">{error}</div>}
      <div className="panel-grid">
        {/* Flagged Posts */}
        <div className="panel">
          <h3>Flagged Posts</h3>
          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : flaggedPosts.length === 0 ? (
            <div className="empty-state">
              <p>No flagged posts</p>
            </div>
          ) : (
            <div>
              {flaggedPosts.map((post) => (
                <div key={post.id} className="flagged-post">
                  <div className="flagged-post-title">{post.title}</div>
                  <div className="flagged-post-content">{post.content}</div>
                  <div className="flagged-post-reason">Flagged: {post.flag_reason}</div>
                  <div className="post-actions">
                    <button className="approve-button" onClick={() => handleApprove(post.id)}>
                      Approve
                    </button>
                    <button className="delete-button" onClick={() => handleDeletePost(post.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flagged Words */}
        <div className="panel">
          <h3>Flagged Words</h3>
          <form onSubmit={handleAddWord} className="flagged-words-form">
            <input
              type="text"
              value={newWord}
              onChange={e => setNewWord(e.target.value)}
              placeholder="Add new word..."
              className="flagged-words-input"
              required
            />
            <button className="add-button" type="submit">Add</button>
          </form>
          {flaggedWords.length === 0 ? (
            <div className="empty-state">
              <p>No flagged words</p>
            </div>
          ) : (
            <div>
              {flaggedWords.map((fw) => (
                <div key={fw.id} className="flagged-word-item">
                  <span className="flagged-word-text">{fw.word}</span>
                  <button className="delete-button" onClick={() => handleDeleteWord(fw.word)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModeratorPanel; 