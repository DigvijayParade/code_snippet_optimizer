# Code Snippet Manager - Project Architecture & Roadmap

## 1. High-Level Architecture
This project uses a **Decoupled Client-Server Architecture**.

### The Client (Frontend)
- **Tech Stack:** React, Vite, Vanilla CSS.
- **Responsibility:** Handles the user interface, routing, state management, and syntax highlighting of code snippets. Communicates with the backend exclusively via REST APIs.

### The Server (Backend)
- **Tech Stack:** Java 17, Spring Boot (Spring Web, Spring Data JPA, Spring Security).
- **Responsibility:** Acts as the API provider. Validates business logic, authenticates users via JWT (JSON Web Tokens), and reads/writes to the database.

### The Database
- **Tech Stack:** H2 Database (In-Memory for MVP), migrating to PostgreSQL (Production).
- **Responsibility:** Persistent storage for users, snippets, and tags.

---

## 2. Database Schema

The database utilizes 3 main entities and 1 junction table to handle Many-to-Many relationships.

### users Table
- id (Primary Key, Auto-increment)
- username (Unique, Not Null)
- email (Unique, Not Null)
- password (Hashed, Not Null)
- created_at (Timestamp)

### snippets Table
- id (Primary Key, Auto-increment)
- 	itle (String, Not Null)
- code_content (Text, Not Null)
- language (String - e.g., "java", "python")
- description (Text)
- user_id (Foreign Key referencing users.id)
- created_at (Timestamp)
- updated_at (Timestamp)

### 	ags Table
- id (Primary Key, Auto-increment)
- 
ame (String, Unique)

### snippet_tags (Junction Table)
- snippet_id (Foreign Key referencing snippets.id)
- 	ag_id (Foreign Key referencing 	ags.id)

---

## 3. REST API Endpoints

### Authentication
- POST /api/auth/signup - Register a new user account.
- POST /api/auth/login - Authenticate and receive a JWT.

### Snippets
- GET /api/snippets - Retrieve all snippets for the authenticated user.
- GET /api/snippets/{id} - Retrieve a specific snippet by ID.
- POST /api/snippets - Create a new snippet.
- PUT /api/snippets/{id} - Update an existing snippet.
- DELETE /api/snippets/{id} - Delete a snippet.

---

## 4. Development Roadmap

### Phase 1: Foundation & Backend Auth
- Scaffold Spring Boot project with dependencies.
- Configure Database connection (pplication.properties).
- Create User entity and UserRepository.
- Implement Spring Security and JWT Utilities.
- Create AuthController to handle Signup and Login.

### Phase 2: Core API (Snippets & Tags)
- Create Snippet and Tag entities with Many-to-Many mappings.
- Implement Repositories for DB access.
- Build SnippetController for full CRUD operations.
- Implement logic to handle creating and assigning tags to snippets.

### Phase 3: Premium Frontend
- Scaffold React project via Vite.
- Build Global CSS Design System (Dark mode, glassmorphism).
- Build Auth Views (Login/Register pages).
- Build Dashboard (Snippet list, Snippet viewer with Prism.js syntax highlighting, Create modal).
- Integrate API calls using etch or xios with JWT headers.

### Phase 4: Polish & Deploy
- Swap H2 database for PostgreSQL.
- Containerize with Docker (Optional).
- Deploy Backend to Render.
- Deploy Frontend to Vercel or Render.
