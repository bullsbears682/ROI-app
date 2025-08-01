import React from 'react';
import { getCurrencyOptions, formatCurrencyCustom, convertROIScenario } from '../utils/currency';

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

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="card calculator-card">
      <h2>ROI Calculator</h2>
      
      {/* Category Selection */}
      <div className="form-group">
        <label className="form-label">Business Category</label>
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
        <small className="form-help">
          {categories[selectedCategory]?.description}
        </small>
      </div>

      {/* Scenario Selection */}
      <div className="form-group">
        <label className="form-label">Investment Scenario</label>
        <select 
          className="form-select"
          value={selectedScenario}
          onChange={(e) => onScenarioChange(e.target.value)}
        >
          {categoryScenarios.map(scenario => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.name}
            </option>
          ))}
        </select>
        {currentScenario && (
          <small className="form-help">
            {currentScenario.description}
          </small>
        )}
      </div>

      {/* Currency Selection */}
      <div className="form-group">
        <label className="form-label">Currency</label>
        <select 
          className="form-select"
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
        >
          {getCurrencyOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Investment Amount */}
      <div className="form-group">
        <label className="form-label">Investment Amount</label>
        <div className="input-group">
          <span className="input-prefix">{formatCurrencyCustom(0, currency).replace(/\d/g, '').replace(',', '')}</span>
          <input
            type="number"
            className="form-input"
            value={inputs.investment}
            onChange={(e) => onInputChange('investment', parseInt(e.target.value) || 0)}
            placeholder="25000"
            min="1000"
            step="1000"
          />
        </div>
        {currentScenario && (
          <small className="form-help">
            Typical range: {formatCurrency(currentScenario.costRange.min)} - {formatCurrency(currentScenario.costRange.max)}
          </small>
        )}
      </div>

      {/* Timeframe */}
      <div className="form-group">
        <label className="form-label">Timeframe (months)</label>
        <input
          type="number"
          className="form-input"
          value={inputs.timeframe}
          onChange={(e) => onInputChange('timeframe', parseInt(e.target.value) || 1)}
          placeholder="12"
          min="1"
          max="60"
        />
        {currentScenario && (
          <small className="form-help">
            Expected implementation: {currentScenario.timeframe.min}-{currentScenario.timeframe.max} months
          </small>
        )}
      </div>

      {/* Industry */}
      <div className="form-group">
        <label className="form-label">Industry</label>
        <select 
          className="form-select"
          value={inputs.industry}
          onChange={(e) => onInputChange('industry', e.target.value)}
        >
          <option value="general">General Business</option>
          <option value="retail">Retail & eCommerce</option>
          <option value="saas">SaaS & Technology</option>
          <option value="financial">Financial Services</option>
          <option value="healthcare">Healthcare</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="consulting">Professional Services</option>
          <option value="real_estate">Real Estate</option>
          <option value="education">Education</option>
        </select>
      </div>

      {/* Company Size */}
      <div className="form-group">
        <label className="form-label">Company Size</label>
        <select 
          className="form-select"
          value={inputs.companySize}
          onChange={(e) => onInputChange('companySize', e.target.value)}
        >
          <option value="startup">Startup (1-10 employees)</option>
          <option value="small">Small Business (11-50 employees)</option>
          <option value="medium">Medium Business (51-200 employees)</option>
          <option value="large">Large Enterprise (200+ employees)</option>
        </select>
      </div>

      {/* Scenario Details */}
      {currentScenario && (
        <div className="scenario-details">
          <h3>About This Investment</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Expected ROI Range</span>
              <span className="detail-value">
                {currentScenario.expectedROI.min}% - {currentScenario.expectedROI.max}%
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Payback Period</span>
              <span className="detail-value">{currentScenario.paybackPeriod} months</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Risk Level</span>
              <span className={`detail-value risk-${currentScenario.riskLevel}`}>
                {currentScenario.riskLevel.charAt(0).toUpperCase() + currentScenario.riskLevel.slice(1)}
              </span>
            </div>
          </div>

          {/* Benefits List */}
          {currentScenario.benefits && (
            <div className="benefits-section">
              <h4>Key Benefits</h4>
              <ul className="benefits-list">
                {currentScenario.benefits.map((benefit, index) => (
                  <li key={index} className="benefit-item">
                    <span className="benefit-icon">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Calculate Button */}
      <button 
        className="btn btn-primary calculate-btn"
        onClick={onCalculate}
      >
        Calculate ROI
        <span className="btn-icon">→</span>
      </button>
    </div>
  );
};

export default Calculator;