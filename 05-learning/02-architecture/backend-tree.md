# Backend tree

```text
backend/
├── README.md
├── pyproject.toml
├── .env.example
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py
│   ├── domain/
│   │   └── __init__.py
│   ├── application/
│   │   ├── __init__.py
│   │   ├── ports/
│   │   │   └── __init__.py
│   │   └── use_cases/
│   │       └── __init__.py
│   ├── infrastructure/
│   │   ├── __init__.py
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   └── health.py
│   │   ├── external/
│   │   │   └── __init__.py
│   │   └── security/
│   │       └── __init__.py
│   └── interfaces/
│       ├── __init__.py
│       └── api/
│           ├── __init__.py
│           └── v1/
│               ├── __init__.py
│               ├── health.py
│               └── router.py
└── tests/
    └── test_health.py
```

## Responsibility notes

- Backend owns API, authentication, application services, use cases, repositories and external clients.
- Backend must not contain persistent seed data, demo data or test data files.
- Backend tests may create in-memory factories/mocks, but persistent seed or test datasets belong in `06-code/db/init/`.
- API handlers must delegate complex business rules to application services or use cases.
