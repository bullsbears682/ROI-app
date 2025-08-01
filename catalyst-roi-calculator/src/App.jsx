import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Calculator from './components/Calculator'
import Results from './components/Results'
import CookieConsent from './components/CookieConsent'
import LeadCapture from './components/LeadCapture'
import { roiCategories, roiScenarios } from './data/roiScenarios'
import { detectUserCurrency, convertToUSD, formatCurrencyCustom } from './utils/currency'
import { initAnalytics, trackROICalculation, trackUserInteraction } from './utils/analytics'

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
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [currency, setCurrency] = useState('USD');

  // Cookie consent state
  const [cookieConsent, setCookieConsent] = useState(null);

  // Check for saved cookie consent and detect currency on load
  useEffect(() => {
    const savedConsent = localStorage.getItem('catalyst-cookie-consent');
    if (savedConsent) {
      setCookieConsent(JSON.parse(savedConsent));
    }
    
    // Detect user's likely currency
    const detectedCurrency = detectUserCurrency();
    setCurrency(detectedCurrency);
    
    // Initialize analytics if consent exists
    if (savedConsent) {
      initAnalytics(JSON.parse(savedConsent));
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

    // Convert investment to USD for calculations (scenarios are in USD)
    const investmentUSD = convertToUSD(investment, currency);

    // Get expected returns based on scenario and industry
    const industryData = scenario.industryBenchmarks?.[calculationInputs.industry];
    const baseROI = industryData?.roi || (scenario.expectedROI.min + scenario.expectedROI.max) / 2;
    
    // Calculate returns (in USD)
    const expectedReturnsUSD = investmentUSD * (baseROI / 100);
    const totalReturnsUSD = investmentUSD + expectedReturnsUSD;
    const monthlyReturnUSD = expectedReturnsUSD / timeframe;
    const paybackMonths = investmentUSD / monthlyReturnUSD;

    // Risk adjustment based on scenario
    let riskMultiplier = 1;
    switch (scenario.riskLevel) {
      case 'low': riskMultiplier = 0.9; break;
      case 'medium': riskMultiplier = 1.0; break;
      case 'high': riskMultiplier = 1.1; break;
    }

    const adjustedReturnsUSD = expectedReturnsUSD * riskMultiplier;
    const roiPercentage = (adjustedReturnsUSD / investmentUSD) * 100;
    const annualizedROI = (roiPercentage / timeframe) * 12;

    // Calculate success rate
    const successRate = calculateSuccessRate(scenario.riskLevel, calculationInputs.industry, calculationInputs.companySize);

    const calculatedResults = {
      investment: investment, // In display currency
      expectedReturns: adjustedReturnsUSD, // Keep in USD for consistency
      totalReturns: investmentUSD + adjustedReturnsUSD, // In USD
      roiPercentage: roiPercentage,
      annualizedROI: annualizedROI,
      paybackPeriod: paybackMonths,
      monthlyReturn: adjustedReturnsUSD / timeframe, // In USD
      netProfit: adjustedReturnsUSD, // In USD
      successRate: successRate,
      scenario: scenario,
      inputs: calculationInputs,
      currency: currency, // Store currency for display
      investmentUSD: investmentUSD // Store USD amount for calculations
    };

              setResults(calculatedResults);
    setShowResults(true);

    // Track ROI calculation analytics
    trackROICalculation(scenario, calculationInputs, calculatedResults);

    // Show lead capture modal after a delay
    setTimeout(() => {
      setShowLeadCapture(true);
    }, 2000);

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

  const handleLeadCapture = (leadData) => {
    // Lead captured successfully
    console.log('Lead captured:', leadData);
    
    // Track lead capture analytics
    if (cookieConsent?.analytics) {
      const leadEvent = {
        type: 'lead_capture',
        timestamp: new Date().toISOString(),
        leadScore: leadData.leadScore,
        source: 'roi_calculator',
        scenario: selectedScenario,
        roiPercentage: results?.roiPercentage
      };
      
      const events = JSON.parse(localStorage.getItem('catalyst-analytics') || '[]');
      events.push(leadEvent);
      localStorage.setItem('catalyst-analytics', JSON.stringify(events));
    }
  };

  const handleLeadCaptureClose = () => {
    setShowLeadCapture(false);
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    
    // Track currency change analytics
    if (cookieConsent?.analytics) {
      const currencyEvent = {
        type: 'currency_change',
        timestamp: new Date().toISOString(),
        from: currency,
        to: newCurrency,
        scenario: selectedScenario
      };
      
      const events = JSON.parse(localStorage.getItem('catalyst-analytics') || '[]');
      events.push(currencyEvent);
      localStorage.setItem('catalyst-analytics', JSON.stringify(events));
    }
  };

  // Handle cookie consent
  const handleCookieConsent = (consent) => {
    setCookieConsent(consent);
    localStorage.setItem('catalyst-cookie-consent', JSON.stringify(consent));
    
    // Initialize analytics with new consent
    initAnalytics(consent);
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
            currency={currency}
            onCategoryChange={setSelectedCategory}
            onScenarioChange={setSelectedScenario}
            onInputChange={handleInputChange}
            onCurrencyChange={handleCurrencyChange}
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

      {/* Lead Capture Modal */}
      <LeadCapture
        isOpen={showLeadCapture}
        onClose={handleLeadCaptureClose}
        onSubmit={handleLeadCapture}
        calculationData={results}
      />
    </div>
  );
}

export default App;