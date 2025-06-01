# Edora: Educational Document Repository Application

A full-stack web application for educational document sharing and collaboration, built with FastAPI (Python), React (JavaScript), and Redis.

## Features

- **User Authentication** - JWT-based secure login/registration
- **Document Management** - Upload, organize, and share files
- **Channel System** - Topic-based content organization
- **Social Features** - Comments, reactions, and saved posts
- **Gamification** - Points system and leaderboards
- **Content Moderation** - Automated flagging and manual review
- **Search Functionality** - Find documents and channels

## Prerequisites

Install the following software:

| Tool | Version | Download |
|------|---------|----------|
| **Docker Desktop** | Latest | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **Python** | 3.11+ | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |

## Quick Start

1. **Extract and setup**:
```bash
unzip edora-source.zip
cd edora
chmod +x setup.sh && ./setup.sh
```

2. **Run the application**:
```bash
docker-compose up --build -d
```

3. **Access the application**:
- **Frontend**: http://localhost:5173
- **API Documentation**: http://localhost:8000/docs


4. **Stop the application**:
```bash
docker-compose down
```

## Default User Accounts

For testing purposes, the application comes with pre-configured users and educational content:

### Admin User
- **Email**: `moderator@example.com`
- **Password**: `moderator`
- **Role**: Administrator (full access to all features)

### Normal User
- **Email**: `user@edora.com`
- **Password**: `user123`
- **Role**: Regular user (standard features)

### Additional Test Users
- **Professor**: `professor@university.edu` / `prof123`
- **Student**: `student@university.edu` / `student123`
- **Researcher**: `researcher@institute.org` / `research123`

### Pre-loaded Educational Content
The application includes 6 educational channels with relevant content:
- **Computer Science** - Programming, algorithms, software engineering
- **Mathematics** - Calculus, linear algebra, statistics
- **Physics** - Classical mechanics, electromagnetism, quantum physics
- **Biology** - Cell biology, genetics, ecology
- **Chemistry** - Organic chemistry, atomic structure, thermodynamics
- **Study Tips & Resources** - Academic success strategies

Each channel contains 3 detailed educational posts written by different users, demonstrating the collaborative nature of the platform.

### Creating New Users
You can also register new users directly through the application:
1. Go to http://localhost:5173
2. Click "Register" 
3. Fill in the registration form
4. Start using the application immediately

## Testing Guide

This section provides step-by-step instructions to test all major features of the application.

###  Authentication & User Management
1. **Registration**: Create a new account at http://localhost:5173
2. **Login**: Use any of the default accounts listed above
3. **Profile**: View user profile and points in the dashboard
4. **Logout**: Use the logout button in the navigation

###  Channel Management
1. **View Channels**: Browse the 6 pre-loaded educational channels
2. **Create Channel**: Click "+" button, fill in name and description
3. **Join Channels**: Click "Join" on any channel to participate
4. **Channel Posts**: View posts within each channel

###  Document & Post Management
1. **Create Post**: 
   - Click "Upload" in navigation
   - Fill in title, content, select channel
   - Optionally attach files (PDF, images, documents)
   - Submit to create post
2. **View Posts**: Click on any post to see full details
3. **Edit Posts**: Authors can edit their own posts
4. **Delete Posts**: Authors and moderators can delete posts

###  Social Features
1. **Comments**: 
   - Open any post detail view
   - Add comments at the bottom
   - View threaded discussions
2. **Reactions**: 
   - Like/dislike posts using thumb icons
   - See reaction counts update in real-time
3. **Save Posts**: 
   - Use bookmark icon to save interesting posts
   - Access saved posts from your profile

###  Gamification System
1. **Earn Points**: 
   - Create posts (+10 points)
   - Write comments (+5 points)
   - Receive likes (+1 point each)
2. **Leaderboard**: View top users by points in dashboard
3. **Point History**: Check your point transactions in profile

###  Search & Discovery
1. **Search Posts**: Use search bar to find posts by title/content
2. **Browse Channels**: Explore different subject areas
3. **Filter Content**: Navigate by channel categories

###  Moderation Features (Admin/Moderator Only)
1. **Login as Moderator**: Use `moderator@example.com` / `moderator`
2. **View Flagged Content**: Access flagged posts dashboard
3. **Approve/Reject**: Moderate flagged content
4. **Delete Posts**: Remove inappropriate content
5. **User Management**: Monitor user activities

###  File Upload & Management
1. **Upload Files**: 
   - Attach files when creating posts
   - Supported formats: PDF, images, documents
   - Max file size: 10MB per file
2. **View Files**: Click on attached files to download
3. **File Organization**: Files are organized by post

###  Testing Different User Roles
1. **Regular User** (`user@edora.com`):
   - Create posts and comments
   - Join channels and interact
   - Limited to own content management
2. **Moderator** (`moderator@example.com`):
   - All regular user features
   - Delete any posts/comments
   - Access moderation dashboard
   - Approve flagged content

###  Dashboard Features
1. **Statistics**: View your posts, comments, and points
2. **Recent Activity**: See latest posts and interactions
3. **Leaderboard**: Compare points with other users
4. **Quick Actions**: Fast access to create content

###  Advanced Testing Scenarios
1. **Content Flagging**: Create posts with inappropriate content to test auto-flagging
2. **Concurrent Users**: Test with multiple browser tabs/users
3. **File Handling**: Upload various file types and sizes
4. **Search Accuracy**: Test search with different keywords
5. **Responsive Design**: Test on different screen sizes

###  Performance Testing
1. **Large Files**: Upload files close to 10MB limit
2. **Many Posts**: Create multiple posts in quick succession
3. **Heavy Interaction**: Like/comment on many posts rapidly
4. **Search Load**: Perform multiple searches simultaneously

## Project Structure

```
edora/
├── app/                    # FastAPI backend
│   ├── api/               # API routes and endpoints
│   ├── models/            # Database models
│   ├── core/              # Core utilities and auth
│   └── main.py            # Application entry point
├── frontend/               # React frontend
│   ├── src/               # React source code
│   ├── package.json       # Dependencies
│   └── vite.config.js     # Build configuration
├── data/                   # SQLite database storage
├── uploads/                # File uploads storage
├── docker-compose.yml      # Docker services configuration
├── requirements.txt        # Python dependencies

```

## Technology Stack

**Backend:**
- FastAPI (Python) - REST API framework
- SQLModel - Database ORM
- SQLite - Database
- Redis - Caching
- JWT - Authentication

**Frontend:**
- React - UI framework
- Vite - Build tool
- Tailwind CSS - Styling
- JavaScript (ES6+)

## Testing the Application

1. **Register a new user** at http://localhost:5173
2. **Create channels** for organizing content
3. **Upload documents** (PDF, images, etc.)
4. **Test social features** - comments, reactions, saves
5. **Explore gamification** - points and leaderboard
6. **Try search functionality** for documents and channels

## API Endpoints

Key endpoints available at http://localhost:8000/docs:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /channels/` - List channels
- `POST /channels/` - Create channel
- `GET /posts/` - List posts
- `POST /posts/` - Create post
- `POST /api/files/upload` - Upload files

## Troubleshooting

If containers fail to start:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

Check logs if needed:
```bash
docker-compose logs api
docker-compose logs frontend
```