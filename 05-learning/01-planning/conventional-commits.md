# Conventional commits

> Reglas oficiales para publicar avances del Reto AI-First Fase 1 usando commits claros, trazables y consistentes.

## 1. Purpose

Usar Conventional Commits permite mantener un historial Git legible para humanos y herramientas, facilitar changelogs, revisar avances por HU y publicar cambios de forma incremental durante el reto.

Referencia base: https://www.conventionalcommits.org/es/v1.0.0/

## 2. Required commit format

```text
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

Formato para trabajo asociado a una Historia de Usuario:

```text
<type>(HU-###): <short description>
```

Ejemplos:

```text
feat(HU-001): add user registration endpoint
fix(HU-002): reject invalid login credentials
docs(HU-012): document local run instructions
test(HU-011): add auth API tests
```

## 3. Scope rules

El scope debe hacer trazable el commit.

### HU scope

Usar `HU-###` cuando el cambio implemente, pruebe o documente una Historia de Usuario.

```text
feat(HU-003): add opportunity search service
```

### Non-HU scope

Usar estos scopes solo para cambios transversales que todavía no pertenecen a una HU específica:

| Scope | Use when |
|---|---|
| `traceability` | Cambios en `05-learning/00-traceability/`. |
| `planning` | Cambios en `05-learning/01-planning/`. |
| `architecture` | Cambios en `05-learning/02-architecture/`. |
| `requirements` | Cambios generales de requisitos que no pertenecen a una HU única. |
| `repo` | Configuración general del repo. |
| `soul` | Actualizaciones exclusivas de `SOUL.md`. |

Ejemplos:

```text
docs(requirements): close end-to-end HU coverage review
docs(planning): add conventional commit rules
chore(repo): remove windows zone identifier file
```

## 4. Allowed types

| Type | Use when | Example |
|---|---|---|
| `feat` | Nueva funcionalidad de producto. | `feat(HU-005): add bookmark creation endpoint` |
| `fix` | Corrección de bug o comportamiento incorrecto. | `fix(HU-006): prevent bookmark leakage across users` |
| `docs` | Documentación, README, SOUL, planning o requisitos. | `docs(HU-013): update demo evidence notes` |
| `style` | Formato o estilos sin cambiar lógica. | `style(HU-003): align search form spacing` |
| `refactor` | Reestructura sin cambiar comportamiento. | `refactor(HU-003): simplify secop response mapper` |
| `perf` | Mejora de rendimiento. | `perf(HU-003): reduce duplicate secop requests` |
| `test` | Tests unitarios, integración o API. | `test(HU-011): add health endpoint contract tests` |
| `build` | Dependencias, build system, package files. | `build(repo): add backend dependencies` |
| `ci` | Workflows o configuración de integración continua. | `ci(repo): add api test workflow` |
| `chore` | Tareas generales sin impacto funcional. | `chore(repo): update gitignore rules` |
| `revert` | Reversión explícita de un commit anterior. | `revert(HU-003): revert secop timeout change` |

## 5. Short description rules

La descripción corta es obligatoria.

Debe cumplir:

- English.
- Present tense / imperative style.
- Lowercase initial letter.
- No final period.
- Preferably 72 characters or fewer.
- Explain what changes, not why in detail.

Good:

```text
feat(HU-001): add user registration endpoint
```

Avoid:

```text
feat(HU-001): Added the user registration endpoint.
feat(HU-001): Registro de usuarios
feat: changes
```

## 6. Optional body

Usar body cuando el cambio necesite contexto adicional.

```text
feat(HU-003): add secop search client

Normalize external SECOP records before returning them to the frontend.
Timeout and empty response handling are covered by API tests.
```

## 7. Breaking changes

Si un cambio rompe contrato API, schema, flujo de auth o formato de datos, debe marcarse explícitamente.

Con `!`:

```text
feat(HU-010)!: change opportunity detail response contract
```

O con footer:

```text
feat(HU-010): change opportunity detail response contract

BREAKING CHANGE: frontend clients must use `entityName` instead of `entity`.
```

Todo breaking change debe actualizar:

- `05-learning/00-traceability/change-log.md`
- contrato API correspondiente
- tests afectados
- frontend/backend/db impact según aplique
- `SOUL.md` si afecta demo, alcance o decisión relevante

## 8. Gitmoji policy

Gitmoji es opcional, no obligatorio.

Si se usa, debe ir antes del tipo y no reemplaza Conventional Commits:

```text
✨ feat(HU-003): add secop search service
🐛 fix(HU-006): isolate bookmarks by authenticated user
📝 docs(planning): add conventional commit rules
```

Regla práctica para este reto: preferir commits sin gitmoji salvo que Ariel decida activarlos para todo el repo.

## 9. Publishing workflow

Regla obligatoria: no crear commits ni ejecutar push salvo autorización explícita de Ariel para la tarea actual.

Antes de publicar avances, solo cuando Ariel lo autorice:

1. Revisar cambios:

```bash
git status --short
git diff --stat
```

2. Agrupar cambios relacionados por HU o área.
3. Evitar mezclar documentación, backend, frontend y DB en un solo commit salvo que sea una HU vertical pequeña.
4. Verificar que no se agreguen secretos, `.env`, tokens ni credenciales.
5. Ejecutar validación relevante antes del commit cuando aplique.
6. Crear commit con mensaje convencional solo si Ariel autorizó el commit.
7. Publicar con push solo si Ariel autorizó el push.

Ejemplo:

```bash
git add 05-learning/01-planning/conventional-commits.md \
        05-learning/01-planning/governance.md \
        05-learning/README.md \
        05-learning/00-traceability/change-log.md

git commit -m "docs(planning): add conventional commit rules"
```

## 10. Commit sizing rules

Usar commits pequeños y revisables.

Good commit units:

- Una HU completa pequeña.
- Un endpoint + tests relacionados.
- Un documento de planificación completo.
- Un fix con su test.

Avoid:

- `docs(repo): update everything`
- `feat(HU-001): add backend frontend db tests docs all at once`
- commits con cambios no relacionados

## 11. Examples for this challenge

```text
docs(planning): add conventional commit rules
docs(requirements): close end-to-end HU coverage review
feat(HU-001): add user registration endpoint
feat(HU-002): issue jwt access token on login
feat(HU-003): add secop opportunity search client
feat(HU-005): persist user opportunity bookmarks
test(HU-011): add api test fixtures
docs(HU-012): document local development setup
chore(repo): remove windows zone identifier file
```

## 12. Final rule

Every commit must answer clearly:

- What changed?
- Which HU or project area does it affect?
- Is it functional, fix, docs, test, build, chore, or another allowed type?
