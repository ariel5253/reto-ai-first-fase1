from app.application.ports.bookmark_repository import BookmarkRepositoryPort
from app.domain.bookmark import BookmarkDetail


class ListBookmarksUseCase:
    def __init__(self, bookmark_repository: BookmarkRepositoryPort) -> None:
        self.bookmark_repository = bookmark_repository

    def execute(self, user_id: int) -> list[BookmarkDetail]:
        return self.bookmark_repository.find_by_user(user_id)
