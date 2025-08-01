import { roiScenarios } from './src/data/roiScenarios.js';
import { generateResearchSummary } from './src/data/researchData.js';

console.log('🔍 MISSING RESEARCH DATA:\n');
const missing = [];
Object.keys(roiScenarios).forEach(id => {
  if (!generateResearchSummary(id, 'retail')) {
    missing.push(id);
    console.log(`❌ ${id}: ${roiScenarios[id].name}`);
  }
});
console.log(`\n📊 Total Missing: ${missing.length}/85`);
console.log(`📈 Coverage: ${85-missing.length}/85 (${((85-missing.length)/85*100).toFixed(1)}%)`);

if (missing.length === 0) {
  console.log('\n🎉 100% RESEARCH COVERAGE ACHIEVED!');
}