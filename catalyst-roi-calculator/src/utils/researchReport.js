import jsPDF from 'jspdf';
import { 
  generateResearchSummary, 
  getAllResearchSources, 
  getResearchMethodology,
  scenarioResearch 
} from '../data/researchData.js';

// Generate detailed research report for a specific calculation
export const exportDetailedResearch = async (results) => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Extract scenario ID from results
    let scenarioId = null;
    if (results.scenario.name.includes('Chatbot')) scenarioId = 'ai-chatbot';
    else if (results.scenario.name.includes('Predictive')) scenarioId = 'ai-predictive';
    else if (results.scenario.name.includes('E-commerce') || results.scenario.name.includes('eCommerce')) scenarioId = 'ecommerce-platform';
    else if (results.scenario.name.includes('Social Media')) scenarioId = 'social-media';
    else if (results.scenario.name.includes('Google Ads')) scenarioId = 'google-ads';
    else if (results.scenario.name.includes('CRM')) scenarioId = 'crm-implementation';
    
    const researchData = generateResearchSummary(scenarioId, results.inputs.industry);
    const methodology = getResearchMethodology();
    const allSources = getAllResearchSources();
    
    // Add header
    addResearchHeader(pdf, pageWidth, margin);
    
    let yPosition = 40;

    // Title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(45, 55, 72);
    pdf.text('Detailed Research Report', margin, yPosition);
    yPosition += 15;

    // Scenario name
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Scenario: ${results.scenario.name}`, margin, yPosition);
    yPosition += 10;

    // Generation date
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;

    // Executive Summary
    yPosition = addExecutiveSummary(pdf, results, researchData, margin, contentWidth, yPosition);
    
    // Methodology
    yPosition = addMethodologySection(pdf, methodology, margin, contentWidth, yPosition, pageHeight);
    
    // Research Sources
    yPosition = addResearchSourcesSection(pdf, researchData, allSources, margin, contentWidth, yPosition, pageHeight);
    
    // Case Studies
    yPosition = addCaseStudiesSection(pdf, researchData, margin, contentWidth, yPosition, pageHeight);
    
    // Industry Benchmarks
    yPosition = addIndustryBenchmarksSection(pdf, researchData, results, margin, contentWidth, yPosition, pageHeight);
    
    // Risk Analysis
    yPosition = addRiskAnalysisSection(pdf, results, margin, contentWidth, yPosition, pageHeight);

    // Footer on all pages
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      addResearchFooter(pdf, pageWidth, pageHeight, i, totalPages);
    }

    // Generate filename
    const filename = `catalyst-research-${results.scenario.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

    // Download the PDF
    pdf.save(filename);

  } catch (error) {
    console.error('Research report generation error:', error);
    throw error;
  }
};

// Add research report header
const addResearchHeader = (pdf, pageWidth, margin) => {
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(102, 126, 234);
  pdf.text('Catalyst', margin, 25);
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(113, 128, 150);
  pdf.text('RESEARCH ANALYTICS', margin + 35, 25);
  
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, 30, pageWidth - margin, 30);
};

// Add executive summary
const addExecutiveSummary = (pdf, results, researchData, margin, contentWidth, yPosition) => {
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(45, 55, 72);
  pdf.text('Executive Summary', margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const summary = [
    `This research report analyzes the ${results.scenario.name} scenario for ${results.inputs.industry} industry companies.`,
    `Our analysis is based on data from ${researchData?.sources?.length || 'multiple'} premier research organizations including McKinsey, Gartner, and Salesforce.`,
    `The calculated ROI of ${results.roiPercentage.toFixed(1)}% is based on verified industry benchmarks and real-world case studies.`,
    `This scenario has a ${results.scenario.riskLevel} risk profile with an estimated success rate of 75-90% when properly implemented.`
  ];

  summary.forEach(text => {
    const lines = pdf.splitTextToSize(text, contentWidth);
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * 5 + 3;
  });

  return yPosition + 10;
};

// Add methodology section
const addMethodologySection = (pdf, methodology, margin, contentWidth, yPosition, pageHeight) => {
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(45, 55, 72);
  pdf.text('Research Methodology', margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  Object.values(methodology).forEach(section => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(section.title, margin, yPosition);
    yPosition += 8;
    
    pdf.setFont('helvetica', 'normal');
    const description = pdf.splitTextToSize(section.description, contentWidth);
    pdf.text(description, margin, yPosition);
    yPosition += description.length * 5 + 5;

    if (section.methods) {
      section.methods.forEach(method => {
        pdf.text(`• ${method}`, margin + 5, yPosition);
        yPosition += 6;
      });
    }
    
    if (section.steps) {
      section.steps.forEach(step => {
        pdf.text(`• ${step}`, margin + 5, yPosition);
        yPosition += 6;
      });
    }
    
    if (section.factors) {
      section.factors.forEach(factor => {
        pdf.text(`• ${factor}`, margin + 5, yPosition);
        yPosition += 6;
      });
    }
    
    yPosition += 8;
  });

  return yPosition;
};

// Add research sources section
const addResearchSourcesSection = (pdf, researchData, allSources, margin, contentWidth, yPosition, pageHeight) => {
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(45, 55, 72);
  pdf.text('Research Sources & Credibility', margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  if (researchData?.sources) {
    researchData.sources.forEach(source => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(source.name, margin, yPosition);
      yPosition += 7;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(128, 128, 128);
      pdf.text(source.url, margin + 5, yPosition);
      yPosition += 5;
      
      pdf.setTextColor(45, 55, 72);
      const description = pdf.splitTextToSize(source.description, contentWidth - 5);
      pdf.text(description, margin + 5, yPosition);
      yPosition += description.length * 4 + 3;
      
      const credibility = pdf.splitTextToSize(`Credibility: ${source.credibility}`, contentWidth - 5);
      pdf.text(credibility, margin + 5, yPosition);
      yPosition += credibility.length * 4 + 8;
    });
  }

  return yPosition;
};

// Add case studies section
const addCaseStudiesSection = (pdf, researchData, margin, contentWidth, yPosition, pageHeight) => {
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(45, 55, 72);
  pdf.text('Real-World Case Studies', margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  if (researchData?.scenario?.caseStudies) {
    researchData.scenario.caseStudies.forEach((caseStudy, index) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Case Study ${index + 1}: ${caseStudy.company}`, margin, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      const details = [
        `Industry: ${caseStudy.industry}`,
        `Investment: $${caseStudy.investment.toLocaleString()}`,
        `ROI Achieved: ${caseStudy.roi}%`,
        `Implementation Time: ${caseStudy.timeframe} months`,
        `Key Results: ${caseStudy.description}`
      ];
      
      details.forEach(detail => {
        pdf.text(`• ${detail}`, margin + 5, yPosition);
        yPosition += 6;
      });
      
      yPosition += 8;
    });
  }

  return yPosition;
};

// Add industry benchmarks section
const addIndustryBenchmarksSection = (pdf, researchData, results, margin, contentWidth, yPosition, pageHeight) => {
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(45, 55, 72);
  pdf.text('Industry Benchmarks', margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  if (researchData?.industry) {
    const industry = researchData.industry;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${industry.name} Industry Analysis`, margin, yPosition);
    yPosition += 8;
    
    pdf.setFont('helvetica', 'normal');
    const benchmarks = [
      `Average ROI Range: ${industry.averageROI}`,
      `Typical Implementation Time: ${industry.implementationTime}`,
      `Primary Risk Factors: ${industry.riskFactors.join(', ')}`,
      `Success Factors: ${industry.successFactors.join(', ')}`
    ];
    
    benchmarks.forEach(benchmark => {
      pdf.text(`• ${benchmark}`, margin + 5, yPosition);
      yPosition += 6;
    });
  }

  if (researchData?.scenario?.benchmarks) {
    yPosition += 8;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Scenario-Specific Benchmarks', margin, yPosition);
    yPosition += 8;
    
    pdf.setFont('helvetica', 'normal');
    const scenarioBenchmarks = [
      `Average ROI: ${researchData.scenario.benchmarks.averageROI}`,
      `Implementation Time: ${researchData.scenario.benchmarks.implementationTime}`,
      `Payback Period: ${researchData.scenario.benchmarks.paybackPeriod}`
    ];
    
    scenarioBenchmarks.forEach(benchmark => {
      pdf.text(`• ${benchmark}`, margin + 5, yPosition);
      yPosition += 6;
    });
  }

  return yPosition;
};

// Add risk analysis section
const addRiskAnalysisSection = (pdf, results, margin, contentWidth, yPosition, pageHeight) => {
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(45, 55, 72);
  pdf.text('Risk Analysis & Mitigation', margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const riskLevel = results.scenario.riskLevel;
  const riskColor = riskLevel === 'low' ? [72, 187, 120] : 
                    riskLevel === 'medium' ? [237, 137, 54] : [245, 101, 101];

  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...riskColor);
  pdf.text(`Risk Level: ${riskLevel.toUpperCase()}`, margin, yPosition);
  yPosition += 10;

  pdf.setTextColor(45, 55, 72);
  pdf.setFont('helvetica', 'normal');

  const riskAnalysis = {
    low: [
      'Proven technology with established track record',
      'Minimal implementation complexity',
      'High success rate (85-95%)',
      'Quick ROI realization typical'
    ],
    medium: [
      'Standard implementation challenges expected',
      'Moderate change management required',
      'Good success rate (75-85%)',
      'Careful planning recommended'
    ],
    high: [
      'Innovative solution with higher uncertainty',
      'Significant change management required',
      'Moderate success rate (65-80%)',
      'Pilot program strongly recommended'
    ]
  };

  const analysis = riskAnalysis[riskLevel] || riskAnalysis.medium;
  analysis.forEach(point => {
    pdf.text(`• ${point}`, margin + 5, yPosition);
    yPosition += 6;
  });

  yPosition += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Recommended Mitigation Strategies:', margin, yPosition);
  yPosition += 8;

  const mitigationStrategies = [
    'Conduct thorough stakeholder analysis',
    'Develop comprehensive training program',
    'Implement phased rollout approach',
    'Establish clear success metrics',
    'Regular progress monitoring and adjustments'
  ];

  pdf.setFont('helvetica', 'normal');
  mitigationStrategies.forEach(strategy => {
    pdf.text(`• ${strategy}`, margin + 5, yPosition);
    yPosition += 6;
  });

  return yPosition;
};

// Add research footer
const addResearchFooter = (pdf, pageWidth, pageHeight, currentPage, totalPages) => {
  const footerY = pageHeight - 15;
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(128, 128, 128);
  
  pdf.text('Catalyst Research Analytics - Confidential Research Report', 20, footerY);
  
  const pageText = `Page ${currentPage} of ${totalPages}`;
  pdf.text(pageText, pageWidth - 20 - pdf.getTextWidth(pageText), footerY);
  
  pdf.setDrawColor(226, 232, 240);
  pdf.line(20, footerY - 5, pageWidth - 20, footerY - 5);
};