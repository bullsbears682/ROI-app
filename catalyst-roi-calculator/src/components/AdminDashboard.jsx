import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ onLogout }) => {
  const [leads, setLeads] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [activeTab, setActiveTab] = useState('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    // Load lead data
    const savedLeads = JSON.parse(localStorage.getItem('catalyst-leads') || '[]');
    setLeads(savedLeads);

    // Load analytics data
    const savedAnalytics = JSON.parse(localStorage.getItem('catalyst-analytics') || '[]');
    setAnalytics(savedAnalytics);
  }, []);

  // Filter leads based on search and filter criteria
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterBy === 'all' || 
      (filterBy === 'high-score' && lead.leadScore >= 80) ||
      (filterBy === 'recent' && new Date(lead.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesFilter;
  });

  // Download leads as CSV
  const downloadLeadsCSV = () => {
    const headers = ['Name', 'Email', 'Company', 'Job Title', 'Phone', 'Company Size', 'Industry', 'Lead Score', 'Date', 'ROI %', 'Scenario'];
    const csvData = leads.map(lead => [
      `${lead.firstName} ${lead.lastName}`,
      lead.email,
      lead.company,
      lead.jobTitle || '',
      lead.phoneNumber || '',
      lead.companySize,
      lead.industry,
      lead.leadScore,
      new Date(lead.timestamp).toLocaleDateString(),
      lead.roiPercentage || '',
      lead.scenario || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `catalyst-leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Clear all data
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all lead data? This cannot be undone.')) {
      localStorage.removeItem('catalyst-leads');
      localStorage.removeItem('catalyst-analytics');
      setLeads([]);
      setAnalytics([]);
    }
  };

  // Analytics summaries
  const leadStats = {
    total: leads.length,
    highScore: leads.filter(l => l.leadScore >= 80).length,
    recent: leads.filter(l => new Date(l.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    avgScore: leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.leadScore, 0) / leads.length) : 0
  };

  const roiCalculations = analytics.filter(a => a.type === 'roi_calculation').length;
  const navigationEvents = analytics.filter(a => a.type === 'navigation').length;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title">
          <h1>🔐 Catalyst Admin Dashboard</h1>
          <p>Lead Management & Analytics</p>
        </div>
        <div className="admin-actions">
          <button className="btn btn-secondary" onClick={downloadLeadsCSV}>
            📊 Download CSV
          </button>
          <button className="btn btn-secondary" onClick={clearAllData}>
            🗑️ Clear Data
          </button>
          <button className="btn btn-primary" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{leadStats.total}</div>
          <div className="stat-label">Total Leads</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{leadStats.highScore}</div>
          <div className="stat-label">High Score (80+)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{leadStats.recent}</div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{leadStats.avgScore}</div>
          <div className="stat-label">Avg Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{roiCalculations}</div>
          <div className="stat-label">ROI Calculations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{navigationEvents}</div>
          <div className="stat-label">Page Views</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          📋 Leads ({leads.length})
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics ({analytics.length})
        </button>
      </div>

      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <div className="admin-content">
          <div className="admin-filters">
            <div className="filter-group">
              <input
                type="text"
                placeholder="🔍 Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="filter-select">
                <option value="all">All Leads</option>
                <option value="high-score">High Score (80+)</option>
                <option value="recent">Recent (7 days)</option>
              </select>
            </div>
          </div>

          <div className="leads-table">
            {filteredLeads.length === 0 ? (
              <div className="no-data">
                <p>📭 No leads found matching your criteria</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Score</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Industry</th>
                    <th>ROI %</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, index) => (
                    <tr key={index}>
                      <td>
                        <span className={`lead-score ${lead.leadScore >= 80 ? 'high' : lead.leadScore >= 60 ? 'medium' : 'low'}`}>
                          {lead.leadScore}
                        </span>
                      </td>
                      <td>
                        <div className="lead-name">
                          <div>{lead.firstName} {lead.lastName}</div>
                          <div className="lead-title">{lead.jobTitle}</div>
                        </div>
                      </td>
                      <td>
                        <a href={`mailto:${lead.email}`} className="lead-email">
                          {lead.email}
                        </a>
                      </td>
                      <td>
                        <div className="lead-company">
                          <div>{lead.company}</div>
                          <div className="company-size">{lead.companySize}</div>
                        </div>
                      </td>
                      <td>{lead.industry}</td>
                      <td>
                        {lead.roiPercentage ? (
                          <span className="roi-value">+{lead.roiPercentage}%</span>
                        ) : '-'}
                      </td>
                      <td>{new Date(lead.timestamp).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="btn btn-sm"
                          onClick={() => window.open(`mailto:${lead.email}?subject=Following up on your ROI analysis`)}
                        >
                          📧 Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="admin-content">
          <div className="analytics-grid">
            <div className="analytics-section">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {analytics.slice(-10).reverse().map((event, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {event.type === 'roi_calculation' ? '🧮' : 
                       event.type === 'navigation' ? '🔄' : 
                       event.type === 'lead_capture' ? '👤' : '📊'}
                    </div>
                    <div className="activity-details">
                      <div className="activity-type">{event.type.replace('_', ' ')}</div>
                      <div className="activity-time">{new Date(event.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;