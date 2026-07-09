from fastapi import FastAPI

from app.interfaces.api.v1.router import api_router
from app.core.config import get_settings


def create_app() -> FastAPI:
    """Create the FastAPI application with the configured API router."""

    settings = get_settings()
    app = FastAPI(title=settings.app_name)
    app.include_router(api_router, prefix=settings.api_prefix)
    return app


app = create_app()
