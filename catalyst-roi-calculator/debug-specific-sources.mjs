#!/usr/bin/env node

// Direct file import with timestamp to avoid cache
const timestamp = Date.now();
const { researchSources } = await import(`./src/data/researchData.js?t=${timestamp}`);

console.log('🔍 SPECIFIC SOURCE DEBUG');
console.log('='.repeat(40));

console.log('Type of researchSources:', typeof researchSources);
console.log('Is array:', Array.isArray(researchSources));
console.log('Keys count:', Object.keys(researchSources).length);
console.log('Keys:', Object.keys(researchSources));

// Test specific lookups
const testSources = ['amazon', 'shopify', 'bigcommerce', 'mckinsey', 'gartner'];
console.log('\n🔬 Individual Source Tests:');
testSources.forEach(sourceId => {
  const exists = sourceId in researchSources;
  const value = researchSources[sourceId];
  console.log(`${sourceId}: ${exists ? '✅' : '❌'} ${value ? `(${value.name})` : '(undefined)'}`);
});

// Check structure
if (Object.keys(researchSources).length > 0) {
  const firstKey = Object.keys(researchSources)[0];
  console.log(`\nFirst source structure:`, researchSources[firstKey]);
}
