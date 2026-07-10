from datetime import datetime
import re
import unicodedata

import psycopg
from psycopg.rows import dict_row

from app.application.ports.opportunity_repository import OpportunityRepositoryPort
from app.core.config import get_settings
from app.domain.opportunity import PublicOpportunity

SOURCE_CODE = "SECOP"
SOURCE_NAME = "datos.gov.co / SECOP"
SOURCE_BASE_URL = "https://www.datos.gov.co"
DATASET_CODE = "SECOP_II_CONTRATOS_ELECTRONICOS"
DATASET_NAME = "SECOP II - Contratos Electrónicos"
DATASET_API_URL = "https://www.datos.gov.co/resource/p6dx-8zbt.json"


class PostgreSQLOpportunityRepository(OpportunityRepositoryPort):
    def find_by_id(self, opportunity_id: int) -> PublicOpportunity | None:
        settings = get_settings()
        with psycopg.connect(settings.database_url, row_factory=dict_row) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    select
                        public_opportunity.id,
                        public_opportunity.title,
                        public_opportunity.description,
                        contracting_entity.name as entity_name,
                        opportunity_status.name as status,
                        public_opportunity.estimated_amount_cents,
                        public_opportunity.published_at,
                        public_opportunity.closing_at,
                        public_opportunity.detail_url,
                        public_opportunity.external_id,
                        public_opportunity.external_process_id
                    from public_opportunity
                    join contracting_entity on contracting_entity.id = public_opportunity.entity_id
                    left join opportunity_status on opportunity_status.id = public_opportunity.status_id
                    where public_opportunity.id = %s
                    """,
                    (opportunity_id,),
                )
                row = cursor.fetchone()
                if row is None:
                    return None
                return self._row_to_opportunity(row)

    def upsert(self, raw: dict) -> PublicOpportunity:
        external_id = self._clean_text(raw.get("id_del_proceso"))
        title = self._clean_text(raw.get("nombre_del_procedimiento"))
        if external_id is None or title is None:
            raise ValueError("SECOP record cannot be normalized")

        settings = get_settings()
        with psycopg.connect(settings.database_url, row_factory=dict_row) as connection:
            with connection.cursor() as cursor:
                source_id = self._ensure_source(cursor)
                dataset_id = self._ensure_dataset(cursor, source_id)
                entity_id = self._ensure_entity(cursor, source_id, raw)
                status_id = self._ensure_status(cursor, raw)

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
                        %(dataset_id)s,
                        %(external_id)s,
                        %(external_process_id)s,
                        %(entity_id)s,
                        %(status_id)s,
                        %(title)s,
                        %(description)s,
                        %(estimated_amount_cents)s,
                        %(published_at)s,
                        %(closing_at)s,
                        %(detail_url)s,
                        now()
                    )
                    on conflict (dataset_id, external_id) do update
                    set external_process_id = excluded.external_process_id,
                        entity_id = excluded.entity_id,
                        status_id = excluded.status_id,
                        title = excluded.title,
                        description = excluded.description,
                        estimated_amount_cents = excluded.estimated_amount_cents,
                        published_at = excluded.published_at,
                        closing_at = excluded.closing_at,
                        detail_url = excluded.detail_url,
                        source_last_seen_at = now(),
                        updated_at = now()
                    returning id
                    """,
                    {
                        "dataset_id": dataset_id,
                        "external_id": external_id,
                        "external_process_id": self._clean_text(raw.get("referencia_del_proceso")),
                        "entity_id": entity_id,
                        "status_id": status_id,
                        "title": title,
                        "description": self._clean_text(raw.get("descripci_n_del_procedimiento")),
                        "estimated_amount_cents": self._parse_amount_cents(raw.get("precio_base")),
                        "published_at": self._parse_datetime(raw.get("fecha_de_publicacion_del")),
                        "closing_at": None,
                        "detail_url": self._extract_detail_url(raw),
                    },
                )
                opportunity_id = cursor.fetchone()["id"]
                connection.commit()

        opportunity = self.find_by_id(int(opportunity_id))
        if opportunity is None:
            raise ValueError("normalized opportunity not found")
        return opportunity

    def _ensure_source(self, cursor) -> int:
        cursor.execute(
            """
            insert into opportunity_source (code, name, base_url)
            values (%s, %s, %s)
            on conflict (code) do update
            set name = excluded.name,
                base_url = excluded.base_url
            returning id
            """,
            (SOURCE_CODE, SOURCE_NAME, SOURCE_BASE_URL),
        )
        return int(cursor.fetchone()["id"])

    def _ensure_dataset(self, cursor, source_id: int) -> int:
        cursor.execute(
            """
            insert into opportunity_dataset (source_id, code, name, api_url)
            values (%s, %s, %s, %s)
            on conflict (source_id, code) do update
            set name = excluded.name,
                api_url = excluded.api_url
            returning id
            """,
            (source_id, DATASET_CODE, DATASET_NAME, DATASET_API_URL),
        )
        return int(cursor.fetchone()["id"])

    def _ensure_entity(self, cursor, source_id: int, raw: dict) -> int:
        name = self._clean_text(raw.get("entidad")) or "Entidad no definida"
        external_id = self._clean_text(raw.get("codigo_entidad")) or self._clean_text(raw.get("nit_entidad"))
        normalized_name = self._normalize_text(name)
        cursor.execute(
            """
            insert into contracting_entity (source_id, external_id, name, normalized_name)
            values (%s, %s, %s, %s)
            on conflict (source_id, normalized_name) do update
            set external_id = coalesce(contracting_entity.external_id, excluded.external_id),
                name = excluded.name,
                updated_at = now()
            returning id
            """,
            (source_id, external_id, name, normalized_name),
        )
        return int(cursor.fetchone()["id"])

    def _ensure_status(self, cursor, raw: dict) -> int | None:
        status = self._clean_text(raw.get("estado_del_procedimiento"))
        if status is None:
            return None
        cursor.execute(
            """
            insert into opportunity_status (code, name)
            values (%s, %s)
            on conflict (code) do update
            set name = excluded.name
            returning id
            """,
            (status, status),
        )
        return int(cursor.fetchone()["id"])

    def _row_to_opportunity(self, row: dict) -> PublicOpportunity:
        return PublicOpportunity(
            id=int(row["id"]),
            title=str(row["title"]),
            description=row["description"],
            entity_name=str(row["entity_name"]),
            status=row["status"],
            estimated_amount_cents=row["estimated_amount_cents"],
            published_at=row["published_at"],
            closing_at=row["closing_at"],
            detail_url=row["detail_url"],
            external_id=str(row["external_id"]),
            external_process_id=row["external_process_id"],
        )

    def _clean_text(self, value) -> str | None:
        if value is None:
            return None
        text = str(value).strip()
        if text == "" or text.lower() in {"no definido", "no adjudicado"}:
            return None
        return text

    def _normalize_text(self, value: str) -> str:
        normalized = unicodedata.normalize("NFKD", value)
        ascii_text = "".join(char for char in normalized if not unicodedata.combining(char))
        return re.sub(r"[^a-z0-9]+", " ", ascii_text.lower()).strip()

    def _parse_amount_cents(self, value) -> int | None:
        text = self._clean_text(value)
        if text is None:
            return None
        try:
            amount = int(text)
        except ValueError:
            return None
        if amount < 0:
            return None
        return amount * 100

    def _parse_datetime(self, value) -> datetime | None:
        text = self._clean_text(value)
        if text is None:
            return None
        try:
            return datetime.fromisoformat(text.replace("Z", "+00:00"))
        except ValueError:
            return None

    def _extract_detail_url(self, raw: dict) -> str | None:
        url_process = raw.get("urlproceso")
        if isinstance(url_process, dict):
            return self._clean_text(url_process.get("url"))
        return None
