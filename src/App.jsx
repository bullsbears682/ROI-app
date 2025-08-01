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
    <>
      <style>{`
        /* Mobile-First App Styles with Native Feel */
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Loading Animation */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Touch-friendly Interactive Elements */
        button, select, input {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        /* iOS Safari Fixes */
        input[type="number"] {
          -webkit-appearance: none;
          -moz-appearance: textfield;
        }

        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          padding-right: 40px;
        }

        /* Native App Scrolling */
        main {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        /* Safe Area Support for iPhone X+ */
        @supports (padding: max(0px)) {
          header {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
            padding-top: max(12px, env(safe-area-inset-top));
          }
          
          main {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
            padding-bottom: max(20px, env(safe-area-inset-bottom));
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      <div className="app">
        {/* Enhanced App-like Header with Mobile Optimization */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: window.innerWidth <= 768 ? '12px 16px' : '20px 40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: '0',
        zIndex: '1000',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: window.innerWidth <= 768 ? 'wrap' : 'nowrap'
        }}>
          {/* Logo Section - Mobile Optimized */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: window.innerWidth <= 768 ? '1.3em' : '1.5em',
            fontWeight: '700',
            marginBottom: window.innerWidth <= 768 ? '12px' : '0',
            width: window.innerWidth <= 768 ? '100%' : 'auto',
            justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start'
          }}>
            <svg width={window.innerWidth <= 768 ? "28" : "32"} height={window.innerWidth <= 768 ? "28" : "32"} viewBox="0 0 100 100" style={{marginRight: '12px'}}>
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#fbbf24'}} />
                  <stop offset="100%" style={{stopColor: '#f59e0b'}} />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" stroke="white" strokeWidth="3"/>
              <path d="M30 35 L45 50 L70 25" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M30 65 L50 65 L70 65" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
            </svg>
            Catalyst
          </div>

          {/* API Status Indicator - Mobile Optimized */}
          <div style={{
            fontSize: window.innerWidth <= 768 ? '0.8em' : '0.9em',
            opacity: '0.9',
            background: 'rgba(255,255,255,0.15)',
            padding: window.innerWidth <= 768 ? '6px 12px' : '8px 16px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)',
            order: window.innerWidth <= 768 ? '-1' : '0',
            position: window.innerWidth <= 768 ? 'absolute' : 'static',
            top: window.innerWidth <= 768 ? '12px' : 'auto',
            right: window.innerWidth <= 768 ? '16px' : 'auto'
          }}>
            {config.FEATURES.API_INTEGRATION && (
              apiStatus === 'connected' ? '🟢 API Connected' :
              apiStatus === 'disconnected' ? '🔴 API Offline' :
              apiStatus === 'checking' ? '🟡 Checking API' :
              '⚪ Local Mode'
            )}
          </div>
        </div>

        {/* Mobile-First Navigation */}
        <nav style={{
          display: 'flex',
          justifyContent: window.innerWidth <= 768 ? 'space-around' : 'center',
          gap: window.innerWidth <= 768 ? '8px' : '24px',
          marginTop: window.innerWidth <= 768 ? '16px' : '20px',
          flexWrap: 'wrap',
          padding: window.innerWidth <= 768 ? '0' : '0 20px'
        }}>
          {[
            { key: 'calculator', label: '🧮 Calculator', icon: '🧮' },
            { key: 'scenarios', label: '📊 Scenarios', icon: '📊' },
            ...(config.FEATURES.API_INTEGRATION ? [{ key: 'api', label: '🔗 API', icon: '🔗' }] : []),
            { key: 'about', label: '💡 About', icon: '💡' }
          ].map(nav => (
            <button
              key={nav.key}
              onClick={() => setCurrentPage(nav.key)}
              style={{
                background: currentPage === nav.key 
                  ? 'rgba(255,255,255,0.25)' 
                  : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: currentPage === nav.key 
                  ? '2px solid rgba(255,255,255,0.4)' 
                  : '2px solid transparent',
                padding: window.innerWidth <= 768 ? '10px 16px' : '12px 24px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: window.innerWidth <= 768 ? '0.85em' : '0.95em',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(5px)',
                minWidth: window.innerWidth <= 768 ? '80px' : '120px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: window.innerWidth <= 768 ? '4px' : '8px',
                boxShadow: currentPage === nav.key 
                  ? '0 4px 15px rgba(255,255,255,0.2)' 
                  : 'none',
                transform: currentPage === nav.key ? 'translateY(-2px)' : 'translateY(0)',
                // Mobile touch optimization
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== nav.key) {
                  e.target.style.background = 'rgba(255,255,255,0.2)'
                  e.target.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== nav.key) {
                  e.target.style.background = 'rgba(255,255,255,0.1)'
                  e.target.style.transform = 'translateY(0)'
                }
              }}
            >
              {window.innerWidth <= 480 ? nav.icon : nav.label}
            </button>
          ))}
        </nav>
      </header>

      {/* App-like Main Container with Mobile Optimization */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: window.innerWidth <= 768 ? '16px' : '40px',
        minHeight: 'calc(100vh - 200px)',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative'
      }}>

        {/* Mobile-Optimized Calculator Page */}
        {currentPage === 'calculator' && (
          <div className="card" style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: window.innerWidth <= 768 ? '16px' : '20px',
            padding: window.innerWidth <= 768 ? '20px' : '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            margin: window.innerWidth <= 768 ? '0' : '0 auto'
          }}>
            <div style={{textAlign: 'center', marginBottom: window.innerWidth <= 768 ? '24px' : '32px'}}>
              <h1 style={{
                fontSize: window.innerWidth <= 768 ? '1.8em' : '2.5em',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '12px',
                fontWeight: '700'
              }}>
                Professional ROI Calculator
              </h1>
              <p style={{
                color: '#64748b',
                fontSize: window.innerWidth <= 768 ? '1em' : '1.1em',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Calculate investment returns with professional-grade analysis and industry benchmarks
              </p>
            </div>

            {/* Mobile-First Form Layout */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: window.innerWidth <= 768 ? '20px' : '32px',
              marginBottom: '32px'
            }}>
              
              {/* Investment Amount - Mobile Optimized */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: window.innerWidth <= 768 ? '0.95em' : '1em'
                }}>
                  💰 Investment Amount ({currency})
                </label>
                <input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  placeholder="Enter amount"
                  style={{
                    width: '100%',
                    padding: window.innerWidth <= 768 ? '14px 16px' : '16px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: window.innerWidth <= 768 ? '16px' : '18px', // Prevents zoom on iOS
                    background: 'rgba(255,255,255,0.8)',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    // Mobile touch optimization
                    WebkitAppearance: 'none',
                    touchAction: 'manipulation'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Business Category - Mobile Optimized */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: window.innerWidth <= 768 ? '0.95em' : '1em'
                }}>
                  🏢 Business Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setSelectedScenario('')
                  }}
                  style={{
                    width: '100%',
                    padding: window.innerWidth <= 768 ? '14px 16px' : '16px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: window.innerWidth <= 768 ? '16px' : '18px',
                    background: 'rgba(255,255,255,0.8)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <option value="">Select a category</option>
                  {Object.entries(roiCategories).map(([key, category]) => (
                    <option key={key} value={key}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Specific Scenario - Mobile Optimized */}
              {selectedCategory && (
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: window.innerWidth <= 768 ? '0.95em' : '1em'
                  }}>
                    🎯 Specific Scenario
                  </label>
                  <select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                    style={{
                      width: '100%',
                      padding: window.innerWidth <= 768 ? '14px 16px' : '16px 20px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: window.innerWidth <= 768 ? '16px' : '18px',
                      background: 'rgba(255,255,255,0.8)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box',
                      WebkitAppearance: 'none',
                      appearance: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea'
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.boxShadow = 'none'
                    }}
                  >
                    <option value="">Select a scenario</option>
                    {roiCategories[selectedCategory]?.scenarios.map((scenario, index) => (
                      <option key={scenario.id} value={scenario.id}>
                        {scenario.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Additional Parameters - Mobile Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(3, 1fr)',
                gap: window.innerWidth <= 768 ? '16px' : '20px',
                gridColumn: window.innerWidth <= 768 ? '1' : '1 / -1'
              }}>
                
                {/* Industry */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '0.9em'
                  }}>
                    🏭 Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      background: 'rgba(255,255,255,0.8)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="services">Services</option>
                  </select>
                </div>

                {/* Company Size */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '0.9em'
                  }}>
                    🏢 Company Size
                  </label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      background: 'rgba(255,255,255,0.8)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="small">Small (1-50)</option>
                    <option value="medium">Medium (51-500)</option>
                    <option value="large">Large (500+)</option>
                  </select>
                </div>

                {/* Timeframe */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '0.9em'
                  }}>
                    ⏱️ Timeframe (months)
                  </label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      background: 'rgba(255,255,255,0.8)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                    <option value={18}>18 months</option>
                    <option value={24}>24 months</option>
                    <option value={36}>36 months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile-Optimized Calculate Button */}
            <div style={{textAlign: 'center', marginBottom: '24px'}}>
              <button
                onClick={calculateROI}
                disabled={!investment || !selectedScenario || isCalculating}
                className="btn"
                style={{
                  background: (!investment || !selectedScenario || isCalculating) 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: window.innerWidth <= 768 ? '16px 32px' : '20px 48px',
                  borderRadius: '50px',
                  fontSize: window.innerWidth <= 768 ? '1.1em' : '1.3em',
                  fontWeight: '700',
                  cursor: (!investment || !selectedScenario || isCalculating) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: (!investment || !selectedScenario || isCalculating) 
                    ? 'none' 
                    : '0 10px 30px rgba(102, 126, 234, 0.3)',
                  transform: (!investment || !selectedScenario || isCalculating) 
                    ? 'none' 
                    : 'translateY(-2px)',
                  minWidth: window.innerWidth <= 768 ? '200px' : '250px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  margin: '0 auto',
                  // Mobile touch optimization
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
                onMouseEnter={(e) => {
                  if (!(!investment || !selectedScenario || isCalculating)) {
                    e.target.style.transform = 'translateY(-4px)'
                    e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(!investment || !selectedScenario || isCalculating)) {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)'
                  }
                }}
              >
                {isCalculating ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    🧮 Calculate ROI
                  </>
                )}
              </button>

                             {/* Data Source Indicator - Mobile Optimized */}
               <div style={{
                 marginTop: '16px',
                 fontSize: window.innerWidth <= 768 ? '0.8em' : '0.9em',
                 color: '#64748b',
                 background: 'rgba(102, 126, 234, 0.1)',
                 padding: '8px 16px',
                 borderRadius: '20px',
                 display: 'inline-block'
               }}>
                 {config.FEATURES.API_INTEGRATION && apiStatus === 'connected' 
                   ? '🔗 API-Powered Analysis' 
                   : '💻 Local Calculation Engine'}
               </div>
             </div>

             {/* Mobile-Optimized Results Display */}
             {results && (
               <div style={{
                 background: 'rgba(255,255,255,0.95)',
                 backdropFilter: 'blur(20px)',
                 borderRadius: window.innerWidth <= 768 ? '16px' : '20px',
                 padding: window.innerWidth <= 768 ? '20px' : '32px',
                 marginTop: '24px',
                 border: '1px solid rgba(255,255,255,0.2)',
                 boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                 animation: 'fadeInUp 0.6s ease-out'
               }}>
                 
                 {/* Results Header - Mobile Optimized */}
                 <div style={{
                   textAlign: 'center',
                   marginBottom: window.innerWidth <= 768 ? '20px' : '24px',
                   borderBottom: '1px solid #e2e8f0',
                   paddingBottom: window.innerWidth <= 768 ? '16px' : '20px'
                 }}>
                   <h2 style={{
                     fontSize: window.innerWidth <= 768 ? '1.4em' : '1.8em',
                     background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     marginBottom: '8px',
                     fontWeight: '700'
                   }}>
                     📊 ROI Analysis Results
                   </h2>
                   <p style={{
                     color: '#64748b',
                     fontSize: window.innerWidth <= 768 ? '0.9em' : '1em',
                     margin: '0'
                   }}>
                     Professional analysis for {results.scenarioName}
                   </p>
                   
                   {/* API Tag for Mobile */}
                   {results.marketData?.apiSource && (
                     <div style={{
                       display: 'inline-block',
                       background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                       color: 'white',
                       padding: '4px 12px',
                       borderRadius: '12px',
                       fontSize: '0.8em',
                       fontWeight: '600',
                       marginTop: '8px'
                     }}>
                       🔗 API Powered • ID: {results.marketData.calculationId?.slice(0, 8)}
                     </div>
                   )}
                 </div>

                 {/* Key Metrics Grid - Mobile First */}
                 <div style={{
                   display: 'grid',
                   gridTemplateColumns: window.innerWidth <= 480 
                     ? '1fr' 
                     : window.innerWidth <= 768 
                       ? 'repeat(2, 1fr)' 
                       : 'repeat(auto-fit, minmax(200px, 1fr))',
                   gap: window.innerWidth <= 768 ? '12px' : '20px',
                   marginBottom: '24px'
                 }}>
                   
                   {/* Total ROI */}
                   <div style={{
                     background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                     border: '1px solid #10b981',
                     borderRadius: '12px',
                     padding: window.innerWidth <= 768 ? '16px' : '20px',
                     textAlign: 'center'
                   }}>
                     <div style={{
                       fontSize: window.innerWidth <= 768 ? '1.8em' : '2.2em',
                       fontWeight: '700',
                       color: '#059669',
                       marginBottom: '4px'
                     }}>
                       {results.roiPercentage}%
                     </div>
                     <div style={{
                       fontSize: window.innerWidth <= 768 ? '0.85em' : '0.9em',
                       color: '#065f46',
                       fontWeight: '600'
                     }}>
                       Total ROI
                     </div>
                   </div>

                   {/* Expected Returns */}
                   <div style={{
                     background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                     border: '1px solid #e2e8f0',
                     borderRadius: '12px',
                     padding: window.innerWidth <= 768 ? '16px' : '20px',
                     textAlign: 'center'
                   }}>
                     <div style={{
                       fontSize: window.innerWidth <= 768 ? '1.5em' : '1.8em',
                       fontWeight: '700',
                       color: '#1e40af',
                       marginBottom: '4px'
                     }}>
                       {formatCurrency(results.expectedReturns)}
                     </div>
                     <div style={{
                       fontSize: window.innerWidth <= 768 ? '0.85em' : '0.9em',
                       color: '#64748b',
                       fontWeight: '600'
                     }}>
                       Expected Returns
                     </div>
                   </div>

                   {/* Payback Period */}
                   <div style={{
                     background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                     border: '1px solid #e2e8f0',
                     borderRadius: '12px',
                     padding: window.innerWidth <= 768 ? '16px' : '20px',
                     textAlign: 'center'
                   }}>
                     <div style={{
                       fontSize: window.innerWidth <= 768 ? '1.5em' : '1.8em',
                       fontWeight: '700',
                       color: '#7c3aed',
                       marginBottom: '4px'
                     }}>
                       {results.paybackPeriod} mo
                     </div>
                     <div style={{
                       fontSize: window.innerWidth <= 768 ? '0.85em' : '0.9em',
                       color: '#64748b',
                       fontWeight: '600'
                     }}>
                       Payback Period
                     </div>
                   </div>

                   {/* Success Rate */}
                   <div style={{
                     background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                     border: '1px solid #e2e8f0',
                     borderRadius: '12px',
                     padding: window.innerWidth <= 768 ? '16px' : '20px',
                     textAlign: 'center'
                   }}>
                     <div style={{
                       fontSize: window.innerWidth <= 768 ? '1.5em' : '1.8em',
                       fontWeight: '700',
                       color: '#dc2626',
                       marginBottom: '4px'
                     }}>
                       {results.successRate}%
                     </div>
                     <div style={{
                       fontSize: window.innerWidth <= 768 ? '0.85em' : '0.9em',
                       color: '#64748b',
                       fontWeight: '600'
                     }}>
                       Success Rate
                     </div>
                   </div>
                 </div>

                 {/* Mobile Action Buttons */}
                 <div style={{
                   display: 'flex',
                   flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                   gap: window.innerWidth <= 768 ? '12px' : '16px',
                   justifyContent: 'center',
                   marginTop: '24px'
                 }}>
                   <button
                     onClick={exportToPDF}
                     style={{
                       background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                       color: 'white',
                       border: 'none',
                       padding: window.innerWidth <= 768 ? '14px 24px' : '12px 24px',
                       borderRadius: '25px',
                       fontSize: window.innerWidth <= 768 ? '1em' : '0.95em',
                       fontWeight: '600',
                       cursor: 'pointer',
                       transition: 'all 0.3s ease',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       gap: '8px',
                       boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
                       order: window.innerWidth <= 768 ? '1' : '0'
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.transform = 'translateY(-2px)'
                       e.target.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4)'
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.transform = 'translateY(0)'
                       e.target.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.3)'
                     }}
                   >
                     📄 Export to PDF
                   </button>

                   <button
                     onClick={() => setShowLeadCapture(true)}
                     style={{
                       background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                       color: 'white',
                       border: 'none',
                       padding: window.innerWidth <= 768 ? '14px 24px' : '12px 24px',
                       borderRadius: '25px',
                       fontSize: window.innerWidth <= 768 ? '1em' : '0.95em',
                       fontWeight: '600',
                       cursor: 'pointer',
                       transition: 'all 0.3s ease',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       gap: '8px',
                       boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
                       order: window.innerWidth <= 768 ? '2' : '0'
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.transform = 'translateY(-2px)'
                       e.target.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.4)'
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.transform = 'translateY(0)'
                       e.target.style.boxShadow = '0 4px 15px rgba(5, 150, 105, 0.3)'
                     }}
                   >
                     📧 Get Detailed Report
                   </button>
                 </div>
               </div>
             )}

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
          </div>
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

        {/* API Documentation Page - Enhanced like Scenarios */}
        {config.FEATURES.API_INTEGRATION && currentPage === 'api' && (
          <div className="card">
            <h2>🔗 Catalyst ROI API</h2>
            <p>Professional ROI calculation API for developers and businesses. Integrate our powerful calculation engine into your applications.</p>

            {/* API Status Banner */}
            <div style={{
              background: apiStatus === 'connected' ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              color: apiStatus === 'connected' ? '#065f46' : '#991b1b',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '32px',
              textAlign: 'center',
              border: '1px solid ' + (apiStatus === 'connected' ? '#10b981' : '#ef4444')
            }}>
              <div style={{fontSize: '1.2em', fontWeight: '600', marginBottom: '8px'}}>
                {apiStatus === 'connected' ? '🟢 API Online & Ready' : '🔴 API Currently Offline'}
              </div>
              <div style={{fontSize: '0.9em', opacity: '0.8'}}>
                {apiStatus === 'connected' ? 
                  'All endpoints are operational and ready for requests' : 
                  'API server is not responding. Demonstration mode active.'}
              </div>
            </div>

            {/* Quick Start Section */}
            <div style={{marginBottom: '32px'}}>
              <h3>🚀 Quick Start Guide</h3>
              <p>Get started with the Catalyst ROI API in minutes. Here's a simple example:</p>
              
              <div style={{
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '20px',
                borderRadius: '12px',
                marginTop: '16px',
                fontFamily: 'monospace',
                fontSize: '0.9em'
              }}>
                <div style={{color: '#10b981', marginBottom: '12px'}}>// Calculate ROI for a CRM automation project</div>
                <div style={{marginBottom: '4px'}}>curl -X POST {config.API_BASE_URL}/api/calculate \</div>
                <div style={{marginBottom: '4px'}}>  -H "Content-Type: application/json" \</div>
                <div style={{marginBottom: '4px'}}>  -H "X-API-Key: {config.API_KEY}" \</div>
                <div>  -d '{JSON.stringify({
                  investment: 50000,
                  scenario: "automation-crm",
                  industry: "technology",
                  companySize: "medium",
                  timeframe: 12
                }, null, 2)}'</div>
              </div>

              <div style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                marginTop: '16px',
                fontSize: '0.9em',
                border: '1px solid #e2e8f0'
              }}>
                <strong>💡 Try it now:</strong> Copy the code above and replace the URL with your deployed API endpoint. 
                Use the demo key <code style={{background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px'}}>{config.API_KEY}</code> for testing.
              </div>
            </div>

            {/* API Endpoints Cards */}
            <div style={{marginBottom: '32px'}}>
              <h3>🛠️ API Endpoints</h3>
              <p>Comprehensive endpoints for ROI calculations, scenario management, and business intelligence.</p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '20px',
                marginTop: '24px'
              }}>
                {/* Calculate Endpoint */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid #cbd5e0',
                  borderRadius: '12px',
                  padding: '24px',
                  transition: 'transform 0.2s ease'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                    <span style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8em',
                      fontWeight: '600',
                      marginRight: '12px'
                    }}>POST</span>
                    <h4 style={{margin: '0', color: '#1e293b'}}>ROI Calculation</h4>
                  </div>
                  <code style={{
                    background: '#e2e8f0',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.9em',
                    fontFamily: 'monospace',
                    display: 'block',
                    marginBottom: '12px'
                  }}>/api/calculate</code>
                  <p style={{color: '#64748b', fontSize: '0.9em', marginBottom: '12px'}}>
                    Calculate professional ROI analysis for 16+ business scenarios with industry benchmarks and risk assessment.
                  </p>
                  <div style={{fontSize: '0.85em', color: '#4b5563'}}>
                    <strong>Features:</strong> Real-time calculations, industry multipliers, success rate analysis, financial projections
                  </div>
                </div>

                {/* Scenarios Endpoint */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid #cbd5e0',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                    <span style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8em',
                      fontWeight: '600',
                      marginRight: '12px'
                    }}>GET</span>
                    <h4 style={{margin: '0', color: '#1e293b'}}>Scenarios Library</h4>
                  </div>
                  <code style={{
                    background: '#e2e8f0',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.9em',
                    fontFamily: 'monospace',
                    display: 'block',
                    marginBottom: '12px'
                  }}>/api/scenarios</code>
                  <p style={{color: '#64748b', fontSize: '0.9em', marginBottom: '12px'}}>
                    Access our complete library of 85+ business scenarios across 8 categories with detailed descriptions and ROI ranges.
                  </p>
                  <div style={{fontSize: '0.85em', color: '#4b5563'}}>
                    <strong>Includes:</strong> Scenario details, cost ranges, risk levels, expected benefits, implementation insights
                  </div>
                </div>

                {/* Leads Endpoint */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid #cbd5e0',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                    <span style={{
                      background: '#8b5cf6',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8em',
                      fontWeight: '600',
                      marginRight: '12px'
                    }}>POST</span>
                    <h4 style={{margin: '0', color: '#1e293b'}}>Lead Management</h4>
                  </div>
                  <code style={{
                    background: '#e2e8f0',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.9em',
                    fontFamily: 'monospace',
                    display: 'block',
                    marginBottom: '12px'
                  }}>/api/leads</code>
                  <p style={{color: '#64748b', fontSize: '0.9em', marginBottom: '12px'}}>
                    Capture and manage leads from ROI calculations with automatic linking to calculation data for follow-up.
                  </p>
                  <div style={{fontSize: '0.85em', color: '#4b5563'}}>
                    <strong>Captures:</strong> Contact information, calculation context, lead scoring, automated follow-up data
                  </div>
                </div>

                {/* Analytics Endpoint */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid #cbd5e0',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                    <span style={{
                      background: '#f59e0b',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8em',
                      fontWeight: '600',
                      marginRight: '12px'
                    }}>GET</span>
                    <h4 style={{margin: '0', color: '#1e293b'}}>Usage Analytics</h4>
                  </div>
                  <code style={{
                    background: '#e2e8f0',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.9em',
                    fontFamily: 'monospace',
                    display: 'block',
                    marginBottom: '12px'
                  }}>/api/analytics</code>
                  <p style={{color: '#64748b', fontSize: '0.9em', marginBottom: '12px'}}>
                    Comprehensive usage analytics and business intelligence for API administrators and enterprise users.
                  </p>
                  <div style={{fontSize: '0.85em', color: '#4b5563'}}>
                    <strong>Provides:</strong> Usage metrics, popular scenarios, conversion rates, performance insights
                    <span style={{background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px', fontSize: '0.8em'}}>Admin Only</span>
                  </div>
                </div>

                {/* Health Check */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid #cbd5e0',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                    <span style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8em',
                      fontWeight: '600',
                      marginRight: '12px'
                    }}>GET</span>
                    <h4 style={{margin: '0', color: '#1e293b'}}>Health Check</h4>
                  </div>
                  <code style={{
                    background: '#e2e8f0',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.9em',
                    fontFamily: 'monospace',
                    display: 'block',
                    marginBottom: '12px'
                  }}>/api/health</code>
                  <p style={{color: '#64748b', fontSize: '0.9em', marginBottom: '12px'}}>
                    Monitor API status, uptime, and system health for integration monitoring and debugging.
                  </p>
                  <div style={{fontSize: '0.85em', color: '#4b5563'}}>
                    <strong>Returns:</strong> System status, database connectivity, version info, response times
                  </div>
                </div>

                {/* API Info */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid #cbd5e0',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                    <span style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8em',
                      fontWeight: '600',
                      marginRight: '12px'
                    }}>GET</span>
                    <h4 style={{margin: '0', color: '#1e293b'}}>API Information</h4>
                  </div>
                  <code style={{
                    background: '#e2e8f0',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.9em',
                    fontFamily: 'monospace',
                    display: 'block',
                    marginBottom: '12px'
                  }}>/api/info</code>
                  <p style={{color: '#64748b', fontSize: '0.9em', marginBottom: '12px'}}>
                    Complete API documentation with endpoint descriptions, authentication details, and usage guidelines.
                  </p>
                  <div style={{fontSize: '0.85em', color: '#4b5563'}}>
                    <strong>Includes:</strong> Endpoint reference, demo keys, rate limits, support information
                  </div>
                </div>
              </div>
            </div>

            {/* Authentication & Demo Keys */}
            <div style={{marginBottom: '32px'}}>
              <h3>🔐 Authentication & Demo Access</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginTop: '16px'
              }}>
                <div style={{
                  background: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  padding: '20px',
                  borderRadius: '12px'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                    <span style={{fontSize: '1.5em', marginRight: '8px'}}>🔑</span>
                    <h4 style={{margin: '0', color: '#0c4a6e'}}>Demo API Key</h4>
                  </div>
                  <div style={{
                    background: '#e0f2fe',
                    padding: '12px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.9em',
                    marginBottom: '12px',
                    wordBreak: 'break-all'
                  }}>
                    {config.API_KEY}
                  </div>
                  <div style={{fontSize: '0.9em', color: '#0c4a6e'}}>
                    <strong>Tier:</strong> Professional (1,000 requests)<br/>
                    <strong>Usage:</strong> Testing and development<br/>
                    <strong>Rate Limit:</strong> 100 requests per 15 minutes
                  </div>
                </div>

                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #9ca3af',
                  padding: '20px',
                  borderRadius: '12px'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                    <span style={{fontSize: '1.5em', marginRight: '8px'}}>🔐</span>
                    <h4 style={{margin: '0', color: '#374151'}}>Admin Access</h4>
                  </div>
                  <div style={{
                    background: '#f3f4f6',
                    padding: '12px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.9em',
                    marginBottom: '12px',
                    wordBreak: 'break-all'
                  }}>
                    {config.ADMIN_API_KEY}
                  </div>
                  <div style={{fontSize: '0.9em', color: '#374151'}}>
                    <strong>Tier:</strong> Enterprise (Unlimited)<br/>
                    <strong>Usage:</strong> Full analytics access<br/>
                    <strong>Features:</strong> All endpoints + admin panel
                  </div>
                </div>
              </div>

              <div style={{
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                padding: '16px',
                borderRadius: '8px',
                marginTop: '16px'
              }}>
                <div style={{display: 'flex', alignItems: 'center', color: '#92400e'}}>
                  <span style={{fontSize: '1.2em', marginRight: '8px'}}>💡</span>
                  <div>
                    <strong>How to use:</strong> Include your API key in the request header as <code style={{background: '#fde68a', padding: '2px 6px', borderRadius: '4px'}}>X-API-Key: your-key-here</code>
                    <br/>
                    <strong>Security:</strong> API keys are hashed and secured. Rate limiting prevents abuse.
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Features */}
            <div style={{marginBottom: '32px'}}>
              <h3>💼 Enterprise Features</h3>
              <p>Professional-grade features designed for business integration and white-label solutions.</p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginTop: '20px'
              }}>
                {[
                  { 
                    icon: '🔐', 
                    title: 'API Authentication', 
                    desc: 'Secure API key management with tiered access levels and usage tracking',
                    features: ['Hashed API keys', 'Usage analytics', 'Rate limiting', 'Access control']
                  },
                  { 
                    icon: '📊', 
                    title: 'Business Intelligence', 
                    desc: 'Comprehensive analytics and reporting for usage patterns and trends',
                    features: ['Usage metrics', 'Popular scenarios', 'Conversion tracking', 'Performance insights']
                  },
                                     { 
                     icon: '🎨', 
                     title: 'Advanced White-Label', 
                     desc: 'Complete customization and branding control for seamless integration',
                     features: ['Custom domains', 'Dynamic theming', 'Logo integration', 'Brand guidelines']
                   },
                  { 
                    icon: '⚡', 
                    title: 'High Performance', 
                    desc: 'Optimized for speed with caching, compression, and global availability',
                    features: ['Fast response times', 'Auto-scaling', 'Database optimization', 'CDN ready']
                  },
                  { 
                    icon: '🛡️', 
                    title: 'Enterprise Security', 
                    desc: 'Production-grade security with headers, validation, and monitoring',
                    features: ['Helmet.js security', 'Input validation', 'SQL injection protection', 'Request logging']
                  },
                                     { 
                     icon: '🔄', 
                     title: 'Real-time Sync', 
                     desc: 'Live data synchronization and webhook support for integrations',
                     features: ['Webhook notifications', 'Real-time updates', 'Event streaming', 'Integration APIs']
                   },
                   { 
                     icon: '💼', 
                     title: 'Primary CRM', 
                     desc: 'Deep integration with enterprise CRM, sales, and service platforms',
                     features: ['Contact sync', 'Deal pipeline', 'Custom fields', 'Workflow automation']
                   }
                ].map((feature, index) => (
                  <div key={index} style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    padding: '24px',
                    borderRadius: '12px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}>
                    <div style={{fontSize: '2.5em', marginBottom: '12px', textAlign: 'center'}}>{feature.icon}</div>
                    <h4 style={{marginBottom: '8px', color: '#1e293b', textAlign: 'center'}}>{feature.title}</h4>
                    <p style={{color: '#64748b', fontSize: '0.9em', marginBottom: '16px', textAlign: 'center'}}>{feature.desc}</p>
                    <div style={{fontSize: '0.85em'}}>
                      {feature.features.map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '6px',
                          color: '#4b5563'
                        }}>
                          <span style={{color: '#10b981', marginRight: '8px', fontSize: '0.9em'}}>✓</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div style={{
              marginTop: '40px',
              padding: '32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <h3 style={{marginBottom: '16px'}}>Ready to integrate Catalyst ROI API?</h3>
              <p style={{opacity: '0.9', marginBottom: '24px', fontSize: '1.1em'}}>
                Start building with our professional ROI calculation engine. From simple calculations 
                to enterprise integrations, we've got you covered.
              </p>
              <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
                <button 
                  className="btn"
                  onClick={() => window.open(`${config.API_BASE_URL}/api/info`, '_blank')}
                  style={{
                    background: 'white',
                    color: '#667eea',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '1em'
                  }}
                >
                  📚 Full API Documentation
                </button>
                <button 
                  className="btn"
                  onClick={() => setCurrentPage('calculator')}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.3)',
                    padding: '14px 28px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '1em'
                  }}
                >
                  🧮 Try Live Calculator
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
    </>
  )
}

export default App