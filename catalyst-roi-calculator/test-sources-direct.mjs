#!/usr/bin/env node

// Force fresh import with cache busting
const timestamp = Date.now();
const { researchSources, generateResearchSummary, scenarioResearch } = await import(`./src/data/researchData.js?v=${timestamp}`);

console.log('🔍 DIRECT SOURCE TEST WITH CACHE BUSTING');
console.log('='.repeat(50));

const sourceCount = Object.keys(researchSources).length;
console.log(`Total sources loaded: ${sourceCount}`);

console.log('\nFirst 10 sources:');
Object.keys(researchSources).slice(0, 10).forEach(key => {
  console.log(`  - ${key}: ${researchSources[key].name}`);
});

console.log('\nLast 10 sources:');
Object.keys(researchSources).slice(-10).forEach(key => {
  console.log(`  - ${key}: ${researchSources[key].name}`);
});

console.log('\n🧪 Testing ecom-marketplace mapping:');
const scenarioId = 'ecom-marketplace';
const research = scenarioResearch[scenarioId];
console.log('Scenario sources:', research?.sources);

const summary = generateResearchSummary(scenarioId, 'technology');
console.log('Mapped sources count:', summary?.sources?.length || 0);
console.log('Mapped sources:', summary?.sources?.map(s => s?.name) || []);

console.log('\n🎯 SUCCESS RATE:');
let successCount = 0;
let totalCount = 0;

for (const [id, scenario] of Object.entries(scenarioResearch)) {
  totalCount++;
  const testSummary = generateResearchSummary(id, 'technology');
  if (testSummary?.sources?.length > 0) {
    successCount++;
  }
}

console.log(`Research Coverage: ${successCount}/${totalCount} (${(successCount/totalCount*100).toFixed(1)}%)`);
