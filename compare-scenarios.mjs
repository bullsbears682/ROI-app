import { roiScenarios } from './src/data/roiScenarios.js';
import { scenarioResearch } from './src/data/researchData.js';

const allScenarios = Object.keys(roiScenarios).sort();
const researchScenarios = Object.keys(scenarioResearch).sort();
const missing = allScenarios.filter(id => !researchScenarios.includes(id));

console.log('🔍 SCENARIO COMPARISON:');
console.log(`Total ROI Scenarios: ${allScenarios.length}`);
console.log(`Total Research Data: ${researchScenarios.length}`);
console.log(`Missing from Research: ${missing.length}`);

console.log('\n❌ MISSING SCENARIOS:');
missing.forEach((id, index) => {
  const scenario = roiScenarios[id];
  console.log(`${index + 1}. ${id}: ${scenario.name}`);
});

// Look for scenarios that exist in research but not in ROI (extra entries)
const extra = researchScenarios.filter(id => !allScenarios.includes(id));
if (extra.length > 0) {
  console.log('\n⚠️ EXTRA RESEARCH ENTRIES:');
  extra.forEach((id, index) => {
    console.log(`${index + 1}. ${id}`);
  });
}