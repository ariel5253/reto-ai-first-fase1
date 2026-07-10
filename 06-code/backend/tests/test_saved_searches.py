from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from urllib.parse import urlparse, urlunparse

import httpx
import psycopg
import pytest
from psycopg import sql

from app.core.config import get_settings

SCHEMA_PATH = Path(__file__).resolve().parents[2] / "db" / "init" / "01-schema.sql"
DEFAULT_TEST_DATABASE_URL = "postgresql://admin:abcd1234@localhost:5432/portal_convocatorias_test"
VALID_PASSWORD = "password-seguro"


def _maintenance_database_url(database_url: str) -> str:
    parsed = urlparse(database_url)
    return urlunparse(parsed._replace(path="/postgres"))


def _database_name(database_url: str) -> str:
    parsed = urlparse(database_url)
    return parsed.path.lstrip("/")


@dataclass
class SavedSearch:
    id: int
    user_id: int
    name: str
    filters: list[dict]
    created_at: datetime


class FakeSavedSearchRepository:
    def __init__(self) -> None:
        self._items: dict[int, SavedSearch] = {}
        self._next_id = 1

    def create(self, user_id: int, name: str, filters: list[dict]) -> SavedSearch:
        for item in self._items.values():
            if item.user_id == user_id and item.name == name:
                raise ValueError("saved search already exists")

        saved_search = SavedSearch(
            id=self._next_id,
            user_id=user_id,
            name=name,
            filters=filters,
            created_at=datetime.now(UTC),
        )
        self._items[saved_search.id] = saved_search
        self._next_id += 1
        return saved_search

    def list_by_user(self, user_id: int) -> list[SavedSearch]:
        return [item for item in self._items.values() if item.user_id == user_id]

    def delete(self, search_id: int, user_id: int) -> bool:
        item = self._items.get(search_id)
        if item is None or item.user_id != user_id:
            return False
        del self._items[search_id]
        return True


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

    app = create_app()
    fake_repo = FakeSavedSearchRepository()

    try:
        from app.interfaces.api.v1.saved_searches import get_saved_search_repository
    except ModuleNotFoundError:
        get_saved_search_repository = None

    if get_saved_search_repository is not None:
        app.dependency_overrides[get_saved_search_repository] = lambda: fake_repo

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as async_client:
        yield async_client

    app.dependency_overrides.clear()


async def register_and_login(client, email: str) -> dict:
    register_response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": VALID_PASSWORD,
            "full_name": "Usuario Test",
        },
    )
    assert register_response.status_code == 201

    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": VALID_PASSWORD},
    )
    assert login_response.status_code == 200

    return {
        "user": register_response.json(),
        "access_token": login_response.json()["access_token"],
        "headers": {"Authorization": f"Bearer {login_response.json()['access_token']}"},
    }


@pytest.mark.anyio
async def test_create_saved_search_returns_201(client):
    auth = await register_and_login(client, "saved-search-create@test.com")

    response = await client.post(
        "/api/v1/saved-searches",
        json={"name": "Mi búsqueda", "filters": [{"key": "status", "value": "ACTIVO"}]},
        headers=auth["headers"],
    )

    assert response.status_code == 201
    body = response.json()
    assert isinstance(body["id"], int)
    assert body["name"] == "Mi búsqueda"
    assert body["filters"] == [{"key": "status", "value": "ACTIVO"}]
    assert "created_at" in body


@pytest.mark.anyio
async def test_create_saved_search_duplicate_name_returns_409(client):
    auth = await register_and_login(client, "saved-search-duplicate@test.com")
    payload = {"name": "Mi búsqueda", "filters": [{"key": "status", "value": "ACTIVO"}]}

    first_response = await client.post("/api/v1/saved-searches", json=payload, headers=auth["headers"])
    second_response = await client.post("/api/v1/saved-searches", json=payload, headers=auth["headers"])

    assert first_response.status_code == 201
    assert second_response.status_code == 409


@pytest.mark.anyio
async def test_create_saved_search_empty_name_returns_422(client):
    auth = await register_and_login(client, "saved-search-empty-name@test.com")

    response = await client.post(
        "/api/v1/saved-searches",
        json={"name": "", "filters": [{"key": "status", "value": "ACTIVO"}]},
        headers=auth["headers"],
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_create_saved_search_empty_filters_returns_422(client):
    auth = await register_and_login(client, "saved-search-empty-filters@test.com")

    response = await client.post(
        "/api/v1/saved-searches",
        json={"name": "Mi búsqueda", "filters": []},
        headers=auth["headers"],
    )

    assert response.status_code == 422


@pytest.mark.anyio
async def test_create_saved_search_no_token_returns_401(client):
    response = await client.post(
        "/api/v1/saved-searches",
        json={"name": "Mi búsqueda", "filters": [{"key": "status", "value": "ACTIVO"}]},
    )

    assert response.status_code == 401


@pytest.mark.anyio
async def test_list_saved_searches_returns_200_with_items(client):
    auth = await register_and_login(client, "saved-search-list@test.com")
    create_response = await client.post(
        "/api/v1/saved-searches",
        json={"name": "Mi búsqueda", "filters": [{"key": "status", "value": "ACTIVO"}]},
        headers=auth["headers"],
    )
    assert create_response.status_code == 201

    response = await client.get("/api/v1/saved-searches", headers=auth["headers"])

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert len(body["items"]) == 1
    assert set(body["items"][0]) >= {"id", "name", "filters", "created_at"}


@pytest.mark.anyio
async def test_list_saved_searches_returns_only_own_searches(client):
    user_a = await register_and_login(client, "saved-search-user-a@test.com")
    user_b = await register_and_login(client, "saved-search-user-b@test.com")

    user_a_create_response = await client.post(
        "/api/v1/saved-searches",
        json={"name": "Búsqueda A", "filters": [{"key": "status", "value": "ACTIVO"}]},
        headers=user_a["headers"],
    )
    user_b_create_response = await client.post(
        "/api/v1/saved-searches",
        json={"name": "Búsqueda B", "filters": [{"key": "entity", "value": "DANE"}]},
        headers=user_b["headers"],
    )
    assert user_a_create_response.status_code == 201
    assert user_b_create_response.status_code == 201

    response = await client.get("/api/v1/saved-searches", headers=user_a["headers"])

    assert response.status_code == 200
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["name"] == "Búsqueda A"


@pytest.mark.anyio
async def test_list_saved_searches_no_token_returns_401(client):
    response = await client.get("/api/v1/saved-searches")

    assert response.status_code == 401


@pytest.mark.anyio
async def test_delete_saved_search_returns_204(client):
    auth = await register_and_login(client, "saved-search-delete@test.com")
    create_response = await client.post(
        "/api/v1/saved-searches",
        json={"name": "Mi búsqueda", "filters": [{"key": "status", "value": "ACTIVO"}]},
        headers=auth["headers"],
    )
    assert create_response.status_code == 201
    saved_search_id = create_response.json()["id"]

    delete_response = await client.delete(f"/api/v1/saved-searches/{saved_search_id}", headers=auth["headers"])

    assert delete_response.status_code == 204
    assert delete_response.content == b""

    list_response = await client.get("/api/v1/saved-searches", headers=auth["headers"])
    assert list_response.status_code == 200
    assert list_response.json() == {"items": [], "total": 0}


@pytest.mark.anyio
async def test_delete_saved_search_other_user_returns_404(client):
    user_a = await register_and_login(client, "saved-search-owner@test.com")
    user_b = await register_and_login(client, "saved-search-other@test.com")
    create_response = await client.post(
        "/api/v1/saved-searches",
        json={"name": "Mi búsqueda", "filters": [{"key": "status", "value": "ACTIVO"}]},
        headers=user_a["headers"],
    )
    assert create_response.status_code == 201
    saved_search_id = create_response.json()["id"]

    response = await client.delete(f"/api/v1/saved-searches/{saved_search_id}", headers=user_b["headers"])

    assert response.status_code == 404


@pytest.mark.anyio
async def test_delete_saved_search_no_token_returns_401(client):
    response = await client.delete("/api/v1/saved-searches/1")

    assert response.status_code == 401
