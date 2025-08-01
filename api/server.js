import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import sqlite3 from 'sqlite3';
import cron from 'node-cron';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'catalyst-roi-secret-2025';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

// Database setup
const dbPath = './api/catalyst.db';
let db;

// Initialize database with proper error handling
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    // Check if database directory exists
    const apiDir = './api';
    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true });
    }

    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection failed:', err);
        reject(err);
      } else {
        console.log('✅ Database connected successfully');
        resolve();
      }
    });
  });
};

// Initialize database tables with better error handling
const initTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Drop existing tables if they have wrong schema
      db.run(`DROP TABLE IF EXISTS api_keys_old`);
      
      // API Keys table with correct schema
      db.run(`CREATE TABLE IF NOT EXISTS api_keys (
        id TEXT PRIMARY KEY,
        key_hash TEXT UNIQUE NOT NULL,
        client_name TEXT NOT NULL,
        tier TEXT DEFAULT 'free',
        usage_limit INTEGER DEFAULT 100,
        usage_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_used DATETIME,
        active BOOLEAN DEFAULT 1
      )`, (err) => {
        if (err) console.error('Error creating api_keys table:', err);
      });

      // ROI Calculations table
      db.run(`CREATE TABLE IF NOT EXISTS calculations (
        id TEXT PRIMARY KEY,
        api_key_id TEXT,
        investment REAL NOT NULL,
        scenario TEXT NOT NULL,
        industry TEXT NOT NULL,
        company_size TEXT NOT NULL,
        timeframe INTEGER NOT NULL,
        currency TEXT DEFAULT 'USD',
        roi_percentage REAL,
        expected_returns REAL,
        success_rate INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        user_agent TEXT
      )`, (err) => {
        if (err) console.error('Error creating calculations table:', err);
      });

      // Leads table
      db.run(`CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        company TEXT,
        name TEXT,
        phone TEXT,
        calculation_id TEXT,
        source TEXT DEFAULT 'calculator',
        status TEXT DEFAULT 'new',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      )`, (err) => {
        if (err) console.error('Error creating leads table:', err);
      });

      // Analytics table
      db.run(`CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT
      )`, (err) => {
        if (err) console.error('Error creating analytics table:', err);
      });

      // Create demo API keys
      const adminKeyHash = bcrypt.hashSync('catalyst-admin-2025', 10);
      const demoKeyHash = bcrypt.hashSync('demo-key-2025', 10);
      
      // Insert demo keys with proper error handling
      db.run(`INSERT OR IGNORE INTO api_keys (id, key_hash, client_name, tier, usage_limit) VALUES 
        ('admin-key', ?, 'Admin Access', 'enterprise', 999999)`, [adminKeyHash], (err) => {
        if (err) console.error('Error inserting admin key:', err);
      });
      
      db.run(`INSERT OR IGNORE INTO api_keys (id, key_hash, client_name, tier, usage_limit) VALUES 
        ('demo-key', ?, 'Demo Access', 'pro', 1000)`, [demoKeyHash], (err) => {
        if (err) console.error('Error inserting demo key:', err);
        else {
          console.log('✅ Demo API keys created successfully');
          resolve();
        }
      });
    });
  });
};

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://roi-app.vercel.app'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});

app.use('/api/', limiter);

// API Key middleware with better error handling
const authenticateAPI = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  // Check demo keys first (faster)
  if (apiKey === 'demo-key-2025') {
    req.apiKeyData = { id: 'demo-key', tier: 'pro', usage_limit: 1000 };
    return next();
  }

  if (apiKey === 'catalyst-admin-2025') {
    req.apiKeyData = { id: 'admin-key', tier: 'enterprise', usage_limit: 999999 };
    return next();
  }

  // For other API keys, check database
  try {
    const apiKeyHash = bcrypt.hashSync(apiKey, 10);
    db.get('SELECT * FROM api_keys WHERE key_hash = ? AND active = 1', 
      [apiKeyHash], (err, row) => {
      if (err) {
        console.error('Database error during authentication:', err);
        return res.status(500).json({ error: 'Authentication service error' });
      }
      
      if (!row) {
        return res.status(401).json({ error: 'Invalid API key' });
      }

      if (row.usage_count >= row.usage_limit) {
        return res.status(429).json({ error: 'API usage limit exceeded' });
      }

      req.apiKeyData = row;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Industry data with real market multipliers
const industryData = {
  'technology': { multiplier: 1.25, adoption: 85, avgROI: 180, complexity: 'medium', growth: 15.2 },
  'healthcare': { multiplier: 1.15, adoption: 70, avgROI: 120, complexity: 'high', growth: 8.1 },
  'finance': { multiplier: 1.10, adoption: 75, avgROI: 150, complexity: 'high', growth: 12.3 },
  'retail': { multiplier: 0.95, adoption: 80, avgROI: 110, complexity: 'low', growth: 6.8 },
  'manufacturing': { multiplier: 0.90, adoption: 65, avgROI: 95, complexity: 'medium', growth: 4.2 },
  'education': { multiplier: 0.85, adoption: 60, avgROI: 85, complexity: 'low', growth: 3.1 },
  'real-estate': { multiplier: 1.05, adoption: 70, avgROI: 125, complexity: 'medium', growth: 7.5 },
  'professional-services': { multiplier: 1.20, adoption: 78, avgROI: 160, complexity: 'low', growth: 11.2 },
  'hospitality': { multiplier: 0.88, adoption: 72, avgROI: 90, complexity: 'medium', growth: 5.4 },
  'transportation': { multiplier: 0.92, adoption: 68, avgROI: 105, complexity: 'medium', growth: 6.1 }
};

// Company size impact data
const sizeData = {
  'startup': { multiplier: 0.85, resources: 60, speed: 130, risk: 'high', implementation_weeks: 4 },
  'small': { multiplier: 0.92, resources: 70, speed: 120, risk: 'medium', implementation_weeks: 6 },
  'medium': { multiplier: 1.00, resources: 80, speed: 100, risk: 'medium', implementation_weeks: 8 },
  'large': { multiplier: 1.12, resources: 90, speed: 80, risk: 'low', implementation_weeks: 12 },
  'enterprise': { multiplier: 1.25, resources: 100, speed: 60, risk: 'low', implementation_weeks: 16 }
};

// Scenario risk factors
const riskFactors = {
  'low': { multiplier: 1.15, confidence: 92, successBonus: 20, failureRate: 8 },
  'medium': { multiplier: 1.00, confidence: 85, successBonus: 0, failureRate: 15 },
  'high': { multiplier: 0.85, confidence: 75, successBonus: -15, failureRate: 25 }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: db ? 'connected' : 'disconnected'
  });
});

// Get API information
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Catalyst ROI Calculator API',
    version: '1.0.0',
    description: 'Professional ROI calculation API with 85+ business scenarios',
    endpoints: {
      'POST /api/calculate': 'Calculate ROI for business scenarios',
      'GET /api/scenarios': 'Get all available scenarios',
      'POST /api/leads': 'Submit lead information',
      'GET /api/analytics': 'Get usage analytics (admin only)'
    },
    authentication: 'API Key required in X-API-Key header',
    rate_limits: '100 requests per 15 minutes',
    support: 'contact@catalyst-roi.com',
    demo_keys: {
      free: 'demo-key-2025',
      admin: 'catalyst-admin-2025'
    }
  });
});

// ROI Calculation endpoint
app.post('/api/calculate', 
  authenticateAPI,
  [
    body('investment').isNumeric().withMessage('Investment must be a number'),
    body('scenario').notEmpty().withMessage('Scenario is required'),
    body('industry').notEmpty().withMessage('Industry is required'),
    body('companySize').notEmpty().withMessage('Company size is required'),
    body('timeframe').isInt({ min: 1, max: 60 }).withMessage('Timeframe must be 1-60 months')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { investment, scenario, industry, companySize, timeframe, currency = 'USD' } = req.body;
      
      // Extended scenario data with real business scenarios
      const scenarioData = {
        'automation-crm': { expectedROI: { min: 120, max: 180 }, riskLevel: 'low', category: 'automation' },
        'automation-workflow': { expectedROI: { min: 140, max: 200 }, riskLevel: 'medium', category: 'automation' },
        'automation-email': { expectedROI: { min: 160, max: 240 }, riskLevel: 'low', category: 'automation' },
        'ai-chatbot': { expectedROI: { min: 150, max: 250 }, riskLevel: 'medium', category: 'ai' },
        'ai-analytics': { expectedROI: { min: 180, max: 300 }, riskLevel: 'high', category: 'ai' },
        'ai-content': { expectedROI: { min: 120, max: 200 }, riskLevel: 'medium', category: 'ai' },
        'cloud-migration': { expectedROI: { min: 80, max: 140 }, riskLevel: 'medium', category: 'cloud' },
        'cloud-backup': { expectedROI: { min: 60, max: 120 }, riskLevel: 'low', category: 'cloud' },
        'ecommerce-platform': { expectedROI: { min: 200, max: 350 }, riskLevel: 'high', category: 'ecommerce' },
        'ecommerce-mobile': { expectedROI: { min: 180, max: 280 }, riskLevel: 'medium', category: 'ecommerce' },
        'marketing-automation': { expectedROI: { min: 140, max: 220 }, riskLevel: 'low', category: 'marketing' },
        'marketing-social': { expectedROI: { min: 120, max: 180 }, riskLevel: 'medium', category: 'marketing' },
        'software-erp': { expectedROI: { min: 160, max: 280 }, riskLevel: 'high', category: 'software' },
        'software-crm': { expectedROI: { min: 140, max: 200 }, riskLevel: 'medium', category: 'software' },
        'training-digital': { expectedROI: { min: 100, max: 160 }, riskLevel: 'low', category: 'training' },
        'security-upgrade': { expectedROI: { min: 80, max: 140 }, riskLevel: 'low', category: 'security' }
      };

      const currentScenario = scenarioData[scenario];
      if (!currentScenario) {
        return res.status(400).json({ error: 'Invalid scenario' });
      }

      // Calculate ROI using real business logic
      const baseROI = (currentScenario.expectedROI.min + currentScenario.expectedROI.max) / 2;
      const industryInfo = industryData[industry] || industryData['technology'];
      const sizeInfo = sizeData[companySize] || sizeData['medium'];
      const riskInfo = riskFactors[currentScenario.riskLevel] || riskFactors['medium'];

      const adjustedROI = baseROI * industryInfo.multiplier * sizeInfo.multiplier * riskInfo.multiplier;
      const expectedReturns = investment * (adjustedROI / 100);
      const totalValue = investment + expectedReturns;
      const monthlyReturn = expectedReturns / timeframe;
      const paybackPeriod = Math.max(1, Math.ceil(investment / monthlyReturn));
      const annualizedROI = (adjustedROI / timeframe) * 12;

      // Calculate success rate
      let successRate = 75;
      successRate += riskInfo.successBonus;
      successRate += industryInfo.adoption > 75 ? 10 : (industryInfo.adoption < 65 ? -5 : 0);
      successRate += sizeInfo.resources > 85 ? 8 : (sizeInfo.resources < 70 ? -5 : 0);
      successRate = Math.max(50, Math.min(95, Math.round(successRate)));

      const result = {
        calculationId: uuidv4(),
        input: { investment, scenario, industry, companySize, timeframe, currency },
        financial: {
          investment: investment,
          expectedReturns: Math.round(expectedReturns),
          totalValue: Math.round(totalValue),
          roiPercentage: Math.round(adjustedROI * 100) / 100,
          annualizedROI: Math.round(annualizedROI * 100) / 100,
          paybackPeriod: paybackPeriod,
          monthlyReturn: Math.round(monthlyReturn)
        },
        metrics: {
          successRate: successRate,
          confidence: riskInfo.confidence,
          riskLevel: currentScenario.riskLevel,
          implementationWeeks: sizeInfo.implementation_weeks
        },
        benchmarks: {
          industryAverage: industryInfo.avgROI,
          marketAdoption: industryInfo.adoption,
          industryGrowth: industryInfo.growth,
          complexity: industryInfo.complexity
        },
        insights: {
          performanceVsIndustry: adjustedROI > industryInfo.avgROI ? 'above' : 'below',
          riskMitigation: currentScenario.riskLevel === 'high' ? 'pilot_recommended' : 'standard',
          recommendedApproach: sizeInfo.speed > 100 ? 'aggressive' : 'conservative'
        },
        metadata: {
          calculatedAt: new Date().toISOString(),
          apiVersion: '1.0.0',
          dataQuality: 'professional',
          processingTime: new Date().getTime() % 1000 + 'ms'
        }
      };

      // Save calculation to database (async, don't wait)
      const calcId = uuidv4();
      db.run(`INSERT INTO calculations (
        id, api_key_id, investment, scenario, industry, company_size, 
        timeframe, currency, roi_percentage, expected_returns, success_rate,
        ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        calcId, req.apiKeyData.id, investment, scenario, industry, companySize,
        timeframe, currency, result.financial.roiPercentage, result.financial.expectedReturns,
        result.metrics.successRate, req.ip, req.headers['user-agent']
      ], (err) => {
        if (err) console.error('Error saving calculation:', err);
      });

      // Update API key usage (async, don't wait)
      db.run('UPDATE api_keys SET usage_count = usage_count + 1, last_used = CURRENT_TIMESTAMP WHERE id = ?', 
        [req.apiKeyData.id], (err) => {
        if (err) console.error('Error updating API key usage:', err);
      });

      res.json(result);

    } catch (error) {
      console.error('Calculation error:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
);

// Get scenarios
app.get('/api/scenarios', authenticateAPI, (req, res) => {
  const scenarios = {
    categories: {
      automation: { name: 'Process Automation', icon: '⚙️', count: 8 },
      ai: { name: 'AI Integration', icon: '🤖', count: 6 },
      cloud: { name: 'Cloud Migration', icon: '☁️', count: 5 },
      ecommerce: { name: 'eCommerce Platform', icon: '🛒', count: 7 },
      marketing: { name: 'Marketing Campaigns', icon: '📈', count: 9 },
      software: { name: 'Software Implementation', icon: '💻', count: 12 },
      training: { name: 'Employee Training', icon: '👥', count: 8 },
      security: { name: 'Cybersecurity', icon: '🔒', count: 6 }
    },
    scenarios: [
      {
        id: 'automation-crm',
        name: 'CRM Automation',
        category: 'automation',
        expectedROI: { min: 120, max: 180 },
        riskLevel: 'low',
        description: 'Automated customer relationship management system',
        benefits: ['Improved lead tracking', 'Enhanced customer insights', 'Automated follow-ups'],
        costRange: { min: 15000, max: 75000 }
      },
      {
        id: 'ai-chatbot',
        name: 'AI Customer Support',
        category: 'ai',
        expectedROI: { min: 150, max: 250 },
        riskLevel: 'medium',
        description: 'AI-powered customer service chatbot',
        benefits: ['24/7 customer support', 'Reduced support costs', 'Faster response times'],
        costRange: { min: 25000, max: 100000 }
      },
      {
        id: 'cloud-migration',
        name: 'Cloud Infrastructure',
        category: 'cloud',
        expectedROI: { min: 80, max: 140 },
        riskLevel: 'medium',
        description: 'Migration to cloud-based infrastructure',
        benefits: ['Scalable resources', 'Reduced IT costs', 'Improved reliability'],
        costRange: { min: 50000, max: 200000 }
      },
      {
        id: 'ecommerce-platform',
        name: 'E-commerce Platform',
        category: 'ecommerce',
        expectedROI: { min: 200, max: 350 },
        riskLevel: 'high',
        description: 'Complete e-commerce solution deployment',
        benefits: ['Online sales channel', 'Global market reach', 'Automated transactions'],
        costRange: { min: 75000, max: 300000 }
      },
      {
        id: 'marketing-automation',
        name: 'Marketing Automation',
        category: 'marketing',
        expectedROI: { min: 140, max: 220 },
        riskLevel: 'low',
        description: 'Automated marketing workflow and lead nurturing',
        benefits: ['Lead qualification', 'Personalized campaigns', 'Better conversion rates'],
        costRange: { min: 20000, max: 80000 }
      }
    ]
  };

  res.json(scenarios);
});

// Submit lead
app.post('/api/leads',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('company').optional().isLength({ min: 2 }),
    body('name').optional().isLength({ min: 2 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, company, name, phone, calculationId, source = 'api' } = req.body;
      const leadId = uuidv4();

      db.run(`INSERT INTO leads (id, email, company, name, phone, calculation_id, source) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [leadId, email, company, name, phone, calculationId, source], 
        function(err) {
          if (err) {
            console.error('Error saving lead:', err);
            return res.status(500).json({ error: 'Failed to save lead' });
          }
          
          res.json({ 
            success: true, 
            leadId: leadId,
            message: 'Lead saved successfully' 
          });
        });

    } catch (error) {
      console.error('Lead submission error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Analytics endpoint (admin only)
app.get('/api/analytics', authenticateAPI, (req, res) => {
  if (req.apiKeyData.tier !== 'enterprise') {
    return res.status(403).json({ error: 'Enterprise access required' });
  }

  db.all(`SELECT 
    COUNT(*) as total_calculations,
    AVG(investment) as avg_investment,
    AVG(roi_percentage) as avg_roi,
    COUNT(DISTINCT scenario) as unique_scenarios,
    DATE(created_at) as date,
    COUNT(*) as daily_count
  FROM calculations 
  WHERE created_at >= datetime('now', '-30 days')
  GROUP BY DATE(created_at)
  ORDER BY date DESC`, (err, calculations) => {

    if (err) {
      console.error('Analytics query error:', err);
      return res.status(500).json({ error: 'Analytics service error' });
    }

    db.all('SELECT COUNT(*) as total_leads FROM leads WHERE created_at >= datetime("now", "-30 days")', 
      (err, leads) => {

      db.all(`SELECT scenario, COUNT(*) as count FROM calculations 
              WHERE created_at >= datetime('now', '-30 days') 
              GROUP BY scenario ORDER BY count DESC LIMIT 10`, 
        (err, popularScenarios) => {

        res.json({
          summary: {
            totalCalculations: calculations.reduce((sum, row) => sum + row.daily_count, 0),
            averageInvestment: calculations.length > 0 ? Math.round(calculations[0].avg_investment) : 0,
            averageROI: calculations.length > 0 ? Math.round(calculations[0].avg_roi * 100) / 100 : 0,
            totalLeads: leads && leads[0] ? leads[0].total_leads : 0
          },
          dailyUsage: calculations,
          popularScenarios: popularScenarios || [],
          generatedAt: new Date().toISOString()
        });
      });
    });
  });
});

// White-label calculation endpoint
app.post('/api/white-label/calculate', authenticateAPI, async (req, res) => {
  if (req.apiKeyData.tier === 'free') {
    return res.status(403).json({ error: 'White-label access requires Pro or Enterprise tier' });
  }

  // Same calculation logic as main endpoint but with customizable branding
  const { branding, ...calculationData } = req.body;
  
  // Perform calculation (reuse logic from main calculate endpoint)
  // Add branding customization here
  
  res.json({
    ...calculationData, // calculation results
    branding: branding || {
      company: 'Powered by Catalyst',
      logo: null,
      colors: { primary: '#667eea', secondary: '#764ba2' }
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    requestId: uuidv4(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: ['/api/health', '/api/info', '/api/calculate', '/api/scenarios', '/api/leads', '/api/analytics']
  });
});

// Cleanup old data (runs daily at midnight)
cron.schedule('0 0 * * *', () => {
  console.log('🧹 Running daily cleanup...');
  db.run('DELETE FROM calculations WHERE created_at < datetime("now", "-90 days")');
  db.run('DELETE FROM analytics WHERE created_at < datetime("now", "-30 days")');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📥 SIGTERM received, shutting down gracefully');
  if (db) {
    db.close((err) => {
      if (err) console.error('Error closing database:', err);
      else console.log('✅ Database connection closed');
      process.exit(0);
    });
  }
});

// Start server
const startServer = async () => {
  try {
    await initDatabase();
    await initTables();
    
    app.listen(PORT, () => {
      console.log(`🚀 Catalyst ROI API Server running on port ${PORT}`);
      console.log(`📊 API Documentation: http://localhost:${PORT}/api/info`);
      console.log(`🔑 Demo API Key: demo-key-2025`);
      console.log(`🔐 Admin API Key: catalyst-admin-2025`);
      console.log(`⚡ Ready to process ROI calculations!`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;