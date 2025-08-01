import React from 'react';

const Header = ({ currentPage = 'calculator', onNavigate }) => {
  const handleNavClick = (page, e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => handleNavClick('calculator')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            {/* Inline SVG version of our logo for better performance */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#667eea'}} />
                  <stop offset="100%" style={{stopColor:'#764ba2'}} />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="15" fill="url(#logo-grad)" />
              <path d="M8 20 L16 8 L24 20 M16 8 L16 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="12" cy="16" r="1.5" fill="white" opacity="0.8"/>
              <circle cx="20" cy="16" r="1.5" fill="white" opacity="0.8"/>
              <circle cx="16" cy="12" r="1" fill="white" opacity="0.6"/>
            </svg>
          </div>
          <div className="logo-text">
            <h1>Catalyst</h1>
            <span className="logo-tagline">ROI ANALYTICS</span>
          </div>
        </div>

        <nav className="header-nav">
          <div className="nav-links">
            <button 
              onClick={(e) => handleNavClick('calculator', e)} 
              className={`nav-link ${currentPage === 'calculator' ? 'active' : ''}`}
            >
              Calculator
            </button>
            <button 
              onClick={(e) => handleNavClick('scenarios', e)} 
              className={`nav-link ${currentPage === 'scenarios' ? 'active' : ''}`}
            >
              Scenarios
            </button>
            <button 
              onClick={(e) => handleNavClick('about', e)} 
              className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
            >
              About
            </button>
          </div>
          <button className="btn btn-primary header-cta">
            Get Started
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;