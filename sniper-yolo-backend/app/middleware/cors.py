"""CORS configuration based on Starlette's CORSMiddleware."""
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings


def setup_cors(app):
    """Configure CORS for the application."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )