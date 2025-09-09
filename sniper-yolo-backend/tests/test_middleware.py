"""Tests for Starlette middleware."""
import pytest
from httpx import AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_logging_middleware():
    """Test that logging middleware adds process time header."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/health")
    
    assert response.status_code == 200
    assert "x-process-time" in response.headers


@pytest.mark.asyncio
async def test_security_headers_middleware():
    """Test that security headers are added to responses."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/health")
    
    assert response.status_code == 200
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert "x-xss-protection" in response.headers


@pytest.mark.asyncio
async def test_cors_middleware():
    """Test CORS middleware configuration."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Test preflight request
        response = await ac.options(
            "/api/v1/users/",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST"
            }
        )
    
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "*"