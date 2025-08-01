#!/bin/bash

echo "🚀 Catalyst ROI Calculator - Quick Deploy Script"
echo "================================================="

# Function to deploy to Railway
deploy_railway() {
    echo "📡 Deploying API to Railway..."
    echo "1. Go to https://railway.app"
    echo "2. Connect your GitHub account"
    echo "3. Click 'Deploy from GitHub repo'"
    echo "4. Select 'bullsbears682/ROI-app'"
    echo "5. Railway will auto-detect and deploy!"
    echo ""
    echo "🔧 Set these environment variables in Railway:"
    echo "   NODE_ENV=production"
    echo "   PORT=3001"
    echo "   JWT_SECRET=catalyst-roi-production-secret-2025"
    echo ""
    echo "📋 Your API will be available at: https://[your-app].up.railway.app"
    echo ""
}

# Function to deploy to Vercel
deploy_vercel() {
    echo "🌐 Deploying Frontend to Vercel..."
    
    if command -v vercel &> /dev/null; then
        echo "✅ Vercel CLI found. Deploying..."
        vercel --prod
    else
        echo "📱 Manual Vercel deployment:"
        echo "1. Go to https://vercel.com"
        echo "2. Connect your GitHub account"
        echo "3. Import 'bullsbears682/ROI-app'"
        echo "4. Vercel will auto-deploy!"
        echo ""
        echo "⚙️ Build settings (auto-detected):"
        echo "   Framework: Vite"
        echo "   Build Command: npm run build"
        echo "   Output Directory: dist"
    fi
    echo ""
}

# Function to deploy to Heroku
deploy_heroku() {
    echo "🌊 Deploying to Heroku..."
    
    if command -v heroku &> /dev/null; then
        echo "✅ Heroku CLI found. Creating app..."
        
        # Create unique app name
        APP_NAME="catalyst-roi-$(date +%s | tail -c 5)"
        
        heroku create $APP_NAME
        heroku config:set NODE_ENV=production
        heroku config:set JWT_SECRET=catalyst-roi-production-secret-2025
        
        echo "🚀 Deploying to Heroku..."
        git push heroku main
        
        echo "✅ Deployment complete!"
        echo "🌐 Your app: https://$APP_NAME.herokuapp.com"
    else
        echo "📱 Manual Heroku deployment:"
        echo "1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli"
        echo "2. Run: heroku login"
        echo "3. Run: heroku create your-app-name"
        echo "4. Run: heroku config:set NODE_ENV=production"
        echo "5. Run: git push heroku main"
    fi
    echo ""
}

# Main menu
echo "Choose your deployment option:"
echo "1. Railway (API) + Vercel (Frontend) - RECOMMENDED"
echo "2. Heroku (Full-stack)"
echo "3. Show manual deployment instructions"
echo "4. Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🎯 RECOMMENDED: Railway + Vercel Deployment"
        echo "==========================================="
        deploy_railway
        deploy_vercel
        echo "🎉 Both services deployed!"
        echo "💡 Remember to update src/config.js with your Railway API URL"
        ;;
    2)
        echo ""
        echo "🌊 Heroku Full-Stack Deployment"
        echo "==============================="
        deploy_heroku
        ;;
    3)
        echo ""
        echo "📖 Manual Deployment Instructions"
        echo "================================="
        echo "📄 See DEPLOYMENT.md for complete instructions"
        echo "🔗 Quick links:"
        echo "   Railway: https://railway.app"
        echo "   Vercel: https://vercel.com"
        echo "   Heroku: https://heroku.com"
        ;;
    4)
        echo "👋 Goodbye! Deploy when you're ready."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎯 Next Steps:"
echo "1. Test your deployed API: curl https://your-api-url.com/api/health"
echo "2. Verify frontend shows '🟢 API Connected'"
echo "3. Test a calculation to ensure everything works"
echo "4. Set up a custom domain (optional)"
echo ""
echo "🎉 Your Catalyst ROI Calculator is ready for business!"