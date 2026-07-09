# Architecture readiness review — Portal de Convocatorias Públicas

Fecha: 2026-07-08
Rol de revisión: arquitectura punta a punta antes de iniciar backend.

## 1. Veredicto ejecutivo

El planteamiento está suficientemente equilibrado para avanzar al siguiente bloque, pero el siguiente bloque no debería ser todavía funcionalidades completas de backend. Debe empezar por un backend base con contrato mínimo, health check y conexión verificada a PostgreSQL.

Estado general: Ready with guardrails.

No se encontraron bloqueos estructurales entre reto, arquitectura, HU y modelo de datos.

Sí se encontraron ajustes menores de documentación, ya corregidos:

- Separar requisitos explícitos del reto vs decisiones internas de implementación.
- Corregir inconsistencias menores del modelo lógico textual.
- Alinear `project-understanding.md` y `scope-coverage.md` con la corrección del stack.

## 2. Requisitos explícitos del reto vs decisiones internas

### Requisitos explícitos del reto

El reto exige:

- Auth con JWT.
- Backend REST.
- Frontend web funcional.
- Base de datos SQLite o PostgreSQL.
- Integración en vivo con datos.gov.co / SECOP.
- App ejecutable localmente.
- README, SOUL.md y demo.

### Decisiones internas de nuestra implementación

Nuestra implementación decide:

- Backend: FastAPI / Python.
- Base de datos: PostgreSQL.
- Frontend: React.
- Tests API: pytest + httpx.
- DB local: Docker Compose.
- E2E: fuera de alcance inicial.

Veredicto: correcto, siempre que la documentación mantenga clara esta diferencia.

## 3. Arquitectura por capas

### Frontend

Responsabilidad esperada:

- UI, formularios, estado visual y consumo de API.
- No debe consumir SECOP directamente.
- No debe acceder a PostgreSQL.
- No debe decidir autorización real.

Estado: equilibrado.

### Backend

Responsabilidad esperada:

- API REST.
- Auth JWT.
- Orquestación de casos de uso.
- Integración SECOP mediante cliente HTTP.
- Acceso a PostgreSQL mediante repositorios/capa de datos.

Estado: equilibrado.

Guardrail para el siguiente paso: los handlers FastAPI no deben mezclar lógica de negocio compleja ni SQL directo disperso. Deben delegar a servicios/repositorios.

### Database

Responsabilidad esperada:

- Persistencia e integridad.
- Constraints, FKs, uniques, checks e índices.
- Seeds controlados.
- 3NF salvo excepción documentada.

Estado: equilibrado.

## 4. Historias de usuario

Total HU revisadas: 14.

Cobertura:

- HU-001 registro.
- HU-002 login/JWT.
- HU-003 búsqueda SECOP.
- HU-004 detalle de convocatoria.
- HU-005 crear bookmark.
- HU-006 listar bookmarks.
- HU-007 búsquedas guardadas.
- HU-008 manejo de fallos SECOP.
- HU-009 schema/migraciones/3NF.
- HU-010 contrato REST y health endpoint.
- HU-011 suite API.
- HU-012 README local.
- HU-013 SOUL/demo/evidencia.
- HU-014 aislamiento de datos.

Veredicto: cobertura completa del alcance funcional, técnico y de entrega.

Observación arquitectónica: HU-007 está bien como Should. No debe bloquear el primer backend base si el tiempo aprieta, pero el modelo ya la soporta.

## 5. Modelo de datos

Tablas revisadas: 10.

- `app_user`
- `opportunity_source`
- `opportunity_dataset`
- `contracting_entity`
- `opportunity_status`
- `public_opportunity`
- `bookmark`
- `saved_search`
- `search_filter_key`
- `saved_search_filter_value`

Fortalezas:

- Modelo en 3NF sin excepción activa.
- `app_user` evita palabra reservada/problemática `user`.
- Ownership claro en `bookmark` y `saved_search`.
- Antiduplicados correctos: usuario/oportunidad, usuario/nombre búsqueda, dataset/external_id.
- Trazabilidad SECOP suficiente mediante source, dataset, external IDs, detail URL y timestamps.
- Búsquedas guardadas no dependen de JSON opaco.
- El frontend no necesita conocer estructura DB.

Riesgos controlados:

- Persistir oportunidades externas implica decidir cuándo crear/cachear `public_opportunity`. Esto debe definirse en el servicio backend de búsqueda/bookmark.
- `contracting_entity` puede requerir estrategia de normalización de nombres para evitar duplicados por variaciones SECOP.
- `status_id` es opcional, correcto para datos externos incompletos.

Veredicto: modelo apto para iniciar backend base.

## 6. Validación mecánica ejecutada

Resultados:

```text
HU count: 14
HU missing in priority summary: []
HU missing in acceptance map: []
HU missing in scope coverage: []
DB table count: 10
Critical constraints: OK
Blocking readiness issues: []
```

Validaciones de constraints detectadas como presentes:

- `app_user.email` único.
- `bookmark(user_id, opportunity_id)` único.
- `saved_search(user_id, name)` único.
- `public_opportunity(dataset_id, external_id)` único.
- Monto no negativo.
- Orden de fechas `closing_at >= published_at` cuando ambas existan.
- Múltiples valores por filtro guardado sin duplicados exactos.

## 7. Brechas antes de backend

No son bloqueos para crear backend base, pero sí deben resolverse antes de implementar endpoints funcionales completos:

1. Contrato REST mínimo.
   - Antes de auth/bookmarks/search completos, definir rutas, payloads, responses y errores.
   - HU relacionada: HU-010.

2. Política de cache/persistencia de oportunidades SECOP.
   - Definir cuándo una oportunidad se inserta en `public_opportunity`.
   - Recomendación: persistir al crear bookmark o al consultar detalle; búsqueda puede devolver resultados normalizados sin persistir todo.

3. Campos mínimos del resultado SECOP.
   - Definir el DTO interno: id externo, título, entidad, estado, fechas, monto, URL detalle.

4. Estrategia de configuración.
   - Definir `DATABASE_URL`, `JWT_SECRET_KEY`, timeouts SECOP y URL base desde variables de entorno.

5. Migración vs script inicial.
   - Actualmente existe schema/init SQL. Para backend real, decidir si se mantiene como script de inicialización o se introduce Alembic.
   - Recomendación para no sobredimensionar: usar el SQL inicial por ahora; evaluar Alembic si hay cambios frecuentes.

## 8. Recomendación para el paso 2

Iniciar backend con un bloque pequeño y verificable:

1. Crear estructura `06-code/backend/`.
2. Crear FastAPI app mínima.
3. Configurar variables de entorno.
4. Conectar a PostgreSQL.
5. Implementar `GET /api/health` con verificación DB.
6. Agregar test API mínimo con pytest + httpx.
7. Documentar comando local.

No implementar todavía registro/login ni SECOP en el primer commit de backend.

Commit sugerido cuando Ariel lo autorice:

```text
feat(backend): add FastAPI health and database check
```

## 9. Decisión de arquitectura recomendada

El equilibrio actual es correcto si se respeta este orden:

```text
contrato mínimo -> backend base -> auth -> SECOP search -> persistence/bookmark -> frontend
```

No saltar directo a frontend ni a integración SECOP antes de tener health/db y contrato mínimo.
