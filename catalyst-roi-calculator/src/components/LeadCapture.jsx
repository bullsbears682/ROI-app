import React, { useState } from 'react';

const LeadCapture = ({ isOpen, onClose, onSubmit, calculationData }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    phoneNumber: '',
    companySize: 'medium',
    industry: 'general',
    interestedIn: 'roi-analysis'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call - in real implementation, this would go to HubSpot CRM
      const leadData = {
        ...formData,
        source: 'Catalyst ROI Calculator',
        roiCalculation: calculationData,
        timestamp: new Date().toISOString(),
        leadScore: calculateLeadScore(formData, calculationData)
      };

      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store lead locally (in real app, this would go to CRM)
      const existingLeads = JSON.parse(localStorage.getItem('catalyst-leads') || '[]');
      existingLeads.push(leadData);
      localStorage.setItem('catalyst-leads', JSON.stringify(existingLeads));

      setShowThankYou(true);
      
      // Call parent's onSubmit
      if (onSubmit) {
        onSubmit(leadData);
      }

      // Auto-close after showing thank you message
      setTimeout(() => {
        setShowThankYou(false);
        onClose();
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          jobTitle: '',
          phoneNumber: '',
          companySize: 'medium',
          industry: 'general',
          interestedIn: 'roi-analysis'
        });
      }, 3000);

    } catch (error) {
      console.error('Lead submission error:', error);
      alert('There was an error submitting your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateLeadScore = (formData, calculationData) => {
    let score = 0;
    
    // Company size scoring
    const sizeScores = { startup: 20, small: 40, medium: 60, large: 80, enterprise: 100 };
    score += sizeScores[formData.companySize] || 40;
    
    // Industry scoring
    const industryScores = { saas: 90, financial: 80, healthcare: 70, retail: 60, manufacturing: 50 };
    score += industryScores[formData.industry] || 40;
    
    // ROI calculation engagement
    if (calculationData?.roiPercentage > 200) score += 30;
    if (calculationData?.investment > 50000) score += 20;
    
    // Job title scoring
    const titleKeywords = ['ceo', 'cto', 'vp', 'director', 'manager', 'head'];
    const hasTitle = titleKeywords.some(keyword => 
      formData.jobTitle.toLowerCase().includes(keyword)
    );
    if (hasTitle) score += 25;
    
    return Math.min(100, score);
  };

  if (!isOpen) return null;

  if (showThankYou) {
    return (
      <div className="modal-overlay">
        <div className="modal-content thank-you-modal">
          <div className="thank-you-content">
            <div className="thank-you-icon">🎉</div>
            <h2>Thank You!</h2>
            <p>Your ROI analysis has been saved and our team will be in touch soon.</p>
            <p>We'll send you additional insights based on your calculation.</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content lead-capture-modal">
        <div className="modal-header">
          <h2>Get Your Detailed ROI Report</h2>
          <p>Enter your details to receive a personalized analysis and additional insights</p>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="lead-capture-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                placeholder="John"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                placeholder="Smith"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Business Email *</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              placeholder="john.smith@company.com"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input
                type="text"
                className="form-input"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                required
                placeholder="Acme Corporation"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                placeholder="VP of Marketing"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company Size</label>
              <select
                className="form-select"
                value={formData.companySize}
                onChange={(e) => handleInputChange('companySize', e.target.value)}
              >
                <option value="startup">Startup (1-10 employees)</option>
                <option value="small">Small (11-50 employees)</option>
                <option value="medium">Medium (51-200 employees)</option>
                <option value="large">Large (201-1000 employees)</option>
                <option value="enterprise">Enterprise (1000+ employees)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">What are you most interested in?</label>
            <select
              className="form-select"
              value={formData.interestedIn}
              onChange={(e) => handleInputChange('interestedIn', e.target.value)}
            >
              <option value="roi-analysis">ROI Analysis & Benchmarking</option>
              <option value="implementation">Implementation Consulting</option>
              <option value="custom-scenarios">Custom Scenario Modeling</option>
              <option value="industry-insights">Industry-Specific Insights</option>
              <option value="demo">Product Demo & Trial</option>
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Skip for Now
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner small"></span>
                  Sending...
                </>
              ) : (
                'Get My Report'
              )}
            </button>
          </div>

          <div className="privacy-notice">
            <small>
              By submitting this form, you agree to receive communications from Catalyst. 
              We respect your privacy and will never share your information.
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadCapture;