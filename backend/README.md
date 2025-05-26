# Social Media Backend API

A comprehensive Spring Boot REST API for a social media platform featuring JWT authentication, real-time messaging, notifications, file management, and complete social interactions.

## 🎉 Project Status: 100% Complete

This backend implementation includes all major social media features with a modular architecture, production-ready security, comprehensive error handling, and interactive API documentation.

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens
- Secure user registration and login
- Password encryption with BCrypt
- Token blacklisting for secure logout
- Email verification system
- Password reset functionality
- Spring Security 6.1+ integration

### 👥 User Management
- Complete user profile management
- Avatar upload and processing
- User search and discovery
- Profile editing and validation
- User deactivation
- User statistics and analytics

### 📝 Post Management
- Create, read, update, delete posts
- Image upload and processing
- Post feed generation with pagination
- User-specific post filtering
- Post statistics and metrics
- Content validation and moderation

### 🤝 Social Interactions
- Like/unlike posts and comments
- Nested comment system with replies
- Friendship management system
- Friend request handling
- Social activity tracking
- User blocking/unblocking
- Mutual friends discovery

### 💬 Real-time Messaging
- WebSocket-based messaging system
- One-on-one conversations
- Message read status tracking
- Typing indicators
- Online presence tracking
- Message history and pagination
- File attachment support

### 🔔 Notifications
- Real-time notification system
- WebSocket notification delivery
- Multiple notification types
- Read/unread status management
- Notification preferences
- Push notification support
- Notification grouping and filtering

### 📁 File Management
- Secure file upload system
- Image processing and resizing
- Automatic thumbnail generation
- Multiple file format support
- File validation and security
- Storage management
- CDN-ready file serving

## 🏗️ Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Database**: PostgreSQL
- **Authentication**: JWT (JJWT 0.12.3)
- **Security**: Spring Security 6.1+
- **Real-time**: WebSocket (STOMP)
- **Documentation**: OpenAPI/Swagger UI
- **ORM**: Hibernate/JPA
- **Validation**: Bean Validation
- **Build Tool**: Maven
- **Java Version**: 17
- **Code Generation**: Lombok 1.18.30

## 📂 Project Structure

```
backend/
├── src/main/java/com/socialmedia/
│   ├── SocialMediaApplication.java     # Main application class
│   ├── modules/                        # Feature modules
│   │   ├── auth/                      # Authentication module
│   │   │   ├── controller/            # Auth endpoints
│   │   │   ├── service/               # Auth business logic
│   │   │   └── dto/                   # Auth data transfer objects
│   │   ├── user/                      # User management
│   │   ├── post/                      # Post management
│   │   ├── social/                    # Social interactions
│   │   ├── messaging/                 # Real-time messaging
│   │   ├── notification/              # Notification system
│   │   └── file/                      # File management
│   ├── shared/                        # Shared utilities
│   │   ├── exception/                 # Global exception handling
│   │   ├── dto/                       # Common DTOs
│   │   └── util/                      # Utility classes
│   ├── security/                      # JWT security components
│   │   ├── JwtTokenProvider.java      # JWT token management
│   │   ├── JwtAuthenticationFilter.java
│   │   └── CustomUserDetailsService.java
│   ├── config/                        # Configuration classes
│   │   ├── SecurityConfig.java        # Security configuration
│   │   ├── WebSocketConfig.java       # WebSocket configuration
│   │   └── SwaggerConfig.java         # API documentation
│   ├── entity/                        # JPA entities
│   └── repository/                    # Data access layer
└── src/main/resources/
    ├── application.properties         # Main configuration
    ├── application-dev.properties     # Development settings
    └── application-prod.properties    # Production settings
```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- PostgreSQL 12+
- Maven 3.6+

### Database Setup

1. **Install PostgreSQL** and create databases:
```sql
CREATE DATABASE socialmedia;
CREATE DATABASE socialmedia_dev;
CREATE DATABASE socialmedia_test;
```

2. **Configure database credentials** in `application.properties`:
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

3. **Using the build script:**
```bash
# Windows
build.bat

# Manual build and run
mvn clean package
java -jar target/social-media-backend-0.0.1-SNAPSHOT.jar
```

### Accessing the Application

- **API Base URL**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Documentation**: http://localhost:8080/v3/api-docs

## 📋 API Endpoints

### Authentication Module (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Secure logout

### User Management (`/api/users`)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/search` - Search users
- `POST /api/users/upload-avatar` - Upload avatar
- `POST /api/users/users-by-ids` - Get multiple users
- `DELETE /api/users/{id}/deactivate` - Deactivate user

### Post Management (`/api/posts`)
- `POST /api/posts` - Create new post
- `GET /api/posts/{id}` - Get post by ID
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post
- `GET /api/posts/feed` - Get user feed
- `GET /api/posts/user/{userId}` - Get user posts
- `GET /api/posts/recent` - Get recent posts
- `GET /api/posts/count/user/{userId}` - Get post count

### Social Interactions
#### Comments (`/api/comments`)
- `POST /api/comments` - Create comment
- `GET /api/comments/post/{postId}` - Get post comments
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

#### Likes (`/api/likes`)
- `POST /api/likes/post/{postId}` - Like/unlike post
- `POST /api/likes/comment/{commentId}` - Like/unlike comment
- `GET /api/likes/post/{postId}` - Get post likes
- `GET /api/likes/post/{postId}/check` - Check if post is liked

#### Friendships (`/api/friendships`)
- `POST /api/friendships/request` - Send friend request
- `PUT /api/friendships/{id}/accept` - Accept friend request
- `PUT /api/friendships/{id}/decline` - Decline friend request
- `DELETE /api/friendships/{id}` - Remove friend
- `GET /api/friendships/friends` - Get friend list
- `GET /api/friendships/requests` - Get friend requests
- `GET /api/friendships/suggestions` - Get friend suggestions

### Messaging (`/api/messages`)
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/conversation/{id}` - Get conversation messages
- `POST /api/messages` - Send message
- `PUT /api/messages/{id}` - Update message
- `DELETE /api/messages/{id}` - Delete message
- `PUT /api/messages/{id}/read` - Mark message as read

### Notifications (`/api/notifications`)
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/{id}` - Get notification by ID
- `PUT /api/notifications/{id}/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/{id}` - Delete notification
- `GET /api/notifications/unread-count` - Get unread count

### File Management (`/api/files`)
- `POST /api/files/upload` - Upload file
- `GET /api/files/{filename}` - Download file
- `GET /api/files/image/{filename}` - Get image
- `GET /api/files/thumbnail/{filename}` - Get thumbnail
- `DELETE /api/files/{filename}` - Delete file

## 🔧 Configuration

### JWT Settings
```properties
# JWT Configuration
app.jwt.secret=your-secret-key-min-464-bits
app.jwt.expiration=86400000          # 24 hours
app.jwt.refresh.expiration=604800000 # 7 days
```

### Database Settings
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/socialmedia
spring.jpa.hibernate.ddl-auto=create-drop  # Development
spring.jpa.hibernate.ddl-auto=validate     # Production
```

### File Upload Settings
```properties
# File Storage Configuration
file.storage.upload-dir=uploads/
file.storage.max-file-size=10MB
file.storage.max-image-size=10MB
file.storage.enable-image-processing=true
file.storage.enable-thumbnail-generation=true
```

### WebSocket Configuration
```properties
# WebSocket Configuration (in Java)
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer
```

## 📊 API Usage Examples

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

### Login and get token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "johndoe",
    "password": "password123"
  }'
```

### Create a post
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, world!",
    "visibility": "PUBLIC"
  }'
```

### Send friend request
```bash
curl -X POST http://localhost:8080/api/friendships/request \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": 2
  }'
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthControllerTest

# Run tests with coverage
mvn test jacoco:report
```

### Test Database
The application uses a separate test database for integration tests:
```properties
# application-test.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/socialmedia_test
```

## 🏭 Production Deployment

### Build for Production
```bash
# Build JAR file
mvn clean package -Dmaven.test.skip=true

# Run with production profile
java -jar target/social-media-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/social-media-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Environment Variables
```bash
# Production environment variables
export DB_HOST=your-db-host
export DB_NAME=socialmedia_prod
export DB_USERNAME=your-username
export DB_PASSWORD=your-password
export JWT_SECRET=your-production-secret-key
```

## 📈 Monitoring & Health

### Health Check Endpoints
- `GET /actuator/health` - Application health status
- `GET /actuator/info` - Application information
- `GET /actuator/metrics` - Application metrics

### Logging Configuration
```properties
# Logging levels
logging.level.com.socialmedia=INFO
logging.level.org.springframework.security=WARN
logging.level.org.hibernate.SQL=DEBUG
```

## 🔒 Security Features

- **JWT Authentication** with access and refresh tokens
- **Password Encryption** using BCrypt
- **CORS Configuration** for frontend integration
- **Request/Response Security** headers
- **Token Blacklisting** for secure logout
- **Input Validation** and sanitization
- **SQL Injection Protection** via JPA/Hibernate
- **XSS Protection** through output encoding

## 📚 Documentation

- **Interactive API Documentation**: Available at `/swagger-ui.html`
- **OpenAPI Specification**: Available at `/v3/api-docs`
- **Detailed API Guide**: See `API_USAGE_GUIDE.md`
- **Postman Collection**: Import from Swagger UI

## 🎯 Key Achievements

- ✅ **80+ REST API Endpoints** across 7 feature modules
- ✅ **Real-time WebSocket Integration** for messaging and notifications
- ✅ **Advanced File Management** with image processing and thumbnails
- ✅ **Production-Ready Security** with JWT and refresh tokens
- ✅ **Comprehensive Error Handling** with correlation tracking
- ✅ **Interactive Swagger Documentation** with modular organization
- ✅ **Test Data Initialization** for immediate development use
- ✅ **Modular Architecture** with clear separation of concerns
- ✅ **Complete CRUD Operations** for all major entities
- ✅ **Real-time Features** via WebSocket (STOMP)

## 🤝 Contributing

1. Follow the existing modular architecture
2. Add comprehensive tests for new features
3. Update API documentation for new endpoints
4. Follow Spring Boot best practices
5. Use Lombok to reduce boilerplate code
6. Add proper validation and error handling

## 📄 License

This project is developed for educational and demonstration purposes.

---

**Status**: ✅ Production-ready Spring Boot API with comprehensive social media features! 