from dataclasses import dataclass
from datetime import datetime


@dataclass
class SavedSearchFilter:
    key: str
    value: str


@dataclass
class SavedSearch:
    id: int
    user_id: int
    name: str
    filters: list[SavedSearchFilter]
    created_at: datetime
