# Database implementation guide

## Responsibility

Database owns persistence and integrity.

## Must include when implementation starts

- Migrations.
- Schemas.
- Constraints.
- Indexes.
- Seeds.
- Test data.

## Rules

- PostgreSQL only for Track DEV.
- Normalize at least to 3NF unless an exception is documented.
- Seeds and persistent test datasets live in DB area, not backend or frontend.
- Integrity belongs in database constraints when applicable.
