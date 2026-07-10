from app.application.ports.bookmark_repository import BookmarkRepositoryPort
from app.application.ports.opportunity_repository import OpportunityRepositoryPort
from app.domain.bookmark import Bookmark


class CreateBookmarkUseCase:
    def __init__(
        self,
        bookmark_repository: BookmarkRepositoryPort,
        opportunity_repository: OpportunityRepositoryPort,
    ) -> None:
        self.bookmark_repository = bookmark_repository
        self.opportunity_repository = opportunity_repository

    def execute(self, user_id: int, opportunity_id: int) -> Bookmark:
        opportunity = self.opportunity_repository.find_by_id(opportunity_id)
        if opportunity is None:
            raise ValueError("opportunity not found")

        try:
            return self.bookmark_repository.create(user_id, opportunity_id)
        except ValueError as exc:
            if str(exc) == "bookmark already exists":
                raise
            raise
