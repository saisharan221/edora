// src/Upload.jsx
import React, { useState, useEffect } from 'react';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <form
      onSubmit={handleSubmit}
      className="container bg-white p-4 sm:p-8 lg:p-12 rounded-xl shadow max-w-xl mx-auto"
    >
      <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 text-center mb-6">
        Create a New Post
      </h2>

      {/* Channel selector */}
      <div className="mb-4">
        <label htmlFor="channel" className="block font-semibold mb-1">
          Channel
        </label>
        <select
          id="channel"
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          required
        >
          <option value="" disabled>
            — Select a channel —
          </option>
          {channels.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.name} {ch.bio ? `(${ch.bio})` : ''}
            </option>
          ))}
        </select>
        {channels.length === 0 && (
          <p className="mt-2 text-sm text-gray-600">
            You haven't created any channels yet.{' '}
            <button
              type="button"
              onClick={() => window.location.href = '/create'}
              className="text-blue-600 hover:underline"
            >
              Create one now
            </button>
          </p>
        )}
      </div>

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title…"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="desc" className="block font-semibold mb-1">
          Description
        </label>
        <textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your description here…"
          rows={4}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {/* File upload */}
      <div className="mb-6">
        <label htmlFor="files" className="block font-semibold mb-1">
          Attach files
        </label>
        <input
          id="files"
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full"
        />
        <p className="mt-1 text-xs text-slate-500">
          Max 5 files, 10 MB each (jpg, png, svg, zip)
        </p>
      </div>

      <button
        type="submit"
        disabled={channels.length === 0}
        className={`w-full rounded-lg px-6 py-3 font-semibold text-white ${
          channels.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {channels.length === 0 ? 'Create a Channel First' : 'Submit Post'}
      </button>
    </form>
  );
}
