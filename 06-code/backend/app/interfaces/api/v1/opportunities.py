from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from app.application.ports.opportunity_repository import OpportunityRepositoryPort
from app.application.ports.secop_client import SecopClientPort, SecopUnavailableError
from app.application.use_cases.get_opportunity import GetOpportunityUseCase
from app.application.use_cases.search_opportunities import SearchOpportunitiesUseCase
from app.domain.opportunity import PublicOpportunity
from app.infrastructure.database.opportunity_repository import PostgreSQLOpportunityRepository
from app.infrastructure.external.secop_client import HttpSecopClient

router = APIRouter(prefix="/opportunities", tags=["opportunities"])


def get_secop_client() -> SecopClientPort:
    return HttpSecopClient()


def get_opportunity_repository() -> OpportunityRepositoryPort:
    return PostgreSQLOpportunityRepository()


class OpportunityItem(BaseModel):
    id: int
    title: str
    entity_name: str
    status: str | None
    estimated_amount_cents: int | None
    published_at: datetime | None
    closing_at: datetime | None
    detail_url: str | None


class OpportunitiesResponse(BaseModel):
    items: list[OpportunityItem]
    total: int


class OpportunityDetail(BaseModel):
    id: int
    title: str
    description: str | None
    entity_name: str
    status: str | None
    estimated_amount_cents: int | None
    published_at: datetime | None
    closing_at: datetime | None = None
    detail_url: str | None
    external_id: str
    external_process_id: str | None


def _to_item(opportunity: PublicOpportunity) -> OpportunityItem:
    return OpportunityItem(
        id=opportunity.id,
        title=opportunity.title,
        entity_name=opportunity.entity_name,
        status=opportunity.status,
        estimated_amount_cents=opportunity.estimated_amount_cents,
        published_at=opportunity.published_at,
        closing_at=opportunity.closing_at,
        detail_url=opportunity.detail_url,
    )


def _to_detail(opportunity: PublicOpportunity) -> OpportunityDetail:
    return OpportunityDetail(
        id=opportunity.id,
        title=opportunity.title,
        description=opportunity.description,
        entity_name=opportunity.entity_name,
        status=opportunity.status,
        estimated_amount_cents=opportunity.estimated_amount_cents,
        published_at=opportunity.published_at,
        closing_at=opportunity.closing_at,
        detail_url=opportunity.detail_url,
        external_id=opportunity.external_id,
        external_process_id=opportunity.external_process_id,
    )


@router.get("", response_model=OpportunitiesResponse)
def search_opportunities(
    query: str | None = None,
    entity: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1),
    secop_client: SecopClientPort = Depends(get_secop_client),
    repository: OpportunityRepositoryPort = Depends(get_opportunity_repository),
) -> OpportunitiesResponse:
    use_case = SearchOpportunitiesUseCase(secop_client, repository)
    try:
        opportunities = use_case.execute(
            query=query,
            entity=entity,
            status=status_filter,
            page=page,
            limit=limit,
        )
    except SecopUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="SECOP unavailable",
        ) from exc

    items = [_to_item(opportunity) for opportunity in opportunities]
    return OpportunitiesResponse(items=items, total=len(items))


@router.get("/{opportunity_id}", response_model=OpportunityDetail)
def get_opportunity_detail(
    opportunity_id: int,
    repository: OpportunityRepositoryPort = Depends(get_opportunity_repository),
) -> OpportunityDetail:
    use_case = GetOpportunityUseCase(repository)
    try:
        opportunity = use_case.execute(opportunity_id)
    except ValueError as exc:
        if str(exc) == "opportunity not found":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="opportunity not found",
            ) from exc
        raise
    return _to_detail(opportunity)
