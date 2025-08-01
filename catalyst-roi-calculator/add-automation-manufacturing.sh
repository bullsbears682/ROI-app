#!/bin/bash

echo "🔧 Adding automation-manufacturing research entry..."

LAST_METHOD_LINE=$(grep -n "Cybersecurity Training ROI Study 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

cp src/data/researchData.js src/data/researchData-before-automfg-addition.js

{
    head -n $LAST_METHOD_LINE src/data/researchData.js
    echo "  },"
    echo "  'automation-manufacturing': {"
    echo "    sources: ['siemens', 'rockwell', 'schneider'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Automotive Manufacturer\","
    echo "        industry: \"Automotive\","
    echo "        investment: 350000,"
    echo "        roi: 320,"
    echo "        timeframe: 18,"
    echo "        description: \"Robotic assembly line, 40% productivity increase and quality improvement\""
    echo "      },"
    echo "      {"
    echo "        company: \"Electronics Producer\","
    echo "        industry: \"Electronics\","
    echo "        investment: 280000,"
    echo "        roi: 380,"
    echo "        timeframe: 15,"
    echo "        description: \"Automated quality control and packaging, reduced defects and labor costs\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"250-450%\","
    echo "      implementationTime: \"12-24 months\","
    echo "      paybackPeriod: \"15-30 months\""
    echo "    },"
    echo "    methodology: \"Manufacturing Automation ROI Study 2023 and Industrial IoT Performance Report\""
    echo "  }"
    echo "};"
    echo ""
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
} > temp_research_file.js

mv temp_research_file.js src/data/researchData.js
echo "✅ automation-manufacturing addition complete"
