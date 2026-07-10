from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class PublicOpportunity:
    id: int
    title: str
    description: str | None
    entity_name: str
    status: str
    estimated_amount_cents: int | None
    published_at: datetime | None
    closing_at: datetime | None
    detail_url: str | None
    external_id: str
    external_process_id: str | None
