# Integrations implementation guide

## Responsibility

Integrations document external API contracts, clients, normalization, error handling and test strategy.

## Main integration

- datos.gov.co / SECOP through backend HTTP client.

## Rules

- Frontend must not call external domain APIs directly.
- External responses must be normalized before reaching product-facing contracts.
- Timeouts, empty responses and API failures must be handled explicitly.
- Tests should use mocks or controlled fixtures, not depend on live network for every run.
