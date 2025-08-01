# 🚀 Catalyst ROI Calculator - Deployment Guide

Complete deployment instructions for both frontend and backend components.

## 📋 Prerequisites

- Node.js 18+ 
- Git account
- Deployment platform accounts (Railway, Vercel, Heroku)

## 🎯 Quick Deploy Options

### Option 1: Railway (Recommended for API) + Vercel (Frontend)
- **API Backend**: Railway (automatic deployment from Git)
- **Frontend**: Vercel (static hosting with edge functions)
- **Total Time**: ~10 minutes

### Option 2: Heroku (Full-stack)
- **Both**: Single Heroku app
- **Total Time**: ~15 minutes

### Option 3: Self-hosted
- **Both**: Your own server/VPS
- **Total Time**: ~30 minutes

---

## 🚀 Option 1: Railway + Vercel (RECOMMENDED)

### Step 1: Deploy API to Railway

1. **Create Railway Account**
   ```bash
   # Visit https://railway.app and sign up with GitHub
   ```

2. **Deploy from GitHub**
   - Click "Deploy from GitHub repo"
   - Select your `ROI-app` repository
   - Railway will auto-detect the Node.js project

3. **Configure Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=catalyst-roi-production-secret-2025
   ```

4. **Railway will automatically:**
   - Install dependencies (`npm install`)
   - Start the server (`node api/server.js`)
   - Generate a public URL (e.g., `https://roi-app-production.up.railway.app`)

### Step 2: Update Frontend Configuration

1. **Update API URL in `src/config.js`**
   ```javascript
   API_BASE_URL: process.env.NODE_ENV === 'production' 
     ? 'https://YOUR-RAILWAY-URL.up.railway.app'  // Replace with actual Railway URL
     : 'http://localhost:3001',
   ```

2. **Commit Changes**
   ```bash
   git add src/config.js
   git commit -m "🚀 UPDATE: Production API URL for Railway deployment"
   git push origin main
   ```

### Step 3: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Visit https://vercel.com and sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your `ROI-app` repository
   - Vercel auto-detects React/Vite configuration

3. **Configure Build Settings**
   ```bash
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Deploy**
   - Click "Deploy"
   - Get your production URL (e.g., `https://roi-app.vercel.app`)

### Step 4: Update CORS in API

1. **Update Railway Environment Variables**
   ```bash
   FRONTEND_URL=https://roi-app.vercel.app
   ```

2. **Or update CORS in `api/server.js`**
   ```javascript
   app.use(cors({
     origin: ['http://localhost:5173', 'http://localhost:3000', 'https://roi-app.vercel.app'],
     credentials: true
   }));
   ```

---

## 🚀 Option 2: Heroku Deployment

### Step 1: Prepare for Heroku

1. **Install Heroku CLI**
   ```bash
   # MacOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   
   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

### Step 2: Create Heroku App

1. **Create App**
   ```bash
   heroku create catalyst-roi-calculator
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=catalyst-roi-production-secret-2025
   heroku config:set NPM_CONFIG_PRODUCTION=false
   ```

### Step 3: Configure for Heroku

1. **Update `package.json` scripts**
   ```json
   {
     "scripts": {
       "start": "node api/server.js",
       "build": "npm install && npm run build:frontend",
       "build:frontend": "vite build",
       "heroku-postbuild": "npm run build:frontend"
     }
   }
   ```

2. **Update API to serve static files** (add to `api/server.js`)
   ```javascript
   import path from 'path';
   import { fileURLToPath } from 'url';
   
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);
   
   // Serve static files from React build
   app.use(express.static(path.join(__dirname, '../dist')));
   
   // Handle React routing, return all requests to React app
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../dist', 'index.html'));
   });
   ```

### Step 4: Deploy to Heroku

```bash
git add .
git commit -m "🚀 DEPLOY: Configure for Heroku deployment"
git push heroku main
```

---

## 🚀 Option 3: Self-Hosted Deployment

### Step 1: Server Setup

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Install PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   ```

### Step 2: Clone and Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/bullsbears682/ROI-app.git
   cd ROI-app
   npm install
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

### Step 3: Start with PM2

1. **Create PM2 Configuration**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'catalyst-roi-api',
       script: 'api/server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'development'
       },
       env_production: {
         NODE_ENV: 'production',
         PORT: 3001
       }
     }]
   };
   ```

2. **Start Application**
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

### Step 4: Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # API routes
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend static files
    location / {
        root /path/to/ROI-app/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔧 Post-Deployment Configuration

### 1. Test API Endpoints

```bash
# Health check
curl https://your-api-url.com/api/health

# Test calculation
curl -X POST https://your-api-url.com/api/calculate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: demo-key-2025" \
  -d '{
    "investment": 50000,
    "scenario": "automation-crm",
    "industry": "technology",
    "companySize": "medium",
    "timeframe": 12
  }'
```

### 2. Test Frontend

- Visit your frontend URL
- Verify API status indicator shows "🟢 API Connected"
- Test a calculation to ensure frontend-backend communication

### 3. Configure Custom Domain (Optional)

**For Railway:**
- Go to Railway dashboard → Settings → Domains
- Add your custom domain

**For Vercel:**
- Go to Vercel dashboard → Domains
- Add your custom domain

**For Heroku:**
```bash
heroku domains:add your-domain.com
```

---

## 🔐 Security Checklist

### Production Environment Variables

```bash
# Required for all deployments
NODE_ENV=production
JWT_SECRET=your-strong-jwt-secret-here
PORT=3001

# Optional
API_RATE_LIMIT=1000
DATABASE_PATH=./data/catalyst.db
CORS_ORIGINS=https://your-frontend-domain.com
```

### Security Headers

The API already includes:
- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection protection

---

## 📊 Monitoring & Analytics

### Health Monitoring

```bash
# Set up health check monitoring
curl -f https://your-api-url.com/api/health || exit 1
```

### API Usage Analytics

```bash
# Get analytics (admin key required)
curl -H "X-API-Key: catalyst-admin-2025" \
     https://your-api-url.com/api/analytics
```

### Database Backups

```bash
# Schedule daily backups
0 2 * * * cp /path/to/catalyst.db /backups/catalyst-$(date +\%Y\%m\%d).db
```

---

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `FRONTEND_URL` environment variable
   - Verify CORS origins in `api/server.js`

2. **Database Connection Issues**
   - Check write permissions for SQLite file
   - Ensure `./api/` directory exists

3. **API Key Authentication Fails**
   - Verify API key format
   - Check case sensitivity
   - Ensure API key is passed in header: `X-API-Key`

4. **Build Failures**
   - Check Node.js version (requires 18+)
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and reinstall

### Debug Commands

```bash
# Check API logs
heroku logs --tail                    # Heroku
railway logs                          # Railway
pm2 logs catalyst-roi-api            # Self-hosted

# Test local API
npm run server
curl http://localhost:3001/api/health

# Test local frontend
npm run dev
```

---

## 🎯 Success Metrics

After deployment, verify:

- ✅ Frontend loads and displays correctly
- ✅ API health check returns `{"status":"healthy"}`
- ✅ Calculator performs calculations (test with demo data)
- ✅ API status indicator shows "🟢 API Connected"
- ✅ All navigation pages work (Calculator, Scenarios, About, API)
- ✅ Mobile responsiveness works
- ✅ HTTPS is enabled (automatic on Railway/Vercel/Heroku)

---

## 🚀 Next Steps

1. **Custom Domain**: Set up your branded domain
2. **Analytics**: Add Google Analytics or similar
3. **Monitoring**: Set up uptime monitoring (Pingdom, UptimeRobot)
4. **CDN**: Configure CloudFlare for better performance
5. **SSL Certificate**: Ensure HTTPS is properly configured
6. **Backup Strategy**: Implement database backup automation

---

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Test API endpoints individually
4. Check platform-specific logs

**The platform is now ready for production use and sales! 🎉**