#!/usr/bin/env node

// Force complete module reload 
const timestamp = Date.now();
const { generateResearchSummary } = await import(`./src/data/researchData.js?cache=${timestamp}`);

console.log('🎉 FINAL SUCCESS TEST - RESEARCH COVERAGE');
console.log('='.repeat(50));

// Test scenarios that were previously failing
const testScenarios = [
  'ecom-marketplace',
  'ecom-mobile', 
  'marketing-ppc',
  'marketing-social',
  'software-erp',
  'security-software',
  'automation-manufacturing',
  'saas-analytics',
  'fintech-lending'
];

let successCount = 0;
console.log('🔬 Testing previously failing scenarios:');

for (const scenarioId of testScenarios) {
  const research = generateResearchSummary(scenarioId, 'technology');
  const hasResearch = research && research.sources && research.sources.length > 0;
  
  console.log(`${hasResearch ? '✅' : '❌'} ${scenarioId}: ${research?.sources?.length || 0} sources`);
  if (hasResearch) {
    successCount++;
    console.log(`   Sources: ${research.sources.map(s => s.name).slice(0, 2).join(', ')}${research.sources.length > 2 ? '...' : ''}`);
  }
}

console.log(`\n🎯 RESULTS:`);
console.log(`✅ Success: ${successCount}/${testScenarios.length} (${(successCount/testScenarios.length*100).toFixed(1)}%)`);

if (successCount === testScenarios.length) {
  console.log('\n🚀 SUCCESS! All previously failing scenarios now have research data!');
  console.log('✅ Research coverage issue RESOLVED!');
} else {
  console.log('\n⚠️  Some scenarios still missing research data');
}
