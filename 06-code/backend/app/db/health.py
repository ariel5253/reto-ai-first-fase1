import psycopg

from app.core.config import get_settings


def check_database_connection() -> bool:
    """Return True when PostgreSQL responds to a minimal query."""

    settings = get_settings()
    try:
        with psycopg.connect(settings.database_url, connect_timeout=3) as connection:
            with connection.cursor() as cursor:
                cursor.execute("select 1")
                return cursor.fetchone() == (1,)
    except psycopg.Error:
        return False
