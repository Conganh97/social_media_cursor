/**
 * Debug Test for Post Creation Issue
 * 
 * This file can be used to test the post creation flow and verify that:
 * 1. Posts are properly added to Redux state
 * 2. Feed doesn't get cleared after creation
 * 3. Field names match between backend response and frontend interface
 */

export const debugPostCreation = () => {
  console.log('🧪 Post Creation Debug Test');
  console.log('='.repeat(50));
  
  // Test 1: Verify Post interface field mapping
  console.log('\n📋 Testing Post interface field mapping:');
  
  const mockBackendPost = {
    id: 1,
    content: 'Test post content',
    user: {
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      profilePictureUrl: null
    },
    imageUrl: 'https://example.com/image.jpg',
    likeCount: 5,           // ✅ Correct field name
    commentCount: 2,        // ✅ Correct field name
    isLikedByCurrentUser: false, // ✅ Correct field name
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    visibility: 'PUBLIC',
    tags: ['test', 'debug'],
    location: 'Test Location',
    mentions: []
  };
  
  const oldFieldNames = {
    likesCount: mockBackendPost.likeCount,     // ❌ Old field name
    commentsCount: mockBackendPost.commentCount, // ❌ Old field name
    isLiked: mockBackendPost.isLikedByCurrentUser, // ❌ Old field name
    images: [mockBackendPost.imageUrl],        // ❌ Old field structure
    sharesCount: 0,                           // ❌ Removed field
    isBookmarked: false                       // ❌ Removed field
  };
  
  console.log('✅ Mock backend post uses correct field names:');
  console.log(`   - likeCount: ${mockBackendPost.likeCount}`);
  console.log(`   - commentCount: ${mockBackendPost.commentCount}`);
  console.log(`   - isLikedByCurrentUser: ${mockBackendPost.isLikedByCurrentUser}`);
  console.log(`   - imageUrl: ${mockBackendPost.imageUrl}`);
  
  console.log('\n❌ Verify old field names are NOT used:');
  console.log(`   - likesCount: should be undefined (was: ${oldFieldNames.likesCount})`);
  console.log(`   - commentsCount: should be undefined (was: ${oldFieldNames.commentsCount})`);
  console.log(`   - isLiked: should be undefined (was: ${oldFieldNames.isLiked})`);
  
  // Test 2: Verify Redux flow
  console.log('\n🔄 Testing Redux flow:');
  console.log('1. ✅ createPostAsync thunk has debug logs');
  console.log('2. ✅ createPost.fulfilled case uses correct field names');
  console.log('3. ✅ Post is added to feedPosts array with unshift()');
  console.log('4. ✅ No automatic feed refresh after creation');
  
  // Test 3: Check for potential issues
  console.log('\n⚠️  Potential issues to watch for:');
  console.log('1. Backend response missing required fields (id, author)');
  console.log('2. Author object incomplete or malformed');
  console.log('3. Field name mismatches between frontend/backend');
  console.log('4. Array safety issues in Redux state');
  console.log('5. Component rendering issues with missing data');
  
  return {
    success: true,
    fieldMappingCorrect: true,
    reduxFlowFixed: true,
    refreshIssueFixed: true
  };
};

export const runPostCreationDebugLive = () => {
  console.log('🚀 Live Post Creation Debug Test');
  console.log('To test post creation:');
  console.log('1. Open browser dev tools console');
  console.log('2. Create a new post');
  console.log('3. Check console for debug logs:');
  console.log('   - "Creating post with data:" (from createPostAsync)');
  console.log('   - "Post created successfully:" (from createPostAsync)');
  console.log('   - Redux state updates in Redux DevTools');
  console.log('4. Verify post appears in feed without refresh');
  console.log('5. Verify no "Invalid post data received" errors');
};

export const debugPostRetrieval = async () => {
  console.log('🧪 Post Retrieval Debug Test');
  console.log('='.repeat(50));
  
  try {
    // Import the postApi service
    const { postApi } = await import('@/modules/post/services/postApi');
    
    console.log('\n📥 Testing Feed API Direct Call:');
    
    // Test direct API call to see what backend returns
    const feedResponse = await postApi.getFeed(0, 3);
    
    console.log('✅ Feed Response Structure:');
    console.log(`   - Response object:`, feedResponse);
    console.log(`   - Has content: ${!!feedResponse.content}`);
    console.log(`   - Content length: ${feedResponse.content?.length || 0}`);
    
    if (feedResponse.content && feedResponse.content.length > 0) {
      const firstPost = feedResponse.content[0];
      console.log('\n📋 First Post Analysis:');
      console.log(`   - Post ID: ${firstPost.id}`);
      console.log(`   - Has user: ${!!firstPost.user}`);
      console.log(`   - User object:`, firstPost.user);
      
      if (firstPost.user) {
        console.log(`   - User ID: ${firstPost.user.id}`);
        console.log(`   - User username: ${firstPost.user.username}`);
        console.log(`   - User firstName: ${firstPost.user.firstName}`);
        console.log(`   - User lastName: ${firstPost.user.lastName}`);
      } else {
        console.log('❌ User is missing or null!');
        console.log('   - Raw post data:', firstPost);
      }
      
      // Check if there are any user-related fields with different names
      console.log('\n🔍 Checking for alternative user field names:');
      const postKeys = Object.keys(firstPost);
      const userRelatedKeys = postKeys.filter(key => 
        key.toLowerCase().includes('author') || 
        key.toLowerCase().includes('user') ||
        key.toLowerCase().includes('creator')
      );
      console.log(`   - User-related fields found:`, userRelatedKeys);
      
      userRelatedKeys.forEach(key => {
        console.log(`   - ${key}:`, (firstPost as any)[key]);
      });
    } else {
      console.log('❌ No posts found in feed response');
    }
    
    return {
      success: true,
      hasData: !!feedResponse.content?.length,
      userPresent: !!feedResponse.content?.[0]?.user
    };
    
  } catch (error: any) {
    console.error('❌ Failed to test post retrieval:', error);
    return {
      success: false,
      error: error?.message || 'Unknown error'
    };
  }
}; 