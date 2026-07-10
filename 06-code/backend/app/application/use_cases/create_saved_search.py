from app.application.ports.saved_search_repository import SavedSearchRepositoryPort
from app.domain.saved_search import SavedSearch


class CreateSavedSearchUseCase:
    def __init__(self, repo: SavedSearchRepositoryPort) -> None:
        self.repo = repo

    def execute(self, user_id: int, name: str, filters: list[dict]) -> SavedSearch:
        if not name or not name.strip():
            raise ValueError("name cannot be blank")
        if not filters:
            raise ValueError("filters cannot be empty")
        return self.repo.create(user_id=user_id, name=name, filters=filters)
