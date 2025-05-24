// Upload.jsx
import React from 'react';
import './Upload.css';

const Upload = () => {
  return (
    <div className="upload-container">
      <h2 className="upload-title">Create your own Post</h2>

      <div className="upload-section">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" placeholder="Write your title here..." />
      </div>

      <div className="upload-section">
        <strong>Document Upload</strong>
        <p>Add your documents here, and you can upload up to 5 files max</p>
        <div className="upload-box">
          <span>Drag your file(s) or <a href="/">browse</a></span>
          <p>Max 10 MB files are allowed</p>
        </div>
        <p className="upload-note">Only support .jpg, .png and .svg and zip files</p>
      </div>

      <hr className="upload-separator" />

      <div className="upload-section">
        <label htmlFor="url">Upload from URL</label>
        <input type="text" id="url" placeholder="URL link here..." />
      </div>

      <div className="upload-section">
        <label htmlFor="desc">Description</label>
        <textarea id="desc" placeholder="Write your description or question here..." />
      </div>

      <button className="upload-btn">Upload</button>
    </div>
  );
};

export default Upload;
