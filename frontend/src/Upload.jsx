// src/Upload.jsx
import React, { useState, useEffect } from 'react';
import './Upload.css';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');

  const token = localStorage.getItem('access_token');
  const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Fetch channels on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log('Fetching channels...');
    
    fetch(`${API}/channels/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched channels:', data);
        setChannels(data);
        if (data.length > 0) {
          setSelectedChannel(String(data[0].id));
        } else {
          setError('You need to create a channel first before posting.');
        }
      })
      .catch(err => {
        console.error('Error fetching channels:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

    // Fetch username from backend
    if (token) {
      fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setUsername(data.username || 'yourusername'));
    }
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedChannel) {
      alert('Please select a channel');
      return;
    }

    // 1️⃣ Create the post
    const postRes = await fetch(`${API}/posts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        content: description,
        channel_id: Number(selectedChannel),
      }),
    });
    if (!postRes.ok) {
      const err = await postRes.json();
      alert('Error creating post: ' + (err.detail || postRes.statusText));
      return;
    }
    const post = await postRes.json();

    // 2️⃣ Upload files (if any)
    if (files.length > 0) {
      const form = new FormData();
      form.append('post_id', post.id);
      files.forEach((file) => form.append('files', file));

      const fileRes = await fetch(`${API}/api/files/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      if (!fileRes.ok) {
        const err = await fileRes.json();
        alert('Error uploading files: ' + (err.detail || fileRes.statusText));
        return;
      }
    }

    alert('Post created successfully!');
    // reset form
    setTitle('');
    setDescription('');
    setFiles([]);
  };

  if (loading) {
    return (
      <div className="container bg-white p-8 rounded-xl shadow max-w-xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your channels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container bg-white p-8 rounded-xl shadow max-w-xl mx-auto">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Channels</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {error.includes('create a channel') && (
            <button
              onClick={() => window.location.href = '/create'}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Channel
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="create-post-bg">
      <div className="create-post-card create-post-wide">
        <h1 className="create-post-main-title">Create a New Post</h1>
        <div className="create-post-tagline">Share your knowledge or questions with the community.</div>
        <form onSubmit={handleSubmit} className="create-post-form-2col">
          <div className="create-post-row">
            <div className="create-post-col title">
              <label className="create-post-label">Title</label>
              <input
                className="create-post-input outline"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Write your post title here..."
                required
              />
            </div>
            <div className="create-post-col channel">
              <label className="create-post-label">Channel</label>
              <select
                className="create-post-input outline"
                value={selectedChannel}
                onChange={e => setSelectedChannel(e.target.value)}
                required
              >
                <option value="" disabled>— Select a channel —</option>
                {channels.map((ch) => (
                  <option key={ch.id} value={ch.id}>{ch.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="create-post-files-row">
            <label className="create-post-label">Attachments</label>
            <input
              className="create-post-input outline"
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <div>
            <label className="create-post-label">Description</label>
            <textarea
              className="create-post-textarea outline"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Write your description or question here..."
              rows={5}
            />
          </div>
          <div className="create-post-preview-label">Post Preview</div>
          <div className="create-post-preview-card">
            <div className="create-post-preview-title">{title || 'Default Post Title'}</div>
            <div className="create-post-preview-bio">{description || 'Default post description.'}</div>
            <div className="create-post-preview-files">
              {files.length > 0 ? (
                <ul className="create-post-preview-files-list">
                  {files.map((file, idx) => (
                    <li key={idx} className="create-post-preview-file-item">
                      <span className="file-icon" role="img" aria-label="file">📎</span>
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="no-files">No files attached</span>
              )}
            </div>
            <div className="create-post-preview-user">
              <span className="avatar-circle">U</span>
              <span className="username">@{username}</span>
            </div>
          </div>
          {error && <div className="create-post-error">{error}</div>}
          <button type="submit" className="create-post-btn-wide">Create your Post</button>
        </form>
      </div>
    </div>
  );
}
