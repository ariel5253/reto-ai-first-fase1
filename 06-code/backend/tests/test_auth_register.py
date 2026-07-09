from pathlib import Path
from urllib.parse import urlparse, urlunparse

import httpx
import psycopg
import pytest
from psycopg import sql

from app.core.config import get_settings

SCHEMA_PATH = Path(__file__).resolve().parents[2] / "db" / "init" / "01-schema.sql"
DEFAULT_TEST_DATABASE_URL = "postgresql://admin:abcd1234@localhost:5432/portal_convocatorias_test"


def _maintenance_database_url(database_url: str) -> str:
    parsed = urlparse(database_url)
    return urlunparse(parsed._replace(path="/postgres"))


def _database_name(database_url: str) -> str:
    parsed = urlparse(database_url)
    return parsed.path.lstrip("/")


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


@pytest.mark.anyio
async def test_register_returns_201_with_valid_payload(client):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "Usuario@Test.com",
            "password": "password-seguro",
            "full_name": "Usuario Test",
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert isinstance(body["id"], int)
    assert body["email"] == "usuario@test.com"
    assert body["full_name"] == "Usuario Test"
    assert isinstance(body["created_at"], str)


@pytest.mark.anyio
async def test_register_normalizes_email_to_lowercase(client):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "USUARIO@TEST.COM",
            "password": "password-seguro",
            "full_name": "Usuario Test",
        },
    )

    assert response.status_code == 201
    assert response.json()["email"] == "usuario@test.com"


@pytest.mark.anyio
async def test_register_returns_409_on_duplicate_email(client):
    payload = {
        "email": "usuario@test.com",
        "password": "password-seguro",
        "full_name": "Usuario Test",
    }

    first_response = await client.post("/api/v1/auth/register", json=payload)
    second_response = await client.post("/api/v1/auth/register", json=payload)

    assert first_response.status_code == 201
    assert second_response.status_code == 409


@pytest.mark.anyio
async def test_register_returns_422_on_missing_email(client):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "password": "password-seguro",
            "full_name": "Usuario Test",
        },
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_register_returns_422_on_short_password(client):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "usuario@test.com",
            "password": "1234567",
            "full_name": "Usuario Test",
        },
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_register_does_not_return_password_hash(client):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "usuario@test.com",
            "password": "password-seguro",
            "full_name": "Usuario Test",
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert "password" not in body
    assert "password_hash" not in body
    assert "hash" not in body
