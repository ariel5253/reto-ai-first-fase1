from abc import ABC, abstractmethod

from app.domain.opportunity import PublicOpportunity


class OpportunityRepositoryPort(ABC):
    @abstractmethod
    def find_by_id(self, opportunity_id: int) -> PublicOpportunity | None:
        raise NotImplementedError
