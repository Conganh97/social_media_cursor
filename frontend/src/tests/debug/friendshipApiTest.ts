// Debug test for friendship API route fixes
import { friendshipApi } from '@/modules/social/services/friendshipApi';

export const testFriendshipAPIRoutes = async () => {
  console.group('🔍 Friendship API Routes Test');
  
  try {
    console.log('Testing friendship API endpoints...');
    
    // Test routes (these will make actual API calls)
    const endpoints = [
      { name: 'Get Friends', call: () => friendshipApi.getFriends(0, 5) },
      { name: 'Get Pending Requests', call: () => friendshipApi.getPendingRequests(0, 5) },
      { name: 'Get Sent Requests', call: () => friendshipApi.getSentRequests(0, 5) },
      { name: 'Get Friend Count', call: () => friendshipApi.getFriendCount() },
    ];
    
    const results: { [key: string]: any } = {};
    
    for (const endpoint of endpoints) {
      try {
        console.log(`📞 Testing ${endpoint.name}...`);
        const result = await endpoint.call();
        results[endpoint.name] = { success: true, data: result };
        console.log(`✅ ${endpoint.name}: Success`, result);
      } catch (error) {
        results[endpoint.name] = { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
        console.log(`❌ ${endpoint.name}: Failed`, error);
      }
    }
    
    // Check for the specific "sent" route error
    const sentRequestsResult = results['Get Sent Requests'];
    if (sentRequestsResult.success) {
      console.log('🎉 Sent Requests route is now working! No more "sent" conversion error.');
    } else if (sentRequestsResult.error?.includes('sent')) {
      console.warn('⚠️ Still getting "sent" route error:', sentRequestsResult.error);
    }
    
    return {
      success: true,
      results,
      summary: {
        working: Object.values(results).filter((r: any) => r.success).length,
        failing: Object.values(results).filter((r: any) => !r.success).length,
      }
    };
    
  } catch (error) {
    console.error('❌ Friendship API Test Failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    console.groupEnd();
  }
};

// Auto-run test in development
if (import.meta.env.DEV) {
  console.log('🧪 Friendship API Test Available: testFriendshipAPIRoutes()');
  (window as any).testFriendshipAPIRoutes = testFriendshipAPIRoutes;
} 