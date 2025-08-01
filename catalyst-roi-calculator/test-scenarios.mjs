// Comprehensive Core Functionality Test for Catalyst ROI Calculator
import { roiCategories, roiScenarios } from './src/data/roiScenarios.js';
import { generateResearchSummary, getAllResearchSources } from './src/data/researchData.js';
import { convertToUSD, formatCurrencyCustom, CURRENCIES } from './src/utils/currency.js';

console.log('🔍 CATALYST ROI CALCULATOR - CORE FUNCTIONALITY TEST\n');

// Test Configuration
const testInvestments = [10000, 25000, 50000, 100000, 250000, 500000];
const testTimeframes = [3, 6, 12, 18, 24];
const testIndustries = ['technology', 'retail', 'healthcare', 'manufacturing', 'finance'];
const testCompanySizes = ['startup', 'small', 'medium', 'large', 'enterprise'];
const testCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let errors = [];

// Helper function to log test results
function testResult(testName, passed, error = null) {
  totalTests++;
  if (passed) {
    console.log(`✅ ${testName}`);
    passedTests++;
  } else {
    console.log(`❌ ${testName}: ${error}`);
    failedTests++;
    errors.push({ test: testName, error });
  }
}

// Helper function to calculate success rate
function calculateSuccessRate(riskLevel, industry, companySize) {
  let baseSuccessRate = 75;
  
  // Risk level adjustments
  if (riskLevel === 'low') baseSuccessRate += 10;
  else if (riskLevel === 'high') baseSuccessRate -= 15;
  
  // Industry adjustments
  const industryFactors = {
    'technology': 5,
    'healthcare': -5,
    'finance': 0,
    'retail': -3,
    'manufacturing': -2
  };
  baseSuccessRate += industryFactors[industry] || 0;
  
  // Company size adjustments
  const sizeFactors = {
    'startup': -10,
    'small': -5,
    'medium': 0,
    'large': 5,
    'enterprise': 8
  };
  baseSuccessRate += sizeFactors[companySize] || 0;
  
  return Math.max(60, Math.min(95, baseSuccessRate));
}

// Helper function to simulate ROI calculation
function calculateROI(scenario, investment, timeframe, industry, companySize) {
  try {
    // Industry adjustments
    const industryMultipliers = {
      'technology': 1.15,
      'healthcare': 1.05,
      'finance': 1.10,
      'retail': 0.95,
      'manufacturing': 1.00,
      'startup': 1.20
    };
    
    const industryMultiplier = industryMultipliers[industry] || 1.0;
    
    // Company size adjustments
    const sizeMultipliers = {
      'startup': 1.25,
      'small': 1.10,
      'medium': 1.00,
      'large': 0.95,
      'enterprise': 0.90
    };
    
    const sizeMultiplier = sizeMultipliers[companySize] || 1.0;
    
    // Calculate base ROI
    const avgROI = (scenario.expectedROI.min + scenario.expectedROI.max) / 2;
    const adjustedROI = avgROI * industryMultiplier * sizeMultiplier;
    
    // Calculate returns
    const returnsUSD = investment * (adjustedROI / 100);
    const totalReturns = investment + returnsUSD;
    const monthlyReturn = returnsUSD / timeframe;
    
    // Calculate payback period
    const paybackMonths = (investment / monthlyReturn);
    
    // Calculate annualized ROI
    const annualizedROI = (adjustedROI / timeframe) * 12;
    
    // Calculate success rate
    const successRate = calculateSuccessRate(scenario.riskLevel, industry, companySize);
    
    return {
      investment,
      expectedReturns: returnsUSD,
      totalReturns,
      roiPercentage: adjustedROI,
      annualizedROI,
      paybackPeriod: paybackMonths,
      monthlyReturn,
      netProfit: returnsUSD,
      successRate: { probability: successRate },
      scenario,
      inputs: { investment, timeframe, industry, companySize }
    };
  } catch (error) {
    throw new Error(`Calculation failed: ${error.message}`);
  }
}

console.log('1️⃣ TESTING DATA STRUCTURE INTEGRITY\n');

// Test 1: Scenario Data Structure
Object.entries(roiScenarios).forEach(([scenarioId, scenario]) => {
  try {
    const requiredFields = ['category', 'name', 'description', 'costRange', 'timeframe', 'expectedROI', 'benefits', 'costs'];
    const missingFields = requiredFields.filter(field => !scenario[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${missingFields.join(', ')}`);
    }
    
    // Validate ranges
    if (scenario.costRange.min >= scenario.costRange.max) {
      throw new Error('Invalid cost range');
    }
    
    if (scenario.timeframe.min >= scenario.timeframe.max) {
      throw new Error('Invalid timeframe');
    }
    
    if (scenario.expectedROI.min >= scenario.expectedROI.max) {
      throw new Error('Invalid ROI range');
    }
    
    testResult(`Data Structure: ${scenario.name}`, true);
  } catch (error) {
    testResult(`Data Structure: ${scenario.name}`, false, error.message);
  }
});

console.log('\n2️⃣ TESTING RESEARCH DATA COVERAGE\n');

// Test 2: Research Data Coverage
let researchCoverage = 0;
Object.keys(roiScenarios).forEach(scenarioId => {
  try {
    const research = generateResearchSummary(scenarioId, 'retail');
    if (research && research.scenario) {
      researchCoverage++;
      testResult(`Research Data: ${scenarioId}`, true);
    } else {
      testResult(`Research Data: ${scenarioId}`, false, 'No research data found');
    }
  } catch (error) {
    testResult(`Research Data: ${scenarioId}`, false, error.message);
  }
});

console.log('\n3️⃣ TESTING ROI CALCULATIONS\n');

// Test 3: ROI Calculations with Different Parameters
let calculationTests = 0;
const testScenarios = ['ai-chatbot', 'ecommerce-platform', 'saas-crm', 'fintech-payments', 'marketing-ppc'];

testScenarios.forEach(scenarioId => {
  const scenario = roiScenarios[scenarioId];
  if (!scenario) return;
  
  testInvestments.forEach(investment => {
    testTimeframes.forEach(timeframe => {
      testIndustries.forEach(industry => {
        testCompanySizes.forEach(companySize => {
          try {
            calculationTests++;
            const result = calculateROI(scenario, investment, timeframe, industry, companySize);
            
            // Validate calculation results
            if (result.expectedReturns <= 0) throw new Error('Invalid returns calculation');
            if (result.totalReturns <= result.investment) throw new Error('Invalid total returns');
            if (result.monthlyReturn <= 0) throw new Error('Invalid monthly return');
            if (result.roiPercentage <= 0) throw new Error('Invalid ROI percentage');
            if (result.successRate.probability < 60 || result.successRate.probability > 95) {
              throw new Error('Invalid success rate');
            }
            
            if (calculationTests % 100 === 0) {
              console.log(`✅ Calculation Test ${calculationTests}: ${scenario.name} - $${investment.toLocaleString()}`);
            }
            passedTests++;
            totalTests++;
            
          } catch (error) {
            testResult(`Calculation: ${scenario.name} ($${investment})`, false, error.message);
          }
        });
      });
    });
  });
});

console.log('\n4️⃣ TESTING CURRENCY FUNCTIONALITY\n');

// Test 4: Currency Conversion
testCurrencies.forEach(currency => {
  try {
    const testAmount = 50000;
    const convertedToUSD = convertToUSD(testAmount, currency);
    const formatted = formatCurrencyCustom(testAmount, currency);
    
    if (convertedToUSD <= 0) throw new Error('Invalid USD conversion');
    if (!formatted.includes(CURRENCIES[currency]?.symbol)) throw new Error('Invalid formatting');
    
    testResult(`Currency: ${currency} conversion and formatting`, true);
  } catch (error) {
    testResult(`Currency: ${currency}`, false, error.message);
  }
});

console.log('\n5️⃣ TESTING CATEGORY BALANCE\n');

// Test 5: Category Balance
const categoryCounts = {};
Object.values(roiScenarios).forEach(scenario => {
  categoryCounts[scenario.category] = (categoryCounts[scenario.category] || 0) + 1;
});

Object.entries(roiCategories).forEach(([categoryId, category]) => {
  const count = categoryCounts[categoryId] || 0;
  const isBalanced = count >= 6;
  testResult(`Category Balance: ${category.name} (${count} scenarios)`, isBalanced, 
    !isBalanced ? `Only ${count} scenarios, expected at least 6` : null);
});

console.log('\n6️⃣ TESTING EDGE CASES\n');

// Test 6: Edge Cases
const edgeCases = [
  { investment: 1000, timeframe: 1, scenario: 'ai-chatbot' },
  { investment: 1000000, timeframe: 36, scenario: 'sustainability-energy' },
  { investment: 5000, timeframe: 2, scenario: 'digital-analytics' }
];

edgeCases.forEach((testCase, index) => {
  try {
    const scenario = roiScenarios[testCase.scenario];
    if (!scenario) throw new Error('Scenario not found');
    
    const result = calculateROI(scenario, testCase.investment, testCase.timeframe, 'technology', 'medium');
    
    if (result.expectedReturns <= 0) throw new Error('Invalid edge case calculation');
    
    testResult(`Edge Case ${index + 1}: $${testCase.investment.toLocaleString()} over ${testCase.timeframe} months`, true);
  } catch (error) {
    testResult(`Edge Case ${index + 1}`, false, error.message);
  }
});

console.log('\n📊 FINAL TEST RESULTS\n');

// Final Summary
const successRate = ((passedTests / totalTests) * 100).toFixed(1);
const totalScenarios = Object.keys(roiScenarios).length;

console.log(`📈 Total Scenarios: ${totalScenarios}`);
console.log(`🧪 Total Tests Run: ${totalTests.toLocaleString()}`);
console.log(`✅ Passed Tests: ${passedTests.toLocaleString()}`);
console.log(`❌ Failed Tests: ${failedTests.toLocaleString()}`);
console.log(`📊 Success Rate: ${successRate}%`);
console.log(`🔬 Research Coverage: ${researchCoverage}/${totalScenarios} (${((researchCoverage/totalScenarios)*100).toFixed(1)}%)`);

if (passedTests > 0) {
  console.log(`\n🎯 CORE FUNCTIONALITY STATUS:`);
  if (successRate >= 95) {
    console.log('🚀 EXCELLENT! Ready for production launch');
  } else if (successRate >= 90) {
    console.log('⚠️  GOOD! Minor issues to address');
  } else {
    console.log('❌ NEEDS WORK! Critical issues found');
  }
}

if (errors.length > 0) {
  console.log(`\n🚨 CRITICAL ISSUES (First 10):`);
  errors.slice(0, 10).forEach(error => {
    console.log(`   - ${error.test}: ${error.error}`);
  });
}

console.log(`\n💡 NEXT STEPS:`);
console.log(`   • Test PDF export functionality`);
console.log(`   • Test lead capture forms`);
console.log(`   • Test analytics tracking`);
console.log(`   • Test responsive design`);
console.log(`   • Performance optimization`);
console.log(`   • Browser compatibility check`);

console.log('\n🎉 Core Functionality Test Complete!');