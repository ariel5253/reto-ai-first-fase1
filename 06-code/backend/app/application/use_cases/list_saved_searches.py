from app.application.ports.saved_search_repository import SavedSearchRepositoryPort
from app.domain.saved_search import SavedSearch


class ListSavedSearchesUseCase:
    def __init__(self, repo: SavedSearchRepositoryPort) -> None:
        self.repo = repo

    def execute(self, user_id: int) -> list[SavedSearch]:
        return self.repo.list_by_user(user_id=user_id)
