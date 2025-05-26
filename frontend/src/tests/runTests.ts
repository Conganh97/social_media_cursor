import { runAllIntegrationTests } from './integration';

console.log('🚀 Starting API Integration Test Runner...\n');

try {
  const results = runAllIntegrationTests();
  
  if (results.success) {
    console.log('\n🎉 All integration tests passed successfully!');
    console.log('✅ Frontend API structure is properly aligned with backend');
  } else {
    console.log('\n⚠️  Some integration tests failed');
    console.log('❌ Please review the failed tests and fix any issues');
  }
  
  console.log('\n📋 Test Results Summary:');
  console.log(`   Auth API Tests: ${results.details.auth.passed}/${results.details.auth.total}`);
  console.log(`   Social API Tests: ${results.details.social.passed}/${results.details.social.total}`);
  console.log(`   Overall: ${results.passed}/${results.total} (${((results.passed / results.total) * 100).toFixed(1)}%)`);
  
} catch (error) {
  console.error('❌ Error running integration tests:', error);
  console.log('\n💡 This might indicate missing dependencies or API services');
  console.log('   Make sure all API services are properly imported and available');
}

console.log('\n📝 Note: These tests verify API structure and type compatibility');
console.log('   For full functionality testing, run the application with a live backend');

export { runAllIntegrationTests } from './integration'; 