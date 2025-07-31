import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Calculator from './components/Calculator'
import Results from './components/Results'
import CookieConsent from './components/CookieConsent'
import { roiCategories, roiScenarios } from './data/roiScenarios'

// Calculate realistic success rate based on scenario factors
const calculateSuccessRate = (riskLevel, industry, companySize) => {
  let baseSuccessRate = 75; // Base 75% success rate
  
  // Adjust for risk level
  switch (riskLevel) {
    case 'low': baseSuccessRate += 15; break;
    case 'medium': baseSuccessRate += 0; break;
    case 'high': baseSuccessRate -= 10; break;
  }
  
  // Adjust for industry
  const industryAdjustments = {
    'retail': 5,
    'saas': 10,
    'manufacturing': -5,
    'financial': 0,
    'healthcare': -10,
    'professional': 8
  };
  baseSuccessRate += industryAdjustments[industry] || 0;
  
  // Adjust for company size
  const sizeAdjustments = {
    'startup': -5,
    'small': 0,
    'medium': 5,
    'large': 10,
    'enterprise': 8
  };
  baseSuccessRate += sizeAdjustments[companySize] || 0;
  
  // Cap between 60% and 95%
  const finalRate = Math.max(60, Math.min(95, baseSuccessRate));
  
  // Determine success factors based on scenario
  const successFactors = [];
  if (riskLevel === 'low') successFactors.push('Proven technology');
  if (industry === 'saas' || industry === 'retail') successFactors.push('High adoption rates');
  if (companySize === 'large' || companySize === 'enterprise') successFactors.push('Strong resources');
  if (finalRate > 85) successFactors.push('Executive support');
  successFactors.push('Proper planning', 'Staff training');
  
  // Risk mitigation advice
  let mitigation = 'Phased implementation recommended';
  if (riskLevel === 'high') mitigation = 'Pilot program strongly recommended';
  if (industry === 'healthcare' || industry === 'financial') mitigation += ', compliance review required';
  
  return {
    probability: finalRate,
    factors: successFactors.slice(0, 3), // Top 3 factors
    mitigation: mitigation
  };
};

function App() {
  // Main application state
  const [selectedCategory, setSelectedCategory] = useState('ai');
  const [selectedScenario, setSelectedScenario] = useState('ai-chatbot');
  const [calculationInputs, setCalculationInputs] = useState({
    investment: 25000,
    timeframe: 12,
    industry: 'general',
    companySize: 'medium'
  });
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Cookie consent state
  const [cookieConsent, setCookieConsent] = useState(null);

  // Check for saved cookie consent on load
  useEffect(() => {
    const savedConsent = localStorage.getItem('catalyst-cookie-consent');
    if (savedConsent) {
      setCookieConsent(JSON.parse(savedConsent));
    }
  }, []);

  // Update selected scenario when category changes
  useEffect(() => {
    const categoryScenarios = Object.entries(roiScenarios)
      .filter(([key, scenario]) => scenario.category === selectedCategory);
    
    if (categoryScenarios.length > 0) {
      setSelectedScenario(categoryScenarios[0][0]);
    }
  }, [selectedCategory]);

  // Calculate ROI based on inputs and scenario data
  const calculateROI = () => {
    const scenario = roiScenarios[selectedScenario];
    if (!scenario) return;

    const { investment, timeframe } = calculationInputs;
    
    // Get expected returns based on scenario and industry
    const industryData = scenario.industryBenchmarks?.[calculationInputs.industry];
    const baseROI = industryData?.roi || (scenario.expectedROI.min + scenario.expectedROI.max) / 2;
    
    // Calculate returns
    const expectedReturns = investment * (baseROI / 100);
    const totalReturns = investment + expectedReturns;
    const monthlyReturn = expectedReturns / timeframe;
    const paybackMonths = investment / monthlyReturn;

    // Risk adjustment based on scenario
    let riskMultiplier = 1;
    switch (scenario.riskLevel) {
      case 'low': riskMultiplier = 0.9; break;
      case 'medium': riskMultiplier = 1.0; break;
      case 'high': riskMultiplier = 1.1; break;
    }

    const adjustedReturns = expectedReturns * riskMultiplier;
    const roiPercentage = (adjustedReturns / investment) * 100;
    const annualizedROI = (roiPercentage / timeframe) * 12;

    // Calculate success rate
    const successRate = calculateSuccessRate(scenario.riskLevel, calculationInputs.industry, calculationInputs.companySize);

    const calculatedResults = {
      investment: investment,
      expectedReturns: adjustedReturns,
      totalReturns: investment + adjustedReturns,
      roiPercentage: roiPercentage,
      annualizedROI: annualizedROI,
      paybackPeriod: paybackMonths,
      monthlyReturn: adjustedReturns / timeframe,
      netProfit: adjustedReturns,
      successRate: successRate,
      scenario: scenario,
      inputs: calculationInputs
    };

    setResults(calculatedResults);
    setShowResults(true);

    // Save calculation to localStorage if consent given
    if (cookieConsent?.analytics) {
      const savedCalculations = JSON.parse(localStorage.getItem('catalyst-calculations') || '[]');
      savedCalculations.push({
        ...calculatedResults,
        timestamp: new Date().toISOString(),
        scenarioId: selectedScenario
      });
      // Keep only last 10 calculations
      if (savedCalculations.length > 10) {
        savedCalculations.shift();
      }
      localStorage.setItem('catalyst-calculations', JSON.stringify(savedCalculations));
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setCalculationInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle cookie consent
  const handleCookieConsent = (consent) => {
    setCookieConsent(consent);
    localStorage.setItem('catalyst-cookie-consent', JSON.stringify(consent));
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="calculator-section">
          <Calculator
            categories={roiCategories}
            scenarios={roiScenarios}
            selectedCategory={selectedCategory}
            selectedScenario={selectedScenario}
            inputs={calculationInputs}
            onCategoryChange={setSelectedCategory}
            onScenarioChange={setSelectedScenario}
            onInputChange={handleInputChange}
            onCalculate={calculateROI}
          />
        </div>

        <div className="results-section">
          <Results
            results={results}
            showResults={showResults}
            onExportPDF={() => {
              // PDF export will be implemented in Results component
              console.log('Exporting PDF...');
            }}
          />
        </div>
      </main>

      {/* Cookie consent banner */}
      {cookieConsent === null && (
        <CookieConsent onConsent={handleCookieConsent} />
      )}
    </div>
  );
}

export default App;