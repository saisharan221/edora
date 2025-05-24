// src/Upload.jsx
import React, { useState, useEffect } from 'react';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');

  const token = localStorage.getItem('access_token');
  const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch channels on mount
  useEffect(() => {
    fetch(`${API}/channels/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setChannels(data);
        if (data.length > 0) setSelectedChannel(String(data[0].id));
      })
      .catch(console.error);
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

      const fileRes = await fetch(`${API}/files/upload`, {
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
        >
          <option value="" disabled>
            — Select a channel —
          </option>
          {channels.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.name}
            </option>
          ))}
        </select>
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
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Submit Post
      </button>
    </form>
  );
}
