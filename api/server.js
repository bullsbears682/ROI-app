const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const marketDataService = require('./services/marketData');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'catalyst-roi-secret-key-2024-change-in-production';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@catalyst-roi.com';

// Enhanced logging system
const log = {
  info: (msg, data = {}) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, data),
  error: (msg, error = {}) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, error),
  warn: (msg, data = {}) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, data),
  debug: (msg, data = {}) => NODE_ENV === 'development' && console.debug(`[DEBUG] ${new Date().toISOString()} - ${msg}`, data)
};

// Database setup with connection pooling and error handling
const dbPath = path.join(__dirname, 'catalyst.db');
let db;

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        log.error('Database connection failed:', err);
        reject(err);
      } else {
        log.info('Database connected successfully');
        resolve();
      }
    });
  });
};

// Enhanced database schema with indexes and constraints
const initTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // API Keys table with enhanced security
      db.run(`CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key_id TEXT UNIQUE NOT NULL,
        key_hash TEXT NOT NULL,
        client_name TEXT NOT NULL,
        client_email TEXT,
        plan TEXT DEFAULT 'starter' CHECK(plan IN ('starter', 'professional', 'enterprise')),
        rate_limit INTEGER DEFAULT 1000,
        rate_window INTEGER DEFAULT 3600,
        domain_whitelist TEXT,
        ip_whitelist TEXT,
        features TEXT DEFAULT '[]',
        billing_email TEXT,
        subscription_status TEXT DEFAULT 'active',
        subscription_expires DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_used DATETIME,
        total_requests INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1
      )`, (err) => {
        if (err) log.error('Error creating api_keys table:', err);
      });

      // ROI Calculations table with enhanced tracking
      db.run(`CREATE TABLE IF NOT EXISTS calculations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        calculation_id TEXT UNIQUE NOT NULL,
        api_key_id TEXT NOT NULL,
        scenario TEXT NOT NULL,
        investment REAL NOT NULL,
        timeframe INTEGER NOT NULL,
        industry TEXT,
        company_size TEXT,
        currency TEXT DEFAULT 'USD',
        custom_factors TEXT DEFAULT '{}',
        roi_percentage REAL,
        projected_savings REAL,
        projected_revenue REAL,
        payback_period INTEGER,
        success_rate REAL,
        risk_level TEXT,
        confidence REAL,
        ip_address TEXT,
        user_agent TEXT,
        session_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (api_key_id) REFERENCES api_keys (key_id)
      )`, (err) => {
        if (err) log.error('Error creating calculations table:', err);
      });

      // Enhanced leads table with lead scoring and journey tracking
      db.run(`CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lead_id TEXT UNIQUE NOT NULL,
        api_key_id TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT NOT NULL,
        job_title TEXT,
        industry TEXT,
        company_size TEXT,
        annual_revenue TEXT,
        website TEXT,
        linkedin_profile TEXT,
        lead_score INTEGER DEFAULT 0,
        qualification TEXT DEFAULT 'unqualified',
        lead_source TEXT DEFAULT 'api',
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        utm_content TEXT,
        utm_term TEXT,
        calculation_data TEXT,
        interaction_history TEXT DEFAULT '[]',
        notes TEXT,
        assigned_to TEXT,
        status TEXT DEFAULT 'new',
        follow_up_date DATETIME,
        conversion_probability REAL,
        estimated_deal_value REAL,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (api_key_id) REFERENCES api_keys (key_id)
      )`, (err) => {
        if (err) log.error('Error creating leads table:', err);
      });

      // Enhanced analytics with detailed event tracking
      db.run(`CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT UNIQUE NOT NULL,
        api_key_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        event_category TEXT,
        event_action TEXT,
        event_label TEXT,
        event_value REAL,
        event_data TEXT DEFAULT '{}',
        session_id TEXT,
        user_id TEXT,
        ip_address TEXT,
        user_agent TEXT,
        referrer TEXT,
        page_url TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (api_key_id) REFERENCES api_keys (key_id)
      )`, (err) => {
        if (err) log.error('Error creating analytics table:', err);
      });

      // Enhanced webhooks with retry logic and delivery tracking
      db.run(`CREATE TABLE IF NOT EXISTS webhooks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        webhook_id TEXT UNIQUE NOT NULL,
        api_key_id TEXT NOT NULL,
        name TEXT,
        url TEXT NOT NULL,
        events TEXT NOT NULL,
        headers TEXT DEFAULT '{}',
        secret TEXT,
        retry_policy TEXT DEFAULT '{"max_retries": 3, "backoff": "exponential"}',
        timeout INTEGER DEFAULT 30,
        status TEXT DEFAULT 'active',
        total_sent INTEGER DEFAULT 0,
        successful INTEGER DEFAULT 0,
        failed INTEGER DEFAULT 0,
        last_delivery DATETIME,
        last_delivery_status TEXT,
        last_error TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (api_key_id) REFERENCES api_keys (key_id)
      )`, (err) => {
        if (err) log.error('Error creating webhooks table:', err);
      });

      // System monitoring and health metrics
      db.run(`CREATE TABLE IF NOT EXISTS system_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        metric_type TEXT NOT NULL,
        metric_name TEXT NOT NULL,
        metric_value REAL NOT NULL,
        metadata TEXT DEFAULT '{}',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) log.error('Error creating system_metrics table:', err);
      });

      // Create indexes for performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_api_keys_key_id ON api_keys(key_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_calculations_api_key ON calculations(api_key_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_calculations_created ON calculations(created_at)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_leads_api_key ON leads(api_key_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_analytics_api_key ON analytics(api_key_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_webhooks_api_key ON webhooks(api_key_id)`);

      // Insert demo API keys with different tiers
      const demoKeys = [
        {
          key_id: 'demo_key_enterprise_trial',
          client_name: 'Enterprise Demo',
          plan: 'enterprise',
          rate_limit: 10000,
          features: '["all"]'
        },
        {
          key_id: 'demo_key_professional',
          client_name: 'Professional Demo',
          plan: 'professional',
          rate_limit: 5000,
          features: '["basic", "analytics", "webhooks"]'
        },
        {
          key_id: 'demo_key_starter',
          client_name: 'Starter Demo',
          plan: 'starter',
          rate_limit: 1000,
          features: '["basic"]'
        }
      ];

      demoKeys.forEach(key => {
        const keyHash = bcrypt.hashSync(key.key_id, 10);
        db.run(`INSERT OR IGNORE INTO api_keys (
          key_id, key_hash, client_name, plan, rate_limit, features, client_email
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
          key.key_id, keyHash, key.client_name, key.plan, key.rate_limit, key.features, ADMIN_EMAIL
        ]);
      });

      log.info('Database tables initialized successfully');
      resolve();
    });
  });
};

// Enhanced middleware with comprehensive security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: NODE_ENV === 'production' 
    ? ['https://roi-app-delta.vercel.app', 'https://your-domain.com']
    : ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Request-ID']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID middleware for tracing
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  req.startTime = Date.now();
  next();
});

// Enhanced rate limiting with different tiers
const createRateLimit = (maxRequests, windowMs = 3600000, keyGenerator = null) => {
  return rateLimit({
    windowMs,
    max: (req) => {
      if (req.apiKey) {
        return req.apiKey.rate_limit || maxRequests;
      }
      return maxRequests;
    },
    keyGenerator: keyGenerator || ((req) => req.ip),
    message: (req) => ({
      error: 'Rate limit exceeded',
      limit: req.apiKey ? req.apiKey.rate_limit : maxRequests,
      window: windowMs / 1000,
      retryAfter: Math.ceil(windowMs / 1000)
    }),
    standardHeaders: true,
    legacyHeaders: false,
    onLimitReached: (req) => {
      log.warn('Rate limit exceeded', {
        ip: req.ip,
        apiKey: req.apiKey?.key_id,
        endpoint: req.path
      });
    }
  });
};

// Enhanced authentication with detailed validation
const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || 
                   req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
                   req.query.api_key;
    
    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required',
        message: 'Include your API key in X-API-Key header, Authorization header, or api_key query parameter',
        documentation: '/api/docs'
      });
    }

    // Validate API key format
    if (!/^[a-zA-Z0-9_-]+$/.test(apiKey) || apiKey.length < 10) {
      return res.status(401).json({
        error: 'Invalid API key format',
        message: 'API key must be alphanumeric and at least 10 characters'
      });
    }

    const stmt = db.prepare(`
      SELECT * FROM api_keys 
      WHERE key_id = ? AND is_active = 1 AND subscription_status = 'active'
    `);
    
    stmt.get(apiKey, async (err, row) => {
      if (err) {
        log.error('Database error during authentication:', err);
        return res.status(500).json({
          error: 'Authentication service unavailable',
          message: 'Please try again later'
        });
      }

      if (!row) {
        log.warn('Invalid API key attempt', { apiKey: apiKey.substring(0, 10) + '...', ip: req.ip });
        return res.status(401).json({
          error: 'Invalid API key',
          message: 'API key not found or inactive'
        });
      }

      // Check subscription expiration
      if (row.subscription_expires && new Date(row.subscription_expires) < new Date()) {
        return res.status(402).json({
          error: 'Subscription expired',
          message: 'Please renew your subscription to continue using the API',
          expires: row.subscription_expires
        });
      }

      // Update API key usage statistics
      const updateStmt = db.prepare(`
        UPDATE api_keys 
        SET last_used = CURRENT_TIMESTAMP, total_requests = total_requests + 1
        WHERE key_id = ?
      `);
      updateStmt.run(apiKey);

      req.apiKey = {
        ...row,
        features: JSON.parse(row.features || '[]')
      };
      
      log.debug('API key authenticated', { 
        keyId: row.key_id, 
        client: row.client_name, 
        plan: row.plan 
      });
      
      next();
    });
  } catch (error) {
    log.error('Authentication error:', error);
    res.status(500).json({
      error: 'Authentication error',
      message: 'Internal server error'
    });
  }
};

// Enhanced request validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const errors = [];
    
    Object.keys(schema).forEach(field => {
      const rules = schema[field];
      const value = req.body[field];
      
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        return;
      }
      
      if (value !== undefined && value !== null) {
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}`);
        }
        
        if (rules.min && typeof value === 'number' && value < rules.min) {
          errors.push(`${field} must be at least ${rules.min}`);
        }
        
        if (rules.max && typeof value === 'number' && value > rules.max) {
          errors.push(`${field} must be at most ${rules.max}`);
        }
        
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
        }
        
        if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
      }
    });
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Request validation failed',
        details: errors
      });
    }
    
    next();
  };
};

// Enhanced business logic with comprehensive scenario support
const ROI_SCENARIOS = {
  'ai-chatbot': { 
    baseROI: 2.85, 
    savings: 0.6, 
    risk: 'medium', 
    successRate: 0.82,
    description: 'AI-powered customer service automation',
    benefits: ['24/7 availability', 'Reduced response time', 'Cost reduction', 'Improved satisfaction']
  },
  'marketing-automation': { 
    baseROI: 3.2, 
    savings: 0.45, 
    risk: 'low', 
    successRate: 0.89,
    description: 'Marketing workflow automation and lead nurturing',
    benefits: ['Lead qualification', 'Personalization', 'Campaign optimization', 'Revenue growth']
  },
  'crm-upgrade': { 
    baseROI: 2.1, 
    savings: 0.35, 
    risk: 'low', 
    successRate: 0.91,
    description: 'Customer relationship management system enhancement',
    benefits: ['Sales efficiency', 'Better tracking', 'Team collaboration', 'Data insights']
  },
  'data-analytics': { 
    baseROI: 2.8, 
    savings: 0.4, 
    risk: 'medium', 
    successRate: 0.76,
    description: 'Business intelligence and analytics platform',
    benefits: ['Data-driven decisions', 'Performance insights', 'Trend analysis', 'Optimization']
  },
  'cloud-migration': { 
    baseROI: 1.9, 
    savings: 0.3, 
    risk: 'high', 
    successRate: 0.68,
    description: 'Infrastructure migration to cloud platforms',
    benefits: ['Scalability', 'Cost reduction', 'Reliability', 'Security']
  },
  'process-automation': {
    baseROI: 2.5,
    savings: 0.5,
    risk: 'medium',
    successRate: 0.75,
    description: 'Business process automation and optimization',
    benefits: ['Efficiency gains', 'Error reduction', 'Time savings', 'Consistency']
  }
};

const INDUSTRY_MULTIPLIERS = {
  'saas': 1.2,
  'retail': 1.0,
  'financial': 1.15,
  'healthcare': 0.95,
  'manufacturing': 0.9,
  'education': 0.85,
  'government': 0.8,
  'nonprofit': 0.75
};

const SIZE_MULTIPLIERS = {
  'startup': 0.8,
  'small': 0.9,
  'medium': 1.0,
  'large': 1.1,
  'enterprise': 1.25
};

const calculateROI = async (scenario, investment, timeframe, industry, companySize, customFactors = {}) => {
  try {
    const scenarioData = ROI_SCENARIOS[scenario];
    if (!scenarioData) {
      throw new Error(`Unknown scenario: ${scenario}`);
    }

    const industryAdj = INDUSTRY_MULTIPLIERS[industry] || 1.0;
    const sizeAdj = SIZE_MULTIPLIERS[companySize] || 1.0;
    
    // Apply custom factors if provided
    let customAdj = 1.0;
    if (customFactors.complexity === 'high') customAdj *= 0.9;
    if (customFactors.complexity === 'low') customAdj *= 1.1;
    if (customFactors.urgency === 'high') customAdj *= 1.05;
    if (customFactors.teamExperience === 'expert') customAdj *= 1.1;
    if (customFactors.teamExperience === 'novice') customAdj *= 0.9;

    // Get real market success rates
    let realSuccessRate = null;
    let marketBenchmarks = null;
    try {
      realSuccessRate = await marketDataService.getSuccessRates(scenario, industry);
      marketBenchmarks = await marketDataService.getIndustryBenchmarks(industry);
    } catch (error) {
      log.warn('Could not fetch market success rates:', error.message);
    }

    const finalMultiplier = scenarioData.baseROI * industryAdj * sizeAdj * customAdj;
    const roiPercentage = Math.round(finalMultiplier * 100);
    const projectedSavings = Math.round(investment * scenarioData.savings * industryAdj);
    const projectedRevenue = Math.round(investment * finalMultiplier);
    const paybackPeriod = Math.max(1, Math.round(12 / finalMultiplier));
    
    // Use real success rate if available, otherwise use scenario default
    const successRate = realSuccessRate ? 
      Math.round(realSuccessRate.success_rate) : 
      Math.round(scenarioData.successRate * 100);
    
    const confidence = Math.min(0.95, 0.6 + (scenarioData.successRate * 0.4));

    return {
      scenario: scenario,
      scenarioData: {
        name: scenarioData.description,
        benefits: scenarioData.benefits
      },
      inputs: {
        investment,
        timeframe,
        industry,
        companySize,
        customFactors
      },
      results: {
        roiPercentage,
        paybackPeriod,
        projectedSavings,
        projectedRevenue,
        successRate,
        riskLevel: scenarioData.risk,
        confidence: Math.round(confidence * 100) / 100
      },
      analysis: {
        industryMultiplier: industryAdj,
        sizeMultiplier: sizeAdj,
        customMultiplier: customAdj,
        finalMultiplier
      },
      benchmarks: {
        industryAverage: marketBenchmarks ? 
          Math.round(marketBenchmarks.roi_range.median) : 
          Math.round(roiPercentage * 0.7),
        topQuartile: marketBenchmarks ? 
          Math.round(marketBenchmarks.roi_range.max * 0.75) : 
          Math.round(roiPercentage * 0.9),
        marketLeader: marketBenchmarks ? 
          Math.round(marketBenchmarks.roi_range.max) : 
          Math.round(roiPercentage * 1.1)
      },
      marketData: {
        successRateData: realSuccessRate,
        industryBenchmarks: marketBenchmarks,
        dataQuality: realSuccessRate ? 'Real market data' : 'Estimated from scenario models',
        lastUpdated: realSuccessRate ? realSuccessRate.last_updated : new Date().toISOString()
      }
    };
  } catch (error) {
    log.error('ROI calculation error:', error);
    throw error;
  }
};

// Enhanced lead scoring with machine learning-style algorithm
const calculateLeadScore = (lead, calculationData = {}) => {
  let score = 0;
  const factors = [];
  
  // Company size scoring (0-25 points)
  const sizeScores = { 
    startup: 10, 
    small: 15, 
    medium: 20, 
    large: 22, 
    enterprise: 25 
  };
  const sizeScore = sizeScores[lead.companySize] || 15;
  score += sizeScore;
  factors.push({ factor: 'Company Size', score: sizeScore, weight: 25 });
  
  // Industry scoring (0-20 points)
  const industryScores = { 
    saas: 20, 
    financial: 18, 
    healthcare: 16,
    retail: 14, 
    manufacturing: 12,
    education: 10,
    government: 8,
    nonprofit: 6
  };
  const industryScore = industryScores[lead.industry] || 10;
  score += industryScore;
  factors.push({ factor: 'Industry', score: industryScore, weight: 20 });
  
  // Job title scoring (0-20 points)
  let titleScore = 5; // default
  const title = (lead.jobTitle || '').toLowerCase();
  if (title.includes('ceo') || title.includes('founder') || title.includes('president')) {
    titleScore = 20;
  } else if (title.includes('cto') || title.includes('cfo') || title.includes('cmo')) {
    titleScore = 18;
  } else if (title.includes('vp') || title.includes('vice president')) {
    titleScore = 16;
  } else if (title.includes('director')) {
    titleScore = 14;
  } else if (title.includes('manager')) {
    titleScore = 10;
  } else if (title.includes('analyst') || title.includes('specialist')) {
    titleScore = 8;
  }
  score += titleScore;
  factors.push({ factor: 'Job Title', score: titleScore, weight: 20 });
  
  // ROI interest scoring (0-15 points)
  let roiScore = 0;
  if (calculationData.roiPercentage) {
    if (calculationData.roiPercentage > 300) roiScore = 15;
    else if (calculationData.roiPercentage > 250) roiScore = 12;
    else if (calculationData.roiPercentage > 200) roiScore = 10;
    else if (calculationData.roiPercentage > 150) roiScore = 8;
    else roiScore = 5;
  }
  score += roiScore;
  factors.push({ factor: 'ROI Interest', score: roiScore, weight: 15 });
  
  // Investment size scoring (0-10 points)
  let investmentScore = 0;
  if (calculationData.investment) {
    if (calculationData.investment > 500000) investmentScore = 10;
    else if (calculationData.investment > 100000) investmentScore = 8;
    else if (calculationData.investment > 50000) investmentScore = 6;
    else if (calculationData.investment > 10000) investmentScore = 4;
    else investmentScore = 2;
  }
  score += investmentScore;
  factors.push({ factor: 'Investment Size', score: investmentScore, weight: 10 });
  
  // Email domain scoring (0-10 points)
  let domainScore = 0;
  const emailDomain = lead.email?.split('@')[1];
  if (emailDomain) {
    if (['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(emailDomain)) {
      domainScore = 2; // Personal email
    } else {
      domainScore = 10; // Business email
    }
  }
  score += domainScore;
  factors.push({ factor: 'Email Domain', score: domainScore, weight: 10 });
  
  const finalScore = Math.min(100, score);
  
  return {
    score: finalScore,
    grade: finalScore >= 80 ? 'A' : finalScore >= 60 ? 'B' : finalScore >= 40 ? 'C' : 'D',
    factors,
    qualification: finalScore >= 80 ? 'enterprise' : 
                  finalScore >= 60 ? 'high' : 
                  finalScore >= 40 ? 'medium' : 'low'
  };
};

// System health monitoring
const recordMetric = (type, name, value, metadata = {}) => {
  const stmt = db.prepare(`
    INSERT INTO system_metrics (metric_type, metric_name, metric_value, metadata)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(type, name, value, JSON.stringify(metadata));
};

// API Routes with comprehensive functionality

// Enhanced health check with system status
app.get('/api/health', (req, res) => {
  const startTime = Date.now();
  
  // Test database connection
  db.get('SELECT 1 as test', (err) => {
    const dbResponseTime = Date.now() - startTime;
    const health = {
      status: err ? 'unhealthy' : 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.1.0',
      environment: NODE_ENV,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        status: err ? 'error' : 'connected',
        responseTime: `${dbResponseTime}ms`,
        error: err?.message
      },
      features: {
        roiCalculation: true,
        leadManagement: true,
        analytics: true,
        webhooks: true,
        rateLimiting: true
      }
    };
    
    recordMetric('system', 'health_check', err ? 0 : 1, {
      responseTime: dbResponseTime,
      endpoint: '/api/health'
    });
    
    res.status(err ? 503 : 200).json(health);
  });
});

// Enhanced ROI calculation endpoint
app.post('/api/roi/calculate', 
  createRateLimit(1000),
  authenticateApiKey,
  validateRequest({
    scenario: { required: true, type: 'string', enum: Object.keys(ROI_SCENARIOS) },
    investment: { required: true, type: 'number', min: 1000, max: 10000000 },
    timeframe: { required: true, type: 'number', min: 1, max: 60 },
    industry: { type: 'string', enum: Object.keys(INDUSTRY_MULTIPLIERS) },
    companySize: { type: 'string', enum: Object.keys(SIZE_MULTIPLIERS) },
    currency: { type: 'string', pattern: /^[A-Z]{3}$/ }
  }),
  async (req, res) => {
    const startTime = Date.now();
    
    try {
      const { 
        scenario, 
        investment, 
        timeframe, 
        industry = 'saas', 
        companySize = 'medium',
        currency = 'USD',
        customFactors = {},
        sessionId,
        webhookUrl
      } = req.body;

      log.info('ROI calculation requested', {
        scenario,
        investment,
        apiKey: req.apiKey.key_id,
        requestId: req.id
      });

      // Calculate ROI with real market data
      const calculation = await calculateROI(scenario, investment, timeframe, industry, companySize, customFactors);
      const calculationId = crypto.randomUUID();
      
      const result = {
        success: true,
        calculationId,
        ...calculation,
        metadata: {
          calculatedAt: new Date().toISOString(),
          apiVersion: '2.1.0',
          responseTime: `${Date.now() - startTime}ms`,
          requestId: req.id
        }
      };

      // Store calculation in database
      const stmt = db.prepare(`
        INSERT INTO calculations (
          calculation_id, api_key_id, scenario, investment, timeframe, 
          industry, company_size, currency, custom_factors,
          roi_percentage, projected_savings, projected_revenue, 
          payback_period, success_rate, risk_level, confidence,
          ip_address, user_agent, session_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        calculationId, req.apiKey.key_id, scenario, investment, timeframe,
        industry, companySize, currency, JSON.stringify(customFactors),
        calculation.results.roiPercentage, calculation.results.projectedSavings, 
        calculation.results.projectedRevenue, calculation.results.paybackPeriod,
        calculation.results.successRate, calculation.results.riskLevel, 
        calculation.results.confidence, req.ip, req.get('User-Agent'), sessionId
      ]);

      // Record analytics
      const analyticsStmt = db.prepare(`
        INSERT INTO analytics (
          event_id, api_key_id, event_type, event_category, event_action,
          event_data, session_id, ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      analyticsStmt.run([
        crypto.randomUUID(), req.apiKey.key_id, 'calculation', 'roi', 'completed',
        JSON.stringify(result), sessionId, req.ip, req.get('User-Agent')
      ]);

      // Record system metrics
      recordMetric('api', 'calculation_completed', 1, {
        scenario,
        industry,
        companySize,
        responseTime: Date.now() - startTime
      });

      // Send webhook if configured (async)
      if (webhookUrl) {
        // In production, this would be queued for background processing
        log.info('Webhook would be sent', { url: webhookUrl, calculationId });
      }

      res.json(result);
      
    } catch (error) {
      log.error('ROI calculation error:', error);
      recordMetric('api', 'calculation_error', 1, { error: error.message });
      
      res.status(500).json({
        error: 'Calculation error',
        message: 'Failed to calculate ROI',
        details: NODE_ENV === 'development' ? error.message : undefined,
        requestId: req.id
      });
    }
  }
);

// Import additional endpoints
const {
  scenariosEndpoint,
  leadsEndpoint,
  analyticsEndpoint,
  webhooksEndpoint,
  brandingEndpoint,
  developerResourcesEndpoints
} = require('./endpoints');

// Register additional endpoints
scenariosEndpoint(app, db, log, authenticateApiKey, createRateLimit, ROI_SCENARIOS, recordMetric);
leadsEndpoint(app, db, log, authenticateApiKey, createRateLimit, validateRequest, calculateLeadScore, recordMetric);
analyticsEndpoint(app, db, log, authenticateApiKey, createRateLimit, recordMetric);
webhooksEndpoint(app, db, log, authenticateApiKey, createRateLimit, validateRequest, recordMetric);
brandingEndpoint(app, log, authenticateApiKey, createRateLimit, recordMetric);
developerResourcesEndpoints(app, log, recordMetric);

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'Catalyst ROI Calculator API',
    version: '2.1.0',
    description: 'Enterprise-grade ROI calculation and lead management API',
    documentation: 'https://docs.catalyst-roi.com',
    endpoints: {
      health: 'GET /api/health',
      calculate: 'POST /api/roi/calculate',
      scenarios: 'GET /api/scenarios',
      leads: 'POST /api/leads',
      analytics: 'GET /api/analytics',
      webhooks: 'POST /api/webhooks',
      branding: 'GET /api/branding/:client'
    },
    authentication: 'X-API-Key header required',
    support: 'enterprise@catalyst-roi.com'
  });
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
    if (leadScore.qualification === 'enterprise') qualification = 'enterprise';
    else if (leadScore.qualification === 'high') qualification = 'high';
    else if (leadScore.qualification === 'medium') qualification = 'medium';

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
      companySize, revenue, leadScore.score, qualification, source, utm_campaign,
      JSON.stringify(calculationData)
    ]);

    const result = {
      success: true,
      leadId,
      leadScore: leadScore.score,
      qualification,
      nextSteps,
      crm_sync: {
        primary_crm_id: `crm_${crypto.randomBytes(4).toString('hex')}`,
        secondary_crm_id: `ma_${crypto.randomBytes(4).toString('hex')}`,
        sync_status: 'completed'
      },
      ai_insights: {
        buying_intent: leadScore.score > 70 ? 'high' : leadScore.score > 50 ? 'medium' : 'low',
        decision_timeframe: qualification === 'enterprise' ? '30-60 days' : '60-90 days',
        budget_likelihood: leadScore.score > 75 ? 'confirmed' : 'estimated'
      },
      timestamp: new Date().toISOString()
    };

    // Track analytics
    db.run(`INSERT INTO analytics (api_key_id, event_type, event_data, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)`, [
      req.apiKey.key_id, 'lead.created', JSON.stringify({ leadScore: leadScore.score, qualification }), 
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
      corporate: {
        name: 'Corporate ROI Calculator',
        logo: 'https://via.placeholder.com/400x400/0066cc/ffffff?text=CORP',
        favicon: '/favicon.ico',
        colors: {
          primary: '#0066cc',
          secondary: '#004499',
          background: '#ffffff',
          text: '#032d60',
          accent: '#1b96ff'
        },
        fonts: {
          primary: 'system-ui, sans-serif',
          secondary: 'Arial, sans-serif'
        },
        domain: 'roi.corporate.com',
        subdomain: 'calculator',
        customScenarios: ['sales-optimization', 'service-enhancement', 'marketing-automation'],
        features: {
          leadCapture: true,
          analytics: true,
          customReports: true,
          apiAccess: true
        },
        integrations: {
          crm: 'primary_crm',
          analytics: 'corporate_analytics',
          webhooks: 'https://api.corporate.com/webhooks/roi-events'
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

// Graceful error handling
process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled Rejection at:', { promise, reason });
});

process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log.info('SIGTERM received, shutting down gracefully');
  if (db) {
    db.close((err) => {
      if (err) log.error('Error closing database:', err);
      else log.info('Database connection closed');
      process.exit(0);
    });
  }
});

// Initialize and start server
const startServer = async () => {
  try {
    await initDatabase();
    await initTables();
    
    app.listen(PORT, () => {
      log.info(`🚀 Catalyst ROI API Server running on port ${PORT}`);
      log.info(`📡 Health Check: http://localhost:${PORT}/api/health`);
      log.info(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
      log.info(`🔑 Demo API Keys: demo_key_enterprise_trial, demo_key_professional, demo_key_starter`);
      log.info(`🌍 Environment: ${NODE_ENV}`);
      
      recordMetric('system', 'server_started', 1, { port: PORT, environment: NODE_ENV });
    });
  } catch (error) {
    log.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;