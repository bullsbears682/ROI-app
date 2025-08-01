import { scenarioResearch, getResearchForScenario } from './src/data/researchData.js';

console.log('🔍 EXAMINING RESEARCH OBJECT STRUCTURE:\n');

const keys = Object.keys(scenarioResearch);
console.log(`Total keys in scenarioResearch: ${keys.length}`);

// Check for the specific missing keys
const missingKeys = ['ecom-shopify', 'marketing-ppc', 'software-crm', 'cloud-aws', 'security-software', 'automation-manufacturing', 'saas-analytics', 'fintech-lending'];

console.log('\n📋 CHECKING SPECIFIC KEYS:');
missingKeys.forEach(key => {
  const directAccess = scenarioResearch[key];
  const functionAccess = getResearchForScenario(key);
  console.log(`${key}:`);
  console.log(`  - Direct access: ${directAccess ? 'FOUND' : 'NOT FOUND'}`);
  console.log(`  - Function access: ${functionAccess ? 'FOUND' : 'NOT FOUND'}`);
});

console.log('\n📝 FIRST 10 KEYS:');
keys.slice(0, 10).forEach(key => console.log(`  ✅ ${key}`));

console.log('\n📝 LAST 10 KEYS:');
keys.slice(-10).forEach(key => console.log(`  ✅ ${key}`));

// Check for duplicates
const uniqueKeys = [...new Set(keys)];
if (keys.length !== uniqueKeys.length) {
  console.log(`\n⚠️  DUPLICATE KEYS DETECTED: ${keys.length} total, ${uniqueKeys.length} unique`);
} else {
  console.log(`\n✅ NO DUPLICATES: All ${keys.length} keys are unique`);
}
