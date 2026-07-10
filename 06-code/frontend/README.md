# Frontend — Portal de Convocatorias Públicas

Scaffold React + TypeScript + Vite para la capa frontend real del producto.

Decisiones del scaffold:

- React Router v6 para rutas públicas y privadas.
- Zustand para estado global de autenticación.
- `fetch` nativo para cliente HTTP explícito por endpoint.
- Tailwind CSS v4 mediante `@tailwindcss/vite`.
- El frontend consume `/api/v1/*`; Vite proxya `/api` hacia `http://localhost:8000` en desarrollo.

Reglas de capa:

- No consumir datos.gov.co / SECOP directamente desde frontend.
- No persistir datos de dominio como fuente de verdad.
- No codificar reglas críticas de autorización; el backend valida.
