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


def create_opportunity(
    database_url: str,
    external_id: str = "CO1.REQ.BOOKMARK.001",
    title: str = "Oportunidad pública de prueba",
    entity_name: str = "Entidad Pública de Prueba",
) -> int:
    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                insert into opportunity_source (code, name, base_url)
                values ('SECOP', 'datos.gov.co / SECOP', 'https://www.datos.gov.co')
                on conflict (code) do update set name = excluded.name
                returning id
                """
            )
            source_id = cursor.fetchone()[0]

            cursor.execute(
                """
                insert into opportunity_dataset (source_id, code, name, api_url)
                values (%s, 'SECOP_PUBLIC_OPPORTUNITIES', 'SECOP public opportunities dataset', 'https://www.datos.gov.co/resource/p6dx-8zbt.json')
                on conflict (source_id, code) do update set name = excluded.name
                returning id
                """,
                (source_id,),
            )
            dataset_id = cursor.fetchone()[0]

            normalized_name = entity_name.lower().replace(" ", "-")
            cursor.execute(
                """
                insert into contracting_entity (source_id, external_id, name, normalized_name)
                values (%s, %s, %s, %s)
                on conflict (source_id, normalized_name) do update set name = excluded.name
                returning id
                """,
                (source_id, f"ENT-{external_id}", entity_name, normalized_name),
            )
            entity_id = cursor.fetchone()[0]

            cursor.execute(
                """
                insert into opportunity_status (code, name)
                values ('Publicado', 'Publicado')
                on conflict (code) do update set name = excluded.name
                returning id
                """
            )
            status_id = cursor.fetchone()[0]

            cursor.execute(
                """
                insert into public_opportunity (
                    dataset_id,
                    external_id,
                    external_process_id,
                    entity_id,
                    status_id,
                    title,
                    description,
                    estimated_amount_cents,
                    published_at,
                    detail_url,
                    source_last_seen_at
                ) values (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    'Descripción de prueba',
                    100000,
                    '2026-07-09T00:00:00+00:00',
                    'https://example.test/opportunity',
                    now()
                )
                returning id
                """,
                (dataset_id, external_id, f"REF-{external_id}", entity_id, status_id, title),
            )
            opportunity_id = cursor.fetchone()[0]

    return int(opportunity_id)


def create_bookmark(database_url: str, user_id: int, opportunity_id: int) -> int:
    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                insert into bookmark (user_id, opportunity_id, notes)
                values (%s, %s, null)
                returning id
                """,
                (user_id, opportunity_id),
            )
            bookmark_id = cursor.fetchone()[0]
    return int(bookmark_id)


@pytest.mark.anyio
async def test_create_bookmark_returns_201(client, test_database_url):
    auth = await register_and_login(client, "bookmark-user@test.com")
    opportunity_id = create_opportunity(test_database_url)

    response = await client.post(
        "/api/v1/bookmarks",
        json={"opportunity_id": opportunity_id},
        headers=auth["headers"],
    )

    assert response.status_code == 201
    body = response.json()
    assert isinstance(body["id"], int)
    assert body["opportunity_id"] == opportunity_id
    assert "created_at" in body


@pytest.mark.anyio
async def test_create_bookmark_returns_409_on_duplicate(client, test_database_url):
    auth = await register_and_login(client, "duplicate-bookmark@test.com")
    opportunity_id = create_opportunity(test_database_url)

    first_response = await client.post(
        "/api/v1/bookmarks",
        json={"opportunity_id": opportunity_id},
        headers=auth["headers"],
    )
    second_response = await client.post(
        "/api/v1/bookmarks",
        json={"opportunity_id": opportunity_id},
        headers=auth["headers"],
    )

    assert first_response.status_code == 201
    assert second_response.status_code == 409


@pytest.mark.anyio
async def test_create_bookmark_returns_404_when_opportunity_not_found(client):
    auth = await register_and_login(client, "missing-opportunity@test.com")

    response = await client.post(
        "/api/v1/bookmarks",
        json={"opportunity_id": 999999},
        headers=auth["headers"],
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "opportunity not found"


@pytest.mark.anyio
async def test_create_bookmark_returns_401_without_token(client, test_database_url):
    opportunity_id = create_opportunity(test_database_url)

    response = await client.post(
        "/api/v1/bookmarks",
        json={"opportunity_id": opportunity_id},
    )

    assert response.status_code == 401


@pytest.mark.anyio
async def test_list_bookmarks_returns_200_with_items(client, test_database_url):
    auth = await register_and_login(client, "list-bookmarks@test.com")
    first_opportunity_id = create_opportunity(
        test_database_url,
        external_id="CO1.REQ.LIST.001",
        title="Primera oportunidad guardada",
        entity_name="Primera Entidad",
    )
    second_opportunity_id = create_opportunity(
        test_database_url,
        external_id="CO1.REQ.LIST.002",
        title="Segunda oportunidad guardada",
        entity_name="Segunda Entidad",
    )
    create_bookmark(test_database_url, auth["user"]["id"], first_opportunity_id)
    create_bookmark(test_database_url, auth["user"]["id"], second_opportunity_id)

    response = await client.get("/api/v1/bookmarks", headers=auth["headers"])

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 2
    assert len(body["items"]) == 2
    assert set(body["items"][0]) >= {
        "id",
        "opportunity_id",
        "title",
        "entity_name",
        "created_at",
    }


@pytest.mark.anyio
async def test_list_bookmarks_returns_empty_when_none(client):
    auth = await register_and_login(client, "empty-bookmarks@test.com")

    response = await client.get("/api/v1/bookmarks", headers=auth["headers"])

    assert response.status_code == 200
    assert response.json() == {"items": [], "total": 0}


@pytest.mark.anyio
async def test_list_bookmarks_returns_401_without_token(client):
    response = await client.get("/api/v1/bookmarks")

    assert response.status_code == 401


@pytest.mark.anyio
async def test_user_cannot_see_other_users_bookmarks(client, test_database_url):
    user_a = await register_and_login(client, "user-a@test.com")
    user_b = await register_and_login(client, "user-b@test.com")
    first_opportunity_id = create_opportunity(test_database_url, external_id="CO1.REQ.ISOLATION.001")
    second_opportunity_id = create_opportunity(test_database_url, external_id="CO1.REQ.ISOLATION.002")
    third_opportunity_id = create_opportunity(test_database_url, external_id="CO1.REQ.ISOLATION.003")
    create_bookmark(test_database_url, user_a["user"]["id"], first_opportunity_id)
    create_bookmark(test_database_url, user_a["user"]["id"], second_opportunity_id)
    create_bookmark(test_database_url, user_b["user"]["id"], third_opportunity_id)

    response = await client.get("/api/v1/bookmarks", headers=user_b["headers"])

    assert response.status_code == 200
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["opportunity_id"] == third_opportunity_id


@pytest.mark.anyio
async def test_delete_bookmark_returns_204(client, test_database_url):
    auth = await register_and_login(client, "delete-bookmark@test.com")
    opportunity_id = create_opportunity(test_database_url)
    bookmark_id = create_bookmark(test_database_url, auth["user"]["id"], opportunity_id)

    response = await client.delete(f"/api/v1/bookmarks/{bookmark_id}", headers=auth["headers"])

    assert response.status_code == 204
    assert response.content == b""


@pytest.mark.anyio
async def test_delete_bookmark_returns_404_when_belongs_to_other_user(client, test_database_url):
    user_a = await register_and_login(client, "owner-user@test.com")
    user_b = await register_and_login(client, "other-user@test.com")
    opportunity_id = create_opportunity(test_database_url)
    bookmark_id = create_bookmark(test_database_url, user_a["user"]["id"], opportunity_id)

    response = await client.delete(f"/api/v1/bookmarks/{bookmark_id}", headers=user_b["headers"])

    assert response.status_code == 404
    assert response.json()["detail"] == "bookmark not found"
