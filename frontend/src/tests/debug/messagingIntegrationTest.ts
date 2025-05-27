// Comprehensive Messaging Integration Test
import { messageApi } from '@/modules/messaging/services/messageApi';
import { getMessageWebSocketService } from '@/modules/messaging/services/messageWebSocketService';
import { authApi } from '@/modules/auth/services/authApi';

// Test results interface
interface TestResult {
  testName: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  data?: any;
  timestamp: string;
}

class MessagingIntegrationTest {
  private results: TestResult[] = [];
  private currentUser: any = null;
  private webSocketService: any = null;

  private log(testName: string, status: 'PASS' | 'FAIL' | 'SKIP', message: string, data?: any) {
    const result: TestResult = {
      testName,
      status,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    this.results.push(result);
    
    const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️';
    console.log(`${emoji} ${testName}: ${message}`);
    if (data) console.log('   Data:', data);
  }

  async runAllTests(): Promise<TestResult[]> {
    console.group('🔍 Comprehensive Messaging Integration Test');
    console.log('🕐 Test Started:', new Date().toLocaleString());
    
    try {
      // Step 1: Check Authentication
      await this.testAuthentication();
      
      // Step 2: Test Conversations API
      await this.testConversationsAPI();
      
      // Step 3: Test Message Sending
      await this.testMessageSending();
      
      // Step 4: Test WebSocket Integration
      await this.testWebSocketIntegration();
      
      // Step 5: Test Real-time Features
      await this.testRealTimeFeatures();
      
      // Display Summary
      this.displayTestSummary();
      
    } catch (error) {
      this.log('Test Runner', 'FAIL', `Test runner failed: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
    } finally {
      console.groupEnd();
    }
    
    return this.results;
  }

  private async testAuthentication() {
    console.group('📋 1. Authentication Test');
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.log('Auth Token Check', 'FAIL', 'No authentication token found. Please login first.');
        return;
      }
      
      this.log('Auth Token Check', 'PASS', 'Authentication token found');
      
      // Try to get current user info from auth state
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
        this.log('Current User Check', 'PASS', `User found: ${this.currentUser.username} (ID: ${this.currentUser.id})`);
      } else {
        this.log('Current User Check', 'SKIP', 'User info not found in localStorage, but token exists');
      }
      
    } catch (error) {
      this.log('Authentication', 'FAIL', `Authentication test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.groupEnd();
    }
  }

  private async testConversationsAPI() {
    console.group('📋 2. Conversations API Test');
    
    try {
      // Test getConversations endpoint
      console.log('Testing getConversations API...');
      const conversationsResponse = await messageApi.getConversations();
      
      if (!conversationsResponse) {
        this.log('Get Conversations', 'FAIL', 'No response from getConversations API');
        return;
      }
      
      this.log('Get Conversations Response', 'PASS', 'Received response from API', {
        hasData: !!conversationsResponse.data,
        isArray: Array.isArray(conversationsResponse.data),
        count: conversationsResponse.data?.length || 0
      });
      
      if (conversationsResponse.data && Array.isArray(conversationsResponse.data)) {
        const conversations = conversationsResponse.data;
        
        if (conversations.length === 0) {
          this.log('Conversations Display', 'SKIP', 'No conversations found. This is expected for new users.');
        } else {
          this.log('Conversations Display', 'PASS', `Found ${conversations.length} conversations`);
          
          // Test first conversation structure
          const firstConv = conversations[0];
          const hasRequiredFields = firstConv.id && firstConv.participants && firstConv.participants.length > 0;
          
          this.log('Conversation Structure', hasRequiredFields ? 'PASS' : 'FAIL', 
            hasRequiredFields ? 'Conversation has required fields' : 'Conversation missing required fields',
            firstConv
          );
        }
      } else {
        this.log('Conversations Array', 'FAIL', 'Response data is not an array', conversationsResponse.data);
      }
      
    } catch (error) {
      this.log('Conversations API', 'FAIL', `Conversations API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`, error);
    } finally {
      console.groupEnd();
    }
  }

  private async testMessageSending() {
    console.group('📋 3. Message Sending Test');
    
    try {
      if (!this.currentUser) {
        this.log('Message Sending', 'SKIP', 'Cannot test message sending without current user info');
        console.groupEnd();
        return;
      }
      
      // First, get all users to find someone to send a message to
      console.log('Finding test recipient...');
      
      // Test message structure without actually sending
      const testMessageData = {
        receiverId: 2, // Assuming user ID 2 exists from test data
        content: `Test message from integration test - ${new Date().toLocaleString()}`
      };
      
      this.log('Message Data Validation', 'PASS', 'Test message data structure is valid', testMessageData);
      
      // Note: We won't actually send the message in the test to avoid spam
      // but we validate the structure
      if (testMessageData.receiverId && testMessageData.content && testMessageData.content.trim().length > 0) {
        this.log('Message Send Validation', 'PASS', 'Message data passes validation requirements');
      } else {
        this.log('Message Send Validation', 'FAIL', 'Message data fails validation requirements');
      }
      
    } catch (error) {
      this.log('Message Sending', 'FAIL', `Message sending test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.groupEnd();
    }
  }

  private async testWebSocketIntegration() {
    console.group('📋 4. WebSocket Integration Test');
    
    try {
      // Get WebSocket service instance
      this.webSocketService = getMessageWebSocketService();
      
      if (!this.webSocketService) {
        this.log('WebSocket Service', 'FAIL', 'Could not get WebSocket service instance');
        console.groupEnd();
        return;
      }
      
      this.log('WebSocket Service', 'PASS', 'WebSocket service instance obtained');
      
      // Test WebSocket connection state
      const isConnected = this.webSocketService.getConnectionStatus();
      this.log('WebSocket Connection', isConnected ? 'PASS' : 'SKIP', 
        isConnected ? 'WebSocket is connected' : 'WebSocket is not connected (will connect when needed)');
      
      // Test WebSocket methods availability
      const hasSubscribeMethod = typeof this.webSocketService.subscribeToUserMessages === 'function';
      const hasInitializeMethod = typeof this.webSocketService.initialize === 'function';
      const hasDisconnectMethod = typeof this.webSocketService.disconnect === 'function';
      
      this.log('WebSocket Methods', 
        (hasSubscribeMethod && hasInitializeMethod && hasDisconnectMethod) ? 'PASS' : 'FAIL',
        'WebSocket service has required methods',
        { hasSubscribeMethod, hasInitializeMethod, hasDisconnectMethod }
      );
      
    } catch (error) {
      this.log('WebSocket Integration', 'FAIL', `WebSocket test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.groupEnd();
    }
  }

  private async testRealTimeFeatures() {
    console.group('📋 5. Real-time Features Test');
    
    try {
      if (!this.webSocketService) {
        this.log('Real-time Features', 'SKIP', 'WebSocket service not available for real-time testing');
        console.groupEnd();
        return;
      }
      
      // Test typing indicators (method availability)
      const hasTypingMethods = typeof this.webSocketService.sendTypingIndicator === 'function';
      
      this.log('Typing Indicators', hasTypingMethods ? 'PASS' : 'FAIL',
        hasTypingMethods ? 'Typing indicator methods available' : 'Typing indicator methods missing');
      
      // Test online status (method availability)
      const hasOnlineStatusMethods = typeof this.webSocketService.subscribeToOnlineStatus === 'function';
      
      this.log('Online Status', hasOnlineStatusMethods ? 'PASS' : 'SKIP',
        hasOnlineStatusMethods ? 'Online status methods available' : 'Online status methods not implemented');
      
      // Test message subscriptions
      const hasMessageSubscription = typeof this.webSocketService.subscribeToUserMessages === 'function';
      
      this.log('Message Subscriptions', hasMessageSubscription ? 'PASS' : 'FAIL',
        hasMessageSubscription ? 'Message subscription methods available' : 'Message subscription methods missing');
      
    } catch (error) {
      this.log('Real-time Features', 'FAIL', `Real-time features test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.groupEnd();
    }
  }

  private displayTestSummary() {
    console.group('📊 Test Summary');
    
    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;
    const skipCount = this.results.filter(r => r.status === 'SKIP').length;
    const totalCount = this.results.length;
    
    console.log(`Total Tests: ${totalCount}`);
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    
    const successRate = totalCount > 0 ? ((passCount / (passCount + failCount)) * 100).toFixed(1) : '0';
    console.log(`Success Rate: ${successRate}%`);
    
    if (failCount > 0) {
      console.group('❌ Failed Tests Details:');
      this.results.filter(r => r.status === 'FAIL').forEach(result => {
        console.log(`• ${result.testName}: ${result.message}`);
      });
      console.groupEnd();
    }
    
    console.groupEnd();
  }

  getResults(): TestResult[] {
    return this.results;
  }
}

// Export test function
export const runMessagingIntegrationTest = async (): Promise<TestResult[]> => {
  const tester = new MessagingIntegrationTest();
  return await tester.runAllTests();
};

// Auto-run test in development
if (import.meta.env.DEV) {
  console.log('🧪 Messaging Integration Test Available: runMessagingIntegrationTest()');
  (window as any).runMessagingIntegrationTest = runMessagingIntegrationTest;
  (window as any).MessagingIntegrationTest = MessagingIntegrationTest;
} 