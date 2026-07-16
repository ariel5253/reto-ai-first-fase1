# User stories

> Historias de Usuario derivadas del entendimiento del proyecto. Este archivo se completa antes de implementar código.

## Template

```markdown
## HU-### — Title

**As a:** actor
**I want:** capability
**So that:** outcome

**Priority:** Must | Should | Could
**Layers affected:** database / backend / frontend / integrations / tests
**Source:** project-understanding | user decision | challenge requirement

### Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

### Traceability

- Related files:
  - `path/to/file`
- Change-log entry required: yes
```

## Backlog

## HU-001 — User registration

**As a:** visitante
**I want:** crear una cuenta con credenciales válidas
**So that:** pueda acceder a funcionalidades privadas del portal

**Priority:** Must
**Layers affected:** database / backend / frontend / tests
**Source:** challenge requirement

### Acceptance criteria

- [ ] El usuario puede registrarse con email y password válidos.
- [ ] El backend valida formato de email y longitud mínima de password.
- [ ] El password se almacena hasheado, nunca en texto plano.
- [ ] Email duplicado retorna error de conflicto.
- [ ] El frontend muestra estados de loading, success y error.
- [ ] Existen tests API para registro exitoso, email duplicado y payload inválido.

### Traceability

- Related files:
  - `05-learning/03-requirements/acceptance-criteria.md`
  - `05-learning/02-architecture/layer-responsibilities.md`
  - `05-learning/04-code/backend/README.md`
  - `05-learning/04-code/frontend/README.md`
  - `05-learning/04-code/db/README.md`
- Change-log entry required: yes

## HU-002 — User login

**As a:** usuario registrado
**I want:** iniciar sesión con mis credenciales
**So that:** pueda recibir un token JWT y usar funcionalidades privadas

**Priority:** Must
**Layers affected:** database / backend / frontend / tests
**Source:** challenge requirement

### Acceptance criteria

- [ ] El usuario puede iniciar sesión con email y password válidos.
- [ ] El backend retorna un access token JWT válido.
- [ ] Credenciales inválidas retornan `401` sin revelar detalles sensibles.
- [ ] El frontend guarda el estado de sesión según la estrategia definida.
- [ ] Rutas privadas requieren token válido.
- [ ] Existen tests API para login exitoso, password inválido y acceso sin token.

### Traceability

- Related files:
  - `05-learning/01-planning/ai-first-challenge-tech-stack.md`
  - `05-learning/02-architecture/layer-responsibilities.md`
  - `05-learning/04-code/backend/README.md`
  - `05-learning/04-code/frontend/README.md`
- Change-log entry required: yes

## HU-003 — Search public opportunities

**As a:** usuario autenticado
**I want:** buscar convocatorias públicas desde el portal
**So that:** pueda encontrar oportunidades relevantes sin consultar manualmente SECOP

**Priority:** Must
**Layers affected:** backend / frontend / integrations / tests
**Source:** challenge requirement

### Acceptance criteria

- [ ] El frontend permite ingresar criterios básicos de búsqueda.
- [ ] El frontend consume únicamente el backend para buscar convocatorias.
- [ ] El backend consulta datos.gov.co / SECOP mediante cliente HTTP encapsulado.
- [ ] El backend normaliza la respuesta externa antes de devolverla al frontend.
- [ ] Errores, timeouts o respuestas vacías de SECOP se manejan explícitamente.
- [ ] Existen tests API con mocks o fixtures controladas para la integración.

### Traceability

- Related files:
  - `05-learning/04-code/integrations/README.md`
  - `05-learning/04-code/backend/README.md`
  - `05-learning/04-code/frontend/README.md`
  - `05-learning/02-architecture/layer-responsibilities.md`
- Change-log entry required: yes

## HU-004 — View opportunity detail

**As a:** usuario autenticado
**I want:** ver el detalle de una convocatoria
**So that:** pueda evaluar si me interesa guardarla o hacer seguimiento

**Priority:** Must
**Layers affected:** backend / frontend / integrations / tests
**Source:** project-understanding

### Acceptance criteria

- [ ] El usuario puede abrir una convocatoria desde los resultados de búsqueda.
- [ ] El frontend presenta campos normalizados y comprensibles.
- [ ] El backend entrega un contrato estable para el detalle.
- [ ] Si el detalle no existe o la fuente externa falla, se muestra error controlado.
- [ ] El frontend no consulta SECOP directamente.
- [ ] Existen tests para respuesta exitosa, no encontrada y fallo de integración.

### Traceability

- Related files:
  - `05-learning/03-requirements/project-understanding.md`
  - `05-learning/04-code/integrations/README.md`
  - `05-learning/04-code/frontend/README.md`
- Change-log entry required: yes

## HU-005 — Save opportunity bookmark

**As a:** usuario autenticado
**I want:** guardar una convocatoria como favorita
**So that:** pueda revisarla después sin buscarla nuevamente

**Priority:** Must
**Layers affected:** database / backend / frontend / tests
**Source:** challenge requirement

### Acceptance criteria

- [ ] El usuario puede guardar una convocatoria desde resultados o detalle.
- [ ] El bookmark queda asociado al usuario autenticado.
- [ ] No se permiten bookmarks duplicados para el mismo usuario y convocatoria.
- [ ] La base de datos define constraints para proteger integridad.
- [ ] El frontend refleja estado guardado/no guardado.
- [ ] Existen tests API para crear bookmark, duplicado y usuario no autenticado.

### Traceability

- Related files:
  - `05-learning/04-code/db/README.md`
  - `05-learning/04-code/backend/README.md`
  - `05-learning/04-code/frontend/README.md`
  - `05-learning/02-architecture/layer-responsibilities.md`
- Change-log entry required: yes

## HU-006 — List saved bookmarks

**As a:** usuario autenticado
**I want:** ver mis convocatorias guardadas
**So that:** pueda hacer seguimiento de oportunidades relevantes

**Priority:** Must
**Layers affected:** database / backend / frontend / tests
**Source:** project-understanding

### Acceptance criteria

- [ ] El usuario puede listar solo sus propios bookmarks.
- [ ] El backend filtra bookmarks por usuario autenticado.
- [ ] El frontend muestra lista, vacío y errores.
- [ ] La respuesta no expone bookmarks de otros usuarios.
- [ ] Existen tests API para listado exitoso, usuario sin bookmarks y aislamiento por usuario.

### Traceability

- Related files:
  - `05-learning/04-code/db/README.md`
  - `05-learning/04-code/backend/README.md`
  - `05-learning/04-code/frontend/README.md`
- Change-log entry required: yes

## HU-007 — Save search criteria

**As a:** usuario autenticado
**I want:** guardar una búsqueda frecuente
**So that:** pueda repetirla rápidamente en futuras sesiones

**Priority:** Should
**Layers affected:** database / backend / frontend / tests
**Source:** challenge requirement

### Acceptance criteria

- [ ] El usuario puede guardar criterios de búsqueda con un nombre.
- [ ] La búsqueda guardada queda asociada al usuario autenticado.
- [ ] El backend valida estructura mínima de criterios.
- [ ] La base de datos persiste criterios de forma consistente.
- [ ] El frontend permite crear y ver búsquedas guardadas.
- [ ] Existen tests API para creación, payload inválido y listado por usuario.

### Traceability

- Related files:
  - `05-learning/04-code/db/README.md`
  - `05-learning/04-code/backend/README.md`
  - `05-learning/04-code/frontend/README.md`
- Change-log entry required: yes

## HU-008 — Handle SECOP integration failures

**As a:** usuario autenticado
**I want:** recibir mensajes claros cuando la integración externa falle
**So that:** entienda que el problema es temporal y pueda reintentar

**Priority:** Must
**Layers affected:** backend / frontend / integrations / tests
**Source:** challenge requirement

### Acceptance criteria

- [ ] El backend maneja timeout, error HTTP, respuesta vacía y formato inesperado.
- [ ] El backend no filtra errores internos al frontend.
- [ ] El frontend muestra mensajes de error controlados.
- [ ] La integración tiene tests con mocks para fallos externos.
- [ ] El sistema documenta limitaciones externas en `SOUL.md` si afectan la demo.

### Traceability

- Related files:
  - `05-learning/04-code/integrations/README.md`
  - `05-learning/04-code/backend/README.md`
  - `05-learning/04-code/frontend/README.md`
  - `SOUL.md`
- Change-log entry required: yes


## HU-009 — Define PostgreSQL schema and migrations

**As a:** equipo de desarrollo
**I want:** definir el schema PostgreSQL inicial con migraciones
**So that:** el producto tenga persistencia consistente, normalizada y reproducible localmente

**Priority:** Must
**Layers affected:** database / backend / tests
**Source:** challenge requirement

### Acceptance criteria

- [ ] Existe un modelo inicial para usuarios, bookmarks y búsquedas guardadas.
- [ ] El modelo está normalizado al menos hasta 3NF o documenta una excepción explícita.
- [ ] Las migraciones crean tablas, foreign keys, unique constraints, check constraints e índices necesarios.
- [ ] Los datos semilla o de prueba persistentes viven en `06-code/db/init/`, no en backend/frontend.
- [ ] Backend repositories/schemas se alinean con el schema definido.
- [ ] Existen validaciones/tests para constraints críticas.

### Traceability

- Related files:
  - `05-learning/04-code/db/README.md`
  - `05-learning/02-architecture/db-tree.md`
  - `05-learning/02-architecture/layer-responsibilities.md`
- Change-log entry required: yes

## HU-010 — Define REST API contract and health endpoint

**As a:** equipo de desarrollo
**I want:** documentar el contrato REST inicial y un endpoint de salud
**So that:** frontend, backend y tests trabajen contra una interfaz clara y verificable

**Priority:** Must
**Layers affected:** backend / frontend / tests / documentation
**Source:** challenge requirement

### Acceptance criteria

- [ ] Existe contrato inicial para auth, búsqueda, detalle, bookmarks y búsquedas guardadas.
- [ ] Se define `GET /api/health` para verificar disponibilidad del backend.
- [ ] Cada endpoint define método, ruta, request, response, status codes y errores esperados.
- [ ] El frontend consume servicios alineados con el contrato.
- [ ] Tests API validan status codes y campos obligatorios de respuesta.
- [ ] Cambios posteriores de contrato actualizan frontend, tests y documentación.

### Traceability

- Related files:
  - `05-learning/04-code/backend/README.md`
  - `05-learning/04-code/frontend/README.md`
  - `05-learning/04-code/testing/README.md`
- Change-log entry required: yes

## HU-011 — Configure API test suite

**As a:** equipo de desarrollo
**I want:** configurar una suite base de tests API con pytest + httpx
**So that:** cada funcionalidad crítica pueda verificarse de forma reproducible

**Priority:** Must
**Layers affected:** backend / database / integrations / tests
**Source:** challenge requirement

### Acceptance criteria

- [ ] La suite usa pytest + httpx como herramienta principal.
- [ ] Existen fixtures para cliente HTTP, usuario autenticado y DB de test.
- [ ] Tests de integración SECOP usan mocks o fixtures controladas, no dependen siempre de red real.
- [ ] Tests cubren auth, búsqueda, bookmarks, búsquedas guardadas y errores externos.
- [ ] Los tests no dependen del orden de ejecución.
- [ ] El README documenta el comando para ejecutar la suite.

### Traceability

- Related files:
  - `05-learning/04-code/testing/README.md`
  - `05-learning/04-code/backend/README.md`
  - `05-learning/04-code/db/README.md`
- Change-log entry required: yes

## HU-012 — Document local run instructions

**As a:** evaluador del reto
**I want:** instrucciones claras para ejecutar la app localmente
**So that:** pueda validar backend, frontend, DB e integración sin depender de conocimiento previo

**Priority:** Must
**Layers affected:** documentation / backend / frontend / database / integrations / tests
**Source:** challenge requirement

### Acceptance criteria

- [ ] README explica prerequisitos, variables de entorno y comandos de instalación.
- [ ] README explica cómo levantar PostgreSQL, backend y frontend.
- [ ] README explica cómo ejecutar migraciones/seeds si aplican.
- [ ] README incluye comandos para correr tests API.
- [ ] README documenta limitaciones o mocks de SECOP si aplican.
- [ ] Instrucciones son reproducibles desde un clone limpio.

### Traceability

- Related files:
  - `README.md`
  - `05-learning/04-code/README.md`
  - `05-learning/01-planning/delivery-checklist.md`
- Change-log entry required: yes

## HU-013 — Maintain SOUL.md and demo evidence

**As a:** participante del reto
**I want:** mantener SOUL.md y evidencia de demo actualizadas
**So that:** el proceso AI-first, decisiones, bloqueos y validaciones queden demostrables

**Priority:** Must
**Layers affected:** documentation / tests / traceability
**Source:** challenge requirement

### Acceptance criteria

- [ ] SOUL.md registra scope, herramientas, decisiones, bloqueos y evidencia relevante.
- [ ] Cada checkpoint diario usa el formato definido en `05-learning/01-planning/daily-checkpoints.md`.
- [ ] La demo de 5–7 minutos tiene flujo reproducible documentado.
- [ ] Resultados de tests y validaciones relevantes quedan resumidos o referenciados.
- [ ] Limitaciones de SECOP o decisiones pendientes se documentan honestamente.
- [ ] Change-log técnico no duplica SOUL.md; solo lo complementa.

### Traceability

- Related files:
  - `SOUL.md`
  - `05-learning/01-planning/daily-checkpoints.md`
  - `05-learning/00-traceability/change-log.md`
- Change-log entry required: yes

## HU-014 — Enforce user data isolation

**As a:** usuario autenticado
**I want:** que mis bookmarks y búsquedas guardadas estén aisladas de otros usuarios
**So that:** mis datos privados no sean visibles ni modificables por terceros

**Priority:** Must
**Layers affected:** database / backend / frontend / tests
**Source:** challenge requirement

### Acceptance criteria

- [ ] Bookmarks se crean y consultan siempre asociados al usuario autenticado.
- [ ] Búsquedas guardadas se crean y consultan siempre asociadas al usuario autenticado.
- [ ] El backend filtra por usuario desde el token JWT y no desde un parámetro manipulable.
- [ ] La base de datos define relaciones y constraints para preservar ownership.
- [ ] Tests verifican que un usuario no puede leer ni modificar datos de otro usuario.
- [ ] Frontend no asume autorización; solo presenta la respuesta del backend.

### Traceability

- Related files:
  - `05-learning/04-code/db/README.md`
  - `05-learning/04-code/backend/README.md`
  - `05-learning/04-code/frontend/README.md`
  - `05-learning/02-architecture/layer-responsibilities.md`
- Change-log entry required: yes

## HU-015 — Docker Compose para base de datos

**As a:** desarrollador / evaluador del reto
**I want:** levantar PostgreSQL con un solo comando desde 06-code/db/
**So that:** la base de datos arranque con schema y seeds aplicados automáticamente en la primera ejecución, y simplemente suba si ya existe

**Priority:** Must
**Layers affected:** database
**Source:** mejora de entorno local

### Acceptance criteria

- [ ] Existe 06-code/db/docker-compose.yml que levanta PostgreSQL en puerto 5432.
- [ ] En la primera ejecución aplica automáticamente 01-schema.sql, 02-seed-catalogs.sql y 03-seed-dev-synthetic.sql usando el mecanismo nativo de la imagen postgres (docker-entrypoint-initdb.d/).
- [ ] En ejecuciones posteriores no repite los scripts si el volumen ya existe.
- [ ] Define health check que reporta cuando PostgreSQL está listo para recibir conexiones.
- [ ] Si el puerto 5432 ya está ocupado, docker compose up imprime advertencia en log y no tumba el proceso externo.
- [ ] Existe 06-code/db/.env.example con las variables POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD.

### Traceability

- Related files:
  - `06-code/db/docker-compose.yml`
  - `06-code/db/.env.example`
  - `06-code/db/init/`
- Change-log entry required: yes

---

## HU-016 — Docker Compose para backend

**As a:** desarrollador / evaluador del reto
**I want:** levantar el backend FastAPI con un solo comando desde 06-code/backend/
**So that:** la API arranque containerizada, conectada a PostgreSQL y lista para recibir requests

**Priority:** Must
**Layers affected:** backend
**Source:** mejora de entorno local

### Acceptance criteria

- [ ] Existe 06-code/backend/Dockerfile que construye la imagen FastAPI con uv.
- [ ] Existe 06-code/backend/docker-compose.yml que levanta el backend en puerto 8000.
- [ ] El backend espera a que PostgreSQL esté healthy antes de arrancar (depends_on con condition: service_healthy).
- [ ] Las variables de entorno se inyectan desde 06-code/backend/.env (DATABASE_URL, JWT_SECRET, JWT_ALGORITHM, SECOP_BASE_URL, SECOP_TIMEOUT_SECONDS).
- [ ] GET /api/health responde {"status":"ok","database":"ok"} cuando el contenedor está listo.
- [ ] Si el puerto 8000 ya está ocupado, docker compose up imprime advertencia en log y no tumba el proceso externo.
- [ ] Existe 06-code/backend/.env.example con todas las variables necesarias.

### Traceability

- Related files:
  - `06-code/backend/Dockerfile`
  - `06-code/backend/docker-compose.yml`
  - `06-code/backend/.env.example`
- Change-log entry required: yes

---

## HU-017 — Docker Compose para frontend

**As a:** desarrollador / evaluador del reto
**I want:** levantar el frontend React con un solo comando desde 06-code/frontend/
**So that:** la UI esté disponible en puerto 3000 servida por nginx con el build de producción

**Priority:** Must
**Layers affected:** frontend
**Source:** mejora de entorno local

### Acceptance criteria

- [ ] Existe 06-code/frontend/Dockerfile multi-stage: stage build (node) + stage serve (nginx).
- [ ] Existe 06-code/frontend/docker-compose.yml que levanta el frontend en puerto 3000.
- [ ] nginx sirve el build de producción (dist/) y redirige /api/ al backend en puerto 8000 (proxy_pass).
- [ ] Si el puerto 3000 ya está ocupado, docker compose up imprime advertencia en log y no tumba el proceso externo.
- [ ] El contenedor arranca sin errores y GET http://localhost:3000 retorna HTTP 200.

### Traceability

- Related files:
  - `06-code/frontend/Dockerfile`
  - `06-code/frontend/docker-compose.yml`
  - `06-code/frontend/nginx.conf`
- Change-log entry required: yes

---

## HU-018 — Orquestador Docker Compose raíz

**As a:** desarrollador / evaluador del reto
**I want:** ejecutar un solo comando desde 06-code/ que levante todo el sistema
**So that:** base de datos, backend y frontend arranquen en el orden correcto sin intervención manual

**Priority:** Must
**Layers affected:** database / backend / frontend
**Source:** mejora de entorno local

### Acceptance criteria

- [ ] Existe 06-code/docker-compose.yml que orquesta db, backend y frontend.
- [ ] El orden de arranque es: db (healthy) → backend (healthy) → frontend.
- [ ] En primera ejecución los seeds se aplican automáticamente vía HU-015.
- [ ] Si algún puerto (5432, 8000, 3000) ya está ocupado, el servicio correspondiente imprime advertencia en log y el orquestador continúa levantando los demás sin error fatal.
- [ ] docker compose up -d desde 06-code/ levanta todo el sistema.
- [ ] docker compose down desde 06-code/ baja todo el sistema.
- [ ] El README en 06-code/README.md se actualiza con la sección de arranque con Docker Compose.

### Traceability

- Related files:
  - `06-code/docker-compose.yml`
  - `06-code/README.md`
- Change-log entry required: yes

---

## Priority summary

| Priority | User stories |
|---|---|
| Must | HU-001, HU-002, HU-003, HU-004, HU-005, HU-006, HU-008, HU-009, HU-010, HU-011, HU-012, HU-013, HU-014, HU-015, HU-016, HU-017, HU-018 |
| Should | HU-007 |
| Could | Pending |

---

## HU-019 — Rediseño visual: sidebar de navegación y elevación de tarjetas

- Como usuario autenticado, quiero una navegación lateral fija en lugar del menú superior, para tener acceso rápido a las secciones sin perder contexto visual.
- Como usuario autenticado, quiero que las tarjetas métricas tengan fondo blanco con sombra sutil, para percibir mejor la jerarquía visual del dashboard.
- Criterios de aceptación:
  - El sidebar ocupa el lado izquierdo con fondo azul oscuro (#1E3A5F) y muestra: Panel de control, Buscador, Seguidas, Guardadas.
  - El ítem activo tiene borde izquierdo azul claro y fondo semitransparente.
  - El botón "Cerrar sesión" aparece en la parte inferior del sidebar.
  - Las metric-cards tienen fondo blanco y box-shadow sutil.
  - El layout general usa fondo gris azulado (#F0F4F8).

## HU-022 — Refactor: filtro de Estado alineado con SECOP

**Como** usuario del portal
**Quiero** filtrar convocatorias por estados reales de SECOP
**Para** obtener resultados cuando aplico el filtro de Estado

**Criterios de aceptación:**
- El dropdown muestra: Todos, Publicado, Seleccionado, Evaluación, Cancelado
- Al filtrar por cualquiera de esos valores, SECOP devuelve resultados
- Las badges de estado en la tabla reflejan el valor real sin normalización incorrecta
