# eDora - New Features and Changes Documentation

## 1. Authentication and User Management
### New Features
- Implemented JWT-based authentication system
- Added user registration and login functionality
- Session management with refresh tokens
- Protected routes requiring authentication
- User profile management

### API Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - JWT token generation
- `POST /auth/refresh` - Access token refresh
- `GET /auth/me` - Current user data

## 2. Comments System
### New Features
- Real-time comment functionality on posts
- Comment creation and management
- Comment timestamps and author tracking
- Comment threading support
- Comment count display

### API Endpoints
- `POST /comments/` - Create new comment
- `GET /comments/post/{post_id}` - Get comments for a post

### Database Changes
- Added `Comment` model with relationships to `Post` and `User`
- Added `updated_at` timestamp to comments
- Removed `parent_id` for simplified threading

## 3. Post Reactions
### New Features
- Like/Dislike functionality for posts
- Real-time reaction count updates
- User reaction tracking
- Reaction type management (like/dislike)

### API Endpoints
- `POST /reactions/` - Create or update reaction
- `DELETE /reactions/post/{post_id}` - Remove reaction
- `GET /reactions/post/{post_id}/user` - Get user's reaction
- `GET /reactions/post/{post_id}/counts` - Get reaction counts

### Database Changes
- Added `PostReaction` table with:
  - `reaction_type` (like/dislike)
  - `post_id` and `user_id` foreign keys
  - Timestamps for creation and updates

## 4. Saved Posts Feature
### New Features
- Save/unsave posts functionality
- Saved posts collection view
- Quick access to saved content
- Save status indicators
- Saved posts count tracking

### API Endpoints
- `POST /saved-posts/` - Save a post
- `DELETE /saved-posts/{post_id}` - Unsave a post
- `GET /saved-posts/` - Get all saved posts
- `GET /saved-posts/check/{post_id}` - Check if post is saved

### Database Changes
- Added `SavedPost` model with:
  - `user_id` and `post_id` foreign keys
  - `saved_at` timestamp
  - Relationship to `Post` and `User` models

## 5. Frontend Improvements
### New Components
- `PostDetailView.jsx` - Enhanced post view with:
  - Comment section
  - Reaction buttons
  - Save functionality
  - File attachments display
- `SavedPosts.jsx` - Dedicated saved posts view
- Modern UI with responsive design

### UI/UX Enhancements
- Added loading states and error handling
- Improved navigation and routing
- Real-time updates for reactions and comments
- Responsive design for mobile devices
- Modern styling with CSS animations

## 6. Database Schema Updates
### New Tables
- `postreaction` - For storing post reactions
- `savedpost` - For tracking saved posts

### Schema Changes
- Updated `comment` table:
  - Added `updated_at` timestamp
  - Removed `parent_id` column
- Removed `ix_post_title` index for optimization

## 7. Security Improvements
- JWT token-based authentication
- Protected API endpoints
- Secure file upload handling
- User authorization checks
- Input validation and sanitization

## 8. Performance Optimizations
- Optimized database queries
- Added proper indexing
- Implemented caching where appropriate
- Reduced unnecessary database calls
- Improved frontend state management

## 9. Development Tools
### Backend
- FastAPI for API development
- SQLModel for database operations
- Alembic for database migrations
- Pydantic for data validation

### Frontend
- React for UI components
- Vite for development server
- Modern CSS with responsive design
- Environment variable configuration

## 10. Future Considerations
- Message system implementation
- Notification system
- User profile customization
- Advanced search functionality
- Channel subscription system
