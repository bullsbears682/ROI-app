import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Calculator from './components/Calculator'
import Results from './components/Results'
import Scenarios from './components/Scenarios'
import ApiDocs from './components/ApiDocs'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
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
  // Navigation state
  const [currentPage, setCurrentPage] = useState('calculator');

  // Admin state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

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

    // Check for existing admin session
    const adminAuth = sessionStorage.getItem('catalyst-admin-auth');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }

    // Check for admin access via URL
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      if (adminAuth === 'true') {
        setCurrentPage('admin');
        setIsAdminAuthenticated(true);
      } else {
        setShowAdminLogin(true);
      }
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

  // Calculate ROI using real market data from API
  const calculateROI = async () => {
    const scenario = roiScenarios[selectedScenario];
    if (!scenario) return;

    const { investment, timeframe } = calculationInputs;
    setIsLoading(true);

    try {
      // Try to use the real API first
      const apiResponse = await fetch('http://localhost:3001/api/roi/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'demo_key_enterprise_trial'
        },
        body: JSON.stringify({
          scenario: selectedScenario,
          investment,
          timeframe,
          industry: calculationInputs.industry || 'technology',
          companySize: calculationInputs.companySize || 'medium',
          currency
        })
      });

      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        
        // Use real API data with market-based calculations
        const results = {
          investment: investment,
          expectedReturns: apiData.results.projectedRevenue - investment,
          totalReturns: apiData.results.projectedRevenue,
          roiPercentage: apiData.results.roiPercentage,
          annualizedROI: (apiData.results.roiPercentage / timeframe) * 12,
          paybackMonths: apiData.results.paybackPeriod,
          successRate: apiData.results.successRate,
          riskLevel: apiData.results.riskLevel,
          confidence: apiData.results.confidence * 100,
          monthlyReturn: (apiData.results.projectedRevenue - investment) / timeframe,
          
          // Enhanced data from real market sources
          marketData: apiData.marketData,
          industryBenchmarks: apiData.benchmarks,
          dataQuality: apiData.marketData?.dataQuality || 'Real market data',
          
          // Original scenario data for reference
          scenarioName: scenario.description,
          timeframe,
          currency
        };

        setResults(results);
        console.log('✅ Using real market data from API:', results);
        return;
      }
    } catch (error) {
      console.warn('⚠️ API unavailable, using fallback calculations:', error.message);
    }

    // Fallback to local calculations if API is unavailable
    const investmentUSD = convertToUSD(investment, currency);
    const industryData = scenario.industryBenchmarks?.[calculationInputs.industry];
    const baseROI = industryData?.roi || (scenario.expectedROI.min + scenario.expectedROI.max) / 2;
    
    const expectedReturnsUSD = investmentUSD * (baseROI / 100);
    const totalReturnsUSD = investmentUSD + expectedReturnsUSD;
    const monthlyReturnUSD = expectedReturnsUSD / timeframe;
    const paybackMonths = investmentUSD / monthlyReturnUSD;

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
      investment: investment,
      expectedReturns: adjustedReturnsUSD,
      totalReturns: investmentUSD + adjustedReturnsUSD,
      roiPercentage: roiPercentage,
      annualizedROI: annualizedROI,
      paybackMonths: paybackMonths,
      successRate: successRate,
      riskLevel: scenario.riskLevel,
      confidence: 85, // Default confidence for fallback
      monthlyReturn: adjustedReturnsUSD / timeframe,
      
      // Indicate this is fallback data
      dataQuality: 'Estimated from scenario models',
      scenarioName: scenario.description,
      timeframe,
      currency,
      
      // Legacy fields for compatibility
      scenario: scenario,
      inputs: calculationInputs,
      investmentUSD: investmentUSD
    };

    setResults(calculatedResults);
    setIsLoading(false);
    setShowResults(true);

    // Track ROI calculation analytics
    trackROICalculation(scenario, calculationInputs, calculatedResults);

    // Show lead capture modal after a delay
    setTimeout(() => {
      setShowLeadCapture(true);
    }, 2000);

    console.log('⚠️ Using fallback calculations (API unavailable):', calculatedResults);

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

  // Handle navigation
  const handleNavigation = (page) => {
    setCurrentPage(page);
    // Track navigation
    if (cookieConsent?.analytics) {
      trackUserInteraction('navigation', { page, timestamp: Date.now() });
    }
  };

  // Handle scenario selection from Scenarios page
  const handleScenarioSelect = (scenarioKey, categoryKey) => {
    setSelectedScenario(scenarioKey);
    setSelectedCategory(categoryKey);
    setCurrentPage('calculator');
    setShowResults(false);
    // Track scenario selection
    if (cookieConsent?.analytics) {
      trackUserInteraction('scenario_select', { 
        scenario: scenarioKey, 
        category: categoryKey,
        source: 'scenarios_page',
        timestamp: Date.now() 
      });
    }
  };

  // Handle admin login
  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setShowAdminLogin(false);
    setCurrentPage('admin');
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('catalyst-admin-auth');
    setCurrentPage('calculator');
  };

  // Handle cookie consent
  const handleCookieConsent = (consent) => {
    setCookieConsent(consent);
    localStorage.setItem('catalyst-cookie-consent', JSON.stringify(consent));
    
    // Initialize analytics with new consent
    initAnalytics(consent);
  };

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'admin':
        return isAdminAuthenticated ? (
          <AdminDashboard onLogout={handleAdminLogout} />
        ) : null;
      case 'scenarios':
        return <Scenarios onSelectScenario={handleScenarioSelect} />;
      case 'api':
        return <ApiDocs />;
      case 'about':
        return (
          <div className="about-page">
            <div className="about-container">
              {/* Hero Section */}
              <section className="about-hero">
                <div className="hero-content">
                  <h1>About Catalyst ROI Calculator</h1>
                  <p className="hero-subtitle">
                    Enterprise-grade investment analysis powered by real market data from government sources
                  </p>
                </div>
              </section>

              {/* Mission Section */}
              <section className="about-section">
                <div className="section-content">
                  <h2>Our Mission</h2>
                  <p>
                    Catalyst transforms business investment decisions through accurate, data-driven ROI calculations. 
                    We bridge the gap between complex financial modeling and accessible business intelligence, 
                    empowering companies to make confident investment choices backed by real market data.
                  </p>
                </div>
              </section>

              {/* What Makes Us Different */}
              <section className="about-section">
                <div className="section-content">
                  <h2>What Makes Catalyst Different</h2>
                  <div className="features-grid">
                    <div className="feature-card">
                      <div className="feature-icon">📊</div>
                      <h3>Real Market Data</h3>
                      <p>
                        Our calculations are powered by live data from government sources including the 
                        US Bureau of Labor Statistics, Federal Reserve Economic Data (FRED), and World Bank Open Data.
                      </p>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon">🎯</div>
                      <h3>85 Proven Scenarios</h3>
                      <p>
                        From AI chatbots to CRM upgrades, our comprehensive scenario library covers 
                        14 business categories with validated ROI models and success rates.
                      </p>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon">🏛️</div>
                      <h3>Enterprise Ready</h3>
                      <p>
                        Built for scale with professional APIs, lead capture, analytics, multi-currency 
                        support, and comprehensive reporting capabilities.
                      </p>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon">🔒</div>
                      <h3>100% Legal Data</h3>
                      <p>
                        All market data comes from public domain government sources and open license 
                        international organizations - completely copyright-free.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Technology Stack */}
              <section className="about-section">
                <div className="section-content">
                  <h2>Built for Performance & Scale</h2>
                  <div className="tech-grid">
                    <div className="tech-category">
                      <h3>Frontend</h3>
                      <ul>
                        <li>React 19.1.1</li>
                        <li>Vite 7.0.6</li>
                        <li>Chart.js 4.5.0</li>
                        <li>Responsive Design</li>
                      </ul>
                    </div>
                    <div className="tech-category">
                      <h3>Backend API</h3>
                      <ul>
                        <li>Node.js & Express</li>
                        <li>SQLite Database</li>
                        <li>Real-time Market Data</li>
                        <li>Enterprise Security</li>
                      </ul>
                    </div>
                    <div className="tech-category">
                      <h3>Data Sources</h3>
                      <ul>
                        <li>US Bureau of Labor Statistics</li>
                        <li>Federal Reserve Economic Data</li>
                        <li>World Bank Open Data</li>
                        <li>European Central Bank</li>
                      </ul>
                    </div>
                    <div className="tech-category">
                      <h3>Business Features</h3>
                      <ul>
                        <li>PDF Report Generation</li>
                        <li>Lead Capture & CRM</li>
                        <li>Multi-currency Support</li>
                        <li>Usage Analytics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Use Cases */}
              <section className="about-section">
                <div className="section-content">
                  <h2>Perfect For</h2>
                  <div className="use-cases">
                    <div className="use-case">
                      <h3>🏢 Enterprise Sales Teams</h3>
                      <p>Demonstrate clear ROI to prospects with government-backed data and professional reports</p>
                    </div>
                    <div className="use-case">
                      <h3>📈 Business Consultants</h3>
                      <p>Provide clients with credible investment analysis and detailed market research</p>
                    </div>
                    <div className="use-case">
                      <h3>💼 Investment Firms</h3>
                      <p>Evaluate portfolio companies and investment opportunities with real market benchmarks</p>
                    </div>
                    <div className="use-case">
                      <h3>🚀 SaaS Platforms</h3>
                      <p>White-label the calculator into your platform or use the API for custom integrations</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Company Info */}
              <section className="about-section">
                <div className="section-content">
                  <h2>About the Platform</h2>
                  <div className="company-stats">
                    <div className="stat">
                      <div className="stat-number">85</div>
                      <div className="stat-label">ROI Scenarios</div>
                    </div>
                    <div className="stat">
                      <div className="stat-number">14</div>
                      <div className="stat-label">Business Categories</div>
                    </div>
                    <div className="stat">
                      <div className="stat-number">5</div>
                      <div className="stat-label">Government Data Sources</div>
                    </div>
                    <div className="stat">
                      <div className="stat-number">100%</div>
                      <div className="stat-label">Legal & Free Data</div>
                    </div>
                  </div>
                  <p className="company-description">
                    Catalyst was built with a focus on accuracy, compliance, and enterprise scalability. 
                    Every calculation is backed by real market data from trusted government sources, 
                    ensuring your investment decisions are based on the most reliable information available.
                  </p>
                </div>
              </section>

              {/* CTA Section */}
              <section className="about-cta">
                <div className="cta-content">
                  <h2>Ready to Transform Your Investment Analysis?</h2>
                  <p>Join thousands of businesses making smarter investment decisions with Catalyst</p>
                  <div className="cta-buttons">
                    <button 
                      className="btn btn-primary btn-large"
                      onClick={() => window.location.href = '/#/calculator'}
                    >
                      Try Calculator Now
                    </button>
                    <button 
                      className="btn btn-secondary btn-large"
                      onClick={() => window.location.href = '/#/api'}
                    >
                      View API Documentation
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );
      default:
        return (
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
        );
    }
  };

  return (
    <div className="app">
      {/* Show admin login if needed */}
      {showAdminLogin && (
        <AdminLogin onLogin={handleAdminLogin} />
      )}

      {/* Only show header for non-admin pages */}
      {currentPage !== 'admin' && (
        <Header 
          currentPage={currentPage} 
          onNavigate={handleNavigation}
        />
      )}
      
      {renderCurrentPage()}

      {/* Cookie consent banner */}
      {cookieConsent === null && currentPage !== 'admin' && (
        <CookieConsent onConsent={handleCookieConsent} />
      )}

      {/* Lead Capture Modal */}
      {currentPage !== 'admin' && (
        <LeadCapture
          isOpen={showLeadCapture}
          onClose={handleLeadCaptureClose}
          onSubmit={handleLeadCapture}
          calculationData={results}
        />
      )}
    </div>
  );
}

export default App;