# Stack tecnológico único — Reto AI-First Fase 1

> Este documento fija el stack tecnológico oficial para el desarrollo DEV del reto. No debe cambiarse durante la ejecución salvo decisión explícita aprobada según `05-learning/01-planning/governance.md` y documentada en `SOUL.md`.

## 1. Stack definido

| Capa | Tecnología única |
|---|---|
| Backend | FastAPI / Python |
| Base de datos | PostgreSQL |
| Autenticación | JWT |
| Frontend | React |
| Testing API | pytest + httpx |
| E2E | No de momento |
| Integración externa | Cliente HTTP hacia datos.gov.co / SECOP |

---

## 2. Regla de estabilidad del stack

Durante el reto:

- No cambiar FastAPI por otro framework backend.
- No cambiar PostgreSQL por SQLite/MySQL/MongoDB.
- No cambiar JWT por sesiones server-side u otro mecanismo principal.
- No cambiar React por Vue/Angular/Svelte/HTML vanilla.
- No reemplazar `pytest + httpx` como suite principal de testing API.
- No implementar E2E por ahora; documentarlo como fuera de alcance temporal.
- No acceder a datos.gov.co / SECOP directamente desde el frontend; la integración externa debe estar encapsulada en el backend mediante un cliente HTTP.

Cualquier excepción debe quedar documentada con:

```markdown
## Decisión de arquitectura

**Cambio propuesto:**
**Motivo:**
**Impacto:**
**Riesgo:**
**Aprobación:**
```

---

## 3. Aplicación por capa

### Backend

Tecnología:

```text
FastAPI / Python
```

Responsabilidades:

- Exponer API REST.
- Implementar autenticación JWT.
- Validar requests y responses.
- Orquestar lógica de negocio.
- Conectarse a PostgreSQL.
- Encapsular integración con datos.gov.co / SECOP.
- Mantener la responsabilidad backend alineada con `05-learning/02-architecture/layer-responsibilities.md`.

Buenas prácticas:

- Código en inglés.
- Archivos Python en `snake_case`.
- Clases y modelos en `PascalCase`.
- Funciones y variables en `snake_case`.
- Variables de entorno en `UPPER_SNAKE_CASE`.
- Separar rutas, servicios, repositorios, schemas y clientes externos.
- No incluir seeds, datos demo ni datos de prueba persistentes dentro del backend.

Nombres sugeridos:

```text
User
PublicOpportunity
Bookmark
SavedSearch
SecopClient
AuthService
OpportunityService
```

---

### Base de datos

Tecnología:

```text
PostgreSQL
```

Responsabilidades:

- Persistir usuarios.
- Persistir bookmark.
- Persistir búsquedas guardadas.
- Persistir datos normalizados o cacheados de convocatorias si se decide hacerlo.
- Mantener seeds y datos de prueba controlados en `db/seeds/` o `db/test-data/`.

Buenas prácticas:

- Tablas y columnas en `snake_case`.
- Tablas del modelo de datos en singular.
- Entidades conceptuales y nombres de tabla deben coincidir en singular cuando sea práctico.
- Evitar nombres reservados de PostgreSQL; usar un prefijo semántico si el singular colisiona, por ejemplo `app_user` en lugar de `user`.
- Montos, si existen, en enteros de centavos.
- Fechas con `created_at` y `updated_at`.
- Foreign keys con patrón `<entity>_id`.
- Constraints explícitos para integridad.
- Índices para campos de búsqueda frecuente.
- Modelo normalizado al menos hasta Tercera Forma Normal (3NF), salvo excepción documentada.

Tablas base sugeridas:

```text
user
bookmark
saved_search
public_opportunity   # solo si se persiste/cachea información de SECOP
```

---

### Autenticación

Tecnología:

```text
JWT
```

Responsabilidades:

- Registro de usuarios.
- Login.
- Emisión de access token.
- Protección de rutas privadas.
- Asociación de bookmark y búsquedas guardadas al usuario autenticado.

Buenas prácticas:

- Passwords siempre hasheados.
- No guardar tokens en texto plano en backend.
- No hardcodear secretos JWT.
- Leer secretos desde variables de entorno.
- Validar expiración del token.

Variables sugeridas:

```text
JWT_SECRET_KEY
JWT_ALGORITHM
JWT_ACCESS_TOKEN_EXPIRE_MINUTES
```

---

### Frontend

Tecnología:

```text
React
```

Responsabilidades:

- Pantalla de registro/login.
- Pantalla principal de búsqueda de convocatorias.
- Filtros básicos.
- Vista de resultados.
- Gestión de bookmark.
- Gestión de búsquedas guardadas, si aplica al alcance final.
- Presentar datos recibidos desde el backend sin asumir reglas críticas de negocio.

Buenas prácticas:

- Componentes en `PascalCase`.
- Variables y funciones en `camelCase`.
- Archivos preferiblemente en `kebab-case` o según convención definida del setup React.
- Separar componentes, cliente API, hooks y páginas.
- Mantener estados claros: loading, error, empty, success.
- No acceder a PostgreSQL, no consumir SECOP directamente y no duplicar reglas críticas del backend.

Componentes sugeridos:

```text
LoginForm
RegisterForm
OpportunitySearchForm
OpportunityList
OpportunityCard
BookmarkButton
SavedSearchList
```

---

### Testing API

Tecnologías:

```text
pytest + httpx
```

Responsabilidades:

- Probar endpoints del backend.
- Validar status codes.
- Validar contratos de respuesta.
- Validar autenticación JWT.
- Validar integración con cliente SECOP mediante mocks o fixtures controladas.
- Validar persistencia en PostgreSQL de usuarios, bookmark y búsquedas guardadas.

Buenas prácticas:

- Tests en inglés.
- Archivos `test_*.py`.
- Nombres de tests descriptivos.
- Separar arrange / act / assert.
- No depender del orden de ejecución.
- Usar fixtures para cliente HTTP, DB de test y usuario autenticado.

Ejemplos de nombres:

```python
def test_register_user_returns_access_token():
    ...


def test_login_with_invalid_password_returns_401():
    ...


def test_search_opportunities_returns_normalized_results():
    ...


def test_create_bookmark_requires_authentication():
    ...
```

---

### E2E

Estado actual:

```text
No de momento
```

Regla:

- No incluir E2E como compromiso inicial.
- No instalar Playwright/Cypress de momento.
- Si queda tiempo, puede evaluarse como mejora opcional, pero no como parte del stack base.
- Si se decide incluir E2E después, registrar la decisión en `SOUL.md`.

---

### Integración externa

Tecnología:

```text
Cliente HTTP hacia datos.gov.co / SECOP
```

Responsabilidades:

- Consultar convocatorias públicas colombianas.
- Normalizar la respuesta externa a un formato interno estable.
- Manejar errores de red, timeouts y respuestas vacías.
- Evitar que el frontend dependa directamente del contrato externo.

Buenas prácticas:

- Crear un cliente dedicado, por ejemplo `SecopClient`.
- Centralizar URLs, timeouts y parámetros.
- Agregar tests con mocks para no depender siempre de la red.
- Registrar limitaciones o errores externos en `SOUL.md`.

Formato interno sugerido:

```text
PublicOpportunity
- id
- title
- entityName
- status
- publicationDate
- closingDate
- amount
- sourceUrl
```

---

## 4. Estructura general del proyecto DEV

La fuente de verdad para el árbol general es `05-learning/02-architecture/project-tree.md`. Resumen alineado:

```text
track-dev/
  SOUL.md
  README.md
  docs/
  backend/
  frontend/
  db/
```

---

## 5. Checklist de cumplimiento

Antes de cerrar cualquier fase, verificar:

- [ ] Backend usa FastAPI / Python.
- [ ] DB definida como PostgreSQL.
- [ ] Auth definida como JWT.
- [ ] Frontend usa React.
- [ ] Testing API usa `pytest + httpx`.
- [ ] E2E está marcado como “No de momento”.
- [ ] Integración externa pasa por backend con cliente HTTP hacia datos.gov.co / SECOP.
- [ ] Código técnico en inglés.
- [ ] Convenciones de naming aplicadas según `05-learning/01-planning/ai-first-challenge-best-practices.md`.
- [ ] Cualquier excepción está documentada en `SOUL.md`.
