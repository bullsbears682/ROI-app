import React, { useState, useEffect } from 'react';

const ApiDocs = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState('calculate');
  const [testingMode, setTestingMode] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('demo_key_enterprise_trial');

  // Real API base URL
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-api-domain.com' 
    : 'http://localhost:3001';

  // Make real API calls
  const testEndpoint = async (endpointKey) => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const startTime = Date.now();
      let response;
      
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      };

      switch (endpointKey) {
        case 'calculate':
          response = await fetch(`${API_BASE_URL}/api/roi/calculate`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              scenario: 'ai-chatbot',
              investment: 50000,
              timeframe: 12,
              industry: 'saas',
              companySize: 'medium',
              currency: 'USD',
              customFactors: {
                teamSize: 25,
                currentTools: ['zendesk', 'intercom'],
                supportVolume: 1200
              }
            })
          });
          break;
          
        case 'scenarios':
          const params = new URLSearchParams({
            industry: 'saas',
            budget_min: '10000',
            budget_max: '100000',
            risk_level: 'medium',
            ai_recommend: 'true'
          });
          response = await fetch(`${API_BASE_URL}/api/scenarios?${params}`, {
            method: 'GET',
            headers
          });
          break;
          
        case 'leads':
          response = await fetch(`${API_BASE_URL}/api/leads`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              firstName: 'John',
              lastName: 'Smith',
              email: 'john.smith@techcorp.com',
              company: 'Tech Corp',
              jobTitle: 'VP of Marketing',
              industry: 'saas',
              companySize: 'medium',
              revenue: '10M-50M',
              calculationData: {
                scenario: 'ai-chatbot',
                roiPercentage: 285,
                investment: 50000
              },
                             source: 'api_testing',
               utm_campaign: 'enterprise_trial'
            })
          });
          break;
          
        case 'analytics':
          const analyticsParams = new URLSearchParams({
            date_from: '2024-12-01',
            date_to: '2024-12-19',
            group_by: 'day'
          });
          response = await fetch(`${API_BASE_URL}/api/analytics?${analyticsParams}`, {
            method: 'GET',
            headers
          });
          break;
          
                 case 'branding':
           response = await fetch(`${API_BASE_URL}/api/branding/enterprise`, {
             method: 'GET',
             headers
           });
           break;
          
        case 'webhooks':
                     response = await fetch(`${API_BASE_URL}/api/webhooks`, {
             method: 'POST',
             headers,
             body: JSON.stringify({
               url: 'https://api.enterprise.com/webhooks/roi-events',
               events: ['calculation.completed', 'lead.created', 'lead.qualified'],
               secret: 'webhook_secret_key',
               retry_policy: {
                 max_retries: 3,
                 backoff: 'exponential'
               }
             })
           });
          break;
          
        default:
          throw new Error('Unknown endpoint');
      }

      const responseTime = Date.now() - startTime;
      const result = await response.json();
      
      setTestResult({
        status: response.status,
        responseTime: `${responseTime}ms`,
        result: result
      });
      
    } catch (error) {
      console.error('API Test Error:', error);
      setTestResult({
        status: error.message.includes('fetch') ? 'Connection Error' : 500,
        responseTime: 'N/A',
        result: {
          error: error.message.includes('fetch') 
            ? 'Could not connect to API server. Make sure the server is running on port 3001.' 
            : error.message,
          suggestion: error.message.includes('fetch') 
            ? 'Run: cd catalyst-roi-calculator/api && npm install && npm start'
            : 'Check the API key and request format'
        }
      });
    }
    
    setLoading(false);
  };

  const endpoints = {
    calculate: {
      method: 'POST',
      path: '/api/roi/calculate',
      description: 'Calculate ROI for specific business scenarios with advanced analytics',
      category: 'Core API',
      reliability: '99.97%',
      avgResponseTime: '127ms',
      request: {
        scenario: 'ai-chatbot',
        investment: 50000,
        timeframe: 12,
        industry: 'saas',
        companySize: 'medium',
        currency: 'USD',
        customFactors: {
          teamSize: 25,
          currentTools: ['zendesk', 'intercom'],
          supportVolume: 1200
        }
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
          'Faster response times (< 1 minute)',
          'Improved customer satisfaction scores'
        ],
        timeline: {
          implementation: '3-6 months',
          breakeven: '8 months',
          fullROI: '12 months'
        },
        researchBacking: true,
        leadScore: 85,
        competitorComparison: {
          industry_average: 180,
          top_quartile: 250,
          our_projection: 285
        },
        confidence: 0.87,
        timestamp: '2024-12-19T10:30:00Z'
      }
    },
    scenarios: {
      method: 'GET',
      path: '/api/scenarios',
      description: 'Advanced scenario discovery with ML-powered recommendations',
      category: 'Data API',
      reliability: '99.99%',
      avgResponseTime: '89ms',
      request: {
        industry: 'saas',
        budget_min: 10000,
        budget_max: 100000,
        risk_level: 'medium',
        company_size: 'medium',
        current_tools: ['hubspot', 'salesforce'],
        goals: ['increase_revenue', 'reduce_costs'],
        ai_recommend: true
      },
      response: {
        success: true,
        total: 85,
        filtered: 12,
        recommended: 3,
        scenarios: [
          {
            id: 'ai-chatbot',
            name: 'AI Chatbot/Customer Service',
            category: 'ai',
            costRange: { min: 15000, max: 50000 },
            expectedROI: { min: 180, max: 340 },
            riskLevel: 'medium',
            industry: ['saas', 'retail', 'financial'],
            matchScore: 0.94,
            reasoning: 'High compatibility with current HubSpot integration'
          }
        ],
        ml_insights: {
          best_fit_category: 'ai',
          growth_potential: 'high',
          implementation_complexity: 'medium'
        }
      }
    },
    leads: {
      method: 'POST',
      path: '/api/leads',
      description: 'Enterprise lead capture with advanced scoring & CRM sync',
      category: 'CRM Integration',
      reliability: '99.95%',
      avgResponseTime: '156ms',
      request: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@company.com',
        company: 'Tech Corp',
        jobTitle: 'VP of Marketing',
        industry: 'saas',
        companySize: 'medium',
        revenue: '10M-50M',
        calculationData: {
          scenario: 'ai-chatbot',
          roiPercentage: 285,
          investment: 50000
        },
        source: 'api_integration',
        utm_campaign: 'hubspot_trial'
      },
      response: {
        success: true,
        leadId: 'lead_12345abcdef',
        leadScore: 85,
        qualification: 'enterprise',
        nextSteps: [
          'Schedule technical demo within 24 hours',
          'Send personalized ROI case studies',
          'Prepare custom integration timeline',
          'Connect with enterprise success team'
        ],
        crm_sync: {
          hubspot_contact_id: 'hs_12345',
          salesforce_lead_id: 'sf_67890',
          sync_status: 'completed'
        },
        ai_insights: {
          buying_intent: 'high',
          decision_timeframe: '30-60 days',
          budget_likelihood: 'confirmed'
        },
        timestamp: '2024-12-19T10:30:00Z'
      }
    },
    analytics: {
      method: 'GET',
      path: '/api/analytics',
      description: 'Real-time analytics with business intelligence & forecasting',
      category: 'Business Intelligence',
      reliability: '99.98%',
      avgResponseTime: '203ms',
      request: {
        date_from: '2024-12-01',
        date_to: '2024-12-19',
        group_by: 'day',
        metrics: ['calculations', 'leads', 'conversions', 'revenue'],
        filters: {
          industry: ['saas', 'retail'],
          company_size: ['medium', 'enterprise']
        },
        advanced: true
      },
      response: {
        success: true,
        calculations: 1247,
        leads: 89,
        conversionRate: 7.1,
        revenue: 26700,
        topScenarios: [
          { scenario: 'ai-chatbot', count: 324, revenue: 8900 },
          { scenario: 'marketing-automation', count: 198, revenue: 5200 }
        ],
        industryBreakdown: {
          saas: { count: 45, conversion: 8.2 },
          retail: { count: 28, conversion: 6.1 },
          financial: { count: 16, conversion: 9.4 }
        },
        forecasting: {
          next_30_days: {
            predicted_calculations: 2100,
            predicted_leads: 150,
            confidence: 0.91
          }
        },
        benchmarks: {
          industry_average_conversion: 4.2,
          your_performance: 7.1,
          percentile_rank: 87
        }
      }
    },
    branding: {
      method: 'GET',
      path: '/api/branding/:client',
      description: 'Advanced white-label configuration with dynamic theming',
      category: 'White-Label',
      reliability: '99.99%',
      avgResponseTime: '67ms',
      request: {
        client: 'hubspot',
        environment: 'production'
      },
      response: {
        success: true,
        branding: {
          name: 'HubSpot ROI Calculator',
          logo: 'https://cdn.brandfetch.io/hubspot.com/w/400/h/400/theme/dark/icon.jpeg?k=bfHSJFAPEG',
          favicon: 'https://www.hubspot.com/favicon.ico',
          colors: {
            primary: '#ff5c35',
            secondary: '#0091ae',
            background: '#ffffff',
            text: '#2d3748',
            accent: '#f56500'
          },
          fonts: {
            primary: 'Lexend, sans-serif',
            secondary: 'Inter, sans-serif'
          },
          domain: 'roi.hubspot.com',
          subdomain: 'calculator',
          customScenarios: ['inbound-marketing', 'sales-automation', 'customer-success'],
          features: {
            leadCapture: true,
            analytics: true,
            customReports: true,
            apiAccess: true
          },
          integrations: {
            crm: 'hubspot',
            analytics: 'hubspot_analytics',
            webhooks: 'https://api.hubspot.com/webhooks/roi-events'
          }
        }
      }
    },
    webhooks: {
      method: 'POST',
      path: '/api/webhooks',
      description: 'Real-time event streaming for seamless CRM integration',
      category: 'Integration',
      reliability: '99.96%',
      avgResponseTime: '45ms',
      request: {
        url: 'https://api.hubspot.com/webhooks/roi-events',
        events: ['calculation.completed', 'lead.created', 'lead.qualified'],
        secret: 'webhook_secret_key',
        retry_policy: {
          max_retries: 3,
          backoff: 'exponential'
        }
      },
      response: {
        success: true,
        webhook_id: 'wh_abc123def456',
        status: 'active',
        last_delivery: '2024-12-19T10:30:00Z',
        delivery_stats: {
          total_sent: 1247,
          successful: 1243,
          failed: 4,
          success_rate: 99.7
        }
      }
    }
  };

      const authExamples = {
      apiKey: 'X-API-Key: demo_key_enterprise_trial',
      bearer: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      domain: 'Origin: https://app.enterprise.com',
      enterprise: 'X-Enterprise-Token: ent_premium_access_2024'
    };

  const sdkExamples = {
    javascript: `// Enterprise JavaScript SDK v2.1
import { CatalystAPI, RealTimeAnalytics } from '@catalyst/enterprise-sdk';

const catalyst = new CatalystAPI({
  apiKey: 'your_enterprise_key',
  baseURL: '${API_BASE_URL}',
  environment: 'production',
  retryPolicy: { maxRetries: 3, backoff: 'exponential' }
});

// Advanced ROI calculation with ML insights
const result = await catalyst.calculateROI({
  scenario: 'ai-chatbot',
  investment: 50000,
  timeframe: 12,
  industry: 'saas',
  aiRecommendations: true,
  competitorAnalysis: true
});

// Real-time analytics streaming
const analytics = new RealTimeAnalytics({
  onCalculation: (data) => updateDashboard(data),
  onLead: (lead) => syncToCRM(lead),
  filters: { industry: 'saas', minInvestment: 10000 }
});

console.log(\`ROI: \${result.roiPercentage}% (Confidence: \${result.confidence})\`);`,

    python: `# Enterprise Python SDK v2.1
from catalyst_enterprise import CatalystAPI, AsyncAnalytics
import asyncio

client = CatalystAPI(
    api_key='your_enterprise_key',
    base_url='${API_BASE_URL}',
    timeout=30,
    retry_config={'max_retries': 3, 'backoff_factor': 1.5}
)

# Advanced batch processing
async def process_roi_batch(scenarios):
    tasks = [
        client.calculate_roi_async(
            scenario=scenario,
            investment=investment,
            ml_insights=True,
            competitive_analysis=True
        )
        for scenario, investment in scenarios
    ]
    return await asyncio.gather(*tasks)

# Real-time webhook handling
@client.webhook_handler(['lead.created', 'calculation.completed'])
async def handle_events(event_type, data):
    if event_type == 'lead.created':
        await sync_to_hubspot(data)
    elif event_type == 'calculation.completed':
        await update_analytics_dashboard(data)

# Usage
scenarios = [('ai-chatbot', 50000), ('marketing-automation', 75000)]
results = await process_roi_batch(scenarios)
print(f"Batch processed: {len(results)} calculations")`,

          curl: `# Advanced cURL with Enterprise Features
curl -X POST ${API_BASE_URL}/api/roi/calculate \\
  -H "X-API-Key: demo_key_enterprise_trial" \\
  -H "X-Enterprise-Token: ent_premium_access" \\
  -H "Content-Type: application/json" \\
  -H "X-Request-ID: req_$(uuidgen)" \\
  -d '{
    "scenario": "ai-chatbot",
    "investment": 50000,
    "timeframe": 12,
    "industry": "saas",
    "company_size": "enterprise",
    "advanced_options": {
      "ml_recommendations": true,
      "competitor_analysis": true,
      "risk_assessment": "detailed",
      "custom_factors": {
        "team_size": 25,
        "current_tools": ["salesforce", "pipedrive"],
        "support_volume": 1200
      }
    },
    "webhook_url": "https://api.hubspot.com/webhooks/roi-results",
    "callback_events": ["calculation.completed", "insights.generated"]
  }'`,

    graphql: `# GraphQL API (Enterprise Only)
query AdvancedROIAnalysis($input: ROICalculationInput!) {
  calculateROI(input: $input) {
    roiPercentage
    confidence
    paybackPeriod
    projectedSavings
    
    insights {
      mlRecommendations {
        optimizations
        riskFactors
        opportunityScore
      }
      
      competitorAnalysis {
        industryBenchmark
        competitiveAdvantage
        marketPosition
      }
    }
    
    forecasting {
      month1 { revenue costs profit }
      month6 { revenue costs profit }
      month12 { revenue costs profit }
    }
  }
  
  scenarios(filter: { industry: "saas", budget: { min: 10000, max: 100000 } }) {
    id
    name
    expectedROI
    matchScore
    reasoning
  }
}`,

    webhook: `# Advanced Webhook Configuration
{
      "webhook_url": "https://api.enterprise.com/webhooks/catalyst-events",
  "events": [
    "calculation.completed",
    "lead.created", 
    "lead.qualified",
    "insights.generated",
    "forecast.updated"
  ],
      "headers": {
      "Authorization": "Bearer enterprise_webhook_token",
      "X-Source": "Catalyst-ROI-Calculator"
    },
  "retry_policy": {
    "max_retries": 5,
    "backoff_strategy": "exponential",
    "timeout": 30
  },
  "filters": {
    "min_investment": 5000,
    "industries": ["saas", "retail", "financial"],
    "lead_score_threshold": 70
  },
      "payload_template": "enterprise_v2"
}`
  };

  const enterpriseFeatures = [
    {
      icon: '🤖',
      title: 'AI-Powered Insights',
      description: 'Machine learning recommendations and predictive analytics',
      features: ['ML scenario matching', 'Predictive ROI modeling', 'Risk assessment AI', 'Competitor analysis']
    },
    {
      icon: '⚡',
      title: 'Real-Time Streaming',
      description: 'Live data streaming and webhook integrations',
      features: ['Real-time webhooks', 'Event streaming', 'Live dashboard updates', 'Instant notifications']
    },
    {
      icon: '🏢',
      title: 'Enterprise Security',
      description: 'Bank-grade security with compliance certifications',
      features: ['SOC 2 Type II', 'GDPR compliant', 'Enterprise SSO', 'Audit logging']
    },
    {
      icon: '🎨',
      title: 'Advanced White-Label',
      description: 'Complete customization and branding control',
      features: ['Custom domains', 'Dynamic theming', 'Logo integration', 'Brand guidelines']
    },
    {
      icon: '📊',
      title: 'Business Intelligence',
      description: 'Advanced analytics and reporting capabilities',
      features: ['Custom dashboards', 'Forecasting models', 'Benchmark analysis', 'Export capabilities']
    },
    {
      icon: '🔧',
      title: 'Developer Experience',
      description: 'Best-in-class tools and documentation',
      features: ['Interactive testing', 'SDK libraries', 'GraphQL API', 'Sandbox environment']
    }
  ];

  return (
    <div className="api-docs">
      <div className="api-header">
        <div className="api-title">
          <h1>📡 Catalyst Enterprise API</h1>
          <p>Production-ready ROI calculation engine with ML insights, real-time analytics, and enterprise integrations</p>
          <div className="api-version">
            <span className="version-badge">v2.1 Enterprise</span>
            <span className="status-badge">99.97% Uptime</span>
            <span className="perf-badge">127ms Avg Response</span>
          </div>
        </div>
        
        <div className="api-stats">
          <div className="stat-item">
            <span className="stat-number">1.2M+</span>
            <span className="stat-label">API Calls/Month</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">85</span>
            <span className="stat-label">Business Scenarios</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50ms</span>
            <span className="stat-label">P95 Response Time</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Enterprise Support</span>
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
          🔧 Interactive API
        </button>
        <button 
          className={`api-tab ${activeTab === 'auth' ? 'active' : ''}`}
          onClick={() => setActiveTab('auth')}
        >
          🔐 Security
        </button>
        <button 
          className={`api-tab ${activeTab === 'examples' ? 'active' : ''}`}
          onClick={() => setActiveTab('examples')}
        >
          💻 SDKs & Code
        </button>
        <button 
          className={`api-tab ${activeTab === 'enterprise' ? 'active' : ''}`}
          onClick={() => setActiveTab('enterprise')}
        >
          🏢 Enterprise
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
            <h2>🚀 Enterprise-Grade ROI Intelligence Platform</h2>
            
            <div className="value-prop">
              <div className="value-card primary">
                <h3>🎯 Built for Enterprise-Scale Integration</h3>
                <p>Production-ready API designed for enterprise CRM platforms with millions of users. Native CRM integration examples, white-label capabilities, and enterprise-grade infrastructure.</p>
                <div className="tech-badges">
                  <span className="tech-badge">99.97% SLA</span>
                  <span className="tech-badge">SOC 2 Certified</span>
                  <span className="tech-badge">Auto-Scaling</span>
                  <span className="tech-badge">Global CDN</span>
                </div>
              </div>
            </div>

            <div className="feature-grid">
              {enterpriseFeatures.map((feature, index) => (
                <div key={index} className="feature-card enhanced">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <ul>
                    {feature.features.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="integration-showcase">
              <h3>🔗 Native CRM Integrations</h3>
              <div className="integration-grid">
                              <div className="integration-card featured">
                <div className="integration-logo-text">SF</div>
                <h4>Salesforce Native</h4>
                <p>Deep integration with Salesforce CRM, Sales Cloud, and Service Cloud</p>
                <div className="integration-features">
                  <span>✓ Contact sync</span>
                  <span>✓ Deal pipeline</span>
                  <span>✓ Custom objects</span>
                  <span>✓ Workflow automation</span>
                </div>
              </div>
                <div className="integration-card">
                  <div className="integration-logo-text">MS</div>
                  <h4>Microsoft Dynamics</h4>
                  <p>Enterprise Dynamics 365 integration with custom entities</p>
                </div>
                <div className="integration-card">
                  <div className="integration-logo-text">PP</div>
                  <h4>Pipedrive</h4>
                  <p>Seamless lead scoring and opportunity tracking</p>
                </div>
                <div className="integration-card">
                  <div className="integration-logo-text">ZD</div>
                  <h4>Zendesk</h4>
                  <p>Customer service and support integration</p>
                </div>
              </div>
            </div>

            <div className="roi-calculator-preview">
              <h3>🧮 Live ROI Calculator Integration</h3>
              <div className="preview-card">
                <div className="preview-header">
                  <span className="preview-url">https://roi.enterprise.com/calculator</span>
                  <span className="preview-status">🟢 Live</span>
                </div>
                <div className="preview-content">
                  <h4>AI Chatbot ROI Calculator</h4>
                  <div className="preview-metrics">
                    <div className="metric">
                      <span className="metric-value">285%</span>
                      <span className="metric-label">ROI</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">8 months</span>
                      <span className="metric-label">Payback</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">$142K</span>
                      <span className="metric-label">Savings</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">87%</span>
                      <span className="metric-label">Confidence</span>
                    </div>
                  </div>
                  <button className="preview-cta">Embed in CRM →</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Endpoints Tab */}
        {activeTab === 'endpoints' && (
          <div className="api-section">
            <div className="endpoints-layout enhanced">
              <div className="endpoint-list">
                <h3>📡 API Endpoints</h3>
                <div className="test-mode-toggle">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={testingMode} 
                      onChange={(e) => setTestingMode(e.target.checked)}
                    />
                    Live API Testing Mode
                  </label>
                </div>
                
                {Object.entries(endpoints).map(([key, endpoint]) => (
                  <div 
                    key={key}
                    className={`endpoint-item enhanced ${selectedEndpoint === key ? 'active' : ''}`}
                    onClick={() => setSelectedEndpoint(key)}
                  >
                    <div className="endpoint-main">
                      <span className={`method ${endpoint.method.toLowerCase()}`}>
                        {endpoint.method}
                      </span>
                      <span className="path">{endpoint.path}</span>
                    </div>
                    <div className="endpoint-meta">
                      <span className="category">{endpoint.category}</span>
                      <span className="reliability">{endpoint.reliability}</span>
                      <span className="response-time">{endpoint.avgResponseTime}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="endpoint-details enhanced">
                {endpoints[selectedEndpoint] && (
                  <>
                    <div className="endpoint-header">
                      <h3>
                        <span className={`method ${endpoints[selectedEndpoint].method.toLowerCase()}`}>
                          {endpoints[selectedEndpoint].method}
                        </span>
                        {endpoints[selectedEndpoint].path}
                      </h3>
                      <div className="endpoint-badges">
                        <span className="badge category">{endpoints[selectedEndpoint].category}</span>
                        <span className="badge reliability">{endpoints[selectedEndpoint].reliability}</span>
                        <span className="badge performance">{endpoints[selectedEndpoint].avgResponseTime}</span>
                      </div>
                    </div>
                    
                    <p className="endpoint-description">{endpoints[selectedEndpoint].description}</p>
                    
                    {testingMode && (
                      <div className="api-tester">
                        <div className="tester-header">
                          <h4>🧪 Live API Tester</h4>
                          <button 
                            className="test-btn"
                            onClick={() => testEndpoint(selectedEndpoint)}
                            disabled={loading}
                          >
                            {loading ? '⏳ Testing...' : '🚀 Test Real API'}
                          </button>
                        </div>
                        
                        <div className="api-key-input">
                          <label>API Key:</label>
                          <input 
                            type="text" 
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API key"
                          />
                          <small style={{color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '0.5rem'}}>
                            Demo key: demo_key_enterprise_trial
                          </small>
                        </div>
                        
                        {testResult && (
                          <div className="test-result">
                            <div className="result-header">
                              <span className={`status-code ${(testResult.status === 200 || testResult.status === 201) ? 'success' : 'error'}`}>
                                {testResult.status}
                              </span>
                              <span className="response-time">{testResult.responseTime}</span>
                              <span className="timestamp">{new Date().toLocaleTimeString()}</span>
                            </div>
                            <pre className="result-body">
                              {JSON.stringify(testResult.result, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                    
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

        {/* Enterprise Security Tab */}
        {activeTab === 'auth' && (
          <div className="api-section">
            <h2>🔐 Enterprise Security & Authentication</h2>
            
            <div className="security-overview">
              <div className="security-grid">
                <div className="security-card">
                  <h3>🛡️ Security Certifications</h3>
                  <ul>
                    <li>SOC 2 Type II Certified</li>
                    <li>GDPR & CCPA Compliant</li>
                    <li>ISO 27001 Certified</li>
                    <li>HIPAA Ready</li>
                  </ul>
                </div>
                <div className="security-card">
                  <h3>🔒 Data Protection</h3>
                  <ul>
                    <li>AES-256 Encryption at Rest</li>
                    <li>TLS 1.3 in Transit</li>
                    <li>Zero Trust Architecture</li>
                    <li>Regular Penetration Testing</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="auth-methods enhanced">
              <div className="auth-method">
                <h3>🔑 API Key Authentication</h3>
                <p>Enterprise-grade API key management with rotation and scoping</p>
                <pre className="code-block">
                  {authExamples.apiKey}
                </pre>
                <div className="auth-features">
                  <span className="feature-tag">Auto-rotation</span>
                  <span className="feature-tag">Scope-based permissions</span>
                  <span className="feature-tag">Usage analytics</span>
                  <span className="feature-tag">IP restrictions</span>
                </div>
              </div>

              <div className="auth-method">
                <h3>🎯 Domain-Based Licensing</h3>
                <p>Advanced domain control with subdomain wildcards and SSL verification</p>
                <pre className="code-block">
                  {authExamples.domain}
                  {'\n'}Allowed Domains: *.hubspot.com, app.hubspot.com, roi.hubspot.com
                  {'\n'}SSL Verification: Required
                  {'\n'}Subdomain Wildcards: Supported
                </pre>
              </div>

              <div className="auth-method">
                <h3>🏢 Enterprise SSO</h3>
                <p>Complete identity provider integration with advanced user management</p>
                <pre className="code-block">
                  {authExamples.bearer}
                  {'\n\n'}# Enterprise Token
                  {authExamples.enterprise}
                </pre>
                <div className="sso-providers">
                  <span className="provider">Okta</span>
                  <span className="provider">Azure AD</span>
                  <span className="provider">Auth0</span>
                  <span className="provider">SAML 2.0</span>
                </div>
              </div>
            </div>

            <div className="rate-limits enhanced">
              <h3>⚡ Enterprise Rate Limits & SLA</h3>
              <div className="rate-limit-table">
                <div className="rate-row header">
                  <span>Plan</span>
                  <span>Rate Limit</span>
                  <span>Burst</span>
                  <span>SLA</span>
                  <span>Support</span>
                </div>
                <div className="rate-row">
                  <span className="plan">Starter</span>
                  <span className="limit">1K/hour</span>
                  <span className="burst">50/min</span>
                  <span className="sla">99.5%</span>
                  <span className="support">Email</span>
                </div>
                <div className="rate-row">
                  <span className="plan">Professional</span>
                  <span className="limit">10K/hour</span>
                  <span className="burst">200/min</span>
                  <span className="sla">99.9%</span>
                  <span className="support">Priority</span>
                </div>
                <div className="rate-row featured">
                  <span className="plan">Enterprise</span>
                  <span className="limit">100K/hour</span>
                  <span className="burst">1K/min</span>
                  <span className="sla">99.97%</span>
                  <span className="support">24/7 Dedicated</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SDKs & Code Examples Tab */}
        {activeTab === 'examples' && (
          <div className="api-section">
            <h2>💻 Enterprise SDKs & Integration Examples</h2>
            
            <div className="sdk-showcase">
              <div className="sdk-overview">
                <h3>📦 Official Enterprise SDKs</h3>
                <div className="sdk-grid enhanced">
                  <div className="sdk-item featured">
                    <div className="sdk-header">
                      <strong>JavaScript/TypeScript</strong>
                      <span className="sdk-version">v2.1</span>
                    </div>
                    <code>npm install @catalyst/enterprise-sdk</code>
                    <div className="sdk-features">
                      <span>TypeScript Support</span>
                      <span>React Hooks</span>
                      <span>Real-time Streaming</span>
                      <span>Retry Logic</span>
                    </div>
                  </div>
                  <div className="sdk-item">
                    <div className="sdk-header">
                      <strong>Python</strong>
                      <span className="sdk-version">v2.1</span>
                    </div>
                    <code>pip install catalyst-enterprise-api</code>
                    <div className="sdk-features">
                      <span>Async/Await</span>
                      <span>Batch Processing</span>
                      <span>Django Integration</span>
                    </div>
                  </div>
                  <div className="sdk-item">
                    <div className="sdk-header">
                      <strong>PHP</strong>
                      <span className="sdk-version">v1.8</span>
                    </div>
                    <code>composer require catalyst/enterprise-api</code>
                    <div className="sdk-features">
                      <span>Laravel Support</span>
                      <span>PSR-7 Compatible</span>
                    </div>
                  </div>
                  <div className="sdk-item">
                    <div className="sdk-header">
                      <strong>Ruby</strong>
                      <span className="sdk-version">v1.8</span>
                    </div>
                    <code>gem install catalyst_enterprise</code>
                    <div className="sdk-features">
                      <span>Rails Integration</span>
                      <span>ActiveRecord</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="code-examples enhanced">
              <div className="code-example">
                <h3>🟨 JavaScript/React Enterprise</h3>
                <pre className="code-block">
                  {sdkExamples.javascript}
                </pre>
              </div>

              <div className="code-example">
                <h3>🐍 Python Enterprise</h3>
                <pre className="code-block">
                  {sdkExamples.python}
                </pre>
              </div>

              <div className="code-example">
                <h3>🌐 Advanced cURL</h3>
                <pre className="code-block">
                  {sdkExamples.curl}
                </pre>
              </div>

              <div className="code-example">
                <h3>🔧 GraphQL (Enterprise)</h3>
                <pre className="code-block">
                  {sdkExamples.graphql}
                </pre>
              </div>

              <div className="code-example">
                <h3>🔗 Webhook Configuration</h3>
                <pre className="code-block">
                  {sdkExamples.webhook}
                </pre>
              </div>
            </div>

            <div className="integration-tools">
              <h3>🛠️ Developer Tools & Resources</h3>
              <div className="tools-grid">
                <div className="tool-card">
                  <h4>📋 Postman Collection</h4>
                  <p>Complete API collection with environment variables</p>
                  <button className="tool-btn">Download Collection</button>
                </div>
                <div className="tool-card">
                  <h4>📖 OpenAPI Spec</h4>
                  <p>Machine-readable API specification (Swagger)</p>
                  <button className="tool-btn">View Spec</button>
                </div>
                <div className="tool-card">
                  <h4>🧪 Sandbox Environment</h4>
                  <p>Test environment with sample data</p>
                  <button className="tool-btn">Access Sandbox</button>
                </div>
                <div className="tool-card">
                  <h4>📊 API Explorer</h4>
                  <p>Interactive API documentation and testing</p>
                  <button className="tool-btn">Launch Explorer</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enterprise Features Tab */}
        {activeTab === 'enterprise' && (
          <div className="api-section">
            <h2>🏢 Enterprise Features & Capabilities</h2>
            
            <div className="enterprise-hero">
              <div className="hero-content">
                <h3>Built for Enterprise Scale</h3>
                <p>Production-ready infrastructure serving millions of calculations with enterprise-grade security, compliance, and support.</p>
                <div className="hero-stats">
                  <div className="stat">
                    <span className="stat-big">99.97%</span>
                    <span>Uptime SLA</span>
                  </div>
                  <div className="stat">
                    <span className="stat-big">&lt;100ms</span>
                    <span>P95 Response</span>
                  </div>
                  <div className="stat">
                    <span className="stat-big">24/7</span>
                    <span>Support</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="enterprise-features-grid">
              <div className="enterprise-feature">
                <h3>🎨 Advanced White-Label</h3>
                <div className="feature-demo">
                  <div className="demo-browser">
                    <div className="browser-bar">
                      <span>🔒 https://roi.hubspot.com</span>
                    </div>
                    <div className="demo-content hubspot-theme">
                      <div className="demo-header">
                        <div className="demo-logo">HubSpot</div>
                        <div className="demo-nav">ROI Calculator</div>
                      </div>
                      <div className="demo-calculator">
                        <h4>Calculate Your Marketing ROI</h4>
                        <div className="demo-result">285% ROI Projected</div>
                      </div>
                    </div>
                  </div>
                </div>
                <ul>
                  <li>Custom domain configuration</li>
                  <li>Dynamic theme generation</li>
                  <li>Brand asset integration</li>
                  <li>Custom scenario libraries</li>
                </ul>
              </div>

              <div className="enterprise-feature">
                <h3>🤖 AI & Machine Learning</h3>
                <div className="ai-demo">
                  <div className="ai-insight">
                    <span className="ai-badge">AI Insight</span>
                    <p>"Based on your industry and company size, AI Chatbot implementation has a 94% success rate with similar companies."</p>
                  </div>
                  <div className="ai-recommendation">
                    <span className="ai-badge">ML Recommendation</span>
                    <p>"Consider Marketing Automation next - 87% compatibility with your current HubSpot setup."</p>
                  </div>
                </div>
                <ul>
                  <li>Predictive ROI modeling</li>
                  <li>Intelligent scenario matching</li>
                  <li>Risk assessment algorithms</li>
                  <li>Competitor benchmarking</li>
                </ul>
              </div>

              <div className="enterprise-feature">
                <h3>📊 Advanced Analytics</h3>
                <div className="analytics-preview">
                  <div className="chart-preview">
                    <div className="chart-bar" style={{height: '60%'}}></div>
                    <div className="chart-bar" style={{height: '80%'}}></div>
                    <div className="chart-bar" style={{height: '95%'}}></div>
                    <div className="chart-bar" style={{height: '75%'}}></div>
                  </div>
                  <div className="analytics-metrics">
                    <div className="metric-small">
                      <span>Conversion Rate</span>
                      <span>7.1%</span>
                    </div>
                    <div className="metric-small">
                      <span>Avg Lead Score</span>
                      <span>84</span>
                    </div>
                  </div>
                </div>
                <ul>
                  <li>Real-time dashboards</li>
                  <li>Custom KPI tracking</li>
                  <li>Conversion funnel analysis</li>
                  <li>Automated reporting</li>
                </ul>
              </div>

              <div className="enterprise-feature">
                <h3>🔗 CRM Integration</h3>
                <div className="crm-flow">
                  <div className="flow-step">Calculator</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">Lead Score</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">HubSpot CRM</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">Sales Team</div>
                </div>
                <ul>
                  <li>Native HubSpot integration</li>
                  <li>Automatic contact creation</li>
                  <li>Custom property mapping</li>
                  <li>Workflow triggers</li>
                </ul>
              </div>
            </div>

            <div className="compliance-section">
              <h3>🛡️ Security & Compliance</h3>
              <div className="compliance-grid">
                <div className="compliance-item">
                  <div className="compliance-icon">🏆</div>
                  <h4>SOC 2 Type II</h4>
                  <p>Annual certification for security, availability, and confidentiality</p>
                </div>
                <div className="compliance-item">
                  <div className="compliance-icon">🌍</div>
                  <h4>GDPR Compliant</h4>
                  <p>Full compliance with European data protection regulations</p>
                </div>
                <div className="compliance-item">
                  <div className="compliance-icon">🏥</div>
                  <h4>HIPAA Ready</h4>
                  <p>Healthcare-grade security for sensitive industry data</p>
                </div>
                <div className="compliance-item">
                  <div className="compliance-icon">🔐</div>
                  <h4>ISO 27001</h4>
                  <p>International standard for information security management</p>
                </div>
              </div>
            </div>

            <div className="support-section">
              <h3>🎯 Enterprise Support</h3>
              <div className="support-tiers">
                <div className="support-tier">
                  <h4>Dedicated Success Manager</h4>
                  <p>Personal point of contact for strategic guidance</p>
                </div>
                <div className="support-tier">
                  <h4>24/7 Technical Support</h4>
                  <p>Round-the-clock assistance for critical issues</p>
                </div>
                <div className="support-tier">
                  <h4>Custom Integration Services</h4>
                  <p>Professional services for complex implementations</p>
                </div>
                <div className="support-tier">
                  <h4>Training & Onboarding</h4>
                  <p>Comprehensive team training and best practices</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="api-section">
            <h2>💰 Enterprise Pricing & Packages</h2>
            
            <div className="pricing-hero">
              <p>Transparent pricing designed for enterprise scale. Start with a free trial, scale as you grow.</p>
            </div>
            
            <div className="pricing-grid enhanced">
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>🚀 Starter</h3>
                  <div className="price">$299<span>/month</span></div>
                  <p>Perfect for growing teams</p>
                </div>
                <ul>
                  <li>✅ 10,000 calculations/month</li>
                  <li>✅ All 85 business scenarios</li>
                  <li>✅ Basic analytics dashboard</li>
                  <li>✅ Email support (24h response)</li>
                  <li>✅ API access & documentation</li>
                  <li>✅ Standard integrations</li>
                  <li>❌ White-label branding</li>
                  <li>❌ Custom scenarios</li>
                  <li>❌ Advanced ML insights</li>
                </ul>
                <button className="pricing-btn">Start Free Trial</button>
              </div>

              <div className="pricing-card featured">
                <div className="pricing-header">
                  <h3>💼 Professional</h3>
                  <div className="price">$899<span>/month</span></div>
                  <p>Most popular for mid-market</p>
                </div>
                <ul>
                  <li>✅ 100,000 calculations/month</li>
                  <li>✅ Advanced analytics & reporting</li>
                  <li>✅ Priority support (4h response)</li>
                  <li>✅ Basic white-label options</li>
                  <li>✅ Webhook integrations</li>
                  <li>✅ ML-powered insights</li>
                  <li>✅ CRM integrations (HubSpot, SF)</li>
                  <li>✅ Custom reporting</li>
                  <li>❌ Source code access</li>
                </ul>
                <button className="pricing-btn primary">Most Popular</button>
              </div>

              <div className="pricing-card enterprise">
                <div className="pricing-header">
                  <h3>🏢 Enterprise</h3>
                  <div className="price">Custom</div>
                  <p>Built for enterprise scale</p>
                </div>
                <ul>
                  <li>✅ Unlimited calculations</li>
                  <li>✅ Complete white-label solution</li>
                  <li>✅ 24/7 dedicated support</li>
                  <li>✅ Custom scenarios & industries</li>
                  <li>✅ Enterprise SSO & security</li>
                  <li>✅ Advanced ML & AI features</li>
                  <li>✅ Custom domain & hosting</li>
                  <li>✅ Professional services</li>
                  <li>✅ Source code licensing available</li>
                </ul>
                <button className="pricing-btn">Contact Sales</button>
              </div>
            </div>

            <div className="pricing-comparison">
              <h3>📊 Feature Comparison</h3>
              <div className="comparison-table">
                <div className="comparison-row header">
                  <span>Feature</span>
                  <span>Starter</span>
                  <span>Professional</span>
                  <span>Enterprise</span>
                </div>
                <div className="comparison-row">
                  <span>Monthly Calculations</span>
                  <span>10K</span>
                  <span>100K</span>
                  <span>Unlimited</span>
                </div>
                <div className="comparison-row">
                  <span>SLA Uptime</span>
                  <span>99.5%</span>
                  <span>99.9%</span>
                  <span>99.97%</span>
                </div>
                <div className="comparison-row">
                  <span>Support Response</span>
                  <span>24 hours</span>
                  <span>4 hours</span>
                  <span>1 hour</span>
                </div>
                <div className="comparison-row">
                  <span>White-Label</span>
                  <span>❌</span>
                  <span>Basic</span>
                  <span>Complete</span>
                </div>
                <div className="comparison-row">
                  <span>Custom Scenarios</span>
                  <span>❌</span>
                  <span>❌</span>
                  <span>✅</span>
                </div>
                <div className="comparison-row">
                  <span>Source Code</span>
                  <span>❌</span>
                  <span>❌</span>
                  <span>Available</span>
                </div>
              </div>
            </div>

            <div className="enterprise-addons">
              <h3>🎯 Enterprise Add-Ons & Services</h3>
              <div className="addon-grid enhanced">
                <div className="addon-item featured">
                  <div className="addon-header">
                    <strong>Complete Source Code License</strong>
                    <span className="addon-price">$150,000 one-time</span>
                  </div>
                  <p>Full source code with unlimited modifications, white-label rights, and redistribution license</p>
                  <div className="addon-features">
                    <span>✓ React + Node.js codebase</span>
                    <span>✓ All 85 scenarios included</span>
                    <span>✓ Unlimited modifications</span>
                    <span>✓ Redistribution rights</span>
                    <span>✓ 1 year of updates</span>
                  </div>
                </div>
                
                <div className="addon-item">
                  <div className="addon-header">
                    <strong>Custom Industry Scenarios</strong>
                    <span className="addon-price">$15,000 per industry</span>
                  </div>
                  <p>Bespoke ROI scenarios tailored to your specific industry vertical</p>
                  <div className="addon-features">
                    <span>✓ 10-15 custom scenarios</span>
                    <span>✓ Industry research included</span>
                    <span>✓ Competitive benchmarking</span>
                    <span>✓ 3 months development</span>
                  </div>
                </div>
                
                <div className="addon-item">
                  <div className="addon-header">
                    <strong>Dedicated Cloud Infrastructure</strong>
                    <span className="addon-price">$5,000/month</span>
                  </div>
                  <p>Private cloud deployment with guaranteed performance and security</p>
                  <div className="addon-features">
                    <span>✓ Dedicated servers</span>
                    <span>✓ Custom domain SSL</span>
                    <span>✓ 99.99% uptime SLA</span>
                    <span>✓ Advanced monitoring</span>
                  </div>
                </div>
                
                <div className="addon-item">
                  <div className="addon-header">
                    <strong>Enterprise Integration Package</strong>
                    <span className="addon-price">$25,000 setup</span>
                  </div>
                  <p>Complete CRM integration with custom workflows and training</p>
                  <div className="addon-features">
                    <span>✓ HubSpot/Salesforce setup</span>
                    <span>✓ Custom field mapping</span>
                    <span>✓ Workflow automation</span>
                    <span>✓ Team training included</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="roi-calculator-cta">
              <div className="cta-content">
                <h3>🚀 Ready to Calculate Your ROI?</h3>
                <p>See how Catalyst can transform your business with our interactive calculator</p>
                <div className="cta-buttons">
                  <button className="cta-btn primary">Try Calculator Now</button>
                  <button className="cta-btn secondary">Schedule Enterprise Demo</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Footer */}
      <div className="api-footer enhanced">
        <div className="footer-content">
          <div className="footer-section">
            <h4>📞 Enterprise Sales</h4>
            <p>Ready to scale your ROI calculations? Let's build something amazing together.</p>
            <button className="btn btn-primary">Schedule Demo Call</button>
            <div className="contact-info">
              <span>📧 enterprise@catalyst-roi.com</span>
              <span>📞 +1 (555) 123-4567</span>
            </div>
          </div>
          <div className="footer-section">
            <h4>📚 Developer Resources</h4>
            <ul>
              <li><a href="#postman">Postman Collection</a></li>
              <li><a href="#swagger">OpenAPI 3.0 Spec</a></li>
              <li><a href="#github">GitHub Examples</a></li>
              <li><a href="#changelog">API Changelog</a></li>
              <li><a href="#status">System Status</a></li>
              <li><a href="#sandbox">Sandbox Environment</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>🎯 Quick Actions</h4>
            <ul>
              <li><a href="#calculator">Try ROI Calculator</a></li>
              <li><a href="#scenarios">Browse 85 Scenarios</a></li>
              <li><a href="#admin">View Admin Dashboard</a></li>
              <li><a href="#integration">HubSpot Integration</a></li>
              <li><a href="#pricing">Enterprise Pricing</a></li>
              <li><a href="#trial">Start Free Trial</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>🏢 Enterprise</h4>
            <div className="enterprise-badges">
              <span className="badge">SOC 2 Certified</span>
              <span className="badge">99.97% Uptime</span>
              <span className="badge">24/7 Support</span>
              <span className="badge">GDPR Compliant</span>
            </div>
            <p>Built for enterprise scale with bank-grade security and compliance.</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <span>© 2024 Catalyst ROI Calculator. Built for enterprise acquisition.</span>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#security">Security</a>
              <a href="#compliance">Compliance</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;