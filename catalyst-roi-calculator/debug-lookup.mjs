import { roiScenarios } from './src/data/roiScenarios.js';
import { scenarioResearch } from './src/data/researchData.js';

const scenarioIds = Object.keys(roiScenarios);
const researchIds = Object.keys(scenarioResearch);

console.log('🔍 DETAILED LOOKUP INVESTIGATION:\n');
console.log(`Total scenarios: ${scenarioIds.length}`);
console.log(`Total research entries: ${researchIds.length}`);

const missing = scenarioIds.filter(id => !researchIds.includes(id));
console.log(`\nMissing research (${missing.length}):`);
missing.forEach(id => {
  console.log(`  ❌ ${id}: ${roiScenarios[id].name}`);
});

console.log('\n🔧 DEBUGGING SPECIFIC KEYS:');
const testKeys = ['ecom-shopify', 'marketing-ppc', 'software-crm', 'cloud-aws'];
testKeys.forEach(key => {
  console.log(`${key}:`);
  console.log(`  - In scenarios: ${key in roiScenarios}`);
  console.log(`  - In research: ${key in scenarioResearch}`);
  console.log(`  - Research lookup: ${scenarioResearch[key] ? 'FOUND' : 'NOT FOUND'}`);
});

console.log('\n📋 ALL RESEARCH KEYS:');
researchIds.forEach(id => console.log(`  ✅ ${id}`));

console.log('\n💡 SOLUTION NEEDED:');
if (missing.length > 0) {
  console.log(`Need to add research data for ${missing.length} scenarios`);
} else {
  console.log('All scenarios have research data - lookup issue elsewhere');
}