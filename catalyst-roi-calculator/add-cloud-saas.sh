#!/bin/bash

echo "🔧 Adding cloud-saas research entry..."

LAST_METHOD_LINE=$(grep -n "Enterprise Resource Planning ROI Study 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

cp src/data/researchData.js src/data/researchData-before-cloudaas-addition.js

{
    head -n $LAST_METHOD_LINE src/data/researchData.js
    echo "  },"
    echo "  'cloud-saas': {"
    echo "    sources: ['gartner', 'forrester', 'idc'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Professional Services Firm\","
    echo "        industry: \"Professional Services\","
    echo "        investment: 85000,"
    echo "        roi: 360,"
    echo "        timeframe: 10,"
    echo "        description: \"Office 365 and cloud platform migration, improved collaboration and mobility\""
    echo "      },"
    echo "      {"
    echo "        company: \"Healthcare Provider\","
    echo "        industry: \"Healthcare\","
    echo "        investment: 120000,"
    echo "        roi: 310,"
    echo "        timeframe: 12,"
    echo "        description: \"EMR and cloud infrastructure migration, enhanced data security and access\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"250-400%\","
    echo "      implementationTime: \"6-15 months\","
    echo "      paybackPeriod: \"8-18 months\""
    echo "    },"
    echo "    methodology: \"SaaS Platform Migration Study 2023 and Cloud ROI Benchmark Report\""
    echo "  }"
    echo "};"
    echo ""
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
} > temp_research_file.js

mv temp_research_file.js src/data/researchData.js
echo "✅ cloud-saas addition complete"
