#!/bin/bash

echo "🔧 Adding ecom-shopify research entry (final approach)..."

# Find the line with the sustainability-reporting methodology
LAST_METHOD_LINE=$(grep -n "GRI Sustainability Reporting Study 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

# Create backup
cp src/data/researchData.js src/data/researchData-before-final-addition.js

# Create new file with addition
{
    # Everything up to and including the methodology line
    head -n $LAST_METHOD_LINE src/data/researchData.js
    
    # Add the new entry (replacing the closing of previous entry)
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
    echo ""
    
    # Skip the original closing and add the rest
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
    
} > temp_research_file.js

# Replace original file
mv temp_research_file.js src/data/researchData.js

echo "✅ Addition complete"
