import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Generate and download PDF report
export const exportToPDF = async (results, chartElement) => {
  try {
    // Create new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Document settings
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Add header
    addHeader(pdf, pageWidth, margin);
    
    let yPosition = 40; // Start below header

    // Add title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ROI Analysis Report', margin, yPosition);
    yPosition += 15;

    // Add scenario name
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(results.scenario.name, margin, yPosition);
    yPosition += 10;

    // Add generation date
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;

    // Add key metrics section
    yPosition = addKeyMetrics(pdf, results, margin, contentWidth, yPosition);
    
    // Add investment breakdown
    yPosition = addInvestmentBreakdown(pdf, results, margin, contentWidth, yPosition);
    
    // Add scenario details
    yPosition = addScenarioDetails(pdf, results, margin, contentWidth, yPosition);

    // Check if we need a new page for charts
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = margin;
    }

    // Add charts if element is provided
    if (chartElement) {
      await addCharts(pdf, chartElement, margin, contentWidth, yPosition);
    }

    // Add footer
    addFooter(pdf, pageWidth, pageHeight);

    // Generate filename
    const filename = `catalyst-roi-analysis-${results.scenario.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

    // Download the PDF
    pdf.save(filename);

  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

// Add header with logo and company info
const addHeader = (pdf, pageWidth, margin) => {
  // Add logo text (since we can't easily embed SVG)
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(102, 126, 234); // Brand color
  pdf.text('Catalyst', margin, 25);
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(113, 128, 150);
  pdf.text('ROI ANALYTICS', margin + 35, 25);
  
  // Add line separator
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, 30, pageWidth - margin, 30);
};

// Add key metrics section
const addKeyMetrics = (pdf, results, margin, contentWidth, yPosition) => {
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(45, 55, 72);
  pdf.text('Key Metrics', margin, yPosition);
  yPosition += 10;

  // Format numbers
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Metrics data
  const metrics = [
    { label: 'Total ROI', value: formatPercent(results.roiPercentage) },
    { label: 'Net Profit', value: formatCurrency(results.netProfit) },
    { label: 'Payback Period', value: `${results.paybackPeriod.toFixed(1)} months` },
    { label: 'Annualized ROI', value: formatPercent(results.annualizedROI) }
  ];

  // Add metrics in a grid
  const metricsPerRow = 2;
  const metricWidth = contentWidth / metricsPerRow;
  
  pdf.setFontSize(10);
  
  metrics.forEach((metric, index) => {
    const row = Math.floor(index / metricsPerRow);
    const col = index % metricsPerRow;
    const x = margin + (col * metricWidth);
    const y = yPosition + (row * 20);
    
    // Add metric box
    pdf.setDrawColor(226, 232, 240);
    pdf.rect(x, y - 5, metricWidth - 5, 15);
    
    // Add label
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(74, 85, 104);
    pdf.text(metric.label, x + 3, y);
    
    // Add value
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(45, 55, 72);
    pdf.text(metric.value, x + 3, y + 7);
  });

  return yPosition + 50;
};

// Add investment breakdown section
const addInvestmentBreakdown = (pdf, results, margin, contentWidth, yPosition) => {
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(45, 55, 72);
  pdf.text('Investment Breakdown', margin, yPosition);
  yPosition += 15;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const items = [
    { label: 'Initial Investment', value: formatCurrency(results.investment) },
    { label: 'Expected Returns', value: formatCurrency(results.expectedReturns) },
    { label: 'Total Value', value: formatCurrency(results.totalReturns), isTotal: true }
  ];

  pdf.setFontSize(10);
  
  items.forEach((item, index) => {
    const y = yPosition + (index * 8);
    
    if (item.isTotal) {
      pdf.setDrawColor(102, 126, 234);
      pdf.line(margin, y - 2, margin + contentWidth, y - 2);
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    
    pdf.setTextColor(45, 55, 72);
    pdf.text(item.label, margin, y);
    pdf.text(item.value, margin + contentWidth - pdf.getTextWidth(item.value), y);
  });

  return yPosition + 35;
};

// Add scenario details section
const addScenarioDetails = (pdf, results, margin, contentWidth, yPosition) => {
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(45, 55, 72);
  pdf.text('Scenario Details', margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // Description
  const description = results.scenario.description;
  const splitDescription = pdf.splitTextToSize(description, contentWidth);
  pdf.text(splitDescription, margin, yPosition);
  yPosition += splitDescription.length * 5 + 10;

  // Details
  const details = [
    { label: 'Risk Level', value: results.scenario.riskLevel.charAt(0).toUpperCase() + results.scenario.riskLevel.slice(1) },
    { label: 'Industry', value: results.inputs.industry },
    { label: 'Company Size', value: results.inputs.companySize },
    { label: 'Timeframe', value: `${results.inputs.timeframe} months` }
  ];

  details.forEach((detail, index) => {
    const y = yPosition + (index * 8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${detail.label}:`, margin, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(detail.value, margin + 40, y);
  });

  return yPosition + 40;
};

// Add charts section
const addCharts = async (pdf, chartElement, margin, contentWidth, yPosition) => {
  try {
    // Find chart canvases
    const chartCanvases = chartElement.querySelectorAll('canvas');
    
    if (chartCanvases.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(45, 55, 72);
      pdf.text('Charts & Analysis', margin, yPosition);
      yPosition += 15;

      for (let i = 0; i < Math.min(chartCanvases.length, 2); i++) {
        const canvas = chartCanvases[i];
        
        // Convert canvas to image
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate dimensions
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height / canvas.width) * imgWidth;
        
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
        
        // Add page break if needed
        if (i < chartCanvases.length - 1 && yPosition > 200) {
          pdf.addPage();
          yPosition = margin;
        }
      }
    }
  } catch (error) {
    console.error('Error adding charts to PDF:', error);
  }
};

// Add footer
const addFooter = (pdf, pageWidth, pageHeight) => {
  const footerY = pageHeight - 15;
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(128, 128, 128);
  
  // Left side - powered by
  pdf.text('Generated by Catalyst ROI Analytics', 20, footerY);
  
  // Right side - page number
  const pageNum = `Page ${pdf.internal.getNumberOfPages()}`;
  pdf.text(pageNum, pageWidth - 20 - pdf.getTextWidth(pageNum), footerY);
  
  // Footer line
  pdf.setDrawColor(226, 232, 240);
  pdf.line(20, footerY - 5, pageWidth - 20, footerY - 5);
};