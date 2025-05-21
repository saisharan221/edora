"use client"

import { useState } from "react"
import "./Result.css"
import Post from "./Post"

// Custom icon components to replace lucide-react
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

function Result({ searchQuery, searchType }) {
  const [selectedPost, setSelectedPost] = useState(null)

  // Expanded mock results with more content
  const searchResults = [
    {
      title: "1DV701 Powerpoint",
      fileName: "ipv4_vs_ipv6.pptx",
      description: "This slide explain the difference between IPv4 and IPv6. It talks further about each pros and cons",
      author: "John_123",
      likes: 10,
      dislikes: 2,
      comments: 3,
    },
    {
      title: "Teacher notes",
      fileName: "network_protocols.pdf",
      description:
        "Comprehensive notes on network protocols including TCP/IP, UDP, and HTTP. Includes examples and case studies.",
      author: "Prof_Smith",
      likes: 24,
      dislikes: 1,
      comments: 8,
    },
    {
      title: "1DV701 Assignment",
      fileName: "assignment2_solutions.docx",
      description:
        "Solutions for Assignment 2 covering network security principles and implementation of secure protocols.",
      author: "TA_Johnson",
      likes: 45,
      dislikes: 3,
      comments: 12,
    },
    {
      title: "Network Security Fundamentals",
      fileName: "security_basics.pdf",
      description:
        "Introduction to network security concepts including encryption, authentication, and access control mechanisms.",
      author: "SecurityPro",
      likes: 56,
      dislikes: 2,
      comments: 15,
    },
    {
      title: "OSI Model Explained",
      fileName: "osi_model.pptx",
      description:
        "Detailed explanation of the 7 layers of the OSI model with real-world examples and practical applications.",
      author: "NetworkGuru",
      likes: 78,
      dislikes: 5,
      comments: 22,
    },
    {
      title: "Wireshark Tutorial",
      fileName: "wireshark_tutorial.pdf",
      description:
        "Step-by-step guide to using Wireshark for network packet analysis and troubleshooting common network issues.",
      author: "PacketAnalyst",
      likes: 92,
      dislikes: 3,
      comments: 31,
    },
    {
      title: "Routing Protocols Comparison",
      fileName: "routing_protocols.docx",
      description:
        "Comparative analysis of different routing protocols including OSPF, BGP, EIGRP, and RIP with use cases.",
      author: "RouterConfig",
      likes: 41,
      dislikes: 4,
      comments: 17,
    },
    {
      title: "Subnetting Practice Problems",
      fileName: "subnetting_practice.xlsx",
      description:
        "Collection of subnetting practice problems with step-by-step solutions and explanations for CIDR notation.",
      author: "SubnetMaster",
      likes: 120,
      dislikes: 8,
      comments: 45,
    },
  ]

  // Top posts of the week - simplified to just title, author and like ratio
  const topPosts = [
    {
      title: "1DV701 Exam Prep",
      author: "StudyGroup42",
      likes: 87,
      dislikes: 4,
    },
    {
      title: "Subnetting Practice Problems",
      author: "SubnetMaster",
      likes: 120,
      dislikes: 8,
    },
    {
      title: "Wireshark Tutorial",
      author: "PacketAnalyst",
      likes: 92,
      dislikes: 3,
    },
    {
      title: "OSI Model Explained",
      author: "NetworkGuru",
      likes: 78,
      dislikes: 5,
    },
    {
      title: "Network Security Fundamentals",
      author: "SecurityPro",
      likes: 56,
      dislikes: 2,
    },
    {
      title: "Course Summary",
      author: "TopStudent",
      likes: 65,
      dislikes: 2,
    },
    {
      title: "TCP/IP Deep Dive",
      author: "NetworkPro",
      likes: 72,
      dislikes: 6,
    },
    {
      title: "Firewall Configuration Guide",
      author: "SecurityAdmin",
      likes: 68,
      dislikes: 3,
    },
  ]

  // Find the full post data for a top post when clicked
  const handleTopPostClick = (topPost) => {
    // Find the matching full post from searchResults
    const fullPost = searchResults.find((post) => post.title === topPost.title)

    // If found, use that, otherwise use the top post data
    setSelectedPost(fullPost || topPost)
  }

  // Post Card Component for search results
  const PostCard = ({ post }) => (
    <div className="post-card" onClick={() => setSelectedPost(post)}>
      <div className="post-header">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-tags">
          <span className="tag tag-notes">Notes</span>
          <span className="tag tag-powerpoint">
            {post.fileName.endsWith(".pdf")
              ? "Docs"
              : post.fileName.endsWith(".pptx")
                ? "Powerpoint"
                : post.fileName.endsWith(".docx")
                  ? "Assignment"
                  : post.fileName.endsWith(".xlsx")
                    ? "Spreadsheet"
                    : "Lab"}
          </span>
        </div>
      </div>

      <div className="file-info">
        <div className="file-icon">
          {post.fileName.endsWith(".pdf")
            ? "P"
            : post.fileName.endsWith(".pptx")
              ? "P"
              : post.fileName.endsWith(".docx")
                ? "W"
                : post.fileName.endsWith(".xlsx")
                  ? "X"
                  : "Z"}
        </div>
        <span className="file-name">{post.fileName}</span>
      </div>

      <p className="post-description">{post.description}</p>

      <div className="post-footer">
        <span className="author">By {post.author}</span>

        <div className="engagement-metrics">
          <div className="metric likes">
            <ThumbsUpIcon />
            <span>{post.likes}</span>
          </div>
          <div className="metric dislikes">
            <ThumbsDownIcon />
            <span>{post.dislikes}</span>
          </div>
          <div className="metric comments">
            <MessageCircleIcon />
            <span>{post.comments}</span>
          </div>
        </div>
      </div>
    </div>
  )

  // Top Post Item Component - simplified version with author
  const TopPostItem = ({ post }) => (
    <div className="top-post-item" onClick={() => handleTopPostClick(post)}>
      <div className="top-post-info">
        <div className="top-post-title">{post.title}</div>
        <div className="top-post-author">By {post.author}</div>
      </div>
      <div className="top-post-metrics">
        <div className="metric likes">
          <ThumbsUpIcon />
          <span>{post.likes}</span>
        </div>
        <div className="metric dislikes">
          <ThumbsDownIcon />
          <span>{post.dislikes}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="result-wrapper">
      {/* Search Results Section */}
      <section className="result-container">
        <div className="content-header">
          <h1 className="content-title">Search Results</h1>
        </div>

        <div className="posts-container">
          {searchResults.map((result, index) => (
            <PostCard key={index} post={result} />
          ))}
        </div>
      </section>

      {/* Top Posts Section - Simplified */}
      <section className="top-posts-container">
        <div className="content-header">
          <h1 className="content-title">Top Posts of the week</h1>
        </div>

        <div className="top-posts-box">
          <div className="top-posts-list">
            {topPosts.map((post, index) => (
              <TopPostItem key={index} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Post Detail View */}
      {selectedPost && <Post post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  )
}

export default Result
