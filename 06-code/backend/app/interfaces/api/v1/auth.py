from datetime import datetime

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.application.use_cases.register_user import RegisterUserUseCase
from app.infrastructure.database.user_repository import PostgreSQLUserRepository

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: str = Field(..., max_length=320)
    password: str = Field(..., min_length=8)
    full_name: str | None = Field(default=None, max_length=160)


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str | None
    created_at: datetime


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def register(request: RegisterRequest) -> UserResponse:
    user_repository = PostgreSQLUserRepository()
    use_case = RegisterUserUseCase(user_repository)

    try:
        user = use_case.execute(
            email=request.email,
            password=request.password,
            full_name=request.full_name,
        )
    except ValueError as exc:
        if str(exc) == "email already registered":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="email already registered",
            ) from exc
        raise

    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        created_at=user.created_at,
    )
