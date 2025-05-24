// Upload.jsx
import React, { useState, useRef } from 'react';
import './Upload.css';

const Upload = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [desc, setDesc] = useState('')
  const [status, setStatus] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('❌ Please choose a file to upload.');
      return;
    }

    const formData = new FormData();
    // keys must match FastAPI param
    formData.append('file', file);
    formData.append('title', title);
    formData.append('url', url);
    formData.append('desc', desc);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus(`✅ ${result.message} (${result.filename})`);
      } else {
        setStatus(`❌ Upload failed: ${result.detail}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Create your own Post</h2>

      <div className="upload-section">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Write your title here..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="upload-section">
        <strong>Document Upload</strong>
        <p>Add your documents here, and you can upload up to 5 files max</p>
        <div className="upload-box">
          <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }} // optional: hide the input
          />
          <span>Drag your file(s) or {" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();         // prevent page reload
                fileInputRef.current.click(); // trigger file input
              }}
            >
              browse
            </a>
          </span>
          <p>Max 10 MB files are allowed</p>
        </div>
        {file && (
          <p className="selected-file">
            Selected file: <strong>{file.name}</strong>
          </p>
        )}
        <p className="upload-note">Only support .jpg, .png and .svg and zip files</p>
      </div>

      <hr className="upload-separator" />

      <div className="upload-section">
        <label htmlFor="url">Upload from URL</label>
        <input
          type="text"
          id="url"
          placeholder="URL link here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className="upload-section">
        <label htmlFor="desc">Description</label>
        <textarea
          id="desc"
          placeholder="Write your description or question here..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <button className="upload-btn" onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;
