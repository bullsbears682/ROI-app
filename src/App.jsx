import React, { useState } from 'react'
import { roiCategories, roiScenarios } from './data/roiScenarios'
import './styles/index.css'

function App() {
  // Simple state management
  const [selectedCategory, setSelectedCategory] = useState('automation')
  const [selectedScenario, setSelectedScenario] = useState('automation-crm')
  const [investment, setInvestment] = useState(50000)
  const [timeframe, setTimeframe] = useState(12)
  const [industry, setIndustry] = useState('technology')
  const [companySize, setCompanySize] = useState('medium')
  const [currency, setCurrency] = useState('USD')
  const [results, setResults] = useState(null)
  const [currentPage, setCurrentPage] = useState('calculator')

  // Currency symbols
  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CAD': 'C$',
    'AUD': 'A$'
  }

  // Get scenarios for selected category
  const getScenarios = () => {
    return Object.entries(roiScenarios)
      .filter(([key, scenario]) => scenario.category === selectedCategory)
      .map(([key, scenario]) => ({ id: key, ...scenario }))
  }

  // Simple ROI calculation
  const calculateROI = () => {
    if (!investment || investment < 1000) {
      alert('Please enter an investment amount of at least $1,000')
      return
    }

    const scenario = roiScenarios[selectedScenario]
    if (!scenario) {
      alert('Please select a valid scenario')
      return
    }

    // Base ROI calculation
    const baseROI = (scenario.expectedROI.min + scenario.expectedROI.max) / 2
    
    // Industry adjustments
    const industryMultipliers = {
      'technology': 1.2,
      'healthcare': 1.1,
      'finance': 1.0,
      'retail': 0.9,
      'manufacturing': 0.8,
      'education': 0.7,
      'real-estate': 1.0,
      'professional-services': 1.1,
      'hospitality': 0.8,
      'transportation': 0.9
    }

    // Company size adjustments
    const sizeMultipliers = {
      'startup': 0.8,
      'small': 0.9,
      'medium': 1.0,
      'large': 1.1,
      'enterprise': 1.2
    }

    // Risk adjustments
    const riskMultipliers = {
      'low': 1.1,
      'medium': 1.0,
      'high': 0.9
    }

    // Calculate final ROI
    const finalROI = baseROI * 
      (industryMultipliers[industry] || 1.0) * 
      (sizeMultipliers[companySize] || 1.0) * 
      (riskMultipliers[scenario.riskLevel] || 1.0)

    // Calculate returns
    const expectedReturns = investment * (finalROI / 100)
    const totalReturns = investment + expectedReturns
    const monthlyReturn = expectedReturns / timeframe
    const paybackMonths = Math.ceil(investment / monthlyReturn)
    const annualizedROI = (finalROI / timeframe) * 12

    // Success rate calculation
    let successRate = 75
    if (scenario.riskLevel === 'low') successRate += 15
    if (scenario.riskLevel === 'high') successRate -= 10
    if (industry === 'technology') successRate += 10
    if (companySize === 'enterprise') successRate += 8
    successRate = Math.max(60, Math.min(95, successRate))

    const calculationResults = {
      investment,
      expectedReturns: Math.round(expectedReturns),
      totalReturns: Math.round(totalReturns),
      roiPercentage: Math.round(finalROI * 100) / 100,
      annualizedROI: Math.round(annualizedROI * 100) / 100,
      paybackMonths: Math.max(1, paybackMonths),
      successRate: Math.round(successRate),
      riskLevel: scenario.riskLevel,
      monthlyReturn: Math.round(monthlyReturn),
      scenarioName: scenario.description,
      timeframe,
      currency
    }

    setResults(calculationResults)
    console.log('✅ ROI Calculated:', calculationResults)
  }

  // Format currency
  const formatCurrency = (amount) => {
    const symbol = currencySymbols[currency] || '$'
    return `${symbol}${amount.toLocaleString()}`
  }

  // Navigation
  const handleNavigation = (page) => {
    setCurrentPage(page)
  }

  // Header Component
  const Header = () => (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => handleNavigation('calculator')}>
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
            <span className="logo-tagline">ROI Calculator</span>
          </div>
        </div>
        
        <nav className="nav">
          <button 
            className={`nav-link ${currentPage === 'calculator' ? 'active' : ''}`}
            onClick={() => handleNavigation('calculator')}
          >
            Calculator
          </button>
          <button 
            className={`nav-link ${currentPage === 'scenarios' ? 'active' : ''}`}
            onClick={() => handleNavigation('scenarios')}
          >
            Scenarios
          </button>
          <button 
            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => handleNavigation('about')}
          >
            About
          </button>
        </nav>
      </div>
    </header>
  )

  // Calculator Component
  const Calculator = () => (
    <div className="card">
      <h2>🚀 ROI Calculator</h2>
      <p>Calculate returns across 85+ business scenarios</p>
      
      {/* Category Selection */}
      <div className="form-group">
        <label>📊 Business Category</label>
        <select 
          value={selectedCategory} 
          onChange={(e) => {
            setSelectedCategory(e.target.value)
            // Auto-select first scenario in category
            const scenarios = Object.entries(roiScenarios)
              .filter(([key, scenario]) => scenario.category === e.target.value)
            if (scenarios.length > 0) {
              setSelectedScenario(scenarios[0][0])
            }
          }}
        >
          {Object.values(roiCategories).map(category => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Scenario Selection */}
      <div className="form-group">
        <label>🎯 Specific Scenario</label>
        <select value={selectedScenario} onChange={(e) => setSelectedScenario(e.target.value)}>
          {getScenarios().map(scenario => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.description}
            </option>
          ))}
        </select>
      </div>

      {/* Investment Amount */}
      <div className="form-group">
        <label>💰 Investment Amount</label>
        <div style={{display: 'flex', gap: '10px'}}>
          <input 
            type="number" 
            value={investment} 
            onChange={(e) => setInvestment(Number(e.target.value))}
            placeholder="50000"
            min="1000"
            style={{flex: 1}}
          />
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
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
        <label>⏱️ Timeframe (months)</label>
        <input 
          type="number" 
          value={timeframe} 
          onChange={(e) => setTimeframe(Number(e.target.value))}
          min="1" 
          max="60"
        />
      </div>

      {/* Industry */}
      <div className="form-group">
        <label>🏢 Industry</label>
        <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="finance">Finance</option>
          <option value="retail">Retail</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="education">Education</option>
          <option value="real-estate">Real Estate</option>
          <option value="professional-services">Professional Services</option>
          <option value="hospitality">Hospitality</option>
          <option value="transportation">Transportation</option>
        </select>
      </div>

      {/* Company Size */}
      <div className="form-group">
        <label>👥 Company Size</label>
        <select value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
          <option value="startup">Startup (1-10 employees)</option>
          <option value="small">Small (11-50 employees)</option>
          <option value="medium">Medium (51-200 employees)</option>
          <option value="large">Large (201-1000 employees)</option>
          <option value="enterprise">Enterprise (1000+ employees)</option>
        </select>
      </div>

      {/* Calculate Button */}
      <button 
        className="btn btn-primary" 
        onClick={calculateROI}
        style={{width: '100%', marginTop: '20px'}}
      >
        🧮 Calculate ROI
      </button>
    </div>
  )

  // Results Component
  const Results = () => {
    if (!results) {
      return (
        <div className="card">
          <h2>📊 Results</h2>
          <p>Enter your investment details and click "Calculate ROI" to see your results.</p>
        </div>
      )
    }

    return (
      <div className="card">
        <h2>📊 ROI Analysis Results</h2>
        
        <div className="results-grid">
          <div className="result-item primary">
            <div className="result-label">Total ROI</div>
            <div className="result-value">{results.roiPercentage}%</div>
          </div>
          
          <div className="result-item">
            <div className="result-label">Expected Returns</div>
            <div className="result-value">{formatCurrency(results.expectedReturns)}</div>
          </div>
          
          <div className="result-item">
            <div className="result-label">Total Value</div>
            <div className="result-value">{formatCurrency(results.totalReturns)}</div>
          </div>
          
          <div className="result-item">
            <div className="result-label">Payback Period</div>
            <div className="result-value">{results.paybackMonths} months</div>
          </div>
          
          <div className="result-item">
            <div className="result-label">Monthly Return</div>
            <div className="result-value">{formatCurrency(results.monthlyReturn)}</div>
          </div>
          
          <div className="result-item">
            <div className="result-label">Success Rate</div>
            <div className="result-value">{results.successRate}%</div>
          </div>
        </div>

        <div className="result-summary">
          <h3>Investment Summary</h3>
          <p><strong>Scenario:</strong> {results.scenarioName}</p>
          <p><strong>Investment:</strong> {formatCurrency(results.investment)}</p>
          <p><strong>Timeframe:</strong> {results.timeframe} months</p>
          <p><strong>Risk Level:</strong> {results.riskLevel.toUpperCase()}</p>
          <p><strong>Annualized ROI:</strong> {results.annualizedROI}%</p>
        </div>
      </div>
    )
  }

  // Simple About Page
  const About = () => (
    <div className="card">
      <h2>About Catalyst</h2>
      <p>Professional ROI Calculator for business investments with 85+ scenarios across 14 industries.</p>
      <h3>Features</h3>
      <ul>
        <li>85+ business scenarios</li>
        <li>14 industry categories</li>
        <li>Multi-currency support</li>
        <li>Risk-adjusted calculations</li>
        <li>Industry-specific adjustments</li>
        <li>Company size considerations</li>
      </ul>
      <button className="btn btn-primary" onClick={() => handleNavigation('calculator')}>
        Try Calculator
      </button>
    </div>
  )

  // Simple Scenarios Page
  const Scenarios = () => (
    <div className="card">
      <h2>Business Scenarios</h2>
      <p>Choose from 85+ pre-built ROI scenarios across these categories:</p>
      <div className="scenarios-grid">
        {Object.values(roiCategories).map(category => (
          <div key={category.id} className="scenario-category">
            <h3>{category.icon} {category.name}</h3>
            <p>{category.description}</p>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setSelectedCategory(category.id)
                handleNavigation('calculator')
              }}
            >
              Explore Scenarios
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  // Main App Render
  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        {currentPage === 'calculator' && (
          <>
            <div className="calculator-section">
              <Calculator />
            </div>
            <div className="results-section">
              <Results />
            </div>
          </>
        )}
        
        {currentPage === 'about' && <About />}
        {currentPage === 'scenarios' && <Scenarios />}
      </main>
    </div>
  )
}

export default App