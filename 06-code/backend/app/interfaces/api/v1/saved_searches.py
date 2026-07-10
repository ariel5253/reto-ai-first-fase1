from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, Field

from app.application.ports.saved_search_repository import SavedSearchRepositoryPort
from app.application.use_cases.create_saved_search import CreateSavedSearchUseCase
from app.application.use_cases.delete_saved_search import DeleteSavedSearchUseCase
from app.application.use_cases.list_saved_searches import ListSavedSearchesUseCase
from app.infrastructure.database.saved_search_repository import PostgreSQLSavedSearchRepository
from app.infrastructure.security.auth import get_current_user

router = APIRouter(prefix="/saved-searches", tags=["saved-searches"])


def get_saved_search_repository() -> SavedSearchRepositoryPort:
    return PostgreSQLSavedSearchRepository()


class FilterItem(BaseModel):
    key: str
    value: str


class CreateSavedSearchRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    filters: list[FilterItem] = Field(..., min_length=1)


class SavedSearchResponse(BaseModel):
    id: int
    name: str
    filters: list[FilterItem]
    created_at: datetime


class SavedSearchListResponse(BaseModel):
    items: list[SavedSearchResponse]
    total: int


def _filter_item_from_domain(item: Any) -> FilterItem:
    if isinstance(item, dict):
        return FilterItem(key=item["key"], value=item["value"])
    return FilterItem(key=item.key, value=item.value)


def _response_from_domain(search: Any) -> SavedSearchResponse:
    return SavedSearchResponse(
        id=search.id,
        name=search.name,
        filters=[_filter_item_from_domain(item) for item in search.filters],
        created_at=search.created_at,
    )


@router.post("", status_code=status.HTTP_201_CREATED, response_model=SavedSearchResponse)
def create_saved_search(
    request: CreateSavedSearchRequest,
    current_user: dict = Depends(get_current_user),
    repo: SavedSearchRepositoryPort = Depends(get_saved_search_repository),
) -> SavedSearchResponse:
    use_case = CreateSavedSearchUseCase(repo)
    try:
        search = use_case.execute(
            user_id=current_user["user_id"],
            name=request.name,
            filters=[{"key": f.key, "value": f.value} for f in request.filters],
        )
    except ValueError as exc:
        if "already exists" in str(exc):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=str(exc),
            ) from exc
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc
    return _response_from_domain(search)


@router.get("", response_model=SavedSearchListResponse)
def list_saved_searches(
    current_user: dict = Depends(get_current_user),
    repo: SavedSearchRepositoryPort = Depends(get_saved_search_repository),
) -> SavedSearchListResponse:
    use_case = ListSavedSearchesUseCase(repo)
    searches = use_case.execute(user_id=current_user["user_id"])
    items = [_response_from_domain(search) for search in searches]
    return SavedSearchListResponse(items=items, total=len(items))


@router.delete("/{search_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_saved_search(
    search_id: int,
    current_user: dict = Depends(get_current_user),
    repo: SavedSearchRepositoryPort = Depends(get_saved_search_repository),
) -> Response:
    use_case = DeleteSavedSearchUseCase(repo)
    try:
        use_case.execute(search_id=search_id, user_id=current_user["user_id"])
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="not found",
        ) from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)
