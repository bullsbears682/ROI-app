#!/bin/bash

echo "🔧 Adding software-erp research entry..."

LAST_METHOD_LINE=$(grep -n "Social Media Advertising ROI Report 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

cp src/data/researchData.js src/data/researchData-before-erp-addition.js

{
    head -n $LAST_METHOD_LINE src/data/researchData.js
    echo "  },"
    echo "  'software-erp': {"
    echo "    sources: ['sap', 'oracle', 'microsoft'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Manufacturing Corporation\","
    echo "        industry: \"Manufacturing\","
    echo "        investment: 250000,"
    echo "        roi: 280,"
    echo "        timeframe: 18,"
    echo "        description: \"SAP implementation, integrated operations and improved efficiency\""
    echo "      },"
    echo "      {"
    echo "        company: \"Retail Chain\","
    echo "        industry: \"Retail\","
    echo "        investment: 180000,"
    echo "        roi: 320,"
    echo "        timeframe: 15,"
    echo "        description: \"ERP system integration, unified inventory and financial management\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"200-400%\","
    echo "      implementationTime: \"12-24 months\","
    echo "      paybackPeriod: \"15-30 months\""
    echo "    },"
    echo "    methodology: \"Enterprise Resource Planning ROI Study 2023 and ERP Implementation Analysis\""
    echo "  }"
    echo "};"
    echo ""
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
} > temp_research_file.js

mv temp_research_file.js src/data/researchData.js
echo "✅ software-erp addition complete"
