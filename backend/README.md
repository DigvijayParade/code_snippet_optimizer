# Code Snippet Optimizer

A full-stack web application for saving, organizing, and managing code snippets with secure JWT authentication.

## 🚀 Tech Stack

### Backend
- **Java 17** + **Spring Boot**
- **Spring Security** with JWT (JSON Web Tokens) for stateless authentication
- **Spring Data JPA** + **Hibernate** for database operations
- **H2 Database** (in-memory, for development)
- **Lombok** for reducing boilerplate code
- **Maven** for dependency management

### Frontend (Coming Soon)
- **React.js**

## 📁 Project Structure

code_snippet_manager/ └── backend/ └── src/main/java/com/example/demo/ ├── DemoApplication.java # App entry point ├── model/ │ └── User.java # JPA Entity → users table ├── repository/ │ └── UserRepository.java # Database queries (auto-generated) └── security/ ├── JwtUtils.java # Token generation & validation ├── AuthTokenFilter.java # Intercepts requests, checks JWT ├── AuthEntryPointJwt.java # Handles 401 Unauthorized errors ├── UserDetailsImpl.java # Bridges User entity ↔ Spring Security ├── UserDetailsServiceImpl.java # Loads user from DB for authentication └── WebSecurityConfig.java # Master security configuration

## 🔐 How Authentication Works
1. User sends username & password to `/api/auth/signup` or `/api/auth/signin`
2. Server validates credentials against the database
3. On success, server generates a **JWT token** and sends it back
4. For all future requests, the user includes this token in the `Authorization` header
5. The `AuthTokenFilter` intercepts every request and validates the token before granting access
## 🛠️ How to Run
### Prerequisites
- Java 17+
- Maven (included via Maven Wrapper)
### Run the Backend
```bash
cd backend
./mvnw spring-boot:run
Access the H2 Database Console
Navigate to http://localhost:8080/h2-console and use:

JDBC URL: jdbc:h2:mem:snippetdb
Username: sa
Password: password
📌 Current Progress
 Spring Boot project setup with Maven
 User entity & repository (JPA + Hibernate)
 JWT token generation & validation
 Spring Security filter chain & configuration
 Auth Controller (Signup/Login API)
 Snippet & Tag models
 Snippet CRUD API
 React Frontend
 Connect Frontend to Backend
👨‍💻 Author
Built by Digvijay — learning full-stack development one commit at a time.

