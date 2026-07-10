from app.application.ports.opportunity_repository import OpportunityRepositoryPort
from app.domain.opportunity import PublicOpportunity


class GetOpportunityUseCase:
    def __init__(self, opportunity_repository: OpportunityRepositoryPort) -> None:
        self._opportunity_repository = opportunity_repository

    def execute(self, opportunity_id: int) -> PublicOpportunity:
        opportunity = self._opportunity_repository.find_by_id(opportunity_id)
        if opportunity is None:
            raise ValueError("opportunity not found")
        return opportunity
