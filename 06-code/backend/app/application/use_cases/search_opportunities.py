from app.application.ports.opportunity_repository import OpportunityRepositoryPort
from app.application.ports.secop_client import SecopClientPort
from app.domain.opportunity import PublicOpportunity


class SearchOpportunitiesUseCase:
    def __init__(
        self,
        secop_client: SecopClientPort,
        opportunity_repository: OpportunityRepositoryPort,
    ) -> None:
        self._secop_client = secop_client
        self._opportunity_repository = opportunity_repository

    def execute(
        self,
        query: str | None,
        entity: str | None,
        status: str | None,
        page: int,
        limit: int,
    ) -> list[PublicOpportunity]:
        raw_records = self._secop_client.search(
            query=query,
            entity=entity,
            status=status,
            page=page,
            limit=limit,
        )
        return [self._opportunity_repository.upsert(raw) for raw in raw_records]
