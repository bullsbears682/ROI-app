import fs from 'fs';

const newScenario = {
  'ecom-shopify': {
    sources: ['salesforce', 'forrester', 'deloitte'],
    caseStudies: [
      {
        company: "Fashion Retailer",
        industry: "Retail",
        investment: 45000,
        roi: 320,
        timeframe: 8,
        description: "40% increase in online sales, improved customer experience"
      },
      {
        company: "Artisan Marketplace", 
        industry: "Handmade Goods",
        investment: 28000,
        roi: 380,
        timeframe: 6,
        description: "Built complete online presence, 300% revenue growth"
      }
    ],
    benchmarks: {
      averageROI: "200-450%",
      implementationTime: "4-12 months",
      paybackPeriod: "6-15 months"
    },
    methodology: "Shopify Commerce Report 2023 and eCommerce Platform ROI Analysis"
  }
};

console.log('🔧 Adding ecom-shopify scenario...');

try {
  // Read the current file
  const content = fs.readFileSync('./src/data/researchData.js', 'utf8');
  
  // Find the insertion point (before the last }; that closes scenarioResearch)
  const insertionPoint = content.lastIndexOf('};', content.indexOf('export const industryBenchmarks'));
  
  if (insertionPoint === -1) {
    throw new Error('Could not find insertion point');
  }
  
  // Create the new entry text
  const newEntryText = `,
  'ecom-shopify': {
    sources: ['salesforce', 'forrester', 'deloitte'],
    caseStudies: [
      {
        company: "Fashion Retailer",
        industry: "Retail",
        investment: 45000,
        roi: 320,
        timeframe: 8,
        description: "40% increase in online sales, improved customer experience"
      },
      {
        company: "Artisan Marketplace",
        industry: "Handmade Goods",
        investment: 28000,
        roi: 380,
        timeframe: 6,
        description: "Built complete online presence, 300% revenue growth"
      }
    ],
    benchmarks: {
      averageROI: "200-450%",
      implementationTime: "4-12 months",
      paybackPeriod: "6-15 months"
    },
    methodology: "Shopify Commerce Report 2023 and eCommerce Platform ROI Analysis"
  }`;

  // Insert the new entry
  const beforeInsertion = content.substring(0, insertionPoint);
  const afterInsertion = content.substring(insertionPoint);
  
  const newContent = beforeInsertion + newEntryText + '\n' + afterInsertion;
  
  // Write the updated content
  fs.writeFileSync('./src/data/researchData.js', newContent);
  
  console.log('✅ Successfully added ecom-shopify scenario');
  console.log('📍 Insertion point found at character:', insertionPoint);
  
} catch (error) {
  console.error('❌ Error adding scenario:', error.message);
}