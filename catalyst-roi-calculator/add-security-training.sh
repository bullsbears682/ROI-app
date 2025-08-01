#!/bin/bash

echo "🔧 Adding security-training research entry..."

LAST_METHOD_LINE=$(grep -n "SaaS Platform Migration Study 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

cp src/data/researchData.js src/data/researchData-before-sectraining-addition.js

{
    head -n $LAST_METHOD_LINE src/data/researchData.js
    echo "  },"
    echo "  'security-training': {"
    echo "    sources: ['sans', 'isaca', 'cybersecurity'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Financial Services Company\","
    echo "        industry: \"Financial Services\","
    echo "        investment: 45000,"
    echo "        roi: 380,"
    echo "        timeframe: 8,"
    echo "        description: \"Cybersecurity awareness training, 75% reduction in security incidents\""
    echo "      },"
    echo "      {"
    echo "        company: \"Healthcare Network\","
    echo "        industry: \"Healthcare\","
    echo "        investment: 35000,"
    echo "        roi: 420,"
    echo "        timeframe: 6,"
    echo "        description: \"HIPAA compliance training, improved data protection and reduced violations\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"300-500%\","
    echo "      implementationTime: \"3-8 months\","
    echo "      paybackPeriod: \"6-12 months\""
    echo "    },"
    echo "    methodology: \"Cybersecurity Training ROI Study 2023 and Security Awareness Effectiveness Report\""
    echo "  }"
    echo "};"
    echo ""
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
} > temp_research_file.js

mv temp_research_file.js src/data/researchData.js
echo "✅ security-training addition complete"
