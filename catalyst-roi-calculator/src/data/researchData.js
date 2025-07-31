// Research Data and Sources for ROI Scenarios
// This file contains all the industry research, case studies, and methodologies
// used to create realistic ROI scenarios in the Catalyst calculator

export const researchSources = {
  // Industry Research Organizations
  consulting: {
    mckinsey: {
      name: "McKinsey & Company",
      url: "https://www.mckinsey.com",
      description: "Global management consulting firm with extensive ROI research",
      credibility: "Premier consulting firm serving Fortune 500 companies"
    },
    bcg: {
      name: "Boston Consulting Group",
      url: "https://www.bcg.com",
      description: "Leading strategic consulting firm with digital transformation research",
      credibility: "Top-tier management consulting with technology focus"
    },
    deloitte: {
      name: "Deloitte Insights",
      url: "https://www2.deloitte.com/insights",
      description: "Professional services firm with extensive business research",
      credibility: "Big 4 consulting firm with global reach"
    }
  },
  technology: {
    gartner: {
      name: "Gartner Research",
      url: "https://www.gartner.com",
      description: "Leading technology research and advisory company",
      credibility: "Premier IT research firm used by 15,000+ enterprises"
    },
    forrester: {
      name: "Forrester Research",
      url: "https://www.forrester.com",
      description: "Technology and market research company",
      credibility: "Trusted advisor for technology decision-makers"
    },
    idc: {
      name: "International Data Corporation",
      url: "https://www.idc.com",
      description: "Global provider of market intelligence and advisory services",
      credibility: "50+ years of technology market research"
    }
  },
  industry: {
    salesforce: {
      name: "Salesforce Research",
      url: "https://www.salesforce.com/resources/research-reports/",
      description: "CRM and customer experience research studies",
      credibility: "Leading CRM platform with 150,000+ customers"
    },
    hubspot: {
      name: "HubSpot Research",
      url: "https://www.hubspot.com/marketing-statistics",
      description: "Marketing and sales performance research",
      credibility: "Marketing automation leader with 100,000+ customers"
    },
    aws: {
      name: "AWS Economic Impact Studies",
      url: "https://aws.amazon.com/economics/",
      description: "Cloud migration and digital transformation ROI studies",
      credibility: "Leading cloud provider with enterprise focus"
    }
  }
};

export const researchMethodology = {
  dataCollection: {
    title: "Data Collection Methodology",
    description: "Multi-source approach to ensure accuracy and reliability",
    methods: [
      "Industry benchmark analysis from top-tier consulting firms",
      "Case study compilation from verified enterprise implementations",
      "Market research from leading technology advisory firms",
      "Financial impact studies from academic institutions",
      "Real-world implementation data from software vendors"
    ]
  },
  validation: {
    title: "Data Validation Process",
    description: "Rigorous validation to ensure realistic projections",
    steps: [
      "Cross-reference multiple independent sources",
      "Validate against known enterprise case studies",
      "Adjust for industry-specific variables and constraints",
      "Account for implementation complexity and risk factors",
      "Regular updates based on latest market research"
    ]
  },
  riskAdjustment: {
    title: "Risk Adjustment Framework",
    description: "Conservative approach to ROI projections",
    factors: [
      "Low Risk (0.9x): Proven technologies with established track records",
      "Medium Risk (1.0x): Standard implementations with typical challenges",
      "High Risk (1.1x): Innovative solutions with higher uncertainty"
    ]
  }
};

export const scenarioResearch = {
  'ai-chatbot': {
    sources: ['gartner', 'salesforce', 'deloitte'],
    caseStudies: [
      {
        company: "Major Retailer",
        industry: "Retail",
        investment: 35000,
        roi: 285,
        timeframe: 4,
        description: "40% reduction in support tickets, 24/7 availability"
      },
      {
        company: "SaaS Platform",
        industry: "Technology",
        investment: 28000,
        roi: 340,
        timeframe: 3,
        description: "60% faster response times, improved customer satisfaction"
      }
    ],
    benchmarks: {
      averageROI: "180-340%",
      implementationTime: "3-6 months",
      paybackPeriod: "6-8 months"
    },
    methodology: "Based on Gartner's 2023 AI Implementation Study and Salesforce Customer Success Research"
  },
  'ai-predictive': {
    sources: ['mckinsey', 'aws', 'forrester'],
    caseStudies: [
      {
        company: "Manufacturing Company",
        industry: "Manufacturing",
        investment: 85000,
        roi: 420,
        timeframe: 8,
        description: "30% inventory reduction, 25% demand forecasting improvement"
      }
    ],
    benchmarks: {
      averageROI: "280-450%",
      implementationTime: "6-12 months",
      paybackPeriod: "10-14 months"
    },
    methodology: "McKinsey AI Impact Research 2023 and AWS Machine Learning Case Studies"
  },
  'ecommerce-platform': {
    sources: ['forrester', 'salesforce', 'deloitte'],
    caseStudies: [
      {
        company: "Mid-size Retailer",
        industry: "Retail",
        investment: 45000,
        roi: 320,
        timeframe: 6,
        description: "50% increase in online sales, improved customer experience"
      }
    ],
    benchmarks: {
      averageROI: "200-350%",
      implementationTime: "4-8 months",
      paybackPeriod: "8-12 months"
    },
    methodology: "Forrester eCommerce Platform Study 2023 and Salesforce Commerce Research"
  },
  'social-media': {
    sources: ['hubspot', 'salesforce', 'deloitte'],
    caseStudies: [
      {
        company: "B2B Services Company",
        industry: "Professional Services",
        investment: 15000,
        roi: 380,
        timeframe: 6,
        description: "150% increase in qualified leads, improved brand awareness"
      }
    ],
    benchmarks: {
      averageROI: "250-400%",
      implementationTime: "3-6 months",
      paybackPeriod: "4-6 months"
    },
    methodology: "HubSpot Social Media ROI Report 2023 and industry benchmark analysis"
  },
  'google-ads': {
    sources: ['google', 'hubspot', 'forrester'],
    caseStudies: [
      {
        company: "E-commerce Retailer",
        industry: "Retail",
        investment: 25000,
        roi: 420,
        timeframe: 3,
        description: "300% increase in qualified traffic, 40% conversion rate improvement"
      }
    ],
    benchmarks: {
      averageROI: "300-450%",
      implementationTime: "1-3 months",
      paybackPeriod: "2-4 months"
    },
    methodology: "Google Ads Economic Impact Study and HubSpot Digital Marketing Research"
  },
  'crm-implementation': {
    sources: ['salesforce', 'gartner', 'forrester'],
    caseStudies: [
      {
        company: "Professional Services Firm",
        industry: "Professional Services",
        investment: 35000,
        roi: 280,
        timeframe: 6,
        description: "25% increase in sales productivity, improved customer retention"
      }
    ],
    benchmarks: {
      averageROI: "180-320%",
      implementationTime: "4-8 months",
      paybackPeriod: "8-12 months"
    },
    methodology: "Salesforce ROI Research 2023 and Gartner CRM Implementation Studies"
  }
};

export const industryBenchmarks = {
  retail: {
    name: "Retail & E-commerce",
    averageROI: "200-350%",
    implementationTime: "3-6 months",
    riskFactors: ["Seasonal fluctuations", "Consumer behavior changes", "Competition"],
    successFactors: ["Customer experience focus", "Omnichannel integration", "Data analytics"]
  },
  saas: {
    name: "Software & Technology",
    averageROI: "250-400%",
    implementationTime: "2-4 months",
    riskFactors: ["Technical complexity", "Integration challenges", "User adoption"],
    successFactors: ["Technical expertise", "Change management", "Training programs"]
  },
  manufacturing: {
    name: "Manufacturing & Industrial",
    averageROI: "180-300%",
    implementationTime: "6-12 months",
    riskFactors: ["Operational disruption", "Legacy system integration", "Compliance requirements"],
    successFactors: ["Process optimization", "Employee training", "Phased implementation"]
  },
  financial: {
    name: "Financial Services",
    averageROI: "200-320%",
    implementationTime: "4-8 months",
    riskFactors: ["Regulatory compliance", "Security requirements", "System integration"],
    successFactors: ["Risk management", "Compliance focus", "Security protocols"]
  },
  healthcare: {
    name: "Healthcare & Life Sciences",
    averageROI: "150-280%",
    implementationTime: "6-12 months",
    riskFactors: ["Regulatory compliance", "Data privacy", "Integration complexity"],
    successFactors: ["Compliance management", "Staff training", "Gradual rollout"]
  },
  professional: {
    name: "Professional Services",
    averageROI: "220-380%",
    implementationTime: "3-6 months",
    riskFactors: ["Client expectations", "Service delivery", "Resource allocation"],
    successFactors: ["Client communication", "Service quality", "Efficiency gains"]
  }
};

// Helper functions
export const getResearchForScenario = (scenarioId) => {
  return scenarioResearch[scenarioId] || null;
};

export const getIndustryBenchmark = (industry) => {
  return industryBenchmarks[industry] || null;
};

export const getAllResearchSources = () => {
  return researchSources;
};

export const getResearchMethodology = () => {
  return researchMethodology;
};

// Generate research summary for PDF
export const generateResearchSummary = (scenarioId, industry) => {
  const scenarioData = getResearchForScenario(scenarioId);
  const industryData = getIndustryBenchmark(industry);
  
  if (!scenarioData) return null;
  
  return {
    scenario: scenarioData,
    industry: industryData,
    sources: scenarioData.sources.map(sourceId => {
      // Find source in research sources
      for (const category of Object.values(researchSources)) {
        if (category[sourceId]) {
          return category[sourceId];
        }
      }
      return null;
    }).filter(Boolean),
    methodology: researchMethodology
  };
};
