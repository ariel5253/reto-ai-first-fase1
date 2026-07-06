# Buenas prácticas — Reto AI-First Fase 1

> Usar este documento como guía obligatoria de estilo para el código, pruebas, nombres, documentación técnica y estructura del proyecto durante el reto.

## 1. Principios generales

- Todo el código debe escribirse en **inglés**.
- Los nombres técnicos deben ser claros, consistentes y expresivos.
- Evitar abreviaturas ambiguas: usar `product`, no `prod`; `quantity`, no `qty`, salvo que el contrato externo ya use `qty`.
- Priorizar legibilidad sobre clever code.
- Mantener funciones pequeñas y con una sola responsabilidad.
- Evitar duplicación: extraer helpers cuando una regla se repite.
- No agregar abstracciones futuras sin necesidad real: aplicar YAGNI.
- No mezclar idiomas en nombres de variables, funciones, clases, rutas internas o tests.
- La UI puede mostrar textos en español para el usuario final, pero el código que los produce debe estar en inglés.

---

## 2. Idioma permitido por tipo de contenido

| Elemento | Idioma recomendado |
|---|---|
| Variables | Inglés |
| Funciones/métodos | Inglés |
| Clases/componentes | Inglés |
| Entidades/modelos | Inglés |
| Atributos/campos internos | Inglés |
| Tests | Inglés |
| Nombres de archivos | Inglés, preferiblemente kebab-case |
| Commits | Inglés; preferible inglés técnico |
| README/SOUL.md | Español, porque es entregable del reto |
| Mensajes visibles de UI | Español |
| Mensajes de error API | Español si son parte del producto; inglés si son internos |

Ejemplo correcto:

```python
class Product(BaseModel):
    name: str
    sku: str
    costCents: int
```

Ejemplo incorrecto:

```python
class Producto(BaseModel):
    nombre: str
    costo_centavos: int
```

---

## 3. Entidades y atributos

### Regla principal

- Las entidades deben nombrarse en **singular**.
- Las tablas del modelo de datos también deben nombrarse en **singular**.
- Las colecciones/listas en código pueden nombrarse en plural cuando representen múltiples elementos.
- Las rutas REST de colección pueden mantenerse en plural porque representan recursos HTTP, no nombres de entidades/tablas.

| Concepto | Correcto | Incorrecto |
|---|---|---|
| Entidad/clase | `Product` | `Products` |
| Entidad/clase | `Supplier` | `Suppliers` |
| Entidad/clase | `StockMovement` | `StockMovements` |
| Variable individual | `product` | `products` |
| Lista/array | `products` | `productList` si el contexto ya indica lista |
| Tabla SQL | `product` | `products` |
| Endpoint REST colección | `/api/products` | `/api/product-list` |
| Endpoint REST recurso | `/api/products/{productId}` | `/api/products/{productsId}` |

### Atributos recomendados

Usar nombres de dominio precisos:

```text
Product
- id
- name
- sku
- costCents
- priceCents
- stock
- minStock
- supplierId

Supplier
- id
- name
- email
- phone
- active

StockMovement
- id
- productId
- type
- quantity
- notes
- createdAt
```

Si el SUT o contrato existente usa un nombre distinto, respetar el contrato en los tests y documentar el alias. Ejemplo: si el API usa `qty`, los tests pueden validar `qty`, pero el helper interno puede llamarse `quantity`.

---

## 4. Convenciones de casing

| Convención | Ejemplo | Usar en |
|---|---|---|
| `camelCase` | `productId`, `createdAt` | JavaScript/TypeScript variables, funciones, JSON de frontend si se diseña desde cero |
| `PascalCase` | `ProductCard`, `StockMovement` | Clases, componentes React/Vue, tipos/interfaces, modelos conceptuales |
| `snake_case` | `product_id`, `created_at` | Python variables/funciones, columnas SQL, fixtures pytest, nombres de tests Python |
| `kebab-case` | `stock-movement-form`, `test-plan.md` | Rutas frontend, IDs/clases CSS si el proyecto lo usa, nombres de archivos Markdown, carpetas web |
| `UPPER_SNAKE_CASE` | `DB_PATH`, `JWT_SECRET_KEY` | Constantes y variables de entorno |

---

## 5. Aplicación por stack tecnológico

### Python / FastAPI / pytest

Usar `snake_case` para:

- Variables.
- Funciones.
- Métodos.
- Fixtures.
- Archivos `.py`.
- Tests.

Usar `PascalCase` para:

- Clases.
- Modelos Pydantic.
- Excepciones custom.

Usar `UPPER_SNAKE_CASE` para:

- Constantes.
- Variables de entorno.

Ejemplos:

```python
DB_PATH = "inventory.db"

class ProductIn(BaseModel):
    name: str
    sku: str
    cost_cents: int
    price_cents: int
    min_stock: int
    supplier_id: int


def get_product_by_id(product_id: int) -> ProductIn:
    ...


def test_create_product_with_duplicate_sku_returns_409():
    ...
```

Best practices:

- Tests deben empezar con `test_`.
- El nombre del test debe describir comportamiento esperado.
- Evitar tests genéricos como `test_api` o `test_product`.
- Separar arrange / act / assert.
- No depender del orden de ejecución entre tests.
- Usar fixtures para clientes, base de datos temporal y setup común.
- No hardcodear sleeps; esperar por condiciones observables.

---

### JavaScript / TypeScript / Frontend

Usar `camelCase` para:

- Variables.
- Funciones.
- Props.
- Estado local.
- Objetos JSON del frontend si no hay contrato backend previo.

Usar `PascalCase` para:

- Componentes.
- Clases.
- Tipos/interfaces si se usa TypeScript.

Usar `kebab-case` para:

- Rutas URL.
- IDs HTML y clases CSS, si se elige esa convención.
- Nombres de archivos estáticos o páginas si el framework lo favorece.

Ejemplos:

```javascript
const productId = 1;
const stockMovement = { productId, quantity: 3 };

function loadProducts() {
  ...
}

class StockMovementService {
  ...
}
```

React/Vue/Svelte si aplica:

```tsx
function ProductCard({ product }) {
  ...
}
```

Best practices:

- Evitar lógica de negocio compleja directamente en handlers de UI.
- Separar cliente API, componentes y helpers.
- Manejar estados de loading/error/empty.
- No duplicar strings de endpoints en muchos archivos; centralizarlos.
- Usar nombres semánticos para botones y formularios.

---

### SQL / PostgreSQL

Usar `snake_case` para:

- Tablas.
- Columnas.
- Índices.
- Constraints.

Tablas:

- Usar nombres de tabla en singular (`product`, `supplier`, `stock_movement`).
- No usar plural en tablas nuevas (`products`, `suppliers`, `stock_movements`) aunque representen colecciones de filas.
- Mantener entidades de código en singular (`Product`, `Supplier`, `StockMovement`).

Ejemplos:

```sql
CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  cost_cents INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  stock INTEGER NOT NULL,
  min_stock INTEGER NOT NULL,
  supplier_id INTEGER NOT NULL
);
```

Best practices:

- Montos monetarios como enteros en centavos: `cost_cents`, `price_cents`.
- Fechas como `created_at`, `updated_at`.
- Foreign keys con patrón `<entity>_id`.
- Agregar constraints cuando aplique:
  - `stock >= 0`
  - `min_stock >= 0`
  - `cost_cents >= 0`
  - `price_cents >= 0`
- Indexar foreign keys y campos de búsqueda frecuente.

---

### REST API

Usar rutas en plural y `kebab-case` si hay múltiples palabras.

Correcto:

```text
GET /api/products
GET /api/products/{productId}
POST /api/stock-movements
GET /api/saved-searches
```

Aceptable si el contrato existente ya lo define:

```text
POST /api/stock/movement
GET /api/stock/alerts
```

Best practices:

- Sustantivos, no verbos, en rutas.
- Usar status codes correctos:
  - `200` para consultas exitosas.
  - `201` para creación.
  - `400` para request inválido.
  - `401` para no autenticado.
  - `403` para no autorizado.
  - `404` para recurso no encontrado.
  - `409` para conflicto.
  - `422` para validación de schema si el framework lo usa.
  - `503` para dependencia no disponible.
- Respuestas de error consistentes.
- No filtrar detalles internos de excepciones.

---

### Archivos y carpetas

Usar nombres en inglés y `kebab-case` para documentos y carpetas de planificación:

```text
05-learning/01-planning/
  canonical-ai-first-phase1-challenge-plan.md
  ai-first-challenge-best-practices.md
  ai-first-challenge-tech-stack.md
  governance.md
  delivery-checklist.md
  daily-checkpoints.md
```

Python:

```text
tests/api/test_product.py
tests/api/test_stock_movement.py
```

Frontend:

```text
product-card.tsx
stock-movement-form.tsx
api-client.ts
```

Evitar:

```text
ProductCard.tsx       # salvo convención explícita del framework/proyecto
TestProducts.py
buenasPracticas.md
mis pruebas finales.py
```

---

## 6. Clean Code aplicado al reto

### Funciones

- Una función debe hacer una cosa.
- Nombre con verbo claro:
  - `create_product`
  - `register_stock_movement`
  - `fetch_public_opportunity`
  - `calculate_available_stock`
- Evitar funciones largas; si pasa de ~40 líneas, revisar si mezcla responsabilidades.

### Clases

- Nombre en singular y `PascalCase`.
- Deben representar una entidad, servicio o responsabilidad clara.
- Evitar clases `Manager` genéricas si se puede nombrar mejor.

Correcto:

```python
class ProductRepository:
    ...

class SecopClient:
    ...

class BookmarkService:
    ...
```

Menos claro:

```python
class ProductManager:
    ...

class GeneralUtils:
    ...
```

### Variables

- Nombre por intención, no por tipo.
- Evitar `data`, `item`, `obj`, `tmp` salvo contexto muy corto.

Correcto:

```python
product_response = client.get("/api/product/1")
created_product = product_response.json()
```

Incorrecto:

```python
r = client.get("/api/product/1")
d = r.json()
```

### Comentarios

- Comentar el porqué, no lo obvio.
- Si el comentario explica código confuso, preferir refactorizar el nombre.
- Documentar decisiones de diseño en `SOUL.md` o docs, no como comentarios largos en código.

---

## 7. Buenas prácticas específicas para Track QA

- No modificar el SUT en `3-challenge/gestor-inventario/`.
- Los tests pueden validar nombres existentes aunque no sigan la convención ideal.
- Helpers internos de test deben usar inglés y `snake_case`.
- Casos de prueba deben ser legibles y trazables al endpoint.
- Separar tests por dominio:

```text
track-qa/tests/api/test_health.py
track-qa/tests/api/test_product.py
track-qa/tests/api/test_stock_movement.py
track-qa/tests/api/test_stock_alerts.py
track-qa/tests/api/test_movements.py
```

Nombres recomendados:

```python
def test_health_returns_ok():
    ...


def test_create_product_with_duplicate_sku_returns_conflict():
    ...


def test_out_movement_greater_than_stock_does_not_allow_negative_stock():
    ...
```

Defectos:

- ID en `kebab-case`: `defect-negative-stock-allowed`.
- Título claro en inglés o español, pero consistente.
- Repro steps en español para el evaluador.
- Evidencia técnica con test/curl/log exacto.

---

## 8. Buenas prácticas específicas para Track DEV

- Definir primero la spec, luego código.
- Mantener nombres de entidad y tabla SQL en singular:
  - `User` / `app_user`
  - `PublicOpportunity` / `public_opportunity`
  - `Bookmark` / `bookmark`
  - `SavedSearch` / `saved_search`
- Mantener colecciones/listas de código en plural:
  - `users`
  - `opportunities`
  - `bookmarks`
  - `savedSearches`
- Encapsular integración externa:
  - `SecopClient`
  - `fetch_public_opportunity`
  - `normalize_secop_opportunity`
- No mezclar cliente SECOP con lógica de auth o UI.
- Validar errores de red y respuestas vacías.
- No persistir secretos en el repo.

Ejemplo de nombres por capa:

| Capa | Ejemplo |
|---|---|
| Modelo Python | `PublicOpportunity` |
| Tabla SQL | `public_opportunity` |
| JSON frontend | `publicOpportunity` |
| Ruta REST | `/api/public-opportunities` |
| Archivo frontend | `public-opportunity-card.tsx` |
| Test Python | `test_public_opportunity.py` |

---

## 9. Checklist antes de cerrar una tarea

- [ ] El código nuevo está en inglés.
- [ ] Entidades/clases están en singular.
- [ ] Colecciones/listas están en plural.
- [ ] `camelCase`, `PascalCase`, `kebab-case` y `snake_case` se aplicaron según el stack.
- [ ] Los nombres expresan intención.
- [ ] No hay mezcla innecesaria de español/inglés en código.
- [ ] No se duplicó lógica que debía estar en helper/servicio.
- [ ] Los tests tienen nombres descriptivos.
- [ ] La documentación visible para el evaluador está en español claro.
- [ ] El SUT no fue modificado si se trabaja en Track QA.

---

## 10. Regla final

Si hay conflicto entre este documento y una convención existente del proyecto:

1. Respetar primero el contrato público existente.
2. Respetar después el estilo predominante del repo.
3. Aplicar estas buenas prácticas en código nuevo.
4. Documentar cualquier excepción en `SOUL.md`.
