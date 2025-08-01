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

  'ecom-inventory': {
    category: 'ecommerce',
    name: 'Inventory Management System',
    description: 'Advanced inventory tracking and warehouse management',
    costRange: { min: 15000, max: 75000 },
    timeframe: { min: 2, max: 6 },
    expectedROI: { min: 180, max: 400 },
    paybackPeriod: 8,
    riskLevel: 'medium',
    industryBenchmarks: {
      retail: { roi: 350, implementation: 4 },
      manufacturing: { roi: 280, implementation: 5 },
      wholesale: { roi: 400, implementation: 3 }
    },
    benefits: [
      '25-40% reduction in stock-outs',
      'Improved order fulfillment speed',
      'Better demand forecasting',
      'Reduced carrying costs'
    ],
    costs: {
      software: 35000,
      implementation: 20000,
      training: 8000,
      integration: 12000
    }
  },

  'ecom-personalization': {
    category: 'ecommerce',
    name: 'AI Personalization Engine',
    description: 'Machine learning-powered product recommendations',
    costRange: { min: 40000, max: 120000 },
    timeframe: { min: 3, max: 8 },
    expectedROI: { min: 200, max: 500 },
    paybackPeriod: 10,
    riskLevel: 'medium',
    industryBenchmarks: {
      ecommerce: { roi: 450, implementation: 5 },
      retail: { roi: 350, implementation: 6 },
      fashion: { roi: 500, implementation: 4 }
    },
    benefits: [
      '20-35% increase in conversion rates',
      'Higher average order value',
      'Improved customer retention',
      'Better cross-selling success'
    ],
    costs: {
      platform: 60000,
      integration: 25000,
      training: 15000,
      optimization: 20000
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

  'marketing-email': {
    category: 'marketing',
    name: 'Email Marketing Campaign',
    description: 'Automated email marketing and nurture sequences',
    costRange: { min: 2000, max: 25000 },
    timeframe: { min: 1, max: 6 },
    expectedROI: { min: 300, max: 800 },
    paybackPeriod: 3,
    riskLevel: 'low',
    industryBenchmarks: {
      ecommerce: { roi: 600, implementation: 2 },
      saas: { roi: 450, implementation: 3 },
      b2b: { roi: 380, implementation: 4 }
    },
    benefits: [
      'High ROI marketing channel',
      'Automated customer nurturing',
      'Segmented targeting',
      'Measurable engagement metrics'
    ],
    costs: {
      platform: 8000,
      setup: 5000,
      content: 7000,
      management: 5000
    }
  },

  'marketing-content': {
    category: 'marketing',
    name: 'Content Marketing Strategy',
    description: 'SEO-focused content creation and distribution',
    costRange: { min: 8000, max: 50000 },
    timeframe: { min: 3, max: 12 },
    expectedROI: { min: 200, max: 600 },
    paybackPeriod: 8,
    riskLevel: 'medium',
    industryBenchmarks: {
      saas: { roi: 500, implementation: 6 },
      professional: { roi: 400, implementation: 8 },
      ecommerce: { roi: 350, implementation: 9 }
    },
    benefits: [
      'Long-term organic traffic growth',
      'Thought leadership positioning',
      'Lower customer acquisition cost',
      'Better search engine rankings'
    ],
    costs: {
      strategy: 12000,
      content: 20000,
      tools: 8000,
      promotion: 10000
    }
  },

  'marketing-influencer': {
    category: 'marketing',
    name: 'Influencer Marketing Campaign',
    description: 'Partnership with industry influencers and creators',
    costRange: { min: 10000, max: 100000 },
    timeframe: { min: 2, max: 8 },
    expectedROI: { min: 150, max: 450 },
    paybackPeriod: 6,
    riskLevel: 'medium',
    industryBenchmarks: {
      fashion: { roi: 400, implementation: 3 },
      beauty: { roi: 450, implementation: 2 },
      lifestyle: { roi: 350, implementation: 4 }
    },
    benefits: [
      'Authentic brand endorsements',
      'Access to engaged audiences',
      'Increased brand credibility',
      'Viral content potential'
    ],
    costs: {
      influencer_fees: 50000,
      production: 20000,
      management: 15000,
      promotion: 15000
    }
  },

  'marketing-retargeting': {
    category: 'marketing',
    name: 'Retargeting & Conversion Optimization',
    description: 'Advanced retargeting campaigns and conversion rate optimization',
    costRange: { min: 5000, max: 40000 },
    timeframe: { min: 1, max: 6 },
    expectedROI: { min: 250, max: 700 },
    paybackPeriod: 4,
    riskLevel: 'low',
    industryBenchmarks: {
      ecommerce: { roi: 600, implementation: 2 },
      saas: { roi: 500, implementation: 3 },
      b2b: { roi: 400, implementation: 4 }
    },
    benefits: [
      '20-40% higher conversion rates',
      'Reduced customer acquisition cost',
      'Better qualified traffic',
      'Improved customer lifetime value'
    ],
    costs: {
      platform: 15000,
      creative: 8000,
      optimization: 10000,
      management: 7000
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

  'software-accounting': {
    category: 'software',
    name: 'Accounting Software Upgrade',
    description: 'Modern cloud-based accounting and financial management',
    costRange: { min: 8000, max: 40000 },
    timeframe: { min: 2, max: 6 },
    expectedROI: { min: 200, max: 500 },
    paybackPeriod: 7,
    riskLevel: 'low',
    industryBenchmarks: {
      small_business: { roi: 450, implementation: 3 },
      professional: { roi: 380, implementation: 4 },
      nonprofit: { roi: 320, implementation: 5 }
    },
    benefits: [
      '50-70% faster financial reporting',
      'Automated bookkeeping processes',
      'Better tax compliance',
      'Real-time financial insights'
    ],
    costs: {
      software: 18000,
      migration: 8000,
      training: 6000,
      customization: 8000
    }
  },

  'software-project': {
    category: 'software',
    name: 'Project Management Platform',
    description: 'Comprehensive project tracking and collaboration tools',
    costRange: { min: 12000, max: 60000 },
    timeframe: { min: 2, max: 8 },
    expectedROI: { min: 180, max: 400 },
    paybackPeriod: 9,
    riskLevel: 'medium',
    industryBenchmarks: {
      consulting: { roi: 350, implementation: 4 },
      construction: { roi: 280, implementation: 6 },
      creative: { roi: 400, implementation: 3 }
    },
    benefits: [
      '25-40% improvement in project delivery',
      'Better resource allocation',
      'Enhanced team collaboration',
      'Improved client communication'
    ],
    costs: {
      platform: 25000,
      setup: 15000,
      training: 12000,
      integration: 8000
    }
  },

  'software-helpdesk': {
    category: 'software',
    name: 'Customer Support Platform',
    description: 'Integrated helpdesk and customer service management',
    costRange: { min: 15000, max: 75000 },
    timeframe: { min: 3, max: 8 },
    expectedROI: { min: 200, max: 450 },
    paybackPeriod: 8,
    riskLevel: 'medium',
    industryBenchmarks: {
      saas: { roi: 400, implementation: 4 },
      ecommerce: { roi: 350, implementation: 5 },
      services: { roi: 320, implementation: 6 }
    },
    benefits: [
      '30-50% faster ticket resolution',
      'Improved customer satisfaction',
      'Better agent productivity',
      'Comprehensive reporting'
    ],
    costs: {
      platform: 35000,
      implementation: 18000,
      training: 12000,
      integration: 10000
    }
  },

  'software-inventory': {
    category: 'software',
    name: 'Enterprise Inventory System',
    description: 'Advanced inventory and supply chain management',
    costRange: { min: 25000, max: 120000 },
    timeframe: { min: 4, max: 12 },
    expectedROI: { min: 160, max: 380 },
    paybackPeriod: 12,
    riskLevel: 'medium',
    industryBenchmarks: {
      manufacturing: { roi: 320, implementation: 8 },
      retail: { roi: 380, implementation: 6 },
      wholesale: { roi: 280, implementation: 10 }
    },
    benefits: [
      '20-35% reduction in inventory costs',
      'Improved demand forecasting',
      'Better supplier management',
      'Reduced stock-outs'
    ],
    costs: {
      software: 55000,
      implementation: 30000,
      training: 15000,
      integration: 20000
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

  'cloud-database': {
    category: 'cloud',
    name: 'Database Cloud Migration',
    description: 'Move databases to cloud infrastructure',
    costRange: { min: 30000, max: 150000 },
    timeframe: { min: 4, max: 10 },
    expectedROI: { min: 180, max: 350 },
    paybackPeriod: 12,
    riskLevel: 'medium',
    industryBenchmarks: {
      enterprise: { roi: 300, implementation: 7 },
      saas: { roi: 320, implementation: 6 },
      ecommerce: { roi: 280, implementation: 8 }
    },
    benefits: [
      'Better disaster recovery',
      'Improved performance',
      'Reduced maintenance costs',
      'Enhanced security'
    ],
    costs: {
      migration: 70000,
      setup: 40000,
      training: 20000,
      ongoing: 25000
    }
  },

  'cloud-backup': {
    category: 'cloud',
    name: 'Cloud Backup & Recovery',
    description: 'Comprehensive cloud-based backup solution',
    costRange: { min: 10000, max: 50000 },
    timeframe: { min: 2, max: 6 },
    expectedROI: { min: 250, max: 600 },
    paybackPeriod: 6,
    riskLevel: 'low',
    industryBenchmarks: {
      small_business: { roi: 500, implementation: 3 },
      enterprise: { roi: 400, implementation: 4 },
      healthcare: { roi: 550, implementation: 2 }
    },
    benefits: [
      'Data protection assurance',
      'Faster recovery times',
      'Reduced hardware costs',
      'Compliance requirements met'
    ],
    costs: {
      setup: 15000,
      monthly: 2000,
      training: 8000,
      testing: 5000
    }
  },

  'cloud-hybrid': {
    category: 'cloud',
    name: 'Hybrid Cloud Strategy',
    description: 'Integrated on-premise and cloud infrastructure',
    costRange: { min: 80000, max: 300000 },
    timeframe: { min: 8, max: 18 },
    expectedROI: { min: 160, max: 320 },
    paybackPeriod: 15,
    riskLevel: 'high',
    industryBenchmarks: {
      enterprise: { roi: 280, implementation: 12 },
      financial: { roi: 250, implementation: 15 },
      manufacturing: { roi: 300, implementation: 10 }
    },
    benefits: [
      'Optimal cost-performance balance',
      'Enhanced data control',
      'Improved flexibility',
      'Better compliance management'
    ],
    costs: {
      infrastructure: 150000,
      integration: 80000,
      training: 35000,
      management: 40000
    }
  },

  'cloud-devops': {
    category: 'cloud',
    name: 'DevOps Cloud Platform',
    description: 'Cloud-based development and deployment pipeline',
    costRange: { min: 25000, max: 100000 },
    timeframe: { min: 3, max: 9 },
    expectedROI: { min: 200, max: 500 },
    paybackPeriod: 9,
    riskLevel: 'medium',
    industryBenchmarks: {
      technology: { roi: 450, implementation: 5 },
      startup: { roi: 400, implementation: 4 },
      enterprise: { roi: 320, implementation: 7 }
    },
    benefits: [
      '50-70% faster deployment cycles',
      'Improved code quality',
      'Better collaboration',
      'Reduced operational overhead'
    ],
    costs: {
      platform: 45000,
      setup: 25000,
      training: 20000,
      tools: 15000
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

  'security-identity': {
    category: 'security',
    name: 'Identity & Access Management',
    description: 'Advanced user authentication and access control',
    costRange: { min: 25000, max: 100000 },
    timeframe: { min: 3, max: 8 },
    expectedROI: { min: 300, max: 700 },
    paybackPeriod: 8,
    riskLevel: 'medium',
    benefits: [
      'Reduced unauthorized access',
      'Better compliance',
      'Improved user experience',
      'Centralized access control'
    ],
    costs: {
      platform: 45000,
      implementation: 30000,
      training: 15000,
      ongoing: 12000
    }
  },

  'security-soc': {
    category: 'security',
    name: 'Security Operations Center',
    description: '24/7 security monitoring and incident response',
    costRange: { min: 80000, max: 300000 },
    timeframe: { min: 6, max: 12 },
    expectedROI: { min: 250, max: 600 },
    paybackPeriod: 12,
    riskLevel: 'medium',
    benefits: [
      'Real-time threat detection',
      'Faster incident response',
      'Reduced security breaches',
      'Better forensic capabilities'
    ],
    costs: {
      setup: 120000,
      tools: 80000,
      staffing: 150000,
      training: 25000
    }
  },

  'security-endpoint': {
    category: 'security',
    name: 'Endpoint Protection Platform',
    description: 'Advanced endpoint detection and response',
    costRange: { min: 20000, max: 80000 },
    timeframe: { min: 2, max: 6 },
    expectedROI: { min: 350, max: 800 },
    paybackPeriod: 7,
    riskLevel: 'low',
    benefits: [
      'Advanced malware protection',
      'Better device visibility',
      'Automated threat response',
      'Reduced IT workload'
    ],
    costs: {
      licensing: 35000,
      deployment: 20000,
      training: 12000,
      management: 8000
    }
  },

  'security-compliance': {
    category: 'security',
    name: 'Compliance Management System',
    description: 'Automated compliance monitoring and reporting',
    costRange: { min: 30000, max: 120000 },
    timeframe: { min: 4, max: 10 },
    expectedROI: { min: 200, max: 500 },
    paybackPeriod: 10,
    riskLevel: 'medium',
    benefits: [
      'Simplified audit processes',
      'Reduced compliance risks',
      'Automated reporting',
      'Better documentation'
    ],
    costs: {
      platform: 55000,
      implementation: 35000,
      training: 20000,
      ongoing: 15000
    }
  },

  'security-backup': {
    category: 'security',
    name: 'Secure Backup & Recovery',
    description: 'Encrypted backup with disaster recovery',
    costRange: { min: 15000, max: 70000 },
    timeframe: { min: 2, max: 8 },
    expectedROI: { min: 300, max: 800 },
    paybackPeriod: 6,
    riskLevel: 'low',
    benefits: [
      'Data protection assurance',
      'Faster recovery times',
      'Ransomware protection',
      'Business continuity'
    ],
    costs: {
      infrastructure: 30000,
      software: 20000,
      implementation: 15000,
      testing: 8000
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

  'automation-accounting': {
    category: 'automation',
    name: 'Financial Process Automation',
    description: 'Automated invoicing, reconciliation, and reporting',
    costRange: { min: 20000, max: 90000 },
    timeframe: { min: 3, max: 9 },
    expectedROI: { min: 200, max: 450 },
    paybackPeriod: 9,
    riskLevel: 'medium',
    benefits: [
      '60-80% faster financial processing',
      'Reduced accounting errors',
      'Improved cash flow management',
      'Better financial visibility'
    ],
    costs: {
      software: 40000,
      implementation: 25000,
      training: 15000,
      integration: 12000
    }
  },

  'automation-hr': {
    category: 'automation',
    name: 'HR Process Automation',
    description: 'Automated recruitment, onboarding, and payroll',
    costRange: { min: 25000, max: 100000 },
    timeframe: { min: 4, max: 10 },
    expectedROI: { min: 180, max: 400 },
    paybackPeriod: 10,
    riskLevel: 'medium',
    benefits: [
      'Faster hiring processes',
      'Reduced administrative overhead',
      'Better employee experience',
      'Improved compliance tracking'
    ],
    costs: {
      platform: 50000,
      implementation: 30000,
      training: 12000,
      customization: 18000
    }
  },

  'automation-customer': {
    category: 'automation',
    name: 'Customer Service Automation',
    description: 'Automated ticketing and customer support workflows',
    costRange: { min: 18000, max: 70000 },
    timeframe: { min: 2, max: 7 },
    expectedROI: { min: 220, max: 500 },
    paybackPeriod: 7,
    riskLevel: 'low',
    benefits: [
      '40-60% faster response times',
      'Improved customer satisfaction',
      'Reduced support costs',
      'Better issue tracking'
    ],
    costs: {
      platform: 30000,
      setup: 18000,
      training: 12000,
      integration: 8000
    }
  },

  'automation-supply': {
    category: 'automation',
    name: 'Supply Chain Automation',
    description: 'Automated procurement and inventory management',
    costRange: { min: 40000, max: 180000 },
    timeframe: { min: 5, max: 12 },
    expectedROI: { min: 170, max: 380 },
    paybackPeriod: 12,
    riskLevel: 'medium',
    benefits: [
      'Optimized inventory levels',
      'Reduced procurement costs',
      'Better supplier management',
      'Improved demand forecasting'
    ],
    costs: {
      software: 80000,
      implementation: 60000,
      training: 25000,
      integration: 35000
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
  },

  // Additional SaaS scenarios
  'saas-erp': {
    category: 'saas',
    name: 'ERP System Migration',
    description: 'Migrate to cloud-based Enterprise Resource Planning',
    costRange: { min: 100000, max: 300000 },
    timeframe: { min: 8, max: 18 },
    expectedROI: { min: 150, max: 280 },
    paybackPeriod: 18,
    riskLevel: 'high',
    industryBenchmarks: {
      manufacturing: { roi: 250, implementation: 12 },
      retail: { roi: 180, implementation: 15 },
      services: { roi: 220, implementation: 10 }
    },
    benefits: [
      'Unified business processes',
      'Real-time data visibility',
      '25-35% operational efficiency gain',
      'Reduced IT infrastructure costs'
    ],
    costs: {
      licensing: 120000,
      implementation: 80000,
      training: 40000,
      customization: 60000
    }
  },

  'saas-hrms': {
    category: 'saas',
    name: 'HR Management System',
    description: 'Comprehensive human resources and payroll SaaS',
    costRange: { min: 15000, max: 60000 },
    timeframe: { min: 2, max: 6 },
    expectedROI: { min: 200, max: 450 },
    paybackPeriod: 8,
    riskLevel: 'low',
    industryBenchmarks: {
      corporate: { roi: 380, implementation: 4 },
      nonprofit: { roi: 280, implementation: 5 },
      healthcare: { roi: 350, implementation: 3 }
    },
    benefits: [
      '40-60% reduction in HR admin time',
      'Improved employee satisfaction',
      'Automated compliance tracking',
      'Better talent management'
    ],
    costs: {
      licensing: 25000,
      implementation: 12000,
      training: 8000,
      migration: 10000
    }
  },

  'saas-communication': {
    category: 'saas',
    name: 'Team Communication Platform',
    description: 'Slack/Microsoft Teams deployment for collaboration',
    costRange: { min: 8000, max: 35000 },
    timeframe: { min: 1, max: 4 },
    expectedROI: { min: 250, max: 500 },
    paybackPeriod: 6,
    riskLevel: 'low',
    industryBenchmarks: {
      remote: { roi: 450, implementation: 2 },
      corporate: { roi: 320, implementation: 3 },
      startup: { roi: 500, implementation: 1 }
    },
    benefits: [
      '30-50% faster team communication',
      'Reduced email dependency',
      'Improved remote collaboration',
      'Better project coordination'
    ],
    costs: {
      licensing: 18000,
      setup: 5000,
      training: 8000,
      integration: 4000
    }
  },

  // Additional FinTech scenarios
  'fintech-wealth': {
    category: 'fintech',
    name: 'Wealth Management Platform',
    description: 'Digital wealth and investment management system',
    costRange: { min: 120000, max: 400000 },
    timeframe: { min: 10, max: 20 },
    expectedROI: { min: 180, max: 350 },
    paybackPeriod: 16,
    riskLevel: 'high',
    industryBenchmarks: {
      financial: { roi: 300, implementation: 15 },
      investment: { roi: 350, implementation: 12 },
      advisory: { roi: 250, implementation: 18 }
    },
    benefits: [
      'Automated portfolio management',
      'Enhanced client experience',
      'Regulatory compliance tools',
      'Scalable investment operations'
    ],
    costs: {
      platform: 200000,
      compliance: 80000,
      integration: 70000,
      training: 30000
    }
  },

  'fintech-mobile': {
    category: 'fintech',
    name: 'Mobile Banking App',
    description: 'Native mobile banking and financial services app',
    costRange: { min: 150000, max: 500000 },
    timeframe: { min: 12, max: 24 },
    expectedROI: { min: 200, max: 400 },
    paybackPeriod: 20,
    riskLevel: 'high',
    industryBenchmarks: {
      banking: { roi: 350, implementation: 18 },
      credit_union: { roi: 280, implementation: 20 },
      fintech: { roi: 400, implementation: 15 }
    },
    benefits: [
      'Enhanced customer engagement',
      'Reduced branch operation costs',
      '24/7 banking services',
      'Competitive digital presence'
    ],
    costs: {
      development: 250000,
      security: 100000,
      compliance: 80000,
      maintenance: 70000
    }
  },

  'fintech-robo': {
    category: 'fintech',
    name: 'Robo-Advisory Service',
    description: 'Automated investment advisory and portfolio management',
    costRange: { min: 80000, max: 250000 },
    timeframe: { min: 6, max: 14 },
    expectedROI: { min: 220, max: 450 },
    paybackPeriod: 12,
    riskLevel: 'medium',
    industryBenchmarks: {
      financial: { roi: 380, implementation: 10 },
      investment: { roi: 450, implementation: 8 },
      advisory: { roi: 300, implementation: 12 }
    },
    benefits: [
      'Lower operational costs',
      'Scalable advisory services',
      'Consistent investment strategies',
      'Broader market accessibility'
    ],
    costs: {
      platform: 120000,
      algorithms: 60000,
      compliance: 40000,
      integration: 30000
    }
  },

  // Employee Training scenarios
  'training-leadership': {
    category: 'training',
    name: 'Leadership Development Program',
    description: 'Comprehensive management and leadership training',
    costRange: { min: 15000, max: 80000 },
    timeframe: { min: 3, max: 12 },
    expectedROI: { min: 200, max: 500 },
    paybackPeriod: 8,
    riskLevel: 'low',
    industryBenchmarks: {
      corporate: { roi: 420, implementation: 6 },
      healthcare: { roi: 380, implementation: 8 },
      financial: { roi: 350, implementation: 7 }
    },
    benefits: [
      '25-40% improvement in team productivity',
      'Better employee retention',
      'Enhanced decision-making skills',
      'Improved organizational culture'
    ],
    costs: {
      program: 35000,
      materials: 12000,
      facilitator: 20000,
      assessment: 8000
    }
  },

  'training-technical': {
    category: 'training',
    name: 'Technical Skills Training',
    description: 'Technology and software proficiency development',
    costRange: { min: 8000, max: 50000 },
    timeframe: { min: 2, max: 8 },
    expectedROI: { min: 250, max: 600 },
    paybackPeriod: 6,
    riskLevel: 'low',
    industryBenchmarks: {
      technology: { roi: 550, implementation: 4 },
      manufacturing: { roi: 400, implementation: 6 },
      services: { roi: 350, implementation: 5 }
    },
    benefits: [
      '30-50% increase in technical efficiency',
      'Reduced error rates',
      'Better software adoption',
      'Enhanced innovation capacity'
    ],
    costs: {
      courses: 25000,
      certification: 8000,
      materials: 6000,
      time_investment: 12000
    }
  },

  'training-sales': {
    category: 'training',
    name: 'Sales Training Program',
    description: 'Advanced sales techniques and customer relationship skills',
    costRange: { min: 12000, max: 60000 },
    timeframe: { min: 2, max: 6 },
    expectedROI: { min: 300, max: 800 },
    paybackPeriod: 4,
    riskLevel: 'low',
    industryBenchmarks: {
      b2b_sales: { roi: 650, implementation: 3 },
      retail: { roi: 450, implementation: 4 },
      real_estate: { roi: 750, implementation: 2 }
    },
    benefits: [
      '20-45% increase in sales conversion',
      'Higher average deal size',
      'Better customer relationships',
      'Reduced sales cycle time'
    ],
    costs: {
      training: 28000,
      materials: 8000,
      coaching: 15000,
      tools: 6000
    }
  },

  'training-compliance': {
    category: 'training',
    name: 'Compliance Training Program',
    description: 'Regulatory compliance and risk management education',
    costRange: { min: 10000, max: 45000 },
    timeframe: { min: 2, max: 6 },
    expectedROI: { min: 180, max: 400 },
    paybackPeriod: 7,
    riskLevel: 'low',
    industryBenchmarks: {
      financial: { roi: 350, implementation: 4 },
      healthcare: { roi: 380, implementation: 3 },
      manufacturing: { roi: 280, implementation: 5 }
    },
    benefits: [
      'Reduced compliance violations',
      'Lower regulatory risk',
      'Improved audit results',
      'Better risk awareness'
    ],
    costs: {
      program: 22000,
      assessment: 8000,
      certification: 10000,
      updates: 5000
    }
  },

  'training-customer': {
    category: 'training',
    name: 'Customer Service Excellence',
    description: 'Customer service skills and satisfaction improvement',
    costRange: { min: 6000, max: 35000 },
    timeframe: { min: 1, max: 4 },
    expectedROI: { min: 250, max: 550 },
    paybackPeriod: 5,
    riskLevel: 'low',
    industryBenchmarks: {
      retail: { roi: 480, implementation: 2 },
      hospitality: { roi: 520, implementation: 2 },
      services: { roi: 420, implementation: 3 }
    },
    benefits: [
      '15-30% improvement in customer satisfaction',
      'Reduced customer churn',
      'Better online reviews',
      'Increased repeat business'
    ],
    costs: {
      training: 18000,
      materials: 5000,
      assessment: 6000,
      follow_up: 4000
    }
  },

  'training-safety': {
    category: 'training',
    name: 'Workplace Safety Training',
    description: 'Comprehensive safety protocols and accident prevention',
    costRange: { min: 8000, max: 40000 },
    timeframe: { min: 1, max: 6 },
    expectedROI: { min: 200, max: 600 },
    paybackPeriod: 6,
    riskLevel: 'low',
    industryBenchmarks: {
      manufacturing: { roi: 500, implementation: 3 },
      construction: { roi: 550, implementation: 2 },
      healthcare: { roi: 400, implementation: 4 }
    },
    benefits: [
      '40-70% reduction in workplace accidents',
      'Lower insurance premiums',
      'Reduced downtime',
      'Improved employee confidence'
    ],
    costs: {
      program: 20000,
      equipment: 8000,
      certification: 6000,
      ongoing: 5000
    }
  },

  // Digital Marketing scenarios
  'digital-seo': {
    category: 'digital',
    name: 'SEO & Organic Traffic Strategy',
    description: 'Search engine optimization and organic growth',
    costRange: { min: 8000, max: 60000 },
    timeframe: { min: 6, max: 18 },
    expectedROI: { min: 300, max: 800 },
    paybackPeriod: 12,
    riskLevel: 'medium',
    industryBenchmarks: {
      ecommerce: { roi: 650, implementation: 12 },
      saas: { roi: 550, implementation: 9 },
      local_business: { roi: 450, implementation: 6 }
    },
    benefits: [
      'Long-term organic traffic growth',
      'Reduced paid advertising dependency',
      'Better brand authority',
      'Higher conversion rates'
    ],
    costs: {
      strategy: 20000,
      tools: 8000,
      content: 25000,
      optimization: 15000
    }
  },

  'digital-website': {
    category: 'digital',
    name: 'Website Redesign & Optimization',
    description: 'Modern, conversion-focused website development',
    costRange: { min: 15000, max: 100000 },
    timeframe: { min: 3, max: 8 },
    expectedROI: { min: 200, max: 600 },
    paybackPeriod: 8,
    riskLevel: 'medium',
    industryBenchmarks: {
      ecommerce: { roi: 550, implementation: 5 },
      b2b: { roi: 400, implementation: 6 },
      services: { roi: 450, implementation: 4 }
    },
    benefits: [
      '25-50% increase in conversion rates',
      'Better user experience',
      'Mobile-responsive design',
      'Improved search rankings'
    ],
    costs: {
      design: 35000,
      development: 40000,
      optimization: 15000,
      testing: 10000
    }
  },

  'digital-automation': {
    category: 'digital',
    name: 'Marketing Automation & CRM',
    description: 'Automated lead nurturing and customer journey',
    costRange: { min: 20000, max: 80000 },
    timeframe: { min: 3, max: 9 },
    expectedROI: { min: 250, max: 500 },
    paybackPeriod: 7,
    riskLevel: 'medium',
    industryBenchmarks: {
      b2b: { roi: 450, implementation: 6 },
      saas: { roi: 500, implementation: 5 },
      ecommerce: { roi: 380, implementation: 7 }
    },
    benefits: [
      '30-60% increase in qualified leads',
      'Automated customer nurturing',
      'Better lead scoring',
      'Improved sales conversion'
    ],
    costs: {
      platform: 35000,
      setup: 20000,
      integration: 15000,
      training: 10000
    }
  },

  'digital-analytics': {
    category: 'digital',
    name: 'Digital Analytics & Tracking',
    description: 'Advanced analytics and performance measurement',
    costRange: { min: 5000, max: 35000 },
    timeframe: { min: 2, max: 6 },
    expectedROI: { min: 300, max: 700 },
    paybackPeriod: 5,
    riskLevel: 'low',
    industryBenchmarks: {
      ecommerce: { roi: 600, implementation: 3 },
      saas: { roi: 550, implementation: 4 },
      media: { roi: 500, implementation: 2 }
    },
    benefits: [
      'Data-driven marketing decisions',
      'Better campaign optimization',
      'Improved customer insights',
      'Higher marketing ROI'
    ],
    costs: {
      tools: 15000,
      setup: 8000,
      training: 7000,
      consulting: 10000
    }
  },

  'digital-social': {
    category: 'digital',
    name: 'Social Media Strategy',
    description: 'Comprehensive social media presence and engagement',
    costRange: { min: 10000, max: 50000 },
    timeframe: { min: 3, max: 12 },
    expectedROI: { min: 200, max: 500 },
    paybackPeriod: 8,
    riskLevel: 'medium',
    industryBenchmarks: {
      b2c: { roi: 450, implementation: 6 },
      retail: { roi: 400, implementation: 4 },
      hospitality: { roi: 380, implementation: 5 }
    },
    benefits: [
      'Increased brand awareness',
      'Better customer engagement',
      'Social proof and credibility',
      'Community building'
    ],
    costs: {
      strategy: 15000,
      content: 20000,
      tools: 8000,
      management: 12000
    }
  },

  'digital-video': {
    category: 'digital',
    name: 'Video Marketing Campaign',
    description: 'Professional video content for digital channels',
    costRange: { min: 12000, max: 80000 },
    timeframe: { min: 2, max: 8 },
    expectedROI: { min: 250, max: 600 },
    paybackPeriod: 6,
    riskLevel: 'medium',
    industryBenchmarks: {
      b2c: { roi: 520, implementation: 4 },
      education: { roi: 450, implementation: 6 },
      entertainment: { roi: 600, implementation: 3 }
    },
    benefits: [
      'Higher engagement rates',
      'Better brand storytelling',
      'Improved conversion rates',
      'Viral potential'
    ],
    costs: {
      production: 35000,
      equipment: 15000,
      editing: 12000,
      distribution: 8000
    }
  },

  // Customer Experience scenarios
  'experience-journey': {
    category: 'experience',
    name: 'Customer Journey Mapping',
    description: 'Comprehensive customer experience optimization',
    costRange: { min: 15000, max: 75000 },
    timeframe: { min: 3, max: 8 },
    expectedROI: { min: 200, max: 450 },
    paybackPeriod: 8,
    riskLevel: 'medium',
    industryBenchmarks: {
      retail: { roi: 380, implementation: 5 },
      hospitality: { roi: 420, implementation: 4 },
      b2b: { roi: 320, implementation: 6 }
    },
    benefits: [
      '20-35% improvement in customer satisfaction',
      'Reduced customer churn',
      'Higher customer lifetime value',
      'Better brand loyalty'
    ],
    costs: {
      research: 25000,
      implementation: 30000,
      training: 12000,
      tools: 8000
    }
  },

  'experience-loyalty': {
    category: 'experience',
    name: 'Customer Loyalty Program',
    description: 'Rewards and retention program implementation',
    costRange: { min: 20000, max: 100000 },
    timeframe: { min: 4, max: 10 },
    expectedROI: { min: 180, max: 400 },
    paybackPeriod: 10,
    riskLevel: 'medium',
    industryBenchmarks: {
      retail: { roi: 350, implementation: 6 },
      ecommerce: { roi: 400, implementation: 5 },
      hospitality: { roi: 380, implementation: 7 }
    },
    benefits: [
      '15-30% increase in repeat purchases',
      'Higher average order value',
      'Better customer data insights',
      'Reduced acquisition costs'
    ],
    costs: {
      platform: 45000,
      rewards: 30000,
      marketing: 15000,
      management: 10000
    }
  },

  'experience-support': {
    category: 'experience',
    name: 'Customer Support Enhancement',
    description: 'Advanced customer service and support systems',
    costRange: { min: 25000, max: 120000 },
    timeframe: { min: 3, max: 9 },
    expectedROI: { min: 200, max: 500 },
    paybackPeriod: 9,
    riskLevel: 'medium',
    industryBenchmarks: {
      saas: { roi: 450, implementation: 5 },
      ecommerce: { roi: 380, implementation: 6 },
      telecom: { roi: 320, implementation: 8 }
    },
    benefits: [
      '40-60% faster issue resolution',
      'Improved customer satisfaction scores',
      'Reduced support costs',
      'Better agent productivity'
    ],
    costs: {
      platform: 55000,
      training: 25000,
      integration: 20000,
      ongoing: 15000
    }
  },

  'experience-personalization': {
    category: 'experience',
    name: 'Personalization Engine',
    description: 'AI-driven personalized customer experiences',
    costRange: { min: 30000, max: 150000 },
    timeframe: { min: 4, max: 12 },
    expectedROI: { min: 220, max: 550 },
    paybackPeriod: 11,
    riskLevel: 'high',
    industryBenchmarks: {
      ecommerce: { roi: 480, implementation: 8 },
      media: { roi: 520, implementation: 6 },
      financial: { roi: 380, implementation: 10 }
    },
    benefits: [
      '25-45% increase in engagement',
      'Higher conversion rates',
      'Better customer segmentation',
      'Improved product recommendations'
    ],
    costs: {
      platform: 80000,
      implementation: 40000,
      training: 20000,
      optimization: 25000
    }
  },

  'experience-feedback': {
    category: 'experience',
    name: 'Customer Feedback System',
    description: 'Comprehensive feedback collection and analysis',
    costRange: { min: 8000, max: 40000 },
    timeframe: { min: 2, max: 6 },
    expectedROI: { min: 250, max: 500 },
    paybackPeriod: 6,
    riskLevel: 'low',
    industryBenchmarks: {
      services: { roi: 420, implementation: 4 },
      retail: { roi: 380, implementation: 3 },
      hospitality: { roi: 450, implementation: 3 }
    },
    benefits: [
      'Better customer insights',
      'Improved service quality',
      'Faster issue identification',
      'Enhanced product development'
    ],
    costs: {
      platform: 18000,
      implementation: 10000,
      training: 8000,
      analysis: 6000
    }
  },

  'experience-omnichannel': {
    category: 'experience',
    name: 'Omnichannel Experience',
    description: 'Integrated multi-channel customer experience',
    costRange: { min: 40000, max: 200000 },
    timeframe: { min: 6, max: 15 },
    expectedROI: { min: 180, max: 380 },
    paybackPeriod: 14,
    riskLevel: 'high',
    industryBenchmarks: {
      retail: { roi: 320, implementation: 10 },
      financial: { roi: 280, implementation: 12 },
      telecom: { roi: 350, implementation: 9 }
    },
    benefits: [
      'Seamless customer experience',
      'Better customer data integration',
      'Improved conversion rates',
      'Enhanced brand consistency'
    ],
    costs: {
      integration: 90000,
      platform: 70000,
      training: 25000,
      optimization: 35000
    }
  },

  // Data & Analytics scenarios
  'analytics-warehouse': {
    category: 'analytics',
    name: 'Data Warehouse Implementation',
    description: 'Centralized data storage and analytics infrastructure',
    costRange: { min: 50000, max: 250000 },
    timeframe: { min: 6, max: 15 },
    expectedROI: { min: 150, max: 350 },
    paybackPeriod: 15,
    riskLevel: 'high',
    industryBenchmarks: {
      enterprise: { roi: 300, implementation: 12 },
      retail: { roi: 280, implementation: 10 },
      financial: { roi: 320, implementation: 14 }
    },
    benefits: [
      'Centralized data management',
      'Better reporting capabilities',
      'Improved decision making',
      'Enhanced data quality'
    ],
    costs: {
      infrastructure: 120000,
      implementation: 70000,
      training: 30000,
      maintenance: 35000
    }
  },

  'analytics-bi': {
    category: 'analytics',
    name: 'Business Intelligence Platform',
    description: 'Advanced analytics and reporting dashboard',
    costRange: { min: 25000, max: 120000 },
    timeframe: { min: 4, max: 10 },
    expectedROI: { min: 200, max: 450 },
    paybackPeriod: 10,
    riskLevel: 'medium',
    industryBenchmarks: {
      corporate: { roi: 380, implementation: 7 },
      manufacturing: { roi: 320, implementation: 8 },
      services: { roi: 350, implementation: 6 }
    },
    benefits: [
      'Real-time business insights',
      'Faster decision making',
      'Better performance tracking',
      'Improved operational efficiency'
    ],
    costs: {
      platform: 60000,
      implementation: 35000,
      training: 15000,
      customization: 20000
    }
  },

  'analytics-predictive': {
    category: 'analytics',
    name: 'Predictive Analytics Suite',
    description: 'Machine learning for forecasting and insights',
    costRange: { min: 40000, max: 180000 },
    timeframe: { min: 5, max: 12 },
    expectedROI: { min: 220, max: 500 },
    paybackPeriod: 12,
    riskLevel: 'high',
    industryBenchmarks: {
      retail: { roi: 420, implementation: 9 },
      manufacturing: { roi: 380, implementation: 10 },
      financial: { roi: 460, implementation: 8 }
    },
    benefits: [
      'Better demand forecasting',
      'Risk prediction and mitigation',
      'Optimized resource allocation',
      'Improved customer insights'
    ],
    costs: {
      platform: 85000,
      implementation: 50000,
      training: 25000,
      modeling: 30000
    }
  },

  'analytics-realtime': {
    category: 'analytics',
    name: 'Real-time Analytics Dashboard',
    description: 'Live data monitoring and alerting system',
    costRange: { min: 20000, max: 80000 },
    timeframe: { min: 3, max: 8 },
    expectedROI: { min: 250, max: 450 },
    paybackPeriod: 8,
    riskLevel: 'medium',
    industryBenchmarks: {
      ecommerce: { roi: 400, implementation: 5 },
      saas: { roi: 420, implementation: 4 },
      operations: { roi: 350, implementation: 6 }
    },
    benefits: [
      'Immediate problem detection',
      'Faster response times',
      'Better operational monitoring',
      'Improved customer experience'
    ],
    costs: {
      platform: 40000,
      setup: 20000,
      integration: 15000,
      training: 10000
    }
  },

  'analytics-customer': {
    category: 'analytics',
    name: 'Customer Analytics Platform',
    description: 'Advanced customer behavior and lifecycle analysis',
    costRange: { min: 30000, max: 120000 },
    timeframe: { min: 4, max: 9 },
    expectedROI: { min: 200, max: 480 },
    paybackPeriod: 9,
    riskLevel: 'medium',
    industryBenchmarks: {
      retail: { roi: 420, implementation: 6 },
      ecommerce: { roi: 460, implementation: 5 },
      subscription: { roi: 380, implementation: 7 }
    },
    benefits: [
      'Better customer segmentation',
      'Improved retention strategies',
      'Higher lifetime value',
      'Personalized experiences'
    ],
    costs: {
      platform: 55000,
      implementation: 30000,
      integration: 20000,
      training: 15000
    }
  },

  'analytics-performance': {
    category: 'analytics',
    name: 'Performance Analytics Suite',
    description: 'Comprehensive business performance measurement',
    costRange: { min: 15000, max: 70000 },
    timeframe: { min: 3, max: 7 },
    expectedROI: { min: 230, max: 420 },
    paybackPeriod: 7,
    riskLevel: 'low',
    industryBenchmarks: {
      corporate: { roi: 380, implementation: 5 },
      startup: { roi: 350, implementation: 4 },
      nonprofit: { roi: 280, implementation: 6 }
    },
    benefits: [
      'Clear KPI tracking',
      'Better goal alignment',
      'Improved accountability',
      'Data-driven decisions'
    ],
    costs: {
      platform: 35000,
      setup: 15000,
      training: 12000,
      customization: 8000
    }
  },

  // Sustainability scenarios
  'sustainability-energy': {
    category: 'sustainability',
    name: 'Renewable Energy Transition',
    description: 'Solar, wind, and green energy infrastructure',
    costRange: { min: 100000, max: 500000 },
    timeframe: { min: 12, max: 36 },
    expectedROI: { min: 150, max: 300 },
    paybackPeriod: 24,
    riskLevel: 'medium',
    industryBenchmarks: {
      manufacturing: { roi: 250, implementation: 18 },
      commercial: { roi: 200, implementation: 24 },
      retail: { roi: 180, implementation: 30 }
    },
    benefits: [
      '40-70% reduction in energy costs',
      'Carbon footprint reduction',
      'Energy independence',
      'Government incentives and tax credits'
    ],
    costs: {
      equipment: 250000,
      installation: 150000,
      permits: 30000,
      maintenance: 70000
    }
  },

  'sustainability-waste': {
    category: 'sustainability',
    name: 'Waste Reduction Program',
    description: 'Comprehensive waste management and recycling',
    costRange: { min: 20000, max: 100000 },
    timeframe: { min: 6, max: 18 },
    expectedROI: { min: 180, max: 400 },
    paybackPeriod: 15,
    riskLevel: 'low',
    industryBenchmarks: {
      manufacturing: { roi: 350, implementation: 12 },
      retail: { roi: 280, implementation: 9 },
      hospitality: { roi: 320, implementation: 6 }
    },
    benefits: [
      '30-50% reduction in waste costs',
      'Improved brand reputation',
      'Regulatory compliance',
      'Resource optimization'
    ],
    costs: {
      equipment: 40000,
      training: 15000,
      implementation: 25000,
      ongoing: 20000
    }
  },

  'sustainability-carbon': {
    category: 'sustainability',
    name: 'Carbon Footprint Reduction',
    description: 'Comprehensive carbon management and offsetting',
    costRange: { min: 30000, max: 150000 },
    timeframe: { min: 8, max: 24 },
    expectedROI: { min: 160, max: 350 },
    paybackPeriod: 18,
    riskLevel: 'medium',
    industryBenchmarks: {
      corporate: { roi: 280, implementation: 15 },
      logistics: { roi: 320, implementation: 12 },
      energy: { roi: 250, implementation: 18 }
    },
    benefits: [
      'Carbon neutrality achievement',
      'ESG compliance improvement',
      'Brand value enhancement',
      'Cost savings from efficiency'
    ],
    costs: {
      assessment: 25000,
      implementation: 60000,
      offsetting: 35000,
      monitoring: 30000
    }
  },

  'sustainability-building': {
    category: 'sustainability',
    name: 'Green Building Certification',
    description: 'LEED/BREEAM sustainable building upgrades',
    costRange: { min: 80000, max: 400000 },
    timeframe: { min: 10, max: 30 },
    expectedROI: { min: 140, max: 280 },
    paybackPeriod: 20,
    riskLevel: 'medium',
    industryBenchmarks: {
      commercial_real_estate: { roi: 240, implementation: 18 },
      office: { roi: 200, implementation: 24 },
      retail: { roi: 180, implementation: 20 }
    },
    benefits: [
      '20-40% reduction in operating costs',
      'Higher property values',
      'Better employee productivity',
      'Tax incentives and rebates'
    ],
    costs: {
      upgrades: 200000,
      certification: 50000,
      consulting: 80000,
      ongoing: 70000
    }
  },

  'sustainability-supply': {
    category: 'sustainability',
    name: 'Sustainable Supply Chain',
    description: 'Green supplier network and logistics optimization',
    costRange: { min: 40000, max: 200000 },
    timeframe: { min: 8, max: 20 },
    expectedROI: { min: 170, max: 380 },
    paybackPeriod: 16,
    riskLevel: 'medium',
    industryBenchmarks: {
      manufacturing: { roi: 320, implementation: 12 },
      retail: { roi: 280, implementation: 15 },
      logistics: { roi: 350, implementation: 10 }
    },
    benefits: [
      'Reduced transportation costs',
      'Better supplier relationships',
      'Risk mitigation',
      'Brand reputation improvement'
    ],
    costs: {
      assessment: 30000,
      implementation: 80000,
      training: 40000,
      monitoring: 50000
    }
  },

  'sustainability-reporting': {
    category: 'sustainability',
    name: 'ESG Reporting System',
    description: 'Environmental, Social, Governance tracking and reporting',
    costRange: { min: 25000, max: 100000 },
    timeframe: { min: 4, max: 12 },
    expectedROI: { min: 200, max: 400 },
    paybackPeriod: 12,
    riskLevel: 'low',
    industryBenchmarks: {
      public_company: { roi: 350, implementation: 8 },
      large_enterprise: { roi: 300, implementation: 10 },
      financial: { roi: 380, implementation: 6 }
    },
    benefits: [
      'Improved investor relations',
      'Better regulatory compliance',
      'Enhanced brand reputation',
      'Access to ESG funding'
    ],
    costs: {
      platform: 45000,
      implementation: 25000,
      training: 15000,
      ongoing: 15000
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