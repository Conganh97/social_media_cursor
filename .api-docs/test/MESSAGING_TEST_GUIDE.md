# Messaging Page Testing Guide

## Overview
This guide provides comprehensive testing instructions for the messaging page functionality, including conversations display, WebSocket integration, and message sending features.

## Prerequisites
1. **Backend running**: Ensure Spring Boot backend is running on port 8080
2. **Frontend running**: Ensure React frontend is running on port 3000 or 5173
3. **User logged in**: You must be logged in to test messaging features

## Quick Start Testing

### 1. Open Browser Console
1. Navigate to `http://localhost:3000` (or your frontend URL)
2. Login with test credentials
3. Go to Messages page
4. Open browser developer tools (F12)
5. Go to Console tab

### 2. Run Automated Tests
Execute these commands in the browser console:

```javascript
// Run all messaging tests
runAllMessagingTests()

// Test individual components
testMessagingPageComponents()

// Test WebSocket connectivity
testWebSocketConnectivity()

// Run just the integration test
runMessagingIntegrationTest()

// Run basic API test
testMessagingAPI()
```

## Manual Testing Steps

### Test 1: Conversations Display
1. **Navigate to Messages Page**
   - Click on Messages in navigation
   - Verify page loads without errors

2. **Check Conversations List**
   - Look for conversation list on the left side
   - Verify conversations display with user names
   - Check for last message preview
   - Look for timestamps

3. **Expected Results**
   - ✅ Conversations list displays properly
   - ✅ User names and avatars show
   - ✅ Last messages preview correctly
   - ✅ Timestamps are formatted properly

### Test 2: Message Sending
1. **Select a Conversation**
   - Click on a conversation from the list
   - Verify message history loads

2. **Send a Message**
   - Type in the message input field
   - Press Enter or click Send button
   - Verify message appears in conversation

3. **Expected Results**
   - ✅ Message input field is functional
   - ✅ Messages send successfully
   - ✅ New messages appear in conversation
   - ✅ Message timestamps are correct

### Test 3: WebSocket Integration
1. **Real-time Message Delivery**
   - Have another user send you a message
   - Verify it appears without page refresh

2. **Typing Indicators**
   - Type in a conversation
   - Check if typing indicator shows for other users

3. **Expected Results**
   - ✅ Messages appear in real-time
   - ✅ Typing indicators work
   - ✅ WebSocket connection is stable

## Automated Test Details

### Integration Test Coverage
The automated tests cover:

1. **Authentication Check**
   - Verifies user is logged in
   - Checks for valid authentication token

2. **Conversations API Test**
   - Tests `getConversations()` endpoint
   - Validates response structure
   - Checks array format and data integrity

3. **Message Sending Test**
   - Validates message data structure
   - Tests send message functionality
   - Verifies validation requirements

4. **WebSocket Integration Test**
   - Tests WebSocket service initialization
   - Checks connection status
   - Validates required methods

5. **Real-time Features Test**
   - Tests typing indicators
   - Tests online status updates
   - Tests message subscriptions

### Test Output Interpretation

#### ✅ PASS Results
- Feature is working correctly
- No issues detected
- Ready for production

#### ❌ FAIL Results
- Feature has issues that need fixing
- Check console for detailed error messages
- May require code fixes

#### ⏭️ SKIP Results
- Feature was not tested due to prerequisites
- Often due to missing data or setup
- Not necessarily an error

## Common Issues and Solutions

### Issue: "No conversations found"
**Solution**: This is expected for new users. Create test conversations or use existing test data.

### Issue: "WebSocket not connected"
**Solution**: 
1. Check if backend is running
2. Verify WebSocket endpoints are accessible
3. Check for CORS issues

### Issue: "Authentication required"
**Solution**:
1. Login to the application first
2. Check if authentication token is valid
3. Refresh the page and try again

### Issue: "Message not sending"
**Solution**:
1. Check network connectivity
2. Verify backend API is responding
3. Check browser console for errors

## Test Data

### Test Users (from backend initialization)
- User 1: `john_doe` / `john@example.com`
- User 2: `jane_smith` / `jane@example.com`
- User 3: `bob_wilson` / `bob@example.com`
- User 4: `alice_brown` / `alice@example.com`
- User 5: `charlie_davis` / `charlie@example.com`

### Test Conversations
The backend includes pre-created conversations between test users for immediate testing.

## Troubleshooting

### Backend Issues
```bash
# Check if backend is running
netstat -an | findstr "8080"

# Restart backend if needed
cd backend
mvn spring-boot:run
```

### Frontend Issues
```bash
# Check if frontend is running
netstat -an | findstr "3000"

# Restart frontend if needed
cd frontend
npm run dev
```

### Database Issues
- Check if H2 database is accessible
- Verify test data is loaded
- Check backend logs for database errors

## API Endpoints Being Tested

### Message API
- `GET /api/messages/conversations` - Get user conversations
- `POST /api/messages` - Send a message
- `GET /api/messages/conversation/{userId}` - Get messages with specific user

### WebSocket Endpoints
- `/topic/user/{userId}/messages` - Real-time messages
- `/topic/user/{userId}/typing` - Typing indicators
- `/topic/online-status` - Online status updates

## Success Criteria

### Minimum Requirements ✅
- [ ] Conversations display correctly
- [ ] Messages can be sent and received
- [ ] Basic WebSocket connection works

### Full Feature Set ✅
- [ ] Real-time message delivery
- [ ] Typing indicators functional
- [ ] Online status updates
- [ ] Message read status
- [ ] Proper error handling

## Next Steps After Testing

1. **If tests pass**: The messaging functionality is ready for production
2. **If tests fail**: Review console errors and fix identified issues
3. **Performance optimization**: Consider implementing message pagination and caching
4. **UI enhancements**: Add file attachments, emoji support, message reactions

## Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Review the step-flow.md file for recent changes
3. Check the backend logs for API errors
4. Verify all services are running on correct ports 