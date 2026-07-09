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

## SECOP source of truth

Before implementing backend blocks 2+ related to opportunities, SECOP, bookmarks or saved searches, review this working Postman collection first:

```text
05-learning/04-code/integrations/SECOP II - Contratos Electrónicos.postman_collection.json
```

This collection is the current integration source of truth for how the project consumes SECOP services. It can be adjusted if needed, but backend integration must start from this artifact instead of inventing endpoint usage from scratch.
