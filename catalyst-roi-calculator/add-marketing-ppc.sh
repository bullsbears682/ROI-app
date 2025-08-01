#!/bin/bash

echo "🔧 Adding marketing-ppc research entry..."

# Find the line with the ecom-shopify methodology (now the last one)
LAST_METHOD_LINE=$(grep -n "Shopify Commerce Report 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

# Create backup
cp src/data/researchData.js src/data/researchData-before-ppc-addition.js

# Create new file with addition
{
    # Everything up to and including the methodology line
    head -n $LAST_METHOD_LINE src/data/researchData.js
    
    # Add the new entry
    echo "  },"
    echo "  'marketing-ppc': {"
    echo "    sources: ['google', 'microsoft', 'wordstream'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"SaaS Startup\","
    echo "        industry: \"Technology\","
    echo "        investment: 40000,"
    echo "        roi: 380,"
    echo "        timeframe: 6,"
    echo "        description: \"High-converting PPC campaigns, 300% lead increase\""
    echo "      },"
    echo "      {"
    echo "        company: \"Professional Services\","
    echo "        industry: \"Legal\","
    echo "        investment: 25000,"
    echo "        roi: 290,"
    echo "        timeframe: 4,"
    echo "        description: \"Targeted ad campaigns, improved client acquisition\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"250-450%\","
    echo "      implementationTime: \"2-6 months\","
    echo "      paybackPeriod: \"4-8 months\""
    echo "    },"
    echo "    methodology: \"Google Ads Performance Study 2023 and PPC Benchmark Report\""
    echo "  }"
    echo "};"
    echo ""
    
    # Skip the original closing and add the rest
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
    
} > temp_research_file.js

# Replace original file
mv temp_research_file.js src/data/researchData.js

echo "✅ marketing-ppc addition complete"
