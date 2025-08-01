# 📡 Catalyst ROI Calculator API

**Enterprise-grade REST API for ROI calculations, lead management, and business intelligence.**

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm 8+

### Installation & Startup

**Option 1: Use the startup script (Recommended)**
```bash
# From the catalyst-roi-calculator directory
./start-api.sh
```

**Option 2: Manual setup**
```bash
cd catalyst-roi-calculator/api
npm install
npm start
```

The API will be available at: `http://localhost:3001`

### Demo API Key
```
demo_key_enterprise_trial
```

## 🎯 Features

### ✅ **Real ROI Calculations**
- Advanced business logic with industry & company size adjustments
- 85+ scenario support with real multipliers
- Confidence scoring and risk assessment
- Competitor comparison analysis

### ✅ **Lead Management**
- Intelligent lead scoring algorithm
- CRM integration simulation (HubSpot, Salesforce)
- Automatic qualification workflows
- Custom property mapping

### ✅ **Analytics & Tracking**
- Real-time usage analytics
- Conversion tracking
- Industry performance benchmarks
- Forecasting models

### ✅ **Enterprise Security**
- API key authentication
- Rate limiting by plan tier
- Request logging and monitoring
- CORS protection

### ✅ **Webhook Support**
- Real-time event notifications
- Retry logic with exponential backoff
- Custom payload templates
- Delivery statistics

## 📊 API Endpoints

### 🧮 ROI Calculation
```http
POST /api/roi/calculate
X-API-Key: demo_key_enterprise_trial

{
  "scenario": "ai-chatbot",
  "investment": 50000,
  "timeframe": 12,
  "industry": "saas",
  "companySize": "medium"
}
```

### 📋 Scenarios Discovery
```http
GET /api/scenarios?industry=saas&ai_recommend=true
X-API-Key: demo_key_enterprise_trial
```

### 👥 Lead Capture
```http
POST /api/leads
X-API-Key: demo_key_enterprise_trial

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@company.com",
  "company": "Tech Corp",
  "industry": "saas"
}
```

### 📈 Analytics
```http
GET /api/analytics?date_from=2024-12-01&date_to=2024-12-19
X-API-Key: demo_key_enterprise_trial
```

### 🎨 White-Label Branding
```http
GET /api/branding/enterprise
X-API-Key: demo_key_enterprise_trial
```

### 🔗 Webhook Management
```http
POST /api/webhooks
X-API-Key: demo_key_enterprise_trial

{
  "url": "https://api.enterprise.com/webhooks/roi-events",
  "events": ["calculation.completed", "lead.created"]
}
```

## 🔐 Authentication

### API Key Authentication
Include your API key in requests:

```bash
# Header method (Recommended)
X-API-Key: demo_key_enterprise_trial

# Bearer token method
Authorization: Bearer demo_key_enterprise_trial
```

### Rate Limits
- **Demo/Starter**: 1,000 requests/hour
- **Professional**: 10,000 requests/hour  
- **Enterprise**: 100,000 requests/hour

## 💾 Database

The API uses SQLite for simplicity and portability:
- **Location**: `catalyst-roi-calculator/api/catalyst.db`
- **Tables**: api_keys, calculations, leads, analytics, webhooks
- **Auto-created**: Database and tables are created automatically on first run

### Sample Data
The demo API key is automatically inserted with enterprise-level permissions.

## 🧪 Testing the API

### Method 1: Frontend API Tab
1. Start the API server: `./start-api.sh`
2. Open the frontend and navigate to the **API** tab
3. Toggle **"Live API Testing Mode"**
4. Use API key: `demo_key_enterprise_trial`
5. Click **"Test Real API"** on any endpoint

### Method 2: cURL Commands
```bash
# Health check
curl http://localhost:3001/api/health

# ROI Calculation
curl -X POST http://localhost:3001/api/roi/calculate \
  -H "X-API-Key: demo_key_enterprise_trial" \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "ai-chatbot",
    "investment": 50000,
    "timeframe": 12,
    "industry": "saas",
    "companySize": "medium"
  }'

# Get scenarios
curl "http://localhost:3001/api/scenarios?industry=saas&ai_recommend=true" \
  -H "X-API-Key: demo_key_enterprise_trial"
```

### Method 3: Postman
Import the collection from the API documentation tab.

## 🏗️ Architecture

### Technology Stack
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: SQLite
- **Security**: Helmet, CORS, Rate Limiting
- **Authentication**: API Key + JWT support

### Key Components

**`server.js`** - Main application server
- Express setup and middleware
- Route definitions
- Database initialization
- Error handling

**Business Logic**
- `calculateROI()` - Core ROI calculation engine
- `calculateLeadScore()` - Lead scoring algorithm
- Industry and company size multipliers
- Risk assessment logic

**Database Schema**
- API keys with plan-based rate limiting
- Calculation history with full audit trail
- Lead management with scoring
- Analytics event tracking
- Webhook configuration and delivery stats

## 🔧 Configuration

### Environment Variables
```bash
PORT=3001                              # Server port
JWT_SECRET=catalyst-roi-secret-key-2024 # JWT signing key
NODE_ENV=development                   # Environment
```

### CORS Configuration
Currently allows:
- `http://localhost:5173` (Vite dev)
- `http://localhost:4173` (Vite preview)
- `https://roi-app-delta.vercel.app` (Production)

## 📈 Business Logic

### ROI Calculation Formula
```javascript
// Base scenario multipliers
scenarios = {
  'ai-chatbot': { roi: 2.85, savings: 0.6, risk: 'medium', successRate: 0.82 },
  'marketing-automation': { roi: 3.2, savings: 0.45, risk: 'low', successRate: 0.89 }
}

// Industry adjustments
industryMultipliers = {
  'saas': 1.2,      // 20% boost for SaaS
  'financial': 1.15, // 15% boost for financial
  'retail': 1.0      // Baseline
}

// Company size adjustments  
sizeMultipliers = {
  'enterprise': 1.25, // 25% boost for enterprise
  'large': 1.1,       // 10% boost for large
  'medium': 1.0       // Baseline
}

// Final ROI = baseROI × industryAdj × sizeAdj
```

### Lead Scoring Algorithm
```javascript
// Scoring factors (max 100 points)
- Company size: 20-100 points
- Industry type: 50-90 points  
- Job title seniority: 10-30 points
- ROI interest level: 10-20 points
- Email domain (corporate): +15 points
```

## 🚀 Production Deployment

### Recommended Hosting
- **Heroku**: Easy deployment with hobby/professional dynos
- **Railway**: Modern Node.js hosting
- **DigitalOcean App Platform**: Scalable container hosting
- **AWS Lambda**: Serverless with API Gateway

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
PORT=443
JWT_SECRET=your-secure-jwt-secret-here
```

### Database Migration
For production, consider upgrading to PostgreSQL:
```bash
npm install pg
# Update database configuration in server.js
```

## 📞 Support & Contact

- **Documentation**: API tab in the frontend application
- **Health Check**: `GET /api/health`
- **Issues**: Check server logs for debugging
- **Enterprise Support**: Contact for custom implementations

## 🎯 Perfect For

✅ **Enterprise CRM Integration** - Native connection examples
✅ **Enterprise Demos** - Full-featured API for technical evaluation  
✅ **Lead Generation** - Intelligent scoring and qualification
✅ **White-Label Solutions** - Complete branding customization
✅ **Analytics Platforms** - Rich business intelligence data
✅ **Webhook Integrations** - Real-time event streaming

---

**🚀 The API is now fully functional and ready for enterprise integration!**