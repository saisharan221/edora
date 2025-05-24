// frontend/src/Upload.jsx
import React, { useState, useEffect } from 'react';

const Upload = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/channels/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setChannels(data);
        if (data.length) setSelectedChannel(data[0].id);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    // 1️⃣ Create the Post
    const postRes = await fetch('http://127.0.0.1:8000/posts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        content: description || url,
        channel_id: selectedChannel,
      }),
    });

    if (!postRes.ok) {
      const err = await postRes.json();
      return alert(`Error creating post: ${JSON.stringify(err)}`);
    }

    const { id: post_id } = await postRes.json();

    // 2️⃣ Upload files if any
    if (files.length) {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));
      formData.append('post_id', post_id);

      const fileRes = await fetch('http://127.0.0.1:8000/files/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!fileRes.ok) {
        const err2 = await fileRes.json();
        return alert(`Error uploading files: ${JSON.stringify(err2)}`);
      }
    }

    alert('Post created successfully!');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container bg-white p-4 sm:p-8 lg:p-12 rounded-xl shadow"
    >
      <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 text-center mb-6">
        Create your own Post
      </h2>

      {/* Channel selector */}
      <div className="mt-4">
        <label htmlFor="channel" className="block font-semibold mb-1">
          Channel
        </label>
        <select
          id="channel"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value)}
          required
        >
          {channels.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.name}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div className="mt-4">
        <label htmlFor="title" className="block font-semibold mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Write your title here…"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* File upload */}
      <div className="mt-6">
        <strong className="font-semibold">Document Upload</strong>
        <p className="text-sm text-slate-600 mb-3">
          Add up to <span className="font-medium">5 files</span> (max 10 MB each)
        </p>
        <input
          type="file"
          multiple
          className="w-full rounded-md border border-dashed border-slate-400 p-4 text-sm"
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <p className="mt-1 text-xs text-slate-500">
          Only <span className="font-medium">.jpg, .png, .svg, .zip</span> files supported
        </p>
      </div>

      <hr className="my-8 border-slate-200" />

      {/* URL */}
      <div className="mt-4">
        <label htmlFor="url" className="block font-semibold mb-1">
          Upload from URL
        </label>
        <input
          id="url"
          type="text"
          placeholder="URL link here…"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="mt-4">
        <label htmlFor="desc" className="block font-semibold mb-1">
          Description
        </label>
        <textarea
          id="desc"
          placeholder="Write your description or question here…"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Upload
      </button>
    </form>
  );
};

export default Upload;
