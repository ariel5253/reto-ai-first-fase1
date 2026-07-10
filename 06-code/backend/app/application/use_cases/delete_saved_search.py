from app.application.ports.saved_search_repository import SavedSearchRepositoryPort


class DeleteSavedSearchUseCase:
    def __init__(self, repo: SavedSearchRepositoryPort) -> None:
        self.repo = repo

    def execute(self, search_id: int, user_id: int) -> None:
        deleted = self.repo.delete(search_id=search_id, user_id=user_id)
        if not deleted:
            raise ValueError("not found")
