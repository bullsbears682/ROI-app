import { roiCategories, roiScenarios } from './src/data/roiScenarios.js';
import { generateResearchSummary, getAllResearchSources } from './src/data/researchData.js';

console.log('🔍 COMPREHENSIVE CATALYST APP AUDIT\n');

// 1. Scenario Data Validation
let dataIssues = [];
let totalScenarios = Object.keys(roiScenarios).length;

console.log('1️⃣ SCENARIO DATA VALIDATION:');
Object.entries(roiScenarios).forEach(([scenarioId, scenario]) => {
  // Check required fields
  const requiredFields = ['category', 'name', 'description', 'costRange', 'timeframe', 'expectedROI', 'benefits', 'costs'];
  const missingFields = requiredFields.filter(field => !scenario[field]);
  
  if (missingFields.length > 0) {
    dataIssues.push(`${scenarioId}: Missing ${missingFields.join(', ')}`);
  }
  
  // Validate ranges
  if (scenario.costRange.min >= scenario.costRange.max) {
    dataIssues.push(`${scenarioId}: Invalid cost range`);
  }
  
  if (scenario.expectedROI.min >= scenario.expectedROI.max) {
    dataIssues.push(`${scenarioId}: Invalid ROI range`);
  }
});

if (dataIssues.length === 0) {
  console.log('✅ All scenarios have valid data structure');
} else {
  console.log(`❌ Found ${dataIssues.length} data issues:`);
  dataIssues.forEach(issue => console.log(`   - ${issue}`));
}

// 2. Research Data Coverage
console.log('\n2️⃣ RESEARCH DATA COVERAGE:');
let scenariosWithResearch = 0;
let scenariosWithoutResearch = [];

Object.keys(roiScenarios).forEach(scenarioId => {
  const research = generateResearchSummary(scenarioId, 'retail');
  if (research && research.scenario) {
    scenariosWithResearch++;
  } else {
    scenariosWithoutResearch.push(scenarioId);
  }
});

console.log(`✅ ${scenariosWithResearch}/${totalScenarios} scenarios have research data`);
if (scenariosWithoutResearch.length > 0) {
  console.log(`❌ Missing research for: ${scenariosWithoutResearch.slice(0, 5).join(', ')}${scenariosWithoutResearch.length > 5 ? '...' : ''}`);
}

// 3. Category Balance
console.log('\n3️⃣ CATEGORY BALANCE:');
const categoryCounts = {};
Object.values(roiScenarios).forEach(scenario => {
  categoryCounts[scenario.category] = (categoryCounts[scenario.category] || 0) + 1;
});

let balancedCategories = 0;
Object.entries(roiCategories).forEach(([categoryId, category]) => {
  const count = categoryCounts[categoryId] || 0;
  if (count >= 6) balancedCategories++;
  console.log(`   ${category.name}: ${count} scenarios`);
});

console.log(`✅ ${balancedCategories}/${Object.keys(roiCategories).length} categories are complete (6+ scenarios)`);

// 4. Investment Range Coverage
console.log('\n4️⃣ INVESTMENT RANGE COVERAGE:');
const ranges = {
  small: { min: 0, max: 25000, count: 0 },
  medium: { min: 25000, max: 100000, count: 0 },
  large: { min: 100000, max: 500000, count: 0 },
  enterprise: { min: 500000, max: Infinity, count: 0 }
};

Object.values(roiScenarios).forEach(scenario => {
  const avgCost = (scenario.costRange.min + scenario.costRange.max) / 2;
  if (avgCost <= 25000) ranges.small.count++;
  else if (avgCost <= 100000) ranges.medium.count++;
  else if (avgCost <= 500000) ranges.large.count++;
  else ranges.enterprise.count++;
});

Object.entries(ranges).forEach(([range, data]) => {
  console.log(`   ${range.toUpperCase()}: ${data.count} scenarios`);
});

// 5. ROI Range Analysis
console.log('\n5️⃣ ROI EXPECTATIONS:');
let roiStats = {
  conservative: 0,  // < 200%
  moderate: 0,      // 200-400%
  aggressive: 0,    // 400-600%
  exceptional: 0    // > 600%
};

Object.values(roiScenarios).forEach(scenario => {
  const avgROI = (scenario.expectedROI.min + scenario.expectedROI.max) / 2;
  if (avgROI < 200) roiStats.conservative++;
  else if (avgROI < 400) roiStats.moderate++;
  else if (avgROI < 600) roiStats.aggressive++;
  else roiStats.exceptional++;
});

Object.entries(roiStats).forEach(([type, count]) => {
  console.log(`   ${type.toUpperCase()}: ${count} scenarios`);
});

// 6. Risk Distribution
console.log('\n6️⃣ RISK DISTRIBUTION:');
let riskStats = { low: 0, medium: 0, high: 0 };
Object.values(roiScenarios).forEach(scenario => {
  riskStats[scenario.riskLevel]++;
});

Object.entries(riskStats).forEach(([risk, count]) => {
  console.log(`   ${risk.toUpperCase()}: ${count} scenarios`);
});

// 7. Summary Score
console.log('\n🎯 READINESS SCORE:');
let score = 0;
let maxScore = 6;

if (dataIssues.length === 0) score++;
if (scenariosWithResearch / totalScenarios >= 0.8) score++;
if (balancedCategories >= 10) score++;
if (ranges.small.count >= 15 && ranges.medium.count >= 15) score++;
if (roiStats.moderate >= 20) score++;
if (Object.values(riskStats).every(count => count >= 10)) score++;

console.log(`📊 Overall Score: ${score}/${maxScore} (${((score/maxScore)*100).toFixed(1)}%)`);

if (score >= 5) {
  console.log('🚀 EXCELLENT! Ready for production launch');
} else if (score >= 4) {
  console.log('⚠️  GOOD! Minor improvements needed');
} else {
  console.log('❌ NEEDS WORK! Address critical issues first');
}

console.log('\n💡 WHAT TO CHECK NEXT:');
console.log('   • PDF export functionality test');
console.log('   • Multi-currency calculations accuracy');
console.log('   • Lead capture form validation');
console.log('   • Analytics tracking verification');
console.log('   • Mobile responsiveness test');
console.log('   • Browser compatibility check');
console.log('   • Performance optimization review');
console.log('   • Security best practices audit');