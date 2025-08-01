import React, { useState } from 'react';

const ApiDocs = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState('calculate');

  const endpoints = {
    calculate: {
      method: 'POST',
      path: '/api/roi/calculate',
      description: 'Calculate ROI for a specific business scenario',
      request: {
        scenario: 'ai-chatbot',
        investment: 50000,
        timeframe: 12,
        industry: 'saas',
        companySize: 'medium',
        currency: 'USD'
      },
      response: {
        success: true,
        roiPercentage: 285,
        paybackPeriod: 8,
        projectedSavings: 142500,
        projectedRevenue: 285000,
        successRate: 82,
        riskLevel: 'medium',
        benefits: [
          '40-60% reduction in support tickets',
          '24/7 customer service availability',
          'Faster response times (< 1 minute)'
        ],
        timeline: {
          implementation: '3-6 months',
          breakeven: '8 months',
          fullROI: '12 months'
        },
        researchBacking: true,
        leadScore: 85,
        timestamp: '2024-12-19T10:30:00Z'
      }
    },
    scenarios: {
      method: 'GET',
      path: '/api/scenarios',
      description: 'List available ROI scenarios with filtering options',
      request: {
        industry: 'saas',
        budget_min: 10000,
        budget_max: 100000,
        risk_level: 'medium'
      },
      response: {
        success: true,
        total: 12,
        scenarios: [
          {
            id: 'ai-chatbot',
            name: 'AI Chatbot/Customer Service',
            category: 'ai',
            costRange: { min: 15000, max: 50000 },
            expectedROI: { min: 180, max: 340 },
            riskLevel: 'medium',
            industry: ['saas', 'retail', 'financial']
          }
        ]
      }
    },
    leads: {
      method: 'POST',
      path: '/api/leads',
      description: 'Capture and score leads from ROI calculations',
      request: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@company.com',
        company: 'Tech Corp',
        jobTitle: 'VP of Marketing',
        industry: 'saas',
        companySize: 'medium',
        calculationData: {
          scenario: 'ai-chatbot',
          roiPercentage: 285,
          investment: 50000
        }
      },
      response: {
        success: true,
        leadId: 'lead_12345abcdef',
        leadScore: 85,
        qualification: 'high',
        nextSteps: [
          'Schedule demo call',
          'Send case studies',
          'Provide implementation timeline'
        ],
        timestamp: '2024-12-19T10:30:00Z'
      }
    },
    analytics: {
      method: 'GET',
      path: '/api/analytics',
      description: 'Usage analytics and reporting data',
      request: {
        date_from: '2024-12-01',
        date_to: '2024-12-19',
        group_by: 'day'
      },
      response: {
        success: true,
        calculations: 1247,
        leads: 89,
        conversionRate: 7.1,
        topScenarios: [
          { scenario: 'ai-chatbot', count: 324 },
          { scenario: 'marketing-automation', count: 198 }
        ],
        industryBreakdown: {
          saas: 45,
          retail: 28,
          financial: 16
        }
      }
    },
    branding: {
      method: 'GET',
      path: '/api/branding/:client',
      description: 'White-label branding configuration',
      request: {
        client: 'hubspot'
      },
      response: {
        success: true,
        branding: {
          name: 'HubSpot ROI Calculator',
          logo: 'https://cdn.hubspot.com/logo.svg',
          colors: {
            primary: '#ff5c35',
            secondary: '#0091ae',
            background: '#ffffff'
          },
          domain: 'roi.hubspot.com',
          customScenarios: ['inbound-marketing', 'sales-automation']
        }
      }
    }
  };

  const authExamples = {
    apiKey: 'X-API-Key: hubspot_live_1a2b3c4d5e6f7g8h9i0j',
    bearer: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    domain: 'Origin: https://app.hubspot.com'
  };

  const codeExamples = {
    javascript: `// JavaScript/React Integration
import { CatalystAPI } from '@catalyst/api-client';

const client = new CatalystAPI({
  apiKey: 'your_api_key_here',
  baseURL: 'https://api.catalyst-roi.com'
});

const result = await client.calculateROI({
  scenario: 'ai-chatbot',
  investment: 50000,
  timeframe: 12,
  industry: 'saas'
});

console.log(\`ROI: \${result.roiPercentage}%\`);`,

    python: `# Python Integration
import requests

headers = {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json'
}

data = {
    'scenario': 'ai-chatbot',
    'investment': 50000,
    'timeframe': 12,
    'industry': 'saas'
}

response = requests.post(
    'https://api.catalyst-roi.com/api/roi/calculate',
    headers=headers,
    json=data
)

result = response.json()
print(f"ROI: {result['roiPercentage']}%")`,

    curl: `# cURL Command
curl -X POST https://api.catalyst-roi.com/api/roi/calculate \\
  -H "X-API-Key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "scenario": "ai-chatbot",
    "investment": 50000,
    "timeframe": 12,
    "industry": "saas"
  }'`,

    webhook: `# Webhook Configuration
{
  "webhook_url": "https://api.hubspot.com/webhooks/roi-leads",
  "events": ["lead.created", "calculation.completed"],
  "headers": {
    "Authorization": "Bearer hubspot_token_here"
  }
}`
  };

  return (
    <div className="api-docs">
      <div className="api-header">
        <div className="api-title">
          <h1>📡 Catalyst ROI Calculator API</h1>
          <p>Enterprise-grade API for ROI calculations, lead management, and analytics integration</p>
          <div className="api-version">
            <span className="version-badge">v1.0</span>
            <span className="status-badge">Production Ready</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="api-tabs">
        <button 
          className={`api-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`api-tab ${activeTab === 'endpoints' ? 'active' : ''}`}
          onClick={() => setActiveTab('endpoints')}
        >
          🔧 Endpoints
        </button>
        <button 
          className={`api-tab ${activeTab === 'auth' ? 'active' : ''}`}
          onClick={() => setActiveTab('auth')}
        >
          🔐 Authentication
        </button>
        <button 
          className={`api-tab ${activeTab === 'examples' ? 'active' : ''}`}
          onClick={() => setActiveTab('examples')}
        >
          💻 Code Examples
        </button>
        <button 
          className={`api-tab ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          💰 Pricing
        </button>
      </div>

      {/* Content */}
      <div className="api-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="api-section">
            <h2>🚀 Enterprise API Integration</h2>
            <div className="feature-grid">
              <div className="feature-card">
                <h3>🧮 ROI Calculations</h3>
                <p>85+ business scenarios with real-time ROI analysis, success rates, and projections</p>
                <ul>
                  <li>Multi-industry scenarios</li>
                  <li>Risk assessment included</li>
                  <li>Research-backed results</li>
                </ul>
              </div>
              <div className="feature-card">
                <h3>👥 Lead Management</h3>
                <p>Intelligent lead capture with scoring, qualification, and CRM integration</p>
                <ul>
                  <li>Automatic lead scoring</li>
                  <li>Qualification workflows</li>
                  <li>Webhook notifications</li>
                </ul>
              </div>
              <div className="feature-card">
                <h3>🎨 White-Label Ready</h3>
                <p>Complete branding customization for seamless integration into your platform</p>
                <ul>
                  <li>Custom logos & colors</li>
                  <li>Domain configuration</li>
                  <li>Branded scenarios</li>
                </ul>
              </div>
              <div className="feature-card">
                <h3>📈 Analytics & Insights</h3>
                <p>Comprehensive usage analytics, conversion tracking, and business intelligence</p>
                <ul>
                  <li>Real-time dashboards</li>
                  <li>Conversion tracking</li>
                  <li>Industry benchmarks</li>
                </ul>
              </div>
            </div>

            <div className="use-cases">
              <h3>🎯 Perfect For:</h3>
              <div className="use-case-grid">
                <div className="use-case">
                  <strong>🏢 CRM Platforms</strong>
                  <p>Integrate ROI calculations directly into lead qualification workflows</p>
                </div>
                <div className="use-case">
                  <strong>📊 Marketing Tools</strong>
                  <p>Add ROI analysis to campaign planning and client reporting</p>
                </div>
                <div className="use-case">
                  <strong>💼 Consulting Firms</strong>
                  <p>White-label ROI tools for client presentations and proposals</p>
                </div>
                <div className="use-case">
                  <strong>🚀 SaaS Platforms</strong>
                  <p>Embedded ROI calculators to demonstrate product value</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Endpoints Tab */}
        {activeTab === 'endpoints' && (
          <div className="api-section">
            <div className="endpoints-layout">
              <div className="endpoint-list">
                <h3>📡 Available Endpoints</h3>
                {Object.entries(endpoints).map(([key, endpoint]) => (
                  <div 
                    key={key}
                    className={`endpoint-item ${selectedEndpoint === key ? 'active' : ''}`}
                    onClick={() => setSelectedEndpoint(key)}
                  >
                    <span className={`method ${endpoint.method.toLowerCase()}`}>
                      {endpoint.method}
                    </span>
                    <span className="path">{endpoint.path}</span>
                  </div>
                ))}
              </div>
              
              <div className="endpoint-details">
                {endpoints[selectedEndpoint] && (
                  <>
                    <h3>
                      <span className={`method ${endpoints[selectedEndpoint].method.toLowerCase()}`}>
                        {endpoints[selectedEndpoint].method}
                      </span>
                      {endpoints[selectedEndpoint].path}
                    </h3>
                    <p>{endpoints[selectedEndpoint].description}</p>
                    
                    <h4>📤 Request Example:</h4>
                    <pre className="code-block">
                      {JSON.stringify(endpoints[selectedEndpoint].request, null, 2)}
                    </pre>
                    
                    <h4>📥 Response Example:</h4>
                    <pre className="code-block">
                      {JSON.stringify(endpoints[selectedEndpoint].response, null, 2)}
                    </pre>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Authentication Tab */}
        {activeTab === 'auth' && (
          <div className="api-section">
            <h2>🔐 Authentication Methods</h2>
            
            <div className="auth-methods">
              <div className="auth-method">
                <h3>🔑 API Key Authentication</h3>
                <p>Simple and secure API key authentication for server-to-server integration</p>
                <pre className="code-block">
                  X-API-Key: {authExamples.apiKey}
                </pre>
                <ul>
                  <li>✅ Server-to-server integration</li>
                  <li>✅ Rate limiting: 1000 requests/hour</li>
                  <li>✅ Environment-specific keys (dev/staging/prod)</li>
                </ul>
              </div>

              <div className="auth-method">
                <h3>🎯 Domain-Based Licensing</h3>
                <p>Restrict API usage to specific domains for enhanced security</p>
                <pre className="code-block">
                  {authExamples.domain}
                  {'\n'}Allowed Domains: *.hubspot.com, app.hubspot.com
                </pre>
                <ul>
                  <li>✅ Domain whitelist protection</li>
                  <li>✅ Subdomain wildcard support</li>
                  <li>✅ CORS configuration included</li>
                </ul>
              </div>

              <div className="auth-method">
                <h3>🚀 Enterprise SSO</h3>
                <p>OAuth 2.0 and SAML integration for enterprise customers</p>
                <pre className="code-block">
                  Authorization: {authExamples.bearer}
                </pre>
                <ul>
                  <li>✅ OAuth 2.0 / OpenID Connect</li>
                  <li>✅ SAML 2.0 for enterprise SSO</li>
                  <li>✅ Custom identity provider support</li>
                </ul>
              </div>
            </div>

            <div className="rate-limits">
              <h3>⚡ Rate Limits</h3>
              <div className="rate-limit-table">
                <div className="rate-row">
                  <span className="plan">Starter</span>
                  <span className="limit">100 requests/hour</span>
                  <span className="burst">10 requests/minute</span>
                </div>
                <div className="rate-row">
                  <span className="plan">Professional</span>
                  <span className="limit">1,000 requests/hour</span>
                  <span className="burst">50 requests/minute</span>
                </div>
                <div className="rate-row">
                  <span className="plan">Enterprise</span>
                  <span className="limit">10,000 requests/hour</span>
                  <span className="burst">200 requests/minute</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Code Examples Tab */}
        {activeTab === 'examples' && (
          <div className="api-section">
            <h2>💻 Integration Examples</h2>
            
            <div className="code-examples">
              <div className="code-example">
                <h3>🟨 JavaScript/React</h3>
                <pre className="code-block">
                  {codeExamples.javascript}
                </pre>
              </div>

              <div className="code-example">
                <h3>🐍 Python</h3>
                <pre className="code-block">
                  {codeExamples.python}
                </pre>
              </div>

              <div className="code-example">
                <h3>🌐 cURL</h3>
                <pre className="code-block">
                  {codeExamples.curl}
                </pre>
              </div>

              <div className="code-example">
                <h3>🔗 Webhook Setup</h3>
                <pre className="code-block">
                  {codeExamples.webhook}
                </pre>
              </div>
            </div>

            <div className="sdk-info">
              <h3>📦 Official SDKs</h3>
              <div className="sdk-grid">
                <div className="sdk-item">
                  <strong>JavaScript/TypeScript</strong>
                  <code>npm install @catalyst/api-client</code>
                </div>
                <div className="sdk-item">
                  <strong>Python</strong>
                  <code>pip install catalyst-roi-api</code>
                </div>
                <div className="sdk-item">
                  <strong>PHP</strong>
                  <code>composer require catalyst/roi-calculator</code>
                </div>
                <div className="sdk-item">
                  <strong>Ruby</strong>
                  <code>gem install catalyst_roi</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="api-section">
            <h2>💰 API Pricing Plans</h2>
            
            <div className="pricing-grid">
              <div className="pricing-card">
                <h3>🚀 Starter</h3>
                <div className="price">$99<span>/month</span></div>
                <ul>
                  <li>✅ 1,000 calculations/month</li>
                  <li>✅ Basic analytics</li>
                  <li>✅ Email support</li>
                  <li>✅ Standard scenarios</li>
                  <li>❌ White-label branding</li>
                  <li>❌ Custom scenarios</li>
                </ul>
                <button className="pricing-btn">Start Free Trial</button>
              </div>

              <div className="pricing-card featured">
                <h3>💼 Professional</h3>
                <div className="price">$299<span>/month</span></div>
                <ul>
                  <li>✅ 10,000 calculations/month</li>
                  <li>✅ Advanced analytics</li>
                  <li>✅ Priority support</li>
                  <li>✅ All scenarios included</li>
                  <li>✅ Basic white-label</li>
                  <li>✅ Webhook integrations</li>
                </ul>
                <button className="pricing-btn primary">Most Popular</button>
              </div>

              <div className="pricing-card">
                <h3>🏢 Enterprise</h3>
                <div className="price">Custom</div>
                <ul>
                  <li>✅ Unlimited calculations</li>
                  <li>✅ Full white-label</li>
                  <li>✅ Dedicated support</li>
                  <li>✅ Custom scenarios</li>
                  <li>✅ SSO integration</li>
                  <li>✅ Source code license</li>
                </ul>
                <button className="pricing-btn">Contact Sales</button>
              </div>
            </div>

            <div className="enterprise-features">
              <h3>🎯 Enterprise Add-Ons</h3>
              <div className="addon-grid">
                <div className="addon-item">
                  <strong>Source Code License</strong>
                  <span>$50,000 one-time</span>
                  <p>Complete source code with unlimited modifications</p>
                </div>
                <div className="addon-item">
                  <strong>Custom Scenarios</strong>
                  <span>$5,000 per scenario</span>
                  <p>Industry-specific ROI scenarios built for your business</p>
                </div>
                <div className="addon-item">
                  <strong>Dedicated Infrastructure</strong>
                  <span>$2,000/month</span>
                  <p>Private cloud deployment with guaranteed uptime</p>
                </div>
                <div className="addon-item">
                  <strong>Integration Support</strong>
                  <span>$10,000 setup</span>
                  <p>Custom CRM integration and technical implementation</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="api-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>📞 Contact Sales</h4>
            <p>Ready to integrate? Let's discuss your specific needs.</p>
            <button className="btn btn-primary">Schedule Demo</button>
          </div>
          <div className="footer-section">
            <h4>📚 Resources</h4>
            <ul>
              <li><a href="#postman">Postman Collection</a></li>
              <li><a href="#swagger">OpenAPI Spec</a></li>
              <li><a href="#changelog">API Changelog</a></li>
              <li><a href="#status">System Status</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>🔗 Quick Links</h4>
            <ul>
              <li><a href="#calculator">Try Calculator</a></li>
              <li><a href="#scenarios">View Scenarios</a></li>
              <li><a href="#admin">Admin Dashboard</a></li>
              <li><a href="#support">Get Support</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;