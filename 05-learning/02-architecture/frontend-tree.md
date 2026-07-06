# Frontend tree

```text
frontend/
├── README.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx
    ├── app.tsx
    ├── routes/
    │   └── .gitkeep
    ├── pages/
    │   └── .gitkeep
    ├── components/
    │   └── .gitkeep
    ├── services/
    │   └── .gitkeep
    ├── hooks/
    │   └── .gitkeep
    ├── store/
    │   └── .gitkeep
    ├── types/
    │   └── .gitkeep
    ├── utils/
    │   └── .gitkeep
    └── styles/
        └── .gitkeep
```

## Responsibility notes

- Frontend owns presentation, navigation, forms, visual state and API consumption.
- Frontend must not contain critical business rules.
- Frontend must not access PostgreSQL or datos.gov.co / SECOP directly.
- Frontend validations are UX helpers only; backend and database must revalidate critical rules.
