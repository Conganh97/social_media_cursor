# Frontend API Integration Fix Plan

## Overview
This plan addresses all integration errors identified in `error_integration.md`, organized by priority and designed for AI agent execution.

## Phase 1: Critical Fixes (URGENT - Must Do First)

### Step 1.1: Create Missing Social API Services Structure
**Priority:** CRITICAL  
**Estimated Time:** 2 hours  
**Files to Create:**
- `frontend/src/modules/social/services/socialApi.ts`
- `frontend/src/modules/social/services/commentApi.ts`
- `frontend/src/modules/social/services/likeApi.ts`
- `frontend/src/modules/social/services/friendshipApi.ts`
- `frontend/src/modules/social/services/index.ts`

**Action Items:**
1. Create the social services directory structure
2. Implement `commentApi.ts` with endpoints:
   - `POST /api/comments/{postId}` - Create comment
   - `GET /api/comments/post/{postId}` - Get comments by post
   - `PUT /api/comments/{commentId}` - Update comment
   - `DELETE /api/comments/{commentId}` - Delete comment
   - `GET /api/comments/count/post/{postId}` - Get comment count
   - `GET /api/comments/recent/post/{postId}` - Get recent comments

3. Implement `likeApi.ts` with endpoints:
   - `POST /api/likes/{postId}` - Like post
   - `DELETE /api/likes/{postId}` - Unlike post
   - `POST /api/likes/{postId}/toggle` - Toggle like
   - `GET /api/likes/{postId}/status` - Check like status
   - `GET /api/likes/{postId}/users` - Get users who liked
   - `GET /api/likes/count/post/{postId}` - Get like count

4. Implement `friendshipApi.ts` with endpoints:
   - `POST /api/friendships/request` - Send friend request
   - `PUT /api/friendships/{id}/accept` - Accept friend request
   - `PUT /api/friendships/{id}/reject` - Reject friend request
   - `GET /api/friendships/friends` - Get friends list
   - `GET /api/friendships/pending` - Get pending requests
   - `GET /api/friendships/sent` - Get sent requests
   - `GET /api/friendships/status/{userId}` - Get friendship status
   - `GET /api/friendships/count` - Get friend count

5. Create `socialApi.ts` as main service aggregator
6. Create `index.ts` to export all services

### Step 1.2: Fix Post API Endpoint URLs
**Priority:** CRITICAL  
**File to Modify:** `frontend/src/modules/post/services/postApi.ts`

**Action Items:**
1. Remove like-related methods from postApi.ts (lines 75-110)
2. Replace with imports from new likeApi service
3. Fix any remaining endpoint URL issues

### Step 1.3: Update Social Module Redux Integration
**Priority:** CRITICAL  
**Files to Modify:**
- `frontend/src/modules/social/store/socialSlice.ts`
- `frontend/src/modules/social/hooks/useSocial.ts`

**Action Items:**
1. Update socialSlice to use new API services
2. Add async thunks for all social operations
3. Update useSocial hook to use new API methods
4. Ensure proper error handling

## Phase 2: High Priority Fixes

### Step 2.1: Implement WebSocket Service
**Priority:** HIGH  
**Files to Create:**
- `frontend/src/shared/services/webSocketService.ts`
- `frontend/src/modules/messaging/services/messageWebSocketService.ts`
- `frontend/src/modules/notification/services/notificationWebSocketService.ts`

**Action Items:**
1. Create base WebSocket service with SockJS integration
2. Implement message WebSocket service for:
   - Real-time messaging
   - Typing indicators
   - Online status
3. Implement notification WebSocket service for:
   - Real-time notifications
   - Notification status updates
4. Update messaging and notification hooks to use WebSocket
5. Add WebSocket connection management to App.tsx

### Step 2.2: Fix Endpoint URL Patterns
**Priority:** HIGH  
**Files to Modify:**
- `frontend/src/modules/post/services/postApi.ts`
- `frontend/src/modules/notification/services/notificationApi.ts`

**Action Items:**
1. Fix notification API base URL (remove `/api` prefix)
2. Ensure all endpoints follow correct URL patterns
3. Update any hardcoded URLs to use proper constants

## Phase 3: Medium Priority Fixes

### Step 3.1: Fix Response Type Mismatches
**Priority:** MEDIUM  
**Files to Modify:**
- `frontend/src/modules/post/types/post.types.ts`
- `frontend/src/modules/auth/types/auth.types.ts`

**Action Items:**

1. **Update Post Interface (post.types.ts):**
```typescript
// Change from:
interface Post {
  images: PostImage[];
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  sharesCount: number;
  isBookmarked: boolean;
  // ...
}

// To:
interface Post {
  imageUrl?: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  // Remove sharesCount and isBookmarked
  // ...
}
```

2. **Update LoginCredentials (auth.types.ts):**
```typescript
// Change from:
interface LoginCredentials {
  email: string;
  password: string;
}

// To:
interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}
```

3. **Update FeedResponse (post.types.ts):**
```typescript
// Change from:
interface FeedResponse {
  hasNext: boolean;
  currentPage: number;
}

// To:
interface FeedResponse {
  content: Post[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
```

### Step 3.2: Update Components Using Old Types
**Priority:** MEDIUM  
**Files to Update:**
- All components using Post interface
- All components using FeedResponse
- Auth components using LoginCredentials

**Action Items:**
1. Update PostCard component to use `post.imageUrl` instead of `post.images[0]`
2. Update like counts: `post.likeCount` instead of `post.likesCount`
3. Update comment counts: `post.commentCount` instead of `post.commentsCount`
4. Update like status: `post.isLikedByCurrentUser` instead of `post.isLiked`
5. Update login forms to use `usernameOrEmail` field
6. Update feed pagination to use `last` instead of `hasNext`

### Step 3.3: Fix Messaging API Structure
**Priority:** MEDIUM  
**File to Modify:** `frontend/src/modules/messaging/services/messageApi.ts`

**Action Items:**
1. **Update endpoint structure to match documentation:**
```typescript
// Change from conversation-based to user-based:
// OLD: `/messages/conversations/${conversationId}/messages`
// NEW: `/messages/conversation/${otherUserId}`

// OLD: `/messages/conversations`
// NEW: `/messages/conversations`

// Update sendMessage to use user-based structure
```

2. **Update message types to match documentation:**
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
```

### Step 3.4: Fix File Upload Structure
**Priority:** MEDIUM  
**Files to Create/Modify:**
- `frontend/src/shared/services/fileService.ts`
- Update postApi.ts createPost method

**Action Items:**
1. Create dedicated file service with endpoints:
   - `POST /api/files/upload`
   - `POST /api/files/upload/profile-image`
   - `POST /api/files/upload/post-image`
2. Update post creation to use file service
3. Standardize file upload across all modules

## Phase 4: Low Priority Fixes

### Step 4.1: Fix Error Handling Structure
**Priority:** LOW  
**File to Modify:** `frontend/src/shared/services/httpClient.ts`

**Action Items:**
1. **Update error handling to match backend structure:**
```typescript
interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  correlationId: string;
}

private handleError(error: any): ApiError {
  if (error.response) {
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      timestamp: error.response.data?.timestamp || new Date().toISOString(),
      path: error.response.data?.path || error.config?.url,
      error: error.response.data?.error || 'Unknown Error',
      correlationId: error.response.data?.correlationId,
    };
  }
  // ...
}
```

### Step 4.2: Create Integration Tests
**Priority:** LOW  
**Files to Create:**
- `frontend/src/tests/integration/apiIntegration.test.ts`
- `frontend/src/tests/integration/socialApi.test.ts`
- `frontend/src/tests/integration/authApi.test.ts`

**Action Items:**
1. Create API integration tests for all modules
2. Test endpoint URLs match documentation
3. Test response types match expected interfaces
4. Add tests to CI pipeline

## Implementation Sequence

### Week 1: Critical Issues
- **Day 1-2:** Steps 1.1-1.2 (Social API Services)
- **Day 3:** Step 1.3 (Redux Integration)
- **Day 4-5:** Testing and debugging Phase 1

### Week 2: High Priority
- **Day 1-3:** Step 2.1 (WebSocket Implementation)
- **Day 4:** Step 2.2 (URL Pattern Fixes)
- **Day 5:** Testing and debugging Phase 2

### Week 3: Medium Priority
- **Day 1-2:** Steps 3.1-3.2 (Type Fixes)
- **Day 3:** Step 3.3 (Messaging API)
- **Day 4:** Step 3.4 (File Upload)
- **Day 5:** Testing and debugging Phase 3

### Week 4: Low Priority & Polish
- **Day 1:** Step 4.1 (Error Handling)
- **Day 2-3:** Step 4.2 (Integration Tests)
- **Day 4-5:** Final testing and documentation

## Success Criteria

### Phase 1 Complete:
- [ ] All social API services implemented
- [ ] No missing API service errors
- [ ] Post like/unlike works correctly

### Phase 2 Complete:
- [ ] Real-time messaging functional
- [ ] Real-time notifications functional
- [ ] All endpoint URLs correct

### Phase 3 Complete:
- [ ] All type mismatches resolved
- [ ] Components use correct field names
- [ ] Messaging structure matches backend

### Phase 4 Complete:
- [ ] Error handling includes all fields
- [ ] Integration tests pass
- [ ] No API integration errors

## Notes for AI Agent

1. **Always check imports** when creating new files
2. **Update index.ts files** when adding new services
3. **Test each change** before moving to next step
4. **Use TypeScript strict mode** to catch type errors
5. **Follow existing code patterns** in the project
6. **Update Redux store** when adding new API services
7. **Handle loading states** in all async operations
8. **Add proper error handling** for all API calls

## Dependencies

- Phase 1 must complete before Phase 2
- Type fixes (Phase 3.1) should complete before component updates (Phase 3.2)
- WebSocket service (Phase 2.1) needed for real-time features
- All phases can have integration tests added in parallel

## Risk Mitigation

- **Backup current code** before major changes
- **Test in development environment** before production
- **Implement feature flags** for new functionality
- **Have rollback plan** for each phase
- **Monitor API calls** during implementation 