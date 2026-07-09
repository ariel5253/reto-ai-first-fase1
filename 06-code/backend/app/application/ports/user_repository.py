from abc import ABC, abstractmethod

from app.domain.user import AppUser


class UserRepositoryPort(ABC):
    @abstractmethod
    def create(self, email: str, password_hash: str, full_name: str | None) -> AppUser:
        raise NotImplementedError

    @abstractmethod
    def find_by_email(self, email: str) -> AppUser | None:
        raise NotImplementedError
