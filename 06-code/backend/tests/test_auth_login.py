import base64
import json
from pathlib import Path
from urllib.parse import urlparse, urlunparse

import httpx
import psycopg
import pytest
from psycopg import sql

from app.core.config import get_settings

SCHEMA_PATH = Path(__file__).resolve().parents[2] / "db" / "init" / "01-schema.sql"
DEFAULT_TEST_DATABASE_URL = "postgresql://admin:abcd1234@localhost:5432/portal_convocatorias_test"
VALID_EMAIL = "usuario@test.com"
VALID_PASSWORD = "password-seguro"
INVALID_CREDENTIALS_MESSAGE = "invalid credentials"


def _maintenance_database_url(database_url: str) -> str:
    parsed = urlparse(database_url)
    return urlunparse(parsed._replace(path="/postgres"))


def _database_name(database_url: str) -> str:
    parsed = urlparse(database_url)
    return parsed.path.lstrip("/")


def _decode_jwt_without_verifying_signature(token: str) -> dict:
    parts = token.split(".")
    assert len(parts) == 3
    payload = parts[1]
    padded_payload = payload + "=" * (-len(payload) % 4)
    return json.loads(base64.urlsafe_b64decode(padded_payload.encode("utf-8")))


@pytest.fixture
def test_database_url(monkeypatch):
    database_url = DEFAULT_TEST_DATABASE_URL
    database_name = _database_name(database_url)

    with psycopg.connect(_maintenance_database_url(database_url), autocommit=True) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "select 1 from pg_database where datname = %s",
                (database_name,),
            )
            if cursor.fetchone() is None:
                cursor.execute(
                    sql.SQL("create database {}").format(sql.Identifier(database_name))
                )

    with psycopg.connect(database_url, autocommit=True) as connection:
        with connection.cursor() as cursor:
            cursor.execute("drop schema if exists public cascade")
            cursor.execute("create schema public")
            cursor.execute(SCHEMA_PATH.read_text())

    monkeypatch.setenv("DATABASE_URL", database_url)
    get_settings.cache_clear()
    try:
        yield database_url
    finally:
        get_settings.cache_clear()
        with psycopg.connect(database_url, autocommit=True) as connection:
            with connection.cursor() as cursor:
                cursor.execute("drop schema if exists public cascade")
                cursor.execute("create schema public")


@pytest.fixture
async def client(test_database_url):
    from app.main import create_app

    transport = httpx.ASGITransport(app=create_app())
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as async_client:
        yield async_client


async def _register_user(client, email: str = VALID_EMAIL, password: str = VALID_PASSWORD) -> dict:
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": password,
            "full_name": "Usuario Test",
        },
    )
    assert response.status_code == 201
    return response.json()


@pytest.mark.anyio
async def test_login_returns_200_with_valid_credentials(client):
    await _register_user(client)

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": VALID_EMAIL, "password": VALID_PASSWORD},
    )

    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["access_token"], str)
    assert body["token_type"] == "bearer"


@pytest.mark.anyio
async def test_login_token_is_valid_jwt_with_correct_claims(client):
    user = await _register_user(client)

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": VALID_EMAIL, "password": VALID_PASSWORD},
    )

    assert response.status_code == 200
    payload = _decode_jwt_without_verifying_signature(response.json()["access_token"])
    assert payload["sub"] == str(user["id"])
    assert payload["email"] == VALID_EMAIL
    assert "exp" in payload


@pytest.mark.anyio
async def test_login_returns_401_on_wrong_password(client):
    await _register_user(client)

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": VALID_EMAIL, "password": "password-incorrecto"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == INVALID_CREDENTIALS_MESSAGE


@pytest.mark.anyio
async def test_login_returns_401_on_nonexistent_email(client):
    wrong_password_response = await client.post(
        "/api/v1/auth/login",
        json={"email": VALID_EMAIL, "password": "password-incorrecto"},
    )
    nonexistent_email_response = await client.post(
        "/api/v1/auth/login",
        json={"email": "noexiste@test.com", "password": VALID_PASSWORD},
    )

    assert nonexistent_email_response.status_code == 401
    assert nonexistent_email_response.json()["detail"] == wrong_password_response.json()["detail"]
    assert nonexistent_email_response.json()["detail"] == INVALID_CREDENTIALS_MESSAGE


@pytest.mark.anyio
async def test_login_returns_422_on_missing_password(client):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": VALID_EMAIL},
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_login_is_case_insensitive_on_email(client):
    await _register_user(client, email=VALID_EMAIL)

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "USUARIO@TEST.COM", "password": VALID_PASSWORD},
    )

    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
