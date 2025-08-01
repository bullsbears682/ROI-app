import React, { useState } from 'react';

const CookieConsent = ({ onConsent }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });

  // Handle accepting all cookies
  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString()
    };
    onConsent(allConsent);
  };

  // Handle accepting only necessary cookies
  const handleRejectAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString()
    };
    onConsent(minimalConsent);
  };

  // Handle custom preferences
  const handleSavePreferences = () => {
    const customConsent = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    onConsent(customConsent);
  };

  // Toggle preference
  const togglePreference = (key) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-banner">
        <div className="cookie-header">
          <h3>🍪 We use cookies</h3>
          <p>
            We use cookies to enhance your experience on Catalyst. This includes analytics 
            to help us improve our ROI calculator and remember your preferences.
          </p>
        </div>

        {!showDetails ? (
          <div className="cookie-actions">
            <div className="cookie-buttons">
              <button 
                className="btn btn-secondary"
                onClick={handleRejectAll}
              >
                Only Necessary
              </button>
              
              <button 
                className="btn btn-link"
                onClick={() => setShowDetails(true)}
              >
                Customize
              </button>
              
              <button 
                className="btn btn-primary"
                onClick={handleAcceptAll}
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="cookie-details">
            <h4>Cookie Preferences</h4>
            <p className="details-description">
              Choose which cookies you want to accept. You can change these settings at any time.
            </p>
            
            <div className="cookie-categories">
              {/* Necessary Cookies */}
              <div className="cookie-category">
                <div className="category-header">
                  <label className="cookie-toggle">
                    <input
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled={true}
                      readOnly
                    />
                    <span className="toggle-slider disabled"></span>
                    <span className="toggle-label">
                      <strong>Necessary</strong>
                      <span className="required-badge">Required</span>
                    </span>
                  </label>
                </div>
                <p className="category-description">
                  Essential for the website to function properly. These cannot be disabled.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="cookie-category">
                <div className="category-header">
                  <label className="cookie-toggle">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => togglePreference('analytics')}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">
                      <strong>Analytics</strong>
                    </span>
                  </label>
                </div>
                <p className="category-description">
                  Help us understand how you use our calculator to improve functionality and user experience.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="cookie-category">
                <div className="category-header">
                  <label className="cookie-toggle">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => togglePreference('marketing')}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">
                      <strong>Marketing</strong>
                    </span>
                  </label>
                </div>
                <p className="category-description">
                  Used to track visitors across websites for relevant advertising and marketing insights.
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="cookie-category">
                <div className="category-header">
                  <label className="cookie-toggle">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={() => togglePreference('functional')}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">
                      <strong>Functional</strong>
                    </span>
                  </label>
                </div>
                <p className="category-description">
                  Enable enhanced functionality like saving your calculation history and preferences.
                </p>
              </div>
            </div>

            <div className="cookie-actions">
              <div className="cookie-buttons">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(false)}
                >
                  Back
                </button>
                
                <button 
                  className="btn btn-primary"
                  onClick={handleSavePreferences}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="cookie-footer">
          <p>
            By continuing to use this site, you agree to our use of cookies as described in our{' '}
            <a href="#privacy" className="privacy-link">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;