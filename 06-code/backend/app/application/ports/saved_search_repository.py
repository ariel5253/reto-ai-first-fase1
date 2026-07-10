from abc import ABC, abstractmethod

from app.domain.saved_search import SavedSearch


class SavedSearchRepositoryPort(ABC):
    @abstractmethod
    def create(self, user_id: int, name: str, filters: list[dict]) -> SavedSearch:
        raise NotImplementedError

    @abstractmethod
    def list_by_user(self, user_id: int) -> list[SavedSearch]:
        raise NotImplementedError

    @abstractmethod
    def delete(self, search_id: int, user_id: int) -> bool:
        """Return True if deleted, False if missing or not owned by user."""
        raise NotImplementedError
