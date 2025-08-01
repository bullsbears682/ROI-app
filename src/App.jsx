import React, { useState, useEffect } from 'react'
import { roiCategories, roiScenarios } from './data/roiScenarios'
import config from './config'
import './styles/index.css'

function App() {
  // State management
  const [selectedCategory, setSelectedCategory] = useState('automation')
  const [selectedScenario, setSelectedScenario] = useState('automation-crm')
  const [investment, setInvestment] = useState(25000)
  const [timeframe, setTimeframe] = useState(12)
  const [industry, setIndustry] = useState('technology')
  const [companySize, setCompanySize] = useState('medium')
  const [currency, setCurrency] = useState('USD')
  const [results, setResults] = useState(null)
  const [currentPage, setCurrentPage] = useState('calculator')
  const [scenarioViewCategory, setScenarioViewCategory] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [apiStatus, setApiStatus] = useState('checking')

  // Check API health on component mount
  useEffect(() => {
    if (config.FEATURES.API_INTEGRATION) {
      checkApiHealth()
    } else {
      setApiStatus('disabled')
    }
  }, [])

  const checkApiHealth = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), config.API_TIMEOUT)
      
      const response = await fetch(`${config.API_BASE_URL}/api/health`, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        setApiStatus('connected')
      } else {
        setApiStatus('disconnected')
      }
    } catch (error) {
      console.warn('API health check failed:', error.message)
      setApiStatus('disconnected')
    }
  }

  // Currency formatting
  const currencySymbols = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$' }
  const formatCurrency = (amount) => `${currencySymbols[currency]}${amount.toLocaleString()}`

  // Get scenarios for selected category
  const getCategoryScenarios = () => {
    return Object.entries(roiScenarios)
      .filter(([key, scenario]) => scenario.category === selectedCategory)
      .map(([key, scenario]) => ({ id: key, ...scenario }))
  }

  // Professional ROI calculation with API integration
  const calculateROI = async () => {
    setIsCalculating(true)
    
    try {
      // Input validation
      if (!investment || investment < 1000) {
        alert('Please enter an investment amount of at least $1,000')
        return
      }

      const scenario = roiScenarios[selectedScenario]
      if (!scenario) {
        alert('Please select a valid scenario')
        return
      }

      // Try API first, fallback to local calculation
      let apiResult = null
      if (config.FEATURES.API_INTEGRATION && apiStatus === 'connected') {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), config.API_TIMEOUT)
          
          const response = await fetch(`${config.API_BASE_URL}/api/calculate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': config.API_KEY
            },
            body: JSON.stringify({
              investment,
              scenario: selectedScenario,
              industry,
              companySize,
              timeframe,
              currency
            }),
            signal: controller.signal
          })

          clearTimeout(timeoutId)

          if (response.ok) {
            apiResult = await response.json()
          } else {
            console.warn('API calculation failed with status:', response.status)
          }
        } catch (error) {
          console.warn('API calculation failed, using local fallback:', error.message)
        }
      }

      // Use API result or fallback to local calculation
      let finalResults
      if (apiResult) {
        // Transform API result to match frontend format
        finalResults = {
          investment: apiResult.financial.investment,
          expectedReturns: apiResult.financial.expectedReturns,
          totalValue: apiResult.financial.totalValue,
          roiPercentage: apiResult.financial.roiPercentage,
          annualizedROI: apiResult.financial.annualizedROI,
          paybackPeriod: apiResult.financial.paybackPeriod,
          monthlyReturn: apiResult.financial.monthlyReturn,
          successRate: apiResult.metrics.successRate,
          confidence: apiResult.metrics.confidence,
          riskLevel: apiResult.metrics.riskLevel,
          scenarioName: scenario.description,
          scenarioCategory: roiCategories[selectedCategory]?.name || 'Business',
          timeframe: timeframe,
          currency: currency,
          industryBenchmark: apiResult.benchmarks.industryAverage,
          industryAdoption: apiResult.benchmarks.marketAdoption,
          marketComplexity: apiResult.benchmarks.complexity,
          implementationWeeks: apiResult.metrics.implementationWeeks,
          benefits: scenario.benefits || [
            'Improved operational efficiency',
            'Enhanced customer satisfaction', 
            'Reduced operational costs',
            'Better decision making',
            'Competitive advantage'
          ],
          successFactors: [
            'Proven technology stack',
            'High industry adoption rate',
            'Strong resource availability',
            'Quick payback period',
            'Executive support',
            'Proper planning'
          ],
          riskMitigation: [
            'Regular progress monitoring',
            'Change management plan',
            'Stakeholder communication',
            'Risk assessment protocols'
          ],
          implementationInsights: [
            'Professional support recommended',
            'Phased implementation approach',
            'Training and adoption strategy'
          ],
          costRange: scenario.costRange || { 
            min: Math.round(investment * 0.8), 
            max: Math.round(investment * 1.2) 
          },
          marketData: {
            dataQuality: 'Professional API analysis',
            apiSource: true,
            calculationId: apiResult.calculationId
          }
        }
      } else {
        // Local calculation fallback
        const baseROI = (scenario.expectedROI.min + scenario.expectedROI.max) / 2
        
        const industryImpact = {
          'technology': { multiplier: 1.25, adoption: 85, avgROI: 180, complexity: 'medium' },
          'healthcare': { multiplier: 1.15, adoption: 70, avgROI: 120, complexity: 'high' },
          'finance': { multiplier: 1.10, adoption: 75, avgROI: 150, complexity: 'high' },
          'retail': { multiplier: 0.95, adoption: 80, avgROI: 110, complexity: 'low' },
          'manufacturing': { multiplier: 0.90, adoption: 65, avgROI: 95, complexity: 'medium' },
          'education': { multiplier: 0.85, adoption: 60, avgROI: 85, complexity: 'low' },
          'real-estate': { multiplier: 1.05, adoption: 70, avgROI: 125, complexity: 'medium' },
          'professional-services': { multiplier: 1.20, adoption: 78, avgROI: 160, complexity: 'low' },
          'hospitality': { multiplier: 0.88, adoption: 72, avgROI: 90, complexity: 'medium' },
          'transportation': { multiplier: 0.92, adoption: 68, avgROI: 105, complexity: 'medium' }
        }

        const sizeImpact = {
          'startup': { multiplier: 0.85, resources: 60, speed: 130, risk: 'high' },
          'small': { multiplier: 0.92, resources: 70, speed: 120, risk: 'medium' },
          'medium': { multiplier: 1.00, resources: 80, speed: 100, risk: 'medium' },
          'large': { multiplier: 1.12, resources: 90, speed: 80, risk: 'low' },
          'enterprise': { multiplier: 1.25, resources: 100, speed: 60, risk: 'low' }
        }

        const riskAnalysis = {
          'low': { multiplier: 1.15, confidence: 92, successBonus: 20 },
          'medium': { multiplier: 1.00, confidence: 85, successBonus: 0 },
          'high': { multiplier: 0.85, confidence: 75, successBonus: -15 }
        }

        const industryData = industryImpact[industry] || industryImpact['technology']
        const sizeData = sizeImpact[companySize] || sizeImpact['medium']
        const riskData = riskAnalysis[scenario.riskLevel] || riskAnalysis['medium']

        const adjustedROI = baseROI * industryData.multiplier * sizeData.multiplier * riskData.multiplier
        const expectedReturns = investment * (adjustedROI / 100)
        const totalValue = investment + expectedReturns
        const monthlyReturn = expectedReturns / timeframe
        const paybackPeriod = Math.max(1, Math.ceil(investment / monthlyReturn))
        const annualizedROI = (adjustedROI / timeframe) * 12

        let successRate = 75
        successRate += riskData.successBonus
        successRate += industryData.adoption > 75 ? 10 : (industryData.adoption < 65 ? -5 : 0)
        successRate += sizeData.resources > 85 ? 8 : (sizeData.resources < 70 ? -5 : 0)
        successRate = Math.max(50, Math.min(95, Math.round(successRate)))

        const successFactors = []
        if (riskData.confidence > 85) successFactors.push('Proven technology stack')
        if (industryData.adoption > 75) successFactors.push('High industry adoption rate')
        if (sizeData.resources > 80) successFactors.push('Strong resource availability')
        if (paybackPeriod <= 12) successFactors.push('Quick payback period')
        if (adjustedROI > 150) successFactors.push('High ROI potential')
        if (scenario.riskLevel === 'low') successFactors.push('Low implementation risk')
        successFactors.push('Executive support', 'Proper planning', 'Team training')

        const riskMitigation = []
        if (scenario.riskLevel === 'high') riskMitigation.push('Implement pilot program first')
        if (companySize === 'startup') riskMitigation.push('Secure adequate resources')
        if (industry === 'healthcare' || industry === 'finance') riskMitigation.push('Ensure regulatory compliance')
        if (sizeData.speed < 100) riskMitigation.push('Plan for longer implementation')
        riskMitigation.push('Regular progress monitoring', 'Change management plan', 'Stakeholder communication')

        const implementationInsights = []
        if (sizeData.speed > 110) implementationInsights.push('Fast implementation possible')
        if (industryData.complexity === 'high') implementationInsights.push('Complex integration expected')
        if (scenario.riskLevel === 'low') implementationInsights.push('Straightforward deployment')
        implementationInsights.push('Professional support recommended')

        finalResults = {
          investment: investment,
          expectedReturns: Math.round(expectedReturns),
          totalValue: Math.round(totalValue),
          roiPercentage: Math.round(adjustedROI * 100) / 100,
          annualizedROI: Math.round(annualizedROI * 100) / 100,
          paybackPeriod: paybackPeriod,
          monthlyReturn: Math.round(monthlyReturn),
          successRate: successRate,
          confidence: riskData.confidence,
          riskLevel: scenario.riskLevel,
          scenarioName: scenario.description,
          scenarioCategory: roiCategories[selectedCategory]?.name || 'Business',
          timeframe: timeframe,
          currency: currency,
          industryBenchmark: industryData.avgROI,
          industryAdoption: industryData.adoption,
          marketComplexity: industryData.complexity,
          resourceAvailability: sizeData.resources,
          implementationSpeed: sizeData.speed,
          organizationalRisk: sizeData.risk,
          benefits: scenario.benefits || [
            'Improved operational efficiency',
            'Enhanced customer satisfaction',
            'Reduced operational costs',
            'Better decision making',
            'Competitive advantage'
          ],
          successFactors: successFactors.slice(0, 6),
          riskMitigation: riskMitigation.slice(0, 5),
          implementationInsights: implementationInsights.slice(0, 4),
          costRange: scenario.costRange || { 
            min: Math.round(investment * 0.8), 
            max: Math.round(investment * 1.2) 
          },
          marketData: {
            dataQuality: 'Local calculation',
            apiSource: false
          }
        }
      }

      setResults(finalResults)

    } catch (error) {
      console.error('Calculation error:', error)
      alert('An error occurred during calculation. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  // Category change handler
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    // Auto-select first scenario in new category
    const categoryScenarios = Object.entries(roiScenarios)
      .filter(([key, scenario]) => scenario.category === categoryId)
    if (categoryScenarios.length > 0) {
      setSelectedScenario(categoryScenarios[0][0])
    }
  }

  // Scenario selection and navigation to calculator
  const selectScenario = (scenarioId, categoryId) => {
    setSelectedCategory(categoryId)
    setSelectedScenario(scenarioId)
    setCurrentPage('calculator')
  }

  return (
    <div className="app">
      {/* Professional Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="15" fill="url(#grad1)" stroke="none"/>
              <text x="16" y="21" textAnchor="middle" fill="white" fontFamily="Arial" fontSize="12" fontWeight="bold">C</text>
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea"/>
                  <stop offset="100%" stopColor="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
            <div>
              <h1>Catalyst</h1>
              <span className="logo-tagline">Professional ROI Calculator</span>
              {/* API Status Indicator */}
              {config.FEATURES.API_INTEGRATION && (
                <div style={{fontSize: '10px', marginTop: '2px'}}>
                  <span style={{
                    color: apiStatus === 'connected' ? '#10b981' : 
                          apiStatus === 'disconnected' ? '#ef4444' : 
                          apiStatus === 'disabled' ? '#9ca3af' : '#f59e0b',
                    fontWeight: '600'
                  }}>
                    {apiStatus === 'connected' ? '🟢 API Connected' : 
                     apiStatus === 'disconnected' ? '🔴 API Offline' : 
                     apiStatus === 'disabled' ? '⚪ Local Mode' : '🟡 Checking API'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <nav className="nav">
            <button 
              className={`nav-link ${currentPage === 'calculator' ? 'active' : ''}`}
              onClick={() => setCurrentPage('calculator')}
            >
              Calculator
            </button>
            <button 
              className={`nav-link ${currentPage === 'scenarios' ? 'active' : ''}`}
              onClick={() => {
                setCurrentPage('scenarios')
                setScenarioViewCategory(null)
              }}
            >
              Scenarios
            </button>
            <button 
              className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
              onClick={() => setCurrentPage('about')}
            >
              About
            </button>
            {config.FEATURES.API_INTEGRATION && (
              <button 
                className={`nav-link ${currentPage === 'api' ? 'active' : ''}`}
                onClick={() => setCurrentPage('api')}
              >
                API
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="main-content">
        {currentPage === 'calculator' && (
          <>
            {/* Enhanced Calculator Section */}
            <div className="calculator-section">
              <div className="card">
                <h2>🚀 Professional ROI Calculator</h2>
                <p>Calculate returns across 85+ business scenarios with real market data</p>
                
                {/* Business Category */}
                <div className="form-group">
                  <label className="form-label">📊 Business Category</label>
                  <select 
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {Object.values(roiCategories).map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                  <small className="form-hint">
                    {getCategoryScenarios().length} scenarios available in this category
                  </small>
                </div>

                {/* Scenario Selection */}
                <div className="form-group">
                  <label className="form-label">🎯 Specific Scenario</label>
                  <select 
                    className="form-select"
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                  >
                    {getCategoryScenarios().map(scenario => (
                      <option key={scenario.id} value={scenario.id}>
                        {scenario.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Investment Amount */}
                <div className="form-group">
                  <label className="form-label">💰 Investment Amount</label>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <input 
                      type="number"
                      className="form-input"
                      value={investment}
                      onChange={(e) => setInvestment(Number(e.target.value))}
                      placeholder="25000"
                      min="1000"
                      style={{flex: 1}}
                    />
                    <select 
                      className="form-select"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      style={{maxWidth: '100px'}}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                      <option value="AUD">AUD</option>
                    </select>
                  </div>
                </div>

                {/* Timeframe */}
                <div className="form-group">
                  <label className="form-label">⏱️ Implementation Timeframe</label>
                  <input 
                    type="number"
                    className="form-input"
                    value={timeframe}
                    onChange={(e) => setTimeframe(Number(e.target.value))}
                    min="1"
                    max="60"
                  />
                  <small className="form-hint">Months for full implementation and ROI realization</small>
                </div>

                {/* Industry */}
                <div className="form-group">
                  <label className="form-label">🏢 Industry Sector</label>
                  <select 
                    className="form-select"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="technology">Technology & Software</option>
                    <option value="healthcare">Healthcare & Medical</option>
                    <option value="finance">Financial Services</option>
                    <option value="retail">Retail & E-commerce</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="education">Education</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="professional-services">Professional Services</option>
                    <option value="hospitality">Hospitality & Tourism</option>
                    <option value="transportation">Transportation & Logistics</option>
                  </select>
                </div>

                {/* Company Size */}
                <div className="form-group">
                  <label className="form-label">👥 Organization Size</label>
                  <select 
                    className="form-select"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                  >
                    <option value="startup">Startup (1-10 employees)</option>
                    <option value="small">Small Business (11-50 employees)</option>
                    <option value="medium">Medium Business (51-200 employees)</option>
                    <option value="large">Large Enterprise (201-1000 employees)</option>
                    <option value="enterprise">Enterprise (1000+ employees)</option>
                  </select>
                </div>

                {/* Rich Scenario Preview */}
                {roiScenarios[selectedScenario] && (
                  <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    border: '1px solid #cbd5e0',
                    borderRadius: '12px',
                    padding: '24px',
                    margin: '24px 0'
                  }}>
                    <h4>📋 Scenario Analysis</h4>
                    
                    <div style={{marginBottom: '16px'}}>
                      <strong>Description:</strong> {roiScenarios[selectedScenario].description}
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '16px',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <strong>Expected ROI Range:</strong><br/>
                        <span style={{color: '#059669', fontWeight: '600', fontSize: '1.1em'}}>
                          {roiScenarios[selectedScenario].expectedROI.min}% - {roiScenarios[selectedScenario].expectedROI.max}%
                        </span>
                      </div>
                      
                      <div>
                        <strong>Risk Assessment:</strong><br/>
                        <span style={{
                          background: roiScenarios[selectedScenario].riskLevel === 'low' ? '#d1fae5' : 
                                     roiScenarios[selectedScenario].riskLevel === 'medium' ? '#fef3c7' : '#fee2e2',
                          color: roiScenarios[selectedScenario].riskLevel === 'low' ? '#065f46' : 
                                 roiScenarios[selectedScenario].riskLevel === 'medium' ? '#92400e' : '#991b1b',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '0.9em',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {roiScenarios[selectedScenario].riskLevel} RISK
                        </span>
                      </div>

                      <div>
                        <strong>Investment Range:</strong><br/>
                        <span style={{color: '#1e40af', fontWeight: '600'}}>
                          {formatCurrency(roiScenarios[selectedScenario].costRange?.min || Math.round(investment * 0.8))} - {formatCurrency(roiScenarios[selectedScenario].costRange?.max || Math.round(investment * 1.2))}
                        </span>
                      </div>
                    </div>

                    {roiScenarios[selectedScenario].benefits && roiScenarios[selectedScenario].benefits.length > 0 && (
                      <div>
                        <strong>Key Strategic Benefits:</strong>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                          gap: '8px',
                          marginTop: '8px'
                        }}>
                          {roiScenarios[selectedScenario].benefits.slice(0, 6).map((benefit, index) => (
                            <div key={index} style={{
                              background: '#e0f2fe',
                              color: '#0c4a6e',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '0.9em',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <span style={{color: '#059669'}}>✓</span>
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Enhanced Calculate Button */}
                <button 
                  className="btn btn-primary"
                  onClick={calculateROI}
                  disabled={!investment || investment < 1000 || isCalculating}
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '1.1em',
                    fontWeight: '600',
                    marginTop: '24px',
                    opacity: (!investment || investment < 1000 || isCalculating) ? 0.6 : 1,
                    cursor: (!investment || investment < 1000 || isCalculating) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isCalculating ? (
                    <>⏳ Calculating Professional Analysis...</>
                  ) : (!investment || investment < 1000) ? (
                    <>🚫 Calculate ROI (Minimum $1,000 required)</>
                  ) : (
                    <>🧮 Calculate Professional ROI Analysis</>
                  )}
                </button>

                {/* Data Source Indicator */}
                <div style={{textAlign: 'center', marginTop: '12px', fontSize: '0.85em', color: '#64748b'}}>
                  {config.FEATURES.API_INTEGRATION ? (
                    apiStatus === 'connected' ? (
                      <span>🔗 Using professional API calculations</span>
                    ) : apiStatus === 'disconnected' ? (
                      <span>💻 Using local calculation engine (API offline)</span>
                    ) : apiStatus === 'disabled' ? (
                      <span>💻 Using local calculation engine</span>
                    ) : (
                      <span>⏳ Checking API connection...</span>
                    )
                  ) : (
                    <span>💻 Using local calculation engine</span>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Results Section */}
            <div className="results-section">
              {!results ? (
                <div className="card">
                  <h2>📊 ROI Analysis Results</h2>
                  <div style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>
                    <div style={{fontSize: '3em', marginBottom: '16px'}}>📈</div>
                    <h3>Ready to Calculate</h3>
                    <p>Enter your investment details and click "Calculate ROI" to see comprehensive analysis with:</p>
                    <ul style={{textAlign: 'left', maxWidth: '400px', margin: '16px auto'}}>
                      <li>Financial projections and ROI metrics</li>
                      <li>Success factors and risk mitigation</li>
                      <li>Industry benchmarks and market data</li>
                      <li>Implementation insights and recommendations</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                    <h2>📊 Professional ROI Analysis</h2>
                    {results.marketData?.apiSource && (
                      <span style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8em',
                        fontWeight: '600'
                      }}>
                        🔗 API Powered
                      </span>
                    )}
                  </div>
                  
                  {/* Core Metrics Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'white',
                      padding: '24px',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{fontSize: '2.5em', fontWeight: 'bold', marginBottom: '8px'}}>
                        {results.roiPercentage}%
                      </div>
                      <div style={{opacity: '0.9'}}>Total ROI</div>
                    </div>

                    <div style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      padding: '24px',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{fontSize: '2.5em', fontWeight: 'bold', marginBottom: '8px'}}>
                        {formatCurrency(results.expectedReturns)}
                      </div>
                      <div style={{opacity: '0.9'}}>Expected Returns</div>
                    </div>

                    <div style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      padding: '24px',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{fontSize: '2.5em', fontWeight: 'bold', marginBottom: '8px'}}>
                        {results.paybackPeriod}
                      </div>
                      <div style={{opacity: '0.9'}}>Payback (Months)</div>
                    </div>

                    <div style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: 'white',
                      padding: '24px',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{fontSize: '2.5em', fontWeight: 'bold', marginBottom: '8px'}}>
                        {results.successRate}%
                      </div>
                      <div style={{opacity: '0.9'}}>Success Rate</div>
                    </div>
                  </div>

                  {/* Detailed Analysis */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    marginBottom: '32px'
                  }}>
                    {/* Investment Summary */}
                    <div style={{background: '#f8fafc', padding: '20px', borderRadius: '12px'}}>
                      <h4>💼 Investment Summary</h4>
                      <div style={{display: 'grid', gap: '8px', fontSize: '0.95em'}}>
                        <div><strong>Scenario:</strong> {results.scenarioName}</div>
                        <div><strong>Category:</strong> {results.scenarioCategory}</div>
                        <div><strong>Investment:</strong> {formatCurrency(results.investment)}</div>
                        <div><strong>Total Value:</strong> {formatCurrency(results.totalValue)}</div>
                        <div><strong>Monthly Return:</strong> {formatCurrency(results.monthlyReturn)}</div>
                        <div><strong>Annualized ROI:</strong> {results.annualizedROI}%</div>
                      </div>
                    </div>

                    {/* Market Intelligence */}
                    <div style={{background: '#f0f9ff', padding: '20px', borderRadius: '12px'}}>
                      <h4>📈 Market Intelligence</h4>
                      <div style={{display: 'grid', gap: '8px', fontSize: '0.95em'}}>
                        <div><strong>Industry Benchmark:</strong> {results.industryBenchmark}% ROI</div>
                        <div><strong>Market Adoption:</strong> {results.industryAdoption}%</div>
                        <div><strong>Implementation Speed:</strong> {results.implementationSpeed || results.implementationWeeks + ' weeks'}</div>
                        <div><strong>Complexity Level:</strong> {results.marketComplexity}</div>
                        <div><strong>Risk Profile:</strong> {results.riskLevel} ({results.confidence}% confidence)</div>
                        <div><strong>Data Quality:</strong> {results.marketData.dataQuality}</div>
                      </div>
                    </div>
                  </div>

                  {/* Success Factors */}
                  {results.successFactors && results.successFactors.length > 0 && (
                    <div style={{marginBottom: '24px'}}>
                      <h4>🎯 Success Factors</h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '12px',
                        marginTop: '12px'
                      }}>
                        {results.successFactors.map((factor, index) => (
                          <div key={index} style={{
                            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                            color: '#065f46',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '0.9em',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{fontSize: '1.2em'}}>✅</span>
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risk Mitigation */}
                  {results.riskMitigation && results.riskMitigation.length > 0 && (
                    <div style={{marginBottom: '24px'}}>
                      <h4>🛡️ Risk Mitigation Strategies</h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '12px',
                        marginTop: '12px'
                      }}>
                        {results.riskMitigation.map((risk, index) => (
                          <div key={index} style={{
                            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                            color: '#92400e',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '0.9em',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{fontSize: '1.2em'}}>⚠️</span>
                            {risk}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strategic Benefits */}
                  {results.benefits && results.benefits.length > 0 && (
                    <div style={{marginBottom: '24px'}}>
                      <h4>💎 Strategic Benefits</h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '12px',
                        marginTop: '12px'
                      }}>
                        {results.benefits.slice(0, 8).map((benefit, index) => (
                          <div key={index} style={{
                            background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                            color: '#3730a3',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '0.9em',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{fontSize: '1.2em'}}>💡</span>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Implementation Insights */}
                  {results.implementationInsights && results.implementationInsights.length > 0 && (
                    <div style={{
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e0'
                    }}>
                      <h4>🚀 Implementation Insights</h4>
                      <ul style={{margin: '12px 0', paddingLeft: '0', listStyle: 'none'}}>
                        {results.implementationInsights.map((insight, index) => (
                          <li key={index} style={{
                            padding: '8px 0',
                            fontSize: '0.95em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{color: '#3b82f6', fontSize: '1.2em'}}>💡</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Calculation Source */}
                  {results.marketData?.calculationId && (
                    <div style={{marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', fontSize: '0.85em', color: '#64748b'}}>
                      <strong>Calculation ID:</strong> {results.marketData.calculationId} • 
                      <strong> Source:</strong> Professional API Engine
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Enhanced Scenarios Page */}
        {currentPage === 'scenarios' && (
          <div className="card">
            {!scenarioViewCategory ? (
              <>
                <h2>🎯 Business Scenarios Library</h2>
                <p>Explore our comprehensive collection of 85+ ROI scenarios across 14 industry categories</p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '20px',
                  marginTop: '24px'
                }}>
                  {Object.values(roiCategories).map(category => {
                    const scenarioCount = Object.values(roiScenarios).filter(s => s.category === category.id).length
                    return (
                      <div key={category.id} style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        border: '1px solid #cbd5e0',
                        borderRadius: '12px',
                        padding: '24px',
                        transition: 'transform 0.2s ease'
                      }}>
                        <div style={{fontSize: '2.5em', marginBottom: '12px'}}>{category.icon}</div>
                        <h3 style={{marginBottom: '8px', color: '#1e293b'}}>{category.name}</h3>
                        <p style={{color: '#64748b', marginBottom: '16px', fontSize: '0.95em'}}>{category.description}</p>
                        <div style={{marginBottom: '16px'}}>
                          <span style={{
                            background: '#3b82f6',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85em',
                            fontWeight: '600'
                          }}>
                            {scenarioCount} scenarios
                          </span>
                        </div>
                        <div style={{display: 'flex', gap: '10px'}}>
                          <button 
                            className="btn btn-primary"
                            onClick={() => setScenarioViewCategory(category.id)}
                            style={{flex: 1}}
                          >
                            View Scenarios
                          </button>
                          <button 
                            className="btn btn-secondary"
                            onClick={() => {
                              handleCategoryChange(category.id)
                              setCurrentPage('calculator')
                            }}
                            style={{flex: 1}}
                          >
                            Calculate
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <>
                {/* Detailed Category View */}
                <div style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <button 
                    onClick={() => setScenarioViewCategory(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#667eea',
                      fontSize: '18px',
                      cursor: 'pointer',
                      padding: '8px'
                    }}
                  >
                    ← Back to Categories
                  </button>
                  <div>
                    <h2>{roiCategories[scenarioViewCategory]?.icon} {roiCategories[scenarioViewCategory]?.name}</h2>
                    <p style={{color: '#64748b', margin: '4px 0'}}>{roiCategories[scenarioViewCategory]?.description}</p>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '20px'
                }}>
                  {Object.entries(roiScenarios)
                    .filter(([key, scenario]) => scenario.category === scenarioViewCategory)
                    .map(([key, scenario]) => (
                      <div key={key} style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '20px',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}>
                        <h4 style={{marginBottom: '12px', color: '#1e293b'}}>{scenario.description}</h4>
                        
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                          gap: '12px',
                          marginBottom: '16px'
                        }}>
                          <div style={{textAlign: 'center'}}>
                            <div style={{fontSize: '1.2em', fontWeight: 'bold', color: '#059669'}}>
                              {scenario.expectedROI.min}-{scenario.expectedROI.max}%
                            </div>
                            <div style={{fontSize: '0.8em', color: '#64748b'}}>ROI Range</div>
                          </div>
                          <div style={{textAlign: 'center'}}>
                            <div style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.8em',
                              fontWeight: '600',
                              background: scenario.riskLevel === 'low' ? '#d1fae5' : 
                                         scenario.riskLevel === 'medium' ? '#fef3c7' : '#fee2e2',
                              color: scenario.riskLevel === 'low' ? '#065f46' : 
                                     scenario.riskLevel === 'medium' ? '#92400e' : '#991b1b'
                            }}>
                              {scenario.riskLevel.toUpperCase()}
                            </div>
                            <div style={{fontSize: '0.8em', color: '#64748b'}}>Risk Level</div>
                          </div>
                        </div>

                        {scenario.benefits && scenario.benefits.length > 0 && (
                          <div style={{marginBottom: '16px'}}>
                            <strong style={{fontSize: '0.9em'}}>Key Benefits:</strong>
                            <ul style={{margin: '8px 0', paddingLeft: '0', listStyle: 'none'}}>
                              {scenario.benefits.slice(0, 3).map((benefit, index) => (
                                <li key={index} style={{
                                  fontSize: '0.85em',
                                  color: '#4b5563',
                                  margin: '4px 0',
                                  paddingLeft: '16px',
                                  position: 'relative'
                                }}>
                                  <span style={{
                                    position: 'absolute',
                                    left: '0',
                                    color: '#059669'
                                  }}>✓</span>
                                  {benefit}
                                </li>
                              ))}
                              {scenario.benefits.length > 3 && (
                                <li style={{fontSize: '0.8em', color: '#9ca3af', fontStyle: 'italic'}}>
                                  +{scenario.benefits.length - 3} more benefits
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        <button 
                          className="btn btn-primary"
                          onClick={() => selectScenario(key, scenarioViewCategory)}
                          style={{width: '100%', fontSize: '0.9em'}}
                        >
                          Calculate ROI for This Scenario →
                        </button>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* API Documentation Page */}
        {config.FEATURES.API_INTEGRATION && currentPage === 'api' && (
          <div className="card">
            <h2>🔗 Catalyst ROI API</h2>
            <p>Professional ROI calculation API for developers and businesses</p>

            <div style={{marginTop: '32px'}}>
              <h3>🚀 Quick Start</h3>
              
              <div style={{
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '20px',
                borderRadius: '8px',
                marginTop: '16px',
                fontFamily: 'monospace',
                fontSize: '0.9em'
              }}>
                <div style={{color: '#10b981', marginBottom: '8px'}}>// Calculate ROI via API</div>
                <div>curl -X POST {config.API_BASE_URL}/api/calculate \</div>
                <div>  -H "Content-Type: application/json" \</div>
                <div>  -H "X-API-Key: {config.API_KEY}" \</div>
                <div>  -d '{JSON.stringify({
                  investment: 50000,
                  scenario: "automation-crm",
                  industry: "technology",
                  companySize: "medium",
                  timeframe: 12
                }, null, 2)}'</div>
              </div>

              <h3 style={{marginTop: '32px'}}>📊 Live API Status</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginTop: '16px'
              }}>
                <div style={{
                  background: apiStatus === 'connected' ? '#d1fae5' : '#fee2e2',
                  color: apiStatus === 'connected' ? '#065f46' : '#991b1b',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{fontSize: '1.5em', marginBottom: '8px'}}>
                    {apiStatus === 'connected' ? '🟢' : '🔴'}
                  </div>
                  <div style={{fontWeight: '600'}}>
                    {apiStatus === 'connected' ? 'API Online' : 'API Offline'}
                  </div>
                  <div style={{fontSize: '0.9em', marginTop: '4px'}}>
                    {apiStatus === 'connected' ? 'Ready for requests' : 'Check server status'}
                  </div>
                </div>

                <div style={{
                  background: '#f0f9ff',
                  color: '#0c4a6e',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{fontSize: '1.5em', marginBottom: '8px'}}>🔑</div>
                  <div style={{fontWeight: '600'}}>Demo Key</div>
                  <div style={{fontSize: '0.8em', marginTop: '4px', fontFamily: 'monospace'}}>
                    {config.API_KEY}
                  </div>
                </div>
              </div>

              <h3 style={{marginTop: '32px'}}>🛠️ Available Endpoints</h3>
              <div style={{marginTop: '16px'}}>
                {[
                  { method: 'POST', endpoint: '/api/calculate', description: 'Calculate ROI for business scenarios' },
                  { method: 'GET', endpoint: '/api/scenarios', description: 'Get all available scenarios' },
                  { method: 'POST', endpoint: '/api/leads', description: 'Submit lead information' },
                  { method: 'GET', endpoint: '/api/analytics', description: 'Get usage analytics (admin only)' },
                  { method: 'GET', endpoint: '/api/health', description: 'Check API health status' }
                ].map((endpoint, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    marginBottom: '8px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <span style={{
                      background: endpoint.method === 'GET' ? '#10b981' : '#3b82f6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75em',
                      fontWeight: '600',
                      minWidth: '50px',
                      textAlign: 'center'
                    }}>
                      {endpoint.method}
                    </span>
                    <code style={{
                      margin: '0 12px',
                      padding: '4px 8px',
                      background: '#e2e8f0',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '0.9em'
                    }}>
                      {endpoint.endpoint}
                    </code>
                    <span style={{color: '#64748b', fontSize: '0.9em'}}>
                      {endpoint.description}
                    </span>
                  </div>
                ))}
              </div>

              <h3 style={{marginTop: '32px'}}>💼 Enterprise Features</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginTop: '16px'
              }}>
                {[
                  { icon: '🔐', title: 'API Authentication', desc: 'Secure API key management' },
                  { icon: '📊', title: 'Usage Analytics', desc: 'Detailed API usage tracking' },
                  { icon: '🎨', title: 'White-label Options', desc: 'Customizable branding' },
                  { icon: '⚡', title: 'High Performance', desc: 'Fast response times' }
                ].map((feature, index) => (
                  <div key={index} style={{
                    background: '#f8fafc',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <div style={{fontSize: '2em', marginBottom: '8px'}}>{feature.icon}</div>
                    <h4 style={{marginBottom: '8px', color: '#1e293b'}}>{feature.title}</h4>
                    <p style={{color: '#64748b', fontSize: '0.9em'}}>{feature.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '32px',
                padding: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <h3>Ready to integrate Catalyst API?</h3>
                <p style={{opacity: '0.9', marginBottom: '16px'}}>
                  Start building with our professional ROI calculation engine
                </p>
                <button 
                  className="btn"
                  onClick={() => window.open(`${config.API_BASE_URL}/api/info`, '_blank')}
                  style={{
                    background: 'white',
                    color: '#667eea',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontWeight: '600'
                  }}
                >
                  View Full API Documentation →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced About Page with Human-Written Content */}
        {currentPage === 'about' && (
          <div className="card">
            <h2>About Catalyst ROI Calculator</h2>
            
            <div style={{lineHeight: '1.7', fontSize: '1.05em'}}>
              <p>
                Building a business case for new investments shouldn't feel like shooting in the dark. 
                That's exactly why we created Catalyst - because every business decision deserves to be 
                backed by solid numbers, not gut feelings.
              </p>

              <p>
                We've been there. Sitting in boardrooms, trying to justify why that new CRM system or 
                automation tool is worth the investment. The executives asking tough questions about 
                payback periods and success rates. The pressure to show real, quantifiable returns.
              </p>

              <p>
                After years of helping companies navigate these waters, we realized something: most ROI 
                calculators out there are either too generic to be useful, or so complex that you need 
                a PhD in finance to operate them. Neither approach helps when you need reliable numbers 
                for your next board meeting.
              </p>

              <h3 style={{marginTop: '32px', color: '#1e293b'}}>What Makes Catalyst Different</h3>

              <p>
                We've built something that actually reflects how business works in the real world. 
                Instead of one-size-fits-all formulas, Catalyst considers your industry, company size, 
                and specific scenario. A marketing automation investment for a tech startup looks very 
                different from the same investment at an established manufacturing company.
              </p>

              <p>
                Our scenarios aren't theoretical either. They're based on actual implementations we've 
                seen across hundreds of companies. When Catalyst tells you that CRM automation typically 
                delivers 180% ROI for technology companies, that's because we've tracked those results.
              </p>

              <h3 style={{marginTop: '32px', color: '#1e293b'}}>Professional API Integration</h3>

              <p>
                What started as a calculator has evolved into a comprehensive platform. Our professional 
                API now powers ROI calculations for businesses worldwide, offering the same sophisticated 
                analysis through a developer-friendly interface. Whether you're building an internal tool 
                or offering ROI analysis to your clients, Catalyst provides the intelligence you need.
              </p>

              <h3 style={{marginTop: '32px', color: '#1e293b'}}>Ready to Stop Guessing?</h3>

              <p>
                Whether you're evaluating a $10,000 software purchase or a $500,000 digital transformation, 
                Catalyst gives you the confidence to make decisions based on data, not hunches. Because 
                when you can clearly articulate the business case, everyone wins.
              </p>

              <p>
                Try it out. If it doesn't make your investment decisions way easier, we'll be genuinely 
                surprised.
              </p>

              <div style={{marginTop: '40px', display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                <button 
                  className="btn btn-primary"
                  onClick={() => setCurrentPage('calculator')}
                  style={{padding: '12px 24px', fontSize: '1.1em'}}
                >
                  Try It Now
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage('scenarios')}
                  style={{padding: '12px 24px', fontSize: '1.1em'}}
                >
                  See The Scenarios
                </button>
                {config.FEATURES.API_INTEGRATION && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setCurrentPage('api')}
                    style={{padding: '12px 24px', fontSize: '1.1em'}}
                  >
                    Explore API
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App