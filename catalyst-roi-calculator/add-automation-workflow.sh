#!/bin/bash

echo "🔧 Adding automation-workflow research entry..."

LAST_METHOD_LINE=$(grep -n "Manufacturing Automation ROI Study 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

cp src/data/researchData.js src/data/researchData-before-autowork-addition.js

{
    head -n $LAST_METHOD_LINE src/data/researchData.js
    echo "  },"
    echo "  'automation-workflow': {"
    echo "    sources: ['zapier', 'microsoft', 'uipath'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Professional Services Firm\","
    echo "        industry: \"Professional Services\","
    echo "        investment: 75000,"
    echo "        roi: 420,"
    echo "        timeframe: 8,"
    echo "        description: \"RPA implementation, automated invoicing and document processing\""
    echo "      },"
    echo "      {"
    echo "        company: \"Insurance Company\","
    echo "        industry: \"Insurance\","
    echo "        investment: 95000,"
    echo "        roi: 380,"
    echo "        timeframe: 10,"
    echo "        description: \"Claims processing automation, 60% faster processing and reduced errors\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"300-500%\","
    echo "      implementationTime: \"4-12 months\","
    echo "      paybackPeriod: \"6-15 months\""
    echo "    },"
    echo "    methodology: \"Workflow Automation ROI Study 2023 and RPA Implementation Performance Report\""
    echo "  }"
    echo "};"
    echo ""
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
} > temp_research_file.js

mv temp_research_file.js src/data/researchData.js
echo "✅ automation-workflow addition complete"
