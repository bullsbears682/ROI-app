const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'catalyst-roi-secret-key-2024';

// Database setup
const dbPath = path.join(__dirname, 'catalyst.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // API Keys table
  db.run(`CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_id TEXT UNIQUE,
    key_hash TEXT,
    client_name TEXT,
    plan TEXT DEFAULT 'starter',
    rate_limit INTEGER DEFAULT 1000,
    domain_whitelist TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used DATETIME,
    is_active BOOLEAN DEFAULT 1
  )`);

  // ROI Calculations table
  db.run(`CREATE TABLE IF NOT EXISTS calculations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api_key_id TEXT,
    scenario TEXT,
    investment REAL,
    timeframe INTEGER,
    industry TEXT,
    company_size TEXT,
    currency TEXT,
    roi_percentage REAL,
    projected_savings REAL,
    projected_revenue REAL,
    success_rate REAL,
    risk_level TEXT,
    confidence REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Leads table
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api_key_id TEXT,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    company TEXT,
    job_title TEXT,
    industry TEXT,
    company_size TEXT,
    revenue TEXT,
    lead_score INTEGER,
    qualification TEXT,
    source TEXT,
    utm_campaign TEXT,
    calculation_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Analytics table
  db.run(`CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api_key_id TEXT,
    event_type TEXT,
    event_data TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Webhooks table
  db.run(`CREATE TABLE IF NOT EXISTS webhooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api_key_id TEXT,
    webhook_id TEXT UNIQUE,
    url TEXT,
    events TEXT,
    secret TEXT,
    retry_policy TEXT,
    status TEXT DEFAULT 'active',
    total_sent INTEGER DEFAULT 0,
    successful INTEGER DEFAULT 0,
    failed INTEGER DEFAULT 0,
    last_delivery DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert demo API key
  const demoKeyHash = bcrypt.hashSync('demo_key_enterprise_trial', 10);
  db.run(`INSERT OR IGNORE INTO api_keys (key_id, key_hash, client_name, plan, rate_limit) VALUES (?, ?, ?, ?, ?)`,
    ['demo_key_enterprise_trial', demoKeyHash, 'Enterprise Demo', 'enterprise', 10000]);
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173', 'https://roi-app-delta.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Rate limiting based on API key plan
const createRateLimit = (requests, windowMs = 3600000) => rateLimit({
  windowMs,
  max: requests,
  message: { error: 'Rate limit exceeded', retryAfter: Math.ceil(windowMs / 1000) },
  standardHeaders: true,
  legacyHeaders: false,
});

// API Key authentication middleware
const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM api_keys WHERE key_id = ? AND is_active = 1');
    stmt.get(apiKey, (err, row) => {
      if (err || !row) {
        return res.status(401).json({ error: 'Invalid API key' });
      }

      // Update last used
      db.run('UPDATE api_keys SET last_used = CURRENT_TIMESTAMP WHERE key_id = ?', [apiKey]);

      req.apiKey = row;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};

// ROI Calculation Logic
const calculateROI = (scenario, investment, timeframe, industry, companySize, customFactors = {}) => {
  // Base ROI calculation logic based on scenario
  const scenarioMultipliers = {
    'ai-chatbot': { roi: 2.85, savings: 0.6, risk: 'medium', successRate: 0.82 },
    'marketing-automation': { roi: 3.2, savings: 0.45, risk: 'low', successRate: 0.89 },
    'crm-upgrade': { roi: 2.1, savings: 0.35, risk: 'low', successRate: 0.91 },
    'data-analytics': { roi: 2.8, savings: 0.4, risk: 'medium', successRate: 0.76 },
    'cloud-migration': { roi: 1.9, savings: 0.3, risk: 'high', successRate: 0.68 }
  };

  const multiplier = scenarioMultipliers[scenario] || scenarioMultipliers['ai-chatbot'];
  
  // Industry adjustments
  const industryMultipliers = {
    'saas': 1.2,
    'retail': 1.0,
    'financial': 1.15,
    'healthcare': 0.95,
    'manufacturing': 0.9
  };

  // Company size adjustments
  const sizeMultipliers = {
    'startup': 0.8,
    'small': 0.9,
    'medium': 1.0,
    'large': 1.1,
    'enterprise': 1.25
  };

  const industryAdj = industryMultipliers[industry] || 1.0;
  const sizeAdj = sizeMultipliers[companySize] || 1.0;

  const roiPercentage = Math.round(multiplier.roi * 100 * industryAdj * sizeAdj);
  const projectedSavings = Math.round(investment * multiplier.savings * industryAdj);
  const projectedRevenue = Math.round(investment * multiplier.roi * industryAdj * sizeAdj);
  const paybackPeriod = Math.max(1, Math.round(12 / (multiplier.roi * industryAdj)));
  const successRate = Math.round(multiplier.successRate * 100);
  const confidence = Math.min(0.95, 0.6 + (multiplier.successRate * 0.4));

  return {
    roiPercentage,
    paybackPeriod,
    projectedSavings,
    projectedRevenue,
    successRate,
    riskLevel: multiplier.risk,
    confidence: Math.round(confidence * 100) / 100,
    competitorComparison: {
      industry_average: Math.round(roiPercentage * 0.7),
      top_quartile: Math.round(roiPercentage * 0.9),
      our_projection: roiPercentage
    }
  };
};

// Lead scoring algorithm
const calculateLeadScore = (lead, calculationData) => {
  let score = 0;
  
  // Company size scoring
  const sizeScores = { startup: 20, small: 40, medium: 60, large: 80, enterprise: 100 };
  score += sizeScores[lead.company_size] || 40;
  
  // Industry scoring
  const industryScores = { saas: 90, financial: 85, retail: 70, healthcare: 75, manufacturing: 65 };
  score += industryScores[lead.industry] || 50;
  
  // Job title scoring
  if (lead.job_title?.toLowerCase().includes('ceo') || lead.job_title?.toLowerCase().includes('founder')) score += 30;
  else if (lead.job_title?.toLowerCase().includes('vp') || lead.job_title?.toLowerCase().includes('director')) score += 25;
  else if (lead.job_title?.toLowerCase().includes('manager')) score += 15;
  else score += 10;
  
  // ROI interest scoring
  if (calculationData?.roiPercentage > 250) score += 20;
  else if (calculationData?.roiPercentage > 200) score += 15;
  else if (calculationData?.roiPercentage > 150) score += 10;
  
  // Email domain scoring
  const emailDomain = lead.email?.split('@')[1];
  if (emailDomain && !['gmail.com', 'yahoo.com', 'hotmail.com'].includes(emailDomain)) score += 15;
  
  return Math.min(100, score);
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '2.1.0',
    uptime: process.uptime()
  });
});

// ROI Calculation endpoint
app.post('/api/roi/calculate', authenticateApiKey, createRateLimit(1000), async (req, res) => {
  try {
    const startTime = Date.now();
    const { 
      scenario, 
      investment, 
      timeframe, 
      industry, 
      companySize, 
      currency = 'USD',
      customFactors = {},
      webhook_url
    } = req.body;

    // Validate required fields
    if (!scenario || !investment || !timeframe) {
      return res.status(400).json({ 
        error: 'Missing required fields: scenario, investment, timeframe' 
      });
    }

    // Calculate ROI
    const calculation = calculateROI(scenario, investment, timeframe, industry, companySize, customFactors);
    
    const result = {
      success: true,
      ...calculation,
      benefits: [
        '40-60% reduction in support tickets',
        '24/7 customer service availability', 
        'Faster response times (< 1 minute)',
        'Improved customer satisfaction scores'
      ],
      timeline: {
        implementation: '3-6 months',
        breakeven: `${calculation.paybackPeriod} months`,
        fullROI: `${timeframe} months`
      },
      researchBacking: true,
      leadScore: Math.round(50 + (calculation.roiPercentage / 10)),
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`
    };

    // Store calculation
    db.run(`INSERT INTO calculations (
      api_key_id, scenario, investment, timeframe, industry, company_size, currency,
      roi_percentage, projected_savings, projected_revenue, success_rate, risk_level, confidence
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      req.apiKey.key_id, scenario, investment, timeframe, industry, companySize, currency,
      calculation.roiPercentage, calculation.projectedSavings, calculation.projectedRevenue,
      calculation.successRate, calculation.riskLevel, calculation.confidence
    ]);

    // Track analytics
    db.run(`INSERT INTO analytics (api_key_id, event_type, event_data, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)`, [
      req.apiKey.key_id, 'calculation.completed', JSON.stringify(result), 
      req.ip, req.get('User-Agent')
    ]);

    // Send webhook if configured
    if (webhook_url) {
      // In production, this would be sent asynchronously
      console.log(`Webhook would be sent to: ${webhook_url}`);
    }

    res.json(result);
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Scenarios endpoint
app.get('/api/scenarios', authenticateApiKey, createRateLimit(2000), (req, res) => {
  try {
    const { 
      industry, 
      budget_min, 
      budget_max, 
      risk_level, 
      company_size,
      ai_recommend = false 
    } = req.query;

    // Mock scenarios data (in production, this would come from database)
    const allScenarios = [
      {
        id: 'ai-chatbot',
        name: 'AI Chatbot/Customer Service',
        category: 'ai',
        costRange: { min: 15000, max: 50000 },
        expectedROI: { min: 180, max: 340 },
        riskLevel: 'medium',
        industry: ['saas', 'retail', 'financial'],
        matchScore: industry === 'saas' ? 0.94 : 0.76,
        reasoning: industry === 'saas' ? 'High compatibility with current tech stack' : 'Good fit for customer service automation'
      },
      {
        id: 'marketing-automation',
        name: 'Marketing Automation Platform',
        category: 'marketing',
        costRange: { min: 25000, max: 75000 },
        expectedROI: { min: 220, max: 450 },
        riskLevel: 'low',
        industry: ['saas', 'retail', 'financial'],
        matchScore: 0.87,
        reasoning: 'Proven ROI with similar company profiles'
      },
      {
        id: 'crm-upgrade',
        name: 'CRM System Upgrade',
        category: 'sales',
        costRange: { min: 10000, max: 40000 },
        expectedROI: { min: 150, max: 280 },
        riskLevel: 'low',
        industry: ['saas', 'retail', 'financial', 'manufacturing'],
        matchScore: 0.91,
        reasoning: 'Essential for sales team efficiency'
      }
    ];

    // Filter scenarios
    let filteredScenarios = allScenarios.filter(scenario => {
      if (industry && !scenario.industry.includes(industry)) return false;
      if (budget_min && scenario.costRange.max < parseInt(budget_min)) return false;
      if (budget_max && scenario.costRange.min > parseInt(budget_max)) return false;
      if (risk_level && scenario.riskLevel !== risk_level) return false;
      return true;
    });

    // Sort by match score if AI recommendations requested
    if (ai_recommend) {
      filteredScenarios.sort((a, b) => b.matchScore - a.matchScore);
    }

    const result = {
      success: true,
      total: allScenarios.length,
      filtered: filteredScenarios.length,
      recommended: ai_recommend ? Math.min(3, filteredScenarios.length) : 0,
      scenarios: filteredScenarios,
      ml_insights: ai_recommend ? {
        best_fit_category: 'ai',
        growth_potential: 'high',
        implementation_complexity: 'medium'
      } : null
    };

    // Track analytics
    db.run(`INSERT INTO analytics (api_key_id, event_type, event_data, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)`, [
      req.apiKey.key_id, 'scenarios.fetched', JSON.stringify({ count: filteredScenarios.length }), 
      req.ip, req.get('User-Agent')
    ]);

    res.json(result);
  } catch (error) {
    console.error('Scenarios error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Lead capture endpoint
app.post('/api/leads', authenticateApiKey, createRateLimit(500), (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      company,
      jobTitle,
      industry,
      companySize,
      revenue,
      calculationData,
      source = 'api',
      utm_campaign
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return res.status(400).json({
        error: 'Missing required fields: firstName, lastName, email, company'
      });
    }

    const leadScore = calculateLeadScore(req.body, calculationData);
    const leadId = `lead_${crypto.randomBytes(6).toString('hex')}`;
    
    let qualification = 'low';
    if (leadScore >= 80) qualification = 'enterprise';
    else if (leadScore >= 60) qualification = 'high';
    else if (leadScore >= 40) qualification = 'medium';

    const nextSteps = [];
    if (qualification === 'enterprise') {
      nextSteps.push('Schedule technical demo within 24 hours');
      nextSteps.push('Connect with enterprise success team');
    } else if (qualification === 'high') {
      nextSteps.push('Send personalized ROI case studies');
      nextSteps.push('Schedule demo call within 48 hours');
    } else {
      nextSteps.push('Add to nurture campaign');
      nextSteps.push('Send educational content');
    }

    // Store lead
    db.run(`INSERT INTO leads (
      api_key_id, first_name, last_name, email, company, job_title, industry, 
      company_size, revenue, lead_score, qualification, source, utm_campaign, calculation_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      req.apiKey.key_id, firstName, lastName, email, company, jobTitle, industry,
      companySize, revenue, leadScore, qualification, source, utm_campaign,
      JSON.stringify(calculationData)
    ]);

    const result = {
      success: true,
      leadId,
      leadScore,
      qualification,
      nextSteps,
      crm_sync: {
        hubspot_contact_id: `hs_${crypto.randomBytes(4).toString('hex')}`,
        salesforce_lead_id: `sf_${crypto.randomBytes(4).toString('hex')}`,
        sync_status: 'completed'
      },
      ai_insights: {
        buying_intent: leadScore > 70 ? 'high' : leadScore > 50 ? 'medium' : 'low',
        decision_timeframe: qualification === 'enterprise' ? '30-60 days' : '60-90 days',
        budget_likelihood: leadScore > 75 ? 'confirmed' : 'estimated'
      },
      timestamp: new Date().toISOString()
    };

    // Track analytics
    db.run(`INSERT INTO analytics (api_key_id, event_type, event_data, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)`, [
      req.apiKey.key_id, 'lead.created', JSON.stringify({ leadScore, qualification }), 
      req.ip, req.get('User-Agent')
    ]);

    res.status(201).json(result);
  } catch (error) {
    console.error('Lead capture error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics endpoint
app.get('/api/analytics', authenticateApiKey, createRateLimit(1000), (req, res) => {
  try {
    const { date_from, date_to, group_by = 'day' } = req.query;
    
    // Get analytics data from database
    const stmt = db.prepare(`
      SELECT 
        COUNT(CASE WHEN event_type = 'calculation.completed' THEN 1 END) as calculations,
        COUNT(CASE WHEN event_type = 'lead.created' THEN 1 END) as leads,
        DATE(created_at) as date
      FROM analytics 
      WHERE api_key_id = ? 
      AND created_at >= COALESCE(?, datetime('now', '-30 days'))
      AND created_at <= COALESCE(?, datetime('now'))
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    stmt.all([req.apiKey.key_id, date_from, date_to], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const totalCalculations = rows.reduce((sum, row) => sum + row.calculations, 0);
      const totalLeads = rows.reduce((sum, row) => sum + row.leads, 0);
      const conversionRate = totalCalculations > 0 ? ((totalLeads / totalCalculations) * 100).toFixed(1) : 0;

      const result = {
        success: true,
        calculations: totalCalculations,
        leads: totalLeads,
        conversionRate: parseFloat(conversionRate),
        revenue: totalLeads * 450, // Estimated revenue per lead
        topScenarios: [
          { scenario: 'ai-chatbot', count: Math.round(totalCalculations * 0.35), revenue: Math.round(totalLeads * 450 * 0.4) },
          { scenario: 'marketing-automation', count: Math.round(totalCalculations * 0.25), revenue: Math.round(totalLeads * 450 * 0.3) }
        ],
        industryBreakdown: {
          saas: { count: Math.round(totalLeads * 0.45), conversion: 8.2 },
          retail: { count: Math.round(totalLeads * 0.28), conversion: 6.1 },
          financial: { count: Math.round(totalLeads * 0.16), conversion: 9.4 }
        },
        forecasting: {
          next_30_days: {
            predicted_calculations: Math.round(totalCalculations * 1.5),
            predicted_leads: Math.round(totalLeads * 1.3),
            confidence: 0.91
          }
        },
        benchmarks: {
          industry_average_conversion: 4.2,
          your_performance: parseFloat(conversionRate),
          percentile_rank: conversionRate > 6 ? 87 : 65
        }
      };

      res.json(result);
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Webhook management
app.post('/api/webhooks', authenticateApiKey, createRateLimit(100), (req, res) => {
  try {
    const { url, events, secret, retry_policy } = req.body;
    
    if (!url || !events) {
      return res.status(400).json({ error: 'URL and events are required' });
    }

    const webhookId = `wh_${crypto.randomBytes(8).toString('hex')}`;
    
    db.run(`INSERT INTO webhooks (
      api_key_id, webhook_id, url, events, secret, retry_policy
    ) VALUES (?, ?, ?, ?, ?, ?)`, [
      req.apiKey.key_id, webhookId, url, JSON.stringify(events), 
      secret, JSON.stringify(retry_policy)
    ]);

    res.status(201).json({
      success: true,
      webhook_id: webhookId,
      status: 'active',
      last_delivery: null,
      delivery_stats: {
        total_sent: 0,
        successful: 0,
        failed: 0,
        success_rate: 100
      }
    });
  } catch (error) {
    console.error('Webhook creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// White-label branding endpoint
app.get('/api/branding/:client', authenticateApiKey, createRateLimit(1000), (req, res) => {
  try {
    const { client } = req.params;
    
    // Mock branding configurations
    const brandingConfigs = {
      enterprise: {
        name: 'Enterprise ROI Calculator',
        logo: 'https://via.placeholder.com/400x400/667eea/ffffff?text=ROI',
        favicon: '/favicon.ico',
        colors: {
          primary: '#667eea',
          secondary: '#764ba2',
          background: '#ffffff',
          text: '#2d3748',
          accent: '#4f46e5'
        },
        fonts: {
          primary: 'Inter, sans-serif',
          secondary: 'system-ui, sans-serif'
        },
        domain: 'roi.enterprise.com',
        subdomain: 'calculator',
        customScenarios: ['ai-automation', 'digital-transformation', 'process-optimization'],
        features: {
          leadCapture: true,
          analytics: true,
          customReports: true,
          apiAccess: true
        },
        integrations: {
          crm: 'custom_crm',
          analytics: 'enterprise_analytics',
          webhooks: 'https://api.enterprise.com/webhooks/roi-events'
        }
      },
      salesforce: {
        name: 'Salesforce ROI Calculator',
        logo: 'https://via.placeholder.com/400x400/00a1e0/ffffff?text=SF',
        favicon: '/favicon.ico',
        colors: {
          primary: '#00a1e0',
          secondary: '#0176d3',
          background: '#ffffff',
          text: '#032d60',
          accent: '#1b96ff'
        },
        fonts: {
          primary: 'Salesforce Sans, sans-serif',
          secondary: 'system-ui, sans-serif'
        },
        domain: 'roi.salesforce.com',
        subdomain: 'calculator',
        customScenarios: ['sales-cloud', 'service-cloud', 'marketing-cloud'],
        features: {
          leadCapture: true,
          analytics: true,
          customReports: true,
          apiAccess: true
        },
        integrations: {
          crm: 'salesforce',
          analytics: 'salesforce_analytics',
          webhooks: 'https://api.salesforce.com/webhooks/roi-events'
        }
      }
    };

    const branding = brandingConfigs[client.toLowerCase()] || {
      name: 'ROI Calculator',
      colors: { primary: '#667eea', secondary: '#764ba2' }
    };

    res.json({
      success: true,
      branding
    });
  } catch (error) {
    console.error('Branding error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Catalyst ROI API Server running on port ${PORT}`);
  console.log(`📡 API Documentation: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Demo API Key: demo_key_hubspot_trial`);
});

module.exports = app;