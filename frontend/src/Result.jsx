// src/Result.jsx
import React, { useState } from 'react';
import './Result.css';

function Result({ searchQuery, searchType }) {
  const mockResults = [
    { 
      fileName: `Lecture_Notes_${searchQuery}.pdf`,
      tag: 'Notes', className: 'notes',
      filePreview: "This document contains lecture notes covering...",
      channelName: "EduMaster Channel",
      likes: 10, dislikes: 2,
      comments: ["Great notes!", "Very helpful."]
    },
    { 
      fileName: `Final_Exam_${searchQuery}.pdf`,
      tag: 'Exam', className: 'test',
      filePreview: "This exam tests knowledge of fundamental concepts...",
      channelName: "ExamPrep Hub",
      likes: 7, dislikes: 1,
      comments: ["Challenging questions!", "Good for practice."]
    },
    { 
      fileName: `Lecture_Slides_${searchQuery}.pdf`,
      tag: 'Slides', className: 'slides',
      filePreview: "These slides summarize key points from the lecture...",
      channelName: "SlideMaster Academy",
      likes: 15, dislikes: 4,
      comments: ["Clear explanations!", "Perfect summary."]
    },
  ];

  const [hoveredComments, setHoveredComments] = useState(null);

  return (
    <section className="result-container">
      <h2>Search Results</h2>
      {searchQuery ? (
        <div className="result-list">
          {mockResults.map((result, i) => (
            <div key={i} className="result-item">
              
              {/* First Line: File Name & Tag */}
              <div className="result-title">
                <span>{result.fileName}</span>
                <span className={`result-tag ${result.className}`}>{result.tag}</span>
              </div>
              <div className="result-buttons">
                <button className="like-btn">👍 <span>{result.likes}</span></button>
              </div>

              {/* Second Line: File Preview */}
              <div className="result-preview">
                <span>{result.filePreview}</span>
              </div>
              <div className="result-buttons">
                <button className="dislike-btn">👎 <span>{result.dislikes}</span></button>
              </div>

              {/* Third Line: Channel Name & Comment Button */}
              <div className="result-channel">
                <span>{result.channelName}</span>
              </div>
              <div className="result-buttons">
                <button 
                  className="comment-btn"
                  onMouseEnter={() => setHoveredComments(result.comments)}
                  onMouseLeave={() => setHoveredComments(null)}
                >
                  💬 <span>{result.comments.length}</span>
                </button>
                {hoveredComments && (
                  <div className="comment-preview">
                    {hoveredComments.map((comment, index) => (
                      <p key={index}>{comment}</p>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <p>No search query entered.</p>
      )}
    </section>
  );
}

export default Result;
