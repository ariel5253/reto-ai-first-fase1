from app.application.ports.user_repository import UserRepositoryPort
from app.domain.user import AppUser
from app.infrastructure.security.password import hash_password


class RegisterUserUseCase:
    def __init__(self, user_repository: UserRepositoryPort) -> None:
        self.user_repository = user_repository

    def execute(self, email: str, password: str, full_name: str | None = None) -> AppUser:
        normalized_email = email.lower()

        if len(password) < 8:
            raise ValueError("password must contain at least 8 characters")

        if self.user_repository.find_by_email(normalized_email) is not None:
            raise ValueError("email already registered")

        password_hash = hash_password(password)
        return self.user_repository.create(
            email=normalized_email,
            password_hash=password_hash,
            full_name=full_name,
        )
