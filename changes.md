# eDora — End-to-End Implementation & Local Startup Guide

=== FILE STRUCTURE ===

1. DATABASE MODELS (app/models/)
--------------------------------
- user.py:
  • UserBase schema + User model (table=True)
  • Relationships: Channel, Post, Comment

- channel.py:
  • Channel model (FK: user.id)
  • Schemas: ChannelCreate, ChannelRead

- post.py:
  • Post model (FKs: channel.id, user.id)
  • Relationships: MediaFile, Comment, Tag

- post_tag.py:
  • Post-Tag association table

- tag.py:
  • Tag model + PostTag relationship

- comment.py:
  • Comment model (FKs: post.id, user.id)

- mediafile.py:
  • MediaFile (filename, post_id, owner_id)

- refreshtoken.py:
  • RefreshToken model (JWT management)

=== MIGRATIONS ===
alembic revision --autogenerate -m "initial schema"
alembic upgrade head

=== API ENDPOINTS ===

[Auth - app/api/auth.py]
------------------------
POST /auth/register     User registration
POST /auth/login        JWT token generation
POST /auth/refresh      Access token refresh
GET  /auth/me           Current user data

[Files - app/api/files.py]
--------------------------
POST /files/upload      File upload handler
GET  /files/{file_id}   File metadata

[Channels - app/api/channels.py]
--------------------------------
POST /channels/         Create channel
GET  /channels/         List channels
GET  /channels/{id}/posts Channel posts

[Posts - app/api/posts.py]
--------------------------
POST /posts/            Create post
GET  /posts/            List posts

=== FRONTEND CODE (frontend/src/) ===

Login.jsx:
----------
localStorage.setItem('access_token', data.access_token);
localStorage.setItem('refresh_token', data.refresh_token);

Upload.jsx:
-----------
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("title", title);
formData.append("content", description);
formData.append("channel_id", selectedChannel);

Channels.jsx:
-------------
{post.files?.map(f => (
  <img src={`http://localhost:8000/files/${f.id}`} />
))}

=== STARTUP COMMANDS ===

# Backend Setup
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend Setup
cd frontend
npm install
npm run dev

=== ACCESS POINTS ===
API Docs:    http://localhost:8000/docs
Frontend:    http://localhost:5173