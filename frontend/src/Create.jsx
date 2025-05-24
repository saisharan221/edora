// Create.jsx
import React from 'react';
import './Create.css';

const Create = () => {
  return (
    <div className="create-container">
      <h2 className="create-title">Create Your Channel</h2>

      <div className="create-section">
        <label htmlFor="channel-name">Channel Name</label>
        <input type="text" id="channel-name" placeholder="Enter your channel name..." />
      </div>

      <div className="create-section">
        <label htmlFor="channel-bio">Channel Bio</label>
        <textarea id="channel-bio" placeholder="Describe your channel, goals, and content..." />
      </div>

      <div className="create-section">
        <strong>Upload Channel Logo</strong>
        <p>Upload an image to represent your channel</p>
        <div className="create-box">
          <span>Drag your logo file or <a href="/">browse</a></span>
          <p>Max 5 MB. Recommended: 1:1 ratio image (e.g. 300x300 px)</p>
        </div>
        <p className="create-note">Supported formats: .jpg, .png, .svg</p>
      </div>

      <hr className="create-separator" />

      <div className="create-section">
        <label htmlFor="channel-tags">Channel Tags</label>
        <input type="text" id="channel-tags" placeholder="e.g. education, gaming, design..." />
      </div>

      <button className="create-btn">Create Channel</button>
    </div>
  );
};

export default Create;
