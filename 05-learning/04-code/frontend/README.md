# Frontend implementation guide

## Responsibility

Frontend owns presentation, navigation, forms, visual state and backend API consumption.

## Must include when implementation starts

- Pages.
- Components.
- API services/client.
- Hooks.
- Types.
- UI state handling.

## Rules

- No critical business rules in frontend.
- No direct PostgreSQL access.
- No direct datos.gov.co / SECOP calls.
- Frontend validations are UX helpers; backend/database revalidate critical rules.
