import React, { useState, useMemo } from 'react';
import { roiCategories, roiScenarios } from '../data/roiScenarios';

const Scenarios = ({ onSelectScenario }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // name, roi, category

  // Filter and sort scenarios
  const filteredScenarios = useMemo(() => {
    let scenarios = Object.entries(roiScenarios);

    // Filter by search term
    if (searchTerm) {
      scenarios = scenarios.filter(([key, scenario]) => 
        scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scenario.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roiCategories[scenario.category]?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      scenarios = scenarios.filter(([key, scenario]) => scenario.category === selectedCategory);
    }

    // Sort scenarios
    scenarios.sort(([keyA, scenarioA], [keyB, scenarioB]) => {
      switch (sortBy) {
        case 'roi':
          return (scenarioB.expectedROI.max) - (scenarioA.expectedROI.max);
        case 'category':
          const categoryA = roiCategories[scenarioA.category]?.name || '';
          const categoryB = roiCategories[scenarioB.category]?.name || '';
          return categoryA.localeCompare(categoryB);
        default:
          return scenarioA.name.localeCompare(scenarioB.name);
      }
    });

    return scenarios;
  }, [searchTerm, selectedCategory, sortBy]);

  // Get scenario count by category
  const getScenarioCount = (categoryId) => {
    if (categoryId === 'all') return Object.keys(roiScenarios).length;
    return Object.values(roiScenarios).filter(s => s.category === categoryId).length;
  };

  const handleScenarioClick = (scenarioKey, scenario) => {
    if (onSelectScenario) {
      onSelectScenario(scenarioKey, scenario.category);
    }
  };

  return (
    <div className="scenarios-page">
      <div className="scenarios-header">
        <h1>Business ROI Scenarios</h1>
        <p className="scenarios-subtitle">
          Explore 85+ real-world business investment scenarios with detailed ROI analysis
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="scenarios-controls">
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search scenarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories ({getScenarioCount('all')})</option>
              {Object.entries(roiCategories).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.icon} {category.name} ({getScenarioCount(key)})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name A-Z</option>
              <option value="roi">Highest ROI</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="scenarios-summary">
        <span className="results-count">
          {filteredScenarios.length} scenario{filteredScenarios.length !== 1 ? 's' : ''} found
        </span>
        {searchTerm && (
          <span className="search-term">for "{searchTerm}"</span>
        )}
      </div>

      {/* Scenarios Grid */}
      <div className="scenarios-grid">
        {filteredScenarios.map(([key, scenario]) => {
          const category = roiCategories[scenario.category];
          const roiRange = `${scenario.expectedROI.min}-${scenario.expectedROI.max}%`;
          const costRange = `$${(scenario.costRange.min / 1000).toFixed(0)}K-$${(scenario.costRange.max / 1000).toFixed(0)}K`;
          
          return (
            <div key={key} className="scenario-card">
              <div className="scenario-header">
                <div className="scenario-category">
                  <span className="category-icon">{category?.icon}</span>
                  <span className="category-name">{category?.name}</span>
                </div>
                <div className="scenario-roi">
                  <span className="roi-value">{roiRange}</span>
                  <span className="roi-label">ROI</span>
                </div>
              </div>

              <div className="scenario-content">
                <h3 className="scenario-title">{scenario.name}</h3>
                <p className="scenario-description">{scenario.description}</p>

                <div className="scenario-metrics">
                  <div className="metric">
                    <span className="metric-label">Investment</span>
                    <span className="metric-value">{costRange}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Timeframe</span>
                    <span className="metric-value">{scenario.timeframe.min}-{scenario.timeframe.max} months</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Risk Level</span>
                    <span className={`metric-value risk-${scenario.riskLevel}`}>
                      {scenario.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="scenario-benefits">
                  <h4>Key Benefits:</h4>
                  <ul>
                    {scenario.benefits.slice(0, 2).map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                    {scenario.benefits.length > 2 && (
                      <li className="benefits-more">+{scenario.benefits.length - 2} more benefits</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="scenario-actions">
                <button 
                  className="btn btn-primary scenario-btn"
                  onClick={() => handleScenarioClick(key, scenario)}
                >
                  Calculate ROI
                </button>
                <div className="scenario-payback">
                  <span>Payback: {scenario.paybackPeriod} months</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredScenarios.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No scenarios found</h3>
          <p>Try adjusting your search terms or filters</p>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Category Overview */}
      {selectedCategory === 'all' && !searchTerm && (
        <div className="category-overview">
          <h2>Categories Overview</h2>
          <div className="category-grid">
            {Object.entries(roiCategories).map(([key, category]) => (
              <div 
                key={key} 
                className="category-card"
                onClick={() => setSelectedCategory(key)}
              >
                <div className="category-icon-large">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className="category-count">
                  {getScenarioCount(key)} scenarios
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scenarios;