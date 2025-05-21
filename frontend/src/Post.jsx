"use client"

import { useState } from "react"
import "./Post.css"

// Custom icon components
const ThumbsUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="metric-icon like-icon"
  >
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
)

const ThumbsDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="metric-icon dislike-icon"
  >
    <path d="M17 14V2" />
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
  </svg>
)

const MessageCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="metric-icon comment-icon"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="close-icon"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="action-icon"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
)

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="action-icon"
  >
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
)

const BookmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="action-icon"
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
)

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="send-icon"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
)

function Post({ post, onClose }) {
  const [newComment, setNewComment] = useState("")
  const [userLiked, setUserLiked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)
  const [userBookmarked, setUserBookmarked] = useState(false)

  // Mock comments data
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "NetworkStudent",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "This is exactly what I needed for my assignment! Thank you for sharing.",
      timestamp: "2 days ago",
      likes: 5,
    },
    {
      id: 2,
      author: "CiscoFan",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      content: "Could you explain more about the differences in header structure between IPv4 and IPv6?",
      timestamp: "1 day ago",
      likes: 2,
    },
    {
      id: 3,
      author: "TechGuru",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      content:
        "Great explanation of the pros and cons. I'd add that IPv6 also eliminates the need for NAT in most cases, which simplifies network architecture.",
      timestamp: "12 hours ago",
      likes: 8,
    },
  ])

  const handleLike = () => {
    if (userDisliked) {
      setUserDisliked(false)
    }
    setUserLiked(!userLiked)
  }

  const handleDislike = () => {
    if (userLiked) {
      setUserLiked(false)
    }
    setUserDisliked(!userDisliked)
  }

  const handleBookmark = () => {
    setUserBookmarked(!userBookmarked)
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const newCommentObj = {
      id: comments.length + 1,
      author: "You",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      content: newComment,
      timestamp: "Just now",
      likes: 0,
    }

    setComments([...comments, newCommentObj])
    setNewComment("")
  }

  // If no post is provided, don't render anything
  if (!post) return null

  return (
    <div className="post-overlay">
      <div className="post-container">
        <div className="post-header">
          <div className="post-title-section">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <div className="post-author">
                <img
                  src={`https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 70)}.jpg`}
                  alt={post.author}
                  className="author-avatar"
                />
                <span>{post.author}</span>
              </div>
              <div className="post-date">Posted on {new Date().toLocaleDateString()}</div>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="post-content">
          <div className="post-tags">
            <span className="tag tag-notes">Notes</span>
            <span className="tag tag-powerpoint">
              {post.fileName?.endsWith(".pdf")
                ? "Docs"
                : post.fileName?.endsWith(".pptx")
                  ? "Powerpoint"
                  : post.fileName?.endsWith(".docx")
                    ? "Assignment"
                    : post.fileName?.endsWith(".xlsx")
                      ? "Spreadsheet"
                      : "Lab"}
            </span>
          </div>

          <div className="file-info">
            <div className="file-icon">
              {post.fileName?.endsWith(".pdf")
                ? "P"
                : post.fileName?.endsWith(".pptx")
                  ? "P"
                  : post.fileName?.endsWith(".docx")
                    ? "W"
                    : post.fileName?.endsWith(".xlsx")
                      ? "X"
                      : "Z"}
            </div>
            <span className="file-name">{post.fileName}</span>
            <span className="file-size">2.4 MB</span>
          </div>

          <div className="post-description">
            <h3>Description</h3>
            <p>{post.description}</p>
          </div>

          <div className="post-preview">
            <h3>Preview</h3>
            <div className="preview-container">
              {post.fileName?.endsWith(".pdf") || post.fileName?.endsWith(".pptx") ? (
                <div className="document-preview">
                  <img
                    src={`/placeholder.svg?height=400&width=600&text=Preview+of+${post.fileName}`}
                    alt="Document Preview"
                  />
                </div>
              ) : (
                <div className="text-preview">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies
                    tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget
                    ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                  </p>
                  <p>
                    Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit
                    amet nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl
                    nisl sit amet nisl.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="post-actions">
            <div className="engagement-actions">
              <button
                className={`action-button like-button ${userLiked ? "active" : ""}`}
                onClick={handleLike}
                title="Like"
              >
                <ThumbsUpIcon />
                <span>{userLiked ? post.likes + 1 : post.likes}</span>
              </button>
              <button
                className={`action-button dislike-button ${userDisliked ? "active" : ""}`}
                onClick={handleDislike}
                title="Dislike"
              >
                <ThumbsDownIcon />
                <span>{userDisliked ? post.dislikes + 1 : post.dislikes}</span>
              </button>
            </div>
            <div className="utility-actions">
              <button className="action-button" title="Download">
                <DownloadIcon />
                <span>Download</span>
              </button>
              <button className="action-button" title="Share">
                <ShareIcon />
                <span>Share</span>
              </button>
              <button
                className={`action-button bookmark-button ${userBookmarked ? "active" : ""}`}
                onClick={handleBookmark}
                title="Bookmark"
              >
                <BookmarkIcon />
                <span>{userBookmarked ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>

          <div className="comments-section">
            <h3>Comments ({comments.length})</h3>
            <div className="comment-form">
              <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Your Avatar" className="comment-avatar" />
              <form onSubmit={handleSubmitComment}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" className="send-button">
                  <SendIcon />
                </button>
              </form>
            </div>

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <img src={comment.avatar || "/placeholder.svg"} alt={comment.author} className="comment-avatar" />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-time">{comment.timestamp}</span>
                    </div>
                    <p>{comment.content}</p>
                    <div className="comment-actions">
                      <button className="comment-like">
                        <ThumbsUpIcon />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="comment-reply">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
