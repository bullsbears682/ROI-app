#!/usr/bin/env node

import { roiScenarios } from './src/data/roiScenarios.js';
import { scenarioResearch, generateResearchSummary } from './src/data/researchData.js';

console.log('🔍 DEBUGGING RESEARCH MAPPING ISSUE');
console.log('=' .repeat(50));

console.log('\n📋 Available Research IDs:');
console.log('-'.repeat(30));
const researchIds = Object.keys(scenarioResearch);
console.log(researchIds.slice(0, 10).join(', '), '...');
console.log(`Total research entries: ${researchIds.length}`);

console.log('\n📋 Scenario IDs that need research:');
console.log('-'.repeat(30));
const scenarioIds = Object.keys(roiScenarios);
console.log(scenarioIds.slice(0, 10).join(', '), '...');
console.log(`Total scenarios: ${scenarioIds.length}`);

console.log('\n🔍 Missing Research Mappings (first 10):');
console.log('-'.repeat(30));
let missingCount = 0;
for (const scenarioId of scenarioIds.slice(0, 10)) {
  const research = generateResearchSummary(scenarioId, 'technology');
  if (!research || !research.sources || research.sources.length === 0) {
    console.log(`❌ ${scenarioId}`);
    // Check if it exists in scenarioResearch directly
    if (scenarioResearch[scenarioId]) {
      console.log(`   ⚠️  Research exists but mapping failed!`);
    } else {
      console.log(`   ❌ No research entry found`);
    }
    missingCount++;
  } else {
    console.log(`✅ ${scenarioId}`);
  }
}

console.log(`\nMissing mappings in sample: ${missingCount}/10`);

// Check a specific example
console.log('\n🔬 Detailed Analysis - ecom-marketplace:');
console.log('-'.repeat(30));
console.log('Scenario exists:', 'ecom-marketplace' in roiScenarios ? 'YES' : 'NO');
console.log('Research exists:', 'ecom-marketplace' in scenarioResearch ? 'YES' : 'NO');

if ('ecom-marketplace' in scenarioResearch) {
  console.log('Research data preview:', Object.keys(scenarioResearch['ecom-marketplace']));
}

const mappedResearch = generateResearchSummary('ecom-marketplace', 'technology');
console.log('Mapping function result:', mappedResearch ? 'SUCCESS' : 'FAILED');

if (mappedResearch) {
  console.log('Mapped sources:', mappedResearch.sources);
} else {
  console.log('❌ Mapping function returned null/undefined');
}
