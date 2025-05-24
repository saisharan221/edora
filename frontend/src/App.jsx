import './App.css';
import React, { useState } from 'react';
import Login from './Login';               // ← our new Login component
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
import Channels from './Channels';




function App() {
  // if no token, start on the Login screen
  const [activeScene, setActiveScene] = useState(
    localStorage.getItem('access_token') ? 'home' : 'login'
  );
  const [points, setPoints] = useState(240);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('file');

  // show only the Login form until onLogin() is called
  if (activeScene === 'login') {
    return <Login onLogin={() => setActiveScene('home')} />;
  }

  const handleSearch = () => {
    console.log(`Searching for "${searchQuery}" in ${searchType}s`);
    setActiveScene('result');
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setActiveScene("login");
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <img src={edoraImage} alt="edora" className="edora-logo" />
        <nav className="nav-links">
          {/* Home */}
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
          {/* Channels */}
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
          {/* Messages */}
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
          {/* Saved */}
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
          {/* Notifications */}
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
          {/* Settings */}
        <div
          role="button"
          className={`clickable-link ${activeScene === "settings" ? "active" : ""}`}
          onClick={handleLogout}
        >
          <div className="link-content">
            <img src={settingImage} alt="logout" className="icon" />
            <span>Logout</span>
          </div>
        </div>
          {/* Support */}
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

{activeScene === 'channels' && <Channels />}
{activeScene === 'upload'   && <Upload />}
{activeScene === 'create'   && <Create />}
{activeScene === 'result'   && (
  <Result searchQuery={searchQuery} searchType={searchType} />
)}
{!['channels','upload','create','result'].includes(activeScene) && (
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
