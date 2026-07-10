from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel

from app.application.ports.bookmark_repository import BookmarkRepositoryPort
from app.application.ports.opportunity_repository import OpportunityRepositoryPort
from app.application.use_cases.create_bookmark import CreateBookmarkUseCase
from app.application.use_cases.delete_bookmark import DeleteBookmarkUseCase
from app.application.use_cases.list_bookmarks import ListBookmarksUseCase
from app.infrastructure.database.bookmark_repository import PostgreSQLBookmarkRepository
from app.infrastructure.database.opportunity_repository import PostgreSQLOpportunityRepository
from app.infrastructure.security.auth import get_current_user

router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])


class CreateBookmarkRequest(BaseModel):
    opportunity_id: int


class BookmarkResponse(BaseModel):
    id: int
    opportunity_id: int
    notes: str | None
    created_at: datetime


class BookmarkItemResponse(BaseModel):
    id: int
    opportunity_id: int
    title: str
    entity_name: str
    created_at: datetime


class BookmarkListResponse(BaseModel):
    items: list[BookmarkItemResponse]
    total: int


def get_bookmark_repository() -> BookmarkRepositoryPort:
    return PostgreSQLBookmarkRepository()


def get_opportunity_repository() -> OpportunityRepositoryPort:
    return PostgreSQLOpportunityRepository()


@router.post("", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
def create_bookmark(
    request: CreateBookmarkRequest,
    current_user: dict[str, Any] = Depends(get_current_user),
    bookmark_repository: BookmarkRepositoryPort = Depends(get_bookmark_repository),
    opportunity_repository: OpportunityRepositoryPort = Depends(get_opportunity_repository),
) -> BookmarkResponse:
    use_case = CreateBookmarkUseCase(bookmark_repository, opportunity_repository)
    try:
        bookmark = use_case.execute(
            user_id=int(current_user["user_id"]),
            opportunity_id=request.opportunity_id,
        )
    except ValueError as exc:
        if str(exc) == "opportunity not found":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="opportunity not found",
            ) from exc
        if str(exc) == "bookmark already exists":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="bookmark already exists",
            ) from exc
        raise

    return BookmarkResponse(
        id=bookmark.id,
        opportunity_id=bookmark.opportunity_id,
        notes=bookmark.notes,
        created_at=bookmark.created_at,
    )


@router.get("", response_model=BookmarkListResponse)
def list_bookmarks(
    current_user: dict[str, Any] = Depends(get_current_user),
    bookmark_repository: BookmarkRepositoryPort = Depends(get_bookmark_repository),
) -> BookmarkListResponse:
    use_case = ListBookmarksUseCase(bookmark_repository)
    bookmarks = use_case.execute(user_id=int(current_user["user_id"]))
    items = [
        BookmarkItemResponse(
            id=bookmark.id,
            opportunity_id=bookmark.opportunity_id,
            title=bookmark.title,
            entity_name=bookmark.entity_name,
            created_at=bookmark.created_at,
        )
        for bookmark in bookmarks
    ]
    return BookmarkListResponse(items=items, total=len(items))


@router.delete("/{bookmark_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bookmark(
    bookmark_id: int,
    current_user: dict[str, Any] = Depends(get_current_user),
    bookmark_repository: BookmarkRepositoryPort = Depends(get_bookmark_repository),
) -> Response:
    use_case = DeleteBookmarkUseCase(bookmark_repository)
    try:
        use_case.execute(bookmark_id=bookmark_id, user_id=int(current_user["user_id"]))
    except ValueError as exc:
        if str(exc) == "bookmark not found":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="bookmark not found",
            ) from exc
        raise
    return Response(status_code=status.HTTP_204_NO_CONTENT)
