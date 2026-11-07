// Todo

1. tsconfig files consistency.
2. set up routeConfig

## Backend integration

The app talks to `school-management-system-backend` (Swagger UI at `/api-docs`).

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` (default `http://localhost:4000`).
2. Start the backend, then `npm run dev`.

- `src/services/apiClient.js` – axios instance (Bearer token, error normalisation, 401 sign-out).
- `src/services/api.js` – one client per backend resource. Requests use camelCase, responses are PascalCase.
- `src/utils/mappers.js` – converts API records to the shapes the UI components use.
- Login: `POST /auth/login` returns only a JWT; the user and role (role id 3 → teacher, 4 → student, all others → admin) are decoded from it.
- Modules without backend endpoints (library, transport, exam, store, attendance, etc.) still use `src/mock`.

Known backend issue affecting the UI: `GET /students/searchAll` is shadowed by `GET /students/:id`, so student lists fail until the route order is fixed in the backend.