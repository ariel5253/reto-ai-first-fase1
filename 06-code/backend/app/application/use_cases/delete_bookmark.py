from app.application.ports.bookmark_repository import BookmarkRepositoryPort


class DeleteBookmarkUseCase:
    def __init__(self, bookmark_repository: BookmarkRepositoryPort) -> None:
        self.bookmark_repository = bookmark_repository

    def execute(self, bookmark_id: int, user_id: int) -> None:
        bookmark = self.bookmark_repository.find_by_id_and_user(bookmark_id, user_id)
        if bookmark is None:
            raise ValueError("bookmark not found")
        self.bookmark_repository.delete(bookmark_id)
