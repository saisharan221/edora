# eDora Docker Setup Guide

This guide explains how to run the eDora application using Docker with proper volume mounting for bidirectional file synchronization.

## 🚀 Quick Start

### Option 1: Using the Setup Script (Recommended)
```bash
./docker-setup.sh
```

### Option 2: Manual Setup
```bash
# Create necessary directories
mkdir -p data/uploads app/uploads

# Build and start containers
docker-compose up --build -d

# View logs
docker-compose logs -f
```

## 📁 Volume Mounting Strategy

The Docker setup uses bidirectional volume mounting to ensure that changes made in either the local environment or Docker containers are synchronized:

### Backend (API) Volumes
- `./app:/app/app` - Source code synchronization
- `./data/uploads:/app/app/uploads` - File uploads (bidirectional)
- `./data:/app/data` - Database and persistent data
- `./requirements.txt:/app/requirements.txt:ro` - Python dependencies (read-only)

### Frontend Volumes
- `./frontend/src:/app/src` - Source code (bidirectional)
- `./frontend/public:/app/public` - Static assets and icons (bidirectional)
- Configuration files (read-only):
  - `package.json`, `package-lock.json`
  - `vite.config.js`, `tailwind.config.js`
  - `postcss.config.js`, `eslint.config.js`
  - `index.html`
- `frontend_node_modules:/app/node_modules` - Node modules (named volume)

### Persistent Data Volumes
- `redis_data:/data` - Redis data persistence

## 🔄 File Synchronization

### Icons and Assets
- **Frontend icons**: Located in `frontend/src/assets/` and `frontend/public/`
- **Bidirectional sync**: Changes made locally or in containers are immediately reflected
- **Hot reload**: Vite automatically detects changes and reloads

### Uploads (✅ FIXED)
- **Local directory**: `./data/uploads/`
- **Container directory**: `/app/app/uploads/`
- **Bidirectional sync**: Files uploaded through the app appear locally and vice versa
- **Persistence**: Files persist between container restarts
- **API configuration**: Updated to use `app/uploads` directory
- **Static serving**: Files served from correct mounted directory

### Database
- **Local file**: `./data/app.db`
- **Container path**: `/app/data/app.db`
- **Persistent**: Database changes are preserved between container restarts

## 🔐 Permission System (NEW)

### User Roles
- **user** - Regular user (default role)
- **moderator** - Can moderate content
- **admin** - Full access to all content

### Edit/Delete Permissions
- **Channels**: Users can edit/delete their own channels, admins can edit/delete any channel
- **Posts**: Users can edit/delete their own posts, admins can edit/delete any post
- **API Responses**: Include `can_edit` and `can_delete` flags for frontend use

### New API Endpoints
```
PUT  /channels/{id}     - Edit channel (owner or admin only)
DELETE /channels/{id}   - Delete channel (owner or admin only)
PUT  /posts/{id}        - Edit post (author or admin only)  
DELETE /posts/{id}      - Delete post (author or admin only)
```

## 🧪 Testing Upload Persistence

Run the test script to verify upload functionality:
```bash
./test-upload.sh
```

### Manual Testing Steps:
1. **Upload a file**: Go to http://localhost:5173 and upload a file through the interface
2. **Check local directory**: Verify the file appears in `./data/uploads/`
3. **Stop containers**: `docker-compose down`
4. **Restart containers**: `docker-compose up -d`
5. **Verify persistence**: Check that the file is still accessible

## 🔐 Testing Permission System

### Create Admin User
```bash
./create-admin.sh
```
This creates an admin user with:
- Email: admin@edora.com
- Password: admin123
- Role: admin

### Test Permissions
```bash
./test-permissions.sh
```

### Manual Permission Testing:
1. **Create regular user**: Register at http://localhost:5173
2. **Create content**: Create channels and posts as regular user
3. **Test ownership**: Edit/delete your own content (should work)
4. **Login as admin**: Use admin@edora.com / admin123
5. **Test admin access**: Edit/delete any user's content (should work)
6. **Test restrictions**: Try to edit others' content as regular user (should fail)

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Redis**: localhost:6379

## 🛠️ Development Workflow

### Making Changes
1. **Frontend**: Edit files in `frontend/src/` - changes auto-reload
2. **Backend**: Edit files in `app/` - FastAPI auto-reloads
3. **Assets**: Add/modify files in `frontend/src/assets/` or `frontend/public/`
4. **Uploads**: Files uploaded through the app appear in `./data/uploads/`

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f redis
```

### Restarting Services
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart api
docker-compose restart frontend
```

### Rebuilding Containers
```bash
# Rebuild and restart (after dependency changes)
docker-compose up --build -d

# Force rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

## 🔧 Troubleshooting

### Upload Issues
If uploads aren't persisting:
```bash
# Check upload directories
ls -la data/uploads/
docker exec edora-api-1 ls -la /app/app/uploads/

# Verify volume mounts
docker inspect edora-api-1 | grep -A 10 "Mounts"

# Run upload test
./test-upload.sh
```

### Permission Issues
If edit/delete isn't working:
```bash
# Check user roles in database
docker exec edora-api-1 sqlite3 /app/data/app.db "SELECT id, email, role FROM user;"

# Test permission endpoints
./test-permissions.sh

# Create admin user
./create-admin.sh
```

### Permission Issues
```bash
# Fix upload directory permissions
chmod 755 data/uploads app/uploads
```

### Port Conflicts
If ports 5173 or 8000 are in use:
```bash
# Check what's using the ports
lsof -i :5173
lsof -i :8000

# Stop conflicting processes or modify docker-compose.yml ports
```

### Container Issues
```bash
# Stop all containers
docker-compose down

# Remove containers and volumes (⚠️ This will delete data)
docker-compose down -v

# Clean up Docker system
docker system prune -f
```

### Frontend Build Issues
```bash
# Clear node_modules volume
docker-compose down
docker volume rm edora_frontend_node_modules
docker-compose up --build -d
```

## 📝 Environment Configuration

The `docker.env` file contains environment variables for both services:

- **Database**: SQLite path configuration
- **Upload directories**: File storage paths
- **API settings**: Host, port, reload configuration
- **Frontend**: API URL and polling settings
- **Redis**: Connection configuration
- **Security**: JWT settings (change in production)

## 🔒 Security Notes

- The current setup is for development
- Change `SECRET_KEY` in `docker.env` for production
- Consider using PostgreSQL instead of SQLite for production
- Implement proper authentication and authorization
- Use HTTPS in production environments
- Admin credentials should be changed in production

## 📦 File Structure

```
edora/
├── app/                    # Backend source code
│   ├── uploads/           # Upload directory (synced)
│   ├── core/              # Core functionality
│   │   └── permissions.py # Permission system
│   └── dockerfile         # Backend Dockerfile
├── frontend/              # Frontend source code
│   ├── src/              # Source files (synced)
│   │   └── assets/       # Icons and images (synced)
│   ├── public/           # Public assets (synced)
│   └── dockerfile        # Frontend Dockerfile
├── data/                 # Persistent data
│   ├── uploads/          # Uploaded files (synced)
│   └── app.db           # SQLite database
├── docker-compose.yml    # Docker Compose configuration
├── docker.env           # Environment variables
├── docker-setup.sh      # Setup script
├── test-upload.sh       # Upload testing script
├── test-permissions.sh  # Permission testing script
└── create-admin.sh      # Admin user creation script
```

## ✅ Recent Fixes

### Upload Persistence Issue (RESOLVED)
- **Problem**: Files uploaded in Docker weren't persisting when containers stopped
- **Root Cause**: Mismatch between upload directory (`uploads/`) and volume mount (`/app/app/uploads`)
- **Solution**: Updated `app/api/files.py` and `app/main.py` to use `app/uploads` directory
- **Result**: Files now persist correctly between container restarts

### Permission System (NEW)
- **Feature**: Added comprehensive edit/delete permission system
- **Implementation**: 
  - Created `app/core/permissions.py` with permission helper functions
  - Added `ChannelUpdate` and `PostUpdate` schemas
  - Updated API endpoints with proper permission checks
  - Added `can_edit` and `can_delete` flags to API responses
- **User Roles**: user, moderator, admin with appropriate access levels
- **Security**: Users can only edit their own content, admins have full access

This setup ensures that your development environment is fully synchronized between your local machine and Docker containers, with a robust permission system for content management. 