import json

import httpx

from app.application.ports.secop_client import SecopClientPort, SecopUnavailableError
from app.core.config import get_settings


class HttpSecopClient(SecopClientPort):
    def search(
        self,
        query: str | None,
        entity: str | None,
        status: str | None,
        page: int,
        limit: int,
    ) -> list[dict]:
        settings = get_settings()
        params = self._build_params(
            query=query,
            entity=entity,
            status=status,
            page=page,
            limit=limit,
        )

        try:
            with httpx.Client(timeout=settings.secop_timeout_seconds) as client:
                response = client.get(settings.secop_base_url, params=params)
                if response.status_code >= 500:
                    raise SecopUnavailableError("SECOP unavailable")
                if response.status_code >= 400:
                    return []
                payload = response.json()
        except httpx.TimeoutException as exc:
            raise SecopUnavailableError("SECOP unavailable") from exc
        except (httpx.HTTPError, json.JSONDecodeError, ValueError) as exc:
            raise SecopUnavailableError("SECOP unavailable") from exc

        if not isinstance(payload, list):
            raise SecopUnavailableError("SECOP unavailable")
        return payload

    def _build_params(
        self,
        query: str | None,
        entity: str | None,
        status: str | None,
        page: int,
        limit: int,
    ) -> dict[str, str | int]:
        safe_page = max(page, 1)
        safe_limit = max(limit, 1)
        params: dict[str, str | int] = {
            "$limit": safe_limit,
            "$offset": (safe_page - 1) * safe_limit,
        }
        where_clauses = self._build_where_clauses(query=query, entity=entity, status=status)
        if where_clauses:
            params["$where"] = " AND ".join(where_clauses)
        return params

    def _build_where_clauses(
        self,
        query: str | None,
        entity: str | None,
        status: str | None,
    ) -> list[str]:
        where_clauses: list[str] = []
        if entity:
            where_clauses.append(f"upper(entidad) like '%{self._escape(entity).upper()}%'")
        if query:
            escaped_query = self._escape(query).upper()
            where_clauses.append(
                "("
                f"upper(nombre_del_procedimiento) like '%{escaped_query}%' "
                "OR "
                f"upper(descripci_n_del_procedimiento) like '%{escaped_query}%'"
                ")"
            )
        if status:
            where_clauses.append(f"estado_del_procedimiento='{self._escape(status)}'")
        return where_clauses

    def _escape(self, value: str) -> str:
        return value.replace("'", "''")
