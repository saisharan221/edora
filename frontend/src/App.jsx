import './App.css';
import React, { useState } from 'react';
import uploadImage from './assets/upload.jpg';
import edoraImage from './assets/edora.png';
import homeImage from './assets/dashboard.png';
import channelImage from './assets/channel.png';
import messageImage from './assets/message.png';
import saveImage from './assets/save.png';
import notificationImage from './assets/notification.png';
import settingImage from './assets/setting.png';
import supportImage from './assets/support.png';
import coinsImage from './assets/coins.png';
import createImage from './assets/create.png';
import Upload from './Upload';
import Create from './Create';
import Result from './Result';

function App() {
  const [activeScene, setActiveScene] = useState('home');
  const [points, setPoints] = useState(240);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('file');

  const handleSearch = () => {
    console.log(`Searching for "${searchQuery}" in ${searchType}s`);
    setActiveScene('result');
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <img src={edoraImage} alt="edora" className="edora-logo" />
        <nav className="nav-links">
          <div
            role="button"
            className={`clickable-link ${activeScene === 'home' ? 'active' : ''}`}
            onClick={() => setActiveScene('home')}
          >
            <div className="link-content">
              <img src={homeImage} alt="dashboard" className="icon" />
              <span>Home</span>
            </div>
          </div>

          <div
            role="button"
            className={`clickable-link ${activeScene === 'channels' ? 'active' : ''}`}
            onClick={() => setActiveScene('channels')}
          >
            <div className="link-content">
              <img src={channelImage} alt="channels" className="icon" />
              <span>Channels</span>
            </div>
          </div>

          <div
            role="button"
            className={`clickable-link ${activeScene === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveScene('messages')}
          >
            <div className="link-content">
              <img src={messageImage} alt="messages" className="icon" />
              <span>Messages</span>
            </div>
          </div>

          <div
            role="button"
            className={`clickable-link ${activeScene === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveScene('saved')}
          >
            <div className="link-content">
              <img src={saveImage} alt="saved" className="icon" />
              <span>Saved</span>
            </div>
          </div>
        </nav>

        <div className="bottom-links">
          <div
            role="button"
            className={`clickable-link ${activeScene === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveScene('notifications')}
          >
            <div className="link-content">
              <img src={notificationImage} alt="notifications" className="icon" />
              <span>Notifications</span>
            </div>
          </div>

          <div
            role="button"
            className={`clickable-link ${activeScene === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveScene('settings')}
          >
            <div className="link-content">
              <img src={settingImage} alt="settings" className="icon" />
              <span>Settings</span>
            </div>
          </div>

          <div
            role="button"
            className={`clickable-link ${activeScene === 'support' ? 'active' : ''}`}
            onClick={() => setActiveScene('support')}
          >
            <div className="link-content">
              <img src={supportImage} alt="support" className="icon" />
              <span>Support</span>
            </div>
          </div>
        </div>

        <div className="user-profile">
          <img
            src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
            alt="User"
            className="avatar"
          />
          <div className="points-display">
            <img src={coinsImage} alt="coins" className="coins-icon" />
            <span>{points} points</span>
          </div>
          <div className="username">Keenan</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="header flex items-center gap-2">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden flex-1 bg-white">
            <select
              className="appearance-none px-3 py-2 text-sm border-r border-gray-200 focus:outline-none bg-white"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="file">File</option>
              <option value="channel">Channel</option>
            </select>

            <input
              type="text"
              className="flex-grow px-4 py-2 focus:outline-none"
              placeholder={`Search by ${searchType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              className="bg-purple-600 text-white px-4 py-2 hover:bg-purple-700 transition focus:outline-none"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </header>

        {/* 🔁 Scene-based rendering */}
        {activeScene === 'upload' ? (
          <Upload />
        ) : activeScene === 'create' ? (
          <Create />
        ) : activeScene === 'result' ? (
          <Result searchQuery={searchQuery} searchType={searchType} />
        ) : (
          <section className="dashboard">
            <div className="subscribed">
              <div
                className="upload-box clickable-panel"
                onClick={() => setActiveScene('create')}
              >
                <img src={createImage} alt="create channel" />
                <h3>Create Your Channel</h3>
                <p>Build your own community and start sharing content now!</p>
              </div>
            </div>

            <div
              className="upload-box clickable-panel"
              onClick={() => setActiveScene('upload')}
            >
              <img src={uploadImage} alt="upload" />
              <h3>Upload Your Documents</h3>
              <p>Start helping others by uploading your own documents here!</p>
            </div>

            <div className="recent-activity">
              <h4>Your Recent Activity</h4>
              <div className="activity">
                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Felix" />
                <div>
                  <strong>Felix</strong> has replied on<br />
                  <strong>At aliquam emin in cras arcu</strong>
                  <p>Lorem ipsum dolor sit amet...</p>
                </div>
              </div>
              <div className="activity">
                <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="Jonathon" />
                <div>
                  <strong>Jonathon</strong> has commented on<br />
                  <strong>Venenatis aliquam sit pellentesque...</strong>
                  <p>Lorem ipsum dolor sit amet...</p>
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

            <div className="saved-docs">
              <h4>Your saved document</h4>
              <ul className="no-bullets">
                <li>Assignment 2 for 2DV608</li>
                <li>Manual for JMT file</li>
                <li>Help me with this assignment!!!</li>
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
