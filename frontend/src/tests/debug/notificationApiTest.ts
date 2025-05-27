// Debug test for notification API route fixes
import { notificationApi } from '@/modules/notification/services/notificationApi';

export const testNotificationAPIRoutes = async () => {
  console.group('🔍 Notification API Routes Test');
  
  try {
    console.log('Testing notification API endpoints...');
    
    // Test routes (these will make actual API calls)
    const endpoints = [
      { name: 'Get Notifications', call: () => notificationApi.getNotifications() },
      { name: 'Get Unread Count', call: () => notificationApi.getUnreadCount() },
      { name: 'Get Summary', call: () => notificationApi.getSummary() },
      { name: 'Get Settings', call: () => notificationApi.getSettings() },
      { name: 'Get Notifications by Type', call: () => notificationApi.getNotificationsByType('LIKE') },
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
    
    // Check for specific route fixes
    const unreadCountResult = results['Get Unread Count'];
    if (unreadCountResult.success && typeof unreadCountResult.data === 'object' && 'unreadCount' in unreadCountResult.data) {
      console.log('🎉 Unread Count route is now using correct backend endpoint and response format!');
    } else if (unreadCountResult.error?.includes('unread-count')) {
      console.warn('⚠️ Still getting old route error:', unreadCountResult.error);
    }
    
    const notificationsByTypeResult = results['Get Notifications by Type'];
    if (notificationsByTypeResult.success) {
      console.log('🎉 Get Notifications by Type route is now working with path parameter format!');
    } else if (notificationsByTypeResult.error?.includes('type')) {
      console.warn('⚠️ Still getting type route error:', notificationsByTypeResult.error);
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
    console.error('❌ Notification API Test Failed:', error);
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
  console.log('🧪 Notification API Test Available: testNotificationAPIRoutes()');
  (window as any).testNotificationAPIRoutes = testNotificationAPIRoutes;
} 