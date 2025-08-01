import { roiScenarios } from './src/data/roiScenarios.js';
import fs from 'fs';

// Read the raw file content to analyze structure
const rawContent = fs.readFileSync('./src/data/researchData.js', 'utf8');

console.log('🔍 COMPREHENSIVE RESEARCH DATA ANALYSIS');
console.log('=====================================\n');

// 1. Analyze file structure
const lines = rawContent.split('\n');
console.log(`📄 File Analysis:`);
console.log(`   Total lines: ${lines.length}`);
console.log(`   File size: ${(rawContent.length / 1024).toFixed(1)} KB\n`);

// 2. Find key structural elements
const scenarioResearchStart = rawContent.indexOf('export const scenarioResearch = {');
const scenarioResearchEnd = rawContent.indexOf('};', scenarioResearchStart);
const industryBenchmarksStart = rawContent.indexOf('export const industryBenchmarks = {');
const industryBenchmarksEnd = rawContent.indexOf('};', industryBenchmarksStart);

console.log(`📍 Structure Locations:`);
console.log(`   scenarioResearch starts at: ${scenarioResearchStart}`);
console.log(`   scenarioResearch ends at: ${scenarioResearchEnd}`);
console.log(`   industryBenchmarks starts at: ${industryBenchmarksStart}`);
console.log(`   industryBenchmarks ends at: ${industryBenchmarksEnd}\n`);

// 3. Count scenario entries in the raw content
const allROIScenarios = Object.keys(roiScenarios);
console.log(`🎯 ROI Scenarios Analysis:`);
console.log(`   Total ROI scenarios: ${allROIScenarios.length}`);

// Check which scenarios appear in the file
const foundScenarios = [];
const missingScenarios = [];

allROIScenarios.forEach(scenarioId => {
  const pattern = new RegExp(`'${scenarioId}'\\s*:\\s*{`, 'g');
  const matches = rawContent.match(pattern);
  if (matches && matches.length > 0) {
    foundScenarios.push({id: scenarioId, count: matches.length});
  } else {
    missingScenarios.push(scenarioId);
  }
});

console.log(`   Found in file: ${foundScenarios.length}`);
console.log(`   Missing from file: ${missingScenarios.length}\n`);

// 4. Check for duplicates
const duplicates = foundScenarios.filter(s => s.count > 1);
if (duplicates.length > 0) {
  console.log(`⚠️  DUPLICATES DETECTED:`);
  duplicates.forEach(dup => {
    console.log(`   ${dup.id}: ${dup.count} times`);
  });
  console.log();
}

// 5. List missing scenarios
if (missingScenarios.length > 0) {
  console.log(`❌ MISSING SCENARIOS (${missingScenarios.length}):`);
  missingScenarios.forEach((id, index) => {
    const scenario = roiScenarios[id];
    console.log(`   ${index + 1}. ${id}: ${scenario.name}`);
  });
  console.log();
}

// 6. Check for syntax issues
try {
  const { scenarioResearch } = await import('./src/data/researchData.js');
  console.log(`✅ Import successful - can access ${Object.keys(scenarioResearch).length} entries`);
} catch (error) {
  console.log(`❌ Import error: ${error.message}`);
}

// 7. File ending analysis
const lastChars = rawContent.slice(-500);
console.log(`\n📝 File ending preview (last 200 chars):`);
console.log(lastChars.slice(-200));