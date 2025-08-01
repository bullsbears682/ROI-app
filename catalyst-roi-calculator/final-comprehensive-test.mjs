#!/usr/bin/env node

import { roiCategories, roiScenarios } from './src/data/roiScenarios.js';
import { scenarioResearch, generateResearchSummary } from './src/data/researchData.js';

console.log('🔍 FINAL COMPREHENSIVE TEST - CATALYST ROI CALCULATOR');
console.log('=' .repeat(60));

// Test 1: Basic Data Integrity
console.log('\n📊 Test 1: Data Integrity Check');
console.log('-'.repeat(40));

const categoryCount = Object.keys(roiCategories).length;
const scenarioCount = Object.keys(roiScenarios).length;
const researchCount = Object.keys(scenarioResearch).length;

console.log(`✅ Categories: ${categoryCount}/14`);
console.log(`✅ Scenarios: ${scenarioCount}/85`);
console.log(`✅ Research entries: ${researchCount}/85`);

// Test 2: Research Coverage Verification
console.log('\n🔬 Test 2: Research Coverage Verification');
console.log('-'.repeat(40));

let researchCoverage = 0;
let missingResearch = [];

for (const [scenarioId, scenario] of Object.entries(roiScenarios)) {
  const research = generateResearchSummary(scenarioId, 'technology');
  if (research && research.sources && research.sources.length > 0) {
    researchCoverage++;
  } else {
    missingResearch.push(`${scenarioId}: ${scenario.name}`);
  }
}

console.log(`✅ Research Coverage: ${researchCoverage}/85 (${(researchCoverage/85*100).toFixed(1)}%)`);
if (missingResearch.length > 0) {
  console.log('❌ Missing Research:');
  missingResearch.forEach(item => console.log(`   - ${item}`));
} else {
  console.log('🎉 PERFECT: All scenarios have research data!');
}

// Test 3: Scenario Quality Check
console.log('\n💎 Test 3: Scenario Quality Check');
console.log('-'.repeat(40));

let qualityIssues = [];
let validScenarios = 0;

for (const [scenarioId, scenario] of Object.entries(roiScenarios)) {
  let issues = [];
  
  // Check required fields
  if (!scenario.costRange || !scenario.costRange.min || !scenario.costRange.max) {
    issues.push('Missing cost range');
  }
  if (!scenario.expectedROI || !scenario.expectedROI.min || !scenario.expectedROI.max) {
    issues.push('Missing expected ROI');
  }
  if (!scenario.timeframe || !scenario.timeframe.min || !scenario.timeframe.max) {
    issues.push('Missing timeframe');
  }
  if (!scenario.benefits || scenario.benefits.length === 0) {
    issues.push('Missing benefits');
  }
  if (!scenario.costs || Object.keys(scenario.costs).length === 0) {
    issues.push('Missing cost breakdown');
  }
  
  if (issues.length === 0) {
    validScenarios++;
  } else {
    qualityIssues.push({ scenarioId, issues });
  }
}

console.log(`✅ Valid Scenarios: ${validScenarios}/85 (${(validScenarios/85*100).toFixed(1)}%)`);
if (qualityIssues.length > 0) {
  console.log('⚠️ Quality Issues Found:');
  qualityIssues.slice(0, 5).forEach(item => {
    console.log(`   - ${item.scenarioId}: ${item.issues.join(', ')}`);
  });
  if (qualityIssues.length > 5) {
    console.log(`   ... and ${qualityIssues.length - 5} more`);
  }
} else {
  console.log('🎉 PERFECT: All scenarios meet quality standards!');
}

// Test 4: Research Data Quality
console.log('\n📚 Test 4: Research Data Quality Check');
console.log('-'.repeat(40));

let researchQualityIssues = [];
let validResearch = 0;

for (const [scenarioId, research] of Object.entries(scenarioResearch)) {
  let issues = [];
  
  if (!research.sources || research.sources.length === 0) {
    issues.push('Missing sources');
  }
  if (!research.caseStudies || research.caseStudies.length === 0) {
    issues.push('Missing case studies');
  }
  if (!research.benchmarks) {
    issues.push('Missing benchmarks');
  }
  if (!research.methodology) {
    issues.push('Missing methodology');
  }
  
  // Check case study quality
  if (research.caseStudies) {
    research.caseStudies.forEach((study, index) => {
      if (!study.company || !study.industry || !study.investment || !study.roi) {
        issues.push(`Case study ${index + 1} incomplete`);
      }
    });
  }
  
  if (issues.length === 0) {
    validResearch++;
  } else {
    researchQualityIssues.push({ scenarioId, issues });
  }
}

console.log(`✅ Valid Research: ${validResearch}/${researchCount} (${(validResearch/researchCount*100).toFixed(1)}%)`);
if (researchQualityIssues.length > 0) {
  console.log('⚠️ Research Quality Issues:');
  researchQualityIssues.slice(0, 3).forEach(item => {
    console.log(`   - ${item.scenarioId}: ${item.issues.join(', ')}`);
  });
  if (researchQualityIssues.length > 3) {
    console.log(`   ... and ${researchQualityIssues.length - 3} more`);
  }
} else {
  console.log('🎉 PERFECT: All research data meets quality standards!');
}

// Test 5: Category Distribution
console.log('\n📈 Test 5: Category Distribution Analysis');
console.log('-'.repeat(40));

const categoryDistribution = {};
for (const scenario of Object.values(roiScenarios)) {
  const category = scenario.category;
  categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
}

console.log('Scenarios per category:');
for (const [categoryId, count] of Object.entries(categoryDistribution)) {
  const categoryName = roiCategories[categoryId]?.name || categoryId;
  console.log(`   ${categoryName}: ${count} scenarios`);
}

// Final Summary
console.log('\n🎯 FINAL TEST SUMMARY');
console.log('='.repeat(60));

const overallScore = (
  (categoryCount >= 14 ? 100 : (categoryCount/14*100)) * 0.1 +
  (scenarioCount >= 85 ? 100 : (scenarioCount/85*100)) * 0.2 +
  (researchCoverage/85*100) * 0.3 +
  (validScenarios/85*100) * 0.2 +
  (validResearch/researchCount*100) * 0.2
);

console.log(`📊 Overall Quality Score: ${overallScore.toFixed(1)}%`);

if (overallScore >= 99.5) {
  console.log('🎉 EXCELLENT: Ready for premium market deployment!');
} else if (overallScore >= 95) {
  console.log('✅ VERY GOOD: Minor improvements could enhance quality');
} else if (overallScore >= 90) {
  console.log('⚠️ GOOD: Some quality issues should be addressed');
} else {
  console.log('❌ NEEDS WORK: Significant improvements required');
}

// Market Readiness Assessment
console.log('\n🚀 MARKET READINESS ASSESSMENT');
console.log('-'.repeat(40));

const readinessCriteria = [
  { name: 'Complete scenario coverage', status: scenarioCount >= 85 },
  { name: '100% research backing', status: researchCoverage >= 85 },
  { name: 'Quality data standards', status: validScenarios >= 80 },
  { name: 'Professional research depth', status: validResearch >= 80 },
  { name: 'Category diversity', status: categoryCount >= 12 }
];

let readyCount = 0;
readinessCriteria.forEach(criteria => {
  const icon = criteria.status ? '✅' : '❌';
  console.log(`${icon} ${criteria.name}`);
  if (criteria.status) readyCount++;
});

const readinessPercentage = (readyCount / readinessCriteria.length) * 100;
console.log(`\n🎯 Market Readiness: ${readinessPercentage}%`);

if (readinessPercentage === 100) {
  console.log('🚀 READY FOR LAUNCH: Premium market deployment approved!');
} else {
  console.log(`⚠️ ${readinessCriteria.length - readyCount} criteria need attention before launch`);
}

console.log('\n' + '='.repeat(60));
console.log('🏁 COMPREHENSIVE TEST COMPLETE');
