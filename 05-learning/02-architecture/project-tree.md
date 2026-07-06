# Project tree

> Fuente de verdad para la estructura general del proyecto DEV y la organización documental de `05-learning/`. Esta arquitectura no implica crear código de producto durante la fase de planificación.

```text
track-dev/
├── SOUL.md
├── README.md
├── docs/
│   └── .gitkeep
├── backend/
├── frontend/
└── db/
```

```text
05-learning/
├── README.md
├── skills.md
├── 00-traceability/
│   ├── change-guardian.md
│   └── change-log.md
├── 01-planning/
│   ├── canonical-ai-first-phase1-challenge-plan.md
│   ├── ai-first-challenge-best-practices.md
│   ├── ai-first-challenge-tech-stack.md
│   ├── governance.md
│   ├── delivery-checklist.md
│   └── daily-checkpoints.md
├── 02-architecture/
│   ├── project-tree.md
│   ├── layer-responsibilities.md
│   ├── backend-tree.md
│   ├── frontend-tree.md
│   └── db-tree.md
├── 03-requirements/
│   ├── README.md
│   ├── project-understanding.md
│   ├── user-stories.md
│   ├── acceptance-criteria.md
│   └── scope-coverage.md
└── 04-code/
    ├── README.md
    ├── db/
    │   └── README.md
    ├── backend/
    │   └── README.md
    ├── frontend/
    │   └── README.md
    ├── integrations/
    │   └── README.md
    └── testing/
        └── README.md
```

## Architect rationale

- `00-traceability/` va primero porque gobierna cualquier cambio futuro.
- `01-planning/` define cómo se ejecuta el reto.
- `02-architecture/` define estructura y separación de responsabilidades.
- `03-requirements/` convierte entendimiento en HU y criterios de aceptación.
- `04-code/` organiza la implementación por capa: db, backend, frontend, integrations y testing.
