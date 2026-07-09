from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    app_name: str = "Portal de Convocatorias Públicas API"
    api_prefix: str = "/api"
    database_url: str = Field(..., alias="DATABASE_URL")
    jwt_secret: str = Field("dev-only-change-me-dev-secret-32-chars", alias="JWT_SECRET")
    jwt_algorithm: str = Field("HS256", alias="JWT_ALGORITHM")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
