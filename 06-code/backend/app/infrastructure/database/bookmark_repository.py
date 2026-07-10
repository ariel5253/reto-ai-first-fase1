import psycopg
from psycopg import errors
from psycopg.rows import dict_row

from app.application.ports.bookmark_repository import BookmarkRepositoryPort
from app.core.config import get_settings
from app.domain.bookmark import Bookmark, BookmarkDetail


class PostgreSQLBookmarkRepository(BookmarkRepositoryPort):
    def create(self, user_id: int, opportunity_id: int) -> Bookmark:
        settings = get_settings()
        try:
            with psycopg.connect(settings.database_url, row_factory=dict_row) as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        insert into bookmark (user_id, opportunity_id, notes)
                        values (%s, %s, null)
                        returning id, user_id, opportunity_id, notes, created_at
                        """,
                        (user_id, opportunity_id),
                    )
                    row = cursor.fetchone()
                    if row is None:
                        raise RuntimeError("bookmark insert did not return a row")
                    return self._row_to_bookmark(row)
        except errors.UniqueViolation as exc:
            raise ValueError("bookmark already exists") from exc

    def find_by_user(self, user_id: int) -> list[BookmarkDetail]:
        settings = get_settings()
        with psycopg.connect(settings.database_url, row_factory=dict_row) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    select
                        b.id,
                        b.opportunity_id,
                        po.title,
                        ce.name as entity_name,
                        b.created_at
                    from bookmark b
                    join public_opportunity po on po.id = b.opportunity_id
                    join contracting_entity ce on ce.id = po.entity_id
                    where b.user_id = %s
                    order by b.created_at desc, b.id desc
                    """,
                    (user_id,),
                )
                return [self._row_to_bookmark_detail(row) for row in cursor.fetchall()]

    def find_by_id_and_user(self, bookmark_id: int, user_id: int) -> Bookmark | None:
        settings = get_settings()
        with psycopg.connect(settings.database_url, row_factory=dict_row) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    select id, user_id, opportunity_id, notes, created_at
                    from bookmark
                    where id = %s and user_id = %s
                    """,
                    (bookmark_id, user_id),
                )
                row = cursor.fetchone()
                if row is None:
                    return None
                return self._row_to_bookmark(row)

    def delete(self, bookmark_id: int) -> None:
        settings = get_settings()
        with psycopg.connect(settings.database_url) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    delete from bookmark
                    where id = %s
                    """,
                    (bookmark_id,),
                )

    def _row_to_bookmark(self, row: dict) -> Bookmark:
        return Bookmark(
            id=int(row["id"]),
            user_id=int(row["user_id"]),
            opportunity_id=int(row["opportunity_id"]),
            notes=row["notes"],
            created_at=row["created_at"],
        )

    def _row_to_bookmark_detail(self, row: dict) -> BookmarkDetail:
        return BookmarkDetail(
            id=int(row["id"]),
            opportunity_id=int(row["opportunity_id"]),
            title=row["title"],
            entity_name=row["entity_name"],
            created_at=row["created_at"],
        )
