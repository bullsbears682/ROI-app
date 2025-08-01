// Analytics and usage tracking utilities
// Provides insights for optimization while respecting user privacy

class AnalyticsManager {
  constructor() {
    this.isEnabled = false;
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.events = [];
  }

  // Initialize analytics (only if user consented)
  init(cookieConsent) {
    this.isEnabled = cookieConsent?.analytics || false;
    
    if (this.isEnabled) {
      this.trackEvent('session_start', {
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenResolution: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`
      });
      
      // Track page visibility changes
      document.addEventListener('visibilitychange', () => {
        this.trackEvent('visibility_change', {
          hidden: document.hidden
        });
      });
      
      // Track errors
      window.addEventListener('error', (error) => {
        this.trackEvent('javascript_error', {
          message: error.message,
          filename: error.filename,
          line: error.lineno,
          column: error.colno
        });
      });
    }
  }

  // Generate unique session ID
  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Track events
  trackEvent(eventType, data = {}) {
    if (!this.isEnabled) return;

    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      data: data
    };

    this.events.push(event);
    this.saveToLocalStorage(event);
    
    // Also log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }
  }

  // Save events to localStorage
  saveToLocalStorage(event) {
    try {
      const existingEvents = JSON.parse(localStorage.getItem('catalyst-analytics') || '[]');
      existingEvents.push(event);
      
      // Keep only last 1000 events to prevent storage bloat
      if (existingEvents.length > 1000) {
        existingEvents.splice(0, existingEvents.length - 1000);
      }
      
      localStorage.setItem('catalyst-analytics', JSON.stringify(existingEvents));
    } catch (error) {
      console.warn('Failed to save analytics event:', error);
    }
  }

  // Track user interactions
  trackUserInteraction(action, element, data = {}) {
    this.trackEvent('user_interaction', {
      action,
      element,
      ...data
    });
  }

  // Track form submissions
  trackFormSubmission(formType, success, data = {}) {
    this.trackEvent('form_submission', {
      formType,
      success,
      ...data
    });
  }

  // Track page/component views
  trackPageView(page, data = {}) {
    this.trackEvent('page_view', {
      page,
      ...data
    });
  }

  // Track performance metrics
  trackPerformance(metric, value, data = {}) {
    this.trackEvent('performance', {
      metric,
      value,
      ...data
    });
  }

  // Track ROI calculations
  trackROICalculation(scenario, inputs, results) {
    this.trackEvent('roi_calculation', {
      scenario: scenario?.name || 'unknown',
      scenarioCategory: scenario?.category || 'unknown',
      investment: inputs?.investment || 0,
      timeframe: inputs?.timeframe || 0,
      industry: inputs?.industry || 'unknown',
      companySize: inputs?.companySize || 'unknown',
      currency: results?.currency || 'USD',
      roiPercentage: results?.roiPercentage || 0,
      successRate: results?.successRate?.probability || 0,
      paybackPeriod: results?.paybackPeriod || 0
    });
  }

  // Track user engagement
  trackEngagement() {
    const timeOnPage = Date.now() - this.startTime;
    const scrollDepth = this.getScrollDepth();
    
    this.trackEvent('engagement', {
      timeOnPage,
      scrollDepth,
      clickCount: this.getClickCount(),
      formInteractions: this.getFormInteractionCount()
    });
  }

  // Get scroll depth percentage
  getScrollDepth() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
  }

  // Get click count from events
  getClickCount() {
    return this.events.filter(e => e.type === 'user_interaction' && e.data.action === 'click').length;
  }

  // Get form interaction count
  getFormInteractionCount() {
    return this.events.filter(e => e.type === 'user_interaction' && e.data.element?.includes('form')).length;
  }

  // Get analytics summary for optimization
  getAnalyticsSummary() {
    if (!this.isEnabled) {
      return { message: 'Analytics disabled or not consented' };
    }

    const allEvents = JSON.parse(localStorage.getItem('catalyst-analytics') || '[]');
    
    return {
      totalEvents: allEvents.length,
      sessionEvents: this.events.length,
      roiCalculations: allEvents.filter(e => e.type === 'roi_calculation').length,
      leadCaptures: allEvents.filter(e => e.type === 'lead_capture').length,
      errors: allEvents.filter(e => e.type === 'javascript_error').length,
      popularScenarios: this.getPopularScenarios(allEvents),
      conversionMetrics: this.getConversionMetrics(allEvents),
      usagePatterns: this.getUsagePatterns(allEvents)
    };
  }

  // Get popular scenarios
  getPopularScenarios(events) {
    const roiEvents = events.filter(e => e.type === 'roi_calculation');
    const scenarioCounts = {};
    
    roiEvents.forEach(event => {
      const scenario = event.data.scenario;
      scenarioCounts[scenario] = (scenarioCounts[scenario] || 0) + 1;
    });
    
    return Object.entries(scenarioCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([scenario, count]) => ({ scenario, count }));
  }

  // Get conversion metrics
  getConversionMetrics(events) {
    const calculations = events.filter(e => e.type === 'roi_calculation').length;
    const leadCaptures = events.filter(e => e.type === 'lead_capture').length;
    const sessions = [...new Set(events.map(e => e.sessionId))].length;
    
    return {
      calculationRate: sessions > 0 ? (calculations / sessions * 100).toFixed(1) + '%' : '0%',
      conversionRate: calculations > 0 ? (leadCaptures / calculations * 100).toFixed(1) + '%' : '0%',
      totalSessions: sessions,
      totalCalculations: calculations,
      totalLeadCaptures: leadCaptures
    };
  }

  // Get usage patterns
  getUsagePatterns(events) {
    const hourCounts = {};
    const industryCounts = {};
    const currencyCounts = {};
    
    events.forEach(event => {
      if (event.type === 'roi_calculation') {
        // Hour of day analysis
        const hour = new Date(event.timestamp).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        
        // Industry analysis
        const industry = event.data.industry;
        industryCounts[industry] = (industryCounts[industry] || 0) + 1;
        
        // Currency analysis
        const currency = event.data.currency;
        currencyCounts[currency] = (currencyCounts[currency] || 0) + 1;
      }
    });
    
    return {
      peakHours: Object.entries(hourCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([hour, count]) => ({ hour: parseInt(hour), count })),
      popularIndustries: Object.entries(industryCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([industry, count]) => ({ industry, count })),
      currencyUsage: Object.entries(currencyCounts)
        .sort(([,a], [,b]) => b - a)
        .map(([currency, count]) => ({ currency, count }))
    };
  }

  // Clean up old events (call periodically)
  cleanupOldEvents(daysToKeep = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const allEvents = JSON.parse(localStorage.getItem('catalyst-analytics') || '[]');
      const recentEvents = allEvents.filter(event => 
        new Date(event.timestamp) > cutoffDate
      );
      
      localStorage.setItem('catalyst-analytics', JSON.stringify(recentEvents));
      
      this.trackEvent('analytics_cleanup', {
        removedEvents: allEvents.length - recentEvents.length,
        keptEvents: recentEvents.length
      });
    } catch (error) {
      console.warn('Failed to cleanup old events:', error);
    }
  }

  // Export analytics data (for analysis)
  exportAnalyticsData() {
    if (!this.isEnabled) {
      return null;
    }

    try {
      const allEvents = JSON.parse(localStorage.getItem('catalyst-analytics') || '[]');
      const summary = this.getAnalyticsSummary();
      
      return {
        summary,
        events: allEvents,
        exportDate: new Date().toISOString(),
        sessionId: this.sessionId
      };
    } catch (error) {
      console.error('Failed to export analytics data:', error);
      return null;
    }
  }
}

// Create singleton instance
export const analytics = new AnalyticsManager();

// Convenience functions
export const trackEvent = (type, data) => analytics.trackEvent(type, data);
export const trackUserInteraction = (action, element, data) => analytics.trackUserInteraction(action, element, data);
export const trackROICalculation = (scenario, inputs, results) => analytics.trackROICalculation(scenario, inputs, results);
export const initAnalytics = (cookieConsent) => analytics.init(cookieConsent);
export const getAnalyticsSummary = () => analytics.getAnalyticsSummary();

// Auto-track engagement every 30 seconds
setInterval(() => {
  analytics.trackEngagement();
}, 30000);

// Cleanup old events on page load
setTimeout(() => {
  analytics.cleanupOldEvents();
}, 5000);