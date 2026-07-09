from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.db.health import check_database_connection

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def health() -> JSONResponse:
    if check_database_connection():
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"status": "ok", "database": "ok"},
        )

    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"status": "error", "database": "unavailable"},
    )
