import React, { useState } from 'react'
import { roiCategories, roiScenarios } from './data/roiScenarios'
import './styles/index.css'

function App() {
  // State
  const [investment, setInvestment] = useState(25000)
  const [timeframe, setTimeframe] = useState(12)
  const [selectedScenario, setSelectedScenario] = useState('automation-crm')
  const [results, setResults] = useState(null)

  // Simple calculation function
  const handleCalculate = () => {
    console.log('CALCULATE CLICKED!', { investment, timeframe, selectedScenario })
    
    if (!investment || investment < 1000) {
      alert('Please enter at least $1,000')
      return
    }

    // Get scenario data
    const scenario = roiScenarios[selectedScenario]
    console.log('SCENARIO FOUND:', scenario)

    if (!scenario) {
      alert('Scenario not found')
      return
    }

    // Simple ROI calculation
    const avgROI = (scenario.expectedROI.min + scenario.expectedROI.max) / 2
    const returns = investment * (avgROI / 100)
    const totalValue = investment + returns
    const monthlyReturn = returns / timeframe
    const payback = Math.ceil(investment / monthlyReturn)

    const calculatedResults = {
      investment: investment,
      returns: Math.round(returns),
      total: Math.round(totalValue),
      roiPercent: Math.round(avgROI),
      monthlyReturn: Math.round(monthlyReturn),
      paybackMonths: payback,
      scenarioName: scenario.description
    }

    console.log('RESULTS CALCULATED:', calculatedResults)
    setResults(calculatedResults)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Catalyst ROI Calculator</h1>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        {/* Calculator Card */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2>Calculate Your ROI</h2>
          
          {/* Investment Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Investment Amount ($)
            </label>
            <input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px'
              }}
              placeholder="25000"
            />
          </div>

          {/* Timeframe Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Timeframe (months)
            </label>
            <input
              type="number"
              value={timeframe}
              onChange={(e) => setTimeframe(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px'
              }}
              min="1"
              max="60"
            />
          </div>

          {/* Scenario Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Business Scenario
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            >
              {Object.entries(roiScenarios).map(([key, scenario]) => (
                <option key={key} value={key}>
                  {scenario.description}
                </option>
              ))}
            </select>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Calculate ROI
          </button>
        </div>

        {/* Results Card */}
        {results && (
          <div className="card">
            <h2>Your ROI Results</h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0369a1' }}>
                  {results.roiPercent}%
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>ROI Percentage</div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '20px', background: '#f0fdf4', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                  ${results.returns.toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Expected Returns</div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '20px', background: '#fefce8', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>
                  {results.paybackMonths} months
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Payback Period</div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
              <h3>Investment Summary</h3>
              <p><strong>Scenario:</strong> {results.scenarioName}</p>
              <p><strong>Initial Investment:</strong> ${results.investment.toLocaleString()}</p>
              <p><strong>Expected Returns:</strong> ${results.returns.toLocaleString()}</p>
              <p><strong>Total Value:</strong> ${results.total.toLocaleString()}</p>
              <p><strong>Monthly Return:</strong> ${results.monthlyReturn.toLocaleString()}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App