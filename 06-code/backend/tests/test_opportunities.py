from pathlib import Path
from urllib.parse import urlparse, urlunparse

import httpx
import psycopg
import pytest
from psycopg import sql

from app.core.config import get_settings

SCHEMA_PATH = Path(__file__).resolve().parents[2] / "db" / "init" / "01-schema.sql"
DEFAULT_TEST_DATABASE_URL = "postgresql://admin:abcd1234@localhost:5432/portal_convocatorias_test"

SECOP_VALID_RECORD = {
    "entidad": "DEPARTAMENTO ADMINISTRATIVO NACIONAL DE ESTADISTICA (DANE)",
    "nit_entidad": "899999027",
    "codigo_entidad": "700474109",
    "id_del_proceso": "CO1.REQ.2577563",
    "referencia_del_proceso": "EDP-545-2022",
    "nombre_del_procedimiento": "Prestación de servicios profesionales para procesar información GEIH",
    "descripci_n_del_procedimiento": "Prestación de servicios profesionales para procesar la información de la GEIH.",
    "fase": "Presentación de oferta",
    "fecha_de_publicacion_del": "2022-01-18T00:00:00.000",
    "precio_base": "57333333",
    "estado_del_procedimiento": "Seleccionado",
    "id_estado_del_procedimiento": "70",
    "modalidad_de_contratacion": "Contratación directa",
    "tipo_de_contrato": "Prestación de servicios",
    "urlproceso": {
        "url": "https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.2597221"
    },
    "estado_resumen": "Presentación de oferta",
}


class FakeSecopResponse:
    def __init__(self, status_code: int = 200, json_data=None, text: str = ""):
        self.status_code = status_code
        self._json_data = json_data
        self.text = text

    def raise_for_status(self) -> None:
        if self.status_code >= 400:
            raise httpx.HTTPStatusError(
                "SECOP error",
                request=httpx.Request("GET", "https://www.datos.gov.co/resource/p6dx-8zbt.json"),
                response=httpx.Response(self.status_code),
            )

    def json(self):
        if self._json_data is None:
            raise ValueError("invalid json")
        return self._json_data


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


@pytest.fixture
def mock_secop_success(monkeypatch):
    def apply(records):
        def fake_get(self, url, **kwargs):
            return FakeSecopResponse(status_code=200, json_data=records)

        monkeypatch.setattr(httpx.Client, "get", fake_get)

    return apply


@pytest.fixture
def existing_opportunity_id(test_database_url):
    with psycopg.connect(test_database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                insert into opportunity_source (code, name, base_url)
                values ('SECOP', 'datos.gov.co / SECOP', 'https://www.datos.gov.co')
                returning id
                """
            )
            source_id = cursor.fetchone()[0]

            cursor.execute(
                """
                insert into opportunity_dataset (source_id, code, name, api_url)
                values (%s, 'SECOP_II_CONTRATOS_ELECTRONICOS', 'SECOP II - Contratos Electrónicos', 'https://www.datos.gov.co/resource/p6dx-8zbt.json')
                returning id
                """,
                (source_id,),
            )
            dataset_id = cursor.fetchone()[0]

            cursor.execute(
                """
                insert into contracting_entity (source_id, external_id, name, normalized_name)
                values (%s, '700474109', 'DEPARTAMENTO ADMINISTRATIVO NACIONAL DE ESTADISTICA (DANE)', 'departamento administrativo nacional de estadistica dane')
                returning id
                """,
                (source_id,),
            )
            entity_id = cursor.fetchone()[0]

            cursor.execute(
                """
                insert into opportunity_status (code, name)
                values ('Seleccionado', 'Seleccionado')
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
                    closing_at,
                    detail_url,
                    source_last_seen_at
                ) values (
                    %s,
                    'CO1.REQ.2577563',
                    'EDP-545-2022',
                    %s,
                    %s,
                    'Prestación de servicios profesionales para procesar información GEIH',
                    'Prestación de servicios profesionales para procesar la información de la GEIH.',
                    5733333300,
                    '2022-01-18T00:00:00+00:00',
                    null,
                    'https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.2597221',
                    now()
                )
                returning id
                """,
                (dataset_id, entity_id, status_id),
            )
            opportunity_id = cursor.fetchone()[0]

    return opportunity_id


@pytest.mark.anyio
async def test_search_opportunities_returns_200_with_items(client, mock_secop_success):
    mock_secop_success([SECOP_VALID_RECORD])

    response = await client.get("/api/v1/opportunities")

    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["items"], list)
    assert isinstance(body["total"], int)
    assert body["items"]
    item = body["items"][0]
    assert set(item) >= {
        "id",
        "title",
        "entity_name",
        "status",
        "estimated_amount_cents",
        "published_at",
        "closing_at",
        "detail_url",
    }


@pytest.mark.anyio
async def test_search_opportunities_with_entity_filter(client, mock_secop_success):
    mock_secop_success([SECOP_VALID_RECORD])

    response = await client.get("/api/v1/opportunities?entity=DANE")

    assert response.status_code == 200
    assert response.json()["items"]


@pytest.mark.anyio
async def test_search_opportunities_returns_empty_list_when_no_results(client, mock_secop_success):
    mock_secop_success([])

    response = await client.get("/api/v1/opportunities?query=xyznotexists")

    assert response.status_code == 200
    assert response.json() == {"items": [], "total": 0}


@pytest.mark.anyio
async def test_get_opportunity_detail_returns_200(client, existing_opportunity_id):
    response = await client.get(f"/api/v1/opportunities/{existing_opportunity_id}")

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == existing_opportunity_id
    assert set(body) >= {
        "id",
        "title",
        "description",
        "entity_name",
        "status",
        "estimated_amount_cents",
        "published_at",
        "detail_url",
        "external_id",
        "external_process_id",
    }


@pytest.mark.anyio
async def test_get_opportunity_detail_returns_404_when_not_found(client):
    response = await client.get("/api/v1/opportunities/999999")

    assert response.status_code == 404
    assert response.json()["detail"] == "opportunity not found"


@pytest.mark.anyio
async def test_search_returns_503_when_secop_times_out(client, monkeypatch):
    def fake_get(self, url, **kwargs):
        raise httpx.TimeoutException("SECOP timeout")

    monkeypatch.setattr(httpx.Client, "get", fake_get)

    response = await client.get("/api/v1/opportunities")

    assert response.status_code == 503


@pytest.mark.anyio
async def test_search_returns_503_when_secop_returns_500(client, monkeypatch):
    def fake_get(self, url, **kwargs):
        return FakeSecopResponse(status_code=500, json_data={"error": "server error"})

    monkeypatch.setattr(httpx.Client, "get", fake_get)

    response = await client.get("/api/v1/opportunities")

    assert response.status_code == 503


@pytest.mark.anyio
async def test_search_returns_503_when_secop_returns_invalid_json(client, monkeypatch):
    def fake_get(self, url, **kwargs):
        return FakeSecopResponse(status_code=200, json_data=None, text="not json")

    monkeypatch.setattr(httpx.Client, "get", fake_get)

    response = await client.get("/api/v1/opportunities")

    assert response.status_code == 503
