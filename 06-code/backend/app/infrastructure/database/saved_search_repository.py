import psycopg
from psycopg import errors
from psycopg.rows import dict_row

from app.application.ports.saved_search_repository import SavedSearchRepositoryPort
from app.core.config import get_settings
from app.domain.saved_search import SavedSearch, SavedSearchFilter


class PostgreSQLSavedSearchRepository(SavedSearchRepositoryPort):
    def create(self, user_id: int, name: str, filters: list[dict]) -> SavedSearch:
        settings = get_settings()
        try:
            with psycopg.connect(settings.database_url, row_factory=dict_row) as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        insert into saved_search (user_id, name)
                        values (%s, %s)
                        returning id, user_id, name, created_at
                        """,
                        (user_id, name),
                    )
                    saved_search_row = cursor.fetchone()
                    if saved_search_row is None:
                        raise RuntimeError("saved search insert did not return a row")

                    saved_search_id = int(saved_search_row["id"])
                    saved_filters: list[SavedSearchFilter] = []
                    for position, item in enumerate(filters, start=1):
                        key = str(item["key"])
                        value = str(item["value"])
                        cursor.execute(
                            """
                            select id
                            from search_filter_key
                            where code = %s and is_active = true
                            """,
                            (key,),
                        )
                        filter_key_row = cursor.fetchone()
                        if filter_key_row is None:
                            raise ValueError(f"unknown filter key: {key}")

                        cursor.execute(
                            """
                            insert into saved_search_filter_value (
                                saved_search_id,
                                filter_key_id,
                                filter_value,
                                value_order
                            ) values (%s, %s, %s, %s)
                            """,
                            (saved_search_id, int(filter_key_row["id"]), value, position),
                        )
                        saved_filters.append(SavedSearchFilter(key=key, value=value))

                    return SavedSearch(
                        id=saved_search_id,
                        user_id=int(saved_search_row["user_id"]),
                        name=saved_search_row["name"],
                        filters=saved_filters,
                        created_at=saved_search_row["created_at"],
                    )
        except errors.UniqueViolation as exc:
            raise ValueError("name already exists") from exc

    def list_by_user(self, user_id: int) -> list[SavedSearch]:
        settings = get_settings()
        with psycopg.connect(settings.database_url, row_factory=dict_row) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    select
                        ss.id,
                        ss.user_id,
                        ss.name,
                        ss.created_at,
                        sfk.code as filter_key,
                        ssfv.filter_value
                    from saved_search ss
                    left join saved_search_filter_value ssfv on ssfv.saved_search_id = ss.id
                    left join search_filter_key sfk on sfk.id = ssfv.filter_key_id
                    where ss.user_id = %s
                    order by ss.created_at desc, ss.id desc, ssfv.value_order
                    """,
                    (user_id,),
                )
                rows = cursor.fetchall()

        searches_by_id: dict[int, SavedSearch] = {}
        order: list[int] = []
        for row in rows:
            search_id = int(row["id"])
            if search_id not in searches_by_id:
                searches_by_id[search_id] = SavedSearch(
                    id=search_id,
                    user_id=int(row["user_id"]),
                    name=row["name"],
                    filters=[],
                    created_at=row["created_at"],
                )
                order.append(search_id)
            if row["filter_key"] is not None and row["filter_value"] is not None:
                searches_by_id[search_id].filters.append(
                    SavedSearchFilter(key=row["filter_key"], value=row["filter_value"])
                )
        return [searches_by_id[search_id] for search_id in order]

    def delete(self, search_id: int, user_id: int) -> bool:
        settings = get_settings()
        with psycopg.connect(settings.database_url, row_factory=dict_row) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    delete from saved_search
                    where id = %s and user_id = %s
                    returning id
                    """,
                    (search_id, user_id),
                )
                return cursor.fetchone() is not None
