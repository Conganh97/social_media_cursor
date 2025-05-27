# Test Data Documentation

## Overview

This document describes the comprehensive test data created for the Social Media Application. The test data includes realistic user profiles, posts, comments, likes, friendships, messages, and notifications with proper relationships across all entities.

## Data Initialization

### Automatic Initialization (DataInitializer.java)

The application automatically creates test data on startup when the database is empty:

```java
@Component
public class DataInitializer implements ApplicationRunner
```

**Location:** `backend/src/main/java/com/socialmedia/config/DataInitializer.java`

### Manual Initialization (test-data.sql)

Additional test data can be loaded manually using the SQL file:

**Location:** `backend/src/main/resources/test-data.sql`

## Test Data Structure

### 👥 Users (5 Core + 5 Additional)

#### Core Users (DataInitializer.java)
| Username | Email | Role | Bio |
|----------|--------|------|-----|
| `anhbc` | anhbc@example.com | Software Engineering Manager | Full-stack developer specializing in React and Spring Boot |
| `hungbv` | hungbv@example.com | Frontend Developer | React, TypeScript enthusiast |
| `khoinq` | khoinq@example.com | Backend Developer | Java Spring Boot expert |
| `linhnt` | linhnt@example.com | UI/UX Designer | Material Design advocate |
| `ducph` | ducph@example.com | DevOps Engineer | Docker & Kubernetes expert |

#### Additional Users (test-data.sql)
| Username | Email | Role | Bio |
|----------|--------|------|-----|
| `sarah_m` | sarah.m@example.com | Product Manager | Agile enthusiast |
| `alex_k` | alex.k@example.com | Data Scientist | Machine Learning engineer |
| `maria_r` | maria.r@example.com | QA Engineer | Automation testing specialist |
| `john_d` | john.d@example.com | Security Engineer | Cybersecurity expert |
| `emma_w` | emma.w@example.com | Mobile Developer | Flutter & React Native |

### 📝 Posts (8 Core + 8 Additional)

#### Sample Core Posts
- Spring Boot implementation achievements
- React TypeScript development insights  
- Database optimization successes
- Material UI design experiences
- Docker deployment accomplishments
- Team collaboration highlights
- Redux state management patterns
- JWT authentication implementations

#### Additional Posts
- Product roadmap planning
- Machine learning model deployments
- Quality assurance achievements
- Security architecture implementations
- Mobile app performance optimizations

### 💬 Comments (8 Core + 8 Additional)

All comments are contextually relevant to their posts, showing:
- Technical discussions
- Implementation questions
- Professional feedback
- Knowledge sharing

### 👍 Likes

Strategic like distribution across all posts showing:
- Cross-user engagement patterns
- Realistic interaction volumes
- Proper user-post relationships

### 🤝 Friendships

Complete social graph with various statuses:
- **ACCEPTED:** Active friendships
- **PENDING:** Outgoing requests  
- **DECLINED:** Rejected requests
- **BLOCKED:** Blocked relationships

### 💌 Messages

Realistic conversation threads between users:
- Project coordination
- Technical discussions
- Meeting scheduling
- Progress updates
- Read/unread status variations

### 🔔 Notifications

All notification types covered:
- **LIKE:** Post appreciation alerts
- **COMMENT:** Comment notifications
- **FRIEND_REQUEST:** Friend request alerts
- **FRIEND_ACCEPTED:** Acceptance confirmations
- **MESSAGE:** New message alerts
- **POST_MENTION:** Tag notifications
- **COMMENT_MENTION:** Comment mentions

## Entity Relationships

### User Relationships
```
User (1) → (*) Posts
User (1) → (*) Comments  
User (1) → (*) Likes
User (1) → (*) Messages (as sender)
User (1) → (*) Messages (as receiver)
User (1) → (*) Notifications
User (1) → (*) Friendships (as requester)
User (1) → (*) Friendships (as addressee)
```

### Post Relationships
```
Post (1) → (*) Comments
Post (1) → (*) Likes
Post (1) → (*) Notifications (related_id)
```

### Cross-Module Integration
```
Comment → Post → User
Like → Post → User  
Message → User (sender) → User (receiver)
Notification → User + related entities
Friendship → User (requester) → User (addressee)
```

## Testing Scenarios

### Authentication Testing
```java
// Test users with known passwords
Username: "anhbc" | Password: "Anhbc123@"
Username: "hungbv" | Password: "hungbv123"
Username: "khoinq" | Password: "khoinq123"
// ... etc
```

### Social Features Testing
- **Friend Requests:** Test PENDING friendships
- **Messaging:** Test read/unread message scenarios  
- **Notifications:** Test all notification types
- **Post Interactions:** Test likes and comments
- **User Profiles:** Test complete user information

### Real-time Features Testing
- **WebSocket Messaging:** Active conversations available
- **Live Notifications:** Unread notifications present
- **Online Status:** Multiple users for testing

## Data Access Examples

### Getting User Feed
```sql
-- Posts from user and their friends
SELECT p.* FROM posts p 
JOIN users u ON p.user_id = u.id 
WHERE u.id IN (SELECT friend_ids FROM friendships WHERE status = 'ACCEPTED')
ORDER BY p.created_at DESC;
```

### Getting Conversation
```sql
-- Messages between two users
SELECT m.* FROM messages m 
WHERE (m.sender_id = 1 AND m.receiver_id = 2) 
   OR (m.sender_id = 2 AND m.receiver_id = 1)
ORDER BY m.created_at ASC;
```

### Getting User Notifications
```sql
-- Unread notifications for user
SELECT n.* FROM notifications n 
WHERE n.user_id = 1 AND n.read_status = false
ORDER BY n.created_at DESC;
```

## Development Usage

### Backend API Testing
1. Start the application
2. Data loads automatically via `DataInitializer`
3. Use test user credentials for authentication
4. Test all endpoints with related data

### Frontend Integration Testing
1. Login with test users
2. View populated feeds and conversations
3. Test social interactions (likes, comments, messages)
4. Verify real-time features

### Database Inspection
```sql
-- Check data counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'posts', COUNT(*) FROM posts  
UNION ALL
SELECT 'comments', COUNT(*) FROM comments
UNION ALL
SELECT 'likes', COUNT(*) FROM likes
UNION ALL
SELECT 'friendships', COUNT(*) FROM friendships
UNION ALL  
SELECT 'messages', COUNT(*) FROM messages
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications;
```

## Data Reset

To reset and regenerate test data:

1. **Clear Database:**
   ```sql
   TRUNCATE TABLE notifications, messages, friendships, likes, comments, posts, users RESTART IDENTITY CASCADE;
   ```

2. **Restart Application:** DataInitializer will recreate core data

3. **Load Additional Data (Optional):**
   ```sql
   \i backend/src/main/resources/test-data.sql
   ```

## Best Practices

1. **Keep Test Data Realistic:** All content reflects real-world usage
2. **Maintain Relationships:** Ensure foreign key integrity
3. **Update Regularly:** Keep test scenarios current with features
4. **Document Changes:** Update this README when modifying test data
5. **Separate Concerns:** Keep additional data in SQL files, core data in Java

## Troubleshooting

### Data Not Loading
- Check database connection
- Verify DataInitializer @Component annotation
- Check application logs for errors

### Relationship Errors
- Ensure proper foreign key constraints
- Check entity relationship mappings
- Verify transaction boundaries

### Performance Issues
- Consider pagination for large datasets
- Optimize queries with proper indexing
- Use lazy loading for collections

## Summary

This comprehensive test data provides:
- ✅ **Complete Entity Coverage:** All 7 entities with proper relationships
- ✅ **Realistic Scenarios:** Professional developer personas and content  
- ✅ **Testing Flexibility:** Both automatic and manual data loading
- ✅ **Production Readiness:** Clean, maintainable data initialization
- ✅ **Documentation:** Complete usage and troubleshooting guides 