# Social Media API Usage Guide

## Overview

The Social Media API is a comprehensive REST API built with Spring Boot that provides all the functionality needed for a modern social media platform. This guide covers authentication, endpoints, request/response formats, and best practices.

## Table of Contents

1. [API Documentation Access](#api-documentation-access)
2. [Authentication](#authentication)
3. [API Modules Overview](#api-modules-overview)
4. [Error Handling](#error-handling)
5. [Pagination](#pagination)
6. [Rate Limiting](#rate-limiting)
7. [Module-Specific Usage](#module-specific-usage)
8. [WebSocket Endpoints](#websocket-endpoints)
9. [Best Practices](#best-practices)

## API Documentation Access

### Swagger UI
Access the interactive API documentation at:
- **Development**: `http://localhost:8080/swagger-ui.html`
- **Production**: `https://api.socialmedia.com/swagger-ui.html`

### OpenAPI JSON
Raw API specification available at:
- **Development**: `http://localhost:8080/api-docs`
- **Production**: `https://api.socialmedia.com/api-docs`

## Authentication

### JWT Token-Based Authentication

The API uses JWT (JSON Web Token) for authentication. All protected endpoints require a valid JWT token in the Authorization header.

#### Login Process

```bash
# 1. Login to get tokens
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "john_doe",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 86400
}
```

#### Using the Token

Include the access token in the Authorization header for all protected endpoints:

```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

#### Token Refresh

When the access token expires, use the refresh token to get a new one:

```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

## API Modules Overview

### 1. Authentication Module (`/api/auth`)
- User registration and login
- Token management (access/refresh)
- Secure logout with token blacklisting

### 2. User Management Module (`/api/users`)
- Profile management
- User search and discovery
- Avatar upload
- Account deactivation

### 3. Post Management Module (`/api/posts`)
- Create, read, update, delete posts
- Feed generation
- Post statistics
- Image attachments

### 4. Social Interactions Module (`/api/comments`, `/api/likes`, `/api/friendships`)
- Comment management
- Like/unlike functionality
- Friend requests and management
- Social statistics

### 5. Messaging Module (`/api/messages`)
- Direct messaging
- Conversation management
- Real-time message delivery
- Message history

### 6. Notifications Module (`/api/notifications`)
- Push notifications
- Real-time updates
- Notification preferences
- Read/unread status

### 7. File Management Module (`/api/files`)
- File upload/download
- Image processing
- File validation
- Storage management

## Error Handling

### Standard Error Response Format

All API errors follow a consistent format:

```json
{
  "timestamp": "2024-01-15T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for field 'username'",
  "path": "/api/users/me",
  "correlationId": "abc-123-def"
}
```

### HTTP Status Codes

| Code | Description | When Used |
|------|-------------|-----------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 400 | Bad Request | Validation errors, malformed requests |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resources (username, email) |
| 422 | Unprocessable Entity | Business logic validation errors |
| 500 | Internal Server Error | Server-side errors |

## Pagination

### Request Parameters

Most list endpoints support pagination:

```bash
curl -X GET "http://localhost:8080/api/posts/feed?page=0&size=10" \
  -H "Authorization: Bearer {token}"
```

### Response Format

Paginated responses use Spring's Page format:

```json
{
  "content": [...],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "properties": ["createdAt"]
    }
  },
  "totalElements": 150,
  "totalPages": 15,
  "first": true,
  "last": false,
  "numberOfElements": 10
}
```

## Rate Limiting

### Current Limits (Development)
- **Authentication endpoints**: 5 requests per minute per IP
- **File upload endpoints**: 10 requests per minute per user
- **General API endpoints**: 100 requests per minute per user

### Headers
Rate limit information is included in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

## Module-Specific Usage

### User Management

#### Get Current User Profile
```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer {token}"
```

#### Update Profile
```bash
curl -X PUT http://localhost:8080/api/users/me \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith", 
    "bio": "Software developer",
    "location": "San Francisco, CA"
  }'
```

#### Search Users
```bash
curl -X GET "http://localhost:8080/api/users/search?query=john" \
  -H "Authorization: Bearer {token}"
```

### Post Management

#### Create Post
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Beautiful sunset today! 🌅",
    "imageUrl": "/uploads/posts/sunset.jpg",
    "isPrivate": false
  }'
```

#### Get Feed Posts
```bash
curl -X GET "http://localhost:8080/api/posts/feed?page=0&size=10" \
  -H "Authorization: Bearer {token}"
```

#### Get User Posts
```bash
curl -X GET "http://localhost:8080/api/posts/user/123?page=0&size=10" \
  -H "Authorization: Bearer {token}"
```

### Social Interactions

#### Create Comment
```bash
curl -X POST http://localhost:8080/api/comments \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": 1,
    "content": "Great post! Thanks for sharing."
  }'
```

#### Like/Unlike Post
```bash
# Like a post
curl -X POST http://localhost:8080/api/likes/post/1/like \
  -H "Authorization: Bearer {token}"

# Unlike a post
curl -X DELETE http://localhost:8080/api/likes/post/1/unlike \
  -H "Authorization: Bearer {token}"
```

#### Send Friend Request
```bash
curl -X POST http://localhost:8080/api/friendships/request \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "friendUserId": 123
  }'
```

### File Upload

#### Upload Avatar
```bash
curl -X POST http://localhost:8080/api/users/upload-avatar \
  -H "Authorization: Bearer {token}" \
  -F "file=@profile.jpg"
```

#### Upload Post Image
```bash
curl -X POST http://localhost:8080/api/files/upload \
  -H "Authorization: Bearer {token}" \
  -F "file=@image.jpg" \
  -F "type=post"
```

## WebSocket Endpoints

### Real-time Messaging
```javascript
// Connect to WebSocket
const socket = new WebSocket('ws://localhost:8080/ws/messaging');

// Send message
socket.send(JSON.stringify({
  type: 'SEND_MESSAGE',
  recipientId: 123,
  content: 'Hello there!'
}));
```

### Real-time Notifications
```javascript
// Connect to notifications WebSocket
const notificationSocket = new WebSocket('ws://localhost:8080/ws/notifications');

// Listen for notifications
notificationSocket.onmessage = function(event) {
  const notification = JSON.parse(event.data);
  console.log('New notification:', notification);
};
```

## Best Practices

### 1. Authentication
- Always store tokens securely (never in localStorage for sensitive apps)
- Implement automatic token refresh
- Handle token expiration gracefully
- Logout users when refresh token expires

### 2. Error Handling
- Always check response status codes
- Display user-friendly error messages
- Log detailed errors for debugging
- Implement retry logic for transient errors

### 3. Performance
- Use pagination for list endpoints
- Cache frequently accessed data
- Implement optimistic updates for better UX
- Use WebSockets for real-time features

### 4. Security
- Validate all input on the client side
- Never expose sensitive data in URLs
- Use HTTPS in production
- Implement proper CORS settings

### 5. API Usage
- Follow RESTful conventions
- Use appropriate HTTP methods
- Include proper Content-Type headers
- Handle file uploads correctly

## Example Integration (JavaScript)

```javascript
class SocialMediaAPI {
  constructor(baseURL = 'http://localhost:8080', token = null) {
    this.baseURL = baseURL;
    this.token = token;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Authentication
  async login(usernameOrEmail, password) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password })
    });
    this.setToken(response.accessToken);
    return response;
  }

  // User Management
  async getCurrentUser() {
    return this.request('/api/users/me');
  }

  async updateProfile(data) {
    return this.request('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Posts
  async createPost(content, imageUrl = null, isPrivate = false) {
    return this.request('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ content, imageUrl, isPrivate })
    });
  }

  async getFeedPosts(page = 0, size = 10) {
    return this.request(`/api/posts/feed?page=${page}&size=${size}`);
  }

  // Comments
  async createComment(postId, content) {
    return this.request('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ postId, content })
    });
  }
}

// Usage example
const api = new SocialMediaAPI();

async function loginAndCreatePost() {
  try {
    // Login
    await api.login('john_doe', 'password123');
    
    // Create a post
    const post = await api.createPost('Hello, Social Media API!');
    console.log('Post created:', post);
    
    // Get feed posts
    const feed = await api.getFeedPosts(0, 5);
    console.log('Feed posts:', feed);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Support and Contributing

### Getting Help
- Check the Swagger UI for detailed endpoint documentation
- Review this usage guide for common patterns
- Check the error response format for debugging
- Contact the development team for API issues

### API Versioning
- Current version: v1.0.0
- Breaking changes will increment major version
- Backward-compatible changes increment minor version
- Bug fixes increment patch version

### Changelog
- **v1.0.0**: Initial API release with all core modules
- All endpoints documented with OpenAPI 3.0
- WebSocket support for real-time features
- Comprehensive error handling and validation 