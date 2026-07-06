# Testing implementation guide

## Responsibility

Testing verifies API contracts, business rules, persistence behavior and integration failure modes.

## Base strategy

- API tests: pytest + httpx.
- Backend tests: unit and integration where needed.
- DB tests: migrations, constraints and seed/test-data consistency.
- Frontend tests: optional until implementation scope is approved.
- E2E: out of scope by default unless explicitly approved.

## Rules

- Tests must not depend on order of execution.
- Persistent test datasets belong in DB area.
- Network integrations should be mocked or controlled.
- Every HU should have verification mapped in `03-requirements/acceptance-criteria.md`.
