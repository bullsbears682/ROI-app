import { roiScenarios } from './src/data/roiScenarios.js';
import fs from 'fs';

const rawContent = fs.readFileSync('./src/data/researchData.js', 'utf8');
const allROIScenarios = Object.keys(roiScenarios);

console.log('🔍 RESEARCH DATA ANALYSIS');
console.log(`ROI Scenarios: ${allROIScenarios.length}`);
console.log(`File size: ${(rawContent.length / 1024).toFixed(1)} KB`);

const missingScenarios = [];
allROIScenarios.forEach(scenarioId => {
  const pattern = new RegExp(`'${scenarioId}'\\s*:\\s*{`);
  if (!pattern.test(rawContent)) {
    missingScenarios.push(scenarioId);
  }
});

console.log(`\n❌ MISSING (${missingScenarios.length}):`);
missingScenarios.forEach((id, index) => {
  console.log(`${index + 1}. ${id}: ${roiScenarios[id].name}`);
});

try {
  const { scenarioResearch } = await import('./src/data/researchData.js');
  console.log(`\n✅ Import: ${Object.keys(scenarioResearch).length} entries accessible`);
} catch (error) {
  console.log(`\n❌ Import error: ${error.message}`);
}
