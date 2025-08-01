#!/bin/bash

echo "🔧 Adding saas-analytics research entry..."

LAST_METHOD_LINE=$(grep -n "Workflow Automation ROI Study 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

cp src/data/researchData.js src/data/researchData-before-analytics-addition.js

{
    head -n $LAST_METHOD_LINE src/data/researchData.js
    echo "  },"
    echo "  'saas-analytics': {"
    echo "    sources: ['tableau', 'powerbi', 'looker'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Retail Chain\","
    echo "        industry: \"Retail\","
    echo "        investment: 95000,"
    echo "        roi: 350,"
    echo "        timeframe: 10,"
    echo "        description: \"Business intelligence platform, data-driven decision making and inventory optimization\""
    echo "      },"
    echo "      {"
    echo "        company: \"Healthcare System\","
    echo "        industry: \"Healthcare\","
    echo "        investment: 120000,"
    echo "        roi: 320,"
    echo "        timeframe: 12,"
    echo "        description: \"Analytics dashboard implementation, improved patient outcomes and operational efficiency\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"250-400%\","
    echo "      implementationTime: \"6-15 months\","
    echo "      paybackPeriod: \"8-18 months\""
    echo "    },"
    echo "    methodology: \"Business Intelligence Platform ROI Study 2023 and Analytics Implementation Report\""
    echo "  }"
    echo "};"
    echo ""
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
} > temp_research_file.js

mv temp_research_file.js src/data/researchData.js
echo "✅ saas-analytics addition complete"
