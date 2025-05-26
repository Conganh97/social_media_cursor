# Frontend API Integration Errors

## Summary
Based on comparison between FRONTEND_API_DOCUMENTATION.md and the actual frontend implementation, several critical integration errors have been identified.

## 1. Missing Social Interactions API Implementation

### Issue: Complete Missing Social Module API Services
**Severity: CRITICAL**

The frontend documentation mentions a complete social interactions module, but the API service implementations are missing:

**Missing Services:**
- `socialApi.ts` - No social API service found
- `commentApi.ts` - No comment API service found  
- `likeApi.ts` - No like API service found
- `friendshipApi.ts` - No friendship API service found

**Expected Endpoints (from documentation):**
- Comments: `/api/comments/{postId}`, `/api/comments/{commentId}`, `/api/comments/post/{postId}`
- Likes: `/api/likes/{postId}`, `/api/likes/{postId}/toggle`, `/api/likes/{postId}/status`
- Friendships: `/api/friendships/request`, `/api/friendships/{id}/accept`, `/api/friendships/friends`

**Current Implementation:**
- Post API service has some like functionality but uses incorrect endpoints
- No dedicated social interaction services
- No friendship management APIs

## 2. Endpoint URL Mismatches

### Issue: Post Like/Unlike Endpoint Inconsistency
**Severity: HIGH**

**Documentation says:**
```typescript
// POST /api/likes/{postId}
// DELETE /api/likes/{postId}
// POST /api/likes/{postId}/toggle
```

**Frontend implementation (postApi.ts:75-85):**
```typescript
async likePost(postId: number): Promise<{ success: boolean; message: string }> {
  const response = await httpClient.post(`/likes/${postId}`);
  return response.data as { success: boolean; message: string };
}

async unlikePost(postId: number): Promise<{ success: boolean; message: string }> {
  const response = await httpClient.delete(`/likes/${postId}`);
  return response.data as { success: boolean; message: string };
}
```

**Error:** Missing `/api` prefix in endpoints and incorrect response type expectation.

### Issue: Comments Endpoint Implementation Missing
**Severity: HIGH**

**Documentation says:**
```typescript
// POST /api/comments/{postId}
// GET /api/comments/post/{postId}
// PUT /api/comments/{commentId}
// DELETE /api/comments/{commentId}
```

**Frontend implementation:**
- No comment API service exists
- Post types include comment-related interfaces but no API calls

## 3. Response Type Mismatches

### Issue: Authentication Response Structure
**Severity: MEDIUM**

**Documentation defines:**
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

**Frontend auth.types.ts matches this correctly**, but the login field mapping is incorrect:

**Frontend authApi.ts:14-18:**
```typescript
const loginData = {
  usernameOrEmail: credentials.email,
  password: credentials.password
};
```

**Documentation expects:**
```typescript
interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}
```

**Error:** Frontend `LoginCredentials` uses `email` field but maps to `usernameOrEmail`.

### Issue: Post Response Structure Mismatch
**Severity: MEDIUM**

**Documentation defines:**
```typescript
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
```

**Frontend post.types.ts:26-40:**
```typescript
interface Post {
  id: number;
  content: string;
  author: User;
  images: PostImage[];  // ❌ Should be imageUrl?: string
  likesCount: number;   // ❌ Should be likeCount: number
  commentsCount: number; // ❌ Should be commentCount: number
  sharesCount: number;  // ❌ Not in documentation
  isLiked: boolean;     // ❌ Should be isLikedByCurrentUser: boolean
  isBookmarked: boolean; // ❌ Not in documentation
  // ... other fields that don't match
}
```

## 4. Messaging API Integration Issues

### Issue: Messaging Endpoint Structure Mismatch
**Severity: MEDIUM**

**Documentation defines:**
```typescript
// POST /api/messages
// GET /api/messages/conversation/{otherUserId}
// GET /api/messages/conversations
```

**Frontend messageApi.ts uses different structure:**
```typescript
// Uses conversation-based endpoints that don't match documentation
getConversations: async (filters?: ConversationFilters) => {
  return apiService.get<Conversation[]>(`/messages/conversations?${params.toString()}`);
},
getMessages: async (conversationId: string, page: number = 0, size: number = 20) => {
  return apiService.get<PaginatedMessages>(
    `/messages/conversations/${conversationId}/messages?page=${page}&size=${size}`
  );
},
```

**Error:** Frontend assumes conversation-based messaging but documentation shows user-based messaging.

## 5. WebSocket Integration Missing

### Issue: No WebSocket Service Implementation
**Severity: HIGH**

**Documentation includes:**
- WebSocket configuration with SockJS
- Real-time messaging endpoints
- Notification WebSocket endpoints
- Typing indicators
- Online status

**Frontend implementation:**
- No WebSocket service found
- Message service mentions WebSocket but no implementation
- No real-time features implemented

## 6. File Upload Inconsistencies

### Issue: File Upload Endpoint Mismatches
**Severity: MEDIUM**

**Documentation defines:**
```typescript
// POST /api/files/upload
// POST /api/files/upload/profile-image
// POST /api/files/upload/post-image
// POST /api/users/upload-avatar
```

**Frontend implementation:**
- User API correctly uses `/users/upload-avatar`
- Post API uses custom form data structure not matching documentation
- No dedicated file upload service

## 7. Pagination Structure Inconsistency

### Issue: Pagination Response Mismatch
**Severity: MEDIUM**

**Documentation defines:**
```typescript
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

**Frontend post.types.ts:58-62:**
```typescript
interface FeedResponse {
  posts: Post[];
  hasNext: boolean;     // ❌ Should be last: boolean
  totalElements: number; // ✅ Correct
  currentPage: number;  // ❌ Should be number: number
}
```

## 8. Error Handling Structure Mismatch

### Issue: Error Response Format
**Severity: LOW**

**Documentation defines:**
```typescript
interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  correlationId: string;
}
```

**Frontend httpClient.ts error handling doesn't expect this structure:**
```typescript
private handleError(error: any): ApiError {
  if (error.response) {
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      timestamp: new Date().toISOString(),
      path: error.config?.url,
    };
  }
  // ...
}
```

**Missing:** correlationId, error field extraction.

## 9. Notification API Base URL Issue

### Issue: Notification API Base URL Duplication
**Severity: LOW**

**Frontend notificationApi.ts:11:**
```typescript
private baseUrl = '/api/notifications';
```

**Error:** Base URL includes `/api` but httpClient already adds `/api` prefix, causing `/api/api/notifications`.

## Recommendations

1. **Create missing social API services** with correct endpoints
2. **Fix endpoint URL patterns** to match documentation
3. **Update response type interfaces** to match backend exactly
4. **Implement WebSocket service** for real-time features
5. **Standardize pagination structures** across all APIs
6. **Fix notification API base URL** duplication
7. **Update error handling** to match backend error format
8. **Create integration tests** to catch these mismatches early

## Priority

1. **CRITICAL:** Missing social interaction APIs
2. **HIGH:** Endpoint URL mismatches and WebSocket missing
3. **MEDIUM:** Response type mismatches and pagination
4. **LOW:** Error handling and base URL issues 