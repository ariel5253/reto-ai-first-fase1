from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class AppUser:
    id: int
    email: str
    full_name: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime
