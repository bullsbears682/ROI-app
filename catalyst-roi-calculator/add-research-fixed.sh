#!/bin/bash

echo "🔧 Adding ecom-shopify research entry (fixed approach)..."

# Find the line number where scenarioResearch ends (before industryBenchmarks)
INDUSTRY_START=$(grep -n "export const industryBenchmarks" src/data/researchData.js | cut -d: -f1)
RESEARCH_END=$((INDUSTRY_START - 2))  # Two lines before (accounting for blank line)

echo "Found scenarioResearch ending at line: $RESEARCH_END"

# Create backup
cp src/data/researchData.js src/data/researchData-before-fixed-addition.js

# Create new file with addition
{
    # Everything before the last entry's closing brace
    head -n $((RESEARCH_END-1)) src/data/researchData.js
    
    # Add the comma and new entry
    echo "  },"
    echo "  'ecom-shopify': {"
    echo "    sources: ['salesforce', 'forrester', 'deloitte'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Fashion Retailer\","
    echo "        industry: \"Retail\","
    echo "        investment: 45000,"
    echo "        roi: 320,"
    echo "        timeframe: 8,"
    echo "        description: \"40% increase in online sales, improved customer experience\""
    echo "      },"
    echo "      {"
    echo "        company: \"Artisan Marketplace\","
    echo "        industry: \"Handmade Goods\","
    echo "        investment: 28000,"
    echo "        roi: 380,"
    echo "        timeframe: 6,"
    echo "        description: \"Built complete online presence, 300% revenue growth\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"200-450%\","
    echo "      implementationTime: \"4-12 months\","
    echo "      paybackPeriod: \"6-15 months\""
    echo "    },"
    echo "    methodology: \"Shopify Commerce Report 2023 and eCommerce Platform ROI Analysis\""
    echo "  }"
    echo "};"
    
    # Everything from industryBenchmarks onwards
    tail -n +$INDUSTRY_START src/data/researchData.js
    
} > temp_research_file.js

# Replace original file
mv temp_research_file.js src/data/researchData.js

echo "✅ Addition complete - added before line $INDUSTRY_START"
