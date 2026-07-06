# Backend tree

```text
backend/
├── README.md
├── pyproject.toml
├── .env.example
├── app/
│   ├── main.py
│   ├── core/
│   │   └── .gitkeep
│   ├── domain/
│   │   └── .gitkeep
│   ├── application/
│   │   ├── ports/
│   │   │   └── .gitkeep
│   │   └── use_cases/
│   │       └── .gitkeep
│   ├── infrastructure/
│   │   ├── database/
│   │   │   └── .gitkeep
│   │   ├── external/
│   │   │   └── .gitkeep
│   │   └── security/
│   │       └── .gitkeep
│   └── interfaces/
│       └── api/
│           └── .gitkeep
└── tests/
    ├── unit/
    │   └── .gitkeep
    └── integration/
        └── .gitkeep
```

## Responsibility notes

- Backend owns API, authentication, application services, use cases, repositories and external clients.
- Backend must not contain persistent seed data, demo data or test data files.
- Backend tests may create in-memory factories/mocks, but persistent seed or test datasets belong in `db/seeds/` or `db/test-data/`.
- API handlers must delegate complex business rules to application services or use cases.
