# Code Snippet Optimizer — Implementation Roadmap

Last reviewed: 13 November 2026

This roadmap describes the code snippet manager in this repository. The project has a Spring Boot REST API, a React/Vite frontend, H2 for local development, and a PostgreSQL production profile.

## Current state

| Area | Status | Notes |
| --- | --- | --- |
| Account and JWT authentication | Implemented | Signup/signin, BCrypt password hashes, bearer-token authentication |
| Snippet API | Implemented | Create, list, read, update, delete; records are owner-scoped |
| Tags | Implemented | Tags can be added to snippets and filtered in the UI |
| React frontend | Implemented | Account screens, library, search, tag filtering, editor, copy, delete |
| Local database | Implemented | H2 schema is created by Flyway |
| Production configuration | Implemented | PostgreSQL profile, environment-based credentials and JWT key |
| Containers | Implemented | Docker Compose includes PostgreSQL, API, and Nginx frontend |
| Backend tests | Verified | All four tests pass against the Flyway-managed H2 schema (13 Nov 2026) |
| Hosting | Pending | No production services have been provisioned or deployed |

## Priorities

### P1 — Validate the full stack after the migration changes

- [x] Run the backend test suite against the Flyway-managed H2 schema (4 passed).
- Build and start the Docker Compose stack; exercise signup, sign-in, and snippet CRUD through the Nginx `/api` proxy.
- Verify that the PostgreSQL profile starts against a clean PostgreSQL database and that Hibernate accepts the migrated schema.

Container and PostgreSQL checks remain pending because Docker and Podman are not installed in the current environment.

**Done when:** tests pass and the same core user flow works through the container stack and PostgreSQL.

### P2 — Deploy to a hosting provider

- Choose a host for the containers and a managed PostgreSQL service.
- Configure the production profile, JDBC URL, database credentials, and a randomly generated Base64 JWT key using the host's secret store.
- Put the public app behind HTTPS and verify browser-to-API requests.
- Configure automated database backups and document recovery steps.

**Done when:** a public HTTPS deployment is available, secrets are not stored in the repository, and a backup can be restored.

### P3 — Improve production security and operations

- Add rate limits for signup and sign-in, and review API error responses and request-size limits.
- Decide how to protect browser sessions against script injection before expanding token persistence in local storage.
- Add health and readiness endpoints for the API and container orchestration.
- Review dependency updates and container image updates on a regular schedule.

**Done when:** the production checklist is reviewed and operational health can be monitored.

### P4 — Product polish

- Add syntax highlighting with a supported language set.
- Implement visible sorting controls and keyboard shortcuts, or remove UI affordances that imply those features.
- Improve empty, loading, and error states and check keyboard navigation on small and large screens.

**Done when:** the snippet library is comfortable to use on mobile and desktop, with clear behavior for each visible control.

## Local commands

```powershell
# Backend tests
cd backend
.\mvnw.cmd test

# Frontend production build
cd ..\frontend
npm ci
npm run build

# Container stack (copy .env.example to .env and set secrets first)
cd ..
docker compose up --build -d
```

See [README.md](README.md) for environment setup, API routes, and container instructions.
