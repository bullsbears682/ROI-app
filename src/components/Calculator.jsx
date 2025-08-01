import React from 'react';

const Calculator = ({ 
  categories, 
  scenarios, 
  selectedCategory, 
  selectedScenario, 
  inputs, 
  currency,
  onCategoryChange, 
  onScenarioChange, 
  onInputChange, 
  onCurrencyChange,
  onCalculate 
}) => {
  // Get scenarios for selected category
  const categoryScenarios = Object.entries(scenarios)
    .filter(([key, scenario]) => scenario.category === selectedCategory)
    .map(([key, scenario]) => ({ id: key, ...scenario }));

  const currentScenario = scenarios[selectedScenario];

  // Currency options
  const currencyOptions = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
  ];

  // Format currency for display
  const formatCurrency = (amount) => {
    const currencyData = currencyOptions.find(c => c.code === currency) || currencyOptions[0];
    return `${currencyData.symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="card calculator-card">
      <h2>🚀 ROI Calculator</h2>
      <p className="card-subtitle">Calculate returns across 85+ business scenarios</p>
      
      {/* Category Selection */}
      <div className="form-group">
        <label className="form-label">📊 Business Category</label>
        <select 
          className="form-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {Object.values(categories).map(category => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        <small className="form-hint">{categoryScenarios.length} scenarios available</small>
      </div>

      {/* Scenario Selection */}
      <div className="form-group">
        <label className="form-label">🎯 Specific Scenario</label>
        <select 
          className="form-select"
          value={selectedScenario}
          onChange={(e) => onScenarioChange(e.target.value)}
        >
          {categoryScenarios.map(scenario => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.description}
            </option>
          ))}
        </select>
        {currentScenario && (
          <small className="form-hint">
            Risk: {currentScenario.riskLevel} | 
            ROI Range: {currentScenario.expectedROI.min}% - {currentScenario.expectedROI.max}%
          </small>
        )}
      </div>

      {/* Investment Amount */}
      <div className="form-group">
        <label className="form-label">💰 Investment Amount</label>
        <div className="input-group">
          <input 
            type="number"
            className="form-input"
            value={inputs.investment || ''}
            onChange={(e) => onInputChange('investment', parseFloat(e.target.value) || 0)}
            placeholder="Enter investment amount"
            min="1000"
            step="1000"
          />
          <select 
            className="form-select currency-select"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            style={{maxWidth: '100px'}}
          >
            {currencyOptions.map(curr => (
              <option key={curr.code} value={curr.code}>
                {curr.code}
              </option>
            ))}
          </select>
        </div>
        <small className="form-hint">Minimum: {formatCurrency(1000)}</small>
      </div>

      {/* Timeframe */}
      <div className="form-group">
        <label className="form-label">⏱️ Timeframe (months)</label>
        <input 
          type="number"
          className="form-input"
          value={inputs.timeframe || 12}
          onChange={(e) => onInputChange('timeframe', parseInt(e.target.value) || 12)}
          min="1"
          max="60"
          placeholder="12"
        />
        <small className="form-hint">Typical: 6-24 months</small>
      </div>

      {/* Industry */}
      <div className="form-group">
        <label className="form-label">🏢 Industry</label>
        <select 
          className="form-select"
          value={inputs.industry || 'technology'}
          onChange={(e) => onInputChange('industry', e.target.value)}
        >
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
        <label className="form-label">👥 Company Size</label>
        <select 
          className="form-select"
          value={inputs.companySize || 'medium'}
          onChange={(e) => onInputChange('companySize', e.target.value)}
        >
          <option value="startup">Startup (1-10 employees)</option>
          <option value="small">Small (11-50 employees)</option>
          <option value="medium">Medium (51-200 employees)</option>
          <option value="large">Large (201-1000 employees)</option>
          <option value="enterprise">Enterprise (1000+ employees)</option>
        </select>
      </div>

      {/* Scenario Preview */}
      {currentScenario && (
        <div className="scenario-preview">
          <h4>📋 Scenario Overview</h4>
          <div className="scenario-details">
            <div className="detail-item">
              <span className="detail-label">Description:</span>
              <span>{currentScenario.description}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Category:</span>
              <span>{categories[selectedCategory]?.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Risk Level:</span>
              <span className={`risk-badge risk-${currentScenario.riskLevel}`}>
                {currentScenario.riskLevel.toUpperCase()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Expected ROI:</span>
              <span>{currentScenario.expectedROI.min}% - {currentScenario.expectedROI.max}%</span>
            </div>
            {currentScenario.benefits && (
              <div className="detail-item">
                <span className="detail-label">Key Benefits:</span>
                <ul className="benefits-list">
                  {currentScenario.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calculate Button */}
      <button 
        className="btn btn-primary calculate-btn"
        onClick={onCalculate}
        disabled={!inputs.investment || inputs.investment < 1000}
      >
        🧮 Calculate ROI
        <span className="btn-icon">→</span>
      </button>

      {/* Data Sources Note */}
      <div className="data-sources-note">
        <small>
          💡 Calculations based on real market data from government sources and industry benchmarks
        </small>
      </div>
    </div>
  );
};

export default Calculator;