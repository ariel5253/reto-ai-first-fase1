# Database tree

```text
db/
├── README.md
├── migrations/
│   └── .gitkeep
├── seeds/
│   └── .gitkeep
├── test-data/
│   └── .gitkeep
├── schemas/
│   └── .gitkeep
├── indexes/
│   └── .gitkeep
└── scripts/
    └── .gitkeep
```

## Responsibility notes

- Database owns PostgreSQL schema, migrations, constraints, indexes, seeds and controlled test datasets.
- Tables must be normalized at least to Third Normal Form (3NF), unless an exception is explicitly documented.
- Persistent data integrity must be protected with database constraints when applicable.
