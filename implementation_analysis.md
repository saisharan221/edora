# Edora Application - Complete Implementation Analysis

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Database Schema](#database-schema)
6. [Authentication System](#authentication-system)
7. [API Endpoints](#api-endpoints)
8. [File Handling](#file-handling)
9. [Content Moderation](#content-moderation)
10. [Security Features](#security-features)
11. [Development Tools](#development-tools)
12. [Deployment](#deployment)

## Overview

Edora is a full-stack web application built as a mini-services platform for content sharing and collaboration. The application follows a microservices architecture with clear separation between frontend and backend components.

### Technology Stack
- **Backend**: FastAPI + SQLModel + SQLite
- **Frontend**: React + Vite + TailwindCSS
- **Caching**: Redis
- **Containerization**: Docker Compose
- **Authentication**: JWT tokens
- **Database Migrations**: Alembic

## Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Frontend    │    │     Backend     │    │    Database     │
│   React + Vite  │◄──►│  FastAPI + SQL  │◄──►│    SQLite       │
│   Port: 5173    │    │   Port: 8000    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│     Redis       │◄─────────────┘
                        │   Port: 6379    │
                        └─────────────────┘
```

### Project Structure
```
edora/
├── .env                      # Environment variables
├── docker-compose.yml        # Container orchestration
├── requirements.txt          # Python dependencies
├── app/                      # FastAPI backend
│   ├── Dockerfile
│   ├── main.py              # Application entry point
│   ├── db.py                # Database configuration
│   ├── api/                 # API endpoints
│   │   ├── auth.py          # Authentication routes
│   │   ├── channels.py      # Channel management
│   │   ├── posts.py         # Post management
│   │   ├── comments.py      # Comment system
│   │   ├── reactions.py     # Post reactions
│   │   ├── saved_posts.py   # Saved posts feature
│   │   ├── files.py         # File upload/download
│   │   └── router.py        # Main router
│   ├── models/              # Database models
│   │   ├── user.py
│   │   ├── channel.py
│   │   ├── post.py
│   │   ├── comment.py
│   │   ├── media_file.py
│   │   └── ...
│   └── core/                # Core utilities
│       ├── security.py      # Security functions
│       └── dependencies.py  # FastAPI dependencies
├── frontend/                # React frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx          # Main application
│   │   ├── Auth.jsx         # Authentication
│   │   ├── components/      # React components
│   │   └── ...
└── alembic/                 # Database migrations
    └── versions/
```

## Backend Implementation

### Main Application (`app/main.py`)
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.db import init_db
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Edora API")

# Static file serving for uploads
app.mount("/files", StaticFiles(directory="uploads"), name="files")

# Initialize database
init_db()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)
```

### Database Configuration (`app/db.py`)
```python
import os
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./data/app.db") \
    .replace("sqlite+aiosqlite", "sqlite")

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(
    bind=engine,
    class_=Session,
    expire_on_commit=False,
)

def get_session():
    """Dependency for FastAPI to get a DB session."""
    with SessionLocal() as session:
        yield session

def init_db():
    """Create all tables on startup."""
    SQLModel.metadata.create_all(engine)
```

## Frontend Implementation

### Main Application (`frontend/src/App.jsx`)
```javascript
function App() {
  // State management
  const [activeScene, setActiveScene] = useState('auth');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Authentication verification
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUserRole(data.role || 'user');
        setActiveScene('home');
        fetchHomePageData();
      } else {
        // Clear invalid tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setActiveScene('auth');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      setIsAuthenticated(false);
      setActiveScene('auth');
    }
  };

  // Component rendering based on active scene
  return (
    <div className="app">
      {!isAuthenticated ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <div className="app-container">
          <Sidebar /* ... */ />
          <main className="main-content">
            {/* Scene-based rendering */}
          </main>
        </div>
      )}
    </div>
  );
}
```

### Authentication Component (`frontend/src/Auth.jsx`)
```javascript
export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login flow
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);

      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user_id', data.user_id);
        onLogin();
      }
    } else {
      // Registration flow
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    }
  };
}
```

## Database Schema

### User Model (`app/models/user.py`)
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
    role: str = Field(default="user")  # user, moderator, admin

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    
    # Relationships
    channels: List["Channel"] = Relationship(back_populates="creator")
    posts: List["Post"] = Relationship(back_populates="author")
    comments: List["Comment"] = Relationship(back_populates="author")
    reactions: List["PostReaction"] = Relationship(back_populates="user")
    saved_posts: List["SavedPost"] = Relationship(back_populates="user")
```

### Channel Model (`app/models/channel.py`)
```python
class ChannelBase(SQLModel):
    title: str = Field(index=True)
    description: Optional[str] = None

class Channel(ChannelBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    creator: User = Relationship(back_populates="channels")
    posts: List["Post"] = Relationship(back_populates="channel")
```

### Post Model (`app/models/post.py`)
```python
class PostBase(SQLModel):
    title: str = Field(index=True)
    content: Optional[str] = None
    flagged: bool = Field(default=False)
    flag_reason: Optional[str] = None

class Post(PostBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    channel_id: int = Field(foreign_key="channel.id")
    author_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    # Relationships
    channel: Channel = Relationship(back_populates="posts")
    author: User = Relationship(back_populates="posts")
    comments: List["Comment"] = Relationship(back_populates="post")
    files: List["MediaFile"] = Relationship(back_populates="post")
    reactions: List["PostReaction"] = Relationship(back_populates="post")
    saved_by: List["SavedPost"] = Relationship(back_populates="post")
```

### Comment Model (`app/models/comment.py`)
```python
class CommentBase(SQLModel):
    content: str

class Comment(CommentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: int = Field(foreign_key="post.id")
    author_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    # Relationships
    post: Post = Relationship(back_populates="comments")
    author: User = Relationship(back_populates="comments")
```

### Media File Model (`app/models/media_file.py`)
```python
class MediaFile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str
    mime_type: Optional[str] = None
    file_size: Optional[int] = None
    post_id: Optional[int] = Field(foreign_key="post.id")
    owner_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    post: Optional[Post] = Relationship(back_populates="files")
    owner: User = Relationship()
```

### Post Reaction Model (`app/models/post_reaction.py`)
```python
from enum import Enum

class ReactionType(str, Enum):
    LIKE = "like"
    DISLIKE = "dislike"

class PostReactionBase(SQLModel):
    reaction_type: ReactionType

class PostReaction(PostReactionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: int = Field(foreign_key="post.id")
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    # Relationships
    post: Post = Relationship(back_populates="reactions")
    user: User = Relationship(back_populates="reactions")
```

### Saved Post Model (`app/models/saved_post.py`)
```python
class SavedPostBase(SQLModel):
    pass

class SavedPost(SavedPostBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    post_id: int = Field(foreign_key="post.id")
    saved_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: User = Relationship(back_populates="saved_posts")
    post: Post = Relationship(back_populates="saved_by")
```

### Flagged Word Model (`app/models/flagged_word.py`)
```python
class FlaggedWord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    word: str = Field(unique=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

## Authentication System

### Security Implementation (`app/core/security.py`)
```python
import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)

def create_refresh_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(days=7)
    payload = {"sub": str(user_id), "exp": expire, "type": "refresh"}
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
```

### Authentication Routes (`app/api/auth.py`)
```python
@router.post("/register")
def register(request: RegisterRequest, session: Session = Depends(db)):
    # Check email uniqueness
    if session.exec(select(User).where(User.email == request.email)).first():
        raise HTTPException(400, "email already registered")
    
    # Create user
    user = User(
        email=request.email, 
        hashed_password=hash_password(request.password), 
        role=request.role
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"id": user.id, "email": user.email, "role": user.role}

@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(db)):
    user = session.exec(select(User).where(User.email == form.username)).first()
    
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="invalid credentials")

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    # Store refresh token
    session.add(RefreshToken(
        id=str(uuid4()),
        user_id=user.id,
        expires_at=datetime.utcnow() + timedelta(days=7),
    ))
    session.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_id": user.id,
    }

@router.post("/refresh")
def refresh(request: RefreshRequest, session: Session = Depends(db)):
    try:
        payload = decode_token(request.refresh_token)
        uid = int(payload["sub"])
    except Exception:
        raise HTTPException(401, "invalid refresh token")

    # Validate refresh token in database
    db_token = session.exec(
        select(RefreshToken).where(
            RefreshToken.user_id == uid,
            RefreshToken.revoked == False
        )
    ).first()
    
    if not db_token or db_token.expires_at < datetime.utcnow():
        raise HTTPException(401, "refresh token expired / revoked")

    return {"access_token": create_access_token(uid), "token_type": "bearer"}

@router.get("/me")
def me(user: User = Depends(current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "is_superuser": user.is_superuser,
        "role": user.role
    }
```

### Role-Based Access Control (`app/core/dependencies.py`)
```python
from fastapi import Depends, HTTPException, status
from app.models.user import User
from app.api.auth import current_user

def require_moderator(user: User = Depends(current_user)):
    if getattr(user, 'role', 'user') not in ("moderator", "admin"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user
```

## API Endpoints

### Channel Management (`app/api/channels.py`)
```python
@router.post("/", response_model=ChannelRead)
def create_channel(
    payload: ChannelCreate,
    session: Session = Depends(get_session),
    current: User = Depends(current_user)
):
    channel = Channel(**payload.dict(), creator_id=current.id)
    session.add(channel)
    session.commit()
    session.refresh(channel)
    return channel

@router.get("/", response_model=List[ChannelRead])
def list_channels(session: Session = Depends(get_session)):
    return session.exec(select(Channel)).all()

@router.delete("/{channel_id}")
def delete_channel(
    channel_id: int,
    session: Session = Depends(get_session),
    moderator: User = Depends(require_moderator)
):
    channel = session.get(Channel, channel_id)
    if not channel:
        raise HTTPException(404, "Channel not found")
    
    session.delete(channel)
    session.commit()
    return {"message": "Channel deleted"}
```

### Post Management (`app/api/posts.py`)
```python
@router.post("/", response_model=PostRead)
def create_post(
    payload: PostCreate,
    session: Session = Depends(get_session),
    current: User = Depends(current_user)
):
    # Validate channel exists
    channel = session.get(Channel, payload.channel_id)
    if not channel:
        raise HTTPException(404, "Channel not found")
    
    # Check title uniqueness within channel
    exists = session.exec(
        select(Post).where(
            Post.title == payload.title,
            Post.channel_id == payload.channel_id,
        )
    ).first()
    if exists:
        raise HTTPException(400, "Post with that title already exists in this channel")
    
    post = Post(**payload.dict(), author_id=current.id)
    
    # Content moderation
    flagged_words = session.exec(select(FlaggedWord)).all()
    content = (post.content or "").lower()
    for fw in flagged_words:
        if fw.word in content:
            post.flagged = True
            post.flag_reason = fw.word
            break
    
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

@router.get("/", response_model=List[PostRead])
def list_posts(session: Session = Depends(get_session)):
    return session.exec(select(Post)).all()

@router.get("/{post_id}", response_model=PostRead)
def get_post(
    post_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(current_user)
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    return post

@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    session: Session = Depends(get_session),
    moderator: User = Depends(require_moderator)
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    
    session.delete(post)
    session.commit()
    return {"message": "Post deleted"}
```

### Comment System (`app/api/comments.py`)
```python
@router.post("/", response_model=CommentRead)
def create_comment(
    payload: CommentCreate,
    session: Session = Depends(get_session),
    current: User = Depends(current_user)
):
    # Validate post exists
    post = session.get(Post, payload.post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    
    comment = Comment(
        content=payload.content,
        post_id=payload.post_id,
        author_id=current.id
    )
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment

@router.get("/post/{post_id}", response_model=List[CommentRead])
def get_post_comments(
    post_id: int,
    session: Session = Depends(get_session)
):
    # Validate post exists
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    
    comments = session.exec(
        select(Comment).where(Comment.post_id == post_id)
    ).all()
    return comments
```

### Reaction System (`app/api/reactions.py`)
```python
@router.post("/", response_model=PostReactionRead)
def create_or_update_reaction(
    payload: PostReactionCreate,
    session: Session = Depends(get_session),
    current: User = Depends(current_user)
):
    # Validate post exists
    post = session.get(Post, payload.post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    
    # Check for existing reaction
    existing_reaction = session.exec(
        select(PostReaction).where(
            PostReaction.post_id == payload.post_id,
            PostReaction.user_id == current.id
        )
    ).first()
    
    if existing_reaction:
        # Update existing reaction
        existing_reaction.reaction_type = payload.reaction_type
        session.add(existing_reaction)
        session.commit()
        session.refresh(existing_reaction)
        return existing_reaction
    else:
        # Create new reaction
        reaction = PostReaction(
            reaction_type=payload.reaction_type,
            post_id=payload.post_id,
            user_id=current.id
        )
        session.add(reaction)
        session.commit()
        session.refresh(reaction)
        return reaction

@router.delete("/post/{post_id}")
def remove_reaction(
    post_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(current_user)
):
    reaction = session.exec(
        select(PostReaction).where(
            PostReaction.post_id == post_id,
            PostReaction.user_id == current.id
        )
    ).first()
    
    if not reaction:
        raise HTTPException(404, "Reaction not found")
    
    session.delete(reaction)
    session.commit()
    return {"message": "Reaction removed"}

@router.get("/post/{post_id}/counts")
def get_reaction_counts(
    post_id: int,
    session: Session = Depends(get_session)
):
    # Validate post exists
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    
    # Count reactions by type
    likes = session.exec(
        select(func.count(PostReaction.id)).where(
            PostReaction.post_id == post_id,
            PostReaction.reaction_type == ReactionType.LIKE
        )
    ).first()
    
    dislikes = session.exec(
        select(func.count(PostReaction.id)).where(
            PostReaction.post_id == post_id,
            PostReaction.reaction_type == ReactionType.DISLIKE
        )
    ).first()
    
    return {"likes": likes or 0, "dislikes": dislikes or 0}
```

### Saved Posts Feature (`app/api/saved_posts.py`)
```python
@router.post("/", response_model=SavedPostRead)
def save_post(
    payload: SavedPostCreate,
    session: Session = Depends(get_session),
    current: User = Depends(current_user)
):
    # Validate post exists
    post = session.get(Post, payload.post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    
    # Check if already saved
    existing_save = session.exec(
        select(SavedPost).where(
            SavedPost.user_id == current.id,
            SavedPost.post_id == payload.post_id
        )
    ).first()
    
    if existing_save:
        raise HTTPException(409, "Post already saved")
    
    saved_post = SavedPost(
        user_id=current.id,
        post_id=payload.post_id
    )
    session.add(saved_post)
    session.commit()
    session.refresh(saved_post)
    return saved_post

@router.delete("/{post_id}")
def unsave_post(
    post_id: int,
    session: Session = Depends(get_session),
    current: User = Depends(current_user)
):
    saved_post = session.exec(
        select(SavedPost).where(
            SavedPost.user_id == current.id,
            SavedPost.post_id == post_id
        )
    ).first()
    
    if not saved_post:
        raise HTTPException(404, "Saved post not found")
    
    session.delete(saved_post)
    session.commit()
    return {"message": "Post unsaved"}

@router.get("/", response_model=List[PostRead])
def get_saved_posts(
    session: Session = Depends(get_session),
    current: User = Depends(current_user)
):
    saved_posts = session.exec(
        select(SavedPost).where(SavedPost.user_id == current.id)
    ).all()
    
    posts = []
    for saved_post in saved_posts:
        post = session.get(Post, saved_post.post_id)
        if post:
            posts.append(post)
    
    return posts
```

## File Handling

### File Upload Implementation (`app/api/files.py`)
```python
import os
from pathlib import Path
from uuid import uuid4
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Form
from fastapi.responses import FileResponse

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload")
def upload_file(
    file: UploadFile = File(...),
    title: str = Form(...),
    content: str = Form(""),
    channel_id: int = Form(...),
    session: Session = Depends(get_session),
    current: User = Depends(current_user)
):
    # Validate channel exists
    channel = session.get(Channel, channel_id)
    if not channel:
        raise HTTPException(404, "Channel not found")
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
    unique_filename = f"{uuid4()}.{file_extension}" if file_extension else str(uuid4())
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file to disk
    with open(file_path, "wb") as buffer:
        content_bytes = file.file.read()
        buffer.write(content_bytes)
    
    # Create post
    post = Post(
        title=title,
        content=content,
        channel_id=channel_id,
        author_id=current.id
    )
    session.add(post)
    session.commit()
    session.refresh(post)
    
    # Create media file record
    media_file = MediaFile(
        filename=unique_filename,
        mime_type=file.content_type,
        file_size=len(content_bytes),
        post_id=post.id,
        owner_id=current.id
    )
    session.add(media_file)
    session.commit()
    session.refresh(media_file)
    
    return {
        "post_id": post.id,
        "file_id": media_file.id,
        "filename": unique_filename,
        "original_filename": file.filename
    }

@router.get("/{file_id}")
def serve_file(file_id: int, session: Session = Depends(get_session)):
    media_file = session.get(MediaFile, file_id)
    if not media_file:
        raise HTTPException(404, "File not found")
    
    file_path = UPLOAD_DIR / media_file.filename
    if not file_path.exists():
        raise HTTPException(404, "File not found on disk")
    
    return FileResponse(
        path=str(file_path),
        media_type=media_file.mime_type,
        filename=media_file.filename
    )
```

## Content Moderation

### Flagged Words System (`app/api/flagged_words.py`)
```python
@router.post("/")
def add_flagged_word(
    word: str,
    session: Session = Depends(get_session),
    moderator: User = Depends(require_moderator)
):
    # Check if word already exists
    existing = session.exec(
        select(FlaggedWord).where(FlaggedWord.word == word.lower())
    ).first()
    
    if existing:
        raise HTTPException(409, "Word already flagged")
    
    flagged_word = FlaggedWord(word=word.lower())
    session.add(flagged_word)
    session.commit()
    session.refresh(flagged_word)
    return flagged_word

@router.get("/")
def list_flagged_words(
    session: Session = Depends(get_session),
    moderator: User = Depends(require_moderator)
):
    return session.exec(select(FlaggedWord)).all()

@router.delete("/{word_id}")
def remove_flagged_word(
    word_id: int,
    session: Session = Depends(get_session),
    moderator: User = Depends(require_moderator)
):
    word = session.get(FlaggedWord, word_id)
    if not word:
        raise HTTPException(404, "Flagged word not found")
    
    session.delete(word)
    session.commit()
    return {"message": "Flagged word removed"}
```

### Content Filtering in Posts
```python
# Implemented in post creation
def create_post(payload: PostCreate, session: Session, current: User):
    post = Post(**payload.dict(), author_id=current.id)
    
    # Content moderation check
    flagged_words = session.exec(select(FlaggedWord)).all()
    content = (post.content or "").lower()
    
    for fw in flagged_words:
        if fw.word in content:
            post.flagged = True
            post.flag_reason = fw.word
            break
    
    session.add(post)
    session.commit()
    return post
```

## Security Features

### Authentication Security
- **JWT Tokens**: Short-lived access tokens (30 minutes) and long-lived refresh tokens (7 days)
- **Password Hashing**: Bcrypt with salt for secure password storage
- **Token Validation**: Comprehensive token validation with expiration checks
- **Refresh Token Rotation**: Secure token refresh mechanism

### Authorization
- **Role-Based Access Control**: User, Moderator, Admin roles
- **Protected Routes**: Endpoints protected by authentication middleware
- **Permission Checks**: Granular permissions for content management

### Input Validation
- **Pydantic Models**: Strict input validation using Pydantic schemas
- **Content Filtering**: Automated flagged word detection
- **File Validation**: File type and size validation for uploads

### Security Headers and CORS
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Development Tools

### Database Migrations (Alembic)
```python
# alembic/env.py
from app import models  # Import all models
target_metadata = SQLModel.metadata

# Generate migration
# alembic revision --autogenerate -m "description"

# Apply migration
# alembic upgrade head
```

### Environment Configuration
```env
# .env
DATABASE_URL=sqlite:///./data/app.db
REDIS_URL=redis://redis:6379/0
JWT_SECRET=your-super-secret-key

# Optional mail settings
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASSWORD=password
EMAIL_FROM=notify@example.com
```

### Testing Setup
```python
# pytest.ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --tb=short
```

## Deployment

### Docker Compose Configuration
```yaml
version: "3.8"

services:
  api:
    build:
      context: .
      dockerfile: ./app/Dockerfile
    volumes:
      - ./app:/app/app
      - ./data/uploads:/app/app/uploads
      - ./requirements.txt:/app/requirements.txt:ro
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./data/app.db
    depends_on:
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    volumes:
      - ./frontend:/app
      - frontend_node_modules:/app/node_modules
    ports:
      - "5173:5173"
    environment:
      - CHOKIDAR_USEPOLLING=true
      - VITE_API_URL=http://api:8000
    command: ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
    depends_on:
      - api

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  frontend_node_modules:
```

### Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ./app ./app

# Create uploads directory
RUN mkdir -p /app/app/uploads

EXPOSE 8000

# Start Uvicorn
CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code
COPY . .

EXPOSE 5173

# Run development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
```

### Startup Commands
```bash
# Backend Setup
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend Setup
cd frontend
npm install
npm run dev

# Docker Compose
docker compose up --build
```

### Access Points
- **API Documentation**: http://localhost:8000/docs
- **Frontend Application**: http://localhost:5173
- **Redis**: http://localhost:6379

## Features Summary

### Core Features Implemented
1. **User Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (User/Moderator/Admin)
   - Session management with refresh tokens

2. **Channel Management**
   - Create/read channels
   - Channel-based content organization
   - Join/leave channel functionality

3. **Post Management**
   - Create posts with content and file attachments
   - Post listing and detailed views
   - Content moderation with flagged words
   - Post reactions (like/dislike)

4. **Comment System**
   - Real-time commenting on posts
   - Comment timestamps and author tracking
   - Nested comment support structure

5. **File Upload System**
   - Secure file upload and storage
   - File metadata tracking
   - Multiple file type support

6. **Saved Posts Feature**
   - Save/unsave posts functionality
   - Personal saved posts collection
   - Save status tracking

7. **Content Moderation**
   - Flagged words system
   - Automatic content filtering
   - Moderator tools for content management

8. **Search and Discovery**
   - Post search functionality
   - Channel discovery
   - Content filtering

### Additional Features
- **Real-time Updates**: Live updates for reactions and comments
- **Responsive Design**: Modern UI with mobile support
- **Performance Optimization**: Efficient database queries and caching
- **Security**: Comprehensive security measures
- **Audit Logging**: System activity tracking
- **Content Management**: Admin tools for platform management

This implementation provides a comprehensive social platform with modern web technologies, security best practices, and scalable architecture patterns. 