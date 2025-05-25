import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine, select
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db import get_session
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.api.auth import create_access_token, current_user

# Create test database
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture(name="test_user")
def test_user_fixture(session: Session):
    user = User(
        email="test@example.com",
        hashed_password="hashed_password",
        points=0
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@pytest.fixture(name="client")
def client_fixture(session: Session, test_user: User):
    def get_session_override():
        return session

    def get_current_user_override():
        return session.exec(select(User).where(User.email == test_user.email)).first()

    app.dependency_overrides[get_session] = get_session_override
    app.dependency_overrides[current_user] = get_current_user_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

@pytest.fixture(name="auth_headers")
def auth_headers_fixture(test_user: User):
    access_token = create_access_token(test_user.id)
    return {"Authorization": f"Bearer {access_token}"}

def test_get_leaderboard_empty(client: TestClient, auth_headers: dict):
    response = client.get("/leaderboard", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []

def test_get_leaderboard_with_users(client: TestClient, session: Session, auth_headers: dict):
    # Create multiple users with different points
    users = [
        User(email=f"user{i}@example.com", hashed_password="password", points=points)
        for i, points in enumerate([100, 50, 75])
    ]
    for user in users:
        session.add(user)
    session.commit()

    response = client.get("/leaderboard", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    # Check if users are sorted by points in descending order
    assert data[0]["points"] == 100
    assert data[1]["points"] == 75
    assert data[2]["points"] == 50

def test_get_user_rank(client: TestClient, session: Session, test_user: User, auth_headers: dict):
    # Create users with different points
    users = [
        User(email=f"user{i}@example.com", hashed_password="password", points=points)
        for i, points in enumerate([100, 50, 75])
    ]
    for user in users:
        session.add(user)
    session.commit()

    response = client.get("/leaderboard/rank", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == 4  # User with 0 points should be ranked 4th

def test_points_for_post_creation(client: TestClient, session: Session, test_user: User, auth_headers: dict):
    # Create a post
    post_data = {
        "title": "Test Post",
        "content": "Test Content",
        "channel_id": 1
    }
    response = client.post("/posts/", json=post_data, headers=auth_headers)
    assert response.status_code == 201

    # Check if points were awarded
    user = session.get(User, test_user.id)
    assert user.points == 10  # 10 points for creating a post

def test_points_for_comment_creation(client: TestClient, session: Session, test_user: User, auth_headers: dict):
    # First create a post
    post = Post(title="Test Post", content="Test Content", channel_id=1, author_id=test_user.id)
    session.add(post)
    session.commit()

    # Create a comment
    comment_data = {
        "content": "Test Comment",
        "post_id": post.id
    }
    response = client.post("/comments/", json=comment_data, headers=auth_headers)
    assert response.status_code == 201

    # Check if points were awarded
    user = session.get(User, test_user.id)
    assert user.points == 5  # 5 points for creating a comment

def test_combined_points(client: TestClient, session: Session, test_user: User, auth_headers: dict):
    # Create a post
    post = Post(title="Test Post", content="Test Content", channel_id=1, author_id=test_user.id)
    session.add(post)
    session.commit()

    # Create a comment
    comment_data = {
        "content": "Test Comment",
        "post_id": post.id
    }
    response = client.post("/comments/", json=comment_data, headers=auth_headers)
    assert response.status_code == 201

    # Check total points
    user = session.get(User, test_user.id)
    assert user.points == 15  # 10 points for post + 5 points for comment 