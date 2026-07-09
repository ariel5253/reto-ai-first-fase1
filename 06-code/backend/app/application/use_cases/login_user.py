from app.application.ports.user_repository import UserRepositoryPort
from app.infrastructure.security.jwt import create_access_token
from app.infrastructure.security.password import verify_password


class LoginUserUseCase:
    def __init__(self, user_repository: UserRepositoryPort) -> None:
        self.user_repository = user_repository

    def execute(self, email: str, password: str) -> str:
        normalized_email = email.lower()
        user = self.user_repository.find_by_email(normalized_email)
        password_hash = self.user_repository.get_password_hash_by_email(normalized_email)

        if user is None or password_hash is None:
            raise ValueError("invalid credentials")

        if not verify_password(password, password_hash):
            raise ValueError("invalid credentials")

        return create_access_token(user_id=user.id, email=user.email)
