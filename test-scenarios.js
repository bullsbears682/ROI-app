// Test script to verify all ROI scenarios work correctly
import { roiCategories, roiScenarios } from './src/data/roiScenarios.js';
import { generateResearchSummary } from './src/data/researchData.js';

console.log('🔍 Testing Catalyst ROI Calculator Scenarios\n');

// Count scenarios per category
const categoryCounts = {};
Object.values(roiScenarios).forEach(scenario => {
  categoryCounts[scenario.category] = (categoryCounts[scenario.category] || 0) + 1;
});

console.log('📊 Scenario Counts by Category:');
Object.entries(categoryCounts).forEach(([category, count]) => {
  const categoryName = roiCategories[category]?.name || 'Unknown';
  console.log(`  ${categoryName}: ${count} scenarios`);
});

const totalScenarios = Object.keys(roiScenarios).length;
console.log(`\n📈 Total Scenarios: ${totalScenarios}\n`);

// Test different investment amounts and settings
const testInvestments = [10000, 50000, 100000, 250000];
const testTimeframes = [3, 6, 12, 18];
const testIndustries = ['retail', 'saas', 'manufacturing', 'financial'];
const testCompanySizes = ['startup', 'small', 'medium', 'large'];

console.log('🧪 Testing scenarios with different settings...\n');

let passedTests = 0;
let failedTests = 0;
const errors = [];

// Test each scenario
Object.entries(roiScenarios).forEach(([scenarioId, scenario]) => {
  try {
    // Test basic scenario structure
    const requiredFields = ['category', 'name', 'description', 'costRange', 'timeframe', 'expectedROI', 'benefits', 'costs'];
    const missingFields = requiredFields.filter(field => !scenario[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${missingFields.join(', ')}`);
    }

    // Test cost range validity
    if (scenario.costRange.min >= scenario.costRange.max) {
      throw new Error('Invalid cost range: min should be less than max');
    }

    // Test timeframe validity
    if (scenario.timeframe.min >= scenario.timeframe.max) {
      throw new Error('Invalid timeframe: min should be less than max');
    }

    // Test ROI validity
    if (scenario.expectedROI.min >= scenario.expectedROI.max) {
      throw new Error('Invalid ROI range: min should be less than max');
    }

    // Test research data exists
    const researchData = generateResearchSummary(scenarioId, 'retail');
    
    // Test with different investment amounts
    testInvestments.forEach(investment => {
      if (investment < scenario.costRange.min * 0.5 || investment > scenario.costRange.max * 2) {
        // Skip if investment is way outside reasonable range
        return;
      }

      // Calculate basic ROI
      const timeframe = (scenario.timeframe.min + scenario.timeframe.max) / 2;
      const expectedROI = (scenario.expectedROI.min + scenario.expectedROI.max) / 2;
      const returns = investment * (expectedROI / 100);
      const totalReturns = investment + returns;
      const monthlyReturn = returns / timeframe;

      // Validate calculations
      if (returns <= 0 || totalReturns <= investment || monthlyReturn <= 0) {
        throw new Error(`Invalid calculation results for investment ${investment}`);
      }
    });

    console.log(`✅ ${scenario.name} (${scenarioId})`);
    passedTests++;

  } catch (error) {
    console.log(`❌ ${scenario.name} (${scenarioId}): ${error.message}`);
    failedTests++;
    errors.push({
      scenario: scenarioId,
      name: scenario.name,
      error: error.message
    });
  }
});

console.log(`\n📋 Test Results:`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📊 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

if (errors.length > 0) {
  console.log('\n🚨 Failed Tests:');
  errors.forEach(error => {
    console.log(`  - ${error.name}: ${error.error}`);
  });
}

// Test categories have proper icons and descriptions
console.log('\n🏷️  Testing Categories:');
Object.entries(roiCategories).forEach(([categoryId, category]) => {
  const scenarioCount = categoryCounts[categoryId] || 0;
  const status = scenarioCount === 6 ? '✅' : '⚠️';
  console.log(`  ${status} ${category.name} (${category.icon}): ${scenarioCount} scenarios`);
});

console.log('\n🎯 Testing Complete!');