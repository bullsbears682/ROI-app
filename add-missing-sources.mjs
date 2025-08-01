#!/usr/bin/env node

// Find all unique source IDs used in research entries
import { scenarioResearch, researchSources } from './src/data/researchData.js';

console.log('🔍 FINDING MISSING SOURCES');

const usedSources = new Set();
const existingSources = new Set(Object.keys(researchSources));

// Collect all source IDs used in research
for (const research of Object.values(scenarioResearch)) {
  if (research.sources) {
    research.sources.forEach(source => usedSources.add(source));
  }
}

console.log('📊 ANALYSIS:');
console.log(`Used sources: ${usedSources.size}`);
console.log(`Existing sources: ${existingSources.size}`);

const missingSources = [...usedSources].filter(source => !existingSources.has(source));
console.log(`Missing sources: ${missingSources.length}`);

if (missingSources.length > 0) {
  console.log('\n❌ MISSING SOURCES:');
  missingSources.forEach(source => console.log(`  - ${source}`));
  
  console.log('\n📝 GENERATED SOURCE DEFINITIONS:');
  console.log('const newSources = {');
  
  missingSources.forEach(source => {
    // Generate appropriate source definitions
    let name, type, focus;
    
    switch(source) {
      case 'amazon':
        name = 'Amazon Web Services'; type = 'Cloud Platform'; focus = 'Cloud computing, marketplace solutions, enterprise services';
        break;
      case 'shopify':
        name = 'Shopify Plus'; type = 'eCommerce Platform'; focus = 'Online commerce, retail technology, merchant solutions';
        break;
      case 'bigcommerce':
        name = 'BigCommerce'; type = 'eCommerce Platform'; focus = 'Enterprise eCommerce, B2B commerce, omnichannel retail';
        break;
      case 'appannie':
        name = 'App Annie (data.ai)'; type = 'Mobile Analytics'; focus = 'Mobile app performance, market intelligence, app store optimization';
        break;
      case 'flurry':
        name = 'Flurry Analytics'; type = 'Mobile Analytics'; focus = 'Mobile app analytics, user behavior, engagement metrics';
        break;
      case 'adjust':
        name = 'Adjust'; type = 'Mobile Marketing'; focus = 'Mobile attribution, fraud prevention, marketing analytics';
        break;
      case 'facebook':
        name = 'Meta Business'; type = 'Social Media Platform'; focus = 'Social media advertising, audience insights, digital marketing';
        break;
      case 'instagram':
        name = 'Instagram Business'; type = 'Social Media Platform'; focus = 'Visual marketing, influencer commerce, brand engagement';
        break;
      case 'linkedin':
        name = 'LinkedIn Marketing Solutions'; type = 'Professional Network'; focus = 'B2B marketing, professional networking, lead generation';
        break;
      case 'google':
        name = 'Google Ads'; type = 'Digital Advertising'; focus = 'Search marketing, display advertising, performance marketing';
        break;
      case 'microsoft':
        name = 'Microsoft Research'; type = 'Technology Company'; focus = 'Enterprise software, cloud solutions, productivity tools';
        break;
      case 'wordstream':
        name = 'WordStream'; type = 'Digital Marketing'; focus = 'PPC advertising, search marketing, conversion optimization';
        break;
      case 'hubspot':
        name = 'HubSpot Research'; type = 'Marketing Platform'; focus = 'Inbound marketing, sales enablement, customer success';
        break;
      case 'pipedrive':
        name = 'Pipedrive'; type = 'CRM Platform'; focus = 'Sales pipeline management, CRM optimization, sales productivity';
        break;
      case 'sap':
        name = 'SAP'; type = 'Enterprise Software'; focus = 'ERP systems, business applications, digital transformation';
        break;
      case 'oracle':
        name = 'Oracle Corporation'; type = 'Enterprise Software'; focus = 'Database systems, cloud applications, enterprise solutions';
        break;
      case 'aws':
        name = 'Amazon Web Services'; type = 'Cloud Platform'; focus = 'Cloud infrastructure, enterprise migration, scalability solutions';
        break;
      case 'idc':
        name = 'International Data Corporation'; type = 'Market Research'; focus = 'IT market analysis, technology forecasting, digital transformation';
        break;
      case 'symantec':
        name = 'NortonLifeLock (Symantec)'; type = 'Cybersecurity'; focus = 'Enterprise security, threat protection, data security';
        break;
      case 'mcafee':
        name = 'McAfee'; type = 'Cybersecurity'; focus = 'Endpoint security, threat intelligence, security solutions';
        break;
      case 'crowdstrike':
        name = 'CrowdStrike'; type = 'Cybersecurity'; focus = 'Cloud security, threat hunting, incident response';
        break;
      case 'sans':
        name = 'SANS Institute'; type = 'Security Education'; focus = 'Cybersecurity training, security research, best practices';
        break;
      case 'isaca':
        name = 'ISACA'; type = 'Professional Association'; focus = 'IT governance, risk management, cybersecurity standards';
        break;
      case 'cybersecurity':
        name = 'Cybersecurity & Infrastructure Security Agency'; type = 'Government Agency'; focus = 'National cybersecurity, threat intelligence, security guidance';
        break;
      case 'siemens':
        name = 'Siemens Digital Industries'; type = 'Industrial Technology'; focus = 'Manufacturing automation, industrial IoT, digitalization';
        break;
      case 'rockwell':
        name = 'Rockwell Automation'; type = 'Industrial Automation'; focus = 'Manufacturing systems, process automation, industrial analytics';
        break;
      case 'schneider':
        name = 'Schneider Electric'; type = 'Energy Management'; focus = 'Industrial automation, energy efficiency, digital transformation';
        break;
      case 'zapier':
        name = 'Zapier'; type = 'Automation Platform'; focus = 'Workflow automation, app integration, productivity tools';
        break;
      case 'uipath':
        name = 'UiPath'; type = 'RPA Platform'; focus = 'Robotic process automation, enterprise automation, AI-powered workflows';
        break;
      case 'tableau':
        name = 'Tableau'; type = 'Analytics Platform'; focus = 'Data visualization, business intelligence, self-service analytics';
        break;
      case 'powerbi':
        name = 'Microsoft Power BI'; type = 'Business Intelligence'; focus = 'Data analytics, reporting, business intelligence dashboards';
        break;
      case 'looker':
        name = 'Google Cloud Looker'; type = 'Data Platform'; focus = 'Modern BI, data modeling, embedded analytics';
        break;
      case 'plaid':
        name = 'Plaid'; type = 'FinTech Infrastructure'; focus = 'Financial data connectivity, banking APIs, payment solutions';
        break;
      case 'stripe':
        name = 'Stripe'; type = 'Payment Platform'; focus = 'Online payments, financial infrastructure, commerce enablement';
        break;
      case 'lending':
        name = 'Lending Club'; type = 'Digital Lending'; focus = 'Peer-to-peer lending, credit solutions, financial innovation';
        break;
      case 'magento':
        name = 'Adobe Commerce (Magento)'; type = 'eCommerce Platform'; focus = 'B2B commerce, enterprise eCommerce, omnichannel experiences';
        break;
      case 'eia':
        name = 'U.S. Energy Information Administration'; type = 'Government Agency'; focus = 'Energy data, market analysis, energy economics';
        break;
      case 'iea':
        name = 'International Energy Agency'; type = 'International Organization'; focus = 'Global energy policy, renewable energy, energy transition';
        break;
      case 'irena':
        name = 'International Renewable Energy Agency'; type = 'International Organization'; focus = 'Renewable energy deployment, energy transition, sustainable development';
        break;
      default:
        name = source.charAt(0).toUpperCase() + source.slice(1); type = 'Research Organization'; focus = 'Industry analysis and market research';
    }
    
    console.log(`  ${source}: {`);
    console.log(`    name: "${name}",`);
    console.log(`    type: "${type}",`);
    console.log(`    credibility: "High",`);
    console.log(`    focus: "${focus}"`);
    console.log(`  },`);
  });
  
  console.log('};');
} else {
  console.log('✅ All sources are already defined!');
}
