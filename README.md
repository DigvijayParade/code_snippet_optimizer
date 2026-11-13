# Code Snippet Optimizer

A full-stack app for saving, organizing, and finding code snippets. The Spring Boot API provides JWT authentication and owner-scoped snippet CRUD; the React app provides account, search, tag, and editing screens.

## Stack

- **Frontend:** React, Vite, CSS, Lucide icons
- **Backend:** Java 17, Spring Boot, Spring Security, Spring Data JPA
- **Development database:** H2 in-memory
- **Authentication:** BCrypt passwords and JWT bearer tokens

## Run locally

Set a local JWT signing key in PowerShell, then start the backend in that same terminal:

```powershell
$rng = [Security.Cryptography.RandomNumberGenerator]::Create()
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
$rng.Dispose()
cd backend
.\mvnw.cmd spring-boot:run
```

The key is randomly generated for that terminal session. Generate and store a separate secret in your deployment platform for production. The old in-source signing key has been removed; any service that used it should be restarted with a fresh key, which invalidates old tokens.

Start the frontend in another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Vite forwards `/api` requests to the backend at `http://localhost:8080`, so both services should be running during development.

The frontend supports account registration and sign-in, listing and searching snippets, filtering by tag, creating and editing snippets, copying code, and deleting snippets. The session token is stored in browser local storage. The H2 console is available at `http://localhost:8080/h2-console` while the backend is running.

## Production configuration

The production profile uses PostgreSQL and requires all of these environment variables:

- `SPRING_PROFILES_ACTIVE=prod`
- `DATABASE_URL` — JDBC URL, such as `jdbc:postgresql://host:5432/snippets`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET` — Base64 encoding of at least 32 random bytes
- `JWT_EXPIRATION_MS` — optional; defaults to 24 hours

Flyway applies versioned schema migrations at startup, and Hibernate validates the resulting schema. Back up the database before deploying new migrations. Keep the database and JWT credentials in the hosting provider's secret store; do not commit them to this repository.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Create an account |
| `POST` | `/api/auth/signin` | Sign in and receive a JWT |
| `GET` | `/api/snippets` | List the signed-in user's snippets |
| `GET` | `/api/snippets/{id}` | Get one owned snippet |
| `POST` | `/api/snippets` | Create a snippet |
| `PUT` | `/api/snippets/{id}` | Update an owned snippet |
| `DELETE` | `/api/snippets/{id}` | Delete an owned snippet |

Snippet requests accept `title`, `codeContent`, `language`, `description`, and a `tags` array. Protected routes require `Authorization: Bearer <token>`.

## Project layout

```text
backend/   Spring Boot API and API tests
frontend/  React and Vite application
```

## Status

- [x] Backend authentication and JWT security
- [x] Owner-scoped snippet and tag CRUD API
- [x] React account screens and snippet library interface
- [x] Frontend connected to the API through the Vite development proxy
- [x] Backend API tests pass (4 tests)
- [x] PostgreSQL production profile, environment-based secrets, and versioned schema migration
- [ ] Provision production services, set provider secrets, and deploy frontend/backend

For deployment, serve the frontend and backend under the same origin or configure the production frontend/API origin and backend CORS policy accordingly. The local Vite proxy is for development.
