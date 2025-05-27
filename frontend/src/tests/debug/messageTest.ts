// Debug test for messaging API
import { messageApi } from '@/modules/messaging/services/messageApi';

// Track API call frequency
let callCount = 0;
let lastCallTime = 0;
const callTimes: number[] = [];

const originalGetConversations = messageApi.getConversations;
messageApi.getConversations = async (...args) => {
  const now = Date.now();
  callCount++;
  callTimes.push(now);
  
  // Check for potential infinite loop (more than 5 calls in 10 seconds)
  const recentCalls = callTimes.filter(time => now - time < 10000);
  if (recentCalls.length > 5) {
    console.warn('🚨 POTENTIAL INFINITE LOOP DETECTED! Too many API calls:', {
      callsInLast10Seconds: recentCalls.length,
      totalCalls: callCount,
      timeBetweenLastCalls: now - lastCallTime
    });
  }
  
  lastCallTime = now;
  console.log(`📞 API Call #${callCount} to getConversations at ${new Date().toLocaleTimeString()}`);
  
  return originalGetConversations.apply(messageApi, args);
};

export const testMessagingAPI = async () => {
  console.group('🔍 Messaging API Debug Test');
  
  try {
    console.log('Testing conversations endpoint...');
    
    // Test conversations fetch
    const conversationsResult = await messageApi.getConversations();
    console.log('Conversations API Response:', conversationsResult);
    console.log('Is conversations.data an array?', Array.isArray(conversationsResult.data));
    console.log('Conversations length:', conversationsResult.data?.length || 0);
    
    if (conversationsResult.data && conversationsResult.data.length > 0) {
      console.log('First conversation structure:', conversationsResult.data[0]);
    }
    
    return {
      success: true,
      conversationsData: conversationsResult.data,
      isArray: Array.isArray(conversationsResult.data),
      length: conversationsResult.data?.length || 0,
      apiCallCount: callCount
    };
    
  } catch (error) {
    console.error('❌ Messaging API Test Failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      conversationsData: null,
      isArray: false,
      length: 0,
      apiCallCount: callCount
    };
  } finally {
    console.groupEnd();
  }
};

export const getAPICallStats = () => {
  const now = Date.now();
  const recentCalls = callTimes.filter(time => now - time < 60000); // Last minute
  
  return {
    totalCalls: callCount,
    callsInLastMinute: recentCalls.length,
    lastCallTime: lastCallTime ? new Date(lastCallTime).toLocaleTimeString() : 'Never',
    averageTimeBetweenCalls: callTimes.length > 1 ? 
      (callTimes[callTimes.length - 1] - callTimes[0]) / (callTimes.length - 1) : 0
  };
};

// Auto-run test in development
if (import.meta.env.DEV) {
  console.log('🧪 Message Test Available: testMessagingAPI()');
  console.log('📊 API Stats Available: getAPICallStats()');
  (window as any).testMessagingAPI = testMessagingAPI;
  (window as any).getAPICallStats = getAPICallStats;
  
  // Monitor for potential issues
  setInterval(() => {
    const stats = getAPICallStats();
    if (stats.callsInLastMinute > 10) {
      console.warn('🚨 High API call frequency detected:', stats);
    }
  }, 30000); // Check every 30 seconds
} 