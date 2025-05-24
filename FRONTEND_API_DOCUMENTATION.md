# Frontend API Integration Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Base Configuration](#base-configuration)
3. [Error Handling](#error-handling)
4. [Authentication Module API](#authentication-module-api)
5. [User Management Module API](#user-management-module-api)
6. [Post Management Module API](#post-management-module-api)
7. [Social Interactions Module API](#social-interactions-module-api)
8. [Messaging Module API](#messaging-module-api)
9. [Notification Module API](#notification-module-api)
10. [File Management Module API](#file-management-module-api)
11. [WebSocket Integration](#websocket-integration)
12. [Frontend Implementation Examples](#frontend-implementation-examples)

## Base Configuration

### Base URL
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Common Headers
```typescript
const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

const getFileUploadHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`
});
```

## Authentication

### JWT Token Structure
```typescript
interface JwtResponse {
  token: string;
  refreshToken: string;
  type: string; // "Bearer"
  userId: number;
  username: string;
  email: string;
}
```

### Token Storage
```typescript
// Store tokens in localStorage
localStorage.setItem('accessToken', response.token);
localStorage.setItem('refreshToken', response.refreshToken);

// Get token for API calls
const getAccessToken = () => localStorage.getItem('accessToken');
```

## Error Handling

### Standard Error Response Format
```typescript
interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  correlationId: string;
}

interface ValidationErrorResponse extends ErrorResponse {
  fieldErrors: FieldError[];
}

interface FieldError {
  field: string;
  rejectedValue: any;
  message: string;
}
```

### Error Status Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (access denied)
- `404` - Not Found (resource not found)
- `409` - Conflict (duplicate resource)
- `413` - Payload Too Large (file upload)
- `422` - Unprocessable Entity (business logic errors)
- `500` - Internal Server Error

## Authentication Module API

### 1. User Registration
```typescript
// POST /api/auth/register
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Response: JwtResponse
const register = async (data: RegisterRequest): Promise<JwtResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

### 2. User Login
```typescript
// POST /api/auth/login
interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

// Response: JwtResponse
const login = async (data: LoginRequest): Promise<JwtResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

### 3. Refresh Token
```typescript
// POST /api/auth/refresh
interface RefreshTokenRequest {
  refreshToken: string;
}

// Response: JwtResponse
const refreshToken = async (refreshToken: string): Promise<JwtResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  return response.json();
};
```

### 4. Logout
```typescript
// POST /api/auth/logout
const logout = async (token: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(token)
  });
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
```

## User Management Module API

### User Data Types
```typescript
interface UserInfoResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: string;
  lastActive: string;
  isActive: boolean;
}

interface UserSummaryResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}

interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
}
```

### 1. Get Current User Profile
```typescript
// GET /api/users/me
const getCurrentUser = async (token: string): Promise<UserInfoResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

### 2. Update Current User Profile
```typescript
// PUT /api/users/me
const updateCurrentUser = async (
  token: string, 
  data: UserUpdateRequest
): Promise<UserInfoResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });
  return response.json();
};
```

### 3. Get User by ID
```typescript
// GET /api/users/{id}
const getUserById = async (token: string, userId: number): Promise<UserInfoResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

### 4. Search Users
```typescript
// GET /api/users/search?query={query}
const searchUsers = async (
  token: string, 
  query: string
): Promise<UserSummaryResponse[]> => {
  const response = await fetch(
    `${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

### 5. Upload Avatar
```typescript
// POST /api/users/upload-avatar
const uploadAvatar = async (token: string, file: File): Promise<{ profilePictureUrl: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/users/upload-avatar`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  return response.json();
};
```

### 6. Get Users by IDs
```typescript
// POST /api/users/users-by-ids
const getUsersByIds = async (
  token: string, 
  userIds: number[]
): Promise<UserSummaryResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/users/users-by-ids`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(userIds)
  });
  return response.json();
};
```

## Post Management Module API

### Post Data Types
```typescript
interface PostRequest {
  content: string;
  imageUrl?: string;
}

interface PostResponse {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  author: UserSummaryResponse;
}

interface PostSummaryResponse {
  id: number;
  content: string; // truncated to 100 chars
  imageUrl?: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  author: UserSummaryResponse;
}

interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
```

### 1. Create Post
```typescript
// POST /api/posts
const createPost = async (token: string, data: PostRequest): Promise<PostResponse> => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });
  return response.json();
};
```

### 2. Get Post by ID
```typescript
// GET /api/posts/{id}
const getPostById = async (token: string, postId: number): Promise<PostResponse> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

### 3. Update Post
```typescript
// PUT /api/posts/{id}
const updatePost = async (
  token: string, 
  postId: number, 
  data: PostRequest
): Promise<PostResponse> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });
  return response.json();
};
```

### 4. Delete Post
```typescript
// DELETE /api/posts/{id}
const deletePost = async (token: string, postId: number): Promise<void> => {
  await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
};
```

### 5. Get Feed Posts (Paginated)
```typescript
// GET /api/posts/feed?page={page}&size={size}
const getFeedPosts = async (
  token: string, 
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<PostResponse>> => {
  const response = await fetch(
    `${API_BASE_URL}/posts/feed?page=${page}&size=${size}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

### 6. Get User Posts (Paginated)
```typescript
// GET /api/posts/user/{userId}?page={page}&size={size}
const getUserPosts = async (
  token: string, 
  userId: number,
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<PostResponse>> => {
  const response = await fetch(
    `${API_BASE_URL}/posts/user/${userId}?page=${page}&size=${size}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

### 7. Get Recent Posts
```typescript
// GET /api/posts/recent?limit={limit}
const getRecentPosts = async (
  token: string, 
  limit: number = 5
): Promise<PostSummaryResponse[]> => {
  const response = await fetch(
    `${API_BASE_URL}/posts/recent?limit=${limit}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

### 8. Get Post Count by User
```typescript
// GET /api/posts/count/user/{userId}
const getPostCountByUser = async (
  token: string, 
  userId: number
): Promise<{ count: number }> => {
  const response = await fetch(
    `${API_BASE_URL}/posts/count/user/${userId}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

## Social Interactions Module API

### Comment Data Types
```typescript
interface CommentRequest {
  content: string;
}

interface CommentResponse {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: UserSummaryResponse;
  postId: number;
}
```

### Friendship Data Types
```typescript
interface FriendshipRequest {
  targetUserId: number;
}

interface FriendshipResponse {
  id: number;
  requester: UserSummaryResponse;
  receiver: UserSummaryResponse;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
  updatedAt: string;
}

type FriendshipStatus = 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'FRIENDS';
```

### Comment API Endpoints

#### 1. Create Comment
```typescript
// POST /api/comments/{postId}
const createComment = async (
  token: string, 
  postId: number, 
  data: CommentRequest
): Promise<CommentResponse> => {
  const response = await fetch(`${API_BASE_URL}/comments/${postId}`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });
  return response.json();
};
```

#### 2. Get Comments by Post
```typescript
// GET /api/comments/post/{postId}?page={page}&size={size}
const getCommentsByPost = async (
  token: string, 
  postId: number,
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<CommentResponse>> => {
  const response = await fetch(
    `${API_BASE_URL}/comments/post/${postId}?page=${page}&size=${size}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

#### 3. Update Comment
```typescript
// PUT /api/comments/{commentId}
const updateComment = async (
  token: string, 
  commentId: number, 
  data: CommentRequest
): Promise<CommentResponse> => {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });
  return response.json();
};
```

#### 4. Delete Comment
```typescript
// DELETE /api/comments/{commentId}
const deleteComment = async (token: string, commentId: number): Promise<void> => {
  await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
};
```

#### 5. Get Comment Count by Post
```typescript
// GET /api/comments/count/post/{postId}
const getCommentCountByPost = async (
  token: string, 
  postId: number
): Promise<{ count: number }> => {
  const response = await fetch(
    `${API_BASE_URL}/comments/count/post/${postId}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

#### 6. Get Recent Comments by Post
```typescript
// GET /api/comments/recent/post/{postId}?limit={limit}
const getRecentCommentsByPost = async (
  token: string, 
  postId: number,
  limit: number = 3
): Promise<CommentResponse[]> => {
  const response = await fetch(
    `${API_BASE_URL}/comments/recent/post/${postId}?limit=${limit}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

### Like API Endpoints

#### 1. Like Post
```typescript
// POST /api/likes/{postId}
const likePost = async (token: string, postId: number): Promise<void> => {
  await fetch(`${API_BASE_URL}/likes/${postId}`, {
    method: 'POST',
    headers: getAuthHeaders(token)
  });
};
```

#### 2. Unlike Post
```typescript
// DELETE /api/likes/{postId}
const unlikePost = async (token: string, postId: number): Promise<void> => {
  await fetch(`${API_BASE_URL}/likes/${postId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
};
```

#### 3. Toggle Like (Recommended)
```typescript
// POST /api/likes/{postId}/toggle
const toggleLike = async (
  token: string, 
  postId: number
): Promise<{ liked: boolean; likeCount: number }> => {
  const response = await fetch(`${API_BASE_URL}/likes/${postId}/toggle`, {
    method: 'POST',
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

#### 4. Check Like Status
```typescript
// GET /api/likes/{postId}/status
const getLikeStatus = async (
  token: string, 
  postId: number
): Promise<{ isLiked: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/likes/${postId}/status`, {
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

#### 5. Get Users Who Liked Post
```typescript
// GET /api/likes/{postId}/users?page={page}&size={size}
const getUsersWhoLikedPost = async (
  token: string, 
  postId: number,
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<UserSummaryResponse>> => {
  const response = await fetch(
    `${API_BASE_URL}/likes/${postId}/users?page=${page}&size=${size}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

#### 6. Get Posts Liked by User
```typescript
// GET /api/likes/user/{userId}/posts?page={page}&size={size}
const getPostsLikedByUser = async (
  token: string, 
  userId: number,
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<PostResponse>> => {
  const response = await fetch(
    `${API_BASE_URL}/likes/user/${userId}/posts?page=${page}&size=${size}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

#### 7. Get Like Count by Post
```typescript
// GET /api/likes/count/post/{postId}
const getLikeCountByPost = async (
  token: string, 
  postId: number
): Promise<{ count: number }> => {
  const response = await fetch(
    `${API_BASE_URL}/likes/count/post/${postId}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

### Friendship API Endpoints

#### 1. Send Friend Request
```typescript
// POST /api/friendships/request
const sendFriendRequest = async (
  token: string, 
  data: FriendshipRequest
): Promise<FriendshipResponse> => {
  const response = await fetch(`${API_BASE_URL}/friendships/request`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });
  return response.json();
};
```

#### 2. Accept Friend Request
```typescript
// PUT /api/friendships/{friendshipId}/accept
const acceptFriendRequest = async (
  token: string, 
  friendshipId: number
): Promise<FriendshipResponse> => {
  const response = await fetch(`${API_BASE_URL}/friendships/${friendshipId}/accept`, {
    method: 'PUT',
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

#### 3. Reject Friend Request
```typescript
// PUT /api/friendships/{friendshipId}/reject
const rejectFriendRequest = async (
  token: string, 
  friendshipId: number
): Promise<FriendshipResponse> => {
  const response = await fetch(`${API_BASE_URL}/friendships/${friendshipId}/reject`, {
    method: 'PUT',
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

#### 4. Get Friends
```typescript
// GET /api/friendships/friends?page={page}&size={size}
const getFriends = async (
  token: string,
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<UserSummaryResponse>> => {
  const response = await fetch(
    `${API_BASE_URL}/friendships/friends?page=${page}&size=${size}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

#### 5. Get Pending Friend Requests
```typescript
// GET /api/friendships/pending?page={page}&size={size}
const getPendingFriendRequests = async (
  token: string,
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<FriendshipResponse>> => {
  const response = await fetch(
    `${API_BASE_URL}/friendships/pending?page=${page}&size=${size}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

#### 6. Get Sent Friend Requests
```typescript
// GET /api/friendships/sent?page={page}&size={size}
const getSentFriendRequests = async (
  token: string,
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<FriendshipResponse>> => {
  const response = await fetch(
    `${API_BASE_URL}/friendships/sent?page=${page}&size=${size}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

#### 7. Check Friendship Status
```typescript
// GET /api/friendships/status/{userId}
const getFriendshipStatus = async (
  token: string, 
  userId: number
): Promise<{ status: FriendshipStatus }> => {
  const response = await fetch(`${API_BASE_URL}/friendships/status/${userId}`, {
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

#### 8. Get Friend Count
```typescript
// GET /api/friendships/count
const getFriendCount = async (token: string): Promise<{ count: number }> => {
  const response = await fetch(`${API_BASE_URL}/friendships/count`, {
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

## Messaging Module API

### Message Data Types
```typescript
interface MessageRequest {
  receiverId: number;
  content: string;
}

interface MessageResponse {
  id: number;
  content: string;
  sender: UserSummaryResponse;
  receiver: UserSummaryResponse;
  readStatus: boolean;
  createdAt: string;
}

interface ConversationResponse {
  otherUser: UserSummaryResponse;
  lastMessage: MessageResponse;
  unreadCount: number;
  lastActivity: string;
}
```

### 1. Send Message
```typescript
// POST /api/messages
const sendMessage = async (
  token: string, 
  data: MessageRequest
): Promise<MessageResponse> => {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data)
  });
  return response.json();
};
```

### 2. Get Conversation Messages
```typescript
// GET /api/messages/conversation/{otherUserId}?page={page}&size={size}
const getConversationMessages = async (
  token: string, 
  otherUserId: number,
  page: number = 0, 
  size: number = 20
): Promise<PagedResponse<MessageResponse>> => {
  const response = await fetch(
    `${API_BASE_URL}/messages/conversation/${otherUserId}?page=${page}&size=${size}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

### 3. Get User Conversations
```typescript
// GET /api/messages/conversations?page={page}&size={size}
const getUserConversations = async (
  token: string,
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<ConversationResponse>> => {
  const response = await fetch(
    `${API_BASE_URL}/messages/conversations?page=${page}&size=${size}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

### 4. Get Message by ID
```typescript
// GET /api/messages/{messageId}
const getMessageById = async (
  token: string, 
  messageId: number
): Promise<MessageResponse> => {
  const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

### 5. Mark Message as Read
```typescript
// PUT /api/messages/{messageId}/read
const markMessageAsRead = async (token: string, messageId: number): Promise<void> => {
  await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(token)
  });
};
```

### 6. Mark Conversation as Read
```typescript
// PUT /api/messages/conversation/{otherUserId}/read
const markConversationAsRead = async (
  token: string, 
  otherUserId: number
): Promise<void> => {
  await fetch(`${API_BASE_URL}/messages/conversation/${otherUserId}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(token)
  });
};
```

### 7. Get Unread Message Count
```typescript
// GET /api/messages/unread/count
const getUnreadMessageCount = async (token: string): Promise<{ count: number }> => {
  const response = await fetch(`${API_BASE_URL}/messages/unread/count`, {
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

### 8. Get Conversation Unread Count
```typescript
// GET /api/messages/unread/count/{otherUserId}
const getConversationUnreadCount = async (
  token: string, 
  otherUserId: number
): Promise<{ count: number }> => {
  const response = await fetch(
    `${API_BASE_URL}/messages/unread/count/${otherUserId}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

### 9. Search Messages in Conversation
```typescript
// GET /api/messages/search?otherUserId={otherUserId}&query={query}&page={page}&size={size}
const searchMessagesInConversation = async (
  token: string, 
  otherUserId: number,
  query: string,
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<MessageResponse>> => {
  const params = new URLSearchParams({
    otherUserId: otherUserId.toString(),
    query,
    page: page.toString(),
    size: size.toString()
  });
  
  const response = await fetch(`${API_BASE_URL}/messages/search?${params}`, {
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

### 10. Check Conversation Existence
```typescript
// GET /api/messages/has-conversation/{otherUserId}
const hasConversationWith = async (
  token: string, 
  otherUserId: number
): Promise<{ exists: boolean }> => {
  const response = await fetch(
    `${API_BASE_URL}/messages/has-conversation/${otherUserId}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

## Notification Module API

### Notification Data Types
```typescript
interface NotificationResponse {
  id: number;
  type: NotificationType;
  message: string;
  relatedUserId?: number;
  relatedPostId?: number;
  relatedCommentId?: number;
  relatedUser?: UserSummaryResponse;
  isRead: boolean;
  createdAt: string;
}

interface NotificationSummary {
  totalCount: number;
  unreadCount: number;
  countsByType: {
    [key in NotificationType]: number;
  };
}

type NotificationType = 
  | 'LIKE' 
  | 'COMMENT' 
  | 'FRIEND_REQUEST' 
  | 'FRIEND_ACCEPTED' 
  | 'MESSAGE' 
  | 'POST_MENTION' 
  | 'COMMENT_MENTION';
```

### 1. Get User Notifications
```typescript
// GET /api/notifications?page={page}&size={size}
const getUserNotifications = async (
  token: string,
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<NotificationResponse>> => {
  const response = await fetch(
    `${API_BASE_URL}/notifications?page=${page}&size=${size}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

### 2. Get Unread Notifications
```typescript
// GET /api/notifications/unread?page={page}&size={size}
const getUnreadNotifications = async (
  token: string,
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<NotificationResponse>> => {
  const response = await fetch(
    `${API_BASE_URL}/notifications/unread?page=${page}&size=${size}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

### 3. Get Notifications by Type
```typescript
// GET /api/notifications/type/{type}?page={page}&size={size}
const getNotificationsByType = async (
  token: string, 
  type: NotificationType,
  page: number = 0, 
  size: number = 10
): Promise<PagedResponse<NotificationResponse>> => {
  const response = await fetch(
    `${API_BASE_URL}/notifications/type/${type}?page=${page}&size=${size}`,
    { headers: getAuthHeaders(token) }
  );
  return response.json();
};
```

### 4. Get Notification by ID
```typescript
// GET /api/notifications/{notificationId}
const getNotificationById = async (
  token: string, 
  notificationId: number
): Promise<NotificationResponse> => {
  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

### 5. Mark Notification as Read
```typescript
// PUT /api/notifications/{notificationId}/read
const markNotificationAsRead = async (
  token: string, 
  notificationId: number
): Promise<void> => {
  await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(token)
  });
};
```

### 6. Mark All Notifications as Read
```typescript
// PUT /api/notifications/read-all
const markAllNotificationsAsRead = async (token: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: 'PUT',
    headers: getAuthHeaders(token)
  });
};
```

### 7. Get Unread Notification Count
```typescript
// GET /api/notifications/count/unread
const getUnreadNotificationCount = async (
  token: string
): Promise<{ count: number }> => {
  const response = await fetch(`${API_BASE_URL}/notifications/count/unread`, {
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

### 8. Get Notification Summary
```typescript
// GET /api/notifications/summary
const getNotificationSummary = async (
  token: string
): Promise<NotificationSummary> => {
  const response = await fetch(`${API_BASE_URL}/notifications/summary`, {
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

### 9. Delete Notification
```typescript
// DELETE /api/notifications/{notificationId}
const deleteNotification = async (
  token: string, 
  notificationId: number
): Promise<void> => {
  await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
};
```

## File Management Module API

### File Data Types
```typescript
interface FileUploadResponse {
  fileName: string;
  originalFileName: string;
  fileSize: number;
  contentType: string;
  uploadPath: string;
  fileUrl: string;
  thumbnailUrl?: string;
}

interface ImageUploadRequest {
  file: File;
  uploadPath: 'profiles' | 'posts' | 'temp';
}
```

### 1. General File Upload
```typescript
// POST /api/files/upload
const uploadFile = async (
  token: string, 
  file: File, 
  uploadPath: string = 'temp'
): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadPath', uploadPath);
  
  const response = await fetch(`${API_BASE_URL}/files/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  return response.json();
};
```

### 2. Profile Image Upload
```typescript
// POST /api/files/upload/profile-image
const uploadProfileImage = async (
  token: string, 
  file: File
): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/files/upload/profile-image`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  return response.json();
};
```

### 3. Post Image Upload
```typescript
// POST /api/files/upload/post-image
const uploadPostImage = async (
  token: string, 
  file: File
): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/files/upload/post-image`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  return response.json();
};
```

### 4. File Download
```typescript
// GET /api/files/download/{fileName}
const downloadFile = async (token: string, fileName: string): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/files/download/${fileName}`, {
    headers: getAuthHeaders(token)
  });
  return response.blob();
};
```

### 5. Get Profile Image
```typescript
// GET /api/files/profiles/{fileName}
const getProfileImage = (fileName: string): string => {
  return `${API_BASE_URL}/files/profiles/${fileName}`;
};
```

### 6. Get Post Image
```typescript
// GET /api/files/posts/{fileName}
const getPostImage = (fileName: string): string => {
  return `${API_BASE_URL}/files/posts/${fileName}`;
};
```

### 7. Get Thumbnail
```typescript
// GET /api/files/thumbnails/{fileName}
const getThumbnail = (fileName: string): string => {
  return `${API_BASE_URL}/files/thumbnails/${fileName}`;
};
```

### 8. Delete File
```typescript
// DELETE /api/files/delete/{fileName}
const deleteFile = async (token: string, fileName: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/files/delete/${fileName}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
};
```

### 9. Get File Upload Info
```typescript
// GET /api/files/info
interface FileUploadInfo {
  maxFileSize: number;
  allowedImageTypes: string[];
  allowedFileTypes: string[];
  maxImageDimensions: {
    width: number;
    height: number;
  };
}

const getFileUploadInfo = async (): Promise<FileUploadInfo> => {
  const response = await fetch(`${API_BASE_URL}/files/info`);
  return response.json();
};
```

### 10. Check File Existence
```typescript
// GET /api/files/exists/{fileName}
const checkFileExists = async (
  token: string, 
  fileName: string
): Promise<{ exists: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/files/exists/${fileName}`, {
    headers: getAuthHeaders(token)
  });
  return response.json();
};
```

## WebSocket Integration

### WebSocket Configuration
```typescript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WEBSOCKET_URL = 'http://localhost:8080/ws';

class WebSocketService {
  private client: Client | null = null;
  private token: string | null = null;

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.token = token;
      
      this.client = new Client({
        webSocketFactory: () => new SockJS(WEBSOCKET_URL),
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        onConnect: () => {
          console.log('WebSocket connected');
          resolve();
        },
        onStompError: (frame) => {
          console.error('WebSocket error:', frame);
          reject(frame);
        }
      });
      
      this.client.activate();
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
```

### Message WebSocket Endpoints

#### 1. Send Real-time Message
```typescript
// Subscribe to: /user/queue/messages
// Send to: /app/chat.sendMessage
const subscribeToMessages = (callback: (message: MessageResponse) => void) => {
  webSocketService.client?.subscribe('/user/queue/messages', (message) => {
    callback(JSON.parse(message.body));
  });
};

const sendRealtimeMessage = (receiverId: number, content: string) => {
  webSocketService.client?.publish({
    destination: '/app/chat.sendMessage',
    body: JSON.stringify({ receiverId, content })
  });
};
```

#### 2. Typing Indicators
```typescript
// Subscribe to: /user/queue/typing
// Send to: /app/chat.typing
const subscribeToTyping = (callback: (data: { userId: number; isTyping: boolean }) => void) => {
  webSocketService.client?.subscribe('/user/queue/typing', (message) => {
    callback(JSON.parse(message.body));
  });
};

const sendTypingIndicator = (receiverId: number, isTyping: boolean) => {
  webSocketService.client?.publish({
    destination: '/app/chat.typing',
    body: JSON.stringify({ receiverId, isTyping })
  });
};
```

#### 3. Online Status
```typescript
// Subscribe to: /user/queue/online-status
// Send to: /app/chat.online
const subscribeToOnlineStatus = (callback: (data: { userId: number; isOnline: boolean }) => void) => {
  webSocketService.client?.subscribe('/user/queue/online-status', (message) => {
    callback(JSON.parse(message.body));
  });
};

const updateOnlineStatus = (isOnline: boolean) => {
  webSocketService.client?.publish({
    destination: '/app/chat.online',
    body: JSON.stringify({ isOnline })
  });
};
```

### Notification WebSocket Endpoints

#### 1. Real-time Notifications
```typescript
// Subscribe to: /user/queue/notifications
// Send to: /app/notifications.create
const subscribeToNotifications = (callback: (notification: NotificationResponse) => void) => {
  webSocketService.client?.subscribe('/user/queue/notifications', (message) => {
    callback(JSON.parse(message.body));
  });
};

const subscribeToNotificationUpdates = () => {
  webSocketService.client?.publish({
    destination: '/app/notifications.subscribe',
    body: JSON.stringify({})
  });
};
```

#### 2. Notification Status Updates
```typescript
// Send to: /app/notifications.markAsRead
const markNotificationAsReadRealtime = (notificationId: number) => {
  webSocketService.client?.publish({
    destination: '/app/notifications.markAsRead',
    body: JSON.stringify({ notificationId })
  });
};

// Send to: /app/notifications.markAllAsRead
const markAllNotificationsAsReadRealtime = () => {
  webSocketService.client?.publish({
    destination: '/app/notifications.markAllAsRead',
    body: JSON.stringify({})
  });
};
```

## Frontend Implementation Examples

### React Hook for API Integration
```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const result = await apiCall();
        
        if (isMounted) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({ 
            data: null, 
            loading: false, 
            error: error instanceof Error ? error.message : 'An error occurred' 
          });
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
}
```

### Authentication Context
```typescript
// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: UserInfoResponse | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfoResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      // Fetch user profile
      getCurrentUser(storedToken)
        .then(setUser)
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = async (credentials: LoginRequest) => {
    const response = await login(credentials);
    setToken(response.token);
    setUser({
      id: response.userId,
      username: response.username,
      email: response.email,
      // ... other fields will be fetched
    } as UserInfoResponse);
    localStorage.setItem('accessToken', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    if (token) {
      logout(token).catch(console.error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login: loginUser, 
      logout: logoutUser, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Infinite Scroll Hook for Posts
```typescript
// hooks/useInfiniteScroll.ts
import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetcher: (page: number, size: number) => Promise<PagedResponse<T>>;
  pageSize?: number;
  enabled?: boolean;
}

export function useInfiniteScroll<T>({
  fetcher,
  pageSize = 10,
  enabled = true
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetcher(page, pageSize);
      
      setItems(prev => page === 0 ? response.content : [...prev, ...response.content]);
      setHasMore(!response.last);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, pageSize, loading, hasMore, enabled]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    if (enabled && page === 0) {
      loadMore();
    }
  }, [enabled, loadMore, page]);

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    reset
  };
}
```

### WebSocket Hook
```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import webSocketService from '../services/webSocketService';
import { useAuth } from '../context/AuthContext';

export function useWebSocket() {
  const { token } = useAuth();
  const isConnected = useRef(false);

  useEffect(() => {
    if (token && !isConnected.current) {
      webSocketService.connect(token)
        .then(() => {
          isConnected.current = true;
        })
        .catch(console.error);
    }

    return () => {
      if (isConnected.current) {
        webSocketService.disconnect();
        isConnected.current = false;
      }
    };
  }, [token]);

  return webSocketService;
}
```

This comprehensive API documentation provides everything needed for frontend integration with the backend social media platform. The documentation includes all endpoints, data types, error handling, WebSocket integration, and practical React implementation examples. 