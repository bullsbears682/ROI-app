#!/bin/bash

echo "🚀 Starting Catalyst ROI API Server..."
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "api/server.js" ]; then
    echo "❌ Please run this script from the catalyst-roi-calculator directory"
    echo "   Usage: ./start-api.sh"
    exit 1
fi

# Navigate to API directory
cd api

echo "📦 Installing API dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""
echo "🌟 API Server Features:"
echo "   📡 Real ROI calculations with business logic"
echo "   👥 Lead capture with intelligent scoring"
echo "   📊 Analytics tracking and reporting"
echo "   🔗 Webhook support for CRM integration"
echo "   🎨 White-label branding configuration"
echo "   🔐 Enterprise authentication & rate limiting"
echo ""
echo "🔑 Demo API Key: demo_key_hubspot_trial"
echo "📚 API Documentation: http://localhost:3001/api/health"
echo "🧪 Test endpoints from the frontend API tab"
echo ""
echo "Starting server on port 3001..."
echo "====================================="

# Start the server
npm start