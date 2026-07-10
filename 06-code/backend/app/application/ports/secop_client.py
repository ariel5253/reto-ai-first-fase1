from abc import ABC, abstractmethod


class SecopUnavailableError(Exception):
    """Raised when SECOP cannot be queried or parsed."""


class SecopClientPort(ABC):
    @abstractmethod
    def search(
        self,
        query: str | None,
        entity: str | None,
        status: str | None,
        page: int,
        limit: int,
    ) -> list[dict]:
        raise NotImplementedError
