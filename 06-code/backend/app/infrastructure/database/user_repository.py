import psycopg
from psycopg import errors
from psycopg.rows import dict_row

from app.application.ports.user_repository import UserRepositoryPort
from app.core.config import get_settings
from app.domain.user import AppUser


class PostgreSQLUserRepository(UserRepositoryPort):
    def create(self, email: str, password_hash: str, full_name: str | None) -> AppUser:
        settings = get_settings()
        try:
            with psycopg.connect(settings.database_url, row_factory=dict_row) as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        insert into app_user (email, password_hash, full_name)
                        values (%s, %s, %s)
                        returning id, email, full_name, is_active, created_at, updated_at
                        """,
                        (email, password_hash, full_name),
                    )
                    row = cursor.fetchone()
                    if row is None:
                        raise RuntimeError("user insert did not return a row")
                    return self._row_to_user(row)
        except errors.UniqueViolation as exc:
            raise ValueError("email already registered") from exc

    def find_by_email(self, email: str) -> AppUser | None:
        settings = get_settings()
        with psycopg.connect(settings.database_url, row_factory=dict_row) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    select id, email, full_name, is_active, created_at, updated_at
                    from app_user
                    where email = %s
                    """,
                    (email,),
                )
                row = cursor.fetchone()
                if row is None:
                    return None
                return self._row_to_user(row)

    def _row_to_user(self, row: dict) -> AppUser:
        return AppUser(
            id=int(row["id"]),
            email=row["email"],
            full_name=row["full_name"],
            is_active=row["is_active"],
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )
