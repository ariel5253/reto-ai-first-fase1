import importlib

import httpx
import pytest


@pytest.fixture
def health_module(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "postgresql://unit-test-host/not-used")
    return importlib.import_module("app.api.v1.health")


@pytest.fixture
def app_module(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "postgresql://unit-test-host/not-used")
    return importlib.import_module("app.main")


@pytest.mark.anyio
async def test_health_returns_ok_when_database_is_available(app_module, health_module, monkeypatch):
    monkeypatch.setattr(health_module, "check_database_connection", lambda: True)
    transport = httpx.ASGITransport(app=app_module.create_app())

    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok"}


@pytest.mark.anyio
async def test_health_returns_503_when_database_is_unavailable(app_module, health_module, monkeypatch):
    monkeypatch.setattr(health_module, "check_database_connection", lambda: False)
    transport = httpx.ASGITransport(app=app_module.create_app())

    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.get("/api/health")

    assert response.status_code == 503
    assert response.json() == {"status": "error", "database": "unavailable"}
