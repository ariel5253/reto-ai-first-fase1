from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Bookmark:
    id: int
    user_id: int
    opportunity_id: int
    notes: str | None
    created_at: datetime


@dataclass(frozen=True)
class BookmarkDetail:
    id: int
    opportunity_id: int
    title: str
    entity_name: str
    created_at: datetime
