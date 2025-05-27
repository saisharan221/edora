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
      className="max-w-xl mx-auto"
      style={{
        padding: 0,
        marginTop: 0,
        marginBottom: 56,
        position: 'relative',
      }}
    >
      <div style={{
        background: 'linear-gradient(135deg, #6d7fc9 0%, #6a5fc7 100%)',
        padding: '2rem 0 1.5rem 0',
        textAlign: 'center',
        marginBottom: 0,
        marginTop: 0,
      }}>
        <h2 style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#fff',
          margin: 0,
          marginBottom: 6,
          letterSpacing: 0.5,
          textShadow: '0 2px 12px rgba(106,95,199,0.13)'
        }}>
          Create a New Post
        </h2>
      </div>

      <div style={{ padding: '2.5rem 2.5rem 2.5rem 2.5rem', display: 'flex', flexDirection: 'column', gap: 32, background: 'none', boxShadow: 'none' }}>
        <div style={{ position: 'relative', marginBottom: 0 }}>
          <select
            id="channel"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="w-full edora-upload-input"
            style={{
              background: 'rgba(245,245,255,0.85)',
              color: '#22223b',
              border: '1.5px solid #dbeafe',
              borderRadius: 14,
              padding: '2.3rem 1rem 0.6rem 1rem',
              fontSize: '1.08rem',
              fontWeight: 500,
              outline: 'none',
              boxShadow: '0 1.5px 8px rgba(60, 120, 240, 0.04)',
              transition: 'border-color 0.2s',
              marginBottom: 0
            }}
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
          <label htmlFor="channel" style={{
            position: 'absolute',
            left: 18,
            top: 8,
            fontSize: '0.98rem',
            color: '#6a5fc7',
            fontWeight: 600,
            pointerEvents: 'none',
            background: 'rgba(255,255,255,0.85)',
            padding: '0 6px',
            borderRadius: 8,
            zIndex: 2
          }}>
            Channel
          </label>
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

        <div style={{ position: 'relative', marginBottom: 0 }}>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder=" "
            required
            className="w-full edora-upload-input"
            style={{
              background: 'rgba(245,245,255,0.85)',
              color: '#22223b',
              border: '1.5px solid #dbeafe',
              borderRadius: 14,
              padding: '2.3rem 1rem 0.6rem 1rem',
              fontSize: '1.08rem',
              fontWeight: 500,
              outline: 'none',
              boxShadow: '0 1.5px 8px rgba(60, 120, 240, 0.04)',
              transition: 'border-color 0.2s',
              marginBottom: 0
            }}
          />
          <label htmlFor="title" style={{
            position: 'absolute',
            left: 18,
            top: 8,
            fontSize: '0.98rem',
            color: '#6a5fc7',
            fontWeight: 600,
            pointerEvents: 'none',
            background: 'rgba(255,255,255,0.85)',
            padding: '0 6px',
            borderRadius: 8,
            zIndex: 2
          }}>
            Title
          </label>
        </div>

        <div style={{ position: 'relative', marginBottom: 0 }}>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder=" "
            rows={4}
            required
            className="w-full edora-upload-input"
            style={{
              background: 'rgba(245,245,255,0.85)',
              color: '#22223b',
              border: '1.5px solid #dbeafe',
              borderRadius: 14,
              padding: '2.3rem 1rem 0.6rem 1rem',
              fontSize: '1.08rem',
              fontWeight: 500,
              outline: 'none',
              boxShadow: '0 1.5px 8px rgba(60, 120, 240, 0.04)',
              transition: 'border-color 0.2s',
              marginBottom: 0
            }}
          />
          <label htmlFor="desc" style={{
            position: 'absolute',
            left: 18,
            top: 8,
            fontSize: '0.98rem',
            color: '#6a5fc7',
            fontWeight: 600,
            pointerEvents: 'none',
            background: 'rgba(255,255,255,0.85)',
            padding: '0 6px',
            borderRadius: 8,
            zIndex: 2
          }}>
            Description
          </label>
        </div>

        <div style={{ position: 'relative', marginBottom: 0 }}>
          <input
            id="files"
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full edora-upload-input"
            style={{
              background: 'rgba(245,245,255,0.85)',
              color: '#22223b',
              border: '1.5px solid #dbeafe',
              borderRadius: 14,
              padding: '2.3rem 1rem 0.6rem 1rem',
              fontSize: '1.08rem',
              fontWeight: 500,
              outline: 'none',
              boxShadow: '0 1.5px 8px rgba(60, 120, 240, 0.04)',
              transition: 'border-color 0.2s',
              marginBottom: 0
            }}
          />
          <label htmlFor="files" style={{
            position: 'absolute',
            left: 18,
            top: 8,
            fontSize: '0.98rem',
            color: '#6a5fc7',
            fontWeight: 600,
            pointerEvents: 'none',
            background: 'rgba(255,255,255,0.85)',
            padding: '0 6px',
            borderRadius: 8,
            zIndex: 2
          }}>
            Attach files
          </label>
          <p className="mt-1 text-xs" style={{ color: '#6a5fc7', marginTop: 8 }}>
            Max 5 files, 10 MB each (jpg, png, svg, zip)
          </p>
        </div>

        <button
          type="submit"
          disabled={channels.length === 0}
          className="edora-upload-submit-btn"
          style={{
            width: '100%',
            borderRadius: 18,
            padding: '1.15rem 0',
            fontWeight: 800,
            fontSize: '1.18rem',
            color: '#fff',
            background: channels.length === 0
              ? 'linear-gradient(90deg, #bdbdbd 0%, #c7c7c7 100%)'
              : 'linear-gradient(90deg, #6d7fc9 0%, #6a5fc7 100%)',
            cursor: channels.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: channels.length === 0 ? 'none' : '0 8px 32px 0 rgba(123,47,242,0.13)',
            border: '2px solid #dbeafe',
            marginTop: 18,
            letterSpacing: 0.7,
            transition: 'all 0.18s cubic-bezier(.4,2,.3,1)'
          }}
          onMouseOver={e => {
            if (!channels.length) return;
            e.currentTarget.style.background = 'linear-gradient(90deg, #6d7fc9 0%, #5a6edc 100%)';
            e.currentTarget.style.transform = 'scale(1.045)';
            e.currentTarget.style.boxShadow = '0 12px 36px 0 rgba(106,95,199,0.18), 0 0 12px 2px #6d7fc9';
            e.currentTarget.style.borderColor = '#6d7fc9';
            e.currentTarget.style.textShadow = '0 2px 12px #6d7fc9cc';
          }}
          onMouseOut={e => {
            if (!channels.length) return;
            e.currentTarget.style.background = 'linear-gradient(90deg, #6d7fc9 0%, #6a5fc7 100%)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(123,47,242,0.13)';
            e.currentTarget.style.borderColor = '#dbeafe';
            e.currentTarget.style.textShadow = 'none';
          }}
        >
          {channels.length === 0 ? 'Create a Channel First' : 'Submit Post'}
        </button>
      </div>
    </form>
  );
}
