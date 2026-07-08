# Backend implementation guide

## Responsibility

Backend owns API, authentication, authorization, use cases, repositories and orchestration of external integrations.

## Must include when implementation starts

- FastAPI entrypoint.
- API routes/controllers.
- Application services or use cases.
- Domain models/schemas.
- Repositories or data access layer.
- SECOP client orchestration.
- API tests with pytest + httpx.

## Rules

- No persistent seed/demo/test data in backend.
- No synthetic DEV data hardcoded in backend code, routes, services, repositories or tests. Synthetic data must be loaded only from DB SQL scripts under `codigo/db/init/`.
- API handlers must delegate complex business rules.
- Backend revalidates critical rules even if frontend validates UX.
- Backend is the only layer that talks to datos.gov.co / SECOP.
