import psycopg
from psycopg.rows import dict_row

from app.application.ports.opportunity_repository import OpportunityRepositoryPort
from app.core.config import get_settings
from app.domain.opportunity import PublicOpportunity


class PostgreSQLOpportunityRepository(OpportunityRepositoryPort):
    def find_by_id(self, opportunity_id: int) -> PublicOpportunity | None:
        settings = get_settings()
        with psycopg.connect(settings.database_url, row_factory=dict_row) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    select
                        po.id,
                        po.title,
                        po.description,
                        ce.name as entity_name,
                        os.name as status,
                        po.estimated_amount_cents,
                        po.published_at,
                        po.closing_at,
                        po.detail_url,
                        po.external_id,
                        po.external_process_id
                    from public_opportunity po
                    join contracting_entity ce on ce.id = po.entity_id
                    join opportunity_status os on os.id = po.status_id
                    where po.id = %s
                    """,
                    (opportunity_id,),
                )
                row = cursor.fetchone()
                if row is None:
                    return None
                return PublicOpportunity(
                    id=int(row["id"]),
                    title=row["title"],
                    description=row["description"],
                    entity_name=row["entity_name"],
                    status=row["status"],
                    estimated_amount_cents=(
                        int(row["estimated_amount_cents"])
                        if row["estimated_amount_cents"] is not None
                        else None
                    ),
                    published_at=row["published_at"],
                    closing_at=row["closing_at"],
                    detail_url=row["detail_url"],
                    external_id=row["external_id"],
                    external_process_id=row["external_process_id"],
                )
