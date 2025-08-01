#!/bin/bash

echo "🔧 Adding ecom-marketplace research entry..."

# Find the line with the security-software methodology (now the last one)
LAST_METHOD_LINE=$(grep -n "Enterprise Security Software ROI Study 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

# Create backup
cp src/data/researchData.js src/data/researchData-before-marketplace-addition.js

# Create new file with addition
{
    # Everything up to and including the methodology line
    head -n $LAST_METHOD_LINE src/data/researchData.js
    
    # Add the new entry
    echo "  },"
    echo "  'ecom-marketplace': {"
    echo "    sources: ['amazon', 'shopify', 'bigcommerce'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Consumer Goods Brand\","
    echo "        industry: \"Retail\","
    echo "        investment: 35000,"
    echo "        roi: 420,"
    echo "        timeframe: 6,"
    echo "        description: \"Amazon marketplace integration, 350% increase in online sales reach\""
    echo "      },"
    echo "      {"
    echo "        company: \"Electronics Distributor\","
    echo "        industry: \"Electronics\","
    echo "        investment: 50000,"
    echo "        roi: 380,"
    echo "        timeframe: 8,"
    echo "        description: \"Multi-marketplace presence, expanded customer base and inventory management\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"300-500%\","
    echo "      implementationTime: \"4-8 months\","
    echo "      paybackPeriod: \"5-10 months\""
    echo "    },"
    echo "    methodology: \"Amazon Marketplace Performance Report 2023 and Multi-Channel eCommerce Study\""
    echo "  }"
    echo "};"
    echo ""
    
    # Skip the original closing and add the rest
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
    
} > temp_research_file.js

# Replace original file
mv temp_research_file.js src/data/researchData.js

echo "✅ ecom-marketplace addition complete"
