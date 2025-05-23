# Social Media Backend

A Spring Boot REST API for a social media platform with JWT authentication, PostgreSQL database, and WebSocket support for real-time features.

## Features Implemented ✅

### Authentication & Security
- JWT-based authentication
- User registration and login
- Password encryption with BCrypt
- CORS configuration
- Spring Security integration

### Database & Entities
- User entity with validation
- Post entity with relationships
- Comment entity
- Like entity with unique constraints
- PostgreSQL database configuration
- JPA/Hibernate setup

### API Endpoints
- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/login` - User authentication

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security
- **ORM**: Hibernate/JPA
- **Build Tool**: Maven
- **Java Version**: 17

## Project Structure

```
backend/
├── src/main/java/com/socialmedia/
│   ├── SocialMediaApplication.java          # Main application class
│   ├── config/
│   │   └── SecurityConfig.java             # Security configuration
│   ├── controller/
│   │   └── AuthController.java             # Authentication endpoints
│   ├── dto/                                # Data Transfer Objects
│   │   ├── JwtResponse.java
│   │   ├── LoginRequest.java
│   │   └── RegisterRequest.java
│   ├── entity/                             # JPA entities
│   │   ├── Comment.java
│   │   ├── Like.java
│   │   ├── Post.java
│   │   └── User.java
│   ├── repository/                         # Data access layer
│   │   ├── PostRepository.java
│   │   └── UserRepository.java
│   ├── security/                           # JWT security components
│   │   ├── CustomUserDetailsService.java
│   │   ├── JwtAuthenticationEntryPoint.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtTokenProvider.java
│   │   └── UserPrincipal.java
│   └── service/                            # Business logic layer
│       ├── UserService.java
│       └── impl/
│           └── UserServiceImpl.java
└── src/main/resources/
    ├── application.properties              # Main configuration
    ├── application-dev.properties          # Development config
    └── application-prod.properties         # Production config
```

## Setup Instructions

### Prerequisites
- Java 17+
- PostgreSQL 12+
- Maven 3.6+

### Database Setup
1. Create PostgreSQL database:
```sql
CREATE DATABASE socialmedia;
CREATE DATABASE socialmedia_dev;
```

2. Update database credentials in `application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Running the Application

1. **Development mode:**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

2. **Production mode:**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

3. **Build JAR:**
```bash
mvn clean package
java -jar target/social-media-backend-0.0.1-SNAPSHOT.jar
```

## API Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "johndoe",
    "password": "password123"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

## Configuration

### JWT Settings
```properties
app.jwt.secret=your-secret-key
app.jwt.expiration=86400000  # 24 hours
```

### Database Settings
```properties
spring.jpa.hibernate.ddl-auto=create-drop  # Development
spring.jpa.hibernate.ddl-auto=validate     # Production
```

## Next Implementation Steps

### Remaining Backend Features:
1. **Complete Entities**: Friendship, Message, Notification
2. **Service Layer**: Post, Comment, Like services
3. **REST Controllers**: User, Post, Comment, Like controllers
4. **WebSocket**: Real-time messaging and notifications
5. **File Upload**: Image upload and processing
6. **Testing**: Unit and integration tests

### API Endpoints to Implement:
- User management (`/api/users/*`)
- Post operations (`/api/posts/*`)
- Social features (`/api/friends/*`, `/api/likes/*`)
- Messaging (`/api/messages/*`)
- Notifications (`/api/notifications/*`)

## Security Features

- JWT token-based authentication
- Password encryption with BCrypt
- CORS support for frontend integration
- Request/Response security headers
- Protected endpoints with Spring Security

## Database Schema

Current entities with relationships:
- **User** ↔ **Post** (One-to-Many)
- **User** ↔ **Comment** (One-to-Many)
- **User** ↔ **Like** (One-to-Many)
- **Post** ↔ **Comment** (One-to-Many)
- **Post** ↔ **Like** (One-to-Many)

## Contributing

1. Follow the existing code structure
2. Add proper validation and error handling
3. Write unit tests for new features
4. Update documentation for new endpoints 