import './App.css';
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
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
import ChannelView from './ChannelView';
import PostDetailView from './PostDetailView';
import SavedPosts from './SavedPosts';
import ModeratorPanel from './ModeratorPanel';
import avatarImg from './assets/avatar.jpg';

function App() {
  const [activeScene, setActiveScene] = useState('auth');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [points, setPoints] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSearchedQuery, setLastSearchedQuery] = useState('');
  const [searchType, setSearchType] = useState('file');
  const [channelsVersion, setChannelsVersion] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Navigation state for channel and post views
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [previousScene, setPreviousScene] = useState(null);

  // New state for channels dropdown
  const [channelsDropdownOpen, setChannelsDropdownOpen] = useState(false);
  const [channelsView, setChannelsView] = useState('all'); // 'all' or 'your'
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Verify token is still valid
      verifyToken(token);
    } else {
      setActiveScene('auth');
      setIsAuthenticated(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUserRole(data.role || 'user');
        setActiveScene('home');
        // Fetch home page data
        fetchHomePageData();
      } else {
        // Token is invalid, clear storage and show auth
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        setIsAuthenticated(false);
        setUserRole('user');
        setActiveScene('auth');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_id');
      setIsAuthenticated(false);
      setUserRole('user');
      setActiveScene('auth');
    }
  };

  const fetchHomePageData = async () => {
    const token = localStorage.getItem('access_token');
    const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    try {
      // Fetch current user info
      const userResponse = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setCurrentUser(userData);
      }

      // Fetch saved documents
      const savedResponse = await fetch(`${API}/saved-posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (savedResponse.ok) {
        const savedData = await savedResponse.json();
        setSavedDocuments(savedData.slice(0, 5)); // Show only first 5
      }

      // Fetch all channels (as subscribed channels for now)
      const channelsResponse = await fetch(`${API}/channels/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (channelsResponse.ok) {
        const channelsData = await channelsResponse.json();
        setSubscribedChannels(channelsData.slice(0, 5)); // Show only first 5
      }

      // Fetch user points
      const pointsResponse = await fetch(`${API}/api/gamification/my-points`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (pointsResponse.ok) {
        const pointsData = await pointsResponse.json();
        setPoints(pointsData.points);
      }

      // Fetch leaderboard
      const leaderboardResponse = await fetch(`${API}/api/gamification/leaderboard?limit=5`);
      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json();
        // Transform the data to include a display name from username or email
        const transformedLeaderboard = leaderboardData.map((user, index) => ({
          id: user.user_id,
          name: user.username || user.email.split('@')[0], // Use username if available, otherwise email prefix
          email: user.email,
          username: user.username,
          points: user.points,
          rank: user.rank || index + 1
        }));
        setLeaderboard(transformedLeaderboard);
      }
    } catch (error) {
      console.error('Error fetching home page data:', error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActiveScene('home');
    // Fetch user role after login
    const token = localStorage.getItem('access_token');
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setUserRole(data.role || 'user'));
    }
    fetchHomePageData();
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    setIsAuthenticated(false);
    setActiveScene('auth');
  };

  const handleChannelClick = (channelId) => {
    setSelectedChannelId(channelId);
    setSelectedPostId(null);
    setActiveScene('channel-view');
  };

  const handlePostClick = (postId) => {
    setPreviousScene(activeScene);
    setSelectedPostId(postId);
    setActiveScene('post-view');
  };

  const handleBackToChannels = () => {
    setSelectedChannelId(null);
    setSelectedPostId(null);
    setActiveScene('channels');
  };

  const handleBackToChannel = () => {
    setSelectedPostId(null);
    setActiveScene('channel-view');
    setPreviousScene(null);
  };

  const handleBackToSaved = () => {
    setSelectedPostId(null);
    setActiveScene('saved');
    setPreviousScene(null);
  };

  const handleBackFromPost = () => {
    setSelectedPostId(null);
    if (previousScene === 'saved') {
      setActiveScene('saved');
    } else if (previousScene === 'channel-view') {
      setActiveScene('channel-view');
    } else {
      setActiveScene('channels');
    }
    setPreviousScene(null);
  };

  const handleUsernameClick = () => {
    setUsernameInput(currentUser?.username || '');
    setShowUsernameModal(true);
  };

  const updateUsername = async () => {
    if (!usernameInput.trim()) {
      alert('Username cannot be empty');
      return;
    }

    setIsUpdatingUsername(true);
    const token = localStorage.getItem('access_token');
    const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    try {
      const response = await fetch(`${API}/auth/username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: usernameInput.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(prev => ({ ...prev, username: data.username }));
        setShowUsernameModal(false);
        fetchHomePageData(); // Refresh data to update leaderboard
        alert('Username updated successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to update username: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Failed to update username. Please try again.');
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  // Show auth page if not authenticated
  if (!isAuthenticated || activeScene === 'auth') {
    return <Auth onLogin={handleLogin} />;
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const token = localStorage.getItem('access_token');
    const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    try {
      let results;
      if (searchType === 'file') {
        // Search posts (which contain files)
        const response = await fetch(`${API}/posts/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Search failed');
        results = await response.json();
      } else if (searchType === 'channel') {
        // Search channels (new endpoint)
        const response = await fetch(`${API}/channels/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Search failed');
        results = await response.json();
      }

      setSearchResults(results);
      setLastSearchedQuery(searchQuery);
      setActiveScene('result');
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed: ' + error.message);
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <img src="/edora-logo.svg" alt="Edora Logo" className="edora-logo" />
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
          {/* Moderator Panel (only for moderators/admins) */}
          {(userRole === 'moderator' || userRole === 'admin') && (
            <div
              role="button"
              className={`clickable-link ${activeScene === 'moderator' ? 'active' : ''}`}
              onClick={() => setActiveScene('moderator')}
            >
              <div className="link-content">
                <img src={settingImage} alt="moderator" className="icon" />
                <span>Moderator Panel</span>
              </div>
            </div>
          )}
          {/* Channels with dropdown */}
          <div>
            <div
              role="button"
              className={`clickable-link ${['channels','channel-view','post-view'].includes(activeScene) ? 'active' : ''}`}
              onClick={() => {
                setActiveScene('channels');
                setChannelsDropdownOpen((open) => !open);
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div className="link-content">
                <img src={channelImage} alt="channels" className="icon" />
                <span>Channels</span>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '1.1em', transition: 'transform 0.2s', transform: channelsDropdownOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>&#9654;</span>
            </div>
            {channelsDropdownOpen && (
              <div style={{ marginLeft: 36, marginTop: 4 }}>
                <div
                  role="button"
                  className={`clickable-link ${channelsView === 'your' ? 'active' : ''}`}
                  style={{ fontSize: '0.98em', padding: '6px 0 6px 10px' }}
                  onClick={() => { setChannelsView('your'); setActiveScene('channels'); }}
                >
                  Your Channels
                </div>
                <div
                  role="button"
                  className={`clickable-link ${channelsView === 'all' ? 'active' : ''}`}
                  style={{ fontSize: '0.98em', padding: '6px 0 6px 10px' }}
                  onClick={() => { setChannelsView('all'); setActiveScene('channels'); }}
                >
                  All Channels
                </div>
              </div>
            )}
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
            className={`clickable-link ${activeScene === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveScene('settings')}
          >
            <div className="link-content">
              <img src={settingImage} alt="settings" className="icon" />
              <span>Settings</span>
            </div>
          </div>
        </nav>

        <div className="bottom-links">
          {/* Create */}
          <div
            role="button"
            className={`clickable-link ${activeScene === 'create' ? 'active' : ''}`}
            onClick={() => setActiveScene('create')}
          >
            <div className="link-content">
              <img src={createImage} alt="create" className="icon" />
              <span>Create</span>
            </div>
          </div>
          {/* Logout */}
          <div
            role="button"
            className="clickable-link"
            onClick={handleLogout}
          >
            <div className="link-content">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </div>
          </div>
        </div>

        <div className="user-profile">
          {(userRole === 'moderator' || userRole === 'admin') && (
            <div className="moderator-label">Moderator</div>
          )}
          <div className="username-display" onClick={handleUsernameClick} style={{ cursor: 'pointer', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              {currentUser?.username ? `@${currentUser.username}` : 'Set username'}
            </span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {/* Filter controls at the top, next to sidebar */}
        {(activeScene === 'home' || activeScene === 'result') && (
          <div className="searchbar-row" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="segmented-toggle">
              <label className={searchType === 'file' ? 'selected' : ''}>
                <input
                  type="radio"
                  name="searchType"
                  value="file"
                  checked={searchType === 'file'}
                  onChange={(e) => setSearchType(e.target.value)}
                />
                Files
              </label>
              <label className={searchType === 'channel' ? 'selected' : ''}>
                <input
                  type="radio"
                  name="searchType"
                  value="channel"
                  checked={searchType === 'channel'}
                  onChange={(e) => setSearchType(e.target.value)}
                />
                Channels
              </label>
            </div>
            <div className="search-bar-container" style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Search for files, channels..."
                className="search-bar-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="search-bar-icon" onClick={handleSearch}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
            </div>
            {(activeScene === 'result') ? (
              <button 
                onClick={() => setActiveScene('home')}
                className="dashboard-button secondary refresh-btn"
                style={{ position: 'static', marginLeft: '8px', marginTop: 0 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            ) : (
              <button 
                onClick={fetchHomePageData}
                className="dashboard-button secondary refresh-btn"
                style={{ position: 'static', marginLeft: '8px', marginTop: 0 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4a9 9 0 0 1-14.85 3.36L23 14"/>
                </svg>
                Refresh
              </button>
            )}
          </div>
        )}

        {activeScene === 'home' && (
          <div className="home-container">
            {/* Header Section */}
            <div className="home-header">
              <div className="welcome-section">
                <h1 className="welcome-title">Welcome to Edora</h1>
                <p className="welcome-subtitle">Your collaborative document sharing platform</p>
              </div>
            </div>

            {/* Main actions + leaderboard row */}
            <div className="dashboard-main-row">
              <div className="dashboard-main-col">
                <h2 className="section-title">Quick Actions</h2>
                <div className="quick-actions-grid">
                  <div
                    className="action-card upload-card"
                    onClick={() => setActiveScene('upload')}
                  >
                    <div className="action-icon">
                      <img src={uploadImage} alt="upload" />
                    </div>
                    <h3>Upload Files</h3>
                    <p>Share your documents and files with the community</p>
                  </div>
                  <div
                    className="action-card create-card"
                    onClick={() => setActiveScene('create')}
                  >
                    <div className="action-icon">
                      <img src={createImage} alt="create" />
                    </div>
                    <h3>Create Channel</h3>
                    <p>Start a new channel for your community</p>
                  </div>
                  <div
                    className="action-card channels-card"
                    onClick={() => setActiveScene('channels')}
                  >
                    <div className="action-icon">
                      <img src={channelImage} alt="channels" />
                    </div>
                    <h3>Browse Channels</h3>
                    <p>Explore and join existing channels</p>
                  </div>
                  <div
                    className="action-card saved-card"
                    onClick={() => setActiveScene('saved')}
                  >
                    <div className="action-icon">
                      <img src={saveImage} alt="saved" />
                    </div>
                    <h3>Saved Posts</h3>
                    <p>Access your saved documents</p>
                  </div>
                </div>
                <div className="dashboard-content">
                  <div className="dashboard-grid">
                    {/* Saved Documents */}
                    <div className="dashboard-card saved-docs">
                      <div className="card-header">
                        <h3>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                          Saved Documents
                        </h3>
                        <span className="item-count">{savedDocuments.length}</span>
                      </div>
                      <div className="card-content">
                        {savedDocuments.length > 0 ? (
                          <>
                            <div className="item-list">
                              {savedDocuments.slice(0, 3).map((doc) => (
                                <div 
                                  key={doc.id}
                                  className="list-item"
                                  onClick={() => handlePostClick(doc.id)}
                                >
                                  <div className="item-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                      <path d="M14 2v6h6" />
                                    </svg>
                                  </div>
                                  <span className="item-title">{doc.title}</span>
                                </div>
                              ))}
                            </div>
                            {savedDocuments.length > 3 && (
                              <button 
                                onClick={() => setActiveScene('saved')}
                                className="view-all-btn"
                              >
                                View All ({savedDocuments.length})
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="empty-state">
                            <p>No saved documents yet</p>
                            <small>Save posts to see them here</small>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Your Stats (replacing Available Channels) */}
                    <div className="dashboard-card stats-card">
                      <div className="card-header">
                        <h3>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM19 4h-4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                          </svg>
                          Your Stats
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dashboard-leaderboard-col">
                <div className="leaderboard-card sticky-leaderboard">
                  <div className="your-points-section">
                    <div className="points-header">
                      <span>Your Points</span>
                      <button className="points-menu-btn">⋮</button>
                    </div>
                    <div className="points-avatar-progress">
                      <div className="points-avatar-ring">
                        <img src={avatarImg} alt="avatar" className="points-avatar" />
                      </div>
                      <div className="points-value">{points} Points</div>
                      <div className="points-desc">Continue Your Journey And Achieve Your Target</div>
                    </div>
                  </div>
                  <div className="leaderboard-list-section">
                    <div className="leaderboard-header-row">
                      <span>Leaderboard</span>
                      <button className="leaderboard-add-btn">+</button>
                    </div>
                    <div className="leaderboard-list-modern">
                      {leaderboard.map((user, idx) => (
                        <div className="leaderboard-modern-item" key={user.id}>
                          <span className="leaderboard-rank-badge">{idx + 1}</span>
                          <span className="leaderboard-modern-name">{user.name}</span>
                          <span className="leaderboard-modern-points">{typeof user.points === 'number' ? user.points : 0} Points</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="dashboard-card stats-card" style={{marginTop: '2rem'}}>
                  <div className="card-header">
                    <h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM19 4h-4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                      </svg>
                      Your Stats
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeScene === 'upload' && <Upload />}
        {activeScene === 'create' && (
          <Create onChannelCreated={() => setChannelsVersion(prev => prev + 1)} />
        )}
        {activeScene === 'channels' && (
          <Channels 
            key={channelsVersion} 
            onChannelClick={handleChannelClick}
            onCreateClick={() => setActiveScene('create')}
            view={channelsView}
            userRole={userRole}
          />
        )}
        {activeScene === 'channel-view' && selectedChannelId && (
          <ChannelView 
            channelId={selectedChannelId}
            onPostClick={handlePostClick}
            onBack={handleBackToChannels}
            userRole={userRole}
            currentUser={currentUser}
          />
        )}
        {activeScene === 'post-view' && selectedPostId && (
          <PostDetailView 
            postId={selectedPostId}
            onBack={handleBackFromPost}
            onSaveChange={fetchHomePageData}
            userRole={userRole}
          />
        )}
        {activeScene === 'saved' && (
          <SavedPosts 
            onPostClick={handlePostClick}
            onBack={() => setActiveScene('home')}
          />
        )}
        {activeScene === 'result' && (
          <Result
            searchQuery={lastSearchedQuery}
            searchType={searchType}
            results={searchResults}
            onBack={() => setActiveScene('home')}
            onChannelClick={(channelId) => {
              setSelectedChannelId(channelId);
              setSelectedPostId(null);
              setActiveScene('channel-view');
            }}
          />
        )}

        {/* Placeholder content for other scenes */}
        {activeScene === 'messages' && (
          <div className="placeholder-content">
            <h2>Messages</h2>
            <p>Message functionality coming soon...</p>
          </div>
        )}
        {activeScene === 'notifications' && (
          <div className="placeholder-content">
            <h2>Notifications</h2>
            <p>Notifications functionality coming soon...</p>
          </div>
        )}
        {activeScene === 'settings' && (
          <div className="placeholder-content">
            <h2>Settings</h2>
            <p>Settings functionality coming soon...</p>
          </div>
        )}
        {activeScene === 'moderator' && <ModeratorPanel />}
      </main>

      {/* Username Modal */}
      {showUsernameModal && (
        <div className="modal-overlay" onClick={() => setShowUsernameModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Set Your Username</h3>
              <button 
                className="modal-close"
                onClick={() => setShowUsernameModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Choose a username that other users will see on the leaderboard:</p>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter your username"
                maxLength={50}
                className="username-input"
                onKeyPress={(e) => e.key === 'Enter' && !isUpdatingUsername && updateUsername()}
              />
              <div className="modal-actions">
                <button 
                  onClick={() => setShowUsernameModal(false)}
                  className="modal-btn secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={updateUsername}
                  disabled={isUpdatingUsername}
                  className="modal-btn primary"
                >
                  {isUpdatingUsername ? 'Updating...' : 'Update Username'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
