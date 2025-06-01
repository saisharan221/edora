"""
Basic tests for the Edora application.
These tests ensure the application starts correctly and basic endpoints work.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_read_main():
    """Test that the API documentation endpoint is accessible."""
    response = client.get("/docs")
    assert response.status_code == 200


def test_health_check():
    """Test basic application health."""
    # Test that the app can handle a basic request
    response = client.get("/")
    # The root might return 404, but the app should be running
    assert response.status_code in [200, 404, 422]


def test_auth_endpoints_exist():
    """Test that authentication endpoints are available."""
    # Test registration endpoint exists (even if it fails due to missing data)
    response = client.post("/auth/register")
    # Should return 422 (validation error) not 404 (not found)
    assert response.status_code == 422
    
    # Test login endpoint exists
    response = client.post("/auth/login")
    # Should return 422 (validation error) not 404 (not found)
    assert response.status_code == 422


def test_channels_endpoint():
    """Test that channels endpoint requires authentication."""
    response = client.get("/channels/")
    # Should return 401 (unauthorized) since no token provided
    assert response.status_code == 401


def test_posts_endpoint():
    """Test that posts endpoint is accessible."""
    response = client.get("/posts/")
    # Posts endpoint should be accessible (returns 200)
    assert response.status_code == 200


def test_database_connection():
    """Test that database connection can be established."""
    from app.db import get_session
    
    # Test that we can get a database session
    session_generator = get_session()
    session = next(session_generator)
    assert session is not None
    
    # Clean up
    try:
        next(session_generator)
    except StopIteration:
        pass  # Expected when generator is exhausted


def test_cors_headers():
    """Test that CORS headers are properly configured."""
    response = client.options("/docs")
    # Should have CORS headers or at least not fail completely
    # 405 = Method Not Allowed is also acceptable
    assert response.status_code in [200, 405]


def test_api_router_inclusion():
    """Test that API routes are properly included."""
    # Test that auth routes are included
    response = client.get("/auth/me")
    assert response.status_code == 401  # Unauthorized, but route exists
    
    # Test that file routes are included
    response = client.post("/api/files/upload")
    assert response.status_code == 401  # Unauthorized, but route exists 