// src/Create.jsx
import React, { useState } from "react";
import './Create.css';

export default function Create({ onChannelCreated }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // For preview
  const previewName = name || "Default Channel";
  const previewBio = bio || "Default Description";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Not authenticated");
      return;
    }
    // You may want to split tags by comma or space for backend
    const res = await fetch("http://127.0.0.1:8000/channels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ name, bio, tags }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.detail || "Failed to create channel");
    } else {
      setSuccess("Channel created!");
      setName("");
      setBio("");
      setTags("");
      onChannelCreated?.();
    }
  };

  return (
    <div className="create-channel-bg">
      <div className="create-channel-card create-channel-wide">
        <h1 className="create-channel-main-title" style={{marginTop: '0.5em', marginBottom: '0.2em'}}>Channel Creation</h1>
        <div className="create-channel-tagline">Establish your space by defining your channel's name and purpose.</div>
        <form onSubmit={handleSubmit} className="create-channel-form-2col">
          <div className="create-channel-row">
            <div className="create-channel-col title">
              <label className="create-channel-label">Title</label>
              <input
                className="create-channel-input outline"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Write your title here..."
                required
              />
            </div>
            <div className="create-channel-col tags">
              <label className="create-channel-label">Tags</label>
              <input
                className="create-channel-input outline"
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="Find you tags here"
              />
            </div>
          </div>
          <div className="create-channel-icons-row">
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%'}}>
              <label className="create-channel-label" style={{marginBottom: 8}}>Icon/Banner</label>
              <div className="create-channel-icons">
                <span className="create-channel-icon-placeholder" />
                <span className="create-channel-icon-placeholder" />
                <span className="create-channel-icon-placeholder" />
              </div>
            </div>
          </div>
          <div>
            <label className="create-channel-label">Description</label>
            <textarea
              className="create-channel-textarea outline"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Write your description or question here...."
              rows={5}
            />
          </div>
          <div className="create-channel-preview-label">Channel Preview</div>
          <div className="create-channel-preview-card">
            <div className="create-channel-preview-title">{previewName}</div>
            <div className="create-channel-preview-bio">{previewBio}</div>
            <div className="create-channel-preview-actions">
              <button type="button" className="create-channel-preview-join">Join</button>
              <button type="button" className="create-channel-preview-delete">Delete</button>
            </div>
          </div>
          {error && <div className="create-channel-error">{error}</div>}
          {success && <div className="create-channel-success">{success}</div>}
          <button type="submit" className="create-channel-btn-wide">Create your Channel</button>
        </form>
      </div>
    </div>
  );
}
