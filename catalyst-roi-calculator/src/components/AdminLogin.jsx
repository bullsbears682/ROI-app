import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Admin password (in production, this would be handled server-side)
  const ADMIN_PASSWORD = 'CatalystROI2025';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (password === ADMIN_PASSWORD) {
      // Store admin session
      sessionStorage.setItem('catalyst-admin-auth', 'true');
      onLogin();
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="admin-logo">
            <svg width="48" height="48" viewBox="0 0 32 32">
              <defs>
                <linearGradient id="admin-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#667eea'}} />
                  <stop offset="100%" style={{stopColor:'#764ba2'}} />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="15" fill="url(#admin-logo-grad)" />
              <path d="M8 20 L16 8 L24 20 M16 8 L16 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="12" cy="16" r="1.5" fill="white" opacity="0.8"/>
              <circle cx="20" cy="16" r="1.5" fill="white" opacity="0.8"/>
              <circle cx="16" cy="12" r="1" fill="white" opacity="0.6"/>
            </svg>
          </div>
          <h1>🔐 Admin Access</h1>
          <p>Enter admin password to access dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="form-label">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input ${error ? 'error' : ''}`}
              placeholder="Enter admin password"
              required
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary admin-login-btn"
            disabled={isLoading || !password}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner small"></span>
                Authenticating...
              </>
            ) : (
              <>
                🔓 Access Dashboard
              </>
            )}
          </button>
        </form>

                 <div className="admin-login-footer">
                        <p>
               <strong>For Demo/Testing:</strong><br/>
               Password: <code>CatalystROI2025</code>
             </p>
          <div className="security-note">
            <small>🔒 In production, this would use secure server-side authentication</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;