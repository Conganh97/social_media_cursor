// Test Runner for Messaging Page Functionality
import { runMessagingIntegrationTest } from './messagingIntegrationTest';
import { testMessagingAPI } from './messageTest';

// Test runner function
export const runAllMessagingTests = async () => {
  console.clear();
  console.log('🚀 Starting Comprehensive Messaging Tests');
  console.log('═'.repeat(50));
  
  try {
    // Run basic message API test first
    console.log('\n📋 Running Basic Message API Test...');
    const basicTestResult = await testMessagingAPI();
    
    // Wait a moment to avoid API rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Run comprehensive integration test
    console.log('\n📋 Running Comprehensive Integration Test...');
    const integrationResults = await runMessagingIntegrationTest();
    
    // Summary
    console.log('\n═'.repeat(50));
    console.log('🎯 ALL TESTS COMPLETED');
    console.log('═'.repeat(50));
    
    return {
      basicTest: basicTestResult,
      integrationTest: integrationResults
    };
    
  } catch (error) {
    console.error('❌ Test Runner Error:', error);
    throw error;
  }
};

// Test specific messaging page components
export const testMessagingPageComponents = () => {
  console.group('🔍 Testing Messaging Page Components');
  
  // Check if messaging page components are available in DOM
  const messagingPage = document.querySelector('[data-testid="messaging-page"]') || 
                       document.querySelector('.messaging-page') ||
                       document.querySelector('#messaging-page');
  
  const conversationList = document.querySelector('[data-testid="conversation-list"]') || 
                          document.querySelector('.conversation-list');
  
  const messageInput = document.querySelector('[data-testid="message-input"]') || 
                      document.querySelector('input[type="text"]') ||
                      document.querySelector('textarea');
  
  console.log('Component Availability:');
  console.log('✅ Messaging Page:', !!messagingPage);
  console.log('✅ Conversation List:', !!conversationList);
  console.log('✅ Message Input:', !!messageInput);
  
  if (messagingPage) {
    console.log('Messaging Page Element:', messagingPage);
  }
  
  console.groupEnd();
  
  return {
    messagingPage: !!messagingPage,
    conversationList: !!conversationList,
    messageInput: !!messageInput
  };
};

// Test WebSocket connectivity
export const testWebSocketConnectivity = async () => {
  console.group('🔌 Testing WebSocket Connectivity');
  
  try {
    const wsService = (await import('@/modules/messaging/services/messageWebSocketService')).getMessageWebSocketService();
    
    if (!wsService) {
      console.log('❌ WebSocket service not available');
      return { success: false, error: 'Service not available' };
    }
    
    // Try to connect
    console.log('🔄 Attempting WebSocket connection...');
    
    // Check if already connected
    const isConnected = wsService.getConnectionStatus();
    console.log('Connection Status:', isConnected ? '✅ Connected' : '⏳ Not connected');
    
    if (!isConnected && typeof wsService.initialize === 'function') {
      try {
        await wsService.initialize();
        console.log('✅ WebSocket connection established');
      } catch (error) {
        console.log('❌ WebSocket connection failed:', error);
      }
    }
    
    return { success: true, isConnected };
    
  } catch (error) {
    console.log('❌ WebSocket test error:', error);
    return { success: false, error };
  } finally {
    console.groupEnd();
  }
};

// Auto-export for browser console
if (import.meta.env.DEV) {
  console.log('🧪 Messaging Test Suite Available:');
  console.log('• runAllMessagingTests() - Run all tests');
  console.log('• testMessagingPageComponents() - Test UI components');
  console.log('• testWebSocketConnectivity() - Test WebSocket connection');
  
  (window as any).runAllMessagingTests = runAllMessagingTests;
  (window as any).testMessagingPageComponents = testMessagingPageComponents;
  (window as any).testWebSocketConnectivity = testWebSocketConnectivity;
} 