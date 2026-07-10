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
    secop_base_url: str = Field(
        "https://www.datos.gov.co/resource/p6dx-8zbt.json",
        alias="SECOP_BASE_URL",
    )
    secop_timeout_seconds: float = Field(10.0, alias="SECOP_TIMEOUT_SECONDS")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
