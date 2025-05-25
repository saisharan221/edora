import React from 'react';
import './PostDetail.css';

function PostDetail({ post, onClose }) {
  const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  if (!post) return null;

  return (
    <div className="post-detail-panel">
      <div className="post-detail-header">
        <button className="back-button" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Search Results
        </button>
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-meta">
          <span className="post-date">
            Posted on {new Date(post.created_at).toLocaleDateString()}
          </span>
          {post.files && post.files.length > 0 && (
            <span className="post-files-count">
              {post.files.length} file{post.files.length !== 1 ? 's' : ''} attached
            </span>
          )}
        </div>
      </div>

      <div className="post-detail-content">
        <div className="post-content">
          {post.content}
        </div>

        {post.files && post.files.length > 0 && (
          <div className="post-files-section">
            <h2>Attached Files</h2>
            <div className="post-files-grid">
              {post.files.map((file) => (
                <div key={file.id} className="file-card">
                  <div className="file-preview">
                    {file.mime_type?.startsWith('image/') ? (
                      <img 
                        src={`${API}/files/${file.filename}`} 
                        alt={file.filename.split('/').pop()}
                        className="file-preview-image"
                      />
                    ) : file.mime_type === 'application/pdf' ? (
                      <iframe
                        src={`${API}/files/${file.filename}`}
                        title={file.filename.split('/').pop()}
                        className="file-preview-pdf"
                        width="100%"
                        height="200px"
                        style={{ border: 'none', borderRadius: '8px' }}
                      />
                    ) : (
                      <div className="file-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path d="M14 2v6h6" />
                          <path d="M16 13H8" />
                          <path d="M16 17H8" />
                          <path d="M10 9H8" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="file-info">
                    <span className="file-name">{file.filename.split('/').pop()}</span>
                    <span className="file-size">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <a
                      href={`${API}/files/${file.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-button"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetail; 