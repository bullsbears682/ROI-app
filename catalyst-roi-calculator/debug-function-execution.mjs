#!/usr/bin/env node

const timestamp = Date.now();
const { generateResearchSummary, scenarioResearch } = await import(`./src/data/researchData.js?debug=${timestamp}`);

console.log('🔍 DEBUGGING FUNCTION EXECUTION');
console.log('='.repeat(40));

const scenarioId = 'ecom-marketplace';
console.log(`Testing scenario: ${scenarioId}`);

// Check if scenarioResearch exists
console.log('scenarioResearch exists:', !!scenarioResearch);
console.log('scenarioResearch type:', typeof scenarioResearch);

// Check specific scenario
const research = scenarioResearch[scenarioId];
console.log(`Research for ${scenarioId}:`, !!research);
if (research) {
  console.log('Research keys:', Object.keys(research));
  console.log('Research sources:', research.sources);
}

// Test generateResearchSummary function
console.log('\n🧪 Testing generateResearchSummary:');
try {
  const result = generateResearchSummary(scenarioId, 'technology');
  console.log('Function result:', !!result);
  console.log('Result type:', typeof result);
  if (result) {
    console.log('Result keys:', Object.keys(result));
    console.log('Sources count:', result.sources?.length || 0);
    console.log('Sources:', result.sources);
  }
} catch (error) {
  console.error('Function error:', error.message);
}
