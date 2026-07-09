from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.application.ports.user_repository import UserRepositoryPort
from app.application.use_cases.login_user import LoginUserUseCase
from app.application.use_cases.register_user import RegisterUserUseCase
from app.infrastructure.database.user_repository import PostgreSQLUserRepository

router = APIRouter(prefix="/auth", tags=["auth"])


def get_user_repository() -> UserRepositoryPort:
    return PostgreSQLUserRepository()


class RegisterRequest(BaseModel):
    email: str = Field(..., max_length=320)
    password: str = Field(..., min_length=8)
    full_name: str | None = Field(default=None, max_length=160)


class LoginRequest(BaseModel):
    email: str = Field(..., max_length=320)
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str | None
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def register(
    request: RegisterRequest,
    repo: UserRepositoryPort = Depends(get_user_repository),
) -> UserResponse:
    use_case = RegisterUserUseCase(repo)

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


@router.post("/login", response_model=TokenResponse)
def login(
    request: LoginRequest,
    repo: UserRepositoryPort = Depends(get_user_repository),
) -> TokenResponse:
    use_case = LoginUserUseCase(repo)

    try:
        access_token = use_case.execute(email=request.email, password=request.password)
    except ValueError as exc:
        if str(exc) == "invalid credentials":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="invalid credentials",
            ) from exc
        raise

    return TokenResponse(access_token=access_token)
