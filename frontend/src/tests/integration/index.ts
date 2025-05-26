import { runAuthApiTests } from './authApi.test';
import { runSocialApiTests } from './socialApi.test';

export const runAllIntegrationTests = () => {
  console.log('🧪 Starting Complete API Integration Test Suite...\n');
  console.log('='.repeat(60));

  const authResults = runAuthApiTests();
  console.log('\n' + '='.repeat(60));

  const socialResults = runSocialApiTests();
  console.log('\n' + '='.repeat(60));

  const totalPassed = authResults.passed + socialResults.passed;
  const totalTests = authResults.total + socialResults.total;
  const overallSuccess = authResults.success && socialResults.success;

  console.log('\n🎯 OVERALL TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`📊 Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalTests - totalPassed}`);
  console.log(`📈 Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
  console.log(`🎉 Overall Status: ${overallSuccess ? 'PASSED' : 'FAILED'}`);

  return {
    passed: totalPassed,
    total: totalTests,
    success: overallSuccess,
    details: {
      auth: authResults,
      social: socialResults
    }
  };
};

export { runAuthApiTests } from './authApi.test';
export { runSocialApiTests } from './socialApi.test'; 