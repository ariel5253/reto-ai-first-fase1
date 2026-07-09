# Layer responsibilities

> Reglas obligatorias de separación de responsabilidades para el Track DEV. Este documento complementa `05-learning/02-architecture/project-tree.md` y evita que backend, frontend y base de datos mezclen responsabilidades.

## 1. Principio base

Cada capa debe tener una responsabilidad clara y no debe asumir responsabilidades de otra capa.

```text
Frontend  -> experiencia de usuario y consumo de API
Backend   -> API, autenticación, orquestación de casos de uso e integración externa
Database  -> persistencia, integridad, constraints, seeds y datos de prueba controlados
```

## 2. Database

Responsabilidades:

- Persistir datos del producto en PostgreSQL.
- Definir schemas, migrations, constraints, indexes y relaciones.
- Mantener datos semilla y datos de prueba controlados en `06-code/db/init/`.
- Proteger integridad mediante foreign keys, unique constraints, check constraints y transacciones.
- Diseñar tablas normalizadas al menos hasta Tercera Forma Normal (3NF), salvo excepción explícita documentada.

Reglas:

- La base de datos debe ser la fuente de verdad de integridad persistente.
- Las tablas deben evitar duplicación de datos derivables.
- Los datos externos de SECOP solo se persisten si hay decisión explícita de cache o normalización.
- Cualquier denormalización requiere motivo, impacto y registro en `SOUL.md` o en el documento de arquitectura correspondiente.

No debe:

- Contener lógica de UI.
- Depender del frontend.
- Depender de handlers del backend para garantizar integridad básica que debe estar en constraints.

## 3. Backend

Responsabilidades:

- Exponer API REST con FastAPI.
- Validar requests y responses.
- Implementar autenticación y autorización JWT.
- Orquestar casos de uso del dominio.
- Encapsular integración externa con datos.gov.co / SECOP mediante cliente HTTP.
- Acceder a PostgreSQL mediante repositorios, unidad de trabajo o capa equivalente.

Reglas:

- El backend puede validar reglas de negocio y coordinar persistencia, pero no debe reemplazar constraints esenciales de base de datos.
- El backend no debe contener datos semilla, datos demo ni datos de prueba persistentes.
- Los tests backend pueden usar mocks/factories en memoria, pero cualquier seed persistente debe vivir en `06-code/db/init/`.
- Los handlers API no deben contener lógica de negocio compleja; deben delegar a casos de uso o servicios de aplicación.
- La integración SECOP no debe mezclarse con auth, UI ni lógica de persistencia directa.

No debe:

- Renderizar UI.
- Acceder directamente a componentes frontend.
- Hardcodear datos de prueba, secretos o respuestas falsas como si fueran datos reales.
- Crear estructuras de base de datos fuera de migrations/scripts definidos para ese propósito.

## 4. Frontend

Responsabilidades:

- Presentar pantallas y componentes React.
- Gestionar estado visual, navegación, formularios y mensajes de usuario.
- Consumir exclusivamente la API del backend.
- Manejar estados de loading, error, empty y success.

Reglas:

- El frontend no debe contener reglas de negocio críticas.
- El frontend no debe acceder directamente a PostgreSQL ni a datos.gov.co / SECOP.
- El frontend puede hacer validaciones de UX, pero el backend y la base de datos deben validar de nuevo lo crítico.
- El cliente API debe estar separado de componentes visuales.

No debe:

- Calcular decisiones de autorización reales.
- Persistir datos del dominio como fuente de verdad.
- Duplicar reglas de negocio del backend.
- Consumir APIs externas del dominio directamente si el stack define backend como capa de integración.

## 5. Dependency direction

Dirección permitida:

```text
frontend -> backend -> database
frontend -> backend -> external APIs
```

Dirección no permitida:

```text
database -> backend
backend -> frontend
frontend -> database
frontend -> datos.gov.co / SECOP
```

## 6. Verification checklist

Antes de aprobar arquitectura o implementación:

- [ ] La base de datos está al menos en 3NF o la excepción está documentada.
- [ ] Seeds y datos de prueba persistentes viven en `06-code/db/`, no en backend ni frontend.
- [ ] Backend expone API y casos de uso, sin datos demo hardcodeados.
- [ ] Frontend consume API y no contiene reglas de negocio críticas.
- [ ] SECOP/datos.gov.co se consume desde backend, no desde frontend.
- [ ] Constraints de integridad existen en base de datos cuando aplican.
- [ ] Handlers API delegan lógica compleja a servicios/casos de uso.
