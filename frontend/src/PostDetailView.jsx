import React, { useEffect, useState } from 'react';
import './PostDetailView.css';

export default function PostDetailView({ postId, onBack, onSaveChange, userRole }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReaction, setUserReaction] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [reactionLoading, setReactionLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const token = localStorage.getItem('access_token');
  const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
      fetchReactionCounts();
      fetchUserReaction();
      fetchSaveStatus();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch post');
      
      const data = await response.json();
      setPost(data);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await fetch(`${API}/comments/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const fetchReactionCounts = async () => {
    try {
      const response = await fetch(`${API}/reactions/post/${postId}/counts`);
      
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.like_count);
        setDislikeCount(data.dislike_count);
      }
    } catch (err) {
      console.error('Error fetching reaction counts:', err);
    }
  };

  const fetchUserReaction = async () => {
    try {
      const response = await fetch(`${API}/reactions/post/${postId}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserReaction(data);
      }
    } catch (err) {
      console.error('Error fetching user reaction:', err);
    }
  };

  const fetchSaveStatus = async () => {
    try {
      const response = await fetch(`${API}/saved-posts/check/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.is_saved);
      }
    } catch (err) {
      console.error('Error fetching save status:', err);
    }
  };

  const handleSave = async () => {
    if (saveLoading) return;
    
    try {
      setSaveLoading(true);
      
      if (isSaved) {
        // Unsave the post
        const response = await fetch(`${API}/saved-posts/${postId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          setIsSaved(false);
          // Notify parent component about save change
          if (onSaveChange) onSaveChange();
        }
      } else {
        // Save the post
        const response = await fetch(`${API}/saved-posts/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            post_id: postId,
          }),
        });
        
        if (response.ok) {
          setIsSaved(true);
          // Notify parent component about save change
          if (onSaveChange) onSaveChange();
        }
      }
    } catch (err) {
      console.error('Error handling save:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleReaction = async (reactionType) => {
    if (reactionLoading) return;
    
    try {
      setReactionLoading(true);
      
      // If user already has this reaction, remove it
      if (userReaction && userReaction.reaction_type === reactionType) {
        const response = await fetch(`${API}/reactions/post/${postId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          setUserReaction(null);
          fetchReactionCounts();
        }
      } else {
        // Create or update reaction
        const response = await fetch(`${API}/reactions/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            post_id: postId,
            reaction_type: reactionType,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserReaction(data);
          fetchReactionCounts();
        }
      }
    } catch (err) {
      console.error('Error handling reaction:', err);
    } finally {
      setReactionLoading(false);
    }
  };

  const handleLike = () => handleReaction('like');
  const handleDislike = () => handleReaction('dislike');

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`${API}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: commentText,
          post_id: postId,
        }),
      });

      if (response.ok) {
        setCommentText('');
        fetchComments(); // Refresh comments
      } else {
        console.error('Failed to post comment');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const response = await fetch(`${API}/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete post');
      if (onBack) onBack();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (size) => {
    if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + ' MB';
    if (size >= 1024) return (size / 1024).toFixed(1) + ' KB';
    return size + ' B';
  };

  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-detail-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={onBack} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-container">
        <div className="error-container">
          <h2>Post not found</h2>
          <p>The post you're looking for doesn't exist.</p>
          <button onClick={onBack} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const liked = userReaction && userReaction.reaction_type === 'like';
  const disliked = userReaction && userReaction.reaction_type === 'dislike';

  return (
    <div className="post-detail-container">
      <div className="post-detail-header">
        <button onClick={onBack} className="back-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Channel
        </button>
      </div>

      <div className="post-detail-content">
        <article className="post-article">
          <header className="post-header">
            <h1 className="post-title">
              {post.title}
              {(userRole === 'moderator' || userRole === 'admin') && (
                <button onClick={handleDelete} style={{ color: 'red', marginLeft: 16, fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>Delete Post</button>
              )}
            </h1>
            <div className="post-meta">
              <div className="author-info">
                <div className="author-avatar"></div>
                <div>
                  <span className="author-name">
                    {post.author_username 
                      ? `@${post.author_username}` 
                      : post.author_email?.split('@')[0] || `User #${post.author_id}`
                    }
                  </span>
                  <span className="post-date">{formatDate(post.created_at)}</span>
                </div>
              </div>
              <button 
                className={`save-button ${isSaved ? 'saved' : ''}`}
                onClick={handleSave}
                disabled={saveLoading}
                title={isSaved ? 'Unsave post' : 'Save post'}
              >
                <svg viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </header>

          <div className="post-body">
            <div className="post-content">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {post.files && post.files.length > 0 && (
              <div className="post-attachments">
                <h3>Attachments</h3>
                <div className="attachments-grid">
                  {post.files.map((file) => (
                    <div key={file.id} className="attachment-card">
                      <div className="attachment-preview">
                        {file.mime_type?.startsWith('image/') ? (
                          <img 
                            src={`${API}/files/${file.filename}`} 
                            alt={file.filename.split('/').pop()}
                            className="attachment-image"
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
                      <div className="attachment-info">
                        <span className="file-name">{file.filename.split('/').pop()}</span>
                        <span className="file-size">{formatFileSize(file.size)}</span>
                        <a
                          href={`${API}/files/${file.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="download-link"
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

          <div className="post-actions">
            <div className="action-buttons">
              <button 
                className={`action-btn ${liked ? 'active' : ''}`}
                onClick={handleLike}
                disabled={reactionLoading}
              >
                <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-6 0v4" />
                  <rect x="2" y="9" width="20" height="12" rx="2" ry="2" />
                  <circle cx="12" cy="15" r="1" />
                </svg>
                <span>{likeCount}</span>
              </button>
              
              <button 
                className={`action-btn ${disliked ? 'active dislike' : ''}`}
                onClick={handleDislike}
                disabled={reactionLoading}
              >
                <svg viewBox="0 0 24 24" fill={disliked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" style={{transform: 'rotate(180deg)'}}>
                  <path d="M14 9V5a3 3 0 0 0-6 0v4" />
                  <rect x="2" y="9" width="20" height="12" rx="2" ry="2" />
                  <circle cx="12" cy="15" r="1" />
                </svg>
                <span>{dislikeCount}</span>
              </button>

              <button className="action-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>{comments.length}</span>
              </button>
            </div>
          </div>
        </article>

        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>
          
          <form onSubmit={handleComment} className="comment-form">
            <div className="comment-input-container">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="comment-input"
                rows="3"
              />
              <button type="submit" className="comment-submit" disabled={!commentText.trim()}>
                Post Comment
              </button>
            </div>
          </form>

          <div className="comments-list">
            {commentsLoading ? (
              <div className="loading-comments">Loading comments...</div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-avatar"></div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.author_username 
                          ? `@${comment.author_username}` 
                          : comment.author_email?.split('@')[0] || `User #${comment.author_id}`
                        }
                      </span>
                      <span className="comment-date">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
            {!commentsLoading && comments.length === 0 && (
              <div className="no-comments">No comments yet. Be the first to comment!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 