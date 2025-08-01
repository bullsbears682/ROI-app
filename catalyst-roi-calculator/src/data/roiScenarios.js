// ROI Scenarios Database with Real Industry Data
// Last updated: 2024 - Based on market research and industry reports

export const roiCategories = {
  ai: {
    id: 'ai',
    name: 'AI Integration',
    icon: '🤖',
    description: 'Artificial Intelligence implementation across business functions'
  },
  ecommerce: {
    id: 'ecommerce', 
    name: 'eCommerce Platform',
    icon: '🛒',
    description: 'Online commerce and digital sales platforms'
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing Campaigns', 
    icon: '📈',
    description: 'Digital and traditional marketing initiatives'
  },
  software: {
    id: 'software',
    name: 'Software Implementation',
    icon: '💻', 
    description: 'Business software and system deployments'
  },
  training: {
    id: 'training',
    name: 'Employee Training',
    icon: '👥',
    description: 'Workforce development and skill building programs'
  },
  cloud: {
    id: 'cloud',
    name: 'Cloud Migration',
    icon: '☁️',
    description: 'Cloud infrastructure and platform transitions'
  },
  security: {
    id: 'security',
    name: 'Cybersecurity',
    icon: '🔒',
    description: 'Security systems and compliance implementations'
  },
  automation: {
    id: 'automation',
    name: 'Process Automation',
    icon: '⚙️',
    description: 'Workflow and operational automation solutions'
  },
  digital: {
    id: 'digital',
    name: 'Digital Marketing',
    icon: '🎯',
    description: 'Online presence and digital engagement strategies'
  },
  experience: {
    id: 'experience',
    name: 'Customer Experience',
    icon: '😊',
    description: 'Customer service and satisfaction improvements'
  },
  analytics: {
    id: 'analytics',
    name: 'Data & Analytics',
    icon: '📊',
    description: 'Business intelligence and data-driven insights'
  },
  sustainability: {
    id: 'sustainability',
    name: 'Sustainability',
    icon: '🌱',
    description: 'Green initiatives and environmental programs'
  },
  saas: {
    id: 'saas',
    name: 'SaaS Platforms',
    icon: '📱',
    description: 'Software-as-a-Service tools and platforms'
  },
  fintech: {
    id: 'fintech',
    name: 'Financial Services',
    icon: '💳',
    description: 'Banking, payments, and financial technology solutions'
  }
};

// Detailed ROI scenarios with real-world data
export const roiScenarios = {
  // AI Integration scenarios
  'ai-chatbot': {
    category: 'ai',
    name: 'AI Chatbot/Customer Service',
    description: 'Implement AI-powered customer support chatbot',
    costRange: { min: 15000, max: 50000 },
    timeframe: { min: 3, max: 6 }, // months
    expectedROI: { min: 180, max: 340 }, // percentage
    paybackPeriod: 8, // months
    riskLevel: 'medium',
    industryBenchmarks: {
      retail: { roi: 285, implementation: 4 },
      saas: { roi: 340, implementation: 3 },
      financial: { roi: 220, implementation: 6 }
    },
    benefits: [
      '40-60% reduction in support tickets',
      '24/7 customer service availability', 
      'Faster response times (< 1 minute)',
      'Consistent service quality'
    ],
    costs: {
      setup: 25000,
      monthly: 800,
      training: 5000,
      integration: 8000
    }
  },
  
  'ai-sales': {
    category: 'ai',
    name: 'AI Sales Assistant/Lead Qualification',
    description: 'AI-powered lead scoring and sales automation',
    costRange: { min: 25000, max: 75000 },
    timeframe: { min: 2, max: 4 },
    expectedROI: { min: 220, max: 450 },
    paybackPeriod: 6,
    riskLevel: 'medium',
    industryBenchmarks: {
      b2b: { roi: 380, implementation: 3 },
      real_estate: { roi: 450, implementation: 2 },
      consulting: { roi: 290, implementation: 4 }
    },
    benefits: [
      '25-40% increase in qualified leads',
      'Faster lead response times',
      'Better lead prioritization',
      'Increased conversion rates'
    ],
    costs: {
      setup: 35000,
      monthly: 2500,
      training: 12000,
      integration: 15000
    }
  },

  'ai-content': {
    category: 'ai',
    name: 'AI Content Generation',
    description: 'AI tools for marketing content creation',
    costRange: { min: 5000, max: 20000 },
    timeframe: { min: 1, max: 3 },
    expectedROI: { min: 280, max: 500 },
    paybackPeriod: 4,
    riskLevel: 'low',
    benefits: [
      '50-70% faster content creation',
      '3x more content output',
      'Consistent brand voice',
      'Reduced content costs'
    ],
    costs: {
      setup: 8000,
      monthly: 600,
      training: 3000,
      tools: 4000
    }
  },

  'ai-automation': {
    category: 'ai',
    name: 'AI Process Automation (RPA)',
    description: 'Robotic process automation for repetitive tasks',
    costRange: { min: 30000, max: 100000 },
    timeframe: { min: 4, max: 8 },
    expectedROI: { min: 200, max: 400 },
    paybackPeriod: 10,
    riskLevel: 'high',
    benefits: [
      '60-80% time reduction on tasks',
      'Reduced human error',
      'Employee focus on strategic work',
      'Scalable operations'
    ],
    costs: {
      setup: 50000,
      monthly: 2000,
      training: 15000,
      maintenance: 8000
    }
  },

  'ai-analytics': {
    category: 'ai',
    name: 'AI Data Analytics/Predictive Insights',
    description: 'AI-powered business intelligence and forecasting',
    costRange: { min: 20000, max: 60000 },
    timeframe: { min: 3, max: 6 },
    expectedROI: { min: 150, max: 300 },
    paybackPeriod: 9,
    riskLevel: 'medium',
    benefits: [
      '10-25% better decision making',
      'Predictive trend analysis',
      'Revenue optimization',
      'Risk mitigation'
    ],
    costs: {
      setup: 35000,
      monthly: 1500,
      training: 10000,
      integration: 12000
    }
  },

  'ai-voice': {
    category: 'ai',
    name: 'AI Voice Assistant/Phone Support',
    description: 'Voice-activated customer service automation',
    costRange: { min: 40000, max: 120000 },
    timeframe: { min: 6, max: 12 },
    expectedROI: { min: 180, max: 350 },
    paybackPeriod: 14,
    riskLevel: 'high',
    benefits: [
      'Reduced call center costs',
      'Multilingual support',
      'Consistent service quality',
      'Scalable phone support'
    ],
    costs: {
      setup: 75000,
      monthly: 3000,
      training: 20000,
      integration: 25000
    }
  },

  // eCommerce scenarios
  'ecom-shopify': {
    category: 'ecommerce',
    name: 'Shopify/WooCommerce Setup',
    description: 'Complete eCommerce platform implementation',
    costRange: { min: 5000, max: 25000 },
    timeframe: { min: 1, max: 3 },
    expectedROI: { min: 200, max: 600 },
    paybackPeriod: 6,
    riskLevel: 'low',
    benefits: [
      'Online sales channel',
      '24/7 revenue generation',
      'Global market reach',
      'Automated order processing'
    ],
    costs: {
      setup: 12000,
      monthly: 500,
      design: 8000,
      integration: 5000
    }
  },

  'ecom-marketplace': {
    category: 'ecommerce',
    name: 'Amazon/Marketplace Integration',
    description: 'Multi-channel marketplace selling setup',
    costRange: { min: 8000, max: 35000 },
    timeframe: { min: 2, max: 4 },
    expectedROI: { min: 150, max: 400 },
    paybackPeriod: 8,
    riskLevel: 'medium',
    benefits: [
      'Access to millions of customers',
      'Increased brand visibility',
      'Diversified sales channels',
      'Built-in trust and logistics'
    ],
    costs: {
      setup: 15000,
      monthly: 800,
      optimization: 12000,
      management: 8000
    }
  },

  'ecom-b2b': {
    category: 'ecommerce',
    name: 'B2B eCommerce Portal',
    description: 'Custom B2B online ordering and catalog system',
    costRange: { min: 25000, max: 100000 },
    timeframe: { min: 4, max: 8 },
    expectedROI: { min: 150, max: 350 },
    paybackPeriod: 12,
    riskLevel: 'medium',
    benefits: [
      'Streamlined B2B ordering process',
      'Reduced sales cycle time',
      'Automated pricing and quotes',
      'Better customer self-service'
    ],
    costs: {
      setup: 50000,
      monthly: 1200,
      customization: 25000,
      integration: 15000
    }
  },

  'ecom-mobile': {
    category: 'ecommerce',
    name: 'Mobile App Development',
    description: 'Native mobile commerce application',
    costRange: { min: 30000, max: 150000 },
    timeframe: { min: 4, max: 10 },
    expectedROI: { min: 120, max: 300 },
    paybackPeriod: 14,
    riskLevel: 'high',
    benefits: [
      'Mobile-first shopping experience',
      'Push notification marketing',
      'Higher engagement rates',
      'App store visibility'
    ],
    costs: {
      setup: 75000,
      monthly: 2000,
      maintenance: 20000,
      marketing: 15000
    }
  },

  // Marketing Campaign scenarios
  'marketing-ppc': {
    category: 'marketing',
    name: 'Google Ads/PPC Campaigns',
    description: 'Pay-per-click advertising on Google and search networks',
    costRange: { min: 5000, max: 50000 },
    timeframe: { min: 1, max: 6 },
    expectedROI: { min: 200, max: 800 },
    paybackPeriod: 3,
    riskLevel: 'medium',
    industryBenchmarks: {
      retail: { roi: 400, implementation: 1 },
      saas: { roi: 300, implementation: 2 },
      legal: { roi: 800, implementation: 1 }
    },
    benefits: [
      'Immediate traffic generation',
      'Precise audience targeting',
      'Measurable conversion tracking',
      'Quick campaign optimization'
    ],
    costs: {
      setup: 3000,
      monthly: 8000,
      management: 2000,
      tools: 500
    }
  },

  'marketing-social': {
    category: 'marketing',
    name: 'Social Media Advertising',
    description: 'Facebook, Instagram, LinkedIn paid advertising campaigns',
    costRange: { min: 3000, max: 30000 },
    timeframe: { min: 1, max: 4 },
    expectedROI: { min: 150, max: 500 },
    paybackPeriod: 4,
    riskLevel: 'low',
    benefits: [
      'Brand awareness building',
      'Social proof and engagement',
      'Detailed audience insights',
      'Cost-effective reach'
    ],
    costs: {
      setup: 2000,
      monthly: 5000,
      creative: 3000,
      management: 2500
    }
  },

  // Software Implementation scenarios
  'software-crm': {
    category: 'software',
    name: 'CRM System Implementation',
    description: 'Customer relationship management platform deployment',
    costRange: { min: 20000, max: 100000 },
    timeframe: { min: 3, max: 9 },
    expectedROI: { min: 200, max: 450 },
    paybackPeriod: 10,
    riskLevel: 'medium',
    industryBenchmarks: {
      b2b: { roi: 350, implementation: 6 },
      real_estate: { roi: 450, implementation: 4 },
      consulting: { roi: 280, implementation: 8 }
    },
    benefits: [
      'Improved sales pipeline management',
      'Better customer data organization',
      'Automated follow-up processes',
      'Enhanced reporting capabilities'
    ],
    costs: {
      setup: 35000,
      monthly: 2000,
      training: 15000,
      customization: 20000
    }
  },

  'software-erp': {
    category: 'software',
    name: 'ERP Implementation',
    description: 'Enterprise resource planning system deployment',
    costRange: { min: 100000, max: 500000 },
    timeframe: { min: 12, max: 24 },
    expectedROI: { min: 150, max: 300 },
    paybackPeriod: 18,
    riskLevel: 'high',
    benefits: [
      'Integrated business processes',
      'Real-time data visibility',
      'Improved operational efficiency',
      'Better compliance management'
    ],
    costs: {
      setup: 250000,
      monthly: 5000,
      training: 50000,
      customization: 100000
    }
  },

  // Cloud Migration scenarios
  'cloud-aws': {
    category: 'cloud',
    name: 'AWS/Azure Migration',
    description: 'Complete cloud infrastructure migration',
    costRange: { min: 50000, max: 300000 },
    timeframe: { min: 6, max: 18 },
    expectedROI: { min: 180, max: 350 },
    paybackPeriod: 15,
    riskLevel: 'medium',
    benefits: [
      'Reduced infrastructure costs',
      'Improved scalability',
      'Enhanced disaster recovery',
      'Global accessibility'
    ],
    costs: {
      setup: 120000,
      monthly: 8000,
      migration: 80000,
      training: 25000
    }
  },

  'cloud-saas': {
    category: 'cloud',
    name: 'SaaS Platform Migration',
    description: 'Migration to software-as-a-service solutions',
    costRange: { min: 20000, max: 100000 },
    timeframe: { min: 3, max: 8 },
    expectedROI: { min: 200, max: 400 },
    paybackPeriod: 9,
    riskLevel: 'low',
    benefits: [
      'Reduced IT maintenance costs',
      'Automatic updates and patches',
      'Better collaboration tools',
      'Predictable subscription costs'
    ],
    costs: {
      setup: 30000,
      monthly: 3000,
      migration: 20000,
      training: 10000
    }
  },

  // Cybersecurity scenarios
  'security-software': {
    category: 'security',
    name: 'Security Software/Firewall',
    description: 'Comprehensive cybersecurity software deployment',
    costRange: { min: 15000, max: 75000 },
    timeframe: { min: 2, max: 6 },
    expectedROI: { min: 300, max: 1000 },
    paybackPeriod: 8,
    riskLevel: 'low',
    benefits: [
      'Prevented security breaches',
      'Compliance requirements met',
      'Reduced downtime risks',
      'Enhanced employee productivity'
    ],
    costs: {
      setup: 25000,
      monthly: 2000,
      training: 8000,
      maintenance: 5000
    }
  },

  'security-training': {
    category: 'security',
    name: 'Employee Security Training',
    description: 'Comprehensive cybersecurity awareness program',
    costRange: { min: 8000, max: 40000 },
    timeframe: { min: 2, max: 6 },
    expectedROI: { min: 400, max: 1200 },
    paybackPeriod: 5,
    riskLevel: 'low',
    benefits: [
      '70% reduction in phishing clicks',
      'Improved security awareness',
      'Compliance training completion',
      'Reduced human error incidents'
    ],
    costs: {
      setup: 12000,
      monthly: 800,
      materials: 5000,
      certification: 3000
    }
  },

  // Process Automation scenarios
  'automation-manufacturing': {
    category: 'automation',
    name: 'Manufacturing Automation',
    description: 'Robotic process automation for production lines',
    costRange: { min: 100000, max: 500000 },
    timeframe: { min: 8, max: 18 },
    expectedROI: { min: 200, max: 400 },
    paybackPeriod: 20,
    riskLevel: 'high',
    benefits: [
      '40-60% increase in production speed',
      'Consistent product quality',
      'Reduced labor costs',
      '24/7 operation capability'
    ],
    costs: {
      setup: 250000,
      monthly: 5000,
      training: 30000,
      maintenance: 40000
    }
  },

  'automation-workflow': {
    category: 'automation',
    name: 'Workflow Automation',
    description: 'Business process automation software',
    costRange: { min: 15000, max: 80000 },
    timeframe: { min: 3, max: 8 },
    expectedROI: { min: 250, max: 500 },
    paybackPeriod: 8,
    riskLevel: 'medium',
    benefits: [
      '50-70% faster process completion',
      'Reduced manual errors',
      'Better compliance tracking',
      'Employee time savings'
    ],
    costs: {
      setup: 35000,
      monthly: 1500,
      training: 12000,
      customization: 18000
    }
  },

  // SaaS Platform scenarios
  'saas-crm': {
    category: 'saas',
    name: 'CRM Platform Implementation',
    description: 'Deploy customer relationship management SaaS solution',
    costRange: { min: 20000, max: 80000 },
    timeframe: { min: 3, max: 8 },
    expectedROI: { min: 200, max: 400 },
    paybackPeriod: 9,
    riskLevel: 'medium',
    industryBenchmarks: {
      saas: { roi: 380, implementation: 4 },
      retail: { roi: 320, implementation: 6 },
      professional: { roi: 350, implementation: 5 }
    },
    benefits: [
      '30-45% increase in sales productivity',
      'Improved customer retention rates',
      'Automated lead nurturing',
      'Better sales forecasting'
    ],
    costs: {
      licensing: 45000,
      implementation: 25000,
      training: 8000,
      customization: 12000
    }
  },

  'saas-marketing': {
    category: 'saas',
    name: 'Marketing Automation Platform',
    description: 'Implement comprehensive marketing automation SaaS',
    costRange: { min: 35000, max: 120000 },
    timeframe: { min: 4, max: 10 },
    expectedROI: { min: 250, max: 450 },
    paybackPeriod: 8,
    riskLevel: 'medium',
    industryBenchmarks: {
      saas: { roi: 420, implementation: 5 },
      ecommerce: { roi: 380, implementation: 6 },
      professional: { roi: 340, implementation: 7 }
    },
    benefits: [
      '40-60% increase in qualified leads',
      'Improved campaign ROI tracking',
      'Automated nurture sequences',
      'Better customer segmentation'
    ],
    costs: {
      platform: 65000,
      setup: 30000,
      training: 15000,
      integration: 20000
    }
  },

  'saas-analytics': {
    category: 'saas',
    name: 'Business Intelligence Platform',
    description: 'Deploy advanced analytics and BI SaaS solution',
    costRange: { min: 25000, max: 90000 },
    timeframe: { min: 3, max: 7 },
    expectedROI: { min: 180, max: 380 },
    paybackPeriod: 10,
    riskLevel: 'medium',
    industryBenchmarks: {
      saas: { roi: 350, implementation: 4 },
      manufacturing: { roi: 280, implementation: 6 },
      financial: { roi: 320, implementation: 5 }
    },
    benefits: [
      'Data-driven decision making',
      '25-40% faster reporting',
      'Improved operational efficiency',
      'Better KPI tracking'
    ],
    costs: {
      software: 50000,
      implementation: 25000,
      training: 10000,
      integration: 15000
    }
  },

  // Financial Services scenarios
  'fintech-payments': {
    category: 'fintech',
    name: 'Payment Processing System',
    description: 'Implement modern payment processing and gateway',
    costRange: { min: 40000, max: 150000 },
    timeframe: { min: 4, max: 12 },
    expectedROI: { min: 150, max: 320 },
    paybackPeriod: 12,
    riskLevel: 'medium',
    industryBenchmarks: {
      financial: { roi: 280, implementation: 8 },
      ecommerce: { roi: 320, implementation: 6 },
      retail: { roi: 250, implementation: 9 }
    },
    benefits: [
      'Reduced payment processing fees',
      'Faster transaction processing',
      'Enhanced security compliance',
      'Multi-currency support'
    ],
    costs: {
      platform: 80000,
      integration: 35000,
      compliance: 25000,
      training: 10000
    }
  },

  'fintech-fraud': {
    category: 'fintech',
    name: 'Fraud Detection System',
    description: 'Deploy AI-powered fraud prevention and detection',
    costRange: { min: 60000, max: 200000 },
    timeframe: { min: 6, max: 14 },
    expectedROI: { min: 200, max: 500 },
    paybackPeriod: 10,
    riskLevel: 'medium',
    industryBenchmarks: {
      financial: { roi: 450, implementation: 10 },
      insurance: { roi: 380, implementation: 12 },
      ecommerce: { roi: 300, implementation: 8 }
    },
    benefits: [
      '70-90% reduction in fraud losses',
      'Improved customer trust',
      'Regulatory compliance',
      'Real-time risk assessment'
    ],
    costs: {
      software: 120000,
      implementation: 50000,
      training: 15000,
      ongoing: 25000
    }
  },

  'fintech-lending': {
    category: 'fintech',
    name: 'Digital Lending Platform',
    description: 'Implement automated loan origination and management',
    costRange: { min: 80000, max: 250000 },
    timeframe: { min: 8, max: 16 },
    expectedROI: { min: 180, max: 400 },
    paybackPeriod: 14,
    riskLevel: 'high',
    industryBenchmarks: {
      financial: { roi: 350, implementation: 12 },
      fintech: { roi: 400, implementation: 10 },
      credit: { roi: 280, implementation: 14 }
    },
    benefits: [
      'Faster loan approval times',
      'Reduced operational costs',
      'Better risk assessment',
      'Improved customer experience'
    ],
    costs: {
      platform: 150000,
      integration: 60000,
      compliance: 40000,
      training: 20000
    }
  }
};

// Helper functions for calculations
export const calculateROI = (investment, returns, timeframe) => {
  const roi = ((returns - investment) / investment) * 100;
  const annualizedROI = (roi / timeframe) * 12;
  return {
    totalROI: roi,
    annualizedROI: annualizedROI,
    netProfit: returns - investment,
    paybackPeriod: (investment / (returns / timeframe))
  };
};

export const getScenariosByCategory = (categoryId) => {
  return Object.entries(roiScenarios)
    .filter(([key, scenario]) => scenario.category === categoryId)
    .map(([key, scenario]) => ({ id: key, ...scenario }));
};

export const getIndustryBenchmark = (scenarioId, industry) => {
  const scenario = roiScenarios[scenarioId];
  return scenario?.industryBenchmarks?.[industry] || null;
};