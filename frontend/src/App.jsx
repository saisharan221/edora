import './App.css';
import React, { useState } from 'react'; // 🔹 Add useState
import upload from './assets/upload.jpg';
import Upload from './Upload'; // 🔹 Import your Upload component

function App() {
  const [activeScene, setActiveScene] = useState('home'); // 🔹 Track which scene is active

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">Edora</div>
        <nav className="nav-links">
          <div
            role="button"
            className="clickable-link active"
            onClick={() => setActiveScene('home')} // 🔹 Return to home scene
          >
            Home
          </div>
          <div role="button" className="clickable-link">Channels</div>
          <div role="button" className="clickable-link">Messages</div>
          <div role="button" className="clickable-link">Saved</div>
        </nav>
        <div className="bottom-links">
          <div role="button" className="clickable-link">Notifications</div>
          <div role="button" className="clickable-link">Settings</div>
          <div role="button" className="clickable-link">Support</div>
        </div>
        <div className="user-profile">
          <img
            src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
            alt="User"
            className="avatar"
          />
          <div>Welcome back 👋</div>
          <div className="username">Keenan</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <input className="search-bar" placeholder="Search your topic here..." />
          <button className="filter-btn">🔍</button>
        </header>

        {/* 🔹 Scene switch: if upload is active, show Upload component */}
        {activeScene === 'upload' ? (
          <Upload />
        ) : (
          <section className="dashboard">
            <div
              className="upload-box clickable-panel"
              onClick={() => setActiveScene('upload')} // 🔹 Trigger upload scene
            >
              <img src={upload} alt="Upload" />
              <h3>Upload Your Documents</h3>
              <p>Start helping others by uploading your own documents here!</p>
            </div>

            <div className="saved-docs">
              <h4>Your saved document</h4>
              <ul className="no-bullets">
                <li>Assignment 2 for 2DV608</li>
                <li>Manual for JMT file</li>
                <li>Help me with this assignment!!!</li>
              </ul>
            </div>

            <div className="subscribed">
              <h4>Subscribed Channel</h4>
            </div>

            <div className="recent-activity">
              <h4>Your Recent Activity</h4>
              <div className="activity">
                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Felix" />
                <div>
                  <strong>Felix</strong> has replied on<br />
                  <strong>At aliquam emin in cras arcu</strong>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labo...</p>
                </div>
              </div>
              <div className="activity">
                <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="Jonathon" />
                <div>
                  <strong>Jonathon</strong> has commented on<br />
                  <strong>Venenatis aliquam sit pellentesque...</strong>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labo...</p>
                </div>
              </div>
              <div className="activity">
                <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="Ludwig" />
                <div>
                  <strong>Ludwig</strong> has invited you to<br />
                  <strong>Imperdiet enim est, varius faucibus.</strong>
                  <p>📅 25th Sep. ⏰ 11.00 am</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App; 
