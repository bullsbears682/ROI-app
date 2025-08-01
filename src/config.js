// API Configuration
const config = {
  // Production API URL (will be updated after deployment)
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://catalyst-roi-api.up.railway.app' 
    : 'http://localhost:3001',
  
  // Demo API key for public use
  API_KEY: 'demo-key-2025',
  
  // Admin API key (for analytics)
  ADMIN_API_KEY: 'catalyst-admin-2025',
  
  // Fallback timeout for API requests
  API_TIMEOUT: 5000,
  
  // Enable/disable API features
  FEATURES: {
    API_INTEGRATION: true,
    LOCAL_FALLBACK: true,
    ANALYTICS_TRACKING: true,
    LEAD_CAPTURE: true
  }
};

export default config;