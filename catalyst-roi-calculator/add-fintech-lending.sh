#!/bin/bash

echo "🔧 Adding fintech-lending research entry (FINAL SCENARIO!)..."

LAST_METHOD_LINE=$(grep -n "Business Intelligence Platform ROI Study 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

cp src/data/researchData.js src/data/researchData-before-fintech-addition.js

{
    head -n $LAST_METHOD_LINE src/data/researchData.js
    echo "  },"
    echo "  'fintech-lending': {"
    echo "    sources: ['plaid', 'stripe', 'lending'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Community Bank\","
    echo "        industry: \"Banking\","
    echo "        investment: 180000,"
    echo "        roi: 320,"
    echo "        timeframe: 12,"
    echo "        description: \"Digital lending platform, 50% faster loan processing and reduced operational costs\""
    echo "      },"
    echo "      {"
    echo "        company: \"Credit Union\","
    echo "        industry: \"Financial Services\","
    echo "        investment: 220000,"
    echo "        roi: 280,"
    echo "        timeframe: 15,"
    echo "        description: \"Automated underwriting system, improved risk assessment and customer experience\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"250-400%\","
    echo "      implementationTime: \"8-18 months\","
    echo "      paybackPeriod: \"10-20 months\""
    echo "    },"
    echo "    methodology: \"Digital Lending Platform ROI Study 2023 and FinTech Implementation Analysis\""
    echo "  }"
    echo "};"
    echo ""
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
} > temp_research_file.js

mv temp_research_file.js src/data/researchData.js
echo "✅ fintech-lending addition complete - ALL SCENARIOS ADDED!"
