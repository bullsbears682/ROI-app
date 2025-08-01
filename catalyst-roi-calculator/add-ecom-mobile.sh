#!/bin/bash

echo "🔧 Adding ecom-mobile research entry..."

LAST_METHOD_LINE=$(grep -n "B2B eCommerce Platform Study 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

cp src/data/researchData.js src/data/researchData-before-mobile-addition.js

{
    head -n $LAST_METHOD_LINE src/data/researchData.js
    echo "  },"
    echo "  'ecom-mobile': {"
    echo "    sources: ['appannie', 'flurry', 'adjust'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Fashion Retailer\","
    echo "        industry: \"Fashion\","
    echo "        investment: 120000,"
    echo "        roi: 380,"
    echo "        timeframe: 10,"
    echo "        description: \"Mobile app launch, 60% of sales now mobile, improved customer engagement\""
    echo "      },"
    echo "      {"
    echo "        company: \"Food Delivery Service\","
    echo "        industry: \"Food Service\","
    echo "        investment: 150000,"
    echo "        roi: 450,"
    echo "        timeframe: 8,"
    echo "        description: \"Native mobile app, streamlined ordering and delivery tracking\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"300-500%\","
    echo "      implementationTime: \"6-12 months\","
    echo "      paybackPeriod: \"8-15 months\""
    echo "    },"
    echo "    methodology: \"Mobile Commerce Performance Study 2023 and App Store Economics Report\""
    echo "  }"
    echo "};"
    echo ""
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
} > temp_research_file.js

mv temp_research_file.js src/data/researchData.js
echo "✅ ecom-mobile addition complete"
