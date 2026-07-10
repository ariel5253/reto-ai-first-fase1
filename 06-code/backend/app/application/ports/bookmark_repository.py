from abc import ABC, abstractmethod

from app.domain.bookmark import Bookmark, BookmarkDetail


class BookmarkRepositoryPort(ABC):
    @abstractmethod
    def create(self, user_id: int, opportunity_id: int) -> Bookmark:
        raise NotImplementedError

    @abstractmethod
    def find_by_user(self, user_id: int) -> list[BookmarkDetail]:
        raise NotImplementedError

    @abstractmethod
    def find_by_id_and_user(self, bookmark_id: int, user_id: int) -> Bookmark | None:
        raise NotImplementedError

    @abstractmethod
    def delete(self, bookmark_id: int) -> None:
        raise NotImplementedError
