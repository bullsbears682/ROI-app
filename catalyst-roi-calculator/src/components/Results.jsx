import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { exportToPDF } from '../utils/pdfExport';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Results = ({ results, showResults, onExportPDF }) => {
  const chartRef = useRef(null);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Generate chart data for ROI over time
  const generateChartData = () => {
    if (!results) return null;

    const months = [];
    const cumulativeROI = [];
    const monthlyReturns = [];

    for (let i = 1; i <= results.inputs.timeframe; i++) {
      months.push(`Month ${i}`);
      
      // Calculate cumulative returns (assumes linear growth for simplicity)
      const monthlyReturn = results.monthlyReturn;
      const cumulative = monthlyReturn * i;
      const roi = (cumulative / results.investment) * 100;
      
      cumulativeROI.push(roi);
      monthlyReturns.push(monthlyReturn);
    }

    return {
      lineChart: {
        labels: months,
        datasets: [
          {
            label: 'Cumulative ROI %',
            data: cumulativeROI,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }
        ]
      },
      barChart: {
        labels: months,
        datasets: [
          {
            label: 'Monthly Returns',
            data: monthlyReturns,
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderColor: '#667eea',
            borderWidth: 1
          }
        ]
      }
    };
  };

  const chartData = generateChartData();

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  // Handle PDF export
  const handlePDFExport = async () => {
    if (results) {
      try {
        await exportToPDF(results, chartRef.current);
      } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Error generating PDF. Please try again.');
      }
    }
  };

  if (!showResults || !results) {
    return (
      <div className="card results-placeholder">
        <h2>Results</h2>
        <div className="placeholder-content">
          <div className="placeholder-icon">📊</div>
          <p>Select a scenario and click "Calculate ROI" to see your investment analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card results-card" ref={chartRef}>
      <div className="results-header">
        <h2>Investment Analysis</h2>
        <button 
          className="btn btn-secondary export-btn"
          onClick={handlePDFExport}
        >
          📄 Export PDF
        </button>
      </div>

      {/* Key Metrics */}
      <div className="results-grid">
        <div className="result-card primary">
          <div className="result-value">{formatPercent(results.roiPercentage)}</div>
          <div className="result-label">Total ROI</div>
        </div>
        
        <div className="result-card">
          <div className="result-value">{formatCurrency(results.netProfit)}</div>
          <div className="result-label">Net Profit</div>
        </div>
        
        <div className="result-card">
          <div className="result-value">{results.paybackPeriod.toFixed(1)}</div>
          <div className="result-label">Payback (months)</div>
        </div>
        
        <div className="result-card">
          <div className="result-value">{formatPercent(results.annualizedROI)}</div>
          <div className="result-label">Annualized ROI</div>
        </div>
      </div>

      {/* Investment Breakdown */}
      <div className="investment-breakdown">
        <h3>Investment Breakdown</h3>
        <div className="breakdown-items">
          <div className="breakdown-item">
            <span className="breakdown-label">Initial Investment</span>
            <span className="breakdown-value">{formatCurrency(results.investment)}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Expected Returns</span>
            <span className="breakdown-value positive">{formatCurrency(results.expectedReturns)}</span>
          </div>
          <div className="breakdown-item total">
            <span className="breakdown-label">Total Value</span>
            <span className="breakdown-value">{formatCurrency(results.totalReturns)}</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      {chartData && (
        <div className="charts-section">
          <div className="chart-container">
            <h3>ROI Over Time</h3>
            <div className="chart-wrapper">
              <Line data={chartData.lineChart} options={chartOptions} />
            </div>
          </div>
          
          <div className="chart-container">
            <h3>Monthly Returns</h3>
            <div className="chart-wrapper">
              <Bar data={chartData.barChart} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* Scenario Information */}
      <div className="scenario-info">
        <h3>About {results.scenario.name}</h3>
        <p className="scenario-description">{results.scenario.description}</p>
        
        <div className="scenario-metrics">
          <div className="metric-item">
            <span className="metric-label">Risk Level</span>
            <span className={`metric-value risk-${results.scenario.riskLevel}`}>
              {results.scenario.riskLevel.charAt(0).toUpperCase() + results.scenario.riskLevel.slice(1)}
            </span>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">Industry</span>
            <span className="metric-value">{results.inputs.industry}</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">Company Size</span>
            <span className="metric-value">{results.inputs.companySize}</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations">
        <h3>Recommendations</h3>
        <div className="recommendation-items">
          {results.roiPercentage > 200 && (
            <div className="recommendation positive">
              <span className="rec-icon">✅</span>
              <span className="rec-text">Excellent ROI potential - Strong investment opportunity</span>
            </div>
          )}
          
          {results.roiPercentage >= 100 && results.roiPercentage <= 200 && (
            <div className="recommendation good">
              <span className="rec-icon">👍</span>
              <span className="rec-text">Good ROI - Consider timeline and implementation costs</span>
            </div>
          )}
          
          {results.roiPercentage < 100 && (
            <div className="recommendation warning">
              <span className="rec-icon">⚠️</span>
              <span className="rec-text">Moderate ROI - Evaluate alternative scenarios or optimization opportunities</span>
            </div>
          )}
          
          {results.paybackPeriod > 24 && (
            <div className="recommendation info">
              <span className="rec-icon">💡</span>
              <span className="rec-text">Long payback period - Consider phased implementation</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;